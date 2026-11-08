export type Category = "flours" | "sugars-sweeteners" | "dairy-fats" | "grains-starches" | "baking-pantry";
export type Standard = "us" | "legal" | "metric" | "uk";
export type Method = "Spoon and Level" | "Packed" | "Sifted Direct" | "Pour and Level" | "Liquid Measure";

export interface Ingredient {
  slug: string;
  name: string;
  category: Category;
  /** Grams in one US customary cup (236.588 ml), measured with `method`. */
  gramsPerUsCup: number;
  method: Method;
  /** One ingredient-specific sentence explaining why its density behaves the way it does. */
  why: string;
}

export const SITE_URL = "https://grams2cup.com";
export const SITE_NAME = "grams2cup";
export const US_CUP_ML = 236.588;
export const OUNCE_G = 28.3495;
export const MAX_GRAMS = 5000;

export const CATEGORY_LABELS: Record<Category, string> = {
  flours: "Flours",
  "sugars-sweeteners": "Sugars & Sweeteners",
  "dairy-fats": "Dairy, Fats & Liquids",
  "grains-starches": "Grains & Starches",
  "baking-pantry": "Baking Pantry",
};

export const STANDARDS: Record<Standard, { label: string; cupMl: number; tbspMl: number }> = {
  us: { label: "US Customary", cupMl: 236.588, tbspMl: 14.7868 },
  legal: { label: "US Legal", cupMl: 240, tbspMl: 15 },
  metric: { label: "Metric", cupMl: 250, tbspMl: 15 },
  uk: { label: "UK Imperial", cupMl: 284.131, tbspMl: 15 },
};

export const INGREDIENTS: Ingredient[] = [
  { slug: "flour-all-purpose", name: "All-Purpose Flour", category: "flours", gramsPerUsCup: 125, method: "Spoon and Level", why: "Milled wheat starch packs loosely, so a scooped cup can weigh 150 g while a spooned cup stays near 125 g." },
  { slug: "flour-bread", name: "Bread Flour", category: "flours", gramsPerUsCup: 127, method: "Spoon and Level", why: "Higher protein content makes the particles slightly heavier and a touch more compact than all-purpose flour." },
  { slug: "flour-cake", name: "Cake Flour", category: "flours", gramsPerUsCup: 114, method: "Sifted Direct", why: "Fine bleached milling traps air, which is why a cup of cake flour weighs about 11 g less than all-purpose." },
  { slug: "flour-whole-wheat", name: "Whole Wheat Flour", category: "flours", gramsPerUsCup: 120, method: "Spoon and Level", why: "Bran flakes are coarse and irregular, so they leave more air gaps between particles than refined flour does." },
  { slug: "flour-almond", name: "Almond Flour", category: "flours", gramsPerUsCup: 96, method: "Spoon and Level", why: "Ground almonds are oily and light, so a cup holds far less mass than any wheat flour." },
  { slug: "flour-oat", name: "Oat Flour", category: "flours", gramsPerUsCup: 92, method: "Spoon and Level", why: "Ground oats form a fluffy, low-density powder that settles heavily if you tap the cup." },
  { slug: "flour-coconut", name: "Coconut Flour", category: "flours", gramsPerUsCup: 112, method: "Spoon and Level", why: "Coconut fiber absorbs moisture from the air, so humidity can shift the weight of a cup by several grams." },
  { slug: "flour-rye", name: "Rye Flour", category: "flours", gramsPerUsCup: 102, method: "Spoon and Level", why: "Rye particles are coarse and angular, which keeps a cup lighter than wheat flour." },
  { slug: "sugar-granulated", name: "Granulated Sugar", category: "sugars-sweeteners", gramsPerUsCup: 200, method: "Pour and Level", why: "Sucrose crystals are dense and uniform, so they nest together and give one of the most consistent cup weights in the kitchen." },
  { slug: "sugar-brown", name: "Brown Sugar (Packed)", category: "sugars-sweeteners", gramsPerUsCup: 213, method: "Packed", why: "Molasses coats each crystal, and pressing the sugar into the cup removes the air gaps that would otherwise skew the weight." },
  { slug: "sugar-powdered", name: "Powdered Sugar", category: "sugars-sweeteners", gramsPerUsCup: 120, method: "Spoon and Level", why: "Fine grinding and added cornstarch create a very airy powder, so a cup weighs about 80 g less than granulated sugar." },
  { slug: "honey", name: "Honey", category: "sugars-sweeteners", gramsPerUsCup: 340, method: "Liquid Measure", why: "Honey is roughly 1.4 times as dense as water because it is around 80 percent dissolved sugar." },
  { slug: "maple-syrup", name: "Maple Syrup", category: "sugars-sweeteners", gramsPerUsCup: 322, method: "Liquid Measure", why: "Boiled-down sap concentrates sugar to about 66 percent, which pushes its density well above water." },
  { slug: "butter", name: "Butter", category: "dairy-fats", gramsPerUsCup: 227, method: "Packed", why: "Butter is about 80 percent fat and 16 percent water, so it sits slightly below water in density; one cup equals two US sticks." },
  { slug: "milk", name: "Whole Milk", category: "dairy-fats", gramsPerUsCup: 245, method: "Liquid Measure", why: "Dissolved lactose and proteins make milk about 3 percent denser than plain water." },
  { slug: "heavy-cream", name: "Heavy Cream", category: "dairy-fats", gramsPerUsCup: 238, method: "Liquid Measure", why: "Milk fat is lighter than water, which offsets the dissolved solids and keeps cream close to water in density." },
  { slug: "water", name: "Water", category: "dairy-fats", gramsPerUsCup: 237, method: "Liquid Measure", why: "Water defines the reference density of 1 g/cm³, so one milliliter weighs one gram." },
  { slug: "vegetable-oil", name: "Vegetable Oil", category: "dairy-fats", gramsPerUsCup: 218, method: "Liquid Measure", why: "Oils are about 8 percent less dense than water, which is why they float." },
  { slug: "olive-oil", name: "Olive Oil", category: "dairy-fats", gramsPerUsCup: 216, method: "Liquid Measure", why: "Monounsaturated fats pack a bit more loosely than water, leaving olive oil near 0.91 g/cm³." },
  { slug: "yogurt", name: "Plain Yogurt", category: "dairy-fats", gramsPerUsCup: 245, method: "Pour and Level", why: "Strained milk proteins add mass without adding much volume, so yogurt weighs slightly more than water per cup." },
  { slug: "rolled-oats", name: "Rolled Oats", category: "grains-starches", gramsPerUsCup: 90, method: "Pour and Level", why: "Flattened flakes interlock with large air pockets, which makes a cup of oats surprisingly light." },
  { slug: "rice-white", name: "White Rice (Uncooked)", category: "grains-starches", gramsPerUsCup: 185, method: "Pour and Level", why: "Hard, smooth grains nest tightly, so uncooked rice is dense and very repeatable by volume." },
  { slug: "cornstarch", name: "Cornstarch", category: "grains-starches", gramsPerUsCup: 128, method: "Spoon and Level", why: "Cornstarch compacts easily when scooped, so spooning it in gives the most reliable cup." },
  { slug: "cocoa-powder", name: "Cocoa Powder", category: "grains-starches", gramsPerUsCup: 85, method: "Sifted Direct", why: "Cocoa clumps and traps air, so sifting before you measure is the only way to hit a repeatable weight." },
  { slug: "baking-powder", name: "Baking Powder", category: "baking-pantry", gramsPerUsCup: 230, method: "Spoon and Level", why: "Mineral acid salts and bicarbonate are dense compounds, so a cup weighs close to a cup of milk." },
  { slug: "salt-table", name: "Table Salt", category: "baking-pantry", gramsPerUsCup: 288, method: "Pour and Level", why: "Fine sodium chloride crystals pack tightly; coarse kosher salt can weigh nearly half as much per cup." },
  { slug: "chocolate-chips", name: "Chocolate Chips", category: "baking-pantry", gramsPerUsCup: 170, method: "Pour and Level", why: "Solid chips leave gaps between pieces, so volume depends on chip size more than on the chocolate itself." },
  { slug: "peanut-butter", name: "Peanut Butter", category: "baking-pantry", gramsPerUsCup: 258, method: "Packed", why: "Ground peanuts with oil and sugar form a dense paste, but air pockets make unpacked cups unreliable." },
  { slug: "walnuts-chopped", name: "Chopped Walnuts", category: "baking-pantry", gramsPerUsCup: 120, method: "Pour and Level", why: "Irregular nut pieces nest loosely, so finer chopping increases the weight of a cup." },
  { slug: "raisins", name: "Raisins", category: "baking-pantry", gramsPerUsCup: 150, method: "Pour and Level", why: "Whole dried fruit leaves large voids, and pressing the cup down can add 10 to 15 percent more weight." },
];

export const getIngredient = (slug: string): Ingredient | undefined => INGREDIENTS.find((i) => i.slug === slug);
export const ingredientIndex = (slug: string): number => Math.max(0, INGREDIENTS.findIndex((i) => i.slug === slug));
export const familyOf = (ing: Ingredient): Ingredient[] =>
  INGREDIENTS.filter((i) => i.category === ing.category && i.slug !== ing.slug);

/** Density in g/cm³ (g/ml), derived from the grams-per-US-cup reference weight. */
export const densityOf = (ing: Ingredient): number => ing.gramsPerUsCup / US_CUP_ML;
export const densityLabel = (ing: Ingredient): string => densityOf(ing).toFixed(2);

export interface Conversion {
  ml: number;
  cups: number;
  tbsp: number;
  tsp: number;
}

export function convert(grams: number, ing: Ingredient, std: Standard): Conversion {
  const s = STANDARDS[std];
  const ml = grams / densityOf(ing);
  return { ml, cups: ml / s.cupMl, tbsp: ml / s.tbspMl, tsp: ml / (s.tbspMl / 3) };
}

export function cupsToGrams(cups: number, ing: Ingredient, std: Standard): number {
  return cups * STANDARDS[std].cupMl * densityOf(ing);
}

export function fmtNum(n: number, digits = 2): string {
  if (!isFinite(n)) return "0";
  return Number(n.toFixed(digits)).toLocaleString("en-US", { maximumFractionDigits: digits });
}

const FRACTIONS: ReadonlyArray<readonly [number, string]> = [
  [0, ""], [1 / 8, "⅛"], [1 / 4, "¼"], [1 / 3, "⅓"], [3 / 8, "⅜"], [1 / 2, "½"],
  [5 / 8, "⅝"], [2 / 3, "⅔"], [3 / 4, "¾"], [7 / 8, "⅞"], [1, ""],
];

function fmtTbsp(t: number): string {
  const whole = Math.floor(t);
  const half = t - whole >= 0.5;
  if (whole === 0) return half ? "½" : "0";
  return half ? `${whole}½` : `${whole}`;
}

/** Converts decimal cups into a kitchen-friendly string, e.g. 0.8125 -> "¾ cup + 1 tbsp". */
export function formatCups(cups: number): string {
  if (!isFinite(cups) || cups <= 0) return "0 cups";
  let whole = Math.floor(cups + 1e-9);
  const rem = cups - whole;
  let best = FRACTIONS[0];
  for (const f of FRACTIONS) if (f[0] <= rem + 0.012) best = f;
  let leftover = Math.max(0, rem - best[0]);
  if (best[0] === 1) {
    whole += 1;
    best = FRACTIONS[0];
    leftover = 0;
  }
  const tbsp = Math.round(leftover * 16 * 2) / 2;
  const frac = best[1];
  if (whole === 0 && !frac && tbsp === 0) {
    return `${fmtNum(cups * 48, 1)} tsp`;
  }
  const parts: string[] = [];
  if (whole > 0 || frac) {
    const num = `${whole > 0 ? whole : ""}${whole > 0 && frac ? " " : ""}${frac}`;
    const plural = whole > 1 || (whole === 1 && !!frac);
    parts.push(`${num} ${plural ? "cups" : "cup"}`);
  }
  if (tbsp > 0) parts.push(`${fmtTbsp(tbsp)} tbsp`);
  return parts.join(" + ");
}

/* ---------- Programmatic routing helpers ---------- */

export const AMOUNTS: number[] = [
  100, 250, 200, 500, 150, 300, 50, 125, 400, 75, 350, 25, 175, 225, 450, 1000, 600, 750, 800, 120, 130, 140, 160, 180,
  190, 210, 220, 230, 240, 260, 270, 275, 280, 290, 325, 375, 425, 550, 700, 900, 10, 15, 20, 30, 40, 60, 70, 80, 90, 110, 170, 5,
];

export const conversionSlug = (amount: number): string => `${amount}-grams-to-cups`;
export const conversionPath = (ing: Ingredient | string, amount: number): string =>
  `/${typeof ing === "string" ? ing : ing.slug}/${conversionSlug(amount)}`;

export function parseConversionSlug(slug: string): number | null {
  const m = /^(\d{1,4})-grams-to-cups$/.exec(slug);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 1 && n <= MAX_GRAMS ? n : null;
}

/** Top-N combinations, amount-major so every ingredient gets the most-searched weights first. */
export function getStaticCombos(limit = 1000): { ingredient: string; conversion: string }[] {
  const out: { ingredient: string; conversion: string }[] = [];
  for (const amount of AMOUNTS) {
    for (const ing of INGREDIENTS) {
      if (out.length >= limit) return out;
      out.push({ ingredient: ing.slug, conversion: conversionSlug(amount) });
    }
  }
  return out;
}

export function neighborAmounts(amount: number): number[] {
  return [-50, -25, 25, 50, 100].map((d) => amount + d).filter((n) => n >= 1 && n <= MAX_GRAMS);
}
