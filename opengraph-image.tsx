import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { buildContent } from "@/lib/content";
import { getIngredient, parseConversionSlug } from "@/lib/ingredients";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Grams to cups conversion";

export default async function OgImage({ params }: { params: Promise<{ ingredient: string; conversion: string }> }) {
  const p = await params;
  const ing = getIngredient(p.ingredient);
  const amount = parseConversionSlug(p.conversion);
  if (!ing || amount === null) notFound();
  const c = buildContent(ing, amount);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0F766E", color: "#fff", padding: 72 }}>
        <div style={{ fontSize: 34, fontWeight: 600, opacity: 0.9 }}>grams2cup.com</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>{`${amount} grams of ${ing.name}`}</div>
          <div style={{ fontSize: 96, fontWeight: 800, marginTop: 20 }}>{c.usCups}</div>
        </div>
        <div style={{ fontSize: 30, opacity: 0.9 }}>US cups, metric cups, tablespoons and ounces</div>
      </div>
    ),
    size,
  );
}
