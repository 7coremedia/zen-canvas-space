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
import { X, Check, Crown, Shield, Zap, Target, FileText, Download, Eye } from 'lucide-react';
import { OnboardingResponse } from '@/types/supabase';
import { PackageType, PACKAGES, BUDGET_RANGES } from '@/config/packages';
import { calculateBrandPricing, getBestPackageRecommendation, formatCurrency, calculatePaymentBreakdown } from '@/lib/pricing/calculator';
import { generateProposal, generateProposalSummary } from '@/lib/templates/proposalTemplate';
import { toast } from '@/hooks/use-toast';
import DocsEditor from '@/components/editor/DocsEditor';
import { exportHtmlToPdf } from '@/lib/pdf/export';
import { EDITOR_TEMPLATES } from '@/config/editorTemplates';

interface ProposalGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  brandData: OnboardingResponse;
}

interface ProposalFormData {
  clientInfo: {
    name: string;
    contact: string;
    email: string;
    company: string;
  };
  selectedPackage: PackageType | null;
  customizations: {
    timeline: string;
    specificNeeds: string;
    additionalNotes: string;
  };
}

const ProposalGenerator = ({ isOpen, onClose, brandData }: ProposalGeneratorProps) => {
  const [formData, setFormData] = useState<ProposalFormData>({
    clientInfo: {
      name: brandData.sender_name || '',
      contact: brandData.sender_name || '',
      email: brandData.sender_email || '',
      company: brandData.brand_name || ''
    },
    selectedPackage: null,
    customizations: {
      timeline: '',
      specificNeeds: '',
      additionalNotes: ''
    }
  });

  const [pricingAnalysis, setPricingAnalysis] = useState<any>(null);
  const [recommendedPackage, setRecommendedPackage] = useState<PackageType | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<string>('');

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

  const generateProposalPreview = () => {
    if (!formData.selectedPackage || !pricingAnalysis) return;

    const proposalContext = {
      brandData,
      proposalData: formData,
      totalPrice: pricingAnalysis.adjustedPrice,
      upfrontPayment: Math.round(pricingAnalysis.adjustedPrice * 0.5),
      balanceDue: pricingAnalysis.adjustedPrice - Math.round(pricingAnalysis.adjustedPrice * 0.5)
    };

    // Build rich HTML using editor template
    const pkg = PACKAGES[formData.selectedPackage];
    const payment = calculatePaymentBreakdown(proposalContext.totalPrice);
    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const purpose = brandData.challenges 
      || brandData.brand_personality?.audiencePainPoints 
      || 'We aim to solve visibility and growth challenges.';
    const outcomesList = [
      `**Specific:** ${brandData.usp || 'Clear differentiation in your market'}`,
      `**Measurable:** ${formData.customizations.specificNeeds || 'KPIs to be finalized during strategy'}`,
      `**Achievable:** Within ${formData.customizations.timeline || pkg.timeline}`,
      `**Realistic:** Calibrated to ${brandData.industry || 'your market'}`,
      '**Timely:** Delivered on schedule',
    ]
      .map(item => `<li>${item}</li>`) 
      .join('');
    const solution = `We will leverage your offerings (${brandData.offerings || 'core offerings'}) across distribution (${brandData.brand_personality?.distributionChannels?.join(', ') || 'relevant channels'}) and platforms (${brandData.brand_personality?.preferredPlatforms?.join(', ') || 'priority platforms'}) to scale your brand.`;
    const scope = `Deliverables include assets defined under the <strong>${pkg.name}</strong> package.`;

    let html = EDITOR_TEMPLATES.proposal
      .replace('[[CLIENT]]', formData.clientInfo.company || brandData.brand_name || 'Client')
      .replaceAll('[[VENDOR]]', 'KING')
      .replace('[[DATE]]', dateStr)
      .replace('[[TIMELINE]]', formData.customizations.timeline || pkg.timeline)
      .replace('[[PURPOSE]]', purpose)
      .replace('[[OUTCOMES_LIST]]', outcomesList)
      .replace('[[SOLUTION]]', solution)
      .replace('[[SCOPE]]', scope)
      .replace('[[TOTAL_PRICE]]', payment.totalFormatted)
      .replace('[[UPFRONT_PAYMENT]]', payment.upfrontFormatted)
      .replace('[[BALANCE_DUE]]', payment.balanceFormatted);

    setGeneratedProposal(html);
    setPreviewMode(true);
  };

  const downloadProposal = () => {
    // TODO: Implement PDF generation
    toast({
      title: 'Proposal Generated!',
      description: 'Your proposal has been generated and will be downloaded shortly.',
    });
  };

  const getPackageIcon = (packageType: PackageType) => {
    switch (packageType) {
      case 'crest': return <Crown className="h-5 w-5" />;
      case 'arsenal': return <Shield className="h-5 w-5" />;
      case 'throne': return <Target className="h-5 w-5" />;
      case 'conquest': return <Zap className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Generate Proposal
          </DialogTitle>
          <DialogDescription>
            Create a professional proposal based on {brandData.brand_name}'s brand profile and selected package.
          </DialogDescription>
        </DialogHeader>

        {!previewMode ? (
          <Tabs defaultValue="client" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="client">Client Info</TabsTrigger>
              <TabsTrigger value="package">Package Selection</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
            </TabsList>

            <TabsContent value="client" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                  <CardDescription>Enter the client details for this proposal</CardDescription>
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
                            <div className="pt-2">
                              <div className="text-sm font-medium mb-1">Key Features:</div>
                              <div className="space-y-1">
                                {pkg.features.slice(0, 3).map((feature, index) => (
                                  <div key={index} className="text-xs text-muted-foreground">
                                    • {feature}
                                  </div>
                                ))}
                                {pkg.features.length > 3 && (
                                  <div className="text-xs text-muted-foreground">
                                    +{pkg.features.length - 3} more features
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {pricingAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Original Price:</span>
                        <span className="font-medium">{formatCurrency(pricingAnalysis.originalPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Adjusted Price:</span>
                        <span className="font-bold text-lg">{formatCurrency(pricingAnalysis.adjustedPrice)}</span>
                      </div>
                      {pricingAnalysis.savings > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Savings:</span>
                          <span className="font-medium">-{formatCurrency(pricingAnalysis.savings)}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{pricingAnalysis.budgetAnalysis}</p>
                      </div>
                      {pricingAnalysis.smartRecommendations.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2">Smart Recommendations:</div>
                          <ul className="space-y-1">
                            {pricingAnalysis.smartRecommendations.map((rec, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                • {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="customize" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customize Proposal</CardTitle>
                  <CardDescription>Add specific details and customizations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="timeline">Project Timeline</Label>
                    <Select
                      value={formData.customizations.timeline}
                      onValueChange={(value) => handleNestedInputChange('customizations', 'timeline', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-3 weeks">2-3 weeks</SelectItem>
                        <SelectItem value="1 month">1 month</SelectItem>
                        <SelectItem value="6-8 weeks">6-8 weeks</SelectItem>
                        <SelectItem value="2-3 months">2-3 months</SelectItem>
                        <SelectItem value="3-6 months">3-6 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="specificNeeds">Specific Needs</Label>
                    <Textarea
                      id="specificNeeds"
                      value={formData.customizations.specificNeeds}
                      onChange={(e) => handleNestedInputChange('customizations', 'specificNeeds', e.target.value)}
                      placeholder="Any specific requirements or special requests..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.customizations.additionalNotes}
                      onChange={(e) => handleNestedInputChange('customizations', 'additionalNotes', e.target.value)}
                      placeholder="Any additional notes for the proposal..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Proposal Preview</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={() => exportHtmlToPdf(generatedProposal, 'proposal.pdf')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
            <DocsEditor initialContent={generatedProposal} onExport={(html) => exportHtmlToPdf(html, 'proposal.pdf')} />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {!previewMode ? (
            <Button 
              onClick={generateProposalPreview}
              disabled={!formData.selectedPackage || !formData.clientInfo.company}
            >
              <Eye className="h-4 w-4 mr-2" />
              Generate Preview
            </Button>
          ) : (
            <Button onClick={downloadProposal}>
              <Download className="h-4 w-4 mr-2" />
              Download Proposal
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalGenerator;
