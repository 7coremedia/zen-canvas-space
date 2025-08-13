import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <main className="container mx-auto py-12">
      <Helmet>
        <title>About – KING</title>
        <meta name="description" content="About KING Edmund: experience, mission, and creative philosophy." />
        <link rel="canonical" href="/about" />
      </Helmet>
      <h1 className="font-display text-4xl">About</h1>
      <article className="prose prose-neutral mt-6 max-w-3xl dark:prose-invert">
        <p>
          I craft premium identities that feel inevitable — bold, minimal, and built to lead. My work balances clarity with character so brands can speak simply and still be unforgettable.
        </p>
        <p>
          Over the years I’ve partnered with founders and teams to design mark systems, brand guidelines, launch assets, and campaigns that don’t just look good — they move people to action.
        </p>
        <p>
          Philosophy: less noise, more gravity. Use design to focus attention and amplify authority.
        </p>
      </article>
    </main>
  );
}
