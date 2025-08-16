import { normalizeScientificName } from "@/lib/utils";
import imagesData from "@/lib/images.json";

export const getSpeciesImages = (scientificName: string) => {
  const normalizedName = normalizeScientificName(scientificName);
  const images = imagesData as Record<
    string,
    Array<{ image_url: string; attribute: string }>
  >;
  return images[normalizedName] || [];
};
