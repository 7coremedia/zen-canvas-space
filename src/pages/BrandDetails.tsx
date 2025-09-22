import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles, Download, Copy, Edit, Share2, MoreVertical, ArrowLeft, FileText, Receipt, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type BrandTab = 'ai' | 'human';

type BrandElement = {
  id: string;
  title: string;
  type: 'logo' | 'colors' | 'typography' | 'voice' | 'photography' | 'strategy' | 'avatar' | 'campaign' | 'competitors';
  content: any;
  createdBy: 'ai' | 'human';
  createdAt: Date;
  updatedAt: Date;
};

type BrandData = {
  id: string;
  name: string;
  description: string;
  elements: BrandElement[];
  createdAt: string;
  updatedAt: string;
};

const BrandDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<BrandTab>('ai');
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [isAskingHuman, setIsAskingHuman] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [brand, setBrand] = useState<BrandData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        if (data) {
          setBrand({
            id: data.id,
            name: data.brand_name,
            description: data.description,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            elements: [
              {
                id: '1',
                title: 'Brand Logo',
                type: 'logo',
                content: {
                  preview: '/path/to/logo.png',
                  variations: ['/path/to/logo-variant1.png', '/path/to/logo-variant2.png'],
                },
                createdBy: 'ai',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              {
                id: '2',
                title: 'Color Palette',
                type: 'colors',
                content: {
                  primary: '#2563eb',
                  secondary: '#7c3aed',
                  accent: '#f43f5e',
                  neutral: '#1f2937',
                  background: '#ffffff',
                  foreground: '#111827',
                },
                createdBy: 'ai',
                createdAt: new Date(),
                updatedAt: new Date(),
              },
              // Add more elements as needed
            ],
          });
          setIsLoading(false);
        }
      } catch (error: any) {
        console.error('Error fetching brand:', error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBrand();
    }
  }, [id]);

  const filteredElements = brand?.elements.filter(
    (element) => (activeTab === 'ai' ? element.createdBy === 'ai' : element.createdBy === 'human')
  ) || [];

  const renderElementContent = (element: BrandElement) => {
    switch (element.type) {
      case 'logo':
        return (
          <div className="p-4 bg-muted/20 rounded-lg">
            <img 
              src={element.content.preview} 
              alt="Brand Logo" 
              className="w-full h-auto max-h-40 object-contain"
            />
          </div>
        );
      case 'colors':
        return (
          <div className="grid grid-cols-3 gap-2 p-4">
            {Object.entries(element.content).map(([name, color]) => (
              <div key={name} className="flex flex-col items-center">
                <div 
                  className="w-12 h-12 rounded-full mb-1 border"
                  style={{ backgroundColor: color as string }}
                />
                <span className="text-xs text-muted-foreground">{name}</span>
                <span className="text-xs font-mono">{color}</span>
              </div>
            ))}
          </div>
        );
      // Add more cases for other element types
      default:
        return <div className="p-4">{JSON.stringify(element.content, null, 2)}</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Brand not found</h1>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Header Section */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="md:h-10 md:w-10 h-9 w-9"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">{brand.name}</h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                Created on {new Date(brand.createdAt).toLocaleDateString()}
              </p>
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
                    <DropdownMenuItem onClick={() => {
                      console.log('Generate Proposal clicked');
                      // TODO: Open proposal modal when types are fixed
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Generate Proposal</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      console.log('Generate Invoice clicked');
                      // TODO: Open invoice modal when types are fixed
                    }}>
                      <Receipt className="mr-2 h-4 w-4" />
                      <span>Generate Invoice</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      console.log('Edit Brand clicked');
                      // TODO: Navigate to edit page
                    }}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Brand</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      console.log('Share clicked');
                      // TODO: Open share dialog
                    }}>
                      <Share2 className="mr-2 h-4 w-4" />
                      <span>Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      console.log('Export clicked');
                      // TODO: Export functionality
                    }}>
                      <Download className="mr-2 h-4 w-4" />
                      <span>Export</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Desktop Actions
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsProposalOpen(true)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Proposal
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setIsInvoiceOpen(true)}>
                    <Receipt className="mr-2 h-4 w-4" />
                    Invoice
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 md:py-6">

        <Tabs 
          defaultValue="ai" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as BrandTab)}
        >
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4 md:mb-6">
            <div className={`${isMobile ? 'sticky top-[140px] z-10 bg-background/95 backdrop-blur-sm -mx-4 px-4 pb-2' : ''}`}>
              <TabsList className={`w-full sm:w-auto ${isMobile ? 'grid-cols-2 overflow-x-auto' : 'grid grid-cols-2'}`}>
                <TabsTrigger value="ai" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="truncate">AI Made</span>
                </TabsTrigger>
                <TabsTrigger value="human" className="flex items-center justify-center gap-1.5 text-xs sm:text-sm">
                  <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="truncate">Human Made</span>
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAskingAI(true)}
                className="text-xs sm:text-sm h-9 sm:h-9"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="truncate">Ask AI</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAskingHuman(true)}
                className="text-xs sm:text-sm h-9 sm:h-9"
              >
                <MessageSquare className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="truncate">Ask Human</span>
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {filteredElements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredElements.map((element) => (
                  <div 
                    key={element.id}
                    className="relative group bg-card rounded-lg sm:rounded-xl border overflow-hidden hover:shadow-md sm:hover:shadow-lg transition-all duration-200 active:scale-[0.99]"
                  >
                    <div className="p-3 sm:p-4">
                      <div className="flex justify-between items-start gap-2 mb-2 sm:mb-3">
                        <h3 className="font-medium text-sm sm:text-base line-clamp-1">{element.title}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 -mt-1 -mr-1.5 text-muted-foreground hover:text-foreground"
                            >
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="text-sm">
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-sm">
                              <Copy className="mr-2 h-4 w-4" />
                              <span>Duplicate</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="min-h-[100px] sm:min-h-[120px] -mx-1 sm:mx-0">
                        {renderElementContent(element)}
                      </div>
                    </div>
                    <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-muted/40 text-[10px] sm:text-xs text-muted-foreground flex justify-between items-center">
                      <span className="truncate">
                        {element.createdBy === 'ai' ? 'AI Generated' : 'Human Designed'}
                      </span>
                      <span className="ml-2 whitespace-nowrap">
                        {new Date(element.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: new Date(element.updatedAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-6 sm:p-8 border rounded-lg bg-muted/20">
                <p className="text-muted-foreground text-sm sm:text-base">
                  No {activeTab === 'ai' ? 'AI generated' : 'human designed'} elements yet.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="mt-4 text-sm"
                  onClick={() => setActiveTab(activeTab === 'ai' ? 'human' : 'ai')}
                >
                  View {activeTab === 'ai' ? 'human designed' : 'AI generated'} elements
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals - Simplified for now */}
      {/* TODO: Add proper Invoice and Proposal modals when types are fixed */}
    </div>
  );
};

export default BrandDetails;
