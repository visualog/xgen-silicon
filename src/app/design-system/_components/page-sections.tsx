"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";
import { type LocalizedText, useDesignSystemPreferences } from "./design-system-preferences";

type CardLink = {
  title: LocalizedText;
  href: string;
  description: LocalizedText;
  items: string[];
};

type InfoGroup = {
  title: LocalizedText;
  description: LocalizedText;
  items?: string[];
  components?: string[];
};

export function PageHero({
  label,
  title,
  description,
  action,
}: {
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  action?: { href: string; label: LocalizedText };
}) {
  const { text } = useDesignSystemPreferences();

  return (
    <section className="grid gap-8 py-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="max-w-3xl space-y-6">
        <Badge variant="outline">{text(label)}</Badge>
        <h1 className="text-4xl leading-11 font-semibold tracking-tight text-balance sm:text-5xl sm:leading-14">
          {text(title)}
        </h1>
        <p className="max-w-2xl text-base leading-6 text-muted-foreground text-balance sm:text-lg sm:leading-8">
          {text(description)}
        </p>
      </div>
      {action ? (
        <div className="flex lg:justify-end">
          <Button asChild>
            <Link href={action.href}>{text(action.label)}</Link>
          </Button>
        </div>
      ) : null}
    </section>
  );
}

export function SectionIntro({
  label,
  title,
  description,
}: {
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
}) {
  const { text } = useDesignSystemPreferences();

  return (
    <div className="space-y-4">
      <Badge variant="outline">{text(label)}</Badge>
      <h2 className="max-w-3xl text-3xl leading-10 font-semibold tracking-tight text-balance">{text(title)}</h2>
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{text(description)}</p>
    </div>
  );
}

export function LinkCardGrid({ cards }: { cards: CardLink[] }) {
  const { text } = useDesignSystemPreferences();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.href} className="transition-[border-color,box-shadow] duration-200 hover:border-ring/30">
          <CardHeader>
            <CardTitle>{text(card.title)}</CardTitle>
            <CardDescription>{text(card.description)}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {card.items.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm">
              <Link href={card.href}>{text({ ko: "보기", en: "View" })}</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function InfoGrid({ groups }: { groups: InfoGroup[] }) {
  const { text } = useDesignSystemPreferences();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <Card key={text(group.title)} className="transition-[border-color,box-shadow] duration-200 hover:border-ring/30">
          <CardHeader>
            <CardTitle>{text(group.title)}</CardTitle>
            <CardDescription>{text(group.description)}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {(group.items ?? group.components ?? []).map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function BoundaryGrid({ groups }: { groups: InfoGroup[] }) {
  const { text } = useDesignSystemPreferences();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {groups.map((group) => (
        <Card key={text(group.title)} className="transition-[border-color,box-shadow] duration-200 hover:border-ring/30">
          <CardHeader>
            <CardTitle>{text(group.title)}</CardTitle>
            <CardDescription>{text(group.description)}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            {(group.items ?? []).map((item) => (
              <code key={item} data-slot="docs-code-chip" className="rounded-md bg-muted px-2 py-1">
                {item}
              </code>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function TemplatePreview({ regions }: { regions: LocalizedText[] }) {
  const { text } = useDesignSystemPreferences();

  return (
    <div className="grid gap-6">
      <div data-slot="preview-frame" className="rounded-2xl border bg-muted/30 p-6">
        <div className="grid gap-3">
          <div className="h-3 w-2/5 rounded-full bg-muted-foreground/20" />
          <div className="h-20 rounded-xl bg-background" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-10 rounded-lg bg-background" />
            <div className="h-10 rounded-lg bg-background" />
            <div className="h-10 rounded-lg bg-background" />
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <Badge key={text(region)} variant="outline">
            {text(region)}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function TemplateGrid({
  templates,
}: {
  templates: Array<{
    name: LocalizedText;
    route: string;
    purpose: LocalizedText;
    regions: LocalizedText[];
  }>;
}) {
  const { text } = useDesignSystemPreferences();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.route} className="transition-[border-color,box-shadow] duration-200 hover:border-ring/30">
          <CardHeader>
            <Badge className="w-fit" variant="secondary">
              {template.route}
            </Badge>
            <CardTitle>{text(template.name)}</CardTitle>
            <CardDescription>{text(template.purpose)}</CardDescription>
          </CardHeader>
          <CardContent>
            <TemplatePreview regions={template.regions} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
