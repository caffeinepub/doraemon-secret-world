import type { backendInterface } from "../backend";

const SAMPLE_MEMORIES = [
  {
    id: "mem-2",
    title: "Our Secret Language 🌟",
    content:
      "We developed our own little language — inside jokes, secret signals, and words only we understand. Just like Nobita and Doraemon have their own world, we built ours. And it's the most precious place I know.",
    date: "2024-03-22",
  },
  {
    id: "mem-3",
    title: "The Night We Watched Stars 🌌",
    content:
      "Remember when we stayed up late just talking about everything and nothing? The stars were our audience, and the night felt endless. I felt like we were in our own Doraemon episode — magical and timeless.",
    date: "2024-05-10",
  },
  {
    id: "mem-4",
    title: "When You Made Everything Better 💙",
    content:
      "There was a day when everything felt heavy and wrong. And then you appeared — with your smile, your words, your presence. Like Doraemon appearing from the future with exactly the right gadget, you fixed everything just by being you.",
    date: "2024-07-04",
  },
  {
    id: "mem-5",
    title: "Our Doraemon Marathon 🎬",
    content:
      "We watched Doraemon episodes together and I realized — we ARE Nobita and Doraemon. Different, yet perfectly matched. You bring out the best in me, just like Doraemon does for Nobita. This memory lives in my heart forever.",
    date: "2024-09-18",
  },
  {
    id: "mem-6",
    title: "The Promise We Made 🤝",
    content:
      "We made a promise — to always be there for each other, no matter what. Like the unbreakable bond between Nobita and Doraemon that transcends time itself. That promise is my most treasured gadget.",
    date: "2024-11-30",
  },
];

const SAMPLE_QUOTES = [
  { author: "Doraemon", text: "If you give up on your dreams, what's left?" },
  { author: "Doraemon", text: "The future is something you create yourself." },
  {
    author: "Nobita",
    text: "Even if I fail a hundred times, I'll try a hundred and one.",
  },
  {
    author: "Doraemon",
    text: "A true friend is someone who knows all about you and still loves you.",
  },
  {
    author: "Shizuka",
    text: "Kindness is the language which the deaf can hear and the blind can see.",
  },
  {
    author: "Doraemon",
    text: "Don't worry about tomorrow. Today is what matters.",
  },
  {
    author: "Nobita",
    text: "I may not be the smartest, but I have the biggest heart.",
  },
  {
    author: "Doraemon",
    text: "Every problem has a solution. You just need to look in the right pocket.",
  },
  {
    author: "Doraemon",
    text: "Friendship is the greatest gadget in the universe.",
  },
  { author: "Nobita", text: "With a friend like you, I can face anything." },
  {
    author: "Doraemon",
    text: "The most important thing is not what you have, but who you have beside you.",
  },
  {
    author: "Shizuka",
    text: "True strength comes from the heart, not from gadgets.",
  },
  { author: "Doraemon", text: "Even the smallest dream is worth chasing." },
  { author: "Nobita", text: "I believe in miracles because I have you." },
  {
    author: "Doraemon",
    text: "Love and friendship are the only gadgets that never run out of power.",
  },
  {
    author: "Doraemon",
    text: "Time may pass, but true bonds only grow stronger.",
  },
  {
    author: "Nobita",
    text: "You make every ordinary day feel like an adventure.",
  },
  { author: "Doraemon", text: "The heart remembers what the mind forgets." },
];

const SAMPLE_FUN_FACTS = [
  "Doraemon was born on September 3, 2112 — making him a robot from the 22nd century! 🤖",
  "Doraemon's iconic blue color was an accident! He was originally yellow, but a mouse chewed off his ears and he cried so much that his color faded to blue! 😢💙",
  "Doraemon's 4D pocket contains over 4,500 different gadgets! 🎁",
  'The most used gadget in the series is the "Take-copter" (Bamboo-copter) — a small propeller worn on the head! 🚁',
  "Doraemon's favorite food is dorayaki — a Japanese sweet pancake filled with red bean paste! 🥞",
  'The manga series was created by the duo "Fujiko F. Fujio" and first published in 1969! 📚',
  'Doraemon\'s full name is "Doraemon" — it means "stray" in Japanese! 🐱',
  'The "Anywhere Door" (Dokodemo Door) is considered the most popular gadget among fans worldwide! 🚪',
  "Doraemon has a sister named Dorami, who is yellow and has a flower on her head! 🌸",
  "The series has been translated into over 30 languages and is beloved in more than 40 countries! 🌍",
  "Nobita's full name is Nobita Nobi — and he's known for being terrible at sports and studies! 😅",
  "Doraemon's ears were bitten off by a mouse, which is why he's terrified of mice! 🐭",
  'The "Small Light" gadget can shrink anything to a tiny size — one of the most creative gadgets! 🔦',
  "Doraemon was sent from the future by Nobita's great-great-grandson to help improve Nobita's life! ⏰",
  "The series has over 1,300 manga chapters and 1,787 anime episodes! 📺",
  'Doraemon\'s pocket is actually a "4-dimensional" space — it can hold items much larger than itself! 🌌',
  'The "Memory Bread" gadget lets you absorb information by eating bread with text on it! 🍞📖',
  "Doraemon's height is exactly 129.3 cm and he weighs 129.3 kg! 📏",
];

export async function seedDataIfNeeded(actor: backendInterface): Promise<void> {
  try {
    // Check if data already exists
    const [memories, quotes] = await Promise.all([
      actor.getMemories(),
      actor.getRandomQuote().catch(() => null),
    ]);

    // Seed memories if empty
    if (memories.length === 0) {
      for (const mem of SAMPLE_MEMORIES) {
        await actor.addMemory(mem.id, mem.title, mem.content, mem.date);
      }
    }

    // Seed quotes if empty
    if (!quotes) {
      for (const q of SAMPLE_QUOTES) {
        await actor.addQuote(q.author, q.text);
      }
    }

    // Seed fun facts
    const fact = await actor.getRandomFunFact().catch(() => null);
    if (!fact) {
      for (const f of SAMPLE_FUN_FACTS) {
        await actor.addFunFact(f);
      }
    }
  } catch {
    // Silently fail — seeding is best-effort
  }
}
