import { Suspense, cache, use } from "react";
import Image, { ImageLoader } from "next/image";
import { useHits, useSearchBox } from "react-instantsearch";
import Loading from "@/app/loading";
import { PostHit, PostHitResults } from "@/services/post";
import { useSearchParams } from "next/navigation";
import jwt from "jsonwebtoken";
import ResultImage from "./result-image";

const getHitPostsByIds = cache(async (ids: string[]) => {
  if (ids.length === 0) {
    return { posts: [] };
  }
  const encodedIds = ids.map((id) => encodeURIComponent(id.trim())).join(",");
  const response = await fetch(`/api/posts?ids=${encodedIds}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return response.json();
});

const imageLoader = (({ src, width, quality }) => {
  const token = jwt.sign({ foo: "bar" }, "shhhhh");
  console.log(token);

  return `http://localhost:8000/marked-image?image_url=${src}`;
}) satisfies ImageLoader;

function HitReslts({ ids }: { ids: string[] }) {
  const { posts } = use<{ posts?: PostHitResults }>(getHitPostsByIds(ids));

  return (
    <section className="flex flex-col md:flex-row gap-4">
      {posts?.map((hit) => {
        return (
          <article
            key={hit.id}
            className="aspect-video rounded-2xl overflow-hidden shadow-lg border-border border relative md:basis-1/3 lg:basis-1/4"
          >
            <ResultImage
              src={hit.imageUrl!}
              alt={hit.book}
              fill
              className="rounded-inherit object-cover"
            />
            {/* <Image
              src={
                hit.imageUrl ||
                "https://images.unsplash.com/photo-1457369804613-52c61a468e7d"
              }
              alt={hit.book}
              fill
              objectFit="cover"
              className="rounded-inherit object-cover"
            /> */}
            <div className="absolute bottom-0 w-full flex items-end justify-between text-white bg-slate-900/50 rounded-inherit px-3 py-1">
              <div>
                <span className="text-xs leading-none">Page {hit.page}</span>
                <h6 className="text-sm leading-none mt-px">{hit.book}</h6>
              </div>
              <p className="text-xs px-2 py-1 rounded-full bg-slate-900 leading-none">
                {hit.chapter}
              </p>
            </div>
          </article>
        );
      })}
    </section>
  );
}

export default function Hits() {
  const { hits } = useHits<PostHit>({ escapeHTML: true });
  const ids = hits.map((hit) => hit.objectID);

  return (
    <Suspense fallback={<Loading />}>
      <HitReslts ids={ids} />
    </Suspense>
  );
}
