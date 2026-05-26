"use client";

import { useState } from "react";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="w-full aspect-square rounded-2xl"
        style={{ background: images[active] }}
        role="img"
        aria-label={alt}
      />

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="w-16 h-16 rounded-xl flex-shrink-0 transition-all"
              style={{
                background: img,
                outline: i === active ? "2px solid var(--ink)" : "2px solid transparent",
                outlineOffset: "2px",
              }}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
