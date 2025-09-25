import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import MediaUpload from "@/components/admin/MediaUpload";
import { supabase } from "@/integrations/supabase/client";
import { Partner } from "@/types/portfolio";

const partnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  socialName: z.string().min(1, "Social handle is required"),
  socialLink: z.string().url("Must be a valid URL"),
});

type PartnerFormValues = z.infer<typeof partnerSchema>;

interface PartnerManagerProps {
  portfolioId?: string;
  onError: (message: string) => void;
};

export default function PartnerManager({ 
  portfolioId,
  onError
}: PartnerManagerProps) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isAddingPartner, setIsAddingPartner] = useState(false);

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      socialName: "",
      socialLink: "",
    },
  });

  // Load existing partners
  useEffect(() => {
    if (portfolioId) {
      const loadPartners = async () => {
        const { data, error } = await supabase
          .from("portfolio_partners")
          .select("*")
          .eq("portfolio_id", portfolioId);

        if (error) {
          onError("Failed to load partners");
          return;
        }

        setPartners(data || []);
      };

      loadPartners();
    }
  }, [portfolioId]);

  const onSubmit = async (data: PartnerFormValues) => {
    try {
      if (portfolioId) {
        const { error } = await supabase
          .from("portfolio_partners")
          .insert({
            portfolio_id: portfolioId,
            ...data,
          });

        if (error) throw error;
      }

      const newPartner: Partner = {
        id: Date.now().toString(),
        name: data.name,
        socialName: data.socialName,
        socialLink: data.socialLink
      };
      setPartners([...partners, newPartner]);
      setIsAddingPartner(false);
      form.reset();
    } catch (error) {
      onError("Failed to add partner");
    }
  };

  const removePartner = async (partnerId: string) => {
    try {
      if (portfolioId) {
        const { error } = await supabase
          .from("portfolio_partners")
          .delete()
          .eq("id", partnerId);

        if (error) throw error;
      }

      setPartners(partners.filter(p => p.id !== partnerId));
    } catch (error) {
      onError("Failed to remove partner");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Project Partners</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAddingPartner(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Partner
        </Button>
      </div>

      {/* Existing Partners */}
      <div className="space-y-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p className="font-medium">{partner.name}</p>
              <p className="text-sm text-muted-foreground">
                {partner.socialName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removePartner(partner.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add Partner Form */}
      {isAddingPartner && (
        <div className="rounded-lg border p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partner Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Handle</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="@username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socialLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Social Link</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="https://instagram.com/username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsAddingPartner(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Partner</Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}