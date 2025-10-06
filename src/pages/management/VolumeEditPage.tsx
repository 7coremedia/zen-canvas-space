import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useUser } from '@/hooks/usePortfolioAuth';
import { useVolumes } from '@/hooks/useVolumes';
import VolumeForm, { VolumeSubmitPayload } from '@/components/admin/VolumeForm';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function VolumeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, role } = useUser();
  const { volumes, updateVolume, isLoading: isVolumesLoading } = useVolumes();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [volume, setVolume] = useState<typeof volumes[0] | null>(null);

  useEffect(() => {
    if (!user || !(role?.is_admin || role?.is_moderator)) {
      navigate('/');
      return;
    }

    if (!isVolumesLoading && volumes.length > 0) {
      const foundVolume = volumes.find(v => v.id === id);
      if (foundVolume) {
        setVolume(foundVolume);
      } else {
        navigate('/management/volumes');
      }
    }
  }, [user, role, navigate, volumes, id, isVolumesLoading]);

  const handleSubmit = async (values: VolumeSubmitPayload) => {
    if (!volume) return;
    
    setIsSubmitting(true);
    try {
      await updateVolume({
        ...values,
        id: volume.id,
      });
      
      toast({
        title: 'Success',
        description: 'Volume updated successfully',
      });
      
      navigate('/management/volumes');
    } catch (error) {
      console.error('Failed to update volume:', error);
      toast({
        title: 'Error',
        description: 'Failed to update volume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVolumesLoading || !volume) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Edit {volume.title} – KING</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Volume</h1>
        <p className="text-muted-foreground mt-2">
          Update the volume details and content
        </p>
      </div>

      <div className="bg-card rounded-lg p-6">
        <VolumeForm 
          initialData={volume}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/management/volumes')}
          isSubmitting={isSubmitting}
          submitLabel={isSubmitting ? 'Updating...' : 'Update Volume'}
          submitButtonContent={
            isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : undefined
          }
        />
      </div>
    </main>
  );
}
