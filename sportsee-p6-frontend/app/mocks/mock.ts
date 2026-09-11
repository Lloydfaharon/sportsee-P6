// =====================================
// MOCK API - SportSee (TypeScript version)
// =====================================

import data from "../mocks/data.json";

// === Types ===
export interface UserInfos {
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  profilePicture: string;
  height: number;
  weight: number;
  createdAt: string;
}

export interface RunningSession {
  date: string;
  distance: number;
  duration: number;
  calories?: number;
  caloriesBurned?: number;
}

export interface UserData {
  id: number | string;
  username: string;
  password: string;
  userInfos: UserInfos;
  goal: number;
  runningData: RunningSession[];
}

export interface LoginResponse {
  token: string;
  userId: number | string;
}

export interface UserProfileResponse {
  profile: UserInfos;
  statistics: {
    totalDistance: number;
    totalDuration: number;
    totalSessions: number;
    goal: number;
    totalCalories?: number;
    totalRestDays?: number;
  };
}

// =====================================
// Trouve un utilisateur par son ID
// =====================================
export const getUserById = (id: number | string): UserData | undefined => {
  const users: UserData[] = data as unknown as UserData[];
  return users.find((user) => String(user.id) === String(id));
};

// =====================================
// Simulation du login
// =====================================
export const mockLogin = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const users: UserData[] = data as unknown as UserData[];
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return Promise.reject(
      new Error("Nom d’utilisateur ou mot de passe invalide.")
    );
  }

  return Promise.resolve({
    token: "fake-jwt-token-" + user.id,
    userId: user.id,
  });
};

// =====================================
// Récupère les infos utilisateur
// =====================================
export const mockGetUserInfo = async (
  userId: number | string
): Promise<UserProfileResponse> => {
  const user = getUserById(userId);
  if (!user) {
    return Promise.reject(new Error("Utilisateur introuvable."));
  }

  const totalDistance = user.runningData
    .reduce((sum, session) => sum + session.distance, 0)
    .toFixed(1);
  const totalDuration = user.runningData.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  const totalSessions = user.runningData.length;

  // 🟢 Calcul des calories totales (calories ou caloriesBurned)
  const totalCalories = user.runningData.reduce(
    (sum, session) => sum + (session.calories || session.caloriesBurned || 0),
    0
  );

  // 🟦 Calcul précis des jours de repos
  const sessions = user.runningData;
  let totalRestDays = 0;

  if (sessions.length > 0) {
    // --- Fonction robuste de parsing de date ---
    const parseDate = (dateStr: string) => {
      let d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d;
      const parts = dateStr.split(/[\/\-]/);
      if (parts.length === 3) {
        const [day, month, year] =
          Number(parts[0]) > 12
            ? [Number(parts[0]), Number(parts[1]), Number(parts[2])]
            : [Number(parts[2]), Number(parts[1]), Number(parts[0])];
        d = new Date(year, month - 1, day);
      }
      return d;
    };

    // --- Trier toutes les dates valides ---
    const sortedDates = sessions
      .map((s) => parseDate(s.date))
      .filter((d) => !isNaN(d.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());

    const firstDate = sortedDates[0];
    const lastDate = sortedDates[sortedDates.length - 1];

    // --- Normalisation en YYYY-MM-DD ---
    const normalize = (d: Date) => d.toISOString().split("T")[0];
    const activeDays = new Set(sortedDates.map(normalize));

    // --- Calcul des jours manquants (repos) ---
    const current = new Date(firstDate);
    while (current <= lastDate) {
      const key = normalize(current);
      if (!activeDays.has(key)) totalRestDays++;
      current.setDate(current.getDate() + 1);
    }

    console.log("🧩 totalRestDays calculé :", totalRestDays);
  }

  // ✅ Retour propre
  return Promise.resolve({
    profile: user.userInfos,
    statistics: {
      totalDistance: Number(totalDistance),
      totalDuration,
      totalSessions,
      goal: user.goal,
      totalCalories: Number(totalCalories.toFixed(0)),
      totalRestDays,
    },
  });
};

// =====================================
// Récupère les activités utilisateur
// =====================================
export const mockGetUserActivity = async (
  userId: number | string
): Promise<RunningSession[]> => {
  const user = getUserById(userId);
  if (!user) {
    return Promise.reject(new Error("Utilisateur introuvable."));
  }

  return Promise.resolve(user.runningData);
};
