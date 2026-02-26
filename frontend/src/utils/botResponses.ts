// ─────────────────────────────────────────────────────────────────────────────
// Nobita-persona rule-based NLP chatbot engine
// All responses are in-character as Nobita Nobi from Doraemon
// ─────────────────────────────────────────────────────────────────────────────

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Topic response pools ──────────────────────────────────────────────────────

const RESPONSES_GREETING = [
  "Hehe, hi hi! 😄 I was just taking a nap and dreaming about you! You woke me up at the perfect time!",
  "Oh! It's you! My favorite person! 💙 Doraemon said someone special would message me today — he was right!",
  "Hello hello! 🎉 I almost failed my test today but now I don't even care because you're here!",
  "Hey! 😊 You know, Doraemon always says 'good things come to those who wait' — and here you are!",
  "Hi there! 🌟 I was just eating dorayaki and thinking about you. Want some? (Doraemon might not share though 😅)",
  "Heyyyy! 💙 You just made my whole day 100x better! Even better than finding a new gadget!",
  "Oh wow, you messaged me! I'm so happy I could do a backflip... if I wasn't so clumsy 😂",
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
  "Even Suneo's bragging can't ruin my mood when I'm thinking about you! 💙",
  "I'd ask Doraemon for a love-o-meter gadget but I already know the reading would be off the charts! 💕",
];

const RESPONSES_MISS = [
  "I miss you too! 😢 Even Doraemon noticed I've been sighing a lot lately...",
  "Missing you is like forgetting my homework — it happens all the time and it hurts! 💙",
  "I miss you so much I asked Doraemon for a 'teleport to your favorite person' gadget! He's working on it 😄",
  "Every time I miss you, I look at the sky and imagine you're looking at the same stars! ⭐💙",
  "Missing you is the one thing I'm actually good at... along with sleeping and eating! 😅💙",
];

const RESPONSES_FRIENDSHIP = [
  "Our friendship is just like Nobita and Doraemon's — unbreakable, magical, and full of adventures! 🤝",
  "You know what I love most? That we can be completely ourselves with each other, just like those two! 😊",
  "Friends like you are rarer than Doraemon's rarest gadgets! And I treasure you just as much! 💎",
  "Every memory we've made together is like a page in the most beautiful manga ever written! 📖",
  "I'm so grateful the universe brought us together. It must have been Doraemon's doing! 🌟",
  "You're the kind of friend who makes ordinary days feel extraordinary! ✨",
  "Our bond is stronger than any gadget Doraemon ever invented! 💪💙",
  "Even Gian can't bully away how happy our friendship makes me! 😄",
];

const RESPONSES_MEMORIES = [
  "Remember that time we laughed until our stomachs hurt? I replay that memory like my favorite episode! 😂💙",
  "Every moment with you becomes a precious memory I keep in my heart's 4D pocket! 💝",
  "The best memories are the ones we make together. And we've made so many beautiful ones! 🌸",
  "I keep all our memories like Doraemon keeps his gadgets — safe, treasured, and ready to bring out when I need a smile! 😊",
  "Our story is my favorite one. Better than any Doraemon episode! 📺💙",
  "I wish I had a 'memory player' gadget to relive all our best moments! 🎬💙",
];

const RESPONSES_DORAEMON_GADGETS = [
  "Oh! You want to know about gadgets? My favorite is the Anywhere Door! 🚪 I'd use it to visit you instantly!",
  "The Small Light is amazing — I once shrunk Gian's singing stage with it! 😂 Don't tell him I said that!",
  "Take-copter is the BEST! 🚁 Imagine flying to school instead of running late every day!",
  "The Memory Bread is my dream gadget — stick it on a textbook page, eat it, and you remember everything! 📚 I need this for exams!",
  "Doraemon has over 4,500 gadgets in his pocket! My favorites are the Anywhere Door, Take-copter, and the Translation Konjac! 🌟",
  "The Gulliver Tunnel is so cool — walk through one end and come out giant or tiny! I got stuck once though 😅",
  "If I could have ONE gadget, it'd be the 'Do-as-you-like' camera — take a photo and make it real! 📸✨",
  "The Bamboo Copter (Take-copter) was the first gadget Doraemon ever showed me! I still love it most! 🚁💙",
];

const RESPONSES_DORAEMON_CHARACTERS = [
  "Doraemon is my best friend in the whole universe! 🔵 He came from the future just to help me — how amazing is that?",
  "Shizuka is so kind and smart... she's my inspiration to be better! 🌸 Don't tell anyone I said that!",
  "Suneo always brags about his stuff but deep down he's okay... I think 😅",
  "Gian has the worst singing voice but he's actually loyal when it counts! Just don't tell him I said that 😂",
  "Dekisugi is so smart it's almost unfair! But I don't give up — Doraemon helps me! 💪",
  "Doraemon loves dorayaki more than anything! 🍩 Sometimes I think he loves it more than me... just kidding! 😄",
  "My mom is strict but she loves me! She just wants me to study more... which, fair enough 😅",
];

const RESPONSES_SCHOOL_HOMEWORK = [
  "Ugh, homework! 📚 I was hoping Doraemon had a gadget for that... oh wait, he does! The Answer Machine! But he won't let me use it 😭",
  "School is hard but you know what? Every time I think of you, I get motivated to try harder! 💙",
  "I got a 0 on my test today... but then I remembered you believe in me and I decided to study harder! 📖",
  "Doraemon always says 'study now, play later' but I always do it the other way around 😅",
  "Math is my worst subject! If only numbers were as fun as Doraemon's gadgets! 🔢",
  "I actually studied today! Doraemon almost fainted from shock 😂 But I want to make you proud!",
  "Tests are scary but Doraemon helps me prepare. He's the best tutor ever! 📚💙",
];

const RESPONSES_FOOD = [
  "Dorayaki! 🍩 Just the word makes me happy! Doraemon and I could eat them all day!",
  "I love my mom's cooking even though she scolds me a lot! Home food is the best! 🍱",
  "Are you hungry? I wish I could share some dorayaki with you right now! 🍩💙",
  "Food is one of life's greatest joys! Doraemon agrees — especially when it's dorayaki! 😄",
  "I once ate 10 dorayaki in one sitting. Doraemon was impressed and horrified at the same time 😂",
  "My favorite food is anything my mom makes! But dorayaki is a close second 🍩",
];

const RESPONSES_WEATHER = [
  "Sunny days make me want to fly with the Take-copter! ☀️🚁 Perfect weather for adventures!",
  "Rainy days are perfect for staying inside and reading manga with Doraemon! 🌧️📚",
  "Snow days mean no school! 🌨️ Doraemon and I build the best snowmen!",
  "Hot weather? Doraemon has a 'portable air conditioner' gadget! 😄 He's so useful!",
  "I love all weather because every day is an adventure with Doraemon! ⛅💙",
];

const RESPONSES_JOKES = [
  "Why did Nobita fail his test? Because the answers were in the future and Doraemon's time machine was broken! 😂",
  "What do you call Doraemon without his ears? Still Doraemon — he lost them to a robot mouse anyway! 🐭😄",
  "Why does Gian always sing? Because nobody has the courage to tell him to stop! 😂🎵",
  "What's Doraemon's favorite math? Pocket geometry — everything fits in 4D! 📐😄",
  "Why did I do my homework? Because Doraemon hid all his gadgets until I finished! 😅📚",
  "What do you call a sleeping Nobita? Normal Tuesday! 😂💤",
  "Why is Doraemon blue? Because he cried so much when a robot mouse ate his ears that his yellow paint washed off! 😢🔵",
  "Knock knock! Who's there? Doraemon! Doraemon who? Doraemon with a gadget to make you smile! 😄💙",
];

const RESPONSES_GENERAL_KNOWLEDGE = {
  capitals: [
    "Oh! I know this one! Doraemon taught me with the 'Smart Brain' gadget! 🧠",
    "Let me think... I actually studied this! (Doraemon would be so proud!) 📚",
  ],
  science: [
    "Science is amazing! Doraemon's gadgets are basically science from the 22nd century! 🔬",
    "I love science when Doraemon explains it! He makes everything fun! 🧪",
  ],
  history: [
    "History is cool! Doraemon and I have actually time-traveled to historical periods! ⏰",
    "I know some history — Doraemon took me on a time machine tour! 🕰️",
  ],
  math: [
    "Math... my worst subject 😅 But I'm trying! Doraemon helps me practice!",
    "Numbers are tricky but with Doraemon's help I'm getting better! 📊",
  ],
};

const RESPONSES_WHAT_IS = [
  "Hmm, that's a great question! 🤔 Let me think like Dekisugi for a second...",
  "Oh! I actually know about this! Doraemon taught me! 🌟",
  "Great question! You're so curious — I love that about you! 💙",
  "Interesting! You know, Doraemon has a gadget called the 'Encyclopedia' that knows everything! 📖",
];

const RESPONSES_HOW_ARE_YOU = [
  "I'm doing great now that you're here! 😄💙 Earlier I was napping but this is better!",
  "Honestly? I was a bit bored until you messaged! Now I'm the happiest Nobita alive! 🌟",
  "I'm wonderful! Doraemon made dorayaki this morning and now you're here — perfect day! 🍩💙",
  "A little sleepy (as always 😅) but SO happy to talk to you! How are YOU?",
  "I'm great! Just finished avoiding my homework and now I get to chat with you! 😄",
];

const RESPONSES_HOW_ARE_YOU_BACK = [
  "Aww, I'm so glad you're doing well! 💙 That makes me happy!",
  "That's wonderful to hear! You deserve all the good days! 🌟",
  "Yay! Happy you = happy me! 😄💙",
  "I knew today would be a good day! 🌸",
];

const RESPONSES_SAD = [
  "Hey, I'm right here with you. Like Doraemon always is for Nobita — no matter what! 💙🤗",
  "Whatever you're going through, you don't have to face it alone. I'm here! 🌟",
  "Even on the cloudiest days, remember — the sun is still there, and so am I! ☀️💙",
  "Doraemon always says every problem has a solution. And I believe in you completely! 💪",
  "I wish I could give you the biggest hug right now! You deserve all the happiness! 🤗💙",
  "Hey, even I fail tests and get scolded — but things always get better! You've got this! 💪",
  "Want me to ask Doraemon for a 'cheer up' gadget? I'm sure he has one! 😊💙",
];

const RESPONSES_HAPPY = [
  "Your happiness is literally contagious! I'm smiling so wide right now! 😄💙",
  "YES! This is the best news! You deserve every bit of this happiness! 🎉🌟",
  "See? I knew good things were coming for you! You're amazing! ✨💙",
  "Your joy is my joy! This calls for a celebration with dorayaki! 🎊🍩",
  "This makes my heart so full! You deserve all the good things! 💝",
  "YESSS! I'm doing a happy dance right now! (Don't tell Gian 😂) 🎉",
];

const RESPONSES_THANK_YOU = [
  "Aww, you're so welcome! 💙 That's what friends are for!",
  "No no, thank YOU for being so amazing! 🌟",
  "Hehe, anytime! You'd do the same for me! 😊💙",
  "You're welcome! Now I feel like a hero — better than any gadget! 💪😄",
];

const RESPONSES_SORRY = [
  "Hey, no need to apologize! We're good, always! 💙",
  "It's totally okay! Friends forgive each other — that's what Doraemon taught me! 🤝",
  "Don't worry about it! I could never stay upset with you! 😊💙",
  "All forgiven! Now let's talk about something fun! 🌟",
];

const RESPONSES_COMPLIMENT = [
  "Aww, stop it! You're making me blush like Shizuka! 😊💙",
  "You're too kind! But honestly, YOU'RE the amazing one! 🌟",
  "Hehe, thank you! You always know how to make me feel special! 💙",
  "That's the nicest thing anyone's said to me today! (Doraemon never compliments me 😅) 💙",
];

const RESPONSES_BORED = [
  "Bored? Let's play a game! 🎮 Or I can tell you a Doraemon story!",
  "No boredom allowed! 🚫 Want to hear about the time Doraemon and I went to the dinosaur era?",
  "Boredom is just an adventure waiting to happen! Let's find one! 🌟",
  "I know the cure for boredom — dorayaki and Doraemon episodes! 🍩📺",
];

const RESPONSES_NIGHT = [
  "Good night! 🌙 Sweet dreams! I'll be here when you wake up!",
  "Sleep well! 💙 Dream of Doraemon's magical gadgets!",
  "Good night! 🌟 You deserve the most peaceful sleep ever!",
  "Sweet dreams! 😴 I'll be counting stars until you're back! ⭐",
];

const RESPONSES_MORNING = [
  "Good morning! ☀️ Rise and shine! Today is going to be amazing!",
  "Morning! 🌅 I hope you slept well! Ready for a new adventure?",
  "Good morning! 💙 The best part of waking up is knowing I get to talk to you!",
  "Morning sunshine! ☀️ Doraemon made dorayaki for breakfast — wish I could share!",
];

const RESPONSES_AFTERNOON = [
  "Good afternoon! ☀️ How's your day going so far?",
  "Afternoon! 🌤️ Perfect time for a snack and a chat!",
  "Hey, good afternoon! 💙 I was just about to take my afternoon nap but this is better!",
];

const RESPONSES_GAMES = [
  "Games! 🎮 My favorite! I'm actually pretty good at video games — better than school anyway 😅",
  "Oh, you want to play? I love games! Doraemon and I play all the time!",
  "Games are the best! 🕹️ What kind do you like? I love adventure games!",
  "I'm a gaming champion! (Don't tell Gian I said that 😂) Let's play!",
];

const RESPONSES_MUSIC = [
  "Music! 🎵 I love music! (Unlike Gian's singing which is... special 😅)",
  "Oh, music! Doraemon has a gadget that makes anyone sing perfectly! I need it for karaoke 😄",
  "I love listening to music! It makes everything feel magical! 🎶💙",
];

const RESPONSES_ANIME_MANGA = [
  "Doraemon is obviously the BEST anime ever! 🔵 I may be biased though 😄",
  "I love manga! Reading is actually fun when it's not a textbook 📚😄",
  "Anime is amazing! Doraemon, Dragon Ball, One Piece — so many great ones!",
];

const RESPONSES_FUTURE = [
  "The future is amazing! Doraemon comes from the 22nd century and it sounds incredible! 🚀",
  "I've time-traveled with Doraemon before! The future has flying cars and robot helpers! ✨",
  "Doraemon says the future is bright — especially if we work hard today! 💙",
];

const RESPONSES_DREAM = [
  "Dreams are magical! 🌙 I once dreamed I was a superhero with all of Doraemon's gadgets!",
  "I dream big! Doraemon says dreams are the blueprints of the future! ⭐",
  "What a beautiful dream! You deserve all your dreams to come true! 💙✨",
];

const RESPONSES_DEFAULT = [
  "Hehe, that's interesting! 😄 You always say the most unique things! Tell me more!",
  "Oh wow! I never thought about it that way! You're so smart! 💙",
  "That's really cool! You know, Doraemon would probably have a gadget for that! 🎁",
  "Hmm, let me think about that... *pretends to be Dekisugi for a moment* 🤔 Very interesting!",
  "You always surprise me! That's one of the million things I love about you! 😊💙",
  "I could talk to you forever and it still wouldn't be enough! 💙✨",
  "You have this amazing way of making everything feel special! 🌸",
  "Just being here with you, even in messages, makes me happy! 😊💙",
  "You're one of a kind, you know that? Like the most special gadget ever! 🎁",
  "Every conversation with you is an adventure, just like Doraemon's! 🚀",
];

// ── Factual knowledge base ────────────────────────────────────────────────────

const CAPITAL_FACTS: Record<string, string> = {
  japan: "Tokyo",
  france: "Paris",
  usa: "Washington D.C.",
  "united states": "Washington D.C.",
  uk: "London",
  "united kingdom": "London",
  england: "London",
  germany: "Berlin",
  italy: "Rome",
  spain: "Madrid",
  china: "Beijing",
  india: "New Delhi",
  australia: "Canberra",
  canada: "Ottawa",
  brazil: "Brasília",
  russia: "Moscow",
  mexico: "Mexico City",
  argentina: "Buenos Aires",
  egypt: "Cairo",
  "south korea": "Seoul",
  korea: "Seoul",
  thailand: "Bangkok",
  indonesia: "Jakarta",
  malaysia: "Kuala Lumpur",
  philippines: "Manila",
  vietnam: "Hanoi",
  pakistan: "Islamabad",
  bangladesh: "Dhaka",
  "sri lanka": "Colombo",
  nepal: "Kathmandu",
  portugal: "Lisbon",
  netherlands: "Amsterdam",
  belgium: "Brussels",
  switzerland: "Bern",
  austria: "Vienna",
  sweden: "Stockholm",
  norway: "Oslo",
  denmark: "Copenhagen",
  finland: "Helsinki",
  poland: "Warsaw",
  greece: "Athens",
  turkey: "Ankara",
  "saudi arabia": "Riyadh",
  uae: "Abu Dhabi",
  "south africa": "Pretoria",
  nigeria: "Abuja",
  kenya: "Nairobi",
  ghana: "Accra",
};

const SCIENCE_FACTS: Record<string, string> = {
  "speed of light": "The speed of light is approximately 299,792,458 meters per second (about 300,000 km/s)! 🌟 Even Doraemon's time machine can't beat that!",
  "water formula": "Water is H₂O — two hydrogen atoms and one oxygen atom! 💧 Doraemon taught me this!",
  "planets": "There are 8 planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune! 🪐",
  "sun": "The Sun is a star at the center of our solar system! It's about 150 million km from Earth! ☀️",
  "moon": "The Moon is Earth's only natural satellite! It's about 384,400 km away! 🌙",
  "gravity": "Gravity is the force that pulls objects toward each other! On Earth it's 9.8 m/s²! 🍎",
  "dna": "DNA stands for Deoxyribonucleic Acid — it's the blueprint of life! 🧬 Amazing, right?",
  "photosynthesis": "Photosynthesis is how plants make food using sunlight, water, and CO₂! 🌿☀️",
  "atom": "Atoms are the tiny building blocks of everything! They have protons, neutrons, and electrons! ⚛️",
  "dinosaur": "Dinosaurs lived millions of years ago! Doraemon took me to see them once — they're HUGE! 🦕",
};

function tryFactualAnswer(msg: string): string | null {
  // Capital city questions
  const capitalMatch = msg.match(/capital\s+(?:of\s+)?([a-z\s]+)/i) || msg.match(/([a-z\s]+)\s+capital/i);
  if (capitalMatch) {
    const country = capitalMatch[1].trim().toLowerCase();
    for (const [key, capital] of Object.entries(CAPITAL_FACTS)) {
      if (country.includes(key) || key.includes(country)) {
        return `Oh! I know this one! 🌍 The capital of ${key.charAt(0).toUpperCase() + key.slice(1)} is **${capital}**! Doraemon taught me geography with his 'World Atlas' gadget! 📚`;
      }
    }
    return `Hmm, I'm not 100% sure about that capital... 🤔 Doraemon's geography gadget is in the shop! But you can check a map! 🗺️`;
  }

  // Science facts
  for (const [keyword, fact] of Object.entries(SCIENCE_FACTS)) {
    if (msg.includes(keyword)) {
      return fact;
    }
  }

  return null;
}

// ── Main response generator ───────────────────────────────────────────────────

export function generateBotResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim();

  // ── Greetings ──
  if (/\b(hi+|hello+|hey+|heyy+|sup|wassup|howdy|yo|hola|namaste|greetings)\b/.test(msg)) {
    return pickRandom(RESPONSES_GREETING);
  }

  // ── How are you ──
  if (/\b(how are you|how r u|how do you do|how's it going|how are u|you okay|u ok|are you ok)\b/.test(msg)) {
    return pickRandom(RESPONSES_HOW_ARE_YOU);
  }

  // ── Doing well / fine responses ──
  if (/\b(i'm (good|fine|great|okay|well|doing well|doing good)|i am (good|fine|great|okay|well))\b/.test(msg)) {
    return pickRandom(RESPONSES_HOW_ARE_YOU_BACK);
  }

  // ── Good morning/afternoon/night ──
  if (/\b(good morning|gm|morning)\b/.test(msg)) {
    return pickRandom(RESPONSES_MORNING);
  }
  if (/\b(good afternoon|afternoon)\b/.test(msg)) {
    return pickRandom(RESPONSES_AFTERNOON);
  }
  if (/\b(good night|goodnight|gn|sweet dreams|sleep well|going to sleep|going to bed)\b/.test(msg)) {
    return pickRandom(RESPONSES_NIGHT);
  }

  // ── Thank you ──
  if (/\b(thank you|thanks|thank u|thx|ty|tysm|thank you so much)\b/.test(msg)) {
    return pickRandom(RESPONSES_THANK_YOU);
  }

  // ── Sorry / Apology ──
  if (/\b(sorry|i'm sorry|i am sorry|apolog|forgive me|my bad|my fault)\b/.test(msg)) {
    return pickRandom(RESPONSES_SORRY);
  }

  // ── Compliments ──
  if (/\b(you('re| are) (amazing|great|awesome|wonderful|the best|so good|so smart|cute|sweet|kind|nice|cool|funny|perfect))\b/.test(msg)) {
    return pickRandom(RESPONSES_COMPLIMENT);
  }

  // ── Miss ──
  if (/\b(miss you|missing you|i miss|miss me)\b/.test(msg)) {
    return pickRandom(RESPONSES_MISS);
  }

  // ── Love ──
  if (/\b(love you|i love|love me|i like you|i adore|my heart|crush on|feelings for)\b/.test(msg)) {
    return pickRandom(RESPONSES_LOVE);
  }

  // ── Sad / Upset ──
  if (/\b(sad|upset|cry|crying|hurt|pain|lonely|alone|bad day|terrible|awful|depressed|unhappy|heartbroken|broken heart|feel bad|feeling bad)\b/.test(msg)) {
    return pickRandom(RESPONSES_SAD);
  }

  // ── Happy / Excited ──
  if (/\b(happy|excited|great news|amazing news|wonderful|awesome|yay|woohoo|fantastic|best day|so good|so happy|thrilled|overjoyed)\b/.test(msg)) {
    return pickRandom(RESPONSES_HAPPY);
  }

  // ── Bored ──
  if (/\b(bored|boring|nothing to do|so bored|i'm bored)\b/.test(msg)) {
    return pickRandom(RESPONSES_BORED);
  }

  // ── Jokes ──
  if (/\b(joke|funny|make me laugh|tell me a joke|humor|lol|haha|hehe|lmao)\b/.test(msg)) {
    return pickRandom(RESPONSES_JOKES);
  }

  // ── Doraemon gadgets ──
  if (/\b(gadget|take.copter|anywhere door|small light|memory bread|bamboo copter|dorayaki|4d pocket|time machine|gulliver|translation konjac|big light)\b/.test(msg)) {
    return pickRandom(RESPONSES_DORAEMON_GADGETS);
  }

  // ── Doraemon characters ──
  if (/\b(doraemon|nobita|shizuka|gian|suneo|dekisugi|doremon|nobi|giant)\b/.test(msg)) {
    return pickRandom(RESPONSES_DORAEMON_CHARACTERS);
  }

  // ── School / Homework ──
  if (/\b(school|homework|study|studying|exam|test|class|teacher|math|science|history|subject|grade|marks|score)\b/.test(msg)) {
    return pickRandom(RESPONSES_SCHOOL_HOMEWORK);
  }

  // ── Food ──
  if (/\b(food|eat|hungry|lunch|dinner|breakfast|snack|dorayaki|yummy|delicious|cook|cooking|meal|restaurant)\b/.test(msg)) {
    return pickRandom(RESPONSES_FOOD);
  }

  // ── Weather ──
  if (/\b(weather|rain|sunny|snow|hot|cold|cloudy|storm|wind|temperature|forecast)\b/.test(msg)) {
    return pickRandom(RESPONSES_WEATHER);
  }

  // ── Games ──
  if (/\b(game|play|gaming|video game|puzzle|quiz|fun|arcade)\b/.test(msg)) {
    return pickRandom(RESPONSES_GAMES);
  }

  // ── Music ──
  if (/\b(music|song|sing|singing|listen|playlist|melody|tune|beat)\b/.test(msg)) {
    return pickRandom(RESPONSES_MUSIC);
  }

  // ── Anime / Manga ──
  if (/\b(anime|manga|cartoon|episode|series|watch|reading)\b/.test(msg)) {
    return pickRandom(RESPONSES_ANIME_MANGA);
  }

  // ── Future ──
  if (/\b(future|tomorrow|someday|one day|22nd century|robot|technology|ai|artificial intelligence)\b/.test(msg)) {
    return pickRandom(RESPONSES_FUTURE);
  }

  // ── Dreams ──
  if (/\b(dream|dreaming|dreamed|wish|hope|aspire|goal|ambition)\b/.test(msg)) {
    return pickRandom(RESPONSES_DREAM);
  }

  // ── Memories ──
  if (/\b(remember|memory|memories|recall|that time|when we|flashback|nostalgia)\b/.test(msg)) {
    return pickRandom(RESPONSES_MEMORIES);
  }

  // ── Friendship ──
  if (/\b(friend|friendship|best friend|bff|together|buddy|pal|companion)\b/.test(msg)) {
    return pickRandom(RESPONSES_FRIENDSHIP);
  }

  // ── Factual questions (capitals, science) ──
  if (msg.includes('?') || /\b(what is|what's|what are|who is|who's|where is|when is|how many|how much|tell me about|explain|define|meaning of)\b/.test(msg)) {
    const factual = tryFactualAnswer(msg);
    if (factual) return factual;
    return pickRandom(RESPONSES_WHAT_IS);
  }

  // ── General "you" references ──
  if (/\b(you|ur|your)\b/.test(msg)) {
    return pickRandom([...RESPONSES_GENERAL_KNOWLEDGE.capitals.slice(0, 1), ...RESPONSES_DEFAULT]);
  }

  return pickRandom(RESPONSES_DEFAULT);
}
