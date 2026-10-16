import type { NextConfig } from "next";

const config: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  serverExternalPackages: ["node:sqlite"],
  async redirects() {
    return [
      { source: "/inicio", destination: "/painel", permanent: true },
      { source: "/configuracao-empresa", destination: "/painel/configuracoes", permanent: true },
      { source: "/configuracao-servicos", destination: "/painel/servicos", permanent: true },
      {
        source: "/configuracao-profissionais",
        destination: "/painel/profissionais",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default config;
