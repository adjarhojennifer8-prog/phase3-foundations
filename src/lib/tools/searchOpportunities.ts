import { tool } from "ai";
import { z } from "zod";

const opportunities = [
  {
    id: "eng-001",
    title: "Graduate Engineering Internship",
    type: "Internship",
    field: "Engineering",
    location: "UK",
    funding: "Paid",
    description:
      "An early-career engineering internship for graduates and recent students.",
  },
  {
    id: "eng-002",
    title: "Future Engineers Fellowship",
    type: "Fellowship",
    field: "Engineering",
    location: "UK",
    funding: "Fully funded",
    description:
      "A fellowship supporting emerging engineers through professional development.",
  },
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
  {
    id: "global-001",
    title: "Global Graduate Opportunity",
    type: "Competition",
    field: "Multiple fields",
    location: "International",
    funding: "Varies",
    description:
      "An opportunity for graduates to develop ideas and demonstrate their skills.",
  },
];

export const searchOpportunities = tool({
  description:
    "Search the Opportunity Finder's structured opportunity data using a career field, opportunity type, location, or funding preference.",

  inputSchema: z.object({
    field: z
      .string()
      .optional()
      .describe("The user's field of study or career area."),

    type: z
      .string()
      .optional()
      .describe(
        "The type of opportunity, such as internship, fellowship, scholarship, or competition."
      ),

    location: z
      .string()
      .optional()
      .describe("The user's preferred location, such as UK, Remote, or International."),

    funding: z
      .string()
      .optional()
      .describe(
        "The user's funding preference, such as fully funded, paid, or free."
      ),
  }),

  execute: async ({ field, type, location, funding }) => {
    const matches = opportunities.filter((opportunity) => {
      const fieldMatch =
        !field ||
        opportunity.field.toLowerCase().includes(field.toLowerCase());

      const typeMatch =
        !type ||
        opportunity.type.toLowerCase().includes(type.toLowerCase());

      const locationMatch =
        !location ||
        opportunity.location.toLowerCase().includes(location.toLowerCase());

      const fundingMatch =
        !funding ||
        opportunity.funding.toLowerCase().includes(funding.toLowerCase());

      return fieldMatch && typeMatch && locationMatch && fundingMatch;
    });

    return {
      query: {
        field: field ?? null,
        type: type ?? null,
        location: location ?? null,
        funding: funding ?? null,
      },
      count: matches.length,
      opportunities: matches,
    };
  },
});