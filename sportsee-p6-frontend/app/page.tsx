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
    const res = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setError("Identifiants incorrects.");
      return;
    }

    const data = await res.json();

    //  Enregistre le vrai token du backend dans le cookie
    document.cookie = `sportsee_token=${data.token}; path=/;`;

    //  Redirige
    window.location.href = "/dashboard";
  } catch (err) {
    setError("Erreur de serveur.");
  }
};


  return (
    <div className="flex h-screen w-full bg-[#F2F3FF]">
      {/* Bloc gauche */}
      <div className="mx-42 bg-[#F2F3FF] flex flex-col items-center justify-center relative">
        <div className="absolute top-[50px] left-2.5">
          <Logo />
        </div>

        <div className="w-[350px] h-[550px] m-6.5 bg-white shadow-md rounded-2xl p-12 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-[#0B23F4] mb-10 leading-tight">
            Transformez <br /> vos stats en résultats
          </h1>

          <h2 className="mb-6">Se connecter</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                className="border border-gray-300 rounded-lg w-full p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg mt-6"
            >
              Se connecter
            </button>
          </form>

          <p className="text-[14px] text-black mt-6">Mot de passe oublié ?</p>
        </div>
      </div>

      {/* Bloc droit */}
      <div className="relative">
        <img
          src="/images/imglogin.jpg"
          alt="coureurs"
          className="w-full h-full object-cover"
        />
        <p className="absolute bottom-4 right-4 bg-white text-[11px] px-3 py-1 rounded-[50px] text-blue-700 shadow-sm h-16 items-center flex justify-center w-[288px]">
          Analysez vos performances en un clin d’œil, <br />
          suivez vos progrès et atteignez vos objectifs.
        </p>
      </div>
    </div>
  );
}
