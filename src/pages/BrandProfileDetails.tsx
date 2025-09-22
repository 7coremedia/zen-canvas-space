import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Edit, Share2, Loader2, RotateCw, CircleX, FileText, Receipt, Trash2, MoreVertical } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { colorPalettes, logoStyles, typographyPairings, imageryStyles } from '@/config/brandOptions';
import ColorPalettePreview from '@/components/ui/ColorPalettePreview';
import ProposalGenerator from '@/components/powerups/ProposalGenerator';
import InvoiceGenerator from '@/components/powerups/InvoiceGenerator';
import { useAuth } from '@/hooks/useAuth';

// Define the type for onboarding responses from Supabase
type OnboardingResponse = {
  id: string;
  user_id: string | null;
  brand_name: string | null;
  tagline: string | null;
  elevator_pitch: string | null;
  industry: string | null;
  offerings: string | null;
  primary_audience: string | null;
  one_year_vision: string | null;
  five_year_vision: string | null;
  budget_range: string | null;
  launch_timing: string | null;
  usp: string | null;
  competitors: string | null;
  age_range: string | null;
  gender_focus: string | null;
  income_level: string | null;
  challenges: string | null;
  likes_dislikes: string | null;
  extra_notes: string | null;
  online_link: string | null;
  brand_personality: any;
  sender_name: string | null;
  sender_email: string | null;
  created_at: string;
  updated_at: string;
};

// Helper functions to get display objects from IDs
const getLogoStyle = (id: string | undefined) => {
  if (!id) return null;
  return logoStyles.find(style => style.id === id);
};

const getColorPalette = (id: string | undefined) => {
  if (!id) return null;
  return colorPalettes.find(palette => palette.id === id);
};

const getTypographyPairing = (id: string | undefined) => {
  if (!id) return null;
  return typographyPairings.find(pairing => pairing.id === id);
};

const getImageryStyle = (id: string | undefined) => {
  if (!id) return null;
  return imageryStyles.find(style => style.id === id);
};

const BrandProfileDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [brandProfile, setBrandProfile] = useState<OnboardingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const handleDeleteBrand = async () => {
    if (!id) return;
    if (!user) {
      toast({ title: 'Not signed in', description: 'Please sign in to delete this brand.', variant: 'destructive' });
      return;
    }
    try {
      setDeleting(true);
      const { data, error, status } = await supabase
        .from('onboarding_responses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
        .select('id');
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('No matching brand found or you do not have permission to delete this brand.');
      }

      toast({ title: 'Brand Deleted', description: 'The brand and its data have been removed.' });
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Delete brand error:', err);
      toast({ title: 'Delete Failed', description: err.message || 'Could not delete brand.', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

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
          console.error('Supabase error:', error);
          throw error;
        }

        if (!data) {
          console.log('No data found for brand ID:', id);
          setError('Brand profile not found');
        } else {
          console.log('Fetched brand profile data:', data);
          setBrandProfile(data as OnboardingResponse);
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
    <div className="relative min-h-screen bg-background">
      {/* Header Section */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container max-w-6xl px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="md:h-10 md:w-10 h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-3xl font-bold tracking-tight truncate">{brandProfile.brand_name}</h1>
            </div>
            <div className="flex-shrink-0 flex gap-2">
              {isMobile ? (
                // Mobile Actions Dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setShowProposalModal(true)}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Generate Proposal</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowInvoiceModal(true)}>
                      <Receipt className="mr-2 h-4 w-4" />
                      <span>Generate Invoice</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/onboarding', { state: { editOnboardingId: id } })}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Brand</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log('Share clicked')}>
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => console.log('Export clicked')}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Export</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Desktop Actions
                <>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowProposalModal(true)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Proposal
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowInvoiceModal(true)}>
                    <Receipt className="mr-2 h-4 w-4" />
                    Invoice
                  </Button>
                  <Button size="sm" onClick={() => navigate('/onboarding', { state: { editOnboardingId: id } })}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl px-4 py-4 md:py-6">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className={`flex flex-col gap-3 ${isMobile ? 'sticky top-[73px] z-10 bg-background/95 backdrop-blur-sm -mx-4 px-4 pb-2' : 'w-full flex-row items-center justify-between'}`}>
            <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
              <TabsList className={`${
                isMobile 
                  ? 'w-full justify-start overflow-x-auto scrollbar-hide' 
                  : 'flex items-center gap-1'
              } rounded-full bg-muted/60 p-1`}>
                <TabsTrigger
                  value="overview"
                  className="rounded-full px-3 py-1 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow whitespace-nowrap"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="brand-identity"
                  className="rounded-full px-3 py-1 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow whitespace-nowrap"
                >
                  Brand Identity
                </TabsTrigger>
                <TabsTrigger
                  value="audience"
                  className="rounded-full px-3 py-1 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow whitespace-nowrap"
                >
                  Audience
                </TabsTrigger>
                <TabsTrigger
                  value="business"
                  className="rounded-full px-3 py-1 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow whitespace-nowrap"
                >
                  Business
                </TabsTrigger>
                <TabsTrigger
                  value="marketing"
                  className="rounded-full px-3 py-1 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow whitespace-nowrap"
                >
                  Marketing
                </TabsTrigger>
                <TabsTrigger
                  value="planning"
                  className="rounded-full px-3 py-1 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow whitespace-nowrap"
                >
                  Planning
                </TabsTrigger>
              </TabsList>
            </div>
            <Button 
              variant={activeTab === 'settings' ? 'default' : 'outline'} 
              size="sm" 
              className={`rounded-full text-xs sm:text-sm ${isMobile ? 'w-full' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Brand Settings
            </Button>
          </div>

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
                <h3 className="font-medium text-sm text-muted-foreground">Unique Selling Proposition</h3>
                <p>{brandProfile.usp || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">One Year Vision</h3>
                <p>{brandProfile.one_year_vision || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Five Year Vision</h3>
                <p>{brandProfile.five_year_vision || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          {(brandProfile.sender_name || brandProfile.sender_email || brandProfile.brand_personality?.meta?.contactName || brandProfile.brand_personality?.meta?.contactEmail) && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Primary contact details for this brand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(brandProfile.sender_name || brandProfile.brand_personality?.meta?.contactName) && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Contact Name</h3>
                    <p>{brandProfile.sender_name || brandProfile.brand_personality?.meta?.contactName}</p>
                  </div>
                )}
                {(brandProfile.sender_email || brandProfile.brand_personality?.meta?.contactEmail) && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Email Address</h3>
                    <p className="text-blue-600 hover:text-blue-800">
                      <a href={`mailto:${brandProfile.sender_email || brandProfile.brand_personality?.meta?.contactEmail}`}>
                        {brandProfile.sender_email || brandProfile.brand_personality?.meta?.contactEmail}
                      </a>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
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
                {(() => {
                  const logoStyle = getLogoStyle(brandProfile.brand_personality?.logoStyle);
                  if (logoStyle) {
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{logoStyle.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{logoStyle.description}</p>
                        <div className="aspect-video w-32 overflow-hidden rounded-md bg-muted">
                          <img 
                            src={logoStyle.preview} 
                            alt={logoStyle.label} 
                            className="h-full w-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                  return <Badge variant="outline">Not specified</Badge>;
                })()}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Color Palette</h3>
                {(() => {
                  const colorPalette = getColorPalette(brandProfile.brand_personality?.colorPalette);
                  if (colorPalette) {
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{colorPalette.label}</Badge>
                        </div>
                        <ColorPalettePreview colors={colorPalette.colors} label={colorPalette.label} />
                        <div className="aspect-video w-32 overflow-hidden rounded-md bg-muted">
                          <img 
                            src={colorPalette.preview} 
                            alt={colorPalette.label} 
                            className="h-full w-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                  return <Badge variant="outline">Not specified</Badge>;
                })()}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Typography</h3>
                {(() => {
                  const typography = getTypographyPairing(brandProfile.brand_personality?.typographyFeel);
                  if (typography) {
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{typography.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Headline: {typography.headlineFont} / Body: {typography.bodyFont}
                        </p>
                        <div className="aspect-video w-32 overflow-hidden rounded-md bg-muted">
                          <img 
                            src={typography.preview} 
                            alt={typography.label} 
                            className="h-full w-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                  return <Badge variant="outline">Not specified</Badge>;
                })()}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Imagery Style</h3>
                {(() => {
                  const imageryStyle = getImageryStyle(brandProfile.brand_personality?.imageryStyle);
                  if (imageryStyle) {
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{imageryStyle.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{imageryStyle.description}</p>
                        <div className="aspect-video w-32 overflow-hidden rounded-md bg-muted">
                          <img 
                            src={imageryStyle.preview} 
                            alt={imageryStyle.label} 
                            className="h-full w-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                  return <Badge variant="outline">Not specified</Badge>;
                })()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Personality</CardTitle>
              <CardDescription>Personality traits that define your brand</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {brandProfile.brand_personality && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Masculine ↔ Feminine</h4>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${brandProfile.brand_personality.masculineFeminine || 50}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{brandProfile.brand_personality.masculineFeminine || 50}/100</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Playful ↔ Serious</h4>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${brandProfile.brand_personality.playfulSerious || 50}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{brandProfile.brand_personality.playfulSerious || 50}/100</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Luxury ↔ Affordable</h4>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${brandProfile.brand_personality.luxuryAffordable || 50}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{brandProfile.brand_personality.luxuryAffordable || 50}/100</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Classic ↔ Modern</h4>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${brandProfile.brand_personality.classicModern || 50}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{brandProfile.brand_personality.classicModern || 50}/100</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Bold ↔ Subtle</h4>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${brandProfile.brand_personality.boldSubtle || 50}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{brandProfile.brand_personality.boldSubtle || 50}/100</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Local ↔ Global</h4>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${brandProfile.brand_personality.localGlobal || 50}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{brandProfile.brand_personality.localGlobal || 50}/100</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>Who your brand is designed to reach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <h3 className="font-medium text-sm text-muted-foreground">Age Range</h3>
                <p>{brandProfile.age_range || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Gender Focus</h3>
                <p>{brandProfile.gender_focus || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Income Level</h3>
                <p>{brandProfile.income_level || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Geographic Focus</h3>
                <p>{brandProfile.brand_personality?.geographicFocus || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Audience Pain Points</h3>
                <p>{brandProfile.brand_personality?.audiencePainPoints || 'Not specified'}</p>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Strategy</CardTitle>
              <CardDescription>Your business model and positioning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Vision & Mission</h3>
                <p>{brandProfile.brand_personality?.visionMission || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Differentiation Factors</h3>
                {brandProfile.brand_personality?.differentiation?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {brandProfile.brand_personality.differentiation.map((d) => (
                      <Badge key={d} variant="outline">{d}</Badge>
                    ))}
                  </div>
                ) : (
                  <p>{'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Core Values</h3>
                {brandProfile.brand_personality?.coreValues?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {brandProfile.brand_personality.coreValues.map((v) => (
                      <Badge key={v} variant="outline">{v}</Badge>
                    ))}
                  </div>
                ) : (
                  <p>{'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Price Positioning</h3>
                <p>{brandProfile.brand_personality?.pricePositioning ? `${brandProfile.brand_personality.pricePositioning}/100 (Budget ↔ Premium)` : 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Distribution Channels</h3>
                {brandProfile.brand_personality?.distributionChannels?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {brandProfile.brand_personality.distributionChannels.map((c) => (
                      <Badge key={c} variant="outline">{c}</Badge>
                    ))}
                  </div>
                ) : (
                  <p>{'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Business Model</h3>
                <p>{brandProfile.brand_personality?.businessModel || 'Not specified'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing & Communication</CardTitle>
              <CardDescription>Your brand's voice and marketing strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Brand Story</h3>
                <p>{brandProfile.brand_personality?.brandStory || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Tone of Voice</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Friendly ↔ Formal</h4>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${brandProfile.brand_personality?.toneFriendlyFormal || 50}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{brandProfile.brand_personality?.toneFriendlyFormal || 50}/100</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Inspirational ↔ Practical</h4>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${brandProfile.brand_personality?.toneInspirationalPractical || 50}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{brandProfile.brand_personality?.toneInspirationalPractical || 50}/100</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Preferred Platforms</h3>
                {brandProfile.brand_personality?.preferredPlatforms?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {brandProfile.brand_personality.preferredPlatforms.map((p) => (
                      <Badge key={p} variant="outline">{p}</Badge>
                    ))}
                  </div>
                ) : (
                  <p>{'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Marketing Goals</h3>
                {brandProfile.brand_personality?.marketingGoals?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {brandProfile.brand_personality.marketingGoals.map((g) => (
                      <Badge key={g} variant="outline">{g}</Badge>
                    ))}
                  </div>
                ) : (
                  <p>{'Not specified'}</p>
                )}
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
                <p>{brandProfile.budget_range || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Launch Timeline</h3>
                <p>{brandProfile.launch_timing || 'Not specified'}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Website</h3>
                <p>{brandProfile.online_link || (brandProfile.brand_personality?.meta?.hasNoWebsite ? 'No website yet' : 'Not specified')}</p>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Social Handles</h3>
                {brandProfile.brand_personality?.socialHandles?.length ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {brandProfile.brand_personality.socialHandles.map((h) => (
                      <Badge key={h} variant="outline">{h}</Badge>
                    ))}
                  </div>
                ) : (
                  <p>{'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Trademark Status</h3>
                <p>{brandProfile.brand_personality?.trademarkStatus ? 'Yes' : 'No'}</p>
              </div>
              
              {/* Timeline visualization */}
              <div className="bg-muted/50 rounded-lg p-6 mt-4">
                <div className="flex justify-between mb-2">
                  <span>Project Start</span>
                  <span>Launch</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: (brandProfile.launch_timing === 'ASAP' ? '80%' : brandProfile.launch_timing ? '45%' : '0%') }}></div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Actions here are irreversible. Proceed with caution.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between gap-4 p-4 rounded-md bg-destructive/5 border border-destructive/20">
                <div>
                  <h3 className="font-medium">Delete Brand</h3>
                  <p className="text-sm text-muted-foreground">This will permanently remove this brand and all associated data. This action cannot be undone.</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deleting}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {deleting ? 'Deleting...' : 'Delete Brand'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this brand?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the brand "{brandProfile.brand_name}" and remove its data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteBrand} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Confirm Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Notes section in overview area - show if notes exist */}
      {brandProfile && brandProfile.extra_notes ? (
        <div className="container max-w-6xl py-2">
          <Card>
            <CardContent>
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{brandProfile.extra_notes}</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

        {/* Proposal Generator Modal */}
        <ProposalGenerator
          isOpen={showProposalModal}
          onClose={() => setShowProposalModal(false)}
          brandData={brandProfile}
        />

        {/* Invoice Generator Modal */}
        <InvoiceGenerator
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          brandData={brandProfile}
        />
      </div>
    </div>
  );
};

export default BrandProfileDetails;