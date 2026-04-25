import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Image as ImageIcon, X, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { generateAIResponse } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

interface ChatWithAIProps {
  initialQuestion?: string;
}

const suggestedQuestions = [
  "How do I improve soil fertility naturally?",
  "What are signs of nitrogen deficiency in wheat?",
  "Best time to plant tomatoes in India?",
  "How to control aphids organically?",
];

function formatMessage(text: string) {
  // Basic markdown-like formatting
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/^#{1,3}\s(.+)$/gm, '<h3>$1</h3>')
    .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$(?!<\/?(ul|li|h3|p))/gm, '<p>$1</p>');
}

export default function ChatWithAI({ initialQuestion }: ChatWithAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Hello! I'm your **MyAgriAI** assistant powered by Groq. I can help you with:\n\n- Crop disease identification\n- Fertilizer recommendations\n- Pest management strategies\n- Weather-based farming advice\n- Market insights\n\nWhat farming challenge can I help you solve today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialQuestion) {
      setInput(initialQuestion);
      setTimeout(() => handleSend(initialQuestion), 500);
    }
  }, [initialQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (overrideInput?: string) => {
    const messageToSend = overrideInput || input;
    if (!messageToSend.trim() && !selectedImage) return;

    const userMessage: Message = {
      role: 'user',
      content: messageToSend,
      timestamp: new Date(),
      imageUrl: imagePreview || undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const imgToSend = selectedImage;
    setSelectedImage(null);
    setImagePreview(null);

    try {
      const response = await generateAIResponse({
        prompt: messageToSend || 'Analyze this farming image and provide insights.',
        image: imgToSend,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: response, timestamp: new Date() },
      ]);
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: 'Failed to reach AI. Please check your API key in .env file.',
        variant: 'destructive',
      });
      console.error('AI response error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        role: 'ai',
        content: "Chat cleared! I'm ready to help with your farming questions.",
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Max 5MB image size', variant: 'destructive' });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full max-w-4xl flex flex-col" style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}>
      {/* Chat Header */}
      <div className="glass-card rounded-t-2xl px-5 py-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md animate-pulse-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm">MyAgriAI Assistant</div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">Powered by Groq • Online</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClear} className="w-8 h-8 rounded-lg hover:bg-destructive/10 hover:text-destructive" title="Clear chat">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="glass-card rounded-none flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {/* Suggested questions when empty */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-left text-xs px-3 py-2.5 rounded-xl border border-border/60 bg-secondary/50 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence>
          {messages.map((message, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn('flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {message.role === 'ai' && (
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}

              <div className={cn('max-w-[80%] group')}>
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                    message.role === 'user'
                      ? 'gradient-primary text-white rounded-tr-sm'
                      : 'glass border border-border/50 text-foreground rounded-tl-sm'
                  )}
                >
                  {message.imageUrl && (
                    <div className="mb-3">
                      <img src={message.imageUrl} className="max-h-48 rounded-xl object-contain" alt="Attached" />
                    </div>
                  )}
                  {message.role === 'ai' ? (
                    <div
                      className="prose-chat whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  ) : (
                    <span className="whitespace-pre-wrap">{message.content}</span>
                  )}
                </div>
                <div className={cn('flex items-center gap-2 mt-1 px-1', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <span className="text-[10px] text-muted-foreground">{formatTime(message.timestamp)}</span>
                  {message.role === 'ai' && (
                    <button
                      onClick={() => handleCopy(message.content, i)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                    >
                      {copiedId === i ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4 text-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-start"
          >
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="glass border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex items-center gap-1.5">
                {[0, 0.2, 0.4].map((delay, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${delay}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-card rounded-b-2xl p-4 border-t border-border/50">
        {/* Image preview */}
        {imagePreview && (
          <div className="mb-3 relative inline-block">
            <img src={imagePreview} alt="Preview" className="h-14 rounded-xl object-cover border border-border/50" />
            <button
              onClick={() => { setSelectedImage(null); setImagePreview(null); }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-destructive rounded-full flex items-center justify-center shadow-md"
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        )}

        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="flex-shrink-0 rounded-xl border-border/50 hover:border-primary/40 hover:bg-primary/5"
            title="Attach image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />

          <input
            ref={inputRef}
            className="flex-1 bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            placeholder="Ask about crops, pests, fertilizers, weather..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <Button
            onClick={() => handleSend()}
            disabled={(!input.trim() && !selectedImage) || loading}
            size="icon"
            className="flex-shrink-0 rounded-xl gradient-primary border-0 btn-glow"
            title="Send message"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Press Enter to send • Attach images for visual crop analysis
        </p>
      </div>
    </div>
  );
}
