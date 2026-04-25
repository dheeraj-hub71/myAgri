import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Leaf, ArrowRight, Cpu, Cloud, TrendingUp, Microscope,
  MessageSquare, CloudSun, Sprout, BarChart3, CheckCircle,
  Star, Users, Globe, Zap, ChevronDown, Download
} from 'lucide-react';

const stats = [
  { value: '50K+', label: 'Farmers Helped', icon: Users },
  { value: '98%', label: 'Accuracy Rate', icon: Star },
  { value: '120+', label: 'Crop Varieties', icon: Leaf },
  { value: '24/7', label: 'AI Support', icon: Zap },
];

const features = [
  {
    icon: Microscope,
    title: 'Crop Disease Detection',
    description: 'Upload photos and get instant AI-powered diagnosis of diseases and pests with treatment recommendations.',
    color: 'from-emerald-500 to-teal-500',
    href: '/crop-analysis',
  },
  {
    icon: MessageSquare,
    title: 'AI Farming Assistant',
    description: 'Chat with our Groq-powered AI for expert agricultural advice, anytime, in your language.',
    color: 'from-blue-500 to-cyan-500',
    href: '/chat-with-ai',
  },
  {
    icon: BarChart3,
    title: 'Data Analytics',
    description: 'Upload CSV data and get instant visual analytics on crop growth, soil health, and yield trends.',
    color: 'from-violet-500 to-purple-500',
    href: '/crop-analysis',
  },
  {
    icon: CloudSun,
    title: 'Weather Intelligence',
    description: 'Real-time weather forecasts with farming-specific recommendations tailored to your location.',
    color: 'from-orange-500 to-amber-500',
    href: '/dashboard',
  },
  {
    icon: Sprout,
    title: 'Fertilizer Guide',
    description: 'AI-generated fertilizer and water management guides optimized for your specific crops.',
    color: 'from-green-500 to-emerald-500',
    href: '/dashboard',
  },
  {
    icon: TrendingUp,
    title: 'Market Predictor',
    description: 'Predict crop market prices and identify the best times to sell for maximum profit.',
    color: 'from-rose-500 to-pink-500',
    href: '/dashboard',
  },
];

const testimonials = [
  {
    name: 'Ramesh Patel',
    role: 'Wheat Farmer, Punjab',
    text: 'MyAgriAI detected leaf rust in my wheat crop 2 weeks before I could see it. Saved my entire harvest!',
    avatar: 'RP',
  },
  {
    name: 'Sunita Devi',
    role: 'Rice Farmer, Bihar',
    text: 'The fertilizer guide helped me reduce costs by 30% while increasing yield. Simply amazing technology.',
    avatar: 'SD',
  },
  {
    name: 'Arjun Reddy',
    role: 'Horticulture Expert, AP',
    text: 'The market predictor helped me time my mango harvest perfectly. Got 40% better prices this season.',
    avatar: 'AR',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    localStorage.setItem('theme', 'dark');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="hero-section gradient-hero relative px-4 pt-20 dot-grid">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="subtle-chip mb-6 inline-flex"
            >
              <Zap className="h-3 w-3" />
              Powered by Groq AI — Lightning Fast Responses
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-[1.1]"
            >
              Farm Smarter with{' '}
              <span className="gradient-text">AI-Powered</span>
              <br />Precision Agriculture
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your farm with AI-driven crop disease detection, real-time weather insights,
              market predictions, and personalized recommendations — all in one platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Button
                size="lg"
                className="gradient-primary text-white border-0 btn-glow rounded-xl text-base px-8 py-6 font-semibold"
                onClick={() => navigate('/dashboard')}
              >
                Explore Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl text-base px-8 py-6 font-semibold border-border/50 hover:bg-secondary/80"
                onClick={() => navigate('/chat-with-ai')}
              >
                <MessageSquare className="mr-2 h-5 w-5" /> Chat with AI
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    className="glass-card rounded-2xl p-4 text-center"
                  >
                    <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
        >
          <span className="text-xs">Scroll to explore</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={itemVariants}
            className="text-center mb-16"
          >
            <div className="subtle-chip mb-4 inline-flex">
              <Star className="h-3 w-3" /> Core Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Grow Better</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From AI-powered diagnostics to real-time market insights — we've built the complete toolkit for modern farmers.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="glass-card rounded-2xl p-6 card-hover cursor-pointer group"
                  onClick={() => navigate(feature.href)}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Try now <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={itemVariants}
            className="text-center mb-16"
          >
            <div className="subtle-chip mb-4 inline-flex">
              <Users className="h-3 w-3" /> Trusted by Farmers
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Real Results from <span className="gradient-text">Real Farmers</span>
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={itemVariants} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={itemVariants}
            className="glass-card rounded-3xl p-10 md:p-16 text-center animated-border relative overflow-hidden"
          >
            <div className="absolute inset-0 gradient-hero opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div className="subtle-chip mb-6 inline-flex">
                <Zap className="h-3 w-3" /> Get Started Free
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Transform<br />
                <span className="gradient-text">Your Farm?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of farmers already using AI to increase yields, reduce costs, and make smarter decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="gradient-primary text-white border-0 btn-glow rounded-xl text-base px-8 py-6 font-semibold"
                  onClick={() => navigate('/crop-analysis')}
                >
                  <Microscope className="mr-2 h-5 w-5" /> Analyze Crops
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl text-base px-8 py-6 font-semibold"
                  onClick={() => navigate('/chat-with-ai')}
                >
                  <MessageSquare className="mr-2 h-5 w-5" /> Chat with AI
                </Button>
              </div>

              {/* Sample CSV download */}
              <div className="mt-8">
                <a
                  href="/sample_crop_data.csv"
                  download="sample_crop_data.csv"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Sample CSV to test Crop Analysis
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-foreground text-xl font-bold">MyAgri<span className="gradient-text">AI</span></span>
                <p className="text-xs text-muted-foreground">Intelligent Precision Agriculture</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="/" className="hover:text-foreground transition-colors">Home</a>
              <a href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</a>
              <a href="/crop-analysis" className="hover:text-foreground transition-colors">Crop Analysis</a>
              <a href="/chat-with-ai" className="hover:text-foreground transition-colors">AI Chat</a>
            </div>

            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} MyAgriAI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
