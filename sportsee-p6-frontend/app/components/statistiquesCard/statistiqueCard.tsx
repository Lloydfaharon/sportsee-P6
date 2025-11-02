import React from "react";

interface StatistiqueCardProps {
  title: string;
  value: string | number;
  unit?: string;
}

export default function StatistiqueCard({ title, value, unit }: StatistiqueCardProps) {
  return (
    <div className="w-[278px] h-[103px] bg-[#0B23F4] rounded-xl p-4 flex flex-col justify-center">
      <p className="text-[12px] text-white mb-1">{title}</p>
      <p className="text-white text-[22px] ">
        {value}{" "}
        {unit && <span className="text-[12px] text-gray-200">{unit}</span>}
      </p>
    </div>
  );
}
