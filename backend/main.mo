import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";



actor {
  include MixinStorage();

  type Memory = {
    id : Text;
    title : Text;
    content : Text;
    date : Text;
  };

  type Quote = {
    author : Text;
    text : Text;
  };

  type Message = {
    sender : Text;
    content : Text;
    timestamp : Text;
  };

  let correctCode = "Nobita";

  let memories = List.empty<(Text, Memory)>();
  let quotes = List.empty<Quote>();
  let funFacts = List.empty<Text>();
  let messages = List.empty<Message>();

  public shared ({ caller }) func isCodeCorrect(code : Text) : async Bool {
    code == correctCode;
  };

  public shared ({ caller }) func addMemory(id : Text, title : Text, content : Text, date : Text) : async () {
    let memory : Memory = {
      id;
      title;
      content;
      date;
    };
    memories.add((id, memory));
  };

  public query ({ caller }) func getMemories() : async [Memory] {
    memories.values().toArray().map(func((_, mem)) { mem });
  };

  public shared ({ caller }) func addQuote(author : Text, text : Text) : async () {
    let quote : Quote = {
      author;
      text;
    };
    quotes.add(quote);
  };

  public query ({ caller }) func getRandomQuote() : async Quote {
    if (quotes.isEmpty()) {
      Runtime.trap("No quotes available");
    };
    let quotesArray = quotes.toArray();
    quotesArray[0];
  };

  public shared ({ caller }) func addFunFact(fact : Text) : async () {
    funFacts.add(fact);
  };

  public query ({ caller }) func getRandomFunFact() : async Text {
    if (funFacts.isEmpty()) {
      Runtime.trap("No fun facts available");
    };
    let factsArray = funFacts.toArray();
    factsArray[0];
  };

  public shared ({ caller }) func addMessage(sender : Text, content : Text, timestamp : Text) : async () {
    let message : Message = {
      sender;
      content;
      timestamp;
    };
    messages.add(message);
  };

  public query ({ caller }) func getAllMessages() : async [Message] {
    messages.toArray();
  };

  public query ({ caller }) func getConversation() : async [Message] {
    messages.toArray();
  };
};
