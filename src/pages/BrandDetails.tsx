import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BrandChat } from '@/components/brand-wizard/BrandChat';
import { MessageSquare, Sparkles, Download, Copy, Edit, Share2, MoreVertical, ArrowLeft } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<BrandTab>('ai');
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [isAskingHuman, setIsAskingHuman] = useState(false);
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
              // Add more mock elements as needed
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
    <div className="relative min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{brand.name}</h1>
            <p className="text-muted-foreground">
              Created on {new Date(brand.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="ai" 
          className="w-full"
          onValueChange={(value) => setActiveTab(value as BrandTab)}
        >
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="ai">
                <Sparkles className="mr-2 h-4 w-4" />
                Made with AI
              </TabsTrigger>
              <TabsTrigger value="human">
                <MessageSquare className="mr-2 h-4 w-4" />
                Designed with Humans
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAskingAI(true)}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Ask AI
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAskingHuman(true)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Ask Human
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {filteredElements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredElements.map((element) => (
                  <div 
                    key={element.id}
                    className="relative group bg-card rounded-xl border overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{element.title}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">More options</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              <span>Duplicate</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="min-h-[120px]">
                        {renderElementContent(element)}
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-muted/50 text-xs text-muted-foreground flex justify-between items-center">
                      <span>
                        {element.createdBy === 'ai' ? 'AI Generated' : 'Human Designed'}
                      </span>
                      <span>
                        {new Date(element.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <p className="text-muted-foreground">
                  No {activeTab === 'ai' ? 'AI generated' : 'human designed'} elements yet.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab(activeTab === 'ai' ? 'human' : 'ai')}
                >
                  View {activeTab === 'ai' ? 'human designed' : 'AI generated'} elements
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Modals */}
      <BrandChat
        isOpen={isAskingAI}
        onClose={() => setIsAskingAI(false)}
        mode="ai"
        brandId={brand.id}
        context={{
          elementName: brand.name,
        }}
      />
      
      <BrandChat
        isOpen={isAskingHuman}
        onClose={() => setIsAskingHuman(false)}
        mode="human"
        brandId={brand.id}
        context={{
          elementName: brand.name,
        }}
      />
    </div>
  );
};

export default BrandDetails;
