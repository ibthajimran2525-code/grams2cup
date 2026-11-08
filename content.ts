import {
  CATEGORY_LABELS, INGREDIENTS, OUNCE_G, SITE_NAME, SITE_URL, STANDARDS, conversionPath, convert, densityLabel,
  fmtNum, formatCups, getIngredient, ingredientIndex, type Ingredient, type Method,
} from "./ingredients";

export interface Faq { q: string; a: string }
export interface Step { name: string; text: string }
export interface GridRow { grams: number; usCups: string; metricCups: string; tbsp: string; oz: string; current: boolean }

export interface PageContent {
  url: string;
  h1: string;
  title: string;
  description: string;
  snippet: string;
  densityHeading: string;
  densityParagraphs: string[];
  measureHeading: string;
  measureIntro: string;
  steps: Step[];
  measureOutro: string;
  gridHeading: string;
  gridRows: GridRow[];
  faqHeading: string;
  faqs: Faq[];
  usCups: string;
}

const pick = <T,>(arr: readonly T[], seed: number): T => arr[Math.abs(seed) % arr.length];
const clip = (s: string, n: number): string => (s.length <= n ? s : `${s.slice(0, n - 1).trimEnd()}…`);

const METHOD_STEPS: Record<Method, [string, string, string]> = {
  "Spoon and Level": [
    "Fluff the ingredient in its container with a fork so compacted powder loosens up.",
    "Spoon it gently into a dry measuring cup until it mounds over the rim. Never dip the cup into the bag, because scooping compresses the powder.",
    "Sweep the back of a knife across the rim to level the surface without tapping or shaking the cup.",
  ],
  "Sifted Direct": [
    "Sift the ingredient onto a sheet of parchment so clumps break apart and air is distributed evenly.",
    "Spoon the sifted powder lightly into a dry measuring cup without pressing down.",
    "Level the rim with a straight edge and leave the cup untapped.",
  ],
  Packed: [
    "Bring the ingredient to room temperature so it presses evenly.",
    "Press it firmly into a dry measuring cup with the back of a spoon until no air pockets remain.",
    "Level the top, then tip the cup out: the contents should hold the shape of the cup.",
  ],
  "Pour and Level": [
    "Stir the ingredient once in its container so settled pieces redistribute.",
    "Pour it into a dry measuring cup in a steady stream until it overfills slightly.",
    "Level the rim with a knife and let the excess fall back without shaking the cup.",
  ],
  "Liquid Measure": [
    "Use a clear liquid measuring jug with graduated markings rather than a dry cup.",
    "Set the jug on a flat counter and pour slowly, then bend down so your eyes sit level with the marking.",
    "Read the line at the bottom of the curved surface, and coat the jug with a little oil first when measuring sticky syrups.",
  ],
};

export function buildContent(ing: Ingredient, amount: number): PageContent {
  const seed = amount + ingredientIndex(ing.slug) * 7;
  const A = String(amount);
  const N = ing.name;
  const us = convert(amount, ing, "us");
  const legal = convert(amount, ing, "legal");
  const metric = convert(amount, ing, "metric");
  const uk = convert(amount, ing, "uk");
  const US = formatCups(us.cups);
  const M = formatCups(metric.cups);
  const UK = formatCups(uk.cups);
  const LEGAL = formatCups(legal.cups);
  const TB = fmtNum(us.tbsp, 1);
  const TS = fmtNum(us.tsp, 1);
  const D = densityLabel(ing);
  const url = `${SITE_URL}${conversionPath(ing, amount)}`;

  const h1 = pick(
    [
      `${A} Grams of ${N} to Cups: ${US}`,
      `Convert ${A}g ${N} to US Cups (${US})`,
      `How Many Cups Is ${A} Grams of ${N}?`,
      `${A}g ${N} in Cups and Tablespoons`,
    ],
    seed,
  );

  const title = clip(
    pick(
      [
        `${A}g ${N} to Cups: ${US} | ${SITE_NAME}`,
        `How Many Cups Is ${A} Grams of ${N}? | ${SITE_NAME}`,
        `${A} Grams of ${N} to Cups & Tbsp | ${SITE_NAME}`,
        `Convert ${A}g ${N} to US Cups | ${SITE_NAME}`,
      ],
      seed + 1,
    ),
    62,
  );

  const description = clip(
    pick(
      [
        `${A} grams of ${N} to cups: ${US} (US), ${M} (metric), ${UK} (UK). Includes ${TB} tablespoons and a full ${N} conversion chart.`,
        `How many cups is ${A} grams of ${N}? ${US} in US cups, ${TB} tbsp, ${TS} tsp. Calculated from ${D} g/cm³ density.`,
        `${A}g ${N} in cups and tablespoons: ${US}, or ${TB} tbsp. Switch between US, metric and UK cups with the live converter.`,
        `${A} grams ${N} volume conversion: ${US} (US), ${LEGAL} (US legal), ${UK} (UK). Weigh-free measuring tips included.`,
      ],
      seed + 2,
    ),
    158,
  );

  const snippet = `${A}g of ${N} equals ${US}, or ${TB} tablespoons, using the ${ing.method.toLowerCase()} method. Metric cups: ${M}. UK cups: ${UK}.`;

  /* ---- Density section ---- */
  const water = getIngredient("water")!;
  const sugar = getIngredient("sugar-granulated")!;
  const waterCups = formatCups(convert(250, water, "us").cups);
  const sugarCups = formatCups(convert(250, sugar, "us").cups);
  const thisCups250 = formatCups(convert(250, ing, "us").cups);
  const densityParagraphs = [
    `A cup measures space, not mass. ${N} weighs about ${ing.gramsPerUsCup} g per US cup, which works out to a density near ${D} g/cm³. ${ing.why}`,
    `That density is why ${A} grams fills roughly ${fmtNum(us.ml, 0)} ml of ${N}. The same weight behaves very differently across ingredients: 250 g of water fills ${waterCups}, 250 g of granulated sugar fills ${sugarCups}, and 250 g of ${N.toLowerCase()} fills ${thisCups250}. Any converter that uses one cup-to-gram ratio for every ingredient will be wrong by 20 to 60 percent for at least some of them.`,
  ];

  /* ---- Measuring section ---- */
  const [s1, s2, s3] = METHOD_STEPS[ing.method];
  const steps: Step[] = [
    { name: "Choose the correct cup", text: `Pick a ${ing.method === "Liquid Measure" ? "graduated liquid jug" : "dry measuring cup"}. A US customary cup holds 236.6 ml; a metric cup holds 250 ml, so confirm which set you own before you start.` },
    { name: "Prepare the ingredient", text: s1 },
    { name: "Fill the cup", text: s2 },
    { name: "Level and read", text: s3 },
    { name: `Count out ${US}`, text: `Repeat until you have ${US}. If that leaves a partial cup, use a tablespoon for the remainder: ${A}g is ${TB} tablespoons in total.` },
  ];
  const measureIntro = `No scale on the counter? You can get close to ${A}g of ${N.toLowerCase()} with measuring cups if you control how the ingredient settles. The recommended technique for this ingredient is ${ing.method.toLowerCase()}.`;
  const measureOutro = `Expect an error of about 2 to 5 percent with careful technique. Scooping dry goods straight from the bag can add up to 25 percent, which is enough to turn a tender bake dense.`;

  /* ---- Grid ---- */
  const base = [25, 50, 75, 100, 125, 150, 200, 250, 300, 400, 500, 750, 1000];
  const amounts = Array.from(new Set([...base, amount])).sort((a, b) => a - b);
  const gridRows: GridRow[] = amounts.map((g) => ({
    grams: g,
    usCups: formatCups(convert(g, ing, "us").cups),
    metricCups: formatCups(convert(g, ing, "metric").cups),
    tbsp: fmtNum(convert(g, ing, "us").tbsp, 1),
    oz: fmtNum(g / OUNCE_G, 2),
    current: g === amount,
  }));

  /* ---- FAQs ---- */
  const faqs: Faq[] = [
    {
      q: `How many cups is ${A} grams of ${N}?`,
      a: `${A} grams of ${N.toLowerCase()} is ${US} in US customary cups, ${LEGAL} in US legal cups, ${M} in metric cups and ${UK} in UK imperial cups. These figures assume a density of ${D} g/cm³ and the ${ing.method.toLowerCase()} method.`,
    },
    {
      q: `Why does a cup of ${N.toLowerCase()} weigh less or more than a cup of water or sugar?`,
      a: `Weight per cup depends on density and particle packing. A US cup of water weighs about 237 g and a cup of granulated sugar about 200 g, while a cup of ${N.toLowerCase()} weighs about ${ing.gramsPerUsCup} g. ${ing.why}`,
    },
    {
      q: `How many tablespoons and teaspoons are in ${A}g of ${N}?`,
      a: `${A}g of ${N.toLowerCase()} equals ${TB} US tablespoons or ${TS} teaspoons. Sixteen tablespoons make one US cup, and three teaspoons make one tablespoon.`,
    },
    {
      q: `Does packing change how much ${N.toLowerCase()} fits in a cup?`,
      a: `Yes. The reference weight of ${ing.gramsPerUsCup} g per cup comes from the ${ing.method.toLowerCase()} method. Changing how firmly you fill the cup shifts that weight, so ${A}g could land anywhere from about ${formatCups(us.cups * 0.9)} to ${formatCups(us.cups * 1.1)} when the technique varies by 10 percent.`,
    },
  ];

  return {
    url, h1, title, description, snippet, usCups: US,
    densityHeading: `Mass vs. Volume: Why Density Changes ${N} Measurements`,
    densityParagraphs,
    measureHeading: `How to Accurately Measure ${A}g of ${N} Without a Kitchen Scale`,
    measureIntro, steps, measureOutro,
    gridHeading: `Comprehensive Conversion Grid for ${N} (Grams, US Cups, Metric Cups, Tbsp, Ounces)`,
    gridRows,
    faqHeading: "Frequently Asked Questions",
    faqs,
  };
}

/* ---------------- JSON-LD ---------------- */

export function buildSchemas(ing: Ingredient, amount: number, c: PageContent): object[] {
  const D = densityLabel(ing);
  const category = CATEGORY_LABELS[ing.category];
  const how = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to measure ${amount}g of ${ing.name} in cups`,
    description: `Step-by-step method for measuring ${amount} grams of ${ing.name.toLowerCase()} (${c.usCups}) with standard measuring cups.`,
    totalTime: "PT2M",
    supply: [{ "@type": "HowToSupply", name: `${ing.name} (${amount} g)` }],
    tool: [{ "@type": "HowToTool", name: ing.method === "Liquid Measure" ? "Graduated liquid measuring jug" : "Dry measuring cups" }, { "@type": "HowToTool", name: "Straight-edge knife or spatula" }],
    step: c.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text, url: `${c.url}#measure` })),
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: category, item: `${SITE_URL}/#${ing.category}` },
      { "@type": "ListItem", position: 3, name: ing.name, item: `${SITE_URL}/${ing.slug}` },
      { "@type": "ListItem", position: 4, name: `${amount} Grams to Cups`, item: c.url },
    ],
  };
  const dataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${ing.name} mass-to-volume conversion table`,
    description: `Grams to US cups, metric cups, tablespoons and ounces for ${ing.name.toLowerCase()}, calculated from a density of ${D} g/cm³ (${ing.gramsPerUsCup} g per US cup, ${ing.method.toLowerCase()}).`,
    url: c.url,
    isAccessibleForFree: true,
    keywords: [`${amount} grams of ${ing.name} to cups`, `${ing.name} grams to cups`, "culinary density", "baking conversion"],
    creator: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    variableMeasured: [
      { "@type": "PropertyValue", name: "Mass", unitText: "g" },
      { "@type": "PropertyValue", name: "US cups", unitText: "cup" },
      { "@type": "PropertyValue", name: "Metric cups", unitText: "250 ml cup" },
      { "@type": "PropertyValue", name: "Tablespoons", unitText: "tbsp" },
      { "@type": "PropertyValue", name: "Ounces", unitText: "oz" },
      { "@type": "PropertyValue", name: "Density", unitText: "g/cm³", value: Number(D) },
    ],
  };
  return [how, faq, crumbs, dataset];
}

/** Safe for <script type="application/ld+json">. */
export const jsonLd = (o: object): string => JSON.stringify(o).replace(/</g, "\\u003c");

export { INGREDIENTS, STANDARDS };
