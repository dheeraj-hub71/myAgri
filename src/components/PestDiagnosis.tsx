
import { useState, ChangeEvent } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { analyzeImageWithAI } from '@/services/aiService';

export default function PestDiagnosis() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      
      // Check file size (5MB limit)
      if (selectedImage.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
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
    }
  };
  
  const handleSubmit = async () => {
    if (!image) return;
    
    setLoading(true);
    
    try {
      // Use Groq API to analyze the image
      const analysisPrompt = 
        "Analyze this crop or plant image. Identify any pests or diseases visible. " +
        "If you detect a disease or pest problem, provide: " +
        "1. Name of the disease/pest " +
        "2. Severity level " +
        "3. Treatment recommendations (both chemical and organic options) " +
        "4. Preventive measures for the future. " +
        "Keep your response concise and practical for farmers.";
      
      const analysisResult = await analyzeImageWithAI({
        image: image,
        prompt: analysisPrompt
      });
      
      setResult(analysisResult);
      setLoading(false);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full h-full glass-morphism card-hover flex flex-col">
      <CardHeader className="space-y-1">
        <div className="subtle-chip">AI Vision</div>
        <CardTitle className="text-2xl">Pest & Disease Diagnosis</CardTitle>
        <CardDescription>Upload an image of your crop for AI diagnosis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="border-2 border-dashed border-primary/20 rounded-lg p-4 text-center hover:border-primary/40 transition-colors">
          {imagePreview ? (
            <div className="space-y-4">
              <img 
                src={imagePreview} 
                alt="Uploaded crop" 
                className="mx-auto max-h-48 rounded-md object-contain" 
              />
              <Button variant="outline" onClick={() => {
                setImage(null);
                setImagePreview(null);
                setResult(null);
              }}>
                Remove Image
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer block py-8">
              <Camera className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG or WEBP (max. 5MB)
              </p>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange} 
              />
            </label>
          )}
        </div>
        
        <Button 
          className="w-full" 
          disabled={!image || loading}
          onClick={handleSubmit}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Image...
            </>
          ) : "Diagnose Problem"}
        </Button>
      </CardContent>
      
      {result && (
        <CardFooter className="border-t pt-4 mt-auto">
          <div className="space-y-2 w-full">
            <h4 className="font-medium text-primary">AI Diagnosis:</h4>
            <p className="text-sm whitespace-pre-wrap">{result}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
