"use client";

import { useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  hero?: string;
};

function isUrl(s: string): boolean {
  return s.startsWith("http://") || s.startsWith("https://");
}

export function ProductGallery({ images, alt, hero = "" }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  const hasImages = images.length > 0;
  const activeImg = hasImages ? images[active] : null;
  const isImageUrl = activeImg ? isUrl(activeImg) : false;

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="w-full aspect-square rounded-2xl overflow-hidden"
        role="img"
        aria-label={alt}
        style={!isImageUrl ? { background: activeImg ?? hero } : undefined}
      >
        {isImageUrl && activeImg && (
          <Image
            src={activeImg}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        )}
      </div>

      {/* Thumbnails */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => {
            const isThumbUrl = isUrl(img);
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="relative w-16 h-16 rounded-xl shrink-0 overflow-hidden transition-all"
                style={
                  !isThumbUrl
                    ? {
                        background: img,
                        outline:
                          i === active ? "2px solid var(--ink)" : "2px solid transparent",
                        outlineOffset: "2px",
                      }
                    : {
                        outline:
                          i === active ? "2px solid var(--ink)" : "2px solid transparent",
                        outlineOffset: "2px",
                      }
                }
                aria-label={`Image ${i + 1}`}
              >
                {isThumbUrl && (
                  <Image src={img} alt={`${alt} thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
