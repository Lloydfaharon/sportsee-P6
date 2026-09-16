"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/app/routes/routes";
import Logo from "./components/logo/logo";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setError(errData.message || "Identifiants incorrects.");
        return;
      }

      const data = await res.json();

      // Enregistre le token dans le cookie côté client si retourné
      if (data.token) {
        document.cookie = `sportsee_token=${data.token}; path=/;`;
      }

      // Redirige
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Erreur de serveur.");
    }
};


  return (
    <div className="flex min-h-screen w-full bg-[#F2F3FF]">
      {/* Bloc gauche */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative p-6 sm:p-10">
        <div className="self-start mb-6 lg:mb-0 lg:absolute lg:top-[50px] lg:left-[50px]">
          <Logo />
        </div>

        <div className="w-full max-w-[380px] bg-white shadow-md rounded-2xl p-8 sm:p-12 flex flex-col justify-center my-auto">
          <h1 className="text-2xl font-bold text-[#0B23F4] mb-8 leading-tight">
            Transformez <br /> vos stats en résultats
          </h1>

          <h2 className="mb-6 font-medium text-gray-800">Se connecter</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Identifiant ou nom d'utilisateur
              </label>
              <input
                id="email"
                type="text"
                placeholder="Ex: sophiemartin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded-lg w-full p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="pwd" className="text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded-lg w-full p-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg mt-4 transition cursor-pointer"
            >
              Se connecter
            </button>
          </form>

          <p className="text-[14px] text-gray-500 mt-6 text-center">Mot de passe oublié ?</p>
        </div>
      </div>

      {/* Bloc droit */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/images/imglogin.jpg"
          alt="coureurs"
          className="w-full h-full object-cover"
        />
        <p className="absolute bottom-6 right-6 bg-white text-[12px] px-5 py-3 rounded-[50px] text-blue-700 shadow-md items-center flex justify-center max-w-[320px] text-center">
          Analysez vos performances en un clin d’œil, <br />
          suivez vos progrès et atteignez vos objectifs.
        </p>
      </div>
    </div>
  );
}
