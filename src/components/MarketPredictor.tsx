
import { useState } from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { generateAIResponse } from '@/services/aiService';
import { useToast } from "@/hooks/use-toast";

export default function MarketPredictor() {
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Sample data for price prediction chart
  const priceData = [
    { month: 'Jan', price: 120 },
    { month: 'Feb', price: 135 },
    { month: 'Mar', price: 145 },
    { month: 'Apr', price: 140 },
    { month: 'May', price: 150 },
    { month: 'Jun', price: 170 },
    { month: 'Jul', price: 190 },
    { month: 'Aug', price: 210 },
    { month: 'Sep', price: 220 },
    { month: 'Oct', price: 215 },
    { month: 'Nov', price: 225 },
    { month: 'Dec', price: 240 },
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const prompt = `As a market analyst, provide a market price prediction and analysis for: ${crop}
      
      Please provide a detailed analysis including:
      1. Expected price trends for the next 12 months
      2. Factors influencing the market (supply/demand, seasonal factors)
      3. Best time to sell for maximum profit
      4. Risk factors to consider
      Keep it practical and helpful for a farmer.`;

      const response = await generateAIResponse({ prompt });
      setResult(response);
    } catch (error) {
      console.error("Market prediction error:", error);
      toast({
        title: "Error",
        description: "Failed to predict prices. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full glass-morphism card-hover">
      <CardHeader className="space-y-1">
        <div className="subtle-chip">AI Prediction</div>
        <CardTitle className="text-2xl">Market Price Predictor</CardTitle>
        <CardDescription>Get AI predictions for crop prices</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crop">Select Crop</Label>
            <Select 
              value={crop} 
              onValueChange={setCrop}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a crop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rice">Rice</SelectItem>
                <SelectItem value="wheat">Wheat</SelectItem>
                <SelectItem value="corn">Corn</SelectItem>
                <SelectItem value="soybeans">Soybeans</SelectItem>
                <SelectItem value="cotton">Cotton</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!crop || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Predicting Prices...
              </>
            ) : "Predict Market Prices"}
          </Button>
        </form>
        
        {result && (
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Historical & Predicted Price Trend (USD/ton)</h4>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <XAxis 
                      dataKey="month" 
                      tick={{ fontSize: 12 }} 
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Price']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderRadius: '0.75rem', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)',
                        color: 'hsl(var(--foreground))'
                      }}
                      itemStyle={{ color: 'hsl(var(--primary))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))' }}
                      activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-lg border border-primary/10">
              <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                AI Market Analysis for {crop.charAt(0).toUpperCase() + crop.slice(1)}:
              </h4>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
