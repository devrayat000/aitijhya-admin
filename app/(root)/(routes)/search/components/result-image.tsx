import { encrypt, encryptionKey } from "@/lib/crypto";
import Image, { ImageProps } from "next/image";
import { useSearchParams } from "next/navigation";
import { use } from "react";

interface ResultImageProps extends ImageProps {
  next?: boolean;
}

export default function ResultImage({
  src,
  alt,
  next,
  ...props
}: ResultImageProps) {
  const token = use(
    encrypt(
      typeof src === "string"
        ? src
        : "default" in src
        ? src.default.src
        : src.src,
      encryptionKey
    )
  );
  const searchParams = useSearchParams();

  const q = searchParams.get("q")?.trim();
  const param = q ? `&q=${q}` : "";

  if (!next) {
    return (
      <img
        src={`/api/image/view?token=${token}${param}`}
        alt={alt}
        decoding="async"
        loading="lazy"
        {...props}
      />
    );
  }

  return (
    <Image
      src={`/api/image/view?token=${token}${param}`}
      alt={alt}
      decoding="async"
      loading="lazy"
      unoptimized
      {...props}
    />
  );
}
