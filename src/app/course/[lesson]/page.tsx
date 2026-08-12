import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COURSE_LESSONS, getAdjacentLessons, getLesson } from "@/constants/course";
import LessonViewer from "./LessonViewer";

export function generateStaticParams() {
  return COURSE_LESSONS.map((lesson) => ({ lesson: lesson.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lesson: string }>;
}): Promise<Metadata> {
  const { lesson: id } = await params;
  const lesson = getLesson(id);

  if (!lesson) {
    return { title: "Lesson Not Found | CLOID.AI" };
  }

  const title = `${lesson.session} ${lesson.title} — ${lesson.tagline} | CLOID.AI`;

  return {
    title,
    description: lesson.description,
    openGraph: {
      title,
      description: lesson.description,
      url: `https://cloid.ai/course/${lesson.id}`,
    },
  };
}

export default async function CourseLessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: id } = await params;
  const lesson = getLesson(id);

  if (!lesson) {
    notFound();
  }

  const { prev, next } = getAdjacentLessons(id);

  return <LessonViewer lesson={lesson} prev={prev} next={next} />;
}
