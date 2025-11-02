import { getAuthToken } from "../utils/auth";
import Link from "next/link";
import Header from "@/app/components/header/header"
import Profild from "../components/profild/profild"


export default function ProfilePage() {
  const token = getAuthToken();
  return (
    <main className="h-dvh px-60 bg-[#F2F3FF] ">
      <div className="mb-[90px]">
        <Header/>
      </div>
      
      <Profild/>

    </main>)
}
