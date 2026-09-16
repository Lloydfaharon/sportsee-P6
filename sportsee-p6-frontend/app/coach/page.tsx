import React from "react";
import Header from "@/app/components/header/header";
import Footer from "@/app/components/footer/Footer";
import "@/app/globals.css";

export default function CoachPage() {
    return (
        <div className="min-h-screen w-full flex flex-col justify-between bg-[#F2F3FF]">
            <div className="flex flex-col grow px-5 xl:px-30">
                <Header />
                <div className="grow flex items-center justify-center my-16 px-4">
                    <p className="text-center text-xl md:text-2xl font-medium text-[#0B23F4] max-w-xl leading-relaxed">
                        Votre coach sportif personnel est en préparation, il arrive dans quelques jours !
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}