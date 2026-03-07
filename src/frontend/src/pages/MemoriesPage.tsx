// Memories page — updated
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Calendar, Loader2, Plus } from "lucide-react";
import type React from "react";
import { useState } from "react";
import GlassPanel from "../components/GlassPanel";
import { useAddMemory, useGetMemories } from "../hooks/useQueries";

export default function MemoriesPage() {
  const { data: memories, isLoading } = useGetMemories();
  const { mutateAsync: addMemory, isPending } = useAddMemory();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      await addMemory({
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        date,
      });
      setTitle("");
      setContent("");
      setDate(new Date().toISOString().split("T")[0]);
      setShowForm(false);
    } catch {
      // Handle error silently
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="font-display text-3xl font-bold text-white mb-1"
            style={{
              textShadow:
                "0 0 15px #00d4ff, 0 0 30px #0099ff, 0 0 60px rgba(0,100,255,0.4)",
            }}
          >
            📖 Memories
          </h1>
          <p className="text-white/50 text-sm">
            Precious moments worth remembering
          </p>
        </div>
        <Button
          onClick={() => setShowForm((s) => !s)}
          className="bg-doraemon-blue hover:bg-doraemon-blue/80 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Memory
        </Button>
      </div>

      {showForm && (
        <GlassPanel glow="cyan" className="p-6 mb-6">
          <h2 className="font-display text-xl font-bold text-white mb-4">
            New Memory
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Memory title..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe this memory..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[100px]"
            />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white/10 border-white/20 text-white"
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isPending || !title.trim() || !content.trim()}
                className="bg-doraemon-blue hover:bg-doraemon-blue/80 text-white"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-1" />
                ) : (
                  <Plus className="w-4 h-4 mr-1" />
                )}
                Save Memory
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForm(false)}
                className="text-white/60 hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </GlassPanel>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-doraemon-blue animate-spin" />
        </div>
      ) : memories && memories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {memories.map((memory) => (
            <GlassPanel key={memory.id} glow="blue" className="p-5">
              <div className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-doraemon-blue shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1 truncate">
                    {memory.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-2 line-clamp-3">
                    {memory.content}
                  </p>
                  <div className="flex items-center gap-1 text-white/30 text-xs">
                    <Calendar className="w-3 h-3" />
                    <span>{memory.date}</span>
                  </div>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      ) : (
        <GlassPanel className="p-12 text-center">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <p className="text-white/40 text-lg">No memories yet</p>
          <p className="text-white/30 text-sm mt-1">
            Add your first memory to get started!
          </p>
        </GlassPanel>
      )}
    </div>
  );
}
