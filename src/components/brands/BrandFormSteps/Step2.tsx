import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export function BrandFormStep2() {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="offerings"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What products or services do you offer? *</FormLabel>
            <FormDescription className="mb-2">
              Describe what you sell or provide in detail.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="E.g., We offer premium organic skincare products made with sustainably sourced ingredients..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="usp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What makes you unique? (USP) *</FormLabel>
            <FormDescription className="mb-2">
              What sets you apart from competitors?
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="E.g., Our products are 100% organic, cruelty-free, and packaged in biodegradable materials..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="problem_solved"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What problem does your brand solve? *</FormLabel>
            <FormDescription className="mb-2">
              Explain the main problem your customers have that you help with.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="E.g., Many people struggle with sensitive skin and can't find gentle yet effective skincare solutions..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
