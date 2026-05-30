/**
 * storyText.ts — Personalises story page text by resolving choice-aware placeholders.
 *
 * Supported placeholders:
 *  {{FOOD}}      → the foods Mico chose at breakfast (e.g. "pancakes and fruit")
 *  {{SEASON}}    → the selected season label (e.g. "Sunny Day")
 *  {{PATH}}      → where Mico went (e.g. "the park")
 *  {{GIFT}}      → the gift Mico picked (e.g. "cupcakes")
 *  {{ANIMAL}}    → the animals Mico spotted (e.g. "a rabbit and a butterfly")
 *  {{TREASURE}}  → beach / forest / puddle treasures (e.g. "a shell and a starfish")
 */

// ─── Emoji → friendly label map ──────────────────────────────────────────────
const ITEM_LABELS: Record<string, string> = {
  // breakfast
  pancakes: "pancakes",
  eggs: "eggs and bacon",
  fruit: "fresh fruit",
  toast: "buttered toast",
  milk: "cereal and milk",
  noodles: "noodles",
  oatmeal: "warm oatmeal",
  hotcocoa: "hot cocoa",
  soup: "warm soup",
  // animals
  rabbit: "a fluffy rabbit",
  butterfly: "a butterfly",
  squirrel: "a squirrel",
  bird: "a little bird",
  badger: "a badger",
  hedgehog: "a hedgehog",
  // beach treasures
  shell: "a pretty shell",
  crab: "a tiny crab",
  starfish: "a starfish",
  fish: "a little fish",
  jellyfish: "a jellyfish",
  seahorse: "a seahorse",
  // forest treasures
  mushroom: "a mushroom",
  acorn: "an acorn",
  firefly: "a firefly",
  crystal: "a crystal",
  leaf: "a fallen leaf",
  pinecone: "a pinecone",
  // gifts
  cake: "a beautiful cake",
  cookies: "fresh-baked cookies",
  cupcakes: "sweet cupcakes",
  icecream: "a scoop of ice cream",
  croissants: "warm croissants",
  donuts: "fluffy donuts",
  gingerbread: "gingerbread cookies",
  peppermints: "peppermints",
  hotcocoa_gift: "a cocoa mix",
  stollen: "a fruit bread",
  pie: "a warm pie",
  tea_pack: "a warm tea pack",
  // rainy puddles
  frog: "a friendly frog",
  raindrop: "a raindrop",
  leaf_boat: "a leaf boat",
  umbrella: "a colourful umbrella",
  snail: "a little snail",
  rainbow: "a mini rainbow",
  // snowman
  snowman_hat: "a winter hat",
  snowman_scarf: "a cosy scarf",
  snowman_carrot: "a carrot nose",
  snowman_arms: "twig arms",
};

const SEASON_LABELS: Record<string, string> = {
  sunny: "sunny",
  winter: "snowy",
  rain: "rainy",
};

const PATH_LABELS: Record<string, string> = {
  park: "the park",
  beach: "the beach",
  forest: "the magical forest",
};

// ─── Helper: join a list naturally ───────────────────────────────────────────
function naturalJoin(items: string[]): string {
  if (items.length === 0) return "something yummy";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

// ─── Helper: resolve a list of item IDs to friendly labels ───────────────────
function resolveItems(ids: string[]): string {
  const labels = ids.map((id) => ITEM_LABELS[id] ?? id);
  return naturalJoin(labels);
}

// ─── Main interpolation function ─────────────────────────────────────────────
export function interpolateStoryText(
  text: string,
  choices: Record<string, string[]>,
  season: "sunny" | "winter" | "rain" | null,
  path: "park" | "beach" | "forest" | null
): string {
  let result = text;

  // {{FOOD}} — breakfast choices
  const foodItems = [
    ...(choices["breakfast"] ?? []),
  ];
  result = result.replace(/\{\{FOOD\}\}/g, resolveItems(foodItems));

  // {{ANIMAL}} — animals spotted in the park
  const animalItems = choices["animals"] ?? [];
  result = result.replace(/\{\{ANIMAL\}\}/g, resolveItems(animalItems));

  // {{TREASURE}} — beach, forest, or puddle treasures
  const treasureItems = [
    ...(choices["beach"] ?? []),
    ...(choices["forest"] ?? []),
    ...(choices["puddles"] ?? []),
  ];
  result = result.replace(/\{\{TREASURE\}\}/g, resolveItems(treasureItems));

  // {{GIFT}} — the gift Mico bought
  const giftItems = choices["gifts"] ?? [];
  result = result.replace(/\{\{GIFT\}\}/g, resolveItems(giftItems));

  // {{SEASON}} — the weather chosen
  result = result.replace(
    /\{\{SEASON\}\}/g,
    season ? SEASON_LABELS[season] ?? season : "beautiful"
  );

  // {{PATH}} — where Mico went
  result = result.replace(
    /\{\{PATH\}\}/g,
    path ? PATH_LABELS[path] ?? path : "outside"
  );

  return result;
}
