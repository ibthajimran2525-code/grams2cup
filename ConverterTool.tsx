"use client";

import { useEffect, useRef, useState } from "react";
import {
  CATEGORY_LABELS, INGREDIENTS, MAX_GRAMS, OUNCE_G, STANDARDS, convert, cupsToGrams, fmtNum, formatCups, getIngredient,
  type Category, type Ingredient, type Standard,
} from "@/lib/ingredients";

type Mode = "g2c" | "c2g";
interface Props { initialSlug: string; initialAmount: number }

const STD_ORDER: Standard[] = ["us", "legal", "metric", "uk"];
const STEPS = [-25, -10, 10, 25];
const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

const toText = (g: number, m: Mode, s: Standard, i: Ingredient): string =>
  m === "g2c" ? String(Math.round(g * 10) / 10) : fmtNum(convert(g, i, s).cups, 3);

export default function ConverterTool({ initialSlug, initialAmount }: Props) {
  const [slug, setSlug] = useState(initialSlug);
  const [std, setStd] = useState<Standard>("us");
  const [mode, setMode] = useState<Mode>("g2c");
  const [grams, setGrams] = useState(initialAmount);
  const [text, setText] = useState(String(initialAmount));
  const [toast, setToast] = useState<string>("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const ing = getIngredient(slug) ?? INGREDIENTS[0];
  const r = convert(grams, ing, std);

  const sync = (g: number, m: Mode = mode, s: Standard = std, i: Ingredient = ing) => {
    const c = Math.min(MAX_GRAMS, Math.max(0, g));
    setGrams(c);
    setText(toText(c, m, s, i));
  };

  const onText = (v: string) => {
    setText(v);
    const n = parseFloat(v);
    if (!isFinite(n) || n < 0) return;
    setGrams(Math.min(MAX_GRAMS, mode === "g2c" ? n : cupsToGrams(n, ing, std)));
  };

  const onIngredient = (v: string) => {
    const next = getIngredient(v) ?? ing;
    setSlug(next.slug);
    setText(toText(grams, mode, std, next));
  };

  const onStandard = (s: Standard) => {
    setStd(s);
    setText(toText(grams, mode, s, ing));
  };

  const onSwap = () => {
    const m: Mode = mode === "g2c" ? "c2g" : "g2c";
    setMode(m);
    setText(toText(grams, m, std, ing));
  };

  const headline = mode === "g2c" ? formatCups(r.cups) : `${fmtNum(grams, 1)} g`;
  const detail =
    mode === "g2c"
      ? `${fmtNum(r.cups, 2)} cups · ${fmtNum(r.tbsp, 1)} tbsp · ${fmtNum(r.tsp, 1)} tsp · ${fmtNum(grams / OUNCE_G, 2)} oz`
      : `${formatCups(r.cups)} · ${fmtNum(grams / OUNCE_G, 2)} oz · ${fmtNum(r.tbsp, 1)} tbsp`;
  const summary =
    mode === "g2c"
      ? `${fmtNum(grams, 1)} g ${ing.name} = ${formatCups(r.cups)} (${STANDARDS[std].label})`
      : `${fmtNum(r.cups, 3)} cups ${ing.name} = ${fmtNum(grams, 1)} g (${STANDARDS[std].label})`;

  const flash = (msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 1800);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      flash("Copied to clipboard");
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = summary;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        flash(ok ? "Copied to clipboard" : "Copy failed. Select the text manually.");
      } catch {
        flash("Copy failed. Select the text manually.");
      }
    }
  };

  const field = "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40";

  return (
    <section aria-label="Grams to cups converter" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div role="tablist" aria-label="Measurement standard" className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STD_ORDER.map((s) => (
          <button
            key={s}
            role="tab"
            type="button"
            aria-selected={std === s}
            onClick={() => onStandard(s)}
            className={`h-10 rounded-lg border text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              std === s ? "border-brand bg-brand text-white" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {STANDARDS[s].label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
        <div>
          <label htmlFor="g2c-amount" className="mb-1 block text-sm font-medium text-slate-700">
            {mode === "g2c" ? "Weight in grams" : "Volume in cups"}
          </label>
          <input id="g2c-amount" inputMode="decimal" className={field} value={text} onChange={(e) => onText(e.target.value)} />
        </div>
        <button
          type="button"
          onClick={onSwap}
          aria-label={mode === "g2c" ? "Switch to cups to grams" : "Switch to grams to cups"}
          className="h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {mode === "g2c" ? "Grams → Cups" : "Cups → Grams"}
        </button>
        <div>
          <label htmlFor="g2c-ingredient" className="mb-1 block text-sm font-medium text-slate-700">Ingredient</label>
          <select id="g2c-ingredient" className={field} value={ing.slug} onChange={(e) => onIngredient(e.target.value)}>
            {CATEGORIES.map((c) => (
              <optgroup key={c} label={CATEGORY_LABELS[c]}>
                {INGREDIENTS.filter((i) => i.category === c).map((i) => (
                  <option key={i.slug} value={i.slug}>{i.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="g2c-slider" className="mb-1 block text-sm font-medium text-slate-700">
          Adjust weight: {fmtNum(grams, 0)} g
        </label>
        <input
          id="g2c-slider"
          type="range"
          min={1}
          max={2000}
          step={1}
          value={Math.min(Math.max(Math.round(grams), 1), 2000)}
          onChange={(e) => sync(Number(e.target.value))}
          className="h-6 w-full accent-brand"
        />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {STEPS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => sync(grams + d)}
              className="h-10 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-800 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {d > 0 ? `+${d}g` : `${d}g`}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-6 flex min-h-[176px] flex-col justify-between rounded-xl bg-brand p-5 text-white" aria-live="polite">
        <div>
          <p className="text-sm font-medium text-emerald-50">
            {mode === "g2c" ? `${fmtNum(grams, 1)} g of ${ing.name} equals` : `${fmtNum(r.cups, 3)} cups of ${ing.name} equals`}
          </p>
          <p className="mt-1 text-3xl font-bold leading-tight tabular-nums sm:text-4xl">{headline}</p>
          <p className="mt-2 text-sm text-emerald-50 tabular-nums">{detail}</p>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-emerald-50">
            {STANDARDS[std].label} cup = {STANDARDS[std].cupMl} ml · {ing.method}
          </p>
          <button
            type="button"
            onClick={copy}
            className="h-10 shrink-0 rounded-lg bg-white px-4 text-sm font-semibold text-brand hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Copy result
          </button>
        </div>
        <span
          role="status"
          className={`pointer-events-none absolute right-4 top-4 rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white transition-opacity ${toast ? "opacity-100" : "opacity-0"}`}
        >
          {toast || "\u00A0"}
        </span>
      </div>
    </section>
  );
}
