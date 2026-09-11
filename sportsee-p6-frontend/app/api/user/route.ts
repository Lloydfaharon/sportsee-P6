import { NextResponse } from "next/server";
import { mockGetUserInfo, mockGetUserActivity } from "@/app/mocks/mock";
import data from "@/app/mocks/data.json";

const USE_MOCK = process.env.USE_MOCK === "true";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// =====================================
//   GET /api/user
// =====================================
export async function GET(request: Request) {
  // 🔐 Lire le cookie du token
  const cookieHeader = request.headers.get("cookie");
  const token = cookieHeader?.match(/sportsee_token=([^;]+)/)?.[1];

  if (!token && !USE_MOCK) {
    return NextResponse.json({ error: "Token manquant" }, { status: 401 });
  }

  // ID utilisateur

  const userId = "user123";

  try {
    let dataUser: any = null;
    let runningData: any[] = [];

    // =====================================
    // Récupération des données
    // =====================================
    if (USE_MOCK) {
      //  Mode mock
      dataUser = await mockGetUserInfo(userId);
      runningData = await mockGetUserActivity(userId);
    } else {
      //  Mode API réelle
      const headers = { Authorization: `Bearer ${token}` };

      // Dates de la semaine actuelle
      // Étendue large pour récupérer toutes les activités
      const startWeek = "2000-01-01";
      const endWeek = "2100-01-01";

      console.log(
        "URL appelée:",
        `${API_BASE_URL}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`
      );
      console.log("🧾 Token lu depuis le cookie:", token);

      const [userRes, activityRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/user-info`, { headers }),
        fetch(
          `${API_BASE_URL}/api/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`,
          { headers }
        ),
      ]);

      if (!userRes.ok || !activityRes.ok) {
        const userText = await userRes.text();
        const actText = await activityRes.text();
        console.error(" Réponse user-info:", userText);
        console.error(" Réponse user-activity:", actText);
        throw new Error(
          "Erreur lors de la récupération des données depuis l’API réelle"
        );
      }

      const userData = await userRes.json();
      const activityData = await activityRes.json();

      console.log(" userData:", userData);
      console.log(" activityData:", activityData);

      // Normalisation backend
      dataUser = {
        profile: userData.profile || userData.userInfos || {},
        statistics: {
          goal: userData.statistics?.goal ?? 6,
          totalDistance: userData.statistics?.totalDistance ?? 0,
          totalDuration: userData.statistics?.totalDuration ?? 0,
          totalSessions: userData.statistics?.totalSessions ?? 0,
        },
      };

      runningData = Array.isArray(activityData)
        ? activityData
        : activityData.sessions || [];
    }

    // =====================================
    //  Calculs additionnels
    // =====================================
    const sessions = runningData || [];

    // Total calories
    const totalCalories = sessions.reduce(
      (sum, s) => sum + (s.calories ?? s.caloriesBurned ?? 0),
      0
    );

    // Jours de repos
    let totalRestDays = 0;
    if (sessions.length > 0) {
      const dates = sessions
        .map((s) => new Date(s.date))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

      const firstDate = dates[0];
      const lastDate = dates[dates.length - 1];

      const normalize = (d: Date) => d.toISOString().split("T")[0];
      const activeDays = new Set(dates.map(normalize));

      const current = new Date(firstDate);
      while (current <= lastDate) {
        const key = normalize(current);
        if (!activeDays.has(key)) totalRestDays++;
        current.setDate(current.getDate() + 1);
      }
    }

    // Statistiques semaine actuelle
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const weeklySessions = sessions.filter((s) => {
      const d = new Date(s.date);
      return d >= monday && d <= sunday;
    });

    const weeklyStats = {
      start: monday.toISOString(),
      end: sunday.toISOString(),
      distance: Math.round(
        weeklySessions.reduce((sum, s) => sum + (s.distance ?? 0), 0)
      ),
      duration: weeklySessions.reduce((sum, s) => sum + (s.duration ?? 0), 0),
      count: weeklySessions.length,
      remaining: Math.max(
        (dataUser.statistics?.goal ?? 6) - weeklySessions.length,
        0
      ),
    };

    // Performance (graph)
    const getWeekNumber = (date: Date) => {
      const firstJan = new Date(date.getFullYear(), 0, 1);
      const days = Math.floor(
        (date.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000)
      );
      return Math.ceil((days + firstJan.getDay() + 1) / 7);
    };

    const groupByWeek = (sessions: any[]) => {
      const grouped: Record<string, any[]> = {};
      sessions.forEach((s) => {
        const week = getWeekNumber(new Date(s.date));
        const key = `S${week}`;
        grouped[key] = grouped[key] || [];
        grouped[key].push(s);
      });
      return grouped;
    };

    const weeks = groupByWeek(sessions);
    const weeklyDistance = Object.keys(weeks).map((week) => ({
      week,
      distance: weeks[week].reduce((sum, s) => sum + (s.distance ?? 0), 0),
      dates: weeks[week].map((s) => s.date),
    }));

    const bpmData = sessions.map((run) => ({
      day: new Date(run.date).toLocaleDateString("fr-FR", { weekday: "short" }),
      min: run.heartRate?.min ?? 0,
      max: run.heartRate?.max ?? 0,
      avg: run.heartRate?.average ?? 0,
      date: run.date,
    }));

    // =====================================
    //  Fusion finale
    // =====================================
    const enrichedUser = {
      ...dataUser,
      statistics: {
        ...dataUser.statistics,
        totalCalories: Math.round(totalCalories),
        totalRestDays,
      },
      weeklyStats,
      performance: { weeklyDistance, bpmData },
      runningData: sessions,
    };

    return NextResponse.json(enrichedUser);
  } catch (err: any) {
    console.error("❌ Erreur API :", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
