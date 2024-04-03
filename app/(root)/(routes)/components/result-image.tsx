import { encrypt, encryptionKey } from "@/lib/crypto";
import Image, { ImageProps } from "next/image";
import { useSearchParams } from "next/navigation";
import { use } from "react";

export default function ResultImage({ src, alt, ...props }: ImageProps) {
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

  const q = searchParams.get("posts[query]");
  console.log("query=", q);
  const param = q ? `&q=${q}` : "";

  return (
    <Image
      src={`/api/image/view?token=${token}${param}`}
      alt={alt}
      {...props}
    />
  );
}
