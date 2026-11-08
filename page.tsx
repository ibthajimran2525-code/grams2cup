import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ConverterTool from "@/components/ConverterTool";
import { buildContent, buildSchemas, jsonLd } from "@/lib/content";
import {
  CATEGORY_LABELS, conversionPath, familyOf, getIngredient, getStaticCombos, neighborAmounts, parseConversionSlug,
} from "@/lib/ingredients";

type Params = { ingredient: string; conversion: string };
type Props = { params: Promise<Params> };

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  return getStaticCombos(1000);
}

function resolve(p: Params) {
  const ing = getIngredient(p.ingredient);
  const amount = parseConversionSlug(p.conversion);
  if (!ing || amount === null) notFound();
  return { ing, amount };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ing, amount } = resolve(await params);
  const c = buildContent(ing, amount);
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: c.url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
    },
    openGraph: { title: c.title, description: c.description, url: c.url, type: "article", siteName: "grams2cup", locale: "en_US" },
    twitter: { card: "summary_large_image", title: c.title, description: c.description },
  };
}

export default async function Page({ params }: Props) {
  const { ing, amount } = resolve(await params);
  const c = buildContent(ing, amount);
  const schemas = buildSchemas(ing, amount, c);
  const family = familyOf(ing);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(s) }} />
      ))}

      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-600">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li><Link href="/" className="underline-offset-2 hover:underline">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/#${ing.category}`} className="underline-offset-2 hover:underline">{CATEGORY_LABELS[ing.category]}</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/${ing.slug}`} className="underline-offset-2 hover:underline">{ing.name}</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-medium text-slate-900">{amount} Grams to Cups</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">{c.h1}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-800" data-snippet>{c.snippet}</p>

      <div className="mt-6">
        <ConverterTool initialSlug={ing.slug} initialAmount={amount} />
      </div>

      <section className="mt-12" aria-labelledby="density">
        <h2 id="density" className="text-2xl font-semibold text-slate-900">{c.densityHeading}</h2>
        {c.densityParagraphs.map((p, i) => (
          <p key={i} className="mt-3 leading-relaxed text-slate-800">{p}</p>
        ))}
      </section>

      <section className="mt-12" id="measure" aria-labelledby="measure-h">
        <h2 id="measure-h" className="text-2xl font-semibold text-slate-900">{c.measureHeading}</h2>
        <p className="mt-3 leading-relaxed text-slate-800">{c.measureIntro}</p>
        <ol className="mt-4 space-y-3">
          {c.steps.map((s, i) => (
            <li key={s.name} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">{i + 1}</span>
              <p className="leading-relaxed text-slate-800"><strong className="font-semibold">{s.name}.</strong> {s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 leading-relaxed text-slate-800">{c.measureOutro}</p>
      </section>

      <section className="mt-12" aria-labelledby="grid">
        <h2 id="grid" className="text-2xl font-semibold text-slate-900">{c.gridHeading}</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">{ing.name} grams to cups, tablespoons and ounces</caption>
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th scope="col" className="px-3 py-2 font-semibold">Grams</th>
                <th scope="col" className="px-3 py-2 font-semibold">US cups</th>
                <th scope="col" className="px-3 py-2 font-semibold">Metric cups</th>
                <th scope="col" className="px-3 py-2 font-semibold">Tbsp</th>
                <th scope="col" className="px-3 py-2 font-semibold">Ounces</th>
              </tr>
            </thead>
            <tbody>
              {c.gridRows.map((row) => (
                <tr key={row.grams} className={`border-t border-slate-200 ${row.current ? "bg-emerald-50 font-semibold" : ""}`}>
                  <th scope="row" className="px-3 py-2">
                    <Link href={conversionPath(ing, row.grams)} className="text-brand underline-offset-2 hover:underline">{row.grams} g</Link>
                  </th>
                  <td className="px-3 py-2">{row.usCups}</td>
                  <td className="px-3 py-2">{row.metricCups}</td>
                  <td className="px-3 py-2 tabular-nums">{row.tbsp}</td>
                  <td className="px-3 py-2 tabular-nums">{row.oz}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="faq">
        <h2 id="faq" className="text-2xl font-semibold text-slate-900">{c.faqHeading}</h2>
        <dl className="mt-4 space-y-5">
          {c.faqs.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-slate-900">{f.q}</dt>
              <dd className="mt-1 leading-relaxed text-slate-800">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <nav className="mt-12" aria-label={`Nearby ${ing.name} weights`}>
        <h2 className="text-lg font-semibold text-slate-900">Nearby {ing.name} weights</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {neighborAmounts(amount).map((n) => (
            <li key={n}>
              <Link href={conversionPath(ing, n)} className="inline-block rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50">
                {n} grams to cups
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="mt-8" aria-label={`More ${CATEGORY_LABELS[ing.category]}`}>
        <h2 className="text-lg font-semibold text-slate-900">Other {CATEGORY_LABELS[ing.category].toLowerCase()}, {amount}g</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {family.map((f) => (
            <li key={f.slug}>
              <Link href={conversionPath(f, amount)} className="inline-block rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50">
                {amount}g {f.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
