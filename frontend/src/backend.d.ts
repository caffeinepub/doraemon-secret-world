import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    sender: string;
    timestamp: string;
}
export interface Quote {
    text: string;
    author: string;
}
export interface Memory {
    id: string;
    title: string;
    content: string;
    date: string;
}
export interface backendInterface {
    addFunFact(fact: string): Promise<void>;
    addMemory(id: string, title: string, content: string, date: string): Promise<void>;
    addMessage(sender: string, content: string, timestamp: string): Promise<void>;
    addQuote(author: string, text: string): Promise<void>;
    getAllMessages(): Promise<Array<Message>>;
    getConversation(): Promise<Array<Message>>;
    getMemories(): Promise<Array<Memory>>;
    getRandomFunFact(): Promise<string>;
    getRandomQuote(): Promise<Quote>;
    isCodeCorrect(code: string): Promise<boolean>;
}
