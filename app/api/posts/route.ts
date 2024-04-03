import { getHitPostsByIds } from "@/services/post";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idsParam = url.searchParams.get("ids");
  const ids = idsParam?.split(",");

  const posts = ids ? await getHitPostsByIds(ids) : [];

  return Response.json(
    { posts },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    }
  );
}
