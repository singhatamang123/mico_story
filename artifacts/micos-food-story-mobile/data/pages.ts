export type PageType = "title" | "story" | "activity" | "feedback" | "end" | "choice";

export interface StoryItem {
  id: string;
  label: string;
  emoji: string; // placeholder until AI images are added
  imagePath?: string;
}

export interface StoryPageData {
  id: string;
  type: "story";
  bgColor: string;
  panelColor: string;
  category: string;
  text: string;
  characterEmoji: string;
  characterImagePath?: string;
  tapReaction: string;
  emotion?: "curious" | "excited" | "cozy" | "happy" | "sad" | "magical" | "splashy" | "warm";
  nextPage: string;
  prevPage: string;
}

export interface ActivityPageData {
  id: string;
  type: "activity";
  bgColor: string;
  panelColor: string;
  title: string;
  instruction: string;
  category: string;
  items: StoryItem[];
  maxItems: number;
  dropLabel: string;
  nextPage: string;
  prevPage: string;
}

export interface FeedbackPageData {
  id: string;
  type: "feedback";
  bgColor: string;
  panelColor: string;
  dynamicPrefix: string;
  staticText: string;
  characterEmoji: string;
  characterImagePath?: string;
  dragPrompt: string;
  reactionType: "eat" | "gift" | "animals";
  category: string;
  nextPage: string;
  prevPage: string;
}

export interface TitlePageData {
  id: string;
  type: "title";
  title: string;
  subtitle: string;
  flipCards: { emoji: string; backEmoji: string; color: string }[];
  nextPage: string;
}

export interface ChoiceOption {
  id: string;         // e.g. "park" | "beach"
  label: string;      // e.g. "The Park"
  emoji: string;      // e.g. "🏞️"
  description: string;// short flavour text shown on card
  targetPage: string; // page id to navigate to on selection
  bgColor: string;    // card accent color
}

export interface ChoicePageData {
  id: string;
  type: "choice";
  question: string;   // e.g. "Where should Mico go today?"
  options: ChoiceOption[];
  prevPage: string;
}

export interface SeasonOption {
  id: string;         // e.g. "sunny" | "winter" | "rain"
  label: string;      // e.g. "Sunny Day"
  emoji: string;      // e.g. "☀️"
  description: string;
  targetPage: string; // The first page of this season's story
  bgColor: string;
}

export interface SeasonSelectPageData {
  id: string;
  type: "season-select";
  question: string;
  options: SeasonOption[];
  prevPage: string;
}

export interface EndPageData {
  id: string;
  type: "end";
  bgColor: string;
  panelColor: string;
  title: string;
  text: string;
  characterEmoji: string;
  characterImagePath?: string;
}

export type AnyPageData =
  | TitlePageData
  | StoryPageData
  | ActivityPageData
  | FeedbackPageData
  | ChoicePageData
  | SeasonSelectPageData
  | EndPageData;

export const PAGES: AnyPageData[] = [
  // ─── Title ────────────────────────────────────────────────────────────────
  {
    id: "title",
    type: "title",
    title: "Mico's Food Story",
    subtitle: "A fun and delicious journey awaits",
    flipCards: [
      { emoji: "🥞", backEmoji: "☀️", color: "#4CAF50" },
      { emoji: "🧺", backEmoji: "🐰", color: "#FF9800" },
      { emoji: "🎁", backEmoji: "💖", color: "#2196F3" },
    ],
    nextPage: "season-select",
  },

  // ─── Season Select ────────────────────────────────────────────────────────
  {
    id: "season-select",
    type: "season-select",
    question: "What is the weather like today?",
    options: [
      {
        id: "sunny",
        label: "Sunny Day",
        emoji: "☀️",
        description: "A bright and cheerful morning!",
        targetPage: "morning",
        bgColor: "linear-gradient(135deg, #F59E0B 0%, #EAB308 100%)",
      },
      {
        id: "winter",
        label: "Winter Snow",
        emoji: "❄️",
        description: "A chilly, snowy adventure awaits!",
        targetPage: "winter-morning",
        bgColor: "linear-gradient(135deg, #0284C7 0%, #38BDF8 100%)",
      },
      {
        id: "rain",
        label: "Rainy Day",
        emoji: "☔",
        description: "Puddles and raincoats!",
        targetPage: "rain-morning",
        bgColor: "linear-gradient(135deg, #475569 0%, #94A3B8 100%)",
      },
    ],
    prevPage: "title",
  },

  // ─── Chapter 1: Sunny Breakfast ──────────────────────────────────────────
  {
    id: "morning",
    type: "story",
    bgColor: "linear-gradient(135deg, #FF7B93 0%, #FF90C1 50%, #FFC4D6 100%)",
    panelColor: "linear-gradient(135deg, #4A0E1B 0%, #6E1229 100%)",
    category: "breakfast",
    text: 'Mico wakes with a hungry grin.\nHis tummy gives a rumble within.\n\n"Something tasty, warm, and bright\nwill start my morning feeling right."\n\nHe walks to the kitchen, slow and steady,\nand looks at the dining table.',
    characterEmoji: "😏",
    characterImagePath: "/images/mico-idle.png",
    tapReaction: "rumble rumble~",
    emotion: "curious",
    nextPage: "breakfast-activity",
    prevPage: "season-select",
  },
  {
    id: "breakfast-activity",
    type: "activity",
    bgColor: "linear-gradient(135deg, #FF90C1 0%, #FFAEC9 100%)",
    panelColor: "linear-gradient(135deg, #16803F 0%, #1D9F55 100%)",
    title: "Help Mico choose his breakfast.",
    instruction: "Tap food items to add them to his plate.",
    category: "breakfast",
    maxItems: 4,
    dropLabel: "Mico's Plate",
    items: [
      { id: "pancakes", label: "Pancakes", emoji: "🥞", imagePath: "/images/food-pancakes.png" },
      { id: "eggs", label: "Eggs & Bacon", emoji: "🍳" },
      { id: "fruit", label: "Fruit", emoji: "🍊" },
      { id: "toast", label: "Toast", emoji: "🍞" },
      { id: "milk", label: "Cereal & Milk", emoji: "🥣" },
      { id: "noodles", label: "Noodles", emoji: "🍜" },
    ],
    nextPage: "breakfast-feedback",
    prevPage: "morning",
  },
  {
    id: "breakfast-feedback",
    type: "feedback",
    bgColor: "linear-gradient(135deg, #FF90C1 0%, #FFAEC9 100%)",
    panelColor: "linear-gradient(135deg, #4A0E1B 0%, #6E1229 100%)",
    dynamicPrefix: "Mico chose",
    staticText:
      "{{FOOD}} — what a delicious pick!\nMico smiles from ear to ear.\n\nHe takes a bite, and then another.\nWith one last chew and one last bite,\nhis day begins just right.",
    characterEmoji: "🤩",
    characterImagePath: "/images/mico-idle.png",
    dragPrompt: "Drag food to Mico!",
    reactionType: "eat",
    category: "breakfast",
    nextPage: "where-to-go",
    prevPage: "breakfast-activity",
  },

  // ─── CHOICE: Park or Beach? ───────────────────────────────────────────────
  {
    id: "where-to-go",
    type: "choice",
    question: "Where should Mico go today?",
    options: [
      {
        id: "park",
        label: "The Park",
        emoji: "🏞️",
        description: "A sunny meadow full of friendly creatures!",
        targetPage: "meadow",
        bgColor: "linear-gradient(135deg, #16803F 0%, #22C55E 100%)",
      },
      {
        id: "beach",
        label: "The Beach",
        emoji: "🏖️",
        description: "A sparkling shore with shells and waves!",
        targetPage: "beach",
        bgColor: "linear-gradient(135deg, #0274C4 0%, #38BDF8 100%)",
      },
      {
        id: "forest",
        label: "The Forest",
        emoji: "🌲",
        description: "A glowing, magical forest to explore!",
        targetPage: "forest",
        bgColor: "linear-gradient(135deg, #064E3B 0%, #059669 100%)",
      },
    ],
    prevPage: "breakfast-feedback",
  },

  // ─── PARK BRANCH ─────────────────────────────────────────────────────────
  {
    id: "meadow",
    type: "story",
    bgColor: "linear-gradient(135deg, #FFB3D1 0%, #FFD1E6 100%)",
    panelColor: "linear-gradient(135deg, #2D114C 0%, #4D2678 100%)",
    category: "animals",
    text: "Outside, the sky is wide and blue.\nThere's so much fun for him to do.\n\nMico decides, \"A picnic sounds just right!\"\nHe heads to the park with his basket held tight.\n\nHe hears soft steps and tiny feet,\nand looks around with bright, wide eyes\nas little friends pass by.",
    characterEmoji: "😎",
    characterImagePath: "/images/mico-idle.png",
    tapReaction: "A picnic sounds just right!",
    emotion: "excited",
    nextPage: "animals-activity",
    prevPage: "where-to-go",
  },
  {
    id: "animals-activity",
    type: "activity",
    bgColor: "linear-gradient(135deg, #FFB3D1 0%, #FFCCD5 100%)",
    panelColor: "linear-gradient(135deg, #0274C4 0%, #0397FE 100%)",
    title: "Spot three animals!",
    instruction: "Tap three animals to add them to the scene.",
    category: "animals",
    maxItems: 3,
    dropLabel: "The Meadow",
    items: [
      { id: "rabbit", label: "Rabbit", emoji: "🐰", imagePath: "/images/animal-rabbit.png" },
      { id: "butterfly", label: "Butterfly", emoji: "🦋" },
      { id: "squirrel", label: "Squirrel", emoji: "🐿️" },
      { id: "bird", label: "Bird", emoji: "🐦" },
      { id: "badger", label: "Badger", emoji: "🦡" },
      { id: "hedgehog", label: "Hedgehog", emoji: "🦔" },
    ],
    nextPage: "animals-feedback",
    prevPage: "meadow",
  },
  {
    id: "animals-feedback",
    type: "feedback",
    bgColor: "linear-gradient(135deg, #FFB3D1 0%, #FFCCD5 100%)",
    panelColor: "linear-gradient(135deg, #2D114C 0%, #4D2678 100%)",
    dynamicPrefix: "Mico spotted",
    staticText:
      "{{ANIMAL}} came running over to say hello!\n\nMico smiles as his new friends gather close,\nfilling the meadow with joy and cheer.",
    characterEmoji: "😲",
    characterImagePath: "/images/mico-idle.png",
    dragPrompt: "Tap the animals to greet Mico!",
    reactionType: "animals",
    category: "animals",
    nextPage: "giftshop",
    prevPage: "animals-activity",
  },

  // ─── BEACH BRANCH ─────────────────────────────────────────────────────────
  {
    id: "beach",
    type: "story",
    bgColor: "linear-gradient(135deg, #BAE6FD 0%, #7DD3FC 50%, #38BDF8 100%)",
    panelColor: "linear-gradient(135deg, #0C4A6E 0%, #0369A1 100%)",
    category: "beach",
    text: "The sand is warm beneath his feet.\nThe waves roll in with a gentle beat.\n\nMico breathes the salty air\nand feels the breeze blow through his hair.\n\nHe looks along the shining shore —\nso many wonders to explore!",
    characterEmoji: "😄",
    characterImagePath: "/images/mico-idle.png",
    tapReaction: "The waves say hello!",
    emotion: "excited",
    nextPage: "beach-activity",
    prevPage: "where-to-go",
  },
  {
    id: "beach-activity",
    type: "activity",
    bgColor: "linear-gradient(135deg, #BAE6FD 0%, #7DD3FC 100%)",
    panelColor: "linear-gradient(135deg, #0F4C81 0%, #0284C7 100%)",
    title: "Collect three treasures from the shore!",
    instruction: "Tap three beach treasures to put them in Mico's bucket.",
    category: "beach",
    maxItems: 3,
    dropLabel: "Mico's Bucket",
    items: [
      { id: "shell",    label: "Shell",     emoji: "🐚" },
      { id: "crab",     label: "Crab",      emoji: "🦀" },
      { id: "starfish", label: "Starfish",  emoji: "⭐" },
      { id: "fish",     label: "Fish",      emoji: "🐟" },
      { id: "jellyfish",label: "Jellyfish", emoji: "🪼" },
      { id: "seahorse", label: "Seahorse",  emoji: "🦭" },
    ],
    nextPage: "beach-feedback",
    prevPage: "beach",
  },
  {
    id: "beach-feedback",
    type: "feedback",
    bgColor: "linear-gradient(135deg, #BAE6FD 0%, #7DD3FC 100%)",
    panelColor: "linear-gradient(135deg, #0C4A6E 0%, #0369A1 100%)",
    dynamicPrefix: "Mico found",
    staticText:
      "{{TREASURE}} — what a sparkling haul!\nEach one shines with the light of the sea.\n\nMico laughs and shouts out with glee,\nand tucks them gently in his pail.",
    characterEmoji: "🥹",
    characterImagePath: "/images/mico-idle.png",
    dragPrompt: "Drag the treasure to Mico!",
    reactionType: "animals",
    category: "beach",
    nextPage: "giftshop",
    prevPage: "beach-activity",
  },

  // ─── FOREST BRANCH ────────────────────────────────────────────────────────
  {
    id: "forest",
    type: "story",
    bgColor: "linear-gradient(135deg, #022C22 0%, #064E3B 50%, #059669 100%)",
    panelColor: "linear-gradient(135deg, #134E4A 0%, #0F766E 100%)",
    category: "forest",
    text: "Mico steps into the shaded wood.\nThe air smells sweet, the breeze feels good.\n\nSoft lights flicker in the trees,\ndancing lightly on the breeze.\n\nHe spots some treasures on the ground —\nwhat magical wonders has he found?",
    characterEmoji: "✨",
    characterImagePath: "/images/mico-idle.png",
    tapReaction: "It's so magical here!",
    emotion: "magical",
    nextPage: "forest-activity",
    prevPage: "where-to-go",
  },
  {
    id: "forest-activity",
    type: "activity",
    bgColor: "linear-gradient(135deg, #064E3B 0%, #10B981 100%)",
    panelColor: "linear-gradient(135deg, #065F46 0%, #047857 100%)",
    title: "Gather magical forest treasures!",
    instruction: "Tap three glowing items to collect them.",
    category: "forest",
    maxItems: 3,
    dropLabel: "Mico's Pouch",
    items: [
      { id: "mushroom", label: "Mushroom", emoji: "🍄" },
      { id: "acorn",    label: "Acorn",    emoji: "🌰" },
      { id: "firefly",  label: "Firefly",  emoji: "✨" },
      { id: "crystal",  label: "Crystal",  emoji: "🔮" },
      { id: "leaf",     label: "Leaf",     emoji: "🍁" },
      { id: "pinecone", label: "Pinecone", emoji: "🌲" },
    ],
    nextPage: "forest-feedback",
    prevPage: "forest",
  },
  {
    id: "forest-feedback",
    type: "feedback",
    bgColor: "linear-gradient(135deg, #064E3B 0%, #10B981 100%)",
    panelColor: "linear-gradient(135deg, #065F46 0%, #047857 100%)",
    dynamicPrefix: "Mico found",
    staticText:
      "{{TREASURE}} — glowing with magical light!\nMico's eyes grow wide and bright.\n\nHe safely tucks them all away,\na magical memory of today.",
    characterEmoji: "🌟",
    characterImagePath: "/images/mico-idle.png",
    dragPrompt: "Drag the treasure to Mico!",
    reactionType: "animals",
    category: "forest",
    nextPage: "giftshop",
    prevPage: "forest-activity",
  },

  // ─── Chapter 3: Gift Shop (shared) ───────────────────────────────────────
  {
    id: "giftshop",
    type: "story",
    bgColor: "linear-gradient(135deg, #FFCCD5 0%, #FFE3E8 100%)",
    panelColor: "linear-gradient(135deg, #0F4C81 0%, #20639B 100%)",
    category: "gifts",
    text: "After eating and playing with his new friends,\nhe lies back.\n\nHe thinks of home and those he loves.\nHow about a little surprise?\n\nYes — why not! He spots a shop along the street,\nfilled with snacks that look like treats.",
    characterEmoji: "🥺",
    characterImagePath: "/images/mico-idle.png",
    tapReaction: "What a sweet idea!",
    emotion: "happy",
    nextPage: "gifts-activity",
    prevPage: "animals-feedback", // will be overridden by branch logic in navigate()
  },
  {
    id: "gifts-activity",
    type: "activity",
    bgColor: "linear-gradient(135deg, #FFAEC9 0%, #FFCCD5 100%)",
    panelColor: "linear-gradient(135deg, #A80D17 0%, #D8111D 100%)",
    title: "Help Mico choose a dessert for his family.",
    instruction: "Tap one special snack to put it in the gift box.",
    category: "gifts",
    maxItems: 1,
    dropLabel: "Gift Box",
    items: [
      { id: "cake",       label: "Cake",       emoji: "🎂" },
      { id: "cookies",    label: "Cookies",    emoji: "🍪" },
      { id: "cupcakes",   label: "Cupcakes",   emoji: "🧁" },
      { id: "icecream",   label: "Ice Cream",  emoji: "🍦" },
      { id: "croissants", label: "Croissants", emoji: "🥐" },
      { id: "donuts",     label: "Donuts",     emoji: "🍩" },
    ],
    nextPage: "gifts-feedback",
    prevPage: "giftshop",
  },
  {
    id: "gifts-feedback",
    type: "feedback",
    bgColor: "linear-gradient(135deg, #FFAEC9 0%, #FFCCD5 100%)",
    panelColor: "linear-gradient(135deg, #A80D17 0%, #D8111D 100%)",
    dynamicPrefix: "Mico picked",
    staticText:
      "{{GIFT}} — what a thoughtful surprise!\nHe walks back home with a sparkle in his eyes.\n\nEach step feels light and perfectly right,\nbringing kindness home tonight.",
    characterEmoji: "🎉",
    characterImagePath: "/images/mico-idle.png",
    dragPrompt: "Drag the treat to Mico!",
    reactionType: "gift",
    category: "gifts",
    nextPage: "end",
    prevPage: "gifts-activity",
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ❄️ WINTER SEASON BRANCH
  // ═════════════════════════════════════════════════════════════════════════

  {
    id: "winter-morning",
    type: "story",
    bgColor: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 50%, #7DD3FC 100%)",
    panelColor: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
    category: "breakfast",
    text: "Mico wakes up and rubs his eyes,\nlooking out at the snowy skies.\n\nBrrr! It’s cold and white outside.\nHe needs something warm before he can slide!\n\nA cozy breakfast is what he needs,\nto give him energy for wintery deeds.",
    characterEmoji: "🥶",
    characterImagePath: "/images/mico-idle.png",
    tapReaction: "So chilly today!",
    emotion: "cozy",
    nextPage: "winter-breakfast-activity",
    prevPage: "season-select",
  },
  {
    id: "winter-breakfast-activity",
    type: "activity",
    bgColor: "linear-gradient(135deg, #BAE6FD 0%, #7DD3FC 100%)",
    panelColor: "linear-gradient(135deg, #0369A1 0%, #075985 100%)",
    title: "Help Mico choose a warm breakfast.",
    instruction: "Tap warm foods to add them to his bowl.",
    category: "breakfast",
    maxItems: 3,
    dropLabel: "Mico's Bowl",
    items: [
      { id: "oatmeal",   label: "Oatmeal",   emoji: "🥣" },
      { id: "hotcocoa",  label: "Hot Cocoa", emoji: "☕" },
      { id: "soup",      label: "Soup",      emoji: "🍲" },
      { id: "toast",     label: "Toast",     emoji: "🍞" },
    ],
    nextPage: "winter-breakfast-feedback",
    prevPage: "winter-morning",
  },
  {
    id: "winter-breakfast-feedback",
    type: "feedback",
    bgColor: "linear-gradient(135deg, #BAE6FD 0%, #7DD3FC 100%)",
    panelColor: "linear-gradient(135deg, #0369A1 0%, #075985 100%)",
    dynamicPrefix: "Mico chose",
    staticText: "{{FOOD}} — warm and delicious!\nIt fills him with snowy-day delight.\nNow he's ready for the winter white!",
    characterEmoji: "🥰",
    characterImagePath: "/images/mico-idle.png",
    dragPrompt: "Drag the food to Mico to warm him up!",
    reactionType: "eat",
    category: "breakfast",
    nextPage: "winter-story",
    prevPage: "winter-breakfast-activity",
  },
  {
    id: "winter-story",
    type: "story",
    bgColor: "linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)",
    panelColor: "linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)",
    category: "snowman",
    text: "Mico steps out into the snow,\nwatching his frosty breath puff and blow.\n\nHe rolls a snowball, round and neat,\nand adds another, what a treat!\n\nLet's decorate this frosty friend,\nwith cozy clothes from end to end.",
    characterEmoji: "⛄",
    characterImagePath: "/images/mico-idle.png",
    tapReaction: "Let's build a snowman!",
    emotion: "cozy",
    nextPage: "snowman-activity",
    prevPage: "winter-breakfast-feedback",
  },
  {
    id: "snowman-activity",
    type: "activity",
    bgColor: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
    panelColor: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
    title: "Decorate the snowman!",
    instruction: "Tap the items to dress the snowman.",
    category: "snowman",
    maxItems: 4,
    dropLabel: "Snowman",
    items: [
      { id: "snowman_hat",    label: "Winter Hat", emoji: "🎩" },
      { id: "snowman_scarf",  label: "Scarf",      emoji: "🧣" },
      { id: "snowman_carrot", label: "Carrot Nose",emoji: "🥕" },
      { id: "snowman_arms",   label: "Twig Arms",  emoji: "🌿" },
    ],
    nextPage: "snowman-feedback",
    prevPage: "winter-story",
  },
  {
    id: "snowman-feedback",
    type: "feedback",
    bgColor: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
    panelColor: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
    dynamicPrefix: "Mico added",
    staticText: "{{TREASURE}} made the snowman look so grand!\nThe best frosty friend in all the land.",
    characterEmoji: "🤩",
    characterImagePath: "/images/mico-idle.png",
    dragPrompt: "Give the snowman a high-five!",
    reactionType: "animals",
    category: "snowman",
    nextPage: "winter-giftshop",
    prevPage: "snowman-activity",
  },
  {
    id: "winter-giftshop",
    type: "story",
    bgColor: "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)",
    panelColor: "linear-gradient(135deg, #C2410C 0%, #9A3412 100%)",
    category: "gifts",
    text: "The sun goes down, the air gets chill.\nMico walks down the snowy hill.\n\nHe spots a bakery, warm and bright,\nglowing softly in the winter night.\n\nHe wants to bring his family a treat,\nsomething cozy, warm, and sweet.",
    characterEmoji: "🥺",
    characterImagePath: "/images/mico-idle.png",
    tapReaction: "Smells like cinnamon!",
    emotion: "warm",
    nextPage: "winter-gifts-activity",
    prevPage: "snowman-feedback",
  },
  {
    id: "winter-gifts-activity",
    type: "activity",
    bgColor: "linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)",
    panelColor: "linear-gradient(135deg, #9A3412 0%, #7C2D12 100%)",
    title: "Pick a winter treat for the family.",
    instruction: "Tap a cozy treat to put in the gift box.",
    category: "gifts",
    maxItems: 1,
    dropLabel: "Winter Gift Box",
    items: [
      { id: "gingerbread",     label: "Gingerbread",   emoji: "🍪" },
      { id: "peppermints",     label: "Peppermints",   emoji: "🍬" },
      { id: "hotcocoa_gift",   label: "Cocoa Mix",     emoji: "🍫" },
      { id: "stollen",         label: "Fruit Bread",   emoji: "🍞" },
    ],
    nextPage: "winter-gifts-feedback",
    prevPage: "winter-giftshop",
  },
  {
    id: "winter-gifts-feedback",
    type: "feedback",
    bgColor: "linear-gradient(135deg, #FED7AA 0%, #FDBA74 100%)",
    panelColor: "linear-gradient(135deg, #9A3412 0%, #7C2D12 100%)",
    dynamicPrefix: "Mico bought",
    staticText: "{{GIFT}} for the family — how sweet!\nWith a happy heart and toes freezing tight,\n\nhe walks back home in the starry night,\nready to share his wintery cheer.",
    characterEmoji: "🎁",
    characterImagePath: "/images/mico-idle.png",
    dragPrompt: "Drag the gift to Mico!",
    reactionType: "gift",
    category: "gifts",
    nextPage: "winter-end",
    prevPage: "winter-gifts-activity",
  },
  {
    id: "winter-end",
    type: "end",
    bgColor: "#082F49",
    panelColor: "#38BDF8",
    title: "The Winter End",
    text: "A cozy breakfast. A snowy adventure. And a warm gift.\n\nWhat a frosty day! Snug and bright,\nthis winter night is perfectly right.",
    characterEmoji: "😴",
    characterImagePath: "/images/mico-idle.png",
  },

  // ═════════════════════════════════════════════════════════════════════════
  // ☔ RAINY DAY BRANCH
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: "rain-morning",
    type: "story",
    bgColor: "linear-gradient(135deg, #475569 0%, #64748B 50%, #94A3B8 100%)",
    panelColor: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
    category: "breakfast",
    text: "Mico wakes up to a pitter-pat sound,\nas raindrops splash all over the ground.\n\nHe smiles and puts his boots on tight,\nbut first, a warm breakfast feels just right.\n\nLet's head to the kitchen, nice and slow,\nand find a warm meal before we go.",
    characterEmoji: "😊",
    characterImagePath: "/images/mico-idle.png",
    tapReaction: "Pitter patter, pitter patter! 🌧️",
    emotion: "curious",
    nextPage: "rain-breakfast-activity",
    prevPage: "season-select",
  },
  {
    id: "rain-breakfast-activity",
    type: "activity",
    bgColor: "linear-gradient(135deg, #475569 0%, #64748B 100%)",
    panelColor: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
    title: "Choose a warm, rainy-day breakfast!",
    instruction: "Tap warm foods to add them to Mico's table.",
    category: "breakfast",
    maxItems: 3,
    dropLabel: "Warm Table",
    items: [
      { id: "noodles",  label: "Noodles",     emoji: "🍜" },
      { id: "soup",     label: "Warm Soup",   emoji: "🍲" },
      { id: "hotcocoa", label: "Hot Cocoa",   emoji: "☕" },
      { id: "toast",    label: "Toast",       emoji: "🍞" },
    ],
    nextPage: "rain-breakfast-feedback",
    prevPage: "rain-morning",
  },
  {
    id: "rain-breakfast-feedback",
    type: "feedback",
    bgColor: "linear-gradient(135deg, #475569 0%, #64748B 100%)",
    panelColor: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
    dynamicPrefix: "Mico ate",
    staticText: "{{FOOD}} — so warm and cozy inside!\nNow Mico is ready to step outside!",
    characterEmoji: "😋",
    characterImagePath: "/images/mico-idle.png",
    dragPrompt: "Feed Mico to warm him up!",
    reactionType: "eat",
    category: "breakfast",
    nextPage: "rainy-day-story",
    prevPage: "rain-breakfast-activity",
  },
  {
    id: "rainy-day-story",
    type: "story",
    bgColor: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 50%, #93C5FD 100%)",
    panelColor: "linear-gradient(135deg, #172554 0%, #1E3A8A 100%)",
    category: "puddles",
    text: "Outside, the rain falls soft and cool,\nforming a shiny, splashing pool!\n\nMico steps out in his yellow coat,\nand looks at puddles to jump and float.\n\nLet's splash around and find some treats,\nlike little frogs and leaf-made fleets!",
    characterEmoji: "☔",
    characterImagePath: "/images/mico-idle.png",
    tapReaction: "Splish splash! 💦",
    emotion: "splashy",
    nextPage: "rainy-day-activity",
    prevPage: "rain-breakfast-feedback",
  },
  {
    id: "rainy-day-activity",
    type: "activity",
    bgColor: "linear-gradient(135deg, #60A5FA 0%, #93C5FD 100%)",
    panelColor: "linear-gradient(135deg, #1E3A8A 0%, #172554 100%)",
    title: "Let's splash in the puddles!",
    instruction: "Tap three rainy-day treasures to gather them.",
    category: "puddles",
    maxItems: 3,
    dropLabel: "Rainy Collection",
    items: [
      { id: "frog",      label: "Frog",          emoji: "🐸" },
      { id: "raindrop",  label: "Raindrop",      emoji: "💧" },
      { id: "leaf_boat", label: "Leaf Boat",     emoji: "⛵" },
      { id: "umbrella",  label: "Umbrella",      emoji: "☔" },
      { id: "snail",     label: "Snail",         emoji: "🐌" },
      { id: "rainbow",   label: "Mini Rainbow",  emoji: "🌈" },
    ],
    nextPage: "rainy-day-feedback",
    prevPage: "rainy-day-story",
  },
  {
    id: "rainy-day-feedback",
    type: "feedback",
    bgColor: "linear-gradient(135deg, #60A5FA 0%, #93C5FD 100%)",
    panelColor: "linear-gradient(135deg, #1E3A8A 0%, #172554 100%)",
    dynamicPrefix: "Mico found",
    staticText: "{{TREASURE}} — splashing through the rain!\nThey wiggle and slide and play!\n\nWhat a wonderful, watery day!",
    characterEmoji: "😆",
    characterImagePath: "/images/mico-idle.png",
    dragPrompt: "Show the treasures to Mico!",
    reactionType: "animals",
    category: "puddles",
    nextPage: "rain-giftshop",
    prevPage: "rainy-day-activity",
  },
  {
    id: "rain-giftshop",
    type: "story",
    bgColor: "linear-gradient(135deg, #E2E8F0 0%, #CBD5E1 100%)",
    panelColor: "linear-gradient(135deg, #334155 0%, #1E293B 100%)",
    category: "gifts",
    text: "The day grows late, the storm clears down.\nMico walks through the quiet town.\n\nHe sees a bakery, cozy and bright,\nsmelling of cinnamon and sweet delight.\n\nHe wants to bring a comforting treat,\nsomething warm and delicious to eat!",
    characterEmoji: "😊",
    characterImagePath: "/images/mico-idle.png",
    tapReaction: "Mmmm, smells so good!",
    emotion: "warm",
    nextPage: "rain-gifts-activity",
    prevPage: "rainy-day-feedback",
  },
  {
    id: "rain-gifts-activity",
    type: "activity",
    bgColor: "linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)",
    panelColor: "linear-gradient(135deg, #334155 0%, #1E293B 100%)",
    title: "Pick a cozy treat for the family.",
    instruction: "Tap a rainy-day dessert to put in the box.",
    category: "gifts",
    maxItems: 1,
    dropLabel: "Rainy Gift Box",
    items: [
      { id: "pie",      label: "Warm Pie",      emoji: "🥧" },
      { id: "donuts",   label: "Donuts",        emoji: "🍩" },
      { id: "tea_pack", label: "Warm Tea Pack", emoji: "🍵" },
      { id: "cookies",  label: "Cookies",       emoji: "🍪" },
    ],
    nextPage: "rain-gifts-feedback",
    prevPage: "rain-giftshop",
  },
  {
    id: "rain-gifts-feedback",
    type: "feedback",
    bgColor: "linear-gradient(135deg, #CBD5E1 0%, #94A3B8 100%)",
    panelColor: "linear-gradient(135deg, #334155 0%, #1E293B 100%)",
    dynamicPrefix: "Mico bought",
    staticText: "{{GIFT}} — a cozy treat for those he loves!\nHe skips back home along the rainy street.\n\nThe rain taps a soft song on the roof above,\nfilling the house with warmth and love.",
    characterEmoji: "🎁",
    characterImagePath: "/images/mico-idle.png",
    dragPrompt: "Drag the gift to Mico!",
    reactionType: "gift",
    category: "gifts",
    nextPage: "rain-end",
    prevPage: "rain-gifts-activity",
  },
  {
    id: "rain-end",
    type: "end",
    bgColor: "#1E293B",
    panelColor: "#38BDF8",
    title: "The Rainy End",
    text: "A cozy warm breakfast. Splashing in puddle streams. And a sweet hot pie.\n\nWhat a cozy, rainy day! Snug and bright,\nthis evening is perfectly right.",
    characterEmoji: "😴",
    characterImagePath: "/images/mico-idle.png",
  },

  // ─── End ──────────────────────────────────────────────────────────────────
  {
    id: "end",
    type: "end",
    bgColor: "#580322",
    panelColor: "#FF90C1",
    title: "The end",
    text: "A hearty breakfast. A fun adventure. And a sweet gift.\n\nWhat a full day! Tasty and bright,\nthis day is deliciously right.",
    characterEmoji: "😋",
    characterImagePath: "/images/mico-idle.png",
  },
];

// ─── Park, Beach & Forest ordered paths for progress bar ───────────────────────────
export const PARK_PATH = [
  "title", "season-select", "morning", "breakfast-activity", "breakfast-feedback",
  "where-to-go",
  "meadow", "animals-activity", "animals-feedback",
  "giftshop", "gifts-activity", "gifts-feedback", "end",
];

export const BEACH_PATH = [
  "title", "season-select", "morning", "breakfast-activity", "breakfast-feedback",
  "where-to-go",
  "beach", "beach-activity", "beach-feedback",
  "giftshop", "gifts-activity", "gifts-feedback", "end",
];

export const FOREST_PATH = [
  "title", "season-select", "morning", "breakfast-activity", "breakfast-feedback",
  "where-to-go",
  "forest", "forest-activity", "forest-feedback",
  "giftshop", "gifts-activity", "gifts-feedback", "end",
];

export const WINTER_PATH = [
  "title", "season-select", "winter-morning", "winter-breakfast-activity", "winter-breakfast-feedback",
  "winter-story", "snowman-activity", "snowman-feedback",
  "winter-giftshop", "winter-gifts-activity", "winter-gifts-feedback", "winter-end",
];

export const RAIN_PATH = [
  "title", "season-select", "rain-morning", "rain-breakfast-activity", "rain-breakfast-feedback",
  "rainy-day-story", "rainy-day-activity", "rainy-day-feedback",
  "rain-giftshop", "rain-gifts-activity", "rain-gifts-feedback", "rain-end",
];

// Keep PAGE_ORDER as the park path for any legacy reference
export const PAGE_ORDER = PARK_PATH;

export const GIFT_REACTIONS: Record<string, string[]> = {
  cake:       ["Cake! They'll love this! 🎂", "Mmm, cake! 😋", "What a tasty cake!"],
  cookies:    ["Cookies! So yummy! 🍪", "Mmm, cookies! 😋", "Freshly baked cookies!"],
  cupcakes:   ["Cupcakes! Perfect! 🧁", "Frosted cupcakes, wow!", "Mmm, cupcakes! 😋"],
  icecream:   ["Ice cream! So cool! 🍦", "Cold and creamy! 😋", "They'll love ice cream!"],
  croissants: ["Croissants! Fancy! 🥐", "Mmm, croissants! 😋", "Buttery croissants!"],
  donuts:     ["Donuts! Amazing! 🍩", "Fresh glazed donuts! 😋", "Mmm, donuts!"],
  pie:        ["Mmm, warm apple pie! 🥧", "Pie! So tasty! 😋", "Warm pie is the best!"],
  tea_pack:   ["Tea! So soothing! 🍵", "Warm tea mix, perfect!", "Cozy tea time! 😋"],
};

export const EAT_REACTIONS = [
  "Munch munch! 😋",
  "So yummy! ✨",
  "Delicious! 🌟",
  "Nom nom nom! 💫",
];

// Shared emoji/label lookup maps — single source of truth used by FeedbackPage and EndPage
const ITEM_EMOJI_MAP: Record<string, string> = {
  // Breakfast
  pancakes: "🥞", eggs: "🍳", fruit: "🍊", toast: "🍞",
  milk: "🥣", noodles: "🍜",
  // Park animals
  rabbit: "🐰", butterfly: "🦋", squirrel: "🐿️", bird: "🐦",
  badger: "🦡", hedgehog: "🦔",
  // Beach treasures
  shell: "🐚", crab: "🦀", starfish: "⭐", fish: "🐟",
  jellyfish: "🪼", seahorse: "🦭",
  // Forest items
  mushroom: "🍄", acorn: "🌰", firefly: "✨", crystal: "🔮",
  leaf: "🍁", pinecone: "🌲",
  // Gifts
  cake: "🎂", cookies: "🍪", cupcakes: "🧁", icecream: "🍦",
  croissants: "🥐", donuts: "🍩",
  // Winter
  oatmeal: "🥣", hotcocoa: "☕", soup: "🍲",
  snowman_hat: "🎩", snowman_scarf: "🧣", snowman_carrot: "🥕", snowman_arms: "🌿",
  gingerbread: "🍪", peppermints: "🍬", hotcocoa_gift: "🍫", stollen: "🍞",
  // Rain
  frog: "🐸", raindrop: "💧", leaf_boat: "⛵", umbrella: "☔", snail: "🐌", rainbow: "🌈",
  pie: "🥧", tea_pack: "🍵",
};

const ITEM_LABEL_MAP: Record<string, string> = {
  // Breakfast
  pancakes: "Pancakes", eggs: "Eggs & Bacon", fruit: "Fruit", toast: "Toast",
  milk: "Cereal & Milk", noodles: "Noodles",
  // Park animals
  rabbit: "Rabbit", butterfly: "Butterfly", squirrel: "Squirrel",
  bird: "Bird", badger: "Badger", hedgehog: "Hedgehog",
  // Beach treasures
  shell: "Shell", crab: "Crab", starfish: "Starfish", fish: "Fish",
  jellyfish: "Jellyfish", seahorse: "Seahorse",
  // Forest items
  mushroom: "Mushroom", acorn: "Acorn", firefly: "Firefly", crystal: "Crystal",
  leaf: "Leaf", pinecone: "Pinecone",
  // Gifts
  cake: "Cake", cookies: "Cookies", cupcakes: "Cupcakes", icecream: "Ice Cream",
  croissants: "Croissants", donuts: "Donuts",
  // Winter
  oatmeal: "Oatmeal", hotcocoa: "Hot Cocoa", soup: "Soup",
  snowman_hat: "Winter Hat", snowman_scarf: "Scarf", snowman_carrot: "Carrot Nose", snowman_arms: "Twig Arms",
  gingerbread: "Gingerbread", peppermints: "Peppermints", hotcocoa_gift: "Cocoa Mix", stollen: "Fruit Bread",
  // Rain
  frog: "Frog", raindrop: "Raindrop", leaf_boat: "Leaf Boat", umbrella: "Umbrella", snail: "Snail", rainbow: "Mini Rainbow",
  pie: "Warm Pie", tea_pack: "Warm Tea Pack",
};

const ITEM_IMAGE_MAP: Record<string, string> = {
  pancakes: "/images/food-pancakes.png",
  rabbit: "/images/animal-rabbit.png",
};

export function getItemEmoji(id: string): string {
  return ITEM_EMOJI_MAP[id] || "✨";
}

export function getItemLabel(id: string): string {
  return ITEM_LABEL_MAP[id] || id;
}

export function getItemImagePath(id: string): string | undefined {
  return ITEM_IMAGE_MAP[id];
}
