import { getAuthToken} from "../utils/auth";
import Link from "next/link";
import Header from "@/app/components/header/header"
import Dashboardc from "../components/dashboradc/dashboradc"

export default function DashboardPage() {
  const token = getAuthToken();
  return (
    <main className="min-h-dvh px-60  bg-[#F2F3FF]">
        <Header/>
        <Dashboardc/>
    </main>
  );
}
