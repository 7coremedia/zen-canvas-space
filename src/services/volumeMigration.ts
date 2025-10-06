import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Migrates legacy volumes to the new format
 * This is a placeholder implementation - you'll need to adapt it to your actual data structure
 */
export async function migrateVolumes() {
  try {
    // 1. Fetch all legacy volumes
    const { data: legacyVolumes, error: fetchError } = await supabase
      .from('legacy_volumes') // Replace with your actual legacy table name
      .select('*');

    if (fetchError) throw fetchError;
    if (!legacyVolumes || legacyVolumes.length === 0) {
      return { success: true, message: 'No legacy volumes found to migrate' };
    }

    // 2. Transform and migrate each volume
    const migrationPromises = legacyVolumes.map(async (legacyVolume) => {
      // Transform legacy format to new format
      const newVolume = {
        volumeNumber: legacyVolume.volume_number,
        slug: legacyVolume.slug || legacyVolume.title.toLowerCase().replace(/\s+/g, '-'),
        title: legacyVolume.title,
        writer: legacyVolume.author || 'KING Team',
        goal: legacyVolume.description || '',
        summary: legacyVolume.summary || legacyVolume.description || '',
        leadParagraph: legacyVolume.content?.[0] || '',
        heroImageUrl: legacyVolume.image_url || '',
        orderIndex: legacyVolume.order_index || 0,
        isPublished: legacyVolume.published || true,
        isFeatured: legacyVolume.featured || false,
        isLatest: false, // You might want to set this based on your logic
        content: Array.isArray(legacyVolume.content) 
          ? legacyVolume.content 
          : [legacyVolume.content || ''],
      };

      // Insert into new volumes table
      const { error: insertError } = await supabase
        .from('volumes')
        .upsert(newVolume, { onConflict: 'slug' });

      if (insertError) {
        console.error(`Error migrating volume ${legacyVolume.id}:`, insertError);
        throw insertError;
      }

      return legacyVolume.id;
    });

    // 3. Wait for all migrations to complete
    await Promise.all(migrationPromises);

    return { 
      success: true, 
      message: `Successfully migrated ${legacyVolumes.length} volumes` 
    };
  } catch (error) {
    console.error('Migration error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error during migration' 
    };
  }
}

/**
 * Hook to handle volume migration with UI feedback
 */
export function useVolumeMigration() {
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();

  const migrate = async () => {
    if (!confirm('This will migrate all legacy volumes to the new format. Continue?')) {
      return { success: false, cancelled: true };
    }

    setIsMigrating(true);
    try {
      const result = await migrateVolumes();
      
      toast({
        title: result.success ? 'Migration Complete' : 'Migration Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });

      return { success: result.success };
    } catch (error) {
      console.error('Migration failed:', error);
      toast({
        title: 'Migration Failed',
        description: 'An unexpected error occurred during migration.',
        variant: 'destructive',
      });
      return { success: false, error };
    } finally {
      setIsMigrating(false);
    }
  };

  return { migrate, isMigrating };
}
