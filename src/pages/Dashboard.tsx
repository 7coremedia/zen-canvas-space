import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { Brand } from '@/types/brand';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const { user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [user]);

  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Your Brands – KING</title>
        <meta name="description" content="Manage your brands and create new ones." />
        <link rel="canonical" href="/dashboard" />
      </Helmet>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl">Your Brands</h1>
          <p className="mt-2 text-muted-foreground">Manage your existing brand profiles or start a new one.</p>
        </div>
        <Button asChild>
          <Link to="/onboarding">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Brand
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : brands.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Card key={brand.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{brand.brand_name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">{brand.elevator_pitch}</p>
              </CardContent>
              <div className="p-6 pt-0 flex gap-2">
                <Button variant="outline" asChild className="flex-1">
                  <Link to={`/brand/${brand.id}`}>
                    Brand Details
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="default" asChild className="flex-1">
                  <Link to={`/brand-profile/${brand.id}`}>
                    Full Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No brands yet</h2>
          <p className="text-muted-foreground mt-2 mb-4">Ready to build your empire? Start by creating your first brand.</p>
          <Button asChild>
            <Link to="/onboarding">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Your First Brand
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
}
