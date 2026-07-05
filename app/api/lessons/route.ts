import { NextResponse } from "next/server";
import { lessonCatalog } from "../../lessonCatalog";

export function GET() {
  return NextResponse.json({ lessons: lessonCatalog });
}
