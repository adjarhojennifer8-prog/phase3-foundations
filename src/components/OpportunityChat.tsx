"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";

type Opportunity = {
  id: string;
  title: string;
  type: string;
  field: string;
  location: string;
  funding: string;
  description: string;
};

function OpportunityCard({
  opportunity,
}: {
  opportunity: Opportunity;
}) {
  return (
    <article className="opportunity-card">
      <div className="opportunity-card-top">
        <span className="opportunity-type">{opportunity.type}</span>
        <span className="opportunity-funding">{opportunity.funding}</span>
      </div>

      <h4>{opportunity.title}</h4>

      <p className="opportunity-meta">
        {opportunity.field} · {opportunity.location}
      </p>

      <p>{opportunity.description}</p>
    </article>
  );
}

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
            Try: &quot;I&apos;m an undergraduate looking for fully funded
            technology opportunities.&quot;
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

                if (part.type.startsWith("tool-")) {
                  const toolPart = part as typeof part & {
                    state?: string;
                    input?: {
                      field?: string;
                      type?: string;
                      location?: string;
                      funding?: string;
                    };
                    output?: {
                      query?: {
                        field?: string | null;
                        type?: string | null;
                        location?: string | null;
                        funding?: string | null;
                      };
                      count?: number;
                      opportunities?: Opportunity[];
                    };
                    errorText?: string;
                  };

                  if (toolPart.state === "input-streaming") {
                    return (
                      <div className="tool-state tool-input-streaming" key={index}>
                        <span aria-hidden="true">◌</span>
                        <div>
                          <strong>Preparing opportunity search</strong>
                          <p>Getting the search criteria ready...</p>
                        </div>
                      </div>
                    );
                  }

                  if (toolPart.state === "input-available") {
                    return (
                      <div className="tool-state tool-input-available" key={index}>
                        <span aria-hidden="true">🔎</span>
                        <div>
                          <strong>Searching opportunities</strong>
                          <p>
                            {toolPart.input?.field || "All fields"}
                            {" · "}
                            {toolPart.input?.location || "All locations"}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  if (toolPart.state === "output-available") {
                    const opportunities =
                      toolPart.output?.opportunities ?? [];

                    return (
                      <div className="tool-result" key={index}>
                        <div className="tool-result-header">
                          <strong>Opportunity search complete</strong>
                          <span>
                            {toolPart.output?.count ?? 0} found
                          </span>
                        </div>

                        {opportunities.length > 0 ? (
                          <div className="opportunity-list">
                            {opportunities.map((opportunity) => (
                              <OpportunityCard
                                key={opportunity.id}
                                opportunity={opportunity}
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="tool-no-results">
                            No matching opportunities were found in the
                            current dataset.
                          </p>
                        )}
                      </div>
                    );
                  }

                  if (toolPart.state === "output-error") {
                    return (
                      <div className="tool-state tool-error" key={index}>
                        <span aria-hidden="true">⚠</span>
                        <div>
                          <strong>Opportunity search failed</strong>
                          <p>
                            {toolPart.errorText ||
                              "We couldn't complete the search. Please try again."}
                          </p>
                        </div>
                      </div>
                    );
                  }

                  return null;
                }

                return null;
              })}
            </div>
          </article>
        ))}

        {isSubmitted && (
          <div className="thinking" aria-live="polite">
            <span aria-hidden="true">•••</span>
            <span>Thinking...</span>
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