import { NextResponse } from "next/server";
import { mockGetUserInfo,mockGetUserActivity  } from "@/app/mocks/mock";
import data from "@/app/mocks/data.json"; // 👈 importe ton fichier mock complet

export async function GET(request: Request) {
  //  Lire le cookie du token
  const cookieHeader = request.headers.get("cookie");
  const token = cookieHeader?.match(/sportsee_token=([^;]+)/)?.[1];

  if (!token) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  //  Extraire l’ID utilisateur à partir du token
  const userId = token.replace("fake-jwt-token-", "");

  try {
    //  1. Récupère les infos utilisateur + stats via fonction mock
    const dataUser = await mockGetUserInfo(userId);
    const runningData = await mockGetUserActivity(userId); 

    //  2. Récupère les données de course du fichier `data.json`
    const fullData = (data as any[]).find((u) => u.id === userId);

    //  3. Combine tout et renvoie un seul objet
    return NextResponse.json({
      ...dataUser,
      runningData: fullData?.runningData || [], // 👈 on ajoute ici
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}
