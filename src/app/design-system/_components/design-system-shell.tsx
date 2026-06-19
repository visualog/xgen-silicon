"use client";

import { Columns3, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

import { Button } from "@/components/ui";
import { designSystemNav } from "../_data/design-system";
import {
  DesignSystemPreferencesProvider,
  useDesignSystemPreferences,
} from "./design-system-preferences";

const GRID_COLUMN_COUNT = 12;
const DEFAULT_GRID_MEASUREMENTS = {
  columnCount: 4,
  columnWidth: 0,
  gutter: 16,
};

type GridMeasurements = typeof DEFAULT_GRID_MEASUREMENTS;

function getGridMeasurements(): GridMeasurements {
  if (typeof window === "undefined") {
    return DEFAULT_GRID_MEASUREMENTS;
  }

  const viewportWidth = window.innerWidth;
  const columnCount = viewportWidth >= 1024 ? 12 : viewportWidth >= 768 ? 8 : 4;
  const gutter = viewportWidth >= 768 ? 24 : 16;
  const railWidth = Math.min(Math.max(viewportWidth - 32, 0), 1120);
  const columnWidth = Math.max((railWidth - gutter * (columnCount - 1)) / columnCount, 0);

  return {
    columnCount,
    columnWidth,
    gutter,
  };
}

function formatPixel(value: number) {
  return `${Math.round(value)}px`;
}

export function DesignSystemShell({ children }: { children: ReactNode }) {
  return (
    <DesignSystemPreferencesProvider>
      <DesignSystemShellContent>{children}</DesignSystemShellContent>
    </DesignSystemPreferencesProvider>
  );
}

function DesignSystemShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { locale, setLocale, showGrid, setShowGrid, theme, setTheme, text } = useDesignSystemPreferences();

  return (
    <main className="shadcn-docs-surface" data-grid-visible={showGrid ? "true" : "false"}>
      <DesignGridOverlay />
      <header className="shadcn-docs-header">
        <div className="shadcn-docs-header-inner grid grid-cols-[auto_auto] items-center justify-between gap-x-4 gap-y-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-x-8">
          <Link href="/design-system" className="flex min-w-0 items-center gap-2.5 text-sm font-semibold">
            <span className="grid size-7 place-items-center rounded-xl border bg-card text-xs shadow-xs">x</span>
            <span className="hidden sm:inline">xGen Design System</span>
          </Link>
          <nav
            className="order-3 col-span-2 flex min-w-0 items-center gap-2 overflow-x-auto text-sm font-medium md:order-none md:col-span-1 md:justify-center md:gap-3 md:overflow-visible"
            aria-label="Design system navigation"
          >
            {designSystemNav.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-slot="design-system-nav-link"
                  aria-current={active ? "page" : undefined}
                  className={
                    active
                      ? "shrink-0 border bg-card text-foreground shadow-xs"
                      : "shrink-0 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
                  }
                >
                  {text(item.label)}
                </Link>
              );
            })}
          </nav>
          <div className="flex shrink-0 items-center justify-end gap-3">
            <PreferenceButton
              icon={<Columns3 size={15} />}
              isOn={showGrid}
              variant="icon"
              ariaLabel={text({ ko: "디자인 시스템 그리드 표시 전환", en: "Toggle design system grid" })}
              onToggle={() => setShowGrid(!showGrid)}
            />
            <PreferenceButton
              label={locale === "ko" ? "KO" : "EN"}
              isOn={locale === "en"}
              variant="text"
              ariaLabel={text({ ko: "디자인 시스템 언어 전환", en: "Switch design system language" })}
              onToggle={() => setLocale(locale === "ko" ? "en" : "ko")}
            />
            <PreferenceButton
              icon={theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
              isOn={theme === "dark"}
              variant="icon"
              ariaLabel={text({ ko: "디자인 시스템 테마 전환", en: "Switch design system theme" })}
              onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
            <Button asChild size="sm" variant="ghost" className="hidden md:inline-flex">
              <Link href="/">{text({ ko: "xGen 열기", en: "Open xGen" })}</Link>
            </Button>
          </div>
        </div>
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

function DesignGridOverlay() {
  const [measurements, setMeasurements] = useState<GridMeasurements>(DEFAULT_GRID_MEASUREMENTS);
  const columnWidth = formatPixel(measurements.columnWidth);
  const gutterWidth = formatPixel(measurements.gutter);

  useEffect(() => {
    const updateMeasurements = () => setMeasurements(getGridMeasurements());

    updateMeasurements();
    window.addEventListener("resize", updateMeasurements);

    return () => window.removeEventListener("resize", updateMeasurements);
  }, []);

  const overlayStyle = {
    "--docs-grid-column-count": String(measurements.columnCount),
    "--docs-grid-gutter": gutterWidth,
  } as CSSProperties;

  const gapGridTemplate = useMemo(
    () =>
      Array.from({ length: measurements.columnCount * 2 - 1 }, (_, index) =>
        index % 2 === 0 ? `${measurements.columnWidth}px` : `${measurements.gutter}px`
      ).join(" "),
    [measurements.columnCount, measurements.columnWidth, measurements.gutter]
  );

  return (
    <div data-slot="docs-grid-overlay" style={overlayStyle} aria-hidden="true">
      <div data-slot="docs-grid-columns">
        {Array.from({ length: GRID_COLUMN_COUNT }, (_, index) => (
          <span
            key={index + 1}
            data-slot="docs-grid-column"
            data-visible={index < measurements.columnCount ? "true" : "false"}
          >
            <span data-slot="docs-grid-column-number">{index + 1}</span>
            <span data-slot="docs-grid-column-width">{columnWidth}</span>
          </span>
        ))}
      </div>
      <div data-slot="docs-grid-gaps" style={{ gridTemplateColumns: gapGridTemplate }}>
        {Array.from({ length: Math.max(measurements.columnCount - 1, 0) }, (_, index) => (
          <span
            key={index + 1}
            data-slot="docs-grid-gap-label"
            style={{ gridColumn: `${(index + 1) * 2} / span 1` }}
          >
            {gutterWidth}
          </span>
        ))}
      </div>
      <div data-slot="docs-grid-baseline" />
      <div data-slot="docs-grid-legend">
        <span data-slot="docs-grid-legend-column">
          {measurements.columnCount} columns / {columnWidth}
        </span>
        <span data-slot="docs-grid-legend-gap">{gutterWidth} gaps</span>
        <span data-slot="docs-grid-legend-baseline">8px baseline</span>
      </div>
    </div>
  );
}

function PreferenceButton({
  icon,
  label,
  isOn,
  variant,
  ariaLabel,
  onToggle,
}: {
  icon?: ReactNode;
  label?: string;
  isOn: boolean;
  variant: "text" | "icon";
  ariaLabel: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      data-slot="design-system-preference-button"
      data-state={isOn ? "on" : "off"}
      data-variant={variant}
      aria-label={ariaLabel}
      aria-pressed={isOn}
      onClick={onToggle}
    >
      {icon ? (
        <span data-slot="design-system-preference-icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {label ? <span data-slot="design-system-preference-label">{label}</span> : null}
    </button>
  );
}
