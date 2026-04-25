import { useState, useRef, ChangeEvent } from 'react';
import { Upload, Loader2, FileText, ImageIcon, ChevronDown, ChevronUp, Download, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { analyzeImageWithAI } from '@/services/aiService';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Sample data for yield comparison chart
const yieldData = [
  { month: 'Jan', current: 1.2, optimal: 1.5 },
  { month: 'Feb', current: 1.3, optimal: 1.7 },
  { month: 'Mar', current: 1.5, optimal: 1.9 },
  { month: 'Apr', current: 1.8, optimal: 2.2 },
  { month: 'May', current: 2.0, optimal: 2.5 },
  { month: 'Jun', current: 2.3, optimal: 3.0 },
  { month: 'Jul', current: 2.1, optimal: 2.8 },
  { month: 'Aug', current: 1.9, optimal: 2.6 },
  { month: 'Sep', current: 1.7, optimal: 2.3 },
  { month: 'Oct', current: 1.5, optimal: 2.0 },
  { month: 'Nov', current: 1.3, optimal: 1.8 },
  { month: 'Dec', current: 1.1, optimal: 1.6 },
];

// Sample data for resource usage analysis
const resourceData = [
  { name: 'Water (gal/acre)', current: 1200, optimal: 900 },
  { name: 'Fertilizer (lb/acre)', current: 180, optimal: 150 },
  { name: 'Pesticide (oz/acre)', current: 32, optimal: 24 },
  { name: 'Labor (hrs/acre)', current: 45, optimal: 38 },
];

// Questions for consideration
const questions = [
  "Have you considered adjusting your irrigation schedule based on soil moisture levels?",
  "Would implementing cover crops help improve your soil health and water retention?",
  "Could precision agriculture technologies help optimize your fertilizer application?",
  "Have you explored organic pest management techniques to reduce chemical usage?",
];

// CSV data structure interface
interface CropData {
  soilType: string;
  phLevel: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  sunlight: number;
  cropType: string;
  cropGrowth: number;
}

// Function to parse CSV data
const parseCSV = (csvText: string): CropData[] => {
  const lines = csvText.trim().split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(header => header.trim());

  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const entry: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      
      // Map headers to our data structure
      switch(header) {
        case 'Soil Type':
          entry.soilType = value;
          break;
        case 'pH Level':
          entry.phLevel = parseFloat(value) || 0;
          break;
        case 'Nitrogen (mg/kg)':
          entry.nitrogen = parseInt(value) || 0;
          break;
        case 'Phosphorus (mg/kg)':
          entry.phosphorus = parseInt(value) || 0;
          break;
        case 'Potassium (mg/kg)':
          entry.potassium = parseInt(value) || 0;
          break;
        case 'Temperature (°C)':
          entry.temperature = parseInt(value) || 0;
          break;
        case 'Humidity (%)':
          entry.humidity = parseInt(value) || 0;
          break;
        case 'Rainfall (mm)':
          entry.rainfall = parseInt(value) || 0;
          break;
        case 'Sunlight Exposure (h)':
          entry.sunlight = parseInt(value) || 0;
          break;
        case 'Crop Type':
          entry.cropType = value;
          break;
        case 'Crop Growth (%)':
          entry.cropGrowth = parseInt(value) || 0;
          break;
        default:
          entry[header.toLowerCase().replace(/\s+/g, '')] = value;
      }
    });
    
    return entry as CropData;
  });
};

// Function to analyze crop data
const analyzeCropData = (data: CropData[]) => {
  if (!data || data.length === 0) {
    return {
      cropAnalysis: [],
      soilAnalysis: [],
      recommendations: ["No data available for analysis. Please check your CSV file."],
      charts: {
        cropGrowthByType: [],
        growthBySoilType: []
      }
    };
  }
  
  // Calculate averages by crop type
  const cropTypes = [...new Set(data.map(item => item.cropType))];
  
  const cropAnalysis = cropTypes.map(crop => {
    const cropData = data.filter(item => item.cropType === crop);
    const avgGrowth = cropData.reduce((sum, item) => sum + item.cropGrowth, 0) / cropData.length;
    const bestGrowth = Math.max(...cropData.map(item => item.cropGrowth));
    const worstGrowth = Math.min(...cropData.map(item => item.cropGrowth));
    
    // Find optimal conditions for this crop
    const bestCondition = cropData.find(item => item.cropGrowth === bestGrowth);
    
    return {
      cropType: crop,
      avgGrowth: avgGrowth.toFixed(1),
      bestGrowth,
      worstGrowth,
      bestCondition,
      count: cropData.length
    };
  });
  
  // Analyze soil types
  const soilTypes = [...new Set(data.map(item => item.soilType))];
  const soilAnalysis = soilTypes.map(soil => {
    const soilData = data.filter(item => item.soilType === soil);
    const avgGrowth = soilData.reduce((sum, item) => sum + item.cropGrowth, 0) / soilData.length;
    
    return {
      soilType: soil,
      avgGrowth: avgGrowth.toFixed(1),
      count: soilData.length
    };
  });
  
  // Generate recommendations based on data
  const recommendations = [];
  
  // Analyze pH levels
  const avgPh = data.reduce((sum, item) => sum + item.phLevel, 0) / data.length;
  if (avgPh < 6.0) {
    recommendations.push("The average pH level is low. Consider applying lime to raise soil pH.");
  } else if (avgPh > 7.5) {
    recommendations.push("The average pH level is high. Consider applying sulfur to lower soil pH.");
  }
  
  // Analyze nutrient levels
  const avgNitrogen = data.reduce((sum, item) => sum + item.nitrogen, 0) / data.length;
  const avgPhosphorus = data.reduce((sum, item) => sum + item.phosphorus, 0) / data.length;
  const avgPotassium = data.reduce((sum, item) => sum + item.potassium, 0) / data.length;
  
  if (avgNitrogen < 40) {
    recommendations.push("Nitrogen levels are low. Consider applying nitrogen-rich fertilizers or planting nitrogen-fixing cover crops.");
  }
  
  if (avgPhosphorus < 15) {
    recommendations.push("Phosphorus levels are low. Consider applying phosphate fertilizers.");
  }
  
  if (avgPotassium < 100) {
    recommendations.push("Potassium levels are low. Consider applying potash fertilizers.");
  }
  
  // Generate custom charts data
  const cropGrowthByType = cropTypes.map(crop => {
    const cropData = data.filter(item => item.cropType === crop);
    const avgGrowth = cropData.reduce((sum, item) => sum + item.cropGrowth, 0) / cropData.length;
    
    return {
      name: crop,
      growth: parseFloat(avgGrowth.toFixed(1))
    };
  });
  
  const growthBySoilType = soilTypes.map(soil => {
    const soilData = data.filter(item => item.soilType === soil);
    const avgGrowth = soilData.reduce((sum, item) => sum + item.cropGrowth, 0) / soilData.length;
    
    return {
      name: soil,
      growth: parseFloat(avgGrowth.toFixed(1))
    };
  });
  
  return {
    cropAnalysis,
    soilAnalysis,
    recommendations,
    charts: {
      cropGrowthByType,
      growthBySoilType
    }
  };
};

// Function to generate relevant questions based on data analysis
const generateRelevantQuestions = (analysis: any) => {
  const questions = [];
  
  // Check soil pH level
  if (analysis.recommendations.some((rec: string) => rec.includes("pH"))) {
    questions.push("What amendments can I use to adjust my soil pH level for optimal crop growth?");
  }
  
  // Check nutrient levels
  if (analysis.recommendations.some((rec: string) => rec.includes("Nitrogen"))) {
    questions.push("What are the most cost-effective nitrogen-rich fertilizers or cover crops for my situation?");
  }
  
  if (analysis.recommendations.some((rec: string) => rec.includes("Phosphorus"))) {
    questions.push("How can I improve phosphorus availability in my soil without over-application?");
  }
  
  if (analysis.recommendations.some((rec: string) => rec.includes("Potassium"))) {
    questions.push("What are signs of potassium deficiency in crops and how can I address it?");
  }
  
  // Crop specific questions
  const cropTypes = analysis.cropAnalysis.map((crop: any) => crop.cropType);
  if (cropTypes.length > 0) {
    questions.push(`What are the optimal growing conditions for ${cropTypes.join(', ')}?`);
    questions.push(`What are common diseases or pests that affect ${cropTypes[0]} and how can I prevent them?`);
  }
  
  // Soil type specific questions
  const soilTypes = analysis.soilAnalysis.map((soil: any) => soil.soilType);
  if (soilTypes.length > 0) {
    questions.push(`How can I improve water retention in ${soilTypes[0]} soil?`);
    questions.push(`What crops are best suited for ${soilTypes[0]} soil in my region?`);
  }
  
  // Add some general questions if we don't have enough specific ones
  if (questions.length < 4) {
    questions.push("How can I implement sustainable farming practices that improve soil health?");
    questions.push("What irrigation technologies would be most efficient for my crops?");
    questions.push("How might climate change affect my farming operations in the coming years?");
    questions.push("What crop rotation strategies would benefit my soil and reduce pest pressure?");
  }
  
  // Return up to 6 questions
  return questions.slice(0, 6);
};

export default function CropAnalysis() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<CropData[] | null>(null);
  const [csvAnalysis, setCsvAnalysis] = useState<any>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisType, setAnalysisType] = useState<'csv' | 'image'>('csv');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isCustomPromptOpen, setIsCustomPromptOpen] = useState(false);
  const [relevantQuestions, setRelevantQuestions] = useState<string[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      
      // Read CSV file
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const content = event.target.result as string;
          setCsvContent(content);
        }
      };
      reader.readAsText(file);
      
      toast({
        title: "CSV uploaded",
        description: "Your crop data is ready for analysis",
      });
    }
  };
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      
      // Check file size (10MB limit)
      if (selectedImage.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setImage(selectedImage);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedImage);
      
      toast({
        title: "Image uploaded",
        description: "Your crop image is ready for analysis",
      });
    }
  };
  
  const handleUploadClick = () => {
    if (analysisType === 'csv') {
      fileInputRef.current?.click();
    } else {
      imageInputRef.current?.click();
    }
  };
  
  const handleAnalyze = async () => {
    if (analysisType === 'csv' && !csvContent) return;
    if (analysisType === 'image' && !image) return;
    
    setLoading(true);
    
    try {
      if (analysisType === 'csv' && csvContent) {
        // Parse and analyze the CSV data
        const parsedData = parseCSV(csvContent);
        setCsvData(parsedData);
        const analysis = analyzeCropData(parsedData);
        setCsvAnalysis(analysis);
        
        // Generate relevant questions based on analysis
        const questions = generateRelevantQuestions(analysis);
        setRelevantQuestions(questions);
        
        setShowAnalysis(true);
        setLoading(false);
      } else if (analysisType === 'image' && image) {
        // Real image analysis with Groq
        const prompt = customPrompt || undefined; // Use default if empty
        const result = await analyzeImageWithAI({
          image,
          prompt
        });
        
        setAnalysisResult(result);
        setShowAnalysis(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your data. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  const handleQuestionClick = (question: string) => {
    // Navigate to chat page with the question
    navigate('/chat-with-ai', { state: { question } });
  };
  
  const handleSwitchAnalysisType = (type: 'csv' | 'image') => {
    setAnalysisType(type);
    setShowAnalysis(false);
    setFileName(null);
    setCsvContent(null);
    setCsvData(null);
    setCsvAnalysis(null);
    setImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
  };
  
  return (
    <Card className="w-full max-w-4xl glass-morphism card-hover">
      <CardHeader className="space-y-1">
        <div className="subtle-chip">Data Analysis</div>
        <CardTitle className="text-2xl">Crop Data Analysis</CardTitle>
        <CardDescription>Upload your crop data or images for AI analysis</CardDescription>
        
        <div className="flex space-x-2 mt-2">
          <Button 
            variant={analysisType === 'csv' ? "default" : "outline"} 
            size="sm"
            onClick={() => handleSwitchAnalysisType('csv')}
          >
            <FileText className="mr-2 h-4 w-4" />
            CSV Analysis
          </Button>
          <Button 
            variant={analysisType === 'image' ? "default" : "outline"} 
            size="sm"
            onClick={() => handleSwitchAnalysisType('image')}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Image Analysis
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showAnalysis ? (
          <div className="space-y-6">
            {analysisType === 'csv' ? (
              <div 
                className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors cursor-pointer"
                onClick={handleUploadClick}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".csv" 
                  onChange={handleFileChange} 
                />
                <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  CSV files only (max. 10MB)
                </p>
                <div className="flex flex-col items-center gap-2">
                  <Button variant="outline" onClick={handleUploadClick} className="mx-auto">
                    Select CSV File
                  </Button>
                  <a 
                    href="/sample_crop_data.csv" 
                    download="sample_crop_data.csv"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="h-3 w-3" />
                    Download Sample CSV
                  </a>
                </div>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors cursor-pointer"
                onClick={handleUploadClick}
              >
                <input 
                  type="file" 
                  ref={imageInputRef}
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
                
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Crop image" 
                      className="mx-auto max-h-64 rounded-md object-contain" 
                    />
                    <Button variant="outline" onClick={handleUploadClick}>
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload crop or field image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">
                      JPG, PNG or WEBP (max. 10MB)
                    </p>
                    <Button variant="outline" onClick={handleUploadClick} className="mx-auto">
                      Select Image
                    </Button>
                  </>
                )}
              </div>
            )}
            
            {analysisType === 'image' && (
              <Collapsible
                open={isCustomPromptOpen}
                onOpenChange={setIsCustomPromptOpen}
                className="border rounded-md p-2"
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="flex w-full justify-between p-2">
                    <span>Custom Analysis Instructions</span>
                    {isCustomPromptOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="p-2">
                  <Textarea
                    placeholder="Enter specific instructions for image analysis (optional)"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="h-24"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to use default analysis parameters
                  </p>
                </CollapsibleContent>
              </Collapsible>
            )}
            
            {(fileName || imagePreview) && (
              <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  {analysisType === 'csv' ? (
                    <FileText className="h-5 w-5 text-primary" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-primary" />
                  )}
                  <span className="text-sm font-medium">
                    {fileName || (image?.name || "Selected image")}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  disabled={loading}
                  onClick={handleAnalyze}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Data'
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {analysisType === 'csv' ? (
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Analysis Results for: {fileName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI has analyzed your crop data and identified the following insights and improvement opportunities.
                  </p>
                </div>
                
                {csvAnalysis && (
                  <>
                    <div className="space-y-4">
                      <h4 className="text-md font-medium flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        Crop Growth by Type
                      </h4>
                      <div className="h-72 w-full bg-black/20 rounded-xl p-4 border border-white/5">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={csvAnalysis.charts.cropGrowthByType} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                              tickLine={false}
                            />
                            <YAxis 
                              dataKey="growth" 
                              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                              tickLine={false}
                            />
                            <Tooltip 
                              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                borderRadius: '0.75rem', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                                color: 'hsl(var(--foreground))'
                              }}
                              itemStyle={{ color: 'hsl(var(--primary))' }}
                            />
                            <Bar 
                              dataKey="growth" 
                              fill="url(#barGradient)" 
                              name="Growth (%)" 
                              radius={[6, 6, 0, 0]}
                              animationDuration={1500}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-md font-medium flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Growth Rate by Soil Type
                      </h4>
                      <div className="h-72 w-full bg-black/20 rounded-xl p-4 border border-white/5">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={csvAnalysis.charts.growthBySoilType} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <defs>
                              <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(158, 95%, 60%)" stopOpacity={1}/>
                                <stop offset="100%" stopColor="hsl(158, 95%, 40%)" stopOpacity={0.6}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                              tickLine={false}
                            />
                            <YAxis 
                              dataKey="growth" 
                              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                              tickLine={false}
                            />
                            <Tooltip 
                              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))',
                                borderRadius: '0.75rem', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                                color: 'hsl(var(--foreground))'
                              }}
                              itemStyle={{ color: 'hsl(158, 95%, 60%)' }}
                            />
                            <Bar 
                              dataKey="growth" 
                              fill="url(#accentGradient)" 
                              name="Growth (%)" 
                              radius={[6, 6, 0, 0]}
                              animationDuration={1500}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    <div className="bg-secondary p-4 rounded-lg">
                      <h4 className="text-md font-medium mb-2">Key Insights & Recommendations</h4>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-sm">Crop Analysis:</h5>
                          <ul className="text-sm space-y-2 mt-2">
                            {csvAnalysis.cropAnalysis.map((crop: any, i: number) => (
                              <li key={i}>
                                <span className="font-medium">{crop.cropType}:</span> Average growth rate of {crop.avgGrowth}% 
                                {crop.bestCondition && (
                                  <span> (Best conditions: {crop.bestCondition.soilType} soil, pH {crop.bestCondition.phLevel}, 
                                    {crop.bestCondition.temperature}°C, {crop.bestCondition.humidity}% humidity)</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm">Soil Analysis:</h5>
                          <ul className="text-sm space-y-2 mt-2">
                            {csvAnalysis.soilAnalysis.map((soil: any, i: number) => (
                              <li key={i}>
                                <span className="font-medium">{soil.soilType}:</span> Average growth rate of {soil.avgGrowth}%
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-sm">Recommendations:</h5>
                          <ul className="text-sm space-y-2 mt-2">
                            {csvAnalysis.recommendations.map((rec: string, i: number) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    {csvData && (
                      <div className="space-y-3">
                        <h4 className="text-md font-medium">Raw Data</h4>
                        <div className="overflow-x-auto">
                          <Textarea 
                            value={csvContent || ''} 
                            readOnly 
                            className="min-h-[200px] text-xs font-mono" 
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    onClick={() => {
                      setShowAnalysis(false);
                      setCsvContent(null);
                      setCsvData(null);
                      setCsvAnalysis(null);
                      setFileName(null);
                      setRelevantQuestions([]);
                    }}
                    variant="outline"
                  >
                    Analyze Another CSV
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">AI Analysis of Your Crop Image</h3>
                  <p className="text-sm text-muted-foreground">
                    Gemini AI has analyzed your image and provided the following insights:
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <img 
                      src={imagePreview || ''} 
                      alt="Analyzed crop" 
                      className="rounded-lg object-contain w-full h-auto" 
                    />
                  </div>
                  
                  <div className="md:w-2/3 space-y-4">
                    <div className="bg-secondary p-4 rounded-lg">
                      <h4 className="text-md font-medium mb-2">Analysis Results</h4>
                      <div className="text-sm whitespace-pre-wrap">
                        {analysisResult}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        setShowAnalysis(false);
                        setImage(null);
                        setImagePreview(null);
                        setAnalysisResult(null);
                      }}
                      variant="outline"
                    >
                      Analyze Another Image
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {relevantQuestions.length > 0 && (
              <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                <h4 className="text-lg font-semibold mb-4 gradient-text">Recommended Follow-up Questions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {relevantQuestions.map((question, i) => (
                    <Button 
                      key={i}
                      variant="outline" 
                      className="justify-start h-auto py-3 px-4 text-left text-sm border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 transition-all rounded-xl whitespace-normal"
                      onClick={() => handleQuestionClick(question)}
                    >
                      <Bot className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
