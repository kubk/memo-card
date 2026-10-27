import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { links } from "api";

const connectSteps = [
  "In Claude, open Settings → Connectors and browse the directory",
  "Find MemoCard and click Connect",
  "Sign in with Telegram on the MemoCard page and allow access",
  "Ask Claude to work with your cards",
];

const capabilities = [
  "Find your folders, decks and cards",
  "Create folders, decks and cards with examples",
  "Edit cards, decks and folders",
  "Move cards between decks while keeping their review history",
  "Delete cards, only when you explicitly ask",
];

const examplePrompts = [
  "Add a card “der Hund → the dog” to my German deck in MemoCard",
  "Create five Spanish restaurant flashcards in a new MemoCard deck",
  "Add example sentences to the cards in my Spanish deck",
  "Move the travel cards from my Spanish deck into a new deck",
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-blue-600 hover:underline">
      {children}
    </a>
  );
}

export function ConnectToClaudePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="border-b border-gray-200">
        <div className="container mx-auto flex max-w-3xl items-center px-4 py-4">
          <Link to="/" className="flex items-center font-semibold gap-2">
            <img src={"/logoI.png"} alt="MemoCard Logo" className="h-6" />
            <span>MemoCard</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-12 text-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Connect MemoCard to Claude
        </h1>
        <p>
          Ask Claude to create, find, improve and organize flashcards in your
          MemoCard library, then study them in MemoCard on the web or in
          Telegram
        </p>

        <Section title="Requirements">
          <p>A MemoCard account with MemoCard Pro. You sign in with Telegram</p>
        </Section>

        <Section title="Connect">
          <ol className="list-decimal pl-6 space-y-2">
            {connectSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-3">
            The connector works in Claude on the web, desktop, iOS and Android
          </p>
        </Section>

        <Section title="What Claude can do">
          <ul className="list-disc pl-6 space-y-2">
            {capabilities.map((capability) => (
              <li key={capability}>{capability}</li>
            ))}
          </ul>
          <p className="mt-3">
            Studying and review scheduling stay in the MemoCard app
          </p>
        </Section>

        <Section title="Example prompts">
          <ul className="list-disc pl-6 space-y-2">
            {examplePrompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
        </Section>

        <Section title="Disconnect">
          <p>
            Open Settings → Connectors in Claude, select MemoCard and disconnect
            it
          </p>
        </Section>

        <Section title="Privacy">
          <p>
            MemoCard receives only what Claude passes to its tools, not your
            conversation. Read the{" "}
            <TextLink href={links.privacyPolicy}>privacy policy</TextLink> and{" "}
            <TextLink href={links.termsOfService}>terms of service</TextLink>
          </p>
        </Section>

        <Section title="Support">
          <p>
            Write to{" "}
            <TextLink href={links.supportChat}>{links.supportHandle}</TextLink>{" "}
            on Telegram or{" "}
            <TextLink href={"mailto:" + links.supportEmail}>
              {links.supportEmail}
            </TextLink>
          </p>
        </Section>
      </main>
    </div>
  );
}
