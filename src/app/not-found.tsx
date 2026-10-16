import Link from "next/link";
import { Scissors, ArrowLeft } from "lucide-react";
export default function NotFound() {
  return (
    <main id="main" className="standalone-state">
      <Scissors size={48} />
      <span className="eyebrow">404 · PÁGINA NÃO ENCONTRADA</span>
      <h1>
        Esse caminho precisa
        <br />
        de um retoque.
      </h1>
      <p>A página não existe ou o link mudou.</p>
      <Link href="/" className="btn btn-primary">
        <ArrowLeft size={17} /> Voltar ao início
      </Link>
    </main>
  );
}
