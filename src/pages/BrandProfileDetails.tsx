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

        const { data, error } = await supabase
          .from('onboarding_responses')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
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
          <Button size="sm">
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
                <p>{brandProfile.offerings || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">One Year Vision</h3>
                <p>{brandProfile.one_year_vision || 'Not specified'}</p>
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
                <Badge variant="outline">{brandProfile.color_palette || 'Not specified'}</Badge>
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
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Primary Audience</h3>
                <p>{brandProfile.primary_audience || 'Not specified'}</p>
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
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandProfileDetails;