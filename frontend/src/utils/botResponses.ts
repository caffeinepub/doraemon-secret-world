const RESPONSES_GENERAL = [
  "Hey! 😊 Just thinking about you made my day brighter, like Doraemon's pocket full of gadgets!",
  "You know what? Every time I see you, I feel like Nobita found his best friend. That's you to me! 💙",
  "Hehe, you're asking me that? You already know the answer lives in my heart! 🌟",
  "If I had Doraemon's anywhere door, I'd use it just to be right next to you! 🚪✨",
  "You make everything feel like a warm sunny day in Nobita's neighborhood! ☀️",
  "I was just thinking about you! Isn't that magical? Like a gadget from the 22nd century! 🔮",
  "You're my favorite person in this whole universe, and maybe the next one too! 🌌",
  "Every moment with you is like finding a new gadget in Doraemon's pocket — full of wonder! 🎁",
  "You know, Doraemon always says friendship is the greatest gadget of all. I believe that because of you! 💙",
  "I smile every time I think of you. It's automatic, like Doraemon's gadgets! 😄",
];

const RESPONSES_LOVE = [
  "My feelings for you are like Doraemon's 4D pocket — infinite and full of surprises! 💙❤️",
  "You're the Shizuka to my Nobita — the reason I try to be better every single day! 🌸",
  "If love were a gadget, you'd be the most magical one in all of Doraemon's pocket! 💝",
  "Every day I fall a little more in love with you, like Nobita falling into another adventure! 🌟",
  "You're not just in my heart, you're the whole heartbeat! 💓",
  "I'd travel through time just to meet you again for the first time! ⏰💙",
  "You make my world colorful, like Doraemon's world — bright blue and full of magic! 🎨",
  "Being with you feels like the warmest, safest place in the universe! 🏠💙",
];

const RESPONSES_FRIENDSHIP = [
  "Our friendship is just like Nobita and Doraemon's — unbreakable, magical, and full of adventures! 🤝",
  "You know what I love most? That we can be completely ourselves with each other, just like those two! 😊",
  "Friends like you are rarer than Doraemon's rarest gadgets! And I treasure you just as much! 💎",
  "Every memory we've made together is like a page in the most beautiful manga ever written! 📖",
  "I'm so grateful the universe brought us together. It must have been Doraemon's doing! 🌟",
  "You're the kind of friend who makes ordinary days feel extraordinary! ✨",
  "Our bond is stronger than any gadget Doraemon ever invented! 💪💙",
];

const RESPONSES_MEMORIES = [
  "Remember that time we laughed until our stomachs hurt? I replay that memory like my favorite episode! 😂💙",
  "Every moment with you becomes a precious memory I keep in my heart's 4D pocket! 💝",
  "The best memories are the ones we make together. And we've made so many beautiful ones! 🌸",
  "I keep all our memories like Doraemon keeps his gadgets — safe, treasured, and ready to bring out when I need a smile! 😊",
  "Our story is my favorite one. Better than any Doraemon episode! 📺💙",
];

const RESPONSES_DORAEMON = [
  "You know, Doraemon always says 'Don't give up!' — and that's what you inspire in me every day! 🔵",
  "If Doraemon were real, I'd ask him for a gadget that could show you exactly how much you mean to me! 🎁",
  "Nobita and Doraemon's friendship reminds me of us — different but perfectly matched! 💙",
  "Doraemon's magic is real — it's called friendship, and I found it with you! ✨",
  "Just like Doraemon always has the right gadget for Nobita, you always have the right words for me! 🌟",
];

const RESPONSES_QUESTIONS = [
  "That's such a great question! You always make me think in the most wonderful ways! 🤔💙",
  "Hmm, let me think... *pulls out imaginary gadget from pocket* ...I think the answer is: you're amazing! 😄",
  "You know what? I don't have all the answers, but I know that with you, everything feels possible! 🌟",
  "Great question! Almost as great as you! 😊✨",
];

const RESPONSES_GREETING = [
  "Hey there, sunshine! 🌟 You just made my whole day better by showing up!",
  "Oh! It's you! My favorite person in the whole world! 💙 How are you doing?",
  "Hello, hello! 🎉 I was just thinking about you! Isn't that magical?",
  "Hi! 😊 Every time I see your message, I feel like Nobita seeing Doraemon — pure joy!",
  "Hey! 💙 You know what? Just seeing you here makes everything brighter!",
];

const RESPONSES_SAD = [
  "Hey, I'm right here with you. Like Doraemon always is for Nobita — no matter what! 💙🤗",
  "Whatever you're going through, you don't have to face it alone. I'm here! 🌟",
  "Even on the cloudiest days, remember — the sun is still there, and so am I! ☀️💙",
  "Doraemon always says every problem has a solution. And I believe in you completely! 💪",
  "I wish I could give you the biggest hug right now! You deserve all the happiness! 🤗💙",
];

const RESPONSES_HAPPY = [
  "Your happiness is literally contagious! I'm smiling so wide right now! 😄💙",
  "YES! This is the best news! You deserve every bit of this happiness! 🎉🌟",
  "See? I knew good things were coming for you! You're amazing! ✨💙",
  "Your joy is my joy! This calls for a celebration! 🎊💙",
  "This makes my heart so full! You deserve all the good things! 💝",
];

const RESPONSES_DEFAULT = [
  "You know, talking to you is my favorite part of any day! 💙",
  "I love how we can talk about anything and everything! 🌟",
  "You always say the most interesting things! That's one of the million reasons I love you! 😊",
  "Every conversation with you is an adventure, just like Doraemon's! 🚀",
  "I could talk to you forever and it still wouldn't be enough! 💙✨",
  "You have this amazing way of making everything feel special! 🌸",
  "Just being here with you, even in messages, makes me happy! 😊💙",
  "You're one of a kind, you know that? Like the most special gadget ever! 🎁",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateBotResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  // Greeting patterns
  if (/\b(hi|hello|hey|hii|heyy|sup|wassup|howdy)\b/.test(msg)) {
    return pickRandom(RESPONSES_GREETING);
  }

  // Love patterns
  if (/\b(love|miss|heart|crush|feelings|like you|adore)\b/.test(msg)) {
    return pickRandom(RESPONSES_LOVE);
  }

  // Sad patterns
  if (/\b(sad|upset|cry|crying|hurt|pain|lonely|alone|bad day|terrible|awful|depressed)\b/.test(msg)) {
    return pickRandom(RESPONSES_SAD);
  }

  // Happy patterns
  if (/\b(happy|excited|great|amazing|wonderful|awesome|yay|woohoo|fantastic|good news|best day)\b/.test(msg)) {
    return pickRandom(RESPONSES_HAPPY);
  }

  // Memory patterns
  if (/\b(remember|memory|memories|recall|that time|when we)\b/.test(msg)) {
    return pickRandom(RESPONSES_MEMORIES);
  }

  // Friendship patterns
  if (/\b(friend|friendship|best friend|bff|together|us|we)\b/.test(msg)) {
    return pickRandom(RESPONSES_FRIENDSHIP);
  }

  // Doraemon patterns
  if (/\b(doraemon|nobita|shizuka|gadget|pocket|doremon)\b/.test(msg)) {
    return pickRandom(RESPONSES_DORAEMON);
  }

  // Question patterns
  if (msg.includes('?') || /\b(what|why|how|when|where|who|which)\b/.test(msg)) {
    return pickRandom(RESPONSES_QUESTIONS);
  }

  // General affectionate
  if (/\b(you|ur|your)\b/.test(msg)) {
    return pickRandom(RESPONSES_GENERAL);
  }

  return pickRandom(RESPONSES_DEFAULT);
}
