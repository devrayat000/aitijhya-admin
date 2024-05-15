import {
  BookOpenTextIcon,
  BookTextIcon,
  NewspaperIcon,
  UsersIcon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDailyUserCount, getUserCount } from "@/server/user/service";
import DailyUserChart from "./components/daily-user-count";
import { getStats } from "@/server/miscellaneous/service/get-stats";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  // const [
  //   { userCount, bookAuthorCount, chapterCount, postCount, subjectCount },
  //   dailyUsers,
  // ] = await Promise.all([getStats(), getDailyUserCount()]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        {/* <div className="grid gap-4 grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-nowrap">
              <CardTitle className="text-sm font-medium flex-1">
                Total User Count
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Post Count
              </CardTitle>
              <NewspaperIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Book Count
              </CardTitle>
              <BookTextIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Chapter Count
              </CardTitle>
              <BookOpenTextIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postCount}</div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <DailyUserChart dailyUsers={dailyUsers.reverse()} />
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default DashboardPage;
