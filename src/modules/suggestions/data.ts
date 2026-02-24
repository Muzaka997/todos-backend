export type Suggestion = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  estimatedMinutes: number;
};

// Default TODO-oriented suggestions
export const todoSuggestions: Suggestion[] = [
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
    tags: ["exercise"],
    estimatedMinutes: 10,
  },
  {
    id: "s4",
    title: "Read 50 pages of a book",
    category: "Mental",
    tags: ["reading"],
    estimatedMinutes: 100,
  },
  {
    id: "s5",
    title: "Meditate for 15 minutes",
    category: "Wellness",
    tags: ["meditation"],
    estimatedMinutes: 15,
  },
  {
    id: "s6",
    title: "Go for a 30-minute walk",
    category: "Physical",
    tags: ["exercise", "outdoors"],
    estimatedMinutes: 30,
  },
  {
    id: "s7",
    title: "Write a journal entry",
    category: "Mental",
    tags: ["writing", "reflection"],
    estimatedMinutes: 20,
  },
  {
    id: "s8",
    title: "Cook a healthy meal",
    category: "Wellness",
    tags: ["cooking", "nutrition"],
    estimatedMinutes: 45,
  },
  {
    id: "s9",
    title: "Do a random act of kindness",
    category: "Wellness",
    tags: ["kindness", "community"],
    estimatedMinutes: 10,
  },
  {
    id: "s10",
    title: "Learn a new skill for 30 minutes",
    category: "Mental",
    tags: ["learning", "growth"],
    estimatedMinutes: 30,
  },
];

// Dedicated NOT_TODO suggestions live separately to allow independent curation.
export const notTodoSuggestions: Suggestion[] = [
  {
    id: "n1",
    title: "Avoid social media for 30 minutes",
    category: "Focus",
    tags: ["digital-detox", "focus"],
    estimatedMinutes: 30,
  },
  {
    id: "n2",
    title: "Don’t check email before 10am",
    category: "Focus",
    tags: ["habits"],
    estimatedMinutes: 120,
  },
  {
    id: "n3",
    title: "Skip sugary snacks today",
    category: "Wellness",
    tags: ["nutrition"],
    estimatedMinutes: 60,
  },
  {
    id: "n4",
    title: "No screen time 1 hour before bed",
    category: "Wellness",
    tags: ["sleep", "digital-detox"],
    estimatedMinutes: 60,
  },
  {
    id: "n5",
    title: "Avoid procrastinating key task",
    category: "Productivity",
    tags: ["focus", "priorities"],
    estimatedMinutes: 45,
  },
];

export function findSuggestion(id: string): Suggestion | undefined {
  return (
    todoSuggestions.find((s) => s.id === id) ||
    notTodoSuggestions.find((s) => s.id === id)
  );
}

export function filterTodoSuggestions(params: {
  category?: string | null;
  limit?: number | null;
}): Suggestion[] {
  const { category, limit } = params;
  let list = todoSuggestions;
  if (category) {
    const c = category.toLowerCase();
    list = list.filter((s) => s.category.toLowerCase() === c);
  }
  if (limit && limit > 0) list = list.slice(0, limit);
  return list;
}

export function filterNotTodoSuggestions(params: {
  category?: string | null;
  limit?: number | null;
}): Suggestion[] {
  const { category, limit } = params;
  let list = notTodoSuggestions;
  if (category) {
    const c = category.toLowerCase();
    list = list.filter((s) => s.category.toLowerCase() === c);
  }
  if (limit && limit > 0) list = list.slice(0, limit);
  return list;
}
