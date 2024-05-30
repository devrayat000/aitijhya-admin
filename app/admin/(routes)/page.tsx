import {
  BookOpenTextIcon,
  BookTextIcon,
  NewspaperIcon,
  UsersIcon,
  MenuIcon,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDailyUserCount } from "@/server/user/service";
import DailyUserChart from "./components/daily-user-count";
import { getStats } from "@/server/miscellaneous/service/get-stats";
import { runReport } from "@/server/miscellaneous/service/get-analytics";
import DailyActiveUserBar from "./components/daily-active-user-count";
import CountCard from "./components/count-card";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const [
    { userCount, bookAuthorCount, chapterCount, postCount, subjectCount },
    dailyUsers,
  ] = await Promise.all([getStats(), getDailyUserCount()]);

  const report = await runReport();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-5">
          <CountCard name="User" count={userCount} icon={UsersIcon} />
          <CountCard name="Post" count={postCount} icon={NewspaperIcon} />
          <CountCard name="Book" count={bookAuthorCount} icon={BookTextIcon} />
          <CountCard
            name="Chapter"
            count={chapterCount}
            icon={BookOpenTextIcon}
          />
          <CountCard name="Subject" count={subjectCount} icon={MenuIcon} />
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <Card className="col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>New users per day</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DailyUserChart dailyUsers={dailyUsers.reverse()} />
            </CardContent>
          </Card>
          <Card className="col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle>Daily active users</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DailyActiveUserBar
                data={report.sort((a, b) => +a.date - +b.date)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
