import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useUser } from "@/hooks/usePortfolioAuth";
import { useVolumes } from "@/hooks/useVolumes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";

const insightSchema = z.object({
  value: z.string().min(1, "Content cannot be empty"),
});

const volumeFormSchema = z.object({
  volumeNumber: z.string().min(1, "Volume number is required"),
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  writer: z.string().min(1, "Writer is required"),
  goal: z.string().min(1, "Goal is required"),
  summary: z.string().min(1, "Summary is required"),
  leadParagraph: z.string().min(1, "Lead paragraph is required"),
  heroImageUrl: z
    .string()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
  orderIndex: z.coerce.number().int().min(0, "Order must be zero or greater"),
  isPublished: z.boolean().default(false),
  insights: z
    .array(insightSchema)
    .min(1, "Add at least one Field Notes entry"),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildContentArray = (lead: string, insights: { value: string }[]) => {
  const trimmedLead = lead.trim();
  const rest = insights.map((item) => item.value.trim()).filter(Boolean);
  return trimmedLead ? [trimmedLead, ...rest] : rest;
};

type VolumeFormValues = z.infer<typeof volumeFormSchema>;

export default function ManagementVolumes() {
  const navigate = useNavigate();
  const { user, role } = useUser();
  const { toast } = useToast();
  const {
    volumes,
    isLoading,
    error,
    createVolume,
    updateVolume,
    deleteVolume,
  } = useVolumes();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVolume, setEditingVolume] = useState<VolumeRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user || !(role?.is_admin || role?.is_moderator)) {
      navigate("/");
    }
  }, [user, role, navigate]);

  const sortedVolumes = useMemo(
    () => [...volumes].sort((a, b) => a.orderIndex - b.orderIndex),
    [volumes]
  );

  const form = useForm<VolumeFormValues>({
    resolver: zodResolver(volumeFormSchema),
    defaultValues: {
      volumeNumber: "",
      slug: "",
      title: "",
      writer: "",
      goal: "",
      summary: "",
      leadParagraph: "",
      heroImageUrl: "",
      orderIndex: volumes.length,
      isPublished: false,
      insights: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "insights",
  });

  useEffect(() => {
    if (!dialogOpen) {
      return;
    }

    if (editingVolume) {
      const lead = editingVolume.leadParagraph ?? editingVolume.content[0] ?? "";
      const insights = (lead ? editingVolume.content.slice(1) : editingVolume.content).map(
        (entry) => ({ value: entry })
      );

      form.reset({
        volumeNumber: editingVolume.volumeNumber,
        slug: editingVolume.slug,
        title: editingVolume.title,
        writer: editingVolume.writer,
        goal: editingVolume.goal,
        summary: editingVolume.summary,
        leadParagraph: lead,
        heroImageUrl: editingVolume.heroImageUrl ?? "",
        orderIndex: editingVolume.orderIndex ?? 0,
        isPublished: editingVolume.isPublished,
        insights: insights.length > 0 ? insights : [{ value: "" }],
      });
    } else {
      form.reset({
        volumeNumber: `Volume ${volumes.length + 1}`,
        slug: "",
        title: "",
        writer: "",
        goal: "",
        summary: "",
        leadParagraph: "",
        heroImageUrl: "",
        orderIndex: volumes.length,
        isPublished: false,
        insights: [{ value: "" }],
      });
    }
  }, [dialogOpen, editingVolume, form, volumes.length]);

  const titleValue = form.watch("title");
  const slugValue = form.watch("slug");

  useEffect(() => {
    if (!dialogOpen) return;
    if (editingVolume) return;
    if (slugValue) return;
    if (!titleValue) return;

    form.setValue("slug", slugify(titleValue));
  }, [titleValue, slugValue, editingVolume, dialogOpen, form]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingVolume(null);
  };

  const handleSubmit = async (values: VolumeFormValues) => {
    setIsSaving(true);
    const payload = {
      slug: values.slug,
      volumeNumber: values.volumeNumber,
      title: values.title,
      writer: values.writer,
      goal: values.goal,
      summary: values.summary,
      leadParagraph: values.leadParagraph,
      heroImageUrl: values.heroImageUrl?.trim() ? values.heroImageUrl.trim() : undefined,
      isPublished: values.isPublished,
      orderIndex: values.orderIndex,
      content: buildContentArray(values.leadParagraph, values.insights),
    } as Partial<VolumeRecord>;

    try {
      if (editingVolume) {
        await updateVolume({
          ...(editingVolume as VolumeRecord),
          ...payload,
          id: editingVolume.id,
          content: buildContentArray(values.leadParagraph, values.insights),
        });
        toast({
          title: "Volume updated",
          description: `${values.title} saved successfully`,
        });
      } else {
        await createVolume({
          ...payload,
          orderIndex: values.orderIndex ?? volumes.length,
          isPublished: values.isPublished,
        });
        toast({
          title: "Volume created",
          description: `${values.title} added to the library`,
        });
      }
      handleCloseDialog();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.message ?? "Failed to save volume",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (volume: VolumeRecord) => {
    const confirmDelete = window.confirm(
      `Delete ${volume.title}? This action cannot be undone.`
    );

    if (!confirmDelete) return;
    try {
      await deleteVolume(volume.id);
      toast({
        title: "Volume deleted",
        description: `${volume.title} has been removed`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err?.message ?? "Failed to delete volume",
        variant: "destructive",
      });
    }
  };

  const startCreate = () => {
    setEditingVolume(null);
    setDialogOpen(true);
  };

  const startEdit = (volume: VolumeRecord) => {
    setEditingVolume(volume);
    setDialogOpen(true);
  };

  if (!user || !(role?.is_admin || role?.is_moderator)) {
    return null;
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Volumes Management – KING</title>
      </Helmet>

      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Volumes Management</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Publish and update KING Volumes. Each entry powers the public volumes experience and individual detail pages.
          </p>
        </div>
        <Button onClick={startCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Volume
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="py-12 text-center text-destructive">
            Failed to load volumes. Please try again.
          </div>
        ) : sortedVolumes.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg font-medium mb-2">No volumes published yet</p>
            <p className="text-muted-foreground mb-6">
              Create your first KING Volume to power the public content experience.
            </p>
            <Button onClick={startCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Volume
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[120px]">Order</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Writer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedVolumes.map((volume) => (
                <TableRow key={volume.id}>
                  <TableCell>#{volume.orderIndex ?? 0}</TableCell>
                  <TableCell>
                    <div className="font-medium">{volume.volumeNumber}</div>
                    <div className="text-xs text-muted-foreground">{volume.slug}</div>
                  </TableCell>
                  <TableCell>{volume.title}</TableCell>
                  <TableCell>{volume.writer}</TableCell>
                  <TableCell>
                    {volume.isPublished ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                        Draft
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(volume)}
                        className="h-8 w-8"
                        aria-label={`Edit ${volume.title}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(volume)}
                        className="h-8 w-8"
                        aria-label={`Delete ${volume.title}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingVolume ? "Edit Volume" : "Create Volume"}
            </DialogTitle>
            <DialogDescription>
              {editingVolume
                ? "Update volume details and key field notes."
                : "Publish a new KING Volume for the public library."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                      control={form.control}
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
                <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isSaving}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingVolume ? "Save changes" : "Create volume"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
