import { Button } from "@/components/ui/button";
import { Card } from "@tremor/react";

export default function DemoLoginPage() {
  return (
    <Card>
      <form action="/auth/login/google" method="get">
        <Button type="submit">Sign In</Button>
      </form>
    </Card>
  );
}
