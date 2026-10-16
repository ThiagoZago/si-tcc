import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Info, infoTitles } from "@/features/site/screens/info";

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(infoTitles).map((info) => ({ info }));
}
export async function generateMetadata({ params }: PageProps<"/[info]">): Promise<Metadata> {
  const { info } = await params;
  return { title: Object.hasOwn(infoTitles, info) ? infoTitles[info] : "Página" };
}
export default async function InfoPage({ params }: PageProps<"/[info]">) {
  const { info } = await params;
  if (!Object.hasOwn(infoTitles, info)) notFound();
  return <Info info={info} />;
}
