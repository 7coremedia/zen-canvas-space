import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VolumeRecord } from "@/types/volume";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2 } from "lucide-react";

const insightSchema = z.object({
  value: z.string().min(1, "Content cannot be empty"),
});

export const volumeFormSchema = z.object({
  volumeNumber: z.string().min(1, "Volume number is required"),
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  writer: z.string().min(1, "Writer is required"),
  goal: z.string().min(1, "Goal is required"),
  summary: z.string().min(1, "Summary is required"),
  leadParagraph: z.string().min(1, "Editorial lede is required"),
  heroImageUrl: z
    .string()
    .optional()
    .refine((value) => !value || value.trim().length === 0 || /^https?:\/\//.test(value), {
      message: "Enter a valid URL starting with http(s)",
    }),
  orderIndex: z.coerce.number().int().min(0, "Order must be zero or greater"),
  isPublished: z.boolean().default(false),
  insights: z.array(insightSchema).min(1, "Add at least one Field Note"),

});

export type VolumeFormValues = z.infer<typeof volumeFormSchema>;

export type VolumeSubmitPayload = {
  slug: string;
  volumeNumber: string;
  title: string;
  writer: string;
  goal: string;
  summary: string;
  leadParagraph: string;
  heroImageUrl?: string;
  orderIndex: number;
  isPublished: boolean;
  content: string[];
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildContentArray = (lead: string, insights: { value?: string }[]) => {
  const trimmedLead = lead.trim();
  const rest = insights
    .map((item) => item.value?.trim() ?? "")
    .filter((entry) => entry.length > 0);
  return trimmedLead ? [trimmedLead, ...rest] : rest;
};

const getInsightsFromContent = (record?: VolumeRecord | null) => {
  if (!record?.content || record.content.length === 0) {
    return [{ value: "" }];
  }
  const [, ...rest] = record.content;
  if (rest.length > 0) {
    return rest.map((entry) => ({ value: entry }));
  }
  return [{ value: record.content[0] ?? "" }];
};

const getLeadParagraph = (record?: VolumeRecord | null) => {
  if (record?.leadParagraph) return record.leadParagraph;
  return record?.content?.[0] ?? "";
};

interface VolumeFormProps {
  initialData?: VolumeRecord | null;
  defaultOrderIndex?: number;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (payload: VolumeSubmitPayload) => Promise<void>;
  onCancel?: () => void;
}

export default function VolumeForm({
  initialData,
  defaultOrderIndex = 0,
  isSubmitting,
  submitLabel = "Save volume",
  onSubmit,
  onCancel,
}: VolumeFormProps) {
  const form = useForm<VolumeFormValues>({
    resolver: zodResolver(volumeFormSchema),
    defaultValues: {
      volumeNumber: initialData?.volumeNumber ?? "",
      slug: initialData?.slug ?? "",
      title: initialData?.title ?? "",
      writer: initialData?.writer ?? "",
      goal: initialData?.goal ?? "",
      summary: initialData?.summary ?? "",
      leadParagraph: getLeadParagraph(initialData),
      heroImageUrl: initialData?.heroImageUrl ?? "",
      orderIndex: initialData?.orderIndex ?? defaultOrderIndex,
      isPublished: initialData?.isPublished ?? false,
      insights: getInsightsFromContent(initialData),
    },
  });

  const { control, watch, setValue, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "insights",
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");

  useEffect(() => {
    if (!initialData && titleValue && !slugValue) {
      setValue("slug", slugify(titleValue), { shouldDirty: true });
    }
  }, [initialData, titleValue, slugValue, setValue]);

  useEffect(() => {
    if (!initialData) {
      setValue("orderIndex", defaultOrderIndex);
    }
  }, [initialData, defaultOrderIndex, setValue]);

  const submitHandler = async (values: VolumeFormValues) => {
    await onSubmit({
      slug: values.slug,
      volumeNumber: values.volumeNumber,
      title: values.title,
      writer: values.writer,
      goal: values.goal,
      summary: values.summary,
      leadParagraph: values.leadParagraph,
      heroImageUrl: values.heroImageUrl?.trim() ? values.heroImageUrl.trim() : undefined,
      orderIndex: values.orderIndex,
      isPublished: values.isPublished,
      content: buildContentArray(values.leadParagraph, values.insights),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={control}
            name="volumeNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume Number</FormLabel>
                <FormControl>
                  <Input placeholder="Volume I" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="volume-i" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Brand Systems for Bold African Futures" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="writer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Writer</FormLabel>
                <FormControl>
                  <Input placeholder="Chima Obidi, Strategy Lead" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal</FormLabel>
                <FormControl>
                  <Input placeholder="Position KING as the go-to culture-led branding studio." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="summary"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Summary</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="A friendly guide to building a full identity system..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="leadParagraph"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Editorial Lede</FormLabel>
                <FormControl>
                  <Textarea rows={3} placeholder="Strong brands start with a promise..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="heroImageUrl"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Hero Image URL (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="orderIndex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order Index</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <FormLabel>Published</FormLabel>
                  <div className="text-xs text-muted-foreground">
                    Published volumes appear on the public site.
                  </div>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <FormLabel className="text-sm font-medium">Field Notes / Key Moves</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ value: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add note
            </Button>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {fields.map((fieldItem, index) => (
              <FormField
                key={fieldItem.id}
                control={control}
                name={`insights.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">
                      Note {index + 1}
                    </FormLabel>
                    <div className="flex items-start gap-2">
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 mt-1"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        aria-label={`Remove note ${index + 1}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
