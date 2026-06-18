"use client";

import { Languages, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui";
import { designSystemNav } from "../_data/design-system";
import {
  type DesignSystemLocale,
  type DesignSystemTheme,
  DesignSystemPreferencesProvider,
  useDesignSystemPreferences,
} from "./design-system-preferences";

export function DesignSystemShell({ children }: { children: ReactNode }) {
  return (
    <DesignSystemPreferencesProvider>
      <DesignSystemShellContent>{children}</DesignSystemShellContent>
    </DesignSystemPreferencesProvider>
  );
}

function DesignSystemShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { locale, setLocale, theme, setTheme, text } = useDesignSystemPreferences();

  return (
    <main className="shadcn-docs-surface">
      <header className="shadcn-docs-header">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/design-system" className="flex items-center gap-2.5 text-sm font-semibold">
            <span className="grid size-7 place-items-center rounded-xl border bg-card text-xs shadow-xs">x</span>
            <span className="hidden sm:inline">xGen Design System</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm font-medium md:flex" aria-label="Design system navigation">
            {designSystemNav.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "rounded-xl border bg-card px-3 py-1.5 text-foreground shadow-xs"
                      : "rounded-xl px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  }
                >
                  {text(item.label)}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <PreferenceToggle
              icon={<Languages size={15} />}
              value={locale}
              options={[
                { value: "ko", label: "한" },
                { value: "en", label: "EN" },
              ]}
              ariaLabel={text({ ko: "디자인 시스템 언어 전환", en: "Switch design system language" })}
              onChange={(value) => setLocale(value as DesignSystemLocale)}
            />
            <PreferenceToggle
              icon={theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
              value={theme}
              options={[
                { value: "light", label: text({ ko: "라이트", en: "Light" }) },
                { value: "dark", label: text({ ko: "다크", en: "Dark" }) },
              ]}
              ariaLabel={text({ ko: "디자인 시스템 테마 전환", en: "Switch design system theme" })}
              onChange={(value) => setTheme(value as DesignSystemTheme)}
            />
            <Button asChild size="sm" variant="ghost" className="hidden md:inline-flex">
              <Link href="/">{text({ ko: "xGen 열기", en: "Open xGen" })}</Link>
            </Button>
          </div>
        </div>
        <nav
          className="mx-auto flex w-full max-w-7xl gap-1 overflow-x-auto px-4 pb-3 text-sm font-medium sm:px-6 md:hidden"
          aria-label="Mobile design system navigation"
        >
          {designSystemNav.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "shrink-0 rounded-xl border bg-card px-3 py-1.5 text-foreground shadow-xs"
                    : "shrink-0 rounded-xl px-3 py-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                }
              >
                {text(item.label)}
              </Link>
            );
          })}
        </nav>
      </header>
      <div
        data-slot="design-system-body"
        className="shadcn-docs-body"
      >
        {children}
      </div>
    </main>
  );
}

function PreferenceToggle({
  icon,
  value,
  options,
  ariaLabel,
  onChange,
}: {
  icon: ReactNode;
  value: string;
  options: Array<{ value: string; label: string }>;
  ariaLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-xl border bg-card p-1 shadow-xs" aria-label={ariaLabel}>
      <span className="grid size-7 place-items-center text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          data-slot="design-system-preference-option"
          aria-pressed={value === option.value}
          className={
            value === option.value
              ? "h-7 rounded-lg bg-foreground px-2 text-xs font-medium text-background"
              : "h-7 rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          }
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
