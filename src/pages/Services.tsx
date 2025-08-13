import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  { title: "Brand Strategy", desc: "Positioning, audience clarity, and messaging that makes decisions easy." },
  { title: "Logo & Mark Systems", desc: "Distinct monograms and wordmarks with scalable usage rules." },
  { title: "Full Brand Identity", desc: "Typography, color, art direction, and ready-to-use templates." },
  { title: "Social Media Branding", desc: "Channel kits for consistent, magnetic presence." },
  { title: "Marketing Campaigns", desc: "High-impact visuals for launches and growth pushes." },
];

export default function Services() {
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>Services – KING</title>
        <meta name="description" content="Branding services: strategy, logos, full identity, social branding, and campaigns." />
        <link rel="canonical" href="/services" />
      </Helmet>
      <h1 className="font-display text-4xl">Services</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.title} className="border bg-card">
            <CardHeader>
              <CardTitle className="font-display">{s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
