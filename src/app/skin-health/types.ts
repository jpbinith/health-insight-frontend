export type SkinAnalysisGalleryImage = {
  src: string;
  alt?: string | null;
};

export type SkinAnalysisResult = {
  id: string;
  label: string;
  title: string;
  confidence: number;
  description?: string | null;
  symptoms: string[];
  galleryImages?: SkinAnalysisGalleryImage[];
  isTopMatch?: boolean;
};
