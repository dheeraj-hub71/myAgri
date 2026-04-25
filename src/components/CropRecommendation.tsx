
import { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateAIResponse } from '@/services/aiService';
import { useToast } from "@/hooks/use-toast";

export default function CropRecommendation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [soilType, setSoilType] = useState("loamy");
  const [location, setLocation] = useState("");
  const [water, setWater] = useState("moderate");
  const [budget, setBudget] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const prompt = `As an agricultural expert, provide crop recommendations based on these details:
      Soil Type: ${soilType}
      Location: ${location}
      Water Availability: ${water}
      Budget: $${budget}
      
      Please provide a detailed recommendation including:
      1. Recommended crops
      2. Why they are suitable
      3. Expected ROI and timeframe
      Keep it practical and helpful for a farmer.`;

      const response = await generateAIResponse({ prompt });
      setResult(response);
    } catch (error) {
      console.error("Recommendation error:", error);
      toast({
        title: "Error",
        description: "Failed to get recommendations. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-lg glass-morphism card-hover">
      <CardHeader className="space-y-1">
        <div className="subtle-chip">AI-Powered</div>
        <CardTitle className="text-2xl">Crop Recommendation</CardTitle>
        <CardDescription>Enter your farm details and get AI-powered crop suggestions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="soil-type">Soil Type</Label>
            <Select value={soilType} onValueChange={setSoilType}>
              <SelectTrigger>
                <SelectValue placeholder="Select soil type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sandy">Sandy</SelectItem>
                <SelectItem value="clayey">Clayey</SelectItem>
                <SelectItem value="loamy">Loamy</SelectItem>
                <SelectItem value="silty">Silty</SelectItem>
                <SelectItem value="peaty">Peaty</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              placeholder="Enter your location" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="water">Water Availability</Label>
            <Select value={water} onValueChange={setWater}>
              <SelectTrigger>
                <SelectValue placeholder="Select water availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="budget">Budget (USD)</Label>
            <Input 
              id="budget" 
              type="number" 
              placeholder="Enter your budget" 
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : "Get Recommendations"}
          </Button>
        </form>
      </CardContent>
      
      {result && (
        <CardFooter className="border-t pt-4">
          <div className="space-y-2 w-full">
            <h4 className="font-medium text-primary">AI Recommendation:</h4>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {result}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
