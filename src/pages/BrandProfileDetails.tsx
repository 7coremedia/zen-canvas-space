import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Edit, Share2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { colorPalettes } from '@/config/brandOptions';
import ColorPalettePreview from '@/components/ui/ColorPalettePreview';
import { useNavigate } from 'react-router-dom';

// Define the type for onboarding responses from Supabase
type OnboardingResponse = {
  id: string;
  user_id: string | null;
  brand_name: string | null;
  elevator_pitch: string | null;
  industry: string | null;
  offerings: string | null;
  primary_audience: string | null;
  one_year_vision: string | null;
  budget: string | null;
  launch_timeline: string | null;
  logo_style: string | null;
  color_palette: string | null;
  typography: string | null;
  imagery_style: string | null;
  created_at: string;
  updated_at: string;
};

const BrandProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [brandProfile, setBrandProfile] = useState<OnboardingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrandProfile = async () => {
      try {
        if (!id) {
          setError('Brand ID is missing');
          setLoading(false);
          return;
        }

        // Try to fetch from DB first
        let data = null;
        try {
          const resp = await supabase
            .from('onboarding_responses')
            .select('*')
            .eq('id', id)
            .single();
          if (resp && resp.data) data = resp.data;
        } catch {}

        // If not found, try sessionStorage
        if (!data) {
          const tempBrands = JSON.parse(sessionStorage.getItem('tempBrandData') || '[]');
          data = tempBrands.find((b: any) => b.id === id);
        }

        if (!data) {
          setError('Brand profile not found');
        } else {
          setBrandProfile(data);
        }
      } catch (err) {
        console.error('Error fetching brand profile:', err);
        setError('Failed to load brand profile');
        toast({
          title: 'Error',
          description: 'Failed to load brand profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBrandProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading brand profile...</span>
      </div>
    );
  }

  if (error || !brandProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error || 'Brand profile not found'}</p>
        <Button onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold ml-2">{brandProfile.brand_name}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button size="sm" onClick={() => navigate('/onboarding', { state: { editOnboardingId: id } })}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="brand-identity">Brand Identity</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Summary</CardTitle>
              <CardDescription>Key information about your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Elevator Pitch</h3>
                <p>{brandProfile.elevator_pitch || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Industry</h3>
                <p>{brandProfile.industry || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Offerings</h3>
                {brandProfile.offerings ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {brandProfile.offerings.split(',').map((o) => (
                      <Badge key={o.trim()} variant="outline">{o.trim()}</Badge>
                    ))}
                  </div>
                ) : (
                  <p>{'Not specified'}</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">One Year Vision</h3>
                <p>{brandProfile.one_year_vision || 'Not specified'}</p>
              </div>
              {/* Audience summary quick view */}
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Audience</h3>
                <div className="flex flex-wrap gap-4 mt-2">
                  {/* Age Range */}
                  {brandProfile.age_range ? (
                    <Badge variant="outline">Age: {brandProfile.age_range}</Badge>
                  ) : null}
                  {/* Gender Focus */}
                  {brandProfile.gender_focus ? (
                    <Badge variant="outline">Gender: {brandProfile.gender_focus}</Badge>
                  ) : null}
                  {/* Income Level */}
                  {brandProfile.income_level ? (
                    <Badge variant="outline">Income: {brandProfile.income_level}</Badge>
                  ) : null}
                  {/* Geographic Focus */}
                  {brandProfile.geographic_focus ? (
                    <Badge variant="outline">Geo: {brandProfile.geographic_focus}</Badge>
                  ) : null}
                </div>
              </div>
              {/* Audience pain points */}
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Audience Pain Points</h3>
                <p>{brandProfile.audience_pain_points || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand-identity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Identity</CardTitle>
              <CardDescription>The visual elements that define your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Logo Style</h3>
                <Badge variant="outline">{brandProfile.logo_style || 'Not specified'}</Badge>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Color Palette</h3>
                {/* If the onboarding stored a palette id that matches our config, render a swatch preview */}
                {brandProfile.color_palette ? (
                  (() => {
                    const palette = colorPalettes.find(p => p.id === brandProfile.color_palette);
                    if (palette) {
                      return <ColorPalettePreview colors={palette.colors} label={palette.label} />;
                    }
                    // If no matching palette id, fallback to simple badge showing raw value
                    return <Badge variant="outline">{brandProfile.color_palette}</Badge>;
                  })()
                ) : (
                  <Badge variant="outline">Not specified</Badge>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Typography</h3>
                <Badge variant="outline">{brandProfile.typography || 'Not specified'}</Badge>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Imagery Style</h3>
                <Badge variant="outline">{brandProfile.imagery_style || 'Not specified'}</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>Who your brand is designed to reach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Primary Audience</h3>
                  {brandProfile.primary_audience ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {brandProfile.primary_audience.split(',').map((a) => (
                        <Badge key={a.trim()} variant="outline">{a.trim()}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p>{'Not specified'}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Competitors</h3>
                  {brandProfile.competitors ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {brandProfile.competitors.split(',').map((c) => (
                        <Badge key={c.trim()} variant="outline">{c.trim()}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p>{'Not specified'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Launch Planning</CardTitle>
              <CardDescription>Timeline and budget information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Budget Range</h3>
                <p>{brandProfile.budget || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Launch Timeline</h3>
                <p>{brandProfile.launch_timeline || 'Not specified'}</p>
              </div>
              
              {/* Timeline visualization would go here */}
              <div className="bg-muted/50 rounded-lg p-6 mt-4">
                <div className="flex justify-between mb-2">
                  <span>Project Start</span>
                  <span>Launch</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: (brandProfile.launch_timeline === 'ASAP' ? '80%' : brandProfile.launch_timeline ? '45%' : '0%') }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Notes section in overview area - show if notes exist */}
      {brandProfile && brandProfile.notes ? (
        <div className="container max-w-6xl py-2">
          <Card>
            <CardContent>
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{brandProfile.notes}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
};

export default BrandProfileDetails;