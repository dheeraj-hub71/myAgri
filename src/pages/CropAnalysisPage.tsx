import Header from '@/components/Header';
import CropAnalysis from '@/components/CropAnalysis';
import { motion } from 'framer-motion';
import { Leaf, Download, BarChart3 } from 'lucide-react';

const CropAnalysisPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12"
          >
            <div className="subtle-chip mb-4 inline-flex">
              <BarChart3 className="h-3 w-3" /> AI-Powered Analytics
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Crop Data <span className="gradient-text">Analysis</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Upload your crop data CSV or plant images for instant AI-powered insights and optimization recommendations.
            </p>
            <a
              href="/sample_crop_data.csv"
              download="sample_crop_data.csv"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Download className="h-4 w-4" />
              Download Sample CSV for testing
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="flex justify-center"
          >
            <CropAnalysis />
          </motion.div>
        </div>
      </section>

      <footer className="py-10 px-4 border-t border-border/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <span className="text-foreground text-lg font-bold">MyAgri<span className="gradient-text">AI</span></span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MyAgriAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CropAnalysisPage;
