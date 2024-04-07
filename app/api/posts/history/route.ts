import { getCurrentUserSearchHistory } from "@/services/history";

export async function GET(_: Request): Promise<Response> {
  const history = await getCurrentUserSearchHistory();
  return Response.json({ history }, { status: 200 });
}
