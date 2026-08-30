import { convertToModelMessages, streamText } from "ai";
import { aiModel, systemPrompt } from "@/lib/ai";
import { searchOpportunities } from "@/lib/tools/searchOpportunities";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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