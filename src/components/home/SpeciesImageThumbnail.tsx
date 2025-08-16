"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageData {
  image_url: string;
  attribute: string;
}

interface SpeciesImageThumbnailProps {
  images: ImageData[];
  speciesName: string;
}

export function SpeciesImageThumbnail({
  images,
  speciesName,
}: SpeciesImageThumbnailProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter out images with empty URLs
  const validImages = images.filter(
    (img) => img.image_url && img.image_url.trim() !== ""
  );

  if (validImages.length === 0) {
    return (
      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
        <ImageIcon className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  const currentImage = validImages[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % validImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer group">
          <Image
            unoptimized
            src={currentImage.image_url}
            alt={speciesName}
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded border hover:border-blue-400 transition-colors"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-wildlife.svg";
            }}
          />
          {validImages.length > 1 && (
            <Badge
              variant="secondary"
              className="absolute -top-1 -right-1 text-xs px-1 py-0 min-w-0 h-4 bg-blue-600 text-white"
            >
              {validImages.length}
            </Badge>
          )}
          <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded" />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl w-full p-0 bg-black">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="relative flex items-center justify-center min-h-[500px]">
            <Image
              unoptimized
              src={currentImage.image_url}
              alt={speciesName}
              width={800}
              height={600}
              className="max-w-full max-h-[80vh] object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-wildlife.svg";
              }}
            />

            {validImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 text-white hover:bg-white/20"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 text-white hover:bg-white/20"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}
          </div>

          <div className="rounded-lg absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-white font-semibold text-lg italic mb-2">
              {speciesName}
            </h3>
            {currentImage.attribute && (
              <p className="text-gray-300 text-sm">{currentImage.attribute}</p>
            )}
            {validImages.length > 1 && (
              <div className="flex items-center justify-center mt-4 space-x-2">
                {validImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
