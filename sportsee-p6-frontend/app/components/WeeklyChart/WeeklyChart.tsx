"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function WeeklySummary({
  runningData = [],
  weeklyGoal = 6,
}: {
  runningData?: any[];
  weeklyGoal?: number;
}) {
  // 🔹 Déterminer la semaine ACTUELLE
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lundi
  firstDayOfWeek.setHours(0, 0, 0, 0);

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  lastDayOfWeek.setHours(23, 59, 59, 999);

  // 🔹 Filtrer les courses de cette semaine
  const sessionsThisWeek = useMemo(() => {
    //  Parse les dates au format local, pas UTC
    const parseLocalDate = (d: string) => {
      const [year, month, day] = d.split("-").map(Number);
      return new Date(year, month - 1, day); // ⚡ évite le décalage horaire
    };

    return runningData.filter((run) => {
      const runDate = parseLocalDate(run.date); // ⬅️ ici la version corrigée
      return runDate >= firstDayOfWeek && runDate <= lastDayOfWeek;
    });
  }, [runningData, firstDayOfWeek, lastDayOfWeek]);

  // Calculs
  const sessionsCount = sessionsThisWeek.length;
  const totalDuration = sessionsThisWeek.reduce(
    (sum, s) => sum + s.duration,
    0
  );
  const totalDistance = sessionsThisWeek.reduce(
    (sum, s) => sum + s.distance,
    0
  );

  // Donut chart
  const achieved = sessionsCount;
  const remaining = Math.max(weeklyGoal - achieved, 0);
  const data = [
    { name: "Réalisés", value: achieved },
    { name: "Restants", value: remaining },
  ];
  const COLORS = ["#0B23F4", "#D8DCFF"];

  const formatDate = (date: Date) =>
    date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long" });

  console.log("➡️ firstDayOfWeek:", firstDayOfWeek);
  console.log("➡️ lastDayOfWeek:", lastDayOfWeek);
  console.log("➡️ sessionsThisWeek:", sessionsThisWeek);

  return (
    <section className="bg-[#F2F3FF] rounded-xl pb-20 flex justify-between items-center mt-20 mx-11">
      <div className="flex flex-col gap-2">
        <h2 className="text-[16px] font-medium text-black">Cette semaine</h2>
        <p className="text-sm text-gray-500">
          Du {formatDate(firstDayOfWeek)} au {formatDate(lastDayOfWeek)}
        </p>

        <div className="bg-white w-[450px] rounded-xl p-6 mt-4 shadow-sm flex flex-col-reverse gap-8 ">
          {/* --- Donut Chart --- */}
          <div className="relative  h-[150px] flex  w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={40}
                  outerRadius={60}
                  startAngle={90}
                  endAngle={450}
                  paddingAngle={2}
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
            {/* Légende au centre */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[#0B23F4] text-lg font-bold">x{achieved}</p>
              <p className="text-xs text-gray-500">sur {weeklyGoal}</p>
            </div>
          </div>

          <div>
            <p className="text-[#0B23F4] font-semibold text-lg">
              x{achieved}{" "}
              <span className="text-gray-400 font-normal">
                sur objectif de {weeklyGoal}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Courses hebdomadaires réalisées
            </p>
          </div>
        </div>
      </div>

      {/* --- Stats à droite --- */}
      <div className="flex flex-col gap-4 w-[572px] ">
        <div className="bg-white rounded-xl p-5  shadow-sm">
          <h3 className="text-[15px] text-gray-500 mb-1">Durée d’activité</h3>
          <p className="text-[18px] font-semibold text-[#0B23F4]">
            {totalDuration}{" "}
            <span className="text-gray-400 text-sm">minutes</span>
          </p>
        </div>

        <div className="bg-white rounded-xl p-5  shadow-sm">
          <h3 className="text-[15px] text-gray-500 mb-1">Distance</h3>
          <p className="text-[18px] font-semibold text-[#FF4B4B]">
            {totalDistance.toFixed(1)}{" "}
            <span className="text-gray-400 text-sm">kilomètres</span>
          </p>
        </div>
      </div>
    </section>
  );
}
