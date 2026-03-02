import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Memory, Message, Quote } from "../backend";
import { useActor } from "./useActor";

export function useIsCodeCorrect() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (code: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.isCodeCorrect(code);
    },
  });
}

export function useGetMemories() {
  const { actor, isFetching } = useActor();
  return useQuery<Memory[]>({
    queryKey: ["memories"],
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
    mutationFn: async (memory: {
      id: string;
      title: string;
      content: string;
      date: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addMemory(
        memory.id,
        memory.title,
        memory.content,
        memory.date,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memories"] });
    },
  });
}

export function useGetRandomQuote() {
  const { actor, isFetching } = useActor();
  return useQuery<Quote>({
    queryKey: ["randomQuote"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getRandomQuote();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAddQuote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quote: { author: string; text: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addQuote(quote.author, quote.text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["randomQuote"] });
    },
  });
}

export function useGetRandomFunFact() {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ["randomFunFact"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.getRandomFunFact();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAddFunFact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fact: string) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addFunFact(fact);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["randomFunFact"] });
    },
  });
}

export function useGetAllMessages() {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["messages"],
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
    mutationFn: async (message: {
      sender: string;
      content: string;
      timestamp: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.addMessage(
        message.sender,
        message.content,
        message.timestamp,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useGetConversation() {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["conversation"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getConversation();
    },
    enabled: !!actor && !isFetching,
  });
}
