"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { niches, platforms } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Clipboard, RefreshCw, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { generateCaptionTemplate } from "@/ai/flows/caption-template-flow";
import { GenerateCaptionTemplateOutput } from "@/ai/schemas/caption-template-schema";
import AdPlaceholder from "./ad-placeholder";

export default function CaptionTemplatesTab() {
  const [niche, setNiche] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(100);
  const [result, setResult] = useState<GenerateCaptionTemplateOutput | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!niche || !platform) {
      toast({
        title: "Selection Incomplete",
        description: "Please select both a niche and a platform.",
        variant: "destructive",
      });
      return;
    }
    if (wordCount < 20 || wordCount > 500) {
      toast({
        title: "Invalid Word Count",
        description: "Please enter a word count between 20 and 500.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setResult(null);
    setError(null);

    try {
      const platformName = platforms.find(p => p.id === platform)?.name || platform;
      const captionResult = await generateCaptionTemplate({
        niche,
        platform: platformName,
        wordCount: wordCount,
      });

      if (!captionResult || !captionResult.template) {
        setError("The AI couldn't generate a template for this combination. Please adjust your selections and try again.");
        setResult(null);
      } else {
        setResult(captionResult);
      }
    } catch (e: any) {
      console.error("Caption generation error:", e);
      setError("An unexpected error occurred while generating your caption. Please check your connection and try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    if (result && result.template) {
      navigator.clipboard.writeText(result.template);
      toast({
        title: "Copied to Clipboard!",
        description: "The caption template has been copied.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>AI Caption Template Generator</CardTitle>
          <CardDescription>
            Instantly create engaging captions for your posts. Select your niche,
            platform, and desired length.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="niche-select-caption">Niche</Label>
              <Select onValueChange={setNiche} value={niche} disabled={generating}>
                <SelectTrigger id="niche-select-caption" className="bg-background">
                  <SelectValue placeholder="Select a niche..." />
                </SelectTrigger>
                <SelectContent>
                  {niches.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-select-caption">Platform</Label>
              <Select onValueChange={setPlatform} value={platform} disabled={generating}>
                <SelectTrigger id="platform-select-caption" className="bg-background">
                  <SelectValue placeholder="Select a platform..." />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="word-count-caption">
              Approximate Word Count
            </Label>
            <Input
              id="word-count-caption"
              type="number"
              min={20}
              max={500}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              disabled={generating}
              placeholder="e.g., 100"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={generating || !niche || !platform}>
            {generating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Generate Caption
          </Button>
        </CardFooter>
      </Card>

      {generating && (
         <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Crafting your caption...</p>
        </div>
      )}

      {error && !generating && (
        <Card className="shadow-lg animate-in fade-in-50 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Generation Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="shadow-lg animate-in fade-in-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Generated Caption</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Regenerate
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              className="min-h-[200px] text-base bg-background"
              value={result.template}
              readOnly
            />
          </CardContent>
          <CardFooter className="gap-2">
            <Button onClick={handleCopy}>
              <Clipboard className="mr-2 h-4 w-4" /> Copy Template
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {!generating && !result && !error && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Your generated caption will appear here.</p>
        </div>
      )}
    </div>
  );
}
