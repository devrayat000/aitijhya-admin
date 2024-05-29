import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getAllSubjects } from "@/server/subject/service";
import { use } from "react";

// TODO: Implement progressive filtering
export default function Filters({
  searchParams,
}: {
  searchParams: { query: string; page?: string; subjects?: string[] };
}) {
  const subjects = use(getAllSubjects());

  return (
    <form className="p-4">
      <h3 className="text-2xl font-semibold">Filters</h3>
      <input type="hidden" name="query" value={searchParams.query} />
      {searchParams?.page && (
        <input type="hidden" name="page" value={searchParams?.page} />
      )}
      <div className="mt-2 flex gap-x-1 gap-y-1.5 flex-wrap justify-between">
        {subjects.map((subject) => {
          return (
            <div className="flex items-center space-x-2" key={subject.id}>
              <Checkbox
                id={subject.id}
                name="subjects"
                value={subject.name}
                defaultChecked={searchParams.subjects?.includes(subject.name)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {subject.name}
              </label>
            </div>
          );
        })}
      </div>
      <Button type="submit">Apply Filters</Button>
    </form>
  );
}
