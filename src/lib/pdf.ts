import jsPDF from "jspdf";

export type BrandSnapshot = {
  basics: {
    name: string;
    tagline?: string;
    link?: string;
    elevator?: string;
  };
  sliders: Array<{ label: string; value: number; left?: string; right?: string }>;
  keyAnswers: Array<{ question: string; answer: string }>;
};

export function generateBrandPersonalitySnapshotPDF(snapshot: BrandSnapshot): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  let y = margin;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Brand Personality Snapshot", margin, y);

  y += 28;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${snapshot.basics.name}`, margin, y);
  y += 18;
  if (snapshot.basics.tagline) {
    doc.text(`Tagline: ${snapshot.basics.tagline}`, margin, y);
    y += 18;
  }
  if (snapshot.basics.link) {
    doc.text(`Link: ${snapshot.basics.link}`, margin, y);
    y += 18;
  }

  if (snapshot.basics.elevator) {
    const lines = doc.splitTextToSize(`Elevator: ${snapshot.basics.elevator}`, 520);
    doc.text(lines, margin, y);
    y += lines.length * 14 + 12;
  }

  // Sliders
  doc.setFont("helvetica", "bold");
  doc.text("Personality Sliders", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  snapshot.sliders.forEach((s) => {
    doc.text(`${s.label}: ${s.left} ${"".padEnd(10, "·")} ${s.value}/100 ${"".padEnd(10, "·")} ${s.right}`, margin, y);
    y += 16;
  });

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Key Answers", margin, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  snapshot.keyAnswers.forEach(({ question, answer }) => {
    const q = doc.splitTextToSize(question, 520);
    const a = doc.splitTextToSize(answer || "—", 520);
    doc.text(q, margin, y);
    y += q.length * 14 + 6;
    doc.text(a, margin + 12, y);
    y += a.length * 14 + 12;
  });

  return doc.output("arraybuffer") as unknown as Uint8Array;
}

