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
          credentials: "include", // 🔥 pour envoyer les cookies automatiquement
        });

        if (!res.ok) {
          throw new Error("Erreur de récupération des données");
        }

        const data = await res.json();
        console.log("✅ Données API :", data);
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
  const info = user.profile || user.userInfos; // selon ton mock
  if (!user || !stats) return <p>Aucune donnée disponible</p>;


 const statistiques = [
    { label: "Distance totale", value: stats.totalDistance, unit: "km" },
    { label: "Durée totale", value: stats.totalDuration, unit: "min" },
    { label: "Nombre de sessions", value: stats.totalSessions },
    { label: "Objectif", value: stats.goal, unit: "km" },
  ];



  return (
    <div className="flex gap-23">
      <div className="w-1/2 h-[717px]  ">
        <div className=" flex gap-4 item-center pt-6 pr-[52px] pb-6 pl-8 bg-white rounded-xl mb-4">
          <Image
            src={user.profilePicture || "/images/default-avatar.jpg"}
            alt={`${user.firstName} ${user.lastName}`}
            width={104}
            height={117}
            className="image w-[104px] h-[117px] bg-blue-500 object-cover rounded-xl"
          />

          <div className=" flex flex-col justify-center">
            <h2 className="font-inter text-[22px] font-medium leading-normal">
              {user.firstName} {user.lastName}
            </h2>
            <p className="font-inter text-[#707070] text-[14px] font-normal leading-normal">
              Membre depuis le{" "}
              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl h-[331px]  pt-10 pr-7 pb-[60px] pl-7">
          <h2 className="font-inter text-[22px] font-medium leading-normal mb-7">
            Votre profil
          </h2>

          <div className="space-y-3 text-[#707070] mt-8 ">
            <p>Âge : {user.age} ans</p>
            <p>Genre : {user.gender === "female" ? "Femme" : "Homme"}</p>
            <p>Taille : {user.height} cm</p>
            <p>Poids : {user.weight} kg</p>
          </div>
        </div>
        <div></div>
      </div>
      <div className="w-1/2 h-[717px] ">
        <div className="mb-8">
          <h2 className="font-inter text-[22px] font-medium leading-normal">
            Vos statistiques
          </h2>
          <p className="font-inter text-[#707070]  text-[14px] font-normal leading-normal">
            depuis le 14 juin 2023
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {statistiques.map((stat, index) => (
            <StatistiqueCard
              key={index}
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
