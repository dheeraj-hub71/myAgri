import { useState } from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import PestDiagnosis from '@/components/PestDiagnosis';
import WeatherForecast from '@/components/WeatherForecast';
import FertilizerGuide from '@/components/FertilizerGuide';
import MarketPredictor from '@/components/MarketPredictor';
import CropRecommendation from '@/components/CropRecommendation';
import {
  LayoutDashboard, Microscope, CloudSun, Sprout,
  TrendingUp, Leaf, Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'pest', label: 'Pest Diagnosis', icon: Microscope },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'fertilizer', label: 'Fertilizer Guide', icon: Sprout },
  { id: 'market', label: 'Market Prices', icon: TrendingUp },
  { id: 'crop', label: 'Crop Recommender', icon: Leaf },
];

const quickStats = [
  { label: 'Active Alerts', value: '3', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { label: 'Crops Monitored', value: '12', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'AI Analyses Today', value: '8', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Market Insights', value: '5', color: 'text-amber-400', bg: 'bg-amber-500/10' },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="subtle-chip mb-3 inline-flex">
              <LayoutDashboard className="h-3 w-3" /> Smart Dashboard
            </div>
            <h1 className="text-4xl font-bold mb-2">
              Farm <span className="gradient-text">Command Center</span>
            </h1>
            <p className="text-muted-foreground">
              All your farming AI tools in one place. Monitor, analyze, and optimize.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {quickStats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="glass-card rounded-2xl p-4">
                <div className={cn('text-3xl font-bold mb-1', stat.color)}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none mb-8 pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md shadow-primary/25'
                      : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-full">
                  <PestDiagnosis />
                </div>
                <div className="h-full">
                  <WeatherForecast />
                </div>
                <div className="lg:col-span-2 glass-card rounded-2xl p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Download className="h-4 w-4 text-primary" />
                    Sample Data for Testing
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download our sample CSV file to test the Crop Analysis feature with real agricultural data.
                  </p>
                  <a
                    href="/sample_crop_data.csv"
                    download="sample_crop_data.csv"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors border border-primary/20"
                  >
                    <Download className="h-4 w-4" />
                    Download sample_crop_data.csv
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'pest' && (
              <div className="max-w-2xl">
                <PestDiagnosis />
              </div>
            )}

            {activeTab === 'weather' && (
              <div className="max-w-2xl">
                <WeatherForecast />
              </div>
            )}

            {activeTab === 'fertilizer' && (
              <div className="max-w-2xl">
                <FertilizerGuide />
              </div>
            )}

            {activeTab === 'market' && (
              <div className="max-w-2xl">
                <MarketPredictor />
              </div>
            )}

            {activeTab === 'crop' && (
              <div className="max-w-2xl">
                <CropRecommendation />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
