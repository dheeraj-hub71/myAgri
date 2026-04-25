import Header from '@/components/Header';
import ChatWithAI from '@/components/ChatWithAI';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MessageSquare, Leaf, Zap } from 'lucide-react';

const ChatWithAIPage = () => {
  const location = useLocation();
  const [questionFromAnalysis, setQuestionFromAnalysis] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (location.state?.question) {
      setQuestionFromAnalysis(location.state.question);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <section className="pt-28 pb-10 px-4 flex-1 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8"
          >
            <div className="subtle-chip mb-4 inline-flex">
              <Zap className="h-3 w-3" /> Groq AI — Ultra Fast
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Chat with <span className="gradient-text">AI Assistant</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {questionFromAnalysis
                ? "Your question from crop analysis has been pre-filled below."
                : "Ask anything about farming, crops, pests, weather, and agriculture."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <ChatWithAI initialQuestion={questionFromAnalysis} />
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-border/40 mt-auto">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-foreground text-lg font-bold">MyAgri<span className="gradient-text">AI</span></span>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MyAgriAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatWithAIPage;
