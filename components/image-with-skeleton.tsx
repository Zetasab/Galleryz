"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

export function ImageWithSkeleton({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <span className="absolute inset-0 z-[1] animate-pulse bg-zinc-200 dark:bg-zinc-800" />
      )}
      <Image
        {...props}
        className={`${className ?? ""} transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
      />
    </>
  );
}
