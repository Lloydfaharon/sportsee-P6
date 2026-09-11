import { getAuthToken } from "../utils/auth";
import Header from "@/app/components/header/header";
import Profild from "@/app/components/profild/profild";
import Footer from "@/app/components/footer/Footer";

export default function ProfilePage() {
  const token = getAuthToken();
  return (
    <div className="flex flex-col min-h-screen bg-[#F2F3FF]">
      <div className="grow px-5 xl:px-30 ">
        <Header />
        <Profild />
      </div>
      <Footer />
    </div>
  );
}
