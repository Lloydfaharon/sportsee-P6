"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function WeeklyChart({
  weeklyStats,
}: {
  weeklyStats: {
    start: string;
    end: string;
    distance: number;
    duration: number;
    count: number;
    remaining: number;
  };
}) {
  if (!weeklyStats) return <p>Aucune donnée hebdomadaire</p>;

  const achieved = weeklyStats.count;
  const remaining = weeklyStats.remaining;
  const weeklyGoal = achieved + remaining;

  const data = [
    { name: "Réalisés", value: achieved },
    { name: "Restants", value: remaining },
  ];

  const COLORS = ["#0B23F4", "#D8DCFF"];

  //  Nouveau format de date : "jj/mm/aaaa"
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <section className="bg-[#F2F3FF] relative rounded-xl pb-16 sm:pb-20 flex flex-col items-center mt-20 mx-4 sm:mx-8 md:mx-10 lg:mx-11">
      {/* --- Titre + Dates --- */}
      <div className="w-full lg:text-left mb-8">
        <h2 className="text-[18px] sm:text-[20px] font-medium text-black">
          Cette semaine
        </h2>
        <p className="text-sm text-gray-500">
          Du {formatDate(weeklyStats.start)} au {formatDate(weeklyStats.end)}
        </p>
      </div>

      {/* --- Conteneur principal --- */}
      <div className="flex flex-col min-[1020px]:flex-row gap-8 w-full">
        {/* --- Colonne gauche : Donut Chart --- */}
        <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm flex flex-col-reverse gap-8 w-full min-[1020px]:w-1/2">
          {/* --- Donut Chart --- */}
          <div className="relative h-[180px] sm:h-[200px] flex w-full justify-center">
            {/* Légende gauche */}
            <div className="flex items-center text-[10px] sm:text-[12px] absolute bottom-10 left-10 gap-2">
              <span className="w-3 h-3 bg-[#0B23F4] rounded-full"></span>
              <span className="text-[#707070]">{achieved} réalisées</span>
            </div>

            {/* Le graphique */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={40}
                  outerRadius={70}
                  startAngle={90}
                  endAngle={450}
                  cornerRadius={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Légende droite */}
            <div className="flex items-center text-[10px] sm:text-[12px] absolute top-10 right-10 gap-2">
              <span className="w-3 h-3 bg-[#D8DCFF] rounded-full"></span>
              <span className="text-[#707070]">{remaining} restants</span>
            </div>
          </div>

          {/* --- Texte sous le graphique --- */}
          <div className="text-center min-[1020px]:text-left">
            <p className="text-[#0B23F4] font-semibold text-lg sm:text-xl">
              x{achieved}{" "}
              <span className="text-[#B6BDFC] font-normal">
                sur objectif de {weeklyGoal}
              </span>
            </p>
            <p className="text-sm text-[#707070]">
              Courses hebdomadaires réalisées
            </p>
          </div>
        </div>

        {/* --- Colonne droite : Statistiques --- */}
        <div className="flex flex-col gap-4 w-full min-[1020px]:w-1/2">
          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm text-center min-[1020px]:text-left">
            <h3 className="text-[15px] sm:text-[16px] text-gray-500 mb-1">
              Durée d’activité
            </h3>
            <p className="text-[18px] sm:text-[20px] font-semibold text-[#0B23F4]">
              {weeklyStats.duration}{" "}
              <span className="text-sm text-[#B6BDFC]">minutes</span>
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm text-center min-[1020px]:text-left">
            <h3 className="text-[15px] sm:text-[16px] text-gray-500 mb-1">
              Distance
            </h3>
            <p className="text-[18px] sm:text-[20px] font-semibold text-[#FF4B4B]">
              {weeklyStats.distance.toFixed(1)}{" "}
              <span className="text-sm text-[#FCC1B6]">kilomètres</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
