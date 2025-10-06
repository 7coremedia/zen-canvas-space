import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useUser } from '@/hooks/usePortfolioAuth';
import { useVolumes } from '@/hooks/useVolumes';
import VolumeForm, { VolumeSubmitPayload } from '@/components/admin/VolumeForm';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function VolumeCreatePage() {
  const navigate = useNavigate();
  const { user, role } = useUser();
  const { createVolume, volumes } = useVolumes();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !(role?.is_admin || role?.is_moderator)) {
      navigate('/');
    }
  }, [user, role, navigate]);

  const handleSubmit = async (payload: VolumeSubmitPayload) => {
    setIsSubmitting(true);
    try {
      await createVolume(payload);
      
      toast({
        title: 'Success',
        description: 'Volume created successfully',
      });
      
      navigate('/management/volumes');
    } catch (error) {
      console.error('Failed to create volume:', error);
      toast({
        title: 'Error',
        description: 'Failed to create volume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Create New Volume – KING</title>
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Volume</h1>
        <p className="text-muted-foreground mt-2">
          Add a new volume to the KING collection
        </p>
      </div>

      <div className="bg-card rounded-lg p-6">
        <VolumeForm 
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/management/volumes')}
          isSubmitting={isSubmitting}
          defaultOrderIndex={volumes.length}
          submitLabel={isSubmitting ? 'Creating...' : 'Create Volume'}
          submitButtonContent={
            isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : undefined
          }
        />
      </div>
    </main>
  );
}
