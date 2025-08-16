import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Edit, Download, ArrowLeft, X, ExternalLink } from 'lucide-react';
import { Brand, defaultBrandPersonality } from '@/types/brand';
import { BrandForm } from '@/components/brands/BrandForm';
import { BrandPersonalityRadar } from '@/components/brands/BrandPersonalityRadar';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { generateBrandPersonalitySnapshotPDF } from '@/lib/pdf';

type BrandData = Omit<Brand, 'created_at' | 'updated_at'> & {
  created_at: string;
  updated_at: string;
};

type BrandSnapshot = {
  basics: {
    name: string;
    tagline: string;
    link: string;
    elevator: string;
  };
  sliders: Array<{
    label: string;
    value: number;
    left?: string;
    right?: string;
  }>;
  keyAnswers: Array<{
    question: string;
    answer: string;
  }>;
};

const BrandDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && id) {
      fetchBrand();
    }
  }, [user, id]);

  const fetchBrand = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        setBrand({
          ...data,
          brand_personality: data.brand_personality || defaultBrandPersonality,
        });
      }
    } catch (error: any) {
      console.error('Error fetching brand:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load brand details',
        variant: 'destructive',
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (values: Partial<BrandData>) => {
    if (!user || !brand) return;
    
    try {
      setSaving(true);
      
      const { data, error } = await supabase
        .from('brands')
        .update({
          ...values,
          updated_at: new Date().toISOString(),
        })
        .eq('id', brand.id)
        .select()
        .single();

      if (error) throw error;
      
      setBrand(data);
      setEditing(false);
      
      toast({
        title: 'Success',
        description: 'Brand updated successfully',
      });
    } catch (error: any) {
      console.error('Error updating brand:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update brand',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!brand) return;
    
    const snapshot: BrandSnapshot = {
      basics: {
        name: brand.brand_name || '',
        tagline: brand.tagline || '',
        link: brand.online_link || '',
        elevator: brand.elevator_pitch || '',
      },
      sliders: [
        { label: 'Masculine', value: brand.brand_personality?.masculine || 5, left: 'Masculine', right: 'Feminine' },
        { label: 'Classic', value: brand.brand_personality?.classic || 5, left: 'Classic', right: 'Modern' },
        { label: 'Playful', value: brand.brand_personality?.playful || 5, left: 'Playful', right: 'Serious' },
        { label: 'Loud', value: brand.brand_personality?.loud || 5, left: 'Loud', right: 'Minimal' },
        { label: 'Approachable', value: brand.brand_personality?.approachable || 5, left: 'Approachable', right: 'Exclusive' },
        { label: 'Warm', value: brand.brand_personality?.warm || 5, left: 'Warm', right: 'Cool' },
        { label: 'Traditional', value: brand.brand_personality?.traditional || 5, left: 'Traditional', right: 'Innovative' },
        { label: 'Luxury', value: brand.brand_personality?.luxury || 5, left: 'Luxury', right: 'Budget' },
        { label: 'Text Focused', value: brand.brand_personality?.textFocused || 5, left: 'Text', right: 'Image' },
        { label: 'Corporate', value: brand.brand_personality?.corporate || 5, left: 'Corporate', right: 'Artistic' },
      ],
      keyAnswers: [
        { question: 'Industry', answer: brand.industry || '' },
        { question: 'Offerings', answer: brand.offerings || '' },
        { question: 'USP', answer: brand.usp || '' },
        { question: 'Problem Solved', answer: brand.problem_solved || '' },
        { question: 'Primary Audience', answer: brand.primary_audience || '' },
        { question: '1 Year Vision', answer: brand.one_year_vision || '' },
        { question: '5 Year Vision', answer: brand.five_year_vision || '' },
      ],
    };
    
    generateBrandPersonalitySnapshotPDF(snapshot);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Brand not found</h1>
        <p className="text-muted-foreground mb-4">The brand you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button asChild>
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>{brand.brand_name} - Brand Details</title>
      </Helmet>

      <div className="flex items-center justify-between mb-8">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{brand.brand_name}</h1>
          {brand.is_primary && (
            <Badge variant="secondary" className="mt-2">
              Primary Brand
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={saving}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button
            onClick={() => setEditing(!editing)}
            disabled={saving}
          >
            {editing ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Edit Brand
              </>
            )}
          </Button>
        </div>
      </div>

      {editing ? (
        <div className="bg-card rounded-lg border p-6">
          <BrandForm
            initialData={brand}
            onSuccess={() => setEditing(false)}
          />
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="personality">Personality</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="vision">Vision & Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Brand Information</CardTitle>
                <CardDescription>Basic details about your brand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tagline</h3>
                  <p className="mt-1">{brand.tagline || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Website</h3>
                  {brand.online_link ? (
                    <a 
                      href={brand.online_link.startsWith('http') ? brand.online_link : `https://${brand.online_link}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      {brand.online_link}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  ) : (
                    <p className="mt-1">Not provided</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Industry</h3>
                  <p className="mt-1">{brand.industry || 'Not provided'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Elevator Pitch</h3>
                  <p className="mt-1 whitespace-pre-line">{brand.elevator_pitch || 'Not provided'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personality">
            <div className="grid gap-4 md:grid-cols-2">
              <BrandPersonalityRadar brand={brand} />
              <Card>
                <CardHeader>
                  <CardTitle>Brand Personality</CardTitle>
                  <CardDescription>How your brand is perceived</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {brand.brand_personality && Object.entries(brand.brand_personality).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-sm text-muted-foreground">{value as number}/10</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${(value as number) * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience">
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
                <CardDescription>Who your brand is for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Primary Audience</h3>
                    <p className="mt-1">{brand.primary_audience || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Age Range</h3>
                    <p className="mt-1">{brand.age_range || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Gender Focus</h3>
                    <p className="mt-1">{brand.gender_focus || 'All'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Income Level</h3>
                    <p className="mt-1">{brand.income_level || 'Not specified'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vision">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Vision</CardTitle>
                  <CardDescription>Your brand's future direction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">1 Year Vision</h3>
                    <p className="mt-1 whitespace-pre-line">{brand.one_year_vision || 'Not provided'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">5 Year Vision</h3>
                    <p className="mt-1 whitespace-pre-line">{brand.five_year_vision || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Strategy</CardTitle>
                  <CardDescription>How you'll achieve your vision</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Challenges</h3>
                    <p className="mt-1 whitespace-pre-line">{brand.challenges || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Competitors</h3>
                    <p className="mt-1 whitespace-pre-line">{brand.competitors || 'Not specified'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Budget Range</h3>
                    <p className="mt-1">{brand.budget_range || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {(brand.likes_dislikes || brand.extra_notes) && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {brand.likes_dislikes && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Design Preferences</h3>
                      <p className="mt-1 whitespace-pre-line">{brand.likes_dislikes}</p>
                    </div>
                  )}
                  {brand.extra_notes && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                      <p className="mt-1 whitespace-pre-line">{brand.extra_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
      
      <div className="mt-8 pt-6 border-t text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p>Created: {format(new Date(brand.created_at), 'MMMM d, yyyy')}</p>
            <p>Last updated: {format(new Date(brand.updated_at), 'MMMM d, yyyy')}</p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <button 
              onClick={() => setEditing(true)} 
              className="text-primary hover:underline cursor-pointer"
            >
              Edit brand details
            </button>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandDetails;
