import { BooksClient } from "./components/client";
import { getBooks } from "@/services/book";

const SizesPage = async () => {
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
