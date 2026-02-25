import { useState } from 'react';
import { Heart, Plus, X, Calendar } from 'lucide-react';
import { useGetMemories, useAddMemory } from '../hooks/useQueries';
import GlassPanel from '../components/GlassPanel';
import type { Memory } from '../backend';

function MemoryCard({ memory, index }: { memory: Memory; index: number }) {
  return (
    <div
      className="animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, opacity: 0, animationFillMode: 'forwards' }}
    >
      <GlassPanel glowColor="red" hover className="p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-dora-red/20 border border-dora-red/40 flex items-center justify-center flex-shrink-0">
            <Heart size={16} className="text-dora-red fill-dora-red" />
          </div>
          <div className="flex items-center gap-1 text-foreground/40 text-xs font-space">
            <Calendar size={11} />
            <span>{memory.date}</span>
          </div>
        </div>

        <h3 className="font-orbitron font-bold text-base text-foreground mb-3 leading-tight">
          {memory.title}
        </h3>

        <p className="text-foreground/70 font-nunito text-sm leading-relaxed">
          {memory.content}
        </p>

        <div className="flex gap-1 mt-4">
          {['💙', '⭐', '✨'].map((e, i) => (
            <span key={i} className="text-sm animate-twinkle" style={{ animationDelay: `${i * 0.3}s` }}>
              {e}
            </span>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

export default function MemoriesPage() {
  const { data: memories, isLoading } = useGetMemories();
  const addMemory = useAddMemory();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    const id = `mem-${Date.now()}`;
    await addMemory.mutateAsync({ id, ...form });
    setForm({ title: '', content: '', date: new Date().toISOString().split('T')[0] });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen px-4 py-8 page-enter">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <img
              src="/assets/generated/doraemon-sticker.dim_200x200.png"
              alt="Doraemon sticker"
              className="w-20 h-20 object-contain animate-float"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold gradient-text-blue mb-3">
            Our Memories & Friendship
          </h1>
          <p className="text-foreground/60 font-nunito text-lg max-w-xl mx-auto">
            Every moment we've shared, preserved forever in our magical world 💙
          </p>
        </div>

        {/* Add Memory Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="dora-btn dora-btn-red flex items-center gap-2"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'Add New Memory'}
          </button>
        </div>

        {/* Add Memory Form */}
        {showForm && (
          <div className="max-w-lg mx-auto mb-8 animate-fade-in-up">
            <GlassPanel glowColor="red" className="p-6">
              <h3 className="font-orbitron font-bold text-lg text-dora-red mb-4">
                ✨ New Memory
              </h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <input
                  type="text"
                  placeholder="Memory title..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="dora-input w-full"
                  required
                />
                <textarea
                  placeholder="Describe this precious memory..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="dora-input w-full h-28 resize-none"
                  required
                />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="dora-input w-full"
                />
                <button
                  type="submit"
                  disabled={addMemory.isPending}
                  className="dora-btn dora-btn-red w-full flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {addMemory.isPending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Heart size={16} />
                  )}
                  Save Memory
                </button>
              </form>
            </GlassPanel>
          </div>
        )}

        {/* Memories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 h-48 animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-3 w-3/4" />
                <div className="h-3 bg-white/5 rounded mb-2" />
                <div className="h-3 bg-white/5 rounded mb-2 w-5/6" />
                <div className="h-3 bg-white/5 rounded w-4/6" />
              </div>
            ))}
          </div>
        ) : memories && memories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memories.map((memory, i) => (
              <MemoryCard key={memory.id} memory={memory} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💙</div>
            <p className="text-foreground/50 font-nunito text-lg">
              No memories yet. Add your first one! 🌟
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
