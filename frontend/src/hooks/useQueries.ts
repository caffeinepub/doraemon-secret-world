import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Memory, Quote, Message } from '../backend';

// ─── Memories ───────────────────────────────────────────────────────────────

export function useGetMemories() {
  const { actor, isFetching } = useActor();
  return useQuery<Memory[]>({
    queryKey: ['memories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMemories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, title, content, date }: { id: string; title: string; content: string; date: string }) => {
      if (!actor) throw new Error('No actor');
      return actor.addMemory(id, title, content, date);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });
}

// ─── Quotes ─────────────────────────────────────────────────────────────────

export function useGetRandomQuote() {
  const { actor, isFetching } = useActor();
  return useQuery<Quote>({
    queryKey: ['random-quote'],
    queryFn: async () => {
      if (!actor) throw new Error('No actor');
      return actor.getRandomQuote();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useAddQuote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ author, text }: { author: string; text: string }) => {
      if (!actor) throw new Error('No actor');
      return actor.addQuote(author, text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['random-quote'] });
    },
  });
}

// ─── Fun Facts ───────────────────────────────────────────────────────────────

export function useGetRandomFunFact() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ['random-fact'],
    queryFn: async () => {
      if (!actor) throw new Error('No actor');
      return actor.getRandomFunFact();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
  });
}

export function useAddFunFact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fact: string) => {
      if (!actor) throw new Error('No actor');
      return actor.addFunFact(fact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['random-fact'] });
    },
  });
}

// ─── Messages ────────────────────────────────────────────────────────────────

export function useGetAllMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ['messages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sender, content, timestamp }: { sender: string; content: string; timestamp: string }) => {
      if (!actor) throw new Error('No actor');
      return actor.addMessage(sender, content, timestamp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export function useVerifyCode() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error('No actor');
      return actor.isCodeCorrect(code);
    },
  });
}
