"use client";

import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function PerformanceCharts({
  runningData,
}: {
  runningData: any[];
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [dayOffset, setDayOffset] = useState(0);

  const sortedData = useMemo(() => {
    return [...(runningData || [])].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [runningData]);

  const weeks = groupByWeek(sortedData);
  const weeklyKeys = Object.keys(weeks);
  const totalWeeks = weeklyKeys.length;

  const visibleWeeks = weeklyKeys.slice(
    Math.max(0, totalWeeks - 4 - weekOffset),
    totalWeeks - weekOffset
  );

  const weeklyData = visibleWeeks.map((week) => ({
    week,
    distance: weeks[week].reduce((sum, s) => sum + s.distance, 0),
    dates: weeks[week].map((s) => s.date),
  }));

  const totalDays = sortedData.length;
  const visibleDays = sortedData.slice(
    Math.max(0, totalDays - 7 - dayOffset),
    totalDays - dayOffset
  );

  const bpmData = visibleDays.map((run) => ({
    day: new Date(run.date).toLocaleDateString("fr-FR", { weekday: "short" }),
    min: run.heartRate.min,
    max: run.heartRate.max,
    avg: run.heartRate.average,
    date: run.date,
  }));

  const avgKm =
    weeklyData.reduce((sum, w) => sum + w.distance, 0) /
    (weeklyData.length || 1);
  const avgBpm =
    bpmData.reduce((sum, d) => sum + d.avg, 0) / (bpmData.length || 1);

  const handlePrevWeek = () => {
    if (weekOffset + 4 < totalWeeks) setWeekOffset(weekOffset + 1);
  };
  const handleNextWeek = () => {
    if (weekOffset > 0) setWeekOffset(weekOffset - 1);
  };
  const handlePrevDay = () => {
    if (dayOffset + 7 < totalDays) setDayOffset(dayOffset + 1);
  };
  const handleNextDay = () => {
    if (dayOffset > 0) setDayOffset(dayOffset - 1);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    });

  const distanceRange =
    weeklyData.length > 0
      ? `${formatDate(weeklyData[0].dates[0])} - ${formatDate(
          weeklyData[weeklyData.length - 1].dates.slice(-1)[0]
        )}`
      : "";

  const bpmRange =
    bpmData.length > 0
      ? `${formatDate(bpmData[0].date)} - ${formatDate(
          bpmData[bpmData.length - 1].date
        )}`
      : "";

  if (!runningData?.length) {
    return <p className="text-gray-500">Aucune donnée disponible</p>;
  }

  return (
    <section className="mt-10 px-11">
      <h2 className="font-inter text-[22px] font-medium mb-4">
        Vos dernières performances
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* === Distance === */}
        <div className="bg-white rounded-2xl p-10 shadow-sm w-[445px]">
          <div className="">
            <div className="flex justify-between mb-2">
              <h3 className="text-blue-600 font-semibold text-lg">
                {avgKm.toFixed(0)} km en moyenne
              </h3>
              {/* --- Boutons navigation --- */}
              <div className="flex items-center gap-3 text-gray-600">
                <button
                  onClick={handlePrevWeek}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M14 8L10 12L14 16"
                      stroke="#111111"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <span className="text-sm font-medium">{distanceRange}</span>

                <button
                  onClick={handleNextWeek}
                  className="p-1 hover:bg-gray-100 rounded-full transition rotate-180"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M14 8L10 12L14 16"
                      stroke="#111111"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-gray-500 mb-4 text-sm">
              Total des kilomètres 4 dernières semaines
            </p>
          </div>

          {/* --- Graphique Distance --- */}
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={weeklyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false}/>
              <XAxis
                dataKey="week"
                tickLine={false}
                axisLine={true}
                tick={{ fill: "#707070", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={true}
                tick={{ fill: "#999", fontSize: 12 }}
              />
              <Tooltip
                
                contentStyle={{
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value.toFixed(1)} km`]}
              />
              <Bar
                dataKey="distance"
                fill="#0B23F4"
                barSize={10}
                radius={[8, 8, 8, 8]}
                
              />
            </BarChart>
          </ResponsiveContainer>

          {/* --- Légende Km --- */}
          <div className="flex items-baseline mt-2">
            <span className="text-[#0B23F4]">●</span>
            <p className="text-xs text-gray-400 ml-1">Km</p>
          </div>
        </div>

        {/* === BPM === */}
        <div className="bg-white rounded-2xl p-10 shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-red-500 font-semibold text-lg">
                {avgBpm.toFixed(0)} BPM
              </h3>
              {/* --- Boutons navigation --- */}
              <div className="flex items-center gap-3 text-gray-600">
                <button
                  onClick={handlePrevDay}
                  className="p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M14 8L10 12L14 16"
                      stroke="#111111"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <span className="text-sm font-medium">{bpmRange}</span>

                <button
                  onClick={handleNextDay}
                  className="p-1 hover:bg-gray-100 rounded-full transition rotate-180"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M14 8L10 12L14 16"
                      stroke="#111111"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-gray-500 mb-4 text-sm">
              Fréquence cardiaque moyenne
            </p>
          </div>

          {/* --- Graphique BPM --- */}
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={bpmData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={false}/>
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={true}
                tick={{ fill: "#707070", fontSize: 12 }}
                padding={{ left: 20, right: 10}}
              />
              <YAxis
                tickLine={false}
                axisLine={true}
                tick={{ fill: "#999", fontSize: 12 }}
                domain={["dataMin - 10", "dataMax + 10"]}
                
              />
              <Tooltip
                cursor={{ fill: "rgba(255, 0, 0, 0.05)" }}
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.9)",
                  color: "white",
                  borderRadius: "8px",
                  fontSize: "12px",
                  padding: "6px 10px",
                  border: "none",
                }}
                formatter={(value: number, name: string) => [
                  `${value} bpm`,
                  name === "avg"
                    ? "Moyenne"
                    : name === "max"
                    ? "Max BPM"
                    : "Min",
                ]}
                labelStyle={{ color: "#fff" }}
              />

              {/* --- Barres --- */}
              <Bar
                dataKey="min"
                fill="#FFD1D1"
                barSize={10}
                radius={[6, 6, 6, 6]}
                className="transition-all  duration-200"
                activeBar={{ fill: "#FFAAAA" }}
              />
              <Bar
                dataKey="max"
                fill="#FF0000"
                barSize={10}
                radius={[6, 6, 6, 6]}
                className="transition-all duration-200"
                activeBar={{ fill: "#E50000" }}
              />

              {/* --- Ligne moyenne --- */}
              <Line
                type="monotone"
                dataKey="avg"
                stroke="#0B23F4"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0B23F4" }}
                activeDot={{
                  r: 6,
                  fill: "#0B23F4",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* --- Légende BPM --- */}
          <div className="flex items-baseline mt-3 gap-4 text-xs text-gray-500">
            <div className="flex items-baseline">
              <span className="text-[#FFD1D1]">●</span>
              <p className="ml-1">Min</p>
            </div>
            <div className="flex items-baseline">
              <span className="text-[#FF0000]">●</span>
              <p className="ml-1">Max BPM</p>
            </div>
            <div className="flex items-baseline">
              <span className="text-[#0B23F4]">●</span>
              <p className="ml-1">Moyenne</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// === Utils ===
function groupByWeek(data: any[]) {
  const grouped: Record<string, any[]> = {};
  data.forEach((session) => {
    const date = new Date(session.date);
    const weekNum = getWeekNumber(date);
    const key = `S${weekNum}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(session);
  });
  return grouped;
}

function getWeekNumber(date: Date): number {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor(
    (date.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((days + firstJan.getDay() + 1) / 7);
}
