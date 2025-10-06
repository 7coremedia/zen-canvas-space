export type VolumeRecord = {
  id: string;
  slug: string;
  volumeNumber: string;
  title: string;
  writer: string;
  goal: string;
  summary: string;
  content: string[];
  leadParagraph?: string | null;
  heroImageUrl?: string | null;
  isPublished: boolean;
  isFeatured?: boolean;
  isLatest?: boolean;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
};
