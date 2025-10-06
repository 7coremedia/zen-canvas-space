import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { VolumeRecord } from "@/types/volume";

// Moved to VolumeForm component

export default function ManagementVolumes() {
  const navigate = useNavigate();
  const { user, role } = useUser();
  const { toast } = useToast();
  const {
    volumes,
    isLoading,
    error,
    deleteVolume,
  } = useVolumes();

  useEffect(() => {
    if (!user || !(role?.is_admin || role?.is_moderator)) {
      navigate("/");
    }
  }, [user, role, navigate]);

  const sortedVolumes = useMemo(
    () => [...volumes].sort((a, b) => a.orderIndex - b.orderIndex),
    [volumes]
  );

  const handleCreateNew = () => {
    navigate("/management/volumes/new");
  };

  const handleEdit = (volumeId: string) => {
    navigate(`/management/volumes/${volumeId}/edit`);
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
        <Button asChild>
          <Link to="/management/volumes/new">
            <Plus className="mr-2 h-4 w-4" />
            New Volume
          </Link>
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
            <Button onClick={handleCreateNew}>
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
                        asChild
                        className="h-8 w-8"
                      >
                        <Link to={`/management/volumes/${volume.id}/edit`} aria-label={`Edit ${volume.title}`}>
                          <Edit2 className="h-4 w-4" />
                        </Link>
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

    </main>
  );
}
