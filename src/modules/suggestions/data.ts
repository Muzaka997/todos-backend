export type Suggestion = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  estimatedMinutes: number;
};

export const suggestions: Suggestion[] = [
  {
    id: "s1",
    title: "Fifty push-ups",
    category: "Physical",
    tags: ["exercise", "priorities"],
    estimatedMinutes: 10,
  },
  {
    id: "s2",
    title: "Read 1 Article",
    category: "Mental",
    tags: ["reading"],
    estimatedMinutes: 15,
  },
  {
    id: "s3",
    title: "10-minute stretch",
    category: "Wellness",
    tags: ["excercise"],
    estimatedMinutes: 10,
  },
  {
    id: "s4",
    title: "Read 50 pages of a book",
    category: "Mental",
    tags: ["reading"],
    estimatedMinutes: 100,
  },
];

export function findSuggestion(id: string): Suggestion | undefined {
  return suggestions.find((s) => s.id === id);
}

export function filterSuggestions(params: {
  category?: string | null;
  limit?: number | null;
}): Suggestion[] {
  const { category, limit } = params;
  let list = suggestions;
  if (category) {
    const c = category.toLowerCase();
    list = list.filter((s) => s.category.toLowerCase() === c);
  }
  if (limit && limit > 0) list = list.slice(0, limit);
  return list;
}
