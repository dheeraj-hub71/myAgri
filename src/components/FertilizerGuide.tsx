
import { useState } from 'react';
import { Sprout, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { generateAIResponse } from '@/services/aiService';
import { useToast } from "@/hooks/use-toast";

export default function FertilizerGuide() {
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const prompt = `As an agricultural expert, provide a comprehensive fertilizer and water management guide for: ${crop}
      
      Please provide a detailed guide including:
      1. Primary Fertilizer Recommendations (NPK ratios, timing)
      2. Organic Alternatives
      3. Micronutrient requirements
      4. Irrigation schedule and water management tips
      Keep it practical and helpful for a farmer.`;

      const response = await generateAIResponse({ prompt });
      setResult(response);
    } catch (error) {
      console.error("Fertilizer guide error:", error);
      toast({
        title: "Error",
        description: "Failed to generate guide. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full glass-morphism card-hover">
      <CardHeader className="space-y-1">
        <div className="subtle-chip">AI Guide</div>
        <CardTitle className="text-2xl">Fertilizer & Water Guide</CardTitle>
        <CardDescription>Optimize resource usage for better yields</CardDescription>
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
                Generating Guide...
              </>
            ) : "Get Recommendations"}
          </Button>
        </form>
        
        {result && (
          <div className="mt-6 space-y-4">
            <div className="bg-secondary/30 p-4 rounded-lg border border-primary/10">
              <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                <Sprout className="h-4 w-4" />
                AI-Generated Guide for {crop.charAt(0).toUpperCase() + crop.slice(1)}:
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
