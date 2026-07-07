import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const outputPath = join(process.cwd(), "public", "worksheets", "sector-area-perimeter-worksheet.pdf");

const areaQuestions = [
  ["radius = 6 cm", "angle = 60 degrees", "6pi cm^2"],
  ["radius = 8 cm", "angle = 90 degrees", "16pi cm^2"],
  ["radius = 5 cm", "angle = 72 degrees", "5pi cm^2"],
  ["radius = 12 cm", "angle = 30 degrees", "12pi cm^2"],
  ["radius = 10 cm", "angle = 144 degrees", "40pi cm^2"],
  ["radius = 9 cm", "angle = 120 degrees", "27pi cm^2"],
  ["radius = 7 cm", "angle = 180 degrees", "49pi/2 cm^2"],
  ["radius = 4 cm", "angle = 45 degrees", "2pi cm^2"],
  ["radius = 15 cm", "angle = 80 degrees", "50pi cm^2"],
  ["radius = 3 cm", "angle = 240 degrees", "6pi cm^2"]
];

const perimeterQuestions = [
  ["radius = 6 cm", "angle = 60 degrees", "12 + 2pi cm"],
  ["radius = 8 cm", "angle = 90 degrees", "16 + 4pi cm"],
  ["radius = 5 cm", "angle = 72 degrees", "10 + 2pi cm"],
  ["radius = 12 cm", "angle = 30 degrees", "24 + 2pi cm"],
  ["radius = 10 cm", "angle = 144 degrees", "20 + 8pi cm"],
  ["radius = 9 cm", "angle = 120 degrees", "18 + 6pi cm"],
  ["radius = 7 cm", "angle = 180 degrees", "14 + 7pi cm"],
  ["radius = 4 cm", "angle = 45 degrees", "8 + pi cm"],
  ["radius = 15 cm", "angle = 80 degrees", "30 + 20pi/3 cm"],
  ["radius = 3 cm", "angle = 240 degrees", "6 + 4pi cm"]
];

const questions = [
  ...areaQuestions.map((item, index) => ({
    number: index + 1,
    type: "Area",
    prompt: `Find the area of the sector. ${item[0]}, ${item[1]}.`,
    answer: item[2]
  })),
  ...perimeterQuestions.map((item, index) => ({
    number: index + 11,
    type: "Perimeter",
    prompt: `Find the perimeter of the sector. ${item[0]}, ${item[1]}.`,
    answer: item[2]
  }))
];

function escapePdfText(text) {
  return text.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function textLine(x, y, text, size = 11, font = "F1") {
  return `BT /${font} ${size} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET\n`;
}

function rule(x1, y, x2) {
  return `${x1} ${y} m ${x2} ${y} l S\n`;
}

function pageContent(title, subtitle, lines, pageNumber) {
  let content = "0.08 0.22 0.38 RG 0.93 0.97 1 rg 46 706 520 42 re f\n";
  content += "0.02 0.13 0.29 rg\n";
  content += textLine(56, 732, title, 20, "F2");
  content += textLine(56, 714, subtitle, 10, "F1");
  content += "0.82 0.88 0.94 RG 1 w\n";
  content += rule(46, 694, 566);
  content += "0.02 0.13 0.29 rg\n";

  let y = 666;
  for (const line of lines) {
    if (line.kind === "section") {
      content += textLine(56, y, line.text, 13, "F2");
      y -= 20;
      continue;
    }

    if (line.kind === "small") {
      content += textLine(74, y, line.text, 9, "F1");
      y -= 13;
      continue;
    }

    content += textLine(56, y, line.text, 10.5, line.bold ? "F2" : "F1");
    y -= line.gap ?? 18;
  }

  content += "0.82 0.88 0.94 RG 1 w\n";
  content += rule(46, 54, 566);
  content += textLine(276, 36, `TeachLens worksheet - Page ${pageNumber}`, 9, "F1");
  return content;
}

const areaQuestionLines = [
  { kind: "small", text: "Use exact answers in terms of pi." },
  { kind: "section", text: "Sector Area" },
  ...questions
    .slice(0, 10)
    .flatMap((question) => [
      { text: `${question.number}. ${question.prompt}` },
      { text: "   Answer: ______________________________", gap: 20 }
    ])
];

const perimeterQuestionLines = [
  { kind: "small", text: "Use exact answers in terms of pi. Remember: perimeter includes two radii and the arc." },
  { kind: "section", text: "Sector Perimeter" },
  ...questions
    .slice(10)
    .flatMap((question) => [
      { text: `${question.number}. ${question.prompt}` },
      { text: "   Answer: ______________________________", gap: 20 }
    ])
];

const answerLines = [
  { kind: "small", text: "Formula reminders: area = (theta / 360) x pi r^2. Perimeter = 2r + arc length." },
  { kind: "section", text: "Answers" },
  ...questions.map((question) => ({
    text: `${question.number}. ${question.type}: ${question.answer}`,
    gap: 17
  }))
];

const pages = [
  pageContent(
    "Sector Area Worksheet",
    "10 practice questions",
    areaQuestionLines,
    1
  ),
  pageContent(
    "Sector Perimeter Worksheet",
    "10 practice questions",
    perimeterQuestionLines,
    2
  ),
  pageContent(
    "Sector Area and Perimeter Answers",
    "Check after completing the worksheet",
    answerLines,
    3
  )
];

function createPdf(pageStreams) {
  const objects = [];
  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("");
  const fontRegularId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const fontBoldId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageIds = [];
  const streamIds = [];

  for (const stream of pageStreams) {
    const streamId = addObject(`<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}endstream`);
    streamIds.push(streamId);
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R >> >> /Contents ${streamId} 0 R >>`
    );
    pageIds.push(pageId);
  }

  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, "utf8");
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, createPdf(pages));
console.log(outputPath);
