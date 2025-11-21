"use client";

import React, { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { niches, platforms } from "@/lib/data";
import type { ContentIdea, Platform } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import IdeaCard from "./idea-card";
import { ChevronDown, Lightbulb, Loader2 } from "lucide-react";
import AdPlaceholder from "./ad-placeholder";
import { generateContentIdeas } from "@/ai/flows/content-ideas-flow";
import { Input } from "../ui/input";

export default function ContentIdeasTab() {
  const [niche, setNiche] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(
    new Set()
  );
  const [wordCount, setWordCount] = useState<number>(150);
  const [results, setResults] = useState<ContentIdea[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(platformId)) {
        newSet.delete(platformId);
      } else {
        newSet.add(platformId);
      }
      return newSet;
    });
  };

  const handleGenerate = async () => {
    if (!niche || selectedPlatforms.size === 0) {
      toast({
        title: "Selection Incomplete",
        description: "Please select a niche and at least one platform.",
        variant: "destructive",
      });
      return;
    }
     if (wordCount < 50 || wordCount > 500) {
      toast({
        title: "Invalid Word Count",
        description: "Please enter a word count between 50 and 500.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    setResults([]);
    setError(null);

    try {
      const platformNames = Array.from(selectedPlatforms)
        .map(id => platforms.find(p => p.id === id)?.name)
        .filter(Boolean) as string[];
        
      const result = await generateContentIdeas({
        niche,
        platforms: platformNames,
        wordCount: wordCount,
      });

      if (!result.ideas || result.ideas.length === 0) {
        setError("The AI couldn't generate ideas for this combination. Please adjust your selections and try again.");
        setResults([]);
      } else {
        setResults(result.ideas);
      }
    } catch (e: any) {
      console.error("Content idea generation error:", e);
      setError("An unexpected error occurred while generating ideas. Please check your connection and try again.");
    } finally {
      setGenerating(false);
    }
  };
  
  const getSelectedPlatformsText = () => {
    if (selectedPlatforms.size === 0) return "Select platforms...";
    if (selectedPlatforms.size === 1) {
      const id = selectedPlatforms.values().next().value;
      return platforms.find(p => p.id === id)?.name;
    }
    return `${selectedPlatforms.size} platforms selected`;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>AI Content Idea Generator</CardTitle>
          <CardDescription>
            Fuel your content strategy with fresh ideas. Select a niche, platforms, and desired elaboration length.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="niche-select">Niche</Label>
              <Select
                onValueChange={setNiche}
                value={niche}
                disabled={generating}
              >
                <SelectTrigger id="niche-select" className="bg-background">
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
              <Label>Platforms</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between bg-background"
                    disabled={generating}
                  >
                    <span className="truncate">{getSelectedPlatformsText()}</span>
                    <ChevronDown className="h-4 w-4 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuLabel>Social Platforms</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {platforms.map((p: Platform) => (
                    <DropdownMenuCheckboxItem
                      key={p.id}
                      checked={selectedPlatforms.has(p.id)}
                      onCheckedChange={() => handlePlatformToggle(p.id)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      <p.icon className="mr-2 h-4 w-4" />
                      {p.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="word-count-ideas">
              Elaboration Word Count
            </Label>
            <Input
              id="word-count-ideas"
              type="number"
              min={50}
              max={500}
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              disabled={generating}
              placeholder="e.g., 150"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerate}
            disabled={generating || !niche || selectedPlatforms.size === 0}
            size="lg"
          >
            {generating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lightbulb className="mr-2 h-4 w-4" />
            )}
            Generate 5 Ideas
          </Button>
        </CardFooter>
      </Card>

      {generating && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">
            Generating brilliant ideas...
          </p>
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

      {results.length > 0 && !generating && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Ideas</h2>
          {results.map((idea, index) => (
            <React.Fragment key={idea.id}>
              {index === 1 && (
                <div className="my-4 md:hidden">
                  <AdPlaceholder type="in-feed" />
                </div>
              )}
              <IdeaCard idea={idea} />
            </React.Fragment>
          ))}
        </div>
      )}
      
      {!generating && results.length === 0 && !error && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Your generated content ideas will appear here.</p>
        </div>
      )}
    </div>
  );
}
