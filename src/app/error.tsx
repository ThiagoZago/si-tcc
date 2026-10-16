"use client";
import { useEffect } from "react";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Falha ao carregar a página:", error.digest || error.name);
  }, [error]);
  return (
    <main id="main" className="standalone-state">
      <h1>Não conseguimos carregar esta página.</h1>
      <p>Tente novamente em alguns instantes.</p>
      <button className="btn btn-primary" onClick={reset}>
        Tentar novamente
      </button>
    </main>
  );
}
