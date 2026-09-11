"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import StatistiqueCard from "../statistiquesCard/statistiqueCard";

export default function ProfilD() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erreur de récupération des données");

        const data = await res.json();
        //console.log("✅ Données API :", data);

        setUser(data.profile);
        setStats(data.statistics);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (!user || !stats) return <p>Aucune donnée disponible</p>;

  // Conversion durée : minutes → heures + minutes
  const hours = Math.floor(stats.totalDuration / 60);
  const minutes = stats.totalDuration % 60;
  // Calcul du nombre moyen de jours de repos par semaine
  const totalWeeks = Math.ceil(stats.totalRestDays / 7); // estimation
  const avgRestPerWeek = (stats.totalRestDays / totalWeeks).toFixed(1);

  return (
    <div className="flex gap-20">
      {/* --- Profil --- */}
      <div className="w-1/2 h-[717px]">
        <div className="flex gap-4 items-center pt-6 pr-[52px] pb-6 pl-8 bg-white rounded-xl mb-4">
          <div className="overflow-hidden rounded-xl w-[104px] h-[117px]">
            <Image
              src={user.profilePicture || "/images/default-avatar.jpg"}
              alt={`${user.firstName} ${user.lastName}`}
              width={104}
              height={117}
              className="object-cover w-full h-full rounded-xl bg-blue-500 transform transition-transform duration-500 hover:scale-110"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="font-inter text-[22px] font-medium leading-normal">
              {user.firstName} {user.lastName}
            </h2>
            <p className="font-inter text-[#707070] text-[14px] font-normal leading-normal">
              Membre depuis le{" "}
              {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl h-[331px] pt-10 pr-7 pb-[60px] pl-7">
          <h2 className="font-inter text-[22px] font-medium leading-normal mb-7">
            Votre profil
          </h2>

          <div className="space-y-3 text-[#707070] mt-8">
            <p>Âge : {user.age} ans</p>
            <p>
              Genre :{" "}
              {user.gender === "female"
                ? "Femme"
                : user.gender === "male"
                ? "Homme"
                : "Non spécifié"}
            </p>

            <p>Taille : {user.height} cm</p>
            <p>Poids : {user.weight} kg</p>
          </div>
        </div>
      </div>

      {/* --- Statistiques --- */}
      <div className="w-1/2 h-[717px]">
        <div className="mb-8">
          <h2 className="font-inter text-[22px] font-medium leading-normal">
            Vos statistiques
          </h2>
          <p className="font-inter text-[#707070] text-[14px] font-normal leading-normal">
            depuis le{" "}
            {new Date(user.createdAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* --- Cartes --- */}
        <div className="grid grid-cols-2 gap-6">
          <StatistiqueCard
            label="Temps total couru"
            mainValue={`${hours}h`}
            subValue={`${minutes}min`}
          />
          <StatistiqueCard
            label="Calories brûlées"
            mainValue={stats.totalCalories}
            unit="cal"
          />
          <StatistiqueCard
            label="Distance totale parcourue"
            mainValue={Math.round(stats.totalDistance)}
            unit="km"
          />

          <StatistiqueCard
            label="Nombre de jours de repos"
            mainValue={stats.totalRestDays ?? "—"}
            subValue={
              stats.totalRestDays
                ? `≈ ${(
                    stats.totalRestDays /
                    (stats.totalSessions / 7)
                  ).toFixed(1)} /semaine`
                : ""
            }
            unit="jours"
          />

          <StatistiqueCard
            label="Nombre de sessions"
            mainValue={stats.totalSessions}
            unit="sessions"
          />
        </div>
      </div>
    </div>
  );
}
