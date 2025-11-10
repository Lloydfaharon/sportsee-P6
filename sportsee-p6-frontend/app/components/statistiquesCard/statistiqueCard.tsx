import React from "react";

interface StatistiqueCardProps {
  label: string;
  mainValue: string | number;
  subValue?: string | number;
  unit?: string;
}

export default function StatistiqueCard({
  label,
  mainValue,
  subValue,
  unit,
}: StatistiqueCardProps) {
  return (
    <div className="bg-[#0B23F4] rounded-2xl px-6 py-5 flex flex-col justify-center 2xl:w-full xl:w-[250px] lg:w-[230px] md:w-[210px]  h-[103px] text-white">
      <p className="text-[14px] mb-2 opacity-90">{label}</p>

      <div className="flex items-baseline gap-1">
        <p className="text-[22px] font-normal leading-none">{mainValue}</p>

        {unit && (
          <p className="text-[14px] text-[#B6BDFC] leading-none ml-1">{unit}</p>
        )}
      </div>
    </div>
  );
}
