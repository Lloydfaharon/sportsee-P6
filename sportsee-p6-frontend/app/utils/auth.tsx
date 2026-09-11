import Cookies from "js-cookie";

const TOKEN_KEY = "sportsee_token";

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1 , path: "/",}); // expire en 1 jour
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeAuthToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return Boolean(getAuthToken());
};
