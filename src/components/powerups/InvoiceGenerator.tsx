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
import { calculateBrandPricing, getBestPackageRecommendation, formatCurrency, calculatePaymentBreakdown } from '@/lib/pricing/calculator';
import { generateInvoice, generateInvoiceSummary, createInvoiceContext } from '@/lib/templates/invoiceTemplate';
import { toast } from '@/hooks/use-toast';

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
      name: '',
      contact: '',
      email: '',
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
  const [generatedInvoice, setGeneratedInvoice] = useState<string>('');
  const [availableAdjustments, setAvailableAdjustments] = useState<any[]>([]);

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
    if (formData.selectedPackage && brandData.budget_range) {
      const analysis = calculateBrandPricing({
        budgetRange: brandData.budget_range,
        industry: brandData.industry || 'Other',
        businessModel: brandData.businessModel || 'B2C',
        pricePositioning: brandData.pricePositioning || 50,
        launchTiming: brandData.launch_timing || '2-3 months',
        primaryAudience: brandData.primary_audience?.split(',') || ['Consumers']
      }, formData.selectedPackage);

      setPricingAnalysis(analysis);
      setFormData(prev => ({
        ...prev,
        customizations: {
          ...prev.customizations,
          finalPrice: analysis.adjustedPrice,
          adjustments: analysis.adjustments
        }
      }));
      setAvailableAdjustments(analysis.adjustments);
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

  const toggleAdjustment = (adjustment: any) => {
    setFormData(prev => {
      const isSelected = prev.customizations.adjustments.some(adj => adj.feature === adjustment.feature);
      
      if (isSelected) {
        // Remove adjustment
        const newAdjustments = prev.customizations.adjustments.filter(adj => adj.feature !== adjustment.feature);
        const newPrice = prev.customizations.finalPrice + adjustment.reduction;
        return {
          ...prev,
          customizations: {
            ...prev.customizations,
            adjustments: newAdjustments,
            finalPrice: newPrice
          }
        };
      } else {
        // Add adjustment
        const newAdjustments = [...prev.customizations.adjustments, adjustment];
        const newPrice = prev.customizations.finalPrice - adjustment.reduction;
        return {
          ...prev,
          customizations: {
            ...prev.customizations,
            adjustments: newAdjustments,
            finalPrice: Math.max(newPrice, PACKAGES[packageType].priceRange[0])
          }
        };
      }
    });
  };

  const generateInvoicePreview = () => {
    if (!formData.selectedPackage) return;

    const invoiceContext = createInvoiceContext(brandData, {
      clientInfo: formData.clientInfo,
      selectedPackage: formData.selectedPackage,
      customizations: formData.customizations
    });

    const invoice = generateInvoice(invoiceContext);
    setGeneratedInvoice(invoice);
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="client">Client Info</TabsTrigger>
              <TabsTrigger value="package">Package & Pricing</TabsTrigger>
              <TabsTrigger value="adjustments">Adjustments</TabsTrigger>
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
                      {formData.customizations.adjustments.length > 0 && (
                        <>
                          <div className="text-sm text-muted-foreground">Adjustments:</div>
                          {formData.customizations.adjustments.map((adj, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">- {adj.feature}</span>
                              <span className="text-green-600">-{formatCurrency(adj.reduction)}</span>
                            </div>
                          ))}
                        </>
                      )}
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

            <TabsContent value="adjustments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Package Adjustments</CardTitle>
                  <CardDescription>
                    Select adjustments to customize the package and pricing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {availableAdjustments.length > 0 ? (
                    <div className="space-y-3">
                      {availableAdjustments.map((adjustment, index) => {
                        const isSelected = formData.customizations.adjustments.some(adj => adj.feature === adjustment.feature);
                        return (
                          <div
                            key={index}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-muted hover:border-primary/50'
                            }`}
                            onClick={() => toggleAdjustment(adjustment)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                  isSelected
                                    ? 'border-primary bg-primary'
                                    : 'border-muted'
                                }`}>
                                  {isSelected && <Check className="h-3 w-3 text-white" />}
                                </div>
                                <div>
                                  <div className="font-medium">{adjustment.feature}</div>
                                  <div className="text-sm text-muted-foreground">{adjustment.description}</div>
                                </div>
                              </div>
                              <div className="text-green-600 font-medium">
                                -{formatCurrency(adjustment.reduction)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No adjustments available for this package
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
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
                <Button onClick={downloadInvoice}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
            <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">{generatedInvoice}</pre>
            </div>
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
