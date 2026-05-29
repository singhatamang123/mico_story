import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoryState {
  currentPageId: string;
  choices: Record<string, string[]>; // category -> item ids
  completedPages: string[];
  soundEnabled: boolean;
  narrationEnabled: boolean;
  selectedSeason: "sunny" | "winter" | "rain" | null; // tracks the overarching season campaign
  chosenPath: "park" | "beach" | "forest" | null; // tracks which branch the player took (for sunny season)

  // Actions
  goToPage: (pageId: string) => void;
  addChoice: (category: string, itemId: string) => void;
  removeChoice: (category: string, itemId: string) => void;
  clearChoices: (category: string) => void;
  markPageComplete: (pageId: string) => void;
  resetStory: () => void;
  toggleSound: () => void;
  toggleNarration: () => void;
  setSeason: (season: "sunny" | "winter" | "rain") => void;
  setChosenPath: (path: "park" | "beach" | "forest") => void;
}

const initialState = {
  currentPageId: "title",
  choices: {},
  completedPages: [],
  soundEnabled: true,
  narrationEnabled: false,
  selectedSeason: null as "sunny" | "winter" | "rain" | null,
  chosenPath: null as "park" | "beach" | "forest" | null,
};

export const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      ...initialState,

      goToPage: (pageId) => set({ currentPageId: pageId }),

      addChoice: (category, itemId) =>
        set((state) => ({
          choices: {
            ...state.choices,
            [category]: [...(state.choices[category] || []), itemId],
          },
        })),

      removeChoice: (category, itemId) =>
        set((state) => ({
          choices: {
            ...state.choices,
            [category]: (state.choices[category] || []).filter(
              (id) => id !== itemId
            ),
          },
        })),

      clearChoices: (category) =>
        set((state) => ({
          choices: { ...state.choices, [category]: [] },
        })),

      markPageComplete: (pageId) =>
        set((state) => ({
          completedPages: state.completedPages.includes(pageId)
            ? state.completedPages
            : [...state.completedPages, pageId],
        })),

      resetStory: () =>
        set({
          ...initialState,
          soundEnabled: get().soundEnabled,
          narrationEnabled: get().narrationEnabled,
        }),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      toggleNarration: () => set((state) => ({ narrationEnabled: !state.narrationEnabled })),

      setSeason: (season) => set({ selectedSeason: season }),

      setChosenPath: (path) => set({ chosenPath: path }),
    }),
    {
      name: "micos-story-progress",
    }
  )
);
