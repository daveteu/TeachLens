import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MathPortal from "../../page";
import { findLessonSummary, lessonCatalog } from "../../lessonCatalog";

type LessonPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return lessonCatalog.map((lesson) => ({
    id: lesson.id
  }));
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { id } = await params;
  const lesson = findLessonSummary(id);

  if (!lesson) {
    return {
      title: "Lesson Not Found | TeachLens"
    };
  }

  return {
    title: `${lesson.title} | TeachLens`,
    description: `${lesson.question} Formula: ${lesson.formula}`,
    alternates: {
      canonical: `/lessons/${lesson.id}`
    },
    openGraph: {
      title: `${lesson.title} | TeachLens`,
      description: lesson.question,
      type: "article"
    }
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;

  if (!findLessonSummary(id)) {
    notFound();
  }

  return <MathPortal initialLessonId={id} />;
}
