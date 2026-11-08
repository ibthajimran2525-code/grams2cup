import Link from "next/link";
import { CATEGORY_LABELS, INGREDIENTS, conversionPath, type Category } from "@/lib/ingredients";

export default function Home() {
  const cats = Object.keys(CATEGORY_LABELS) as Category[];
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold leading-tight">Grams to Cups Converter for Every Ingredient</h1>
      <p className="mt-3 text-lg text-slate-800">
        A cup of flour and a cup of sugar weigh different amounts. Pick an ingredient and weight to get the exact US, metric or UK cup measure.
      </p>
      {cats.map((c) => (
        <section key={c} id={c} className="mt-10 scroll-mt-6">
          <h2 className="text-2xl font-semibold">{CATEGORY_LABELS[c]}</h2>
          <ul className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {INGREDIENTS.filter((i) => i.category === c).map((i) => (
              <li key={i.slug} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                <span className="w-48 font-medium">{i.name}</span>
                {[50, 100, 250, 500].map((g) => (
                  <Link key={g} href={conversionPath(i, g)} className="text-sm text-brand underline-offset-2 hover:underline">{g}g to cups</Link>
                ))}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
