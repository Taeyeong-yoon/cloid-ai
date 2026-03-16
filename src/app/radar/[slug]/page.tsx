import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TEXTBOOKS } from "@/constants/textbooks";
import TextbookViewer from "./TextbookViewer";

export function generateStaticParams() {
  return TEXTBOOKS.filter((item) => item.ready).map((item) => ({ slug: item.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const textbook = TEXTBOOKS.find((item) => item.id === slug && item.ready);

  if (!textbook) {
    return {
      title: "Textbook Not Found | CLOID.AI",
    };
  }

  return {
    title: `${textbook.titleEn} | CLOID.AI`,
    description: textbook.descriptionEn,
    openGraph: {
      title: `${textbook.titleEn} | CLOID.AI`,
      description: textbook.descriptionEn,
      url: `https://cloid.ai/radar/${textbook.id}`,
    },
  };
}

export default async function RadarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const textbook = TEXTBOOKS.find((item) => item.id === slug && item.ready);

  if (!textbook) {
    notFound();
  }

  return <TextbookViewer textbook={textbook} />;
}
