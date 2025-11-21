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
import { Badge } from "@/components/ui/badge";
import { niches, platforms } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Clipboard, Hash, Loader2 } from "lucide-react";
import { generateHashtags } from "@/ai/flows/hashtag-generator-flow";

export default function HashtagGeneratorTab() {
  const [niche, setNiche] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [count, setCount] = useState<number>(15);
  const [results, setResults] = useState<string[]>([]);
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
    if (count < 5 || count > 50) {
      toast({
        title: "Invalid Count",
        description: "Please enter a number of hashtags between 5 and 50.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setResults([]);
    setError(null);

    try {
      const platformName = platforms.find(p => p.id === platform)?.name || platform;
      const response = await generateHashtags({
        niche,
        platform: platformName,
        count: count,
      });

      if (!response || !response.hashtags || response.hashtags.length === 0) {
        setError("The AI couldn't generate hashtags for this combination. Please adjust your selections and try again.");
        setResults([]);
      } else {
        setResults(response.hashtags);
      }
    } catch (e: any) {
      console.error("Hashtag generation error:", e);
      setError("An unexpected error occurred while generating hashtags. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyAll = () => {
    if (results.length > 0) {
      const hashtagString = results.join(" ");
      navigator.clipboard.writeText(hashtagString);
      toast({
        title: "Copied to Clipboard!",
        description: `${results.length} hashtags have been copied.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>AI Hashtag Generator</CardTitle>
          <CardDescription>
            Boost your reach with AI-optimized hashtags for your niche and platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="niche-select-hashtag">Niche</Label>
              <Select onValueChange={setNiche} value={niche} disabled={generating}>
                <SelectTrigger id="niche-select-hashtag">
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
              <Label htmlFor="platform-select-hashtag">Platform</Label>
              <Select onValueChange={setPlatform} value={platform} disabled={generating}>
                <SelectTrigger id="platform-select-hashtag" className="bg-background">
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
              <Label htmlFor="hashtag-count">Number of Hashtags</Label>
              <Input
                id="hashtag-count"
                type="number"
                min={5}
                max={50}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                disabled={generating}
                placeholder="e.g., 15"
              />
            </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerate} disabled={generating || !niche || !platform}>
            {generating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Hash className="mr-2 h-4 w-4" />
            )}
            Generate Hashtags
          </Button>
        </CardFooter>
      </Card>
      
      {generating && (
         <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Finding the best hashtags...</p>
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

      {results.length > 0 && (
        <Card className="shadow-lg animate-in fade-in-50">
          <CardHeader>
            <CardTitle>Generated Hashtags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {results.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-base px-3 py-1">
                {tag}
              </Badge>
            ))}
          </CardContent>
          <CardFooter>
            <Button onClick={handleCopyAll}>
              <Clipboard className="mr-2 h-4 w-4" /> Copy All
            </Button>
          </CardFooter>
        </Card>
      )}

      {!generating && results.length === 0 && !error && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Your generated hashtags will appear here.</p>
        </div>
      )}
    </div>
  );
}
