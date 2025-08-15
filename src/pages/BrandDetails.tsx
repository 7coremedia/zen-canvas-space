import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Save, Download } from "lucide-react";
import { generateBrandPersonalitySnapshotPDF, type BrandSnapshot } from "@/lib/pdf";

interface BrandData {
  id: string;
  brand_name: string;
  tagline: string;
  online_link: string;
  elevator_pitch: string;
  industry: string;
  offerings: string;
  usp: string;
  problem_solved: string;
  primary_audience: string;
  age_range: string;
  gender_focus: string;
  income_level: string;
  brand_personality: any;
  one_year_vision: string;
  five_year_vision: string;
  challenges: string;
  competitors: string;
  likes_dislikes: string;
  launch_timing: string;
  budget_range: string;
  extra_notes: string;
}

export default function BrandDetails() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBrandData();
    }
  }, [user]);

  const fetchBrandData = async () => {
    try {
      const { data, error } = await supabase
        .from("onboarding_responses")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setBrandData(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load brand details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBrandData = async () => {
    if (!brandData) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from("onboarding_responses")
        .update({
          brand_name: brandData.brand_name,
          tagline: brandData.tagline,
          online_link: brandData.online_link,
          elevator_pitch: brandData.elevator_pitch,
          industry: brandData.industry,
          offerings: brandData.offerings,
          usp: brandData.usp,
          problem_solved: brandData.problem_solved,
          primary_audience: brandData.primary_audience,
          age_range: brandData.age_range,
          gender_focus: brandData.gender_focus,
          income_level: brandData.income_level,
          one_year_vision: brandData.one_year_vision,
          five_year_vision: brandData.five_year_vision,
          challenges: brandData.challenges,
          competitors: brandData.competitors,
          likes_dislikes: brandData.likes_dislikes,
          launch_timing: brandData.launch_timing,
          budget_range: brandData.budget_range,
          extra_notes: brandData.extra_notes,
        })
        .eq("id", brandData.id);

      if (error) throw error;
      
      toast({
        title: "Saved!",
        description: "Your brand details have been updated.",
      });
      setEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const downloadBrandDoc = () => {
    if (!brandData) return;

    const snapshot: BrandSnapshot = {
      basics: {
        name: brandData.brand_name,
        tagline: brandData.tagline,
        link: brandData.online_link,
        elevator: brandData.elevator_pitch,
      },
      sliders: brandData.brand_personality ? [
        { label: "Masculine ↔ Feminine", value: brandData.brand_personality.masculine, left: "Masculine", right: "Feminine" },
        { label: "Classic ↔ Modern", value: brandData.brand_personality.classic, left: "Classic", right: "Modern" },
        { label: "Playful ↔ Serious", value: brandData.brand_personality.playful, left: "Playful", right: "Serious" },
        { label: "Loud ↔ Minimal", value: brandData.brand_personality.loud, left: "Loud", right: "Minimal" },
        { label: "Approachable ↔ Exclusive", value: brandData.brand_personality.approachable, left: "Approachable", right: "Exclusive" },
        { label: "Warm ↔ Cool", value: brandData.brand_personality.warm, left: "Warm", right: "Cool" },
        { label: "Traditional ↔ Innovative", value: brandData.brand_personality.traditional, left: "Traditional", right: "Innovative" },
        { label: "Luxury ↔ Budget-Friendly", value: brandData.brand_personality.luxury, left: "Luxury", right: "Budget" },
        { label: "Text-Focused ↔ Image-Focused", value: brandData.brand_personality.textFocused, left: "Text", right: "Image" },
        { label: "Corporate ↔ Artistic", value: brandData.brand_personality.corporate, left: "Corporate", right: "Artistic" },
      ] : [],
      keyAnswers: [
        { question: "USP", answer: brandData.usp },
        { question: "Problem you solve", answer: brandData.problem_solved },
        { question: "Primary Audience", answer: brandData.primary_audience },
        { question: "Vision (1Y)", answer: brandData.one_year_vision },
        { question: "Vision (5Y)", answer: brandData.five_year_vision },
        { question: "Challenge", answer: brandData.challenges },
      ],
    };

    const pdf = generateBrandPersonalitySnapshotPDF(snapshot);
    const blob = new Blob([pdf], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brandData.brand_name.replace(/\s+/g, "_")}_Brand_Document.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="container mx-auto py-12">
        <div className="text-center">Loading your brand details...</div>
      </main>
    );
  }

  if (!brandData) {
    return (
      <main className="container mx-auto py-12">
        <Helmet>
          <title>Brand Details - KING</title>
          <meta name="description" content="View and edit your brand strategy details." />
          <link rel="canonical" href="/brand-details" />
        </Helmet>
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4">No Brand Data Found</h1>
          <p className="text-muted-foreground">Complete the onboarding process to see your brand details here.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Brand Details - KING</title>
        <meta name="description" content="View and edit your brand strategy details." />
        <link rel="canonical" href="/brand-details" />
      </Helmet>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">{brandData.brand_name}</h1>
          <p className="text-muted-foreground mt-2">Your brand strategy details</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={downloadBrandDoc}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Brand Doc
          </Button>
          {!editing ? (
            <Button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Edit Details
            </Button>
          ) : (
            <Button
              onClick={saveBrandData}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Basics</CardTitle>
            <CardDescription>Core information about your brand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand_name">Brand Name</Label>
                {editing ? (
                  <Input
                    id="brand_name"
                    value={brandData.brand_name}
                    onChange={(e) => setBrandData({ ...brandData, brand_name: e.target.value })}
                  />
                ) : (
                  <p className="mt-1 text-sm">{brandData.brand_name}</p>
                )}
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                {editing ? (
                  <Input
                    id="tagline"
                    value={brandData.tagline || ""}
                    onChange={(e) => setBrandData({ ...brandData, tagline: e.target.value })}
                  />
                ) : (
                  <p className="mt-1 text-sm">{brandData.tagline || "Not set"}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="elevator_pitch">Elevator Pitch</Label>
              {editing ? (
                <Textarea
                  id="elevator_pitch"
                  value={brandData.elevator_pitch}
                  onChange={(e) => setBrandData({ ...brandData, elevator_pitch: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="mt-1 text-sm">{brandData.elevator_pitch}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
            <CardDescription>Industry and offering information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                {editing ? (
                  <Input
                    id="industry"
                    value={brandData.industry}
                    onChange={(e) => setBrandData({ ...brandData, industry: e.target.value })}
                  />
                ) : (
                  <p className="mt-1 text-sm">{brandData.industry}</p>
                )}
              </div>
              <div>
                <Label htmlFor="budget_range">Budget Range</Label>
                {editing ? (
                  <Input
                    id="budget_range"
                    value={brandData.budget_range}
                    onChange={(e) => setBrandData({ ...brandData, budget_range: e.target.value })}
                  />
                ) : (
                  <p className="mt-1 text-sm">{brandData.budget_range}</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="offerings">Products/Services</Label>
              {editing ? (
                <Textarea
                  id="offerings"
                  value={brandData.offerings}
                  onChange={(e) => setBrandData({ ...brandData, offerings: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="mt-1 text-sm">{brandData.offerings}</p>
              )}
            </div>
            <div>
              <Label htmlFor="usp">Unique Selling Proposition</Label>
              {editing ? (
                <Textarea
                  id="usp"
                  value={brandData.usp}
                  onChange={(e) => setBrandData({ ...brandData, usp: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="mt-1 text-sm">{brandData.usp}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vision & Goals</CardTitle>
            <CardDescription>Your brand's future aspirations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="one_year_vision">1-Year Vision</Label>
              {editing ? (
                <Textarea
                  id="one_year_vision"
                  value={brandData.one_year_vision}
                  onChange={(e) => setBrandData({ ...brandData, one_year_vision: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="mt-1 text-sm">{brandData.one_year_vision}</p>
              )}
            </div>
            <div>
              <Label htmlFor="five_year_vision">5-Year Vision</Label>
              {editing ? (
                <Textarea
                  id="five_year_vision"
                  value={brandData.five_year_vision}
                  onChange={(e) => setBrandData({ ...brandData, five_year_vision: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="mt-1 text-sm">{brandData.five_year_vision}</p>
              )}
            </div>
            <div>
              <Label htmlFor="challenges">Main Challenges</Label>
              {editing ? (
                <Textarea
                  id="challenges"
                  value={brandData.challenges}
                  onChange={(e) => setBrandData({ ...brandData, challenges: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="mt-1 text-sm">{brandData.challenges}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target Audience</CardTitle>
            <CardDescription>Who you're building for</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primary_audience">Primary Audience</Label>
                {editing ? (
                  <Input
                    id="primary_audience"
                    value={brandData.primary_audience}
                    onChange={(e) => setBrandData({ ...brandData, primary_audience: e.target.value })}
                  />
                ) : (
                  <p className="mt-1 text-sm">{brandData.primary_audience}</p>
                )}
              </div>
              <div>
                <Label htmlFor="age_range">Age Range</Label>
                {editing ? (
                  <Input
                    id="age_range"
                    value={brandData.age_range}
                    onChange={(e) => setBrandData({ ...brandData, age_range: e.target.value })}
                  />
                ) : (
                  <p className="mt-1 text-sm">{brandData.age_range}</p>
                )}
              </div>
              <div>
                <Label htmlFor="income_level">Income Level</Label>
                {editing ? (
                  <Input
                    id="income_level"
                    value={brandData.income_level}
                    onChange={(e) => setBrandData({ ...brandData, income_level: e.target.value })}
                  />
                ) : (
                  <p className="mt-1 text-sm">{brandData.income_level}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}