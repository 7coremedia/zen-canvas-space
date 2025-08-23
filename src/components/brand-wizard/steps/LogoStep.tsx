import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, Trash2, Upload } from 'lucide-react';

type LogoStepProps = {
  data: {
    logo?: string;
    logoAltText?: string;
  };
  onDataChange: (data: any) => void;
};

export function LogoStep({ data, onDataChange }: LogoStepProps) {
  const [preview, setPreview] = useState<string | null>(data.logo || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onDataChange({ ...data, logo: result });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const removeLogo = () => {
    setPreview(null);
    onDataChange({ ...data, logo: undefined, logoAltText: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Upload Your Logo</h3>
        <p className="text-sm text-muted-foreground">
          Upload your brand logo. We recommend using a high-resolution image with a transparent background.
        </p>
      </div>

      <div className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            {preview ? (
              <div className="relative group">
                <div className="relative w-48 h-48 flex items-center justify-center bg-muted/50 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain p-4"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeLogo();
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ImagePlus className="h-12 w-12 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium">Drag and drop your logo here</p>
                  <p className="text-xs">or</p>
                </div>
              </>
            )}
            
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              <Upload className="mr-2 h-4 w-4" />
              {preview ? 'Change Logo' : 'Select Logo'}
            </Button>
            
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {preview && (
          <div className="space-y-2">
            <Label htmlFor="logoAltText">Logo Alt Text</Label>
            <Input
              id="logoAltText"
              placeholder="E.g., Company Name Logo"
              value={data.logoAltText || ''}
              onChange={(e) => onDataChange({ ...data, logoAltText: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Add descriptive text for accessibility (screen readers).
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t">
        <h4 className="text-sm font-medium mb-2">Logo Guidelines</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Use high-resolution images (min 500x500px)</li>
          <li>• PNG format with transparent background recommended</li>
          <li>• Keep important elements away from edges</li>
          <li>• File size should be less than 5MB</li>
        </ul>
      </div>
    </div>
  );
}
