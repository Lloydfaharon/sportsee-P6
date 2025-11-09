"use client";

import React, { useState } from "react";
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
  data,
}: {
  data: {
    weeklyDistance: { week: string; distance: number; dates: string[] }[];
    bpmData: {
      day: string;
      min: number;
      max: number;
      avg: number;
      date: string;
    }[];
  };
}) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [dayOffset, setDayOffset] = useState(0);
  const [isDistanceHovered, setIsDistanceHovered] = useState(false);
  const [isBpmHovered, setIsBpmHovered] = useState(false);

  if (!data) return <p>Aucune donnée de performance</p>;

  const { weeklyDistance = [], bpmData = [] } = data;

  // Pagination simple : 4 semaines et 7 jours visibles
  const totalWeeks = weeklyDistance.length;
  const visibleWeeks = weeklyDistance.slice(
    Math.max(0, totalWeeks - 4 - weekOffset),
    totalWeeks - weekOffset
  );

  const totalDays = bpmData.length;
  const visibleDays = bpmData.slice(
    Math.max(0, totalDays - 7 - dayOffset),
    totalDays - dayOffset
  );

  const avgKm =
    visibleWeeks.reduce((sum, w) => sum + w.distance, 0) /
    (visibleWeeks.length || 1);
  const avgBpm =
    visibleDays.reduce((sum, d) => sum + d.avg, 0) / (visibleDays.length || 1);

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

  const formatDateRange = (dates: string[]) => {
    if (!dates || dates.length === 0) return "";
    const start = new Date(dates[0]);
    const end = new Date(dates[dates.length - 1]);
    const format = (d: Date) =>
      `${String(d.getDate()).padStart(2, "0")}.${String(
        d.getMonth() + 1
      ).padStart(2, "0")}`;
    return `${format(start)} au ${format(end)}`;
  };

  const distanceRange = visibleWeeks.length
    ? formatDateRange(visibleWeeks[0].dates)
    : "";
  const bpmRange = visibleDays.length
    ? `${visibleDays[0].day} - ${visibleDays[visibleDays.length - 1].day}`
    : "";

  return (
    <section className="mt-10 px-4 sm:px-8 md:px-12 ">
      <h2 className="font-inter text-[22px] font-medium mb-6 text-gray-900">
        Vos dernières performances
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        {/* === Distance === */}
        <div
          className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm transition-all duration-300 w-full"
          onMouseEnter={() => setIsDistanceHovered(true)}
          onMouseLeave={() => setIsDistanceHovered(false)}
        >
          <div className="flex justify-between mb-2 ">
            <h3 className="text-blue-600 font-semibold text-lg sm:text-xl">
              {avgKm.toFixed(0)} km en moyenne
            </h3>
            <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
              <button
                onClick={handlePrevWeek}
                className="p-1 hover:bg-gray-100 rounded-full transition"
                aria-label="Semaine précédente"
                title="Semaine précédente"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  role="img"
                  aria-hidden="true"
                >
                  <path
                    d="M14 8L10 12L14 16"
                    stroke="#111111"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <span className="text-xs sm:text-sm font-medium">
                {distanceRange}
              </span>

              <button
                onClick={handleNextWeek}
                className="p-1 hover:bg-gray-100 rounded-full transition rotate-180"
                aria-label="Semaine suivante"
                title="Semaine suivante"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  role="img"
                  aria-hidden="true"
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

          {/* --- Graphique Distance --- */}
          <div className="h-[200px] sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={visibleWeeks}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="2 3" vertical={false} />
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
                  cursor={false}
                  content={({ active, payload }) =>
                    active && payload?.length ? (
                      <div className="bg-black text-white text-xs rounded-lg p-2">
                        <p>{formatDateRange(payload[0].payload.dates)}</p>
                        <p className="mt-1 text-sm font-semibold">
                          {payload[0].payload.distance.toFixed(1)} km
                        </p>
                      </div>
                    ) : null
                  }
                />
                <Bar
                  dataKey="distance"
                  fill={isDistanceHovered ? "#0B23F4" : "#A9B4FF"}
                  barSize={10}
                  radius={[8, 8, 8, 8]}
                  animationDuration={400}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-baseline mt-2">
            <span className="text-[#0B23F4]">●</span>
            <p className="text-xs text-gray-400 ml-1">Km</p>
          </div>
        </div>

        {/* === BPM === */}
        <div
          className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm w-full"
          onMouseEnter={() => setIsBpmHovered(true)}
          onMouseLeave={() => setIsBpmHovered(false)}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-red-500 font-semibold text-lg sm:text-xl">
              {avgBpm.toFixed(0)} BPM
            </h3>
            <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
              <button
                onClick={handlePrevDay}
                className="p-1 hover:bg-gray-100 rounded-full transition"
                aria-label="Jour précédent"
                title="Jour précédent"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  role="img"
                  aria-hidden="true"
                >
                  <path
                    d="M14 8L10 12L14 16"
                    stroke="#111111"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <span className="text-xs sm:text-sm font-medium">{bpmRange}</span>

              <button
                onClick={handleNextDay}
                className="p-1 hover:bg-gray-100 rounded-full transition rotate-180"
                aria-label="Jour suivant"
                title="Jour suivant"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  role="img"
                  aria-hidden="true"
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

          <div className="h-[220px] sm:h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visibleDays}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="2 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={true}
                  tick={{ fill: "#707070", fontSize: 12 }}
                  interval={0}
                  padding={{ left: 20, right: 20}}
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
                />
                <Bar
                  dataKey="min"
                  fill="#FFD1D1"
                  barSize={10}
                  radius={[6, 6, 6, 6]}
                />
                <Bar
                  dataKey="max"
                  fill="#FF0000"
                  barSize={10}
                  radius={[6, 6, 6, 6]}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke={isBpmHovered ? "#0B23F4" : "#F2F3FF"}
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#0B23F4" }}
                  activeDot={{
                    r: 6,
                    fill: "#0B23F4",
                    stroke: "#ffffff",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

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
