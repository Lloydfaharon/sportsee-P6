// =====================================
// MOCK API - SportSee (TypeScript version)
// =====================================

import data from "./data.json";

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
  calories: number;
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
//  Simulation du login
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
//  Récupère les infos utilisateur
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

  return Promise.resolve({
    profile: user.userInfos,
    statistics: {
      totalDistance: Number(totalDistance),
      totalDuration,
      totalSessions,
      goal: user.goal,
    },
  });
};

// =====================================
//  Récupère les activités utilisateur
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


