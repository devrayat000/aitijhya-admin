import { format } from "date-fns";

import { BooksClient } from "./components/client";
import db from "@/lib/db";
import { bookAuthor } from "@/db/schema";
import { getBooks } from "@/services/book";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const books = await getBooks();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BooksClient data={books} />
      </div>
    </div>
  );
};

export default SizesPage;
