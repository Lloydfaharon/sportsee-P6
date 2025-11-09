/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Autorise le chargement d’images hébergées sur ton backend local
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**", // ✅ autorise tous les chemins d’images, pas seulement /images/**
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**", // utile si tu utilises parfois 127.0.0.1 au lieu de localhost
      },
    ],
    unoptimized: true, // désactive l’optimisation d’images de Next (utile en dev local)
  },
  reactStrictMode: true, // bonne pratique pour le développement
};

module.exports = nextConfig;
