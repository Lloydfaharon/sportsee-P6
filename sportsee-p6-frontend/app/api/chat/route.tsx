import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    // ✅ 1️⃣ Récupère le message ET l'ID utilisateur envoyés depuis le frontend
    const { message, userId } = await request.json();

    // --- Décodage du token si userId manquant ---
    let finalUserId = userId;
    if (!finalUserId) {
      const cookieHeader = request.headers.get("cookie") || "";
      const tokenMatch = cookieHeader.match(/token=([^;]+)/);
      if (tokenMatch) {
        const token = tokenMatch[1];
        try {
          const decoded: any = jwt.decode(token);
          finalUserId = decoded?.userId;
          console.log("✅ userId détecté depuis le token :", finalUserId);
        } catch (err) {
          console.warn("❌ Erreur lors du décodage du token :", err);
        }
      }
    }

    if (!finalUserId) {
      console.warn(
        "⚠️ Aucun userId reçu ni trouvé dans le cookie. Mode test activé."
      );
    }

    // --- Validation basique ---
    if (!message || message.length > 500) {
      return NextResponse.json(
        { error: "Message invalide ou trop long." },
        { status: 400 }
      );
    }

    // --- 2️⃣ Récupération des données utilisateur depuis ton API ---
    let userData = null;
    let perfData = null;

    try {
      // ✅ Appelle ton endpoint Next.js local déjà enrichi
      const userRes = await fetch(
        `${
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        }/api/user`,
        {
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (userRes.ok) {
        userData = await userRes.json();
        perfData = userData?.performance || null;
      } else {
        console.warn(
          "⚠️ Impossible de récupérer les données utilisateur :",
          await userRes.text()
        );
      }
    } catch (err) {
      console.warn(
        "⚠️ Erreur lors de la récupération des données utilisateur :",
        err
      );
    }
   
    //console.log("📦 Données récupérées depuis /api/user :")
    //console.log("User:", userData);
    //console.log("Performance:", perfData);

    // --- Extraction des données utiles ---
    const userName = userData?.profile?.firstName || "utilisateur";
    const totalDistance = userData?.statistics?.totalDistance || "N/A";
    const totalSessions = userData?.statistics?.totalSessions || "N/A";
    const totalDuration = userData?.statistics?.totalDuration || "N/A";
    const userPhoto =
      userData?.profile?.profilePicture || "/images/default-avatar.jpg";

    // ---  Prompt système enrichi  ---
    const systemPrompt = `
Tu es Coach AI, l’assistant virtuel intégré à l’application SportSee.

 Ton rôle :
Aider les utilisateurs à comprendre et à améliorer leurs performances sportives, leur récupération et leur nutrition.

 Ton comportement :
- Bienveillant, motivant et clair
- Pédagogue mais jamais moralisateur
- Adapté au niveau de l’utilisateur : débutant, intermédiaire ou expert
- Utilise un ton positif et professionnel
- Évite le jargon, préfère des explications simples
- Structure tes réponses avec des listes, des paragraphes courts et parfois des emojis
- Ne fais jamais de diagnostic médical : oriente vers un professionnel si nécessaire

Domaines couverts :
- Entraînement (cardio, force, récupération, endurance)
- Nutrition et hydratation
- Prévention et gestion des blessures
- Lecture des graphiques et indicateurs SportSee

Si la question sort du cadre du sport, réponds :
“Je suis ton coach sportif virtuel, concentrons-nous sur ton entraînement 💪 !”

Exemple de style :
> Très bon réflexe 
> Essaie d’ajouter une séance de récupération active après chaque entraînement intense.  
> Ton corps te remerciera demain 

====================
Données réelles de l'utilisateur :
- Prénom : ${userName}
- Distance totale : ${totalDistance} km
- Nombre de sessions : ${totalSessions}
- Durée totale : ${totalDuration} min
====================
`;

    // ---  Détection du type de question pour adapter la longueur de réponse ---
    let maxTokens = 400; // valeur par défaut
    const lowerMsg = message.toLowerCase();

    if (
      lowerMsg.includes("programme") ||
      lowerMsg.includes("nutrition") ||
      lowerMsg.includes("aliment") ||
      lowerMsg.includes("planning") ||
      lowerMsg.includes("objectif") ||
      lowerMsg.includes("séance") ||
      lowerMsg.includes("exercice")
    ) {
      maxTokens = 800; // réponse longue pour programmes & conseils
    } else if (
      lowerMsg.includes("graphique") ||
      lowerMsg.includes("statistique")
    ) {
      maxTokens = 350;
    } else if (
      lowerMsg.includes("blessure") ||
      lowerMsg.includes("récupération")
    ) {
      maxTokens = 500;
    } else if (lowerMsg.includes("salut") || lowerMsg.includes("bonjour")) {
      maxTokens = 150;
    }

    console.log(`🧩 max_tokens défini sur : ${maxTokens}`);

    // --- Appel à l’API Mistral ---
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistral-medium-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.5,
        max_tokens: maxTokens,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erreur Mistral:", data);

      //  Si la capacité du modèle est dépassée, on retente avec un modèle plus léger
      if (
        data?.code === "3505" ||
        data?.message?.includes("capacity exceeded")
      ) {
        console.warn(
          "⚠️ Capacité du modèle dépassée — nouvel essai avec mistral-small-latest..."
        );

        try {
          const retryRes = await fetch(
            "https://api.mistral.ai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "mistral-small-latest", 
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: message },
                ],
                temperature: 0.5,
                max_tokens: maxTokens,
              }),
            }
          );

          const retryData = await retryRes.json();

          if (retryRes.ok) {
            console.log(
              "✅ Réponse obtenue via le fallback mistral-small-latest"
            );
            return NextResponse.json({
              reply:
                retryData.choices?.[0]?.message?.content || "Aucune réponse.",
            });
          } else {
            console.error("❌ Échec du fallback :", retryData);
          }
        } catch (retryError) {
          console.error("❌ Erreur lors du fallback Mistral :", retryError);
        }
      }

      return NextResponse.json(
        { error: "Erreur de communication avec Mistral" },
        { status: 500 }
      );
    }

    //  Réponse réussie du premier appel
    return NextResponse.json({
      reply: data.choices?.[0]?.message?.content || "Aucune réponse.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
