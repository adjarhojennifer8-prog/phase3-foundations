import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OpportunityChat from "./OpportunityChat";

const mockSendMessage = vi.fn();
const mockStop = vi.fn();
const mockRegenerate = vi.fn();

let mockChatState = {
  messages: [],
  status: "ready",
  error: null,
};

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    ...mockChatState,
    sendMessage: mockSendMessage,
    stop: mockStop,
    regenerate: mockRegenerate,
  }),
}));

describe("OpportunityChat", () => {
  beforeEach(() => {
    mockChatState = {
      messages: [],
      status: "ready",
      error: null,
    };

    vi.clearAllMocks();
  });

  it("shows the first-run empty state", () => {
    render(<OpportunityChat />);

    expect(
      screen.getByText(
        /I'm an undergraduate looking for fully funded technology opportunities/i
      )
    ).toBeInTheDocument();
  });

  it("renders a user message", () => {
    mockChatState.messages = [
      {
        id: "1",
        role: "user",
        parts: [{ type: "text", text: "Find technology opportunities." }],
      },
    ];

    render(<OpportunityChat />);

    expect(screen.getByText("You")).toBeInTheDocument();
    expect(
      screen.getByText("Find technology opportunities.")
    ).toBeInTheDocument();
  });

  it("renders an assistant text response", () => {
    mockChatState.messages = [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "I found some opportunities for you.",
          },
        ],
      },
    ];

    render(<OpportunityChat />);

    expect(
  screen.getByRole("heading", { name: "Opportunity Assistant" })
).toBeInTheDocument();
    expect(
      screen.getByText("I found some opportunities for you.")
    ).toBeInTheDocument();
  });

  it("renders the searching state when tool input is available", () => {
    mockChatState.messages = [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "tool-searchOpportunities",
            state: "input-available",
            input: {
              field: "Technology",
              location: "Remote",
            },
          },
        ],
      },
    ];

    render(<OpportunityChat />);

    expect(
      screen.getByText("Searching opportunities")
    ).toBeInTheDocument();

    expect(screen.getByText(/Technology/)).toBeInTheDocument();
    expect(screen.getByText(/Remote/)).toBeInTheDocument();
  });

  it("renders opportunity results as cards", () => {
    mockChatState.messages = [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "tool-searchOpportunities",
            state: "output-available",
            output: {
              count: 1,
              opportunities: [
                {
                  id: "tech-001",
                  title: "Technology Innovation Internship",
                  type: "Internship",
                  field: "Technology",
                  location: "Remote",
                  funding: "Paid",
                  description:
                    "A remote opportunity for students and graduates interested in technology.",
                },
              ],
            },
          },
        ],
      },
    ];

    render(<OpportunityChat />);

    expect(
      screen.getByText("Opportunity search complete")
    ).toBeInTheDocument();

    expect(screen.getByText("1 found")).toBeInTheDocument();

    expect(
      screen.getByText("Technology Innovation Internship")
    ).toBeInTheDocument();

    expect(screen.getByText("Paid")).toBeInTheDocument();
  });

  it("renders a designed tool error state", () => {
    mockChatState.messages = [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "tool-searchOpportunities",
            state: "output-error",
            errorText: "Search service unavailable.",
          },
        ],
      },
    ];

    render(<OpportunityChat />);

    expect(
      screen.getByText("Opportunity search failed")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Search service unavailable.")
    ).toBeInTheDocument();
  });

  it("renders the pending Thinking state", () => {
    mockChatState.status = "submitted";

    render(<OpportunityChat />);

    expect(screen.getByText("Thinking...")).toBeInTheDocument();
  });

  it("renders the chat error and allows retry", () => {
    mockChatState.error = new Error("API failed");

    render(<OpportunityChat />);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    expect(
      screen.getByText("Something went wrong")
    ).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
      name: "Retry",
    });

    fireEvent.click(retryButton);

    expect(mockRegenerate).toHaveBeenCalledTimes(1);
  });
});
