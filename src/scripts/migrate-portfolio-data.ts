import { supabase } from "@/integrations/supabase/client";
import { caseStudies } from "@/data/caseStudies";

// Migration script to move existing portfolio data to Supabase
export async function migratePortfolioData() {
  console.log("Starting portfolio data migration...");

  try {
    // Ensure we have an authenticated user for RLS (inserts require user_id = auth.uid())
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) {
      console.error("Auth error while getting user:", authError);
      return;
    }
    const user = authData?.user;
    if (!user) {
      console.warn("No authenticated user. Please sign in before running migration.");
      return;
    }

    for (const [index, caseStudy] of caseStudies.entries()) {
      console.log(`Migrating: ${caseStudy.title}`);

      // Insert portfolio item
      const { data: portfolio, error: portfolioError } = await supabase
        .from("portfolios")
        .upsert({
          slug: caseStudy.slug,
          title: caseStudy.title,
          client: caseStudy.client,
          category: caseStudy.category,
          tagline: caseStudy.tagline,
          cover_url: caseStudy.cover,
          full_image_url: caseStudy.fullImage,
          media_url: caseStudy.fullImage || caseStudy.cover,
          media_type: 'image',
          year: caseStudy.year,
          is_multiple_partners: caseStudy.isMultiplePartners || false,
          brand_name: caseStudy.brandName,
          is_published: true,
          order_index: index,
          user_id: user.id,
        }, { onConflict: 'slug' })
        .select()
        .single();

      if (portfolioError) {
        console.error(`Error inserting portfolio ${caseStudy.title}:`, portfolioError);
        continue;
      }

      // Insert cover image as media entry if it exists
      if (caseStudy.cover || caseStudy.fullImage) {
        const coverMediaData = {
          portfolio_id: portfolio.id,
          url: caseStudy.fullImage || caseStudy.cover,
          media_type: 'image' as const,
          file_name: `${caseStudy.title} - Cover Image`,
          file_size: null,
          display_order: 0,
          is_cover: true,
        };

        const { error: coverMediaError } = await (supabase as any)
          .from("portfolio_media")
          .insert(coverMediaData);

        if (coverMediaError) {
          console.error(`Error inserting cover media for ${caseStudy.title}:`, coverMediaError);
        }
      }

      // Insert partners if they exist
      if (caseStudy.partners && caseStudy.partners.length > 0) {
        const partnersData = caseStudy.partners.map(partner => ({
          portfolio_id: portfolio.id,
          name: partner.name,
          social_name: partner.socialName,
          image_url: partner.imageUrl,
          social_link: partner.socialLink,
        }));

        const { error: partnersError } = await supabase
          .from("portfolio_partners")
          .insert(partnersData);

        if (partnersError) {
          console.error(`Error inserting partners for ${caseStudy.title}:`, partnersError);
        }
      }

      // Insert single partner if it exists
      if (caseStudy.singlePartner) {
        const { error: singlePartnerError } = await supabase
          .from("portfolio_partners")
          .insert({
            portfolio_id: portfolio.id,
            name: caseStudy.singlePartner.name,
            social_name: caseStudy.singlePartner.type,
          });

        if (singlePartnerError) {
          console.error(`Error inserting single partner for ${caseStudy.title}:`, singlePartnerError);
        }
      }

      console.log(`✅ Successfully migrated: ${caseStudy.title}`);
    }

    console.log("🎉 Portfolio data migration completed!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

// Run migration if called directly
if (typeof window !== "undefined") {
  // Only run in browser environment
  (window as any).migratePortfolioData = migratePortfolioData;
}
