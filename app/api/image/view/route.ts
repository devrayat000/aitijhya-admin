import { decrypt, encryptionKey } from "@/lib/crypto";
import { env } from "@/lib/utils";

export async function GET(request: Request): Promise<Response> {
  const sameOrigin = request.headers.get("sec-fetch-site") === "same-origin";
  if (!sameOrigin) {
    return new Response("Forbidden", { status: 403 });
  }

  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const token = searchParams.get("token");
  const q = searchParams.get("q");

  if (!token) {
    return new Response("Missing token", { status: 400 });
  }

  const imageUrl = await decrypt(token, encryptionKey);

  if (!imageUrl) {
    return new Response("Invalid token", { status: 400 });
  }

  const fetchUrl = new URL(
    "/marked-image",
    env("NEXT_PUBLIC_OCR_URL", "http://127.0.0.1:8000")
  );
  fetchUrl.searchParams.set("image_url", imageUrl);

  if (q) {
    fetchUrl.searchParams.set("q", q);
  }

  return fetch(fetchUrl, {
    headers: {
      Accept:
        "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
    },
  });
}
