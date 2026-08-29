"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function OpportunityChat() {
  const { messages, sendMessage, status, stop } = useChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const isStreaming = status === "streaming";
  const isSubmitted = status === "submitted";

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container || !isAtBottom) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isAtBottom]);

  function handleScroll() {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsAtBottom(distanceFromBottom < 80);
  }

  function jumpToLatest() {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });

    setIsAtBottom(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isStreaming || isSubmitted) {
      return;
    }

    setInput("");

    await sendMessage({
      text: trimmedInput,
    });
  }

  return (
    <section aria-labelledby="assistant-heading" className="chat">
      <header className="chat-header">
        <h2 id="assistant-heading">Opportunity Assistant</h2>
        <p>
          Tell me what kind of scholarship, internship, fellowship, or
          competition you are looking for.
        </p>
      </header>

      <div
        ref={messagesContainerRef}
        className="chat-messages"
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 && (
          <p className="chat-empty">
            Try: “I&apos;m an undergraduate looking for fully funded
            technology opportunities.”
          </p>
        )}

        {messages.map((message) => (
          <article
            key={message.id}
            className={`message ${
              message.role === "user" ? "message-user" : "message-assistant"
            }`}
          >
            <strong>
              {message.role === "user" ? "You" : "Opportunity Assistant"}
            </strong>

            <div>
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return <p key={index}>{part.text}</p>;
                }

                return null;
              })}
            </div>
          </article>
        ))}

        {isSubmitted && (
          <div className="thinking" aria-live="polite">
            <span aria-hidden="true">•••</span>
            <span>Thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {!isAtBottom && messages.length > 0 && (
        <button
          type="button"
          className="jump-button"
          onClick={jumpToLatest}
        >
          Jump to latest
        </button>
      )}

      <form className="chat-form" onSubmit={handleSubmit}>
        <label htmlFor="chat-input">Message</label>

        <textarea
          id="chat-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Tell me what you're looking for..."
          rows={3}
          disabled={isStreaming || isSubmitted}
        />

        {isStreaming || isSubmitted ? (
          <button type="button" onClick={stop}>
            Stop
          </button>
        ) : (
          <button type="submit" disabled={!input.trim()}>
            Send
          </button>
        )}
      </form>
    </section>
  );
}