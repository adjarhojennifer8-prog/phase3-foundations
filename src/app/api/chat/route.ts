import { convertToModelMessages, streamText } from "ai";
import { aiModel, systemPrompt } from "@/lib/ai";
import { searchOpportunities } from "@/lib/tools/searchOpportunities";

export const maxDuration = 30;

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length > MAX_MESSAGES) {
      return new Response(
        JSON.stringify({ error: "Conversation is too long." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    for (const message of messages) {
      const text = message?.parts
        ?.filter((part: { type?: string }) => part.type === "text")
        ?.map((part: { text?: string }) => part.text ?? "")
        ?.join("");

      if (text && text.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({ error: "Message is too long." }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    const result = streamText({
      model: aiModel,
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      tools: {
        searchOpportunities,
      },
      stopWhen: ({ steps }) => steps.length >= 3,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response(
      JSON.stringify({
        error: "Unable to generate a response right now.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}