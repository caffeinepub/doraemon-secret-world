import { useNavigate } from '@tanstack/react-router';

const GAMES = [
  {
    path: '/games/sliding-puzzle',
    title: 'Sliding Puzzle',
    emoji: '🧩',
    description: 'Rearrange the tiles to reveal the Doraemon image!',
    badge: '3×3 Grid',
    gradient: 'from-dora-blue/20 to-dora-cyan/10',
    border: 'border-dora-blue/40',
    textColor: 'text-dora-blue-light',
    glowClass: 'glow-blue',
    howTo: 'Click tiles adjacent to the empty space to slide them. Arrange all tiles in order to win!',
  },
  {
    path: '/games/maze',
    title: 'Maze Adventure',
    emoji: '🌀',
    description: 'Guide Doraemon through the maze to reach the goal!',
    badge: 'Arrow Keys',
    gradient: 'from-dora-yellow/20 to-dora-yellow/5',
    border: 'border-dora-yellow/40',
    textColor: 'text-dora-yellow',
    glowClass: 'glow-yellow',
    howTo: 'Use arrow keys or WASD to navigate. Reach the ⭐ star to complete the maze!',
  },
  {
    path: '/games/memory-match',
    title: 'Memory Match',
    emoji: '🃏',
    description: 'Flip cards and find all the matching Doraemon pairs!',
    badge: '12 Cards',
    gradient: 'from-dora-red/20 to-dora-pink/10',
    border: 'border-dora-red/40',
    textColor: 'text-dora-red',
    glowClass: 'glow-red',
    howTo: 'Click cards to flip them. Match all pairs to win! Remember where each card is!',
  },
  {
    path: '/games/gadget-clicker',
    title: 'Gadget Clicker',
    emoji: '🎁',
    description: "Click Doraemon's gadgets before they disappear! How many can you catch?",
    badge: 'Speed Click',
    gradient: 'from-dora-cyan/20 to-dora-blue/10',
    border: 'border-dora-cyan/40',
    textColor: 'text-dora-cyan',
    glowClass: 'glow-cyan',
    howTo: 'Gadgets pop up randomly on screen. Click them fast to earn points before the timer runs out!',
  },
  {
    path: '/games/exam-quiz',
    title: "Nobita's Exam Quiz",
    emoji: '📝',
    description: "Can you score better than Nobita on his exam? Answer Doraemon trivia!",
    badge: '10 Questions',
    gradient: 'from-dora-yellow/20 to-dora-red/10',
    border: 'border-dora-yellow/40',
    textColor: 'text-dora-yellow',
    glowClass: 'glow-yellow',
    howTo: 'Answer 10 multiple-choice questions about Doraemon. Score higher than Nobita (who usually gets 0)!',
  },
  {
    path: '/games/whack-a-doraemon',
    title: 'Whack-a-Doraemon',
    emoji: '🔨',
    description: 'Characters pop up from holes — whack them before they hide! Classic fun!',
    badge: '3×3 Grid',
    gradient: 'from-dora-red/20 to-dora-yellow/10',
    border: 'border-dora-red/40',
    textColor: 'text-dora-red',
    glowClass: 'glow-red',
    howTo: "Click the characters when they pop up from holes. Each hit scores points. Miss too many and it's game over!",
  },
];

export default function GamesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4 animate-float">🎮</div>
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold gradient-text-blue mb-3">
            Games & Puzzles
          </h1>
          <p className="text-foreground/60 font-nunito text-lg">
            Fun Doraemon-themed games just for you! 🌟
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {GAMES.map(({ path, title, emoji, description, badge, gradient, border, textColor, glowClass, howTo }, i) => (
            <button
              key={path}
              onClick={() => navigate({ to: path })}
              className={`group glass-card rounded-3xl p-6 border ${border} ${glowClass} hover-lift text-left transition-all duration-300 animate-fade-in-up relative overflow-hidden`}
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 group-hover:opacity-70 transition-opacity duration-300`} />

              <div className="relative z-10">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {emoji}
                </div>

                <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-space font-medium border ${border} ${textColor} mb-3 ml-2`}>
                  {badge}
                </div>

                <h3 className={`font-orbitron font-bold text-xl ${textColor} mb-2`}>
                  {title}
                </h3>

                <p className="text-foreground/60 font-space text-sm mb-4 leading-relaxed">
                  {description}
                </p>

                <div className="glass rounded-xl p-3 border border-white/10">
                  <p className="text-foreground/40 text-xs font-space leading-relaxed">
                    💡 {howTo}
                  </p>
                </div>

                <div className={`mt-4 flex items-center gap-2 ${textColor} text-sm font-space font-semibold`}>
                  <span>Play Now →</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Decorative bottom */}
        <div className="text-center">
          <div className="glass rounded-2xl px-8 py-4 inline-block border border-dora-blue/20">
            <p className="text-foreground/50 font-nunito text-base">
              More games coming from Doraemon's pocket soon! 🎁
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
