import { Button } from '@/components/ui/button';
import { Upload, ImageIcon } from 'lucide-react';

type LogoStepProps = {
  data: {
    logo?: {
      url: string;
      alt: string;
      isCustom?: boolean;
    };
  };
  onDataChange: (data: any) => void;
};

export function LogoStep({ data, onDataChange }: LogoStepProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onDataChange({
          ...data,
          logo: {
            url: event.target?.result as string,
            alt: 'Custom uploaded logo',
            isCustom: true
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Upload Custom Logo</h3>
        <p className="text-sm text-muted-foreground">
          Upload your own logo or keep the AI-generated one
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          {data.logo?.url ? (
            <div className="space-y-4">
              <div className="mx-auto w-48 h-48 flex items-center justify-center bg-muted/20 rounded-lg">
                <img
                  src={data.logo.url}
                  alt={data.logo.alt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Current logo: {data.logo.isCustom ? 'Custom' : 'AI-Generated'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No logo uploaded
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button asChild variant="outline">
            <label className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              {data.logo?.url ? 'Change Logo' : 'Upload Logo'}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </Button>
        </div>
      </div>
    </div>
  );
}
