import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

export function BrandFormStep5() {
  const { control } = useFormContext();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Vision & Strategy</h3>
        <p className="text-sm text-muted-foreground">
          Help us understand your brand's future direction and competitive landscape.
        </p>
      </div>

      <FormField
        control={control}
        name="one_year_vision"
        render={({ field }) => (
          <FormItem>
            <FormLabel>1-Year Vision *</FormLabel>
            <FormDescription className="mb-2">
              Where do you see your brand in one year?
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="E.g., In one year, we aim to establish ourselves as the leading provider of sustainable skincare in the local market..."
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
        name="five_year_vision"
        render={({ field }) => (
          <FormItem>
            <FormLabel>5-Year Vision *</FormLabel>
            <FormDescription className="mb-2">
              What are your long-term goals for the brand?
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="E.g., In five years, we aim to expand nationally, with a strong online presence and multiple retail partnerships..."
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
        name="challenges"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Main Challenges</FormLabel>
            <FormDescription className="mb-2">
              What are the biggest challenges your brand faces?
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="E.g., Breaking into a competitive market, building brand awareness, managing production costs..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="competitors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Main Competitors</FormLabel>
            <FormDescription className="mb-2">
              Who are your main competitors? What makes you different?
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="E.g., Competitor A, Competitor B, Competitor C. We differentiate by..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="launch_timing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Launch Timing</FormLabel>
              <FormControl>
                <Input 
                  placeholder="E.g., Q1 2024, Already launched, etc." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="budget_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Range</FormLabel>
              <FormControl>
                <Input 
                  placeholder="E.g., $5,000 - $10,000" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="likes_dislikes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Likes & Dislikes</FormLabel>
            <FormDescription className="mb-2">
              Any specific design styles, colors, or elements you like or dislike?
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="E.g., I love minimalist designs with bold typography. I don't like overly complex or busy designs..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="extra_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes</FormLabel>
            <FormDescription className="mb-2">
              Anything else you'd like us to know about your brand?
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="Any additional information that might help us understand your brand better..."
                className="min-h-[80px]"
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
