import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, Check, Crown, Shield, Zap, Target, Receipt, Download, Eye, Calculator } from 'lucide-react';
import { OnboardingResponse } from '@/types/supabase';
import { PackageType, PACKAGES, BUDGET_RANGES } from '@/config/packages';
import { getBestPackageRecommendation, formatCurrency, calculatePaymentBreakdown } from '@/lib/pricing/calculator';
import { generateInvoice, generateInvoiceSummary, createInvoiceContext } from '@/lib/templates/invoiceTemplate';
import BlocksEditor, { BlocksData } from '@/components/editor/BlocksEditor';
import { generateInvoiceBlocks } from '@/lib/templates/invoiceBlocks';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InvoiceGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  brandData: OnboardingResponse;
}

interface InvoiceFormData {
  clientInfo: {
    name: string;
    contact: string;
    email: string;
    company: string;
    address: string;
  };
  selectedPackage: PackageType | null;
  customizations: {
    finalPrice: number;
    adjustments: Array<{
      reduction: number;
      feature: string;
      description: string;
    }>;
    paymentTerms: string;
  };
}

const InvoiceGenerator = ({ isOpen, onClose, brandData }: InvoiceGeneratorProps) => {
  const [formData, setFormData] = useState<InvoiceFormData>({
    clientInfo: {
      name: brandData.sender_name || '',
      contact: brandData.sender_name || '',
      email: brandData.sender_email || '',
      company: brandData.brand_name || '',
      address: ''
    },
    selectedPackage: null,
    customizations: {
      finalPrice: 0,
      adjustments: [],
      paymentTerms: '50% upfront, 50% on delivery'
    }
  });

  const [pricingAnalysis, setPricingAnalysis] = useState<any>(null);
  const [recommendedPackage, setRecommendedPackage] = useState<PackageType | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [generatedInvoiceBlocks, setGeneratedInvoiceBlocks] = useState<BlocksData | null>(null);
  // Adjustments removed for simplicity

  // Get package recommendations based on brand budget
  useEffect(() => {
    if (brandData.budget_range) {
      const recommendation = getBestPackageRecommendation({
        budgetRange: brandData.budget_range,
        industry: brandData.industry || 'Other',
        businessModel: brandData.businessModel || 'B2C',
        pricePositioning: brandData.pricePositioning || 50,
        launchTiming: brandData.launch_timing || '2-3 months',
        primaryAudience: brandData.primary_audience?.split(',') || ['Consumers']
      });
      
      setRecommendedPackage(recommendation.primary);
      setFormData(prev => ({
        ...prev,
        selectedPackage: recommendation.primary
      }));
    }
  }, [brandData]);

  // Calculate pricing when package changes
  useEffect(() => {
    if (formData.selectedPackage) {
      // Use straightforward package pricing: take the max price as the project fee
      const basePrice = PACKAGES[formData.selectedPackage].priceRange[1];
      setFormData(prev => ({
        ...prev,
        customizations: {
          ...prev.customizations,
          finalPrice: basePrice,
          adjustments: []
        }
      }));
      setPricingAnalysis(null);
    }
  }, [formData.selectedPackage, brandData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handlePackageSelect = (packageType: PackageType) => {
    setFormData(prev => ({
      ...prev,
      selectedPackage: packageType
    }));
  };

  // Adjustments removed

  const generateInvoicePreview = async () => {
    if (!formData.selectedPackage) return;

    const invoiceContext = createInvoiceContext(brandData, {
      clientInfo: formData.clientInfo,
      selectedPackage: formData.selectedPackage,
      customizations: formData.customizations
    });

    // Try loading saved blocks first (localStorage + Supabase, prefer freshest)
    let blocks: BlocksData | null = null;
    const storageKey = `blocks:invoice:${brandData.id}`;
    const localRaw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    const localObj = localRaw ? JSON.parse(localRaw) as { data: BlocksData; ts: number } : null;
    const { data: saved, error: loadErr } = await supabase
      .from('onboarding_responses')
      .select('invoice_blocks, invoice_blocks_edited_at')
      .eq('id', brandData.id)
      .single();
    const rowAny = (saved || null) as any;
    const remoteBlocks = (!loadErr && rowAny?.invoice_blocks) ? (rowAny.invoice_blocks as BlocksData) : null;
    const remoteTs = rowAny?.invoice_blocks_edited_at ? new Date(rowAny.invoice_blocks_edited_at as string).getTime() : 0;
    if (localObj && localObj.ts >= (remoteTs || 0)) {
      blocks = localObj.data;
    } else if (remoteBlocks) {
      blocks = remoteBlocks;
      if (typeof window !== 'undefined') localStorage.setItem(storageKey, JSON.stringify({ data: blocks, ts: Date.now() }));
    }
    if (!blocks) {
      blocks = generateInvoiceBlocks({
        brandData,
        invoiceData: {
          clientInfo: formData.clientInfo,
          selectedPackage: formData.selectedPackage,
          customizations: { finalPrice: formData.customizations.finalPrice },
        },
        invoiceNumber: invoiceContext.invoiceNumber,
        dueDate: invoiceContext.dueDate,
      });
      if (typeof window !== 'undefined') localStorage.setItem(storageKey, JSON.stringify({ data: blocks, ts: Date.now() }));
    }

    setGeneratedInvoiceBlocks(blocks);
    setPreviewMode(true);
  };

  const downloadInvoice = () => {
    // TODO: Implement PDF generation
    toast({
      title: 'Invoice Generated!',
      description: 'Your invoice has been generated and will be downloaded shortly.',
    });
  };

  const getPackageIcon = (packageType: PackageType) => {
    switch (packageType) {
      case 'crest': return <Crown className="h-5 w-5" />;
      case 'arsenal': return <Shield className="h-5 w-5" />;
      case 'throne': return <Target className="h-5 w-5" />;
      case 'conquest': return <Zap className="h-5 w-5" />;
      default: return <Receipt className="h-5 w-5" />;
    }
  };

  const getPackageColor = (packageType: PackageType) => {
    switch (packageType) {
      case 'crest': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'arsenal': return 'bg-green-50 border-green-200 text-green-900';
      case 'throne': return 'bg-purple-50 border-purple-200 text-purple-900';
      case 'conquest': return 'bg-orange-50 border-orange-200 text-orange-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const paymentBreakdown = calculatePaymentBreakdown(formData.customizations.finalPrice);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            Generate Invoice
          </DialogTitle>
          <DialogDescription>
            Create a professional invoice for {brandData.brand_name} based on selected package and pricing.
          </DialogDescription>
        </DialogHeader>

        {!previewMode ? (
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client">Client Info</TabsTrigger>
              <TabsTrigger value="package">Package & Pricing</TabsTrigger>
            </TabsList>

            <TabsContent value="client" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                  <CardDescription>Enter the client details for this invoice</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientName">Contact Name</Label>
                      <Input
                        id="clientName"
                        value={formData.clientInfo.name}
                        onChange={(e) => handleNestedInputChange('clientInfo', 'name', e.target.value)}
                        placeholder="Client contact name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientEmail">Email</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientInfo.email}
                        onChange={(e) => handleNestedInputChange('clientInfo', 'email', e.target.value)}
                        placeholder="client@company.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="clientContact">Phone/Contact</Label>
                      <Input
                        id="clientContact"
                        value={formData.clientInfo.contact}
                        onChange={(e) => handleNestedInputChange('clientInfo', 'contact', e.target.value)}
                        placeholder="+234 000 000 0000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="clientCompany">Company Name</Label>
                      <Input
                        id="clientCompany"
                        value={formData.clientInfo.company}
                        onChange={(e) => handleNestedInputChange('clientInfo', 'company', e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="clientAddress">Billing Address</Label>
                    <Textarea
                      id="clientAddress"
                      value={formData.clientInfo.address}
                      onChange={(e) => handleNestedInputChange('clientInfo', 'address', e.target.value)}
                      placeholder="Client billing address"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="package" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Package Selection</CardTitle>
                  <CardDescription>
                    {recommendedPackage && (
                      <span className="text-green-600 font-medium">
                        Recommended: {PACKAGES[recommendedPackage].name} based on your budget
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(PACKAGES).map(([key, pkg]) => (
                      <Card
                        key={key}
                        className={`cursor-pointer transition-all ${
                          formData.selectedPackage === key
                            ? 'ring-2 ring-primary border-primary'
                            : 'hover:shadow-md'
                        } ${getPackageColor(key as PackageType)}`}
                        onClick={() => handlePackageSelect(key as PackageType)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getPackageIcon(key as PackageType)}
                              <CardTitle className="text-lg">{pkg.name}</CardTitle>
                            </div>
                            {formData.selectedPackage === key && (
                              <Check className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          <CardDescription>{pkg.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Investment:</span>
                              <span className="text-lg font-bold">
                                {formatCurrency(pkg.priceRange[0])} - {formatCurrency(pkg.priceRange[1])}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Timeline:</span>
                              <span className="text-sm font-medium">{pkg.timeline}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {formData.selectedPackage && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Pricing Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Package Price:</span>
                        <span className="font-medium">{formatCurrency(PACKAGES[formData.selectedPackage].priceRange[1])}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount:</span>
                        <span>{formatCurrency(formData.customizations.finalPrice)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">Upfront (50%)</div>
                          <div className="font-bold">{paymentBreakdown.upfrontFormatted}</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground">Balance (50%)</div>
                          <div className="font-bold">{paymentBreakdown.balanceFormatted}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Adjustments tab removed */}
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Invoice Preview</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
            {generatedInvoiceBlocks && (
              <BlocksEditor 
                initialData={generatedInvoiceBlocks} 
                title={`Invoice — ${formData.clientInfo.company || brandData.brand_name || ''}`} 
                storageKey={`blocks:invoice:${brandData.id}`}
                onChange={async (data) => {
                  const storageKey = `blocks:invoice:${brandData.id}`;
                  if (typeof window !== 'undefined') localStorage.setItem(storageKey, JSON.stringify({ data, ts: Date.now() }));
                  await supabase
                    .from('onboarding_responses')
                    .update({ invoice_blocks: data, invoice_blocks_edited_at: new Date().toISOString() } as any)
                    .eq('id', brandData.id);
                }}
              />
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!previewMode ? (
            <Button 
              onClick={generateInvoicePreview}
              disabled={!formData.selectedPackage || !formData.clientInfo.company}
            >
              <Eye className="h-4 w-4 mr-2" />
              Generate Preview
            </Button>
          ) : (
            <Button onClick={downloadInvoice}>
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceGenerator;
