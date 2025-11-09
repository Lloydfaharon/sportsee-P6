import { getAuthToken } from "../utils/auth";
import Link from "next/link";
import Header from "@/app/components/header/header";
import Dashboardc from "../components/dashboradc/dashboradc";
import Footer from "@/app/components/footer/Footer";

export default function DashboardPage() {
  const token = getAuthToken();
  return (
    <div className="flex flex-col min-h-screen bg-[#F2F3FF]">
      <div className="grow px-5 xl:px-30 ">
        <Header />
        <Dashboardc />
      </div>
      <Footer />
    </div>
  );
}
