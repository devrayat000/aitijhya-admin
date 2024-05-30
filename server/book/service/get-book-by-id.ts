import { getFilteredBooks } from "./get-filtered-books";
import { BookTable } from "./get-books";
import { bookAuthor, subject } from "@/db/schema";

export async function getBookById(id: string): Promise<BookTable> {
  const [bookById] = await getFilteredBooks({
    books: [id],
    fields: {
      id: bookAuthor.id,
      name: bookAuthor.name,
      edition: bookAuthor.edition,
      marked: bookAuthor.marked,
      subject: {
        name: subject.name,
        id: subject.id,
      },
    },
  });
  return bookById;
}
