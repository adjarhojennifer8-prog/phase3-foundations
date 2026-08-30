# Opportunity Finder

Opportunity Finder is a Next.js application that helps users discover scholarships, internships, fellowships, and competitions through an AI-powered conversational interface.

The application uses the AI SDK to stream Claude-compatible model responses and includes a server-side opportunity search tool that returns structured opportunity data which is rendered as interactive UI cards.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build the application for production:

```bash
npm run build
```

## AI Chat

The main AI interaction is implemented in:

```text
src/components/OpportunityChat.tsx
```

The server-side chat route is:

```text
src/app/api/chat/route.ts
```

The model configuration and system prompt are kept in:

```text
src/lib/ai.ts
```

The AI response streams to the client, with support for:

* Multiple conversation turns
* Thinking state before the first response token
* Token-by-token streamed responses
* Stop/cancel during generation
* Auto-scroll while the user remains at the bottom
* A "Jump to latest" control when the user scrolls upward
* Responsive chat layout for smaller screens

## FE-07: Opportunity Search Tool

FE-07 adds a server-side AI tool called:

```text
searchOpportunities
```

The tool is defined in:

```text
src/lib/tools/searchOpportunities.ts
```

The tool uses a Zod schema to define its input contract and an `execute` function to search the application's structured opportunity dataset.

### Tool Contract

**Name**

```text
searchOpportunities
```

**Purpose**

Search the structured opportunity dataset using optional career field, opportunity type, location, and funding preferences.

### Input Schema

```text
{
  field?: string
  type?: string
  location?: string
  funding?: string
}
```

All four fields are optional.

Examples:

```text
{
  "field": "Technology"
}
```

```text
{
  "type": "Internship",
  "location": "Remote"
}
```

```text
{
  "field": "Engineering",
  "funding": "Paid"
}
```

### Return Shape

The tool returns:

```text
{
  query: {
    field: string | null
    type: string | null
    location: string | null
    funding: string | null
  }

  count: number

  opportunities: Opportunity[]
}
```

Each opportunity has the following structure:

```text
{
  id: string
  title: string
  type: string
  field: string
  location: string
  funding: string
  description: string
}
```

## Tool Lifecycle UI

The chat component renders the tool lifecycle as distinct visual states.

### 1. Input Streaming

Shown while the tool input is being prepared:

```text
Preparing opportunity search
Getting the search criteria ready...
```

### 2. Input Available

Shown when the tool has received its search criteria:

```text
Searching opportunities
Technology · Remote
```

### 3. Output Available

Shown when the tool successfully completes.

The structured result is rendered as opportunity cards rather than a raw JSON response.

Each card displays:

* Opportunity type
* Funding
* Title
* Field
* Location
* Description

The result also displays the number of matching opportunities.

### 4. Output Error

If the tool execution fails, the UI renders a dedicated error state rather than crashing or displaying raw error data.

The error state provides a clear message explaining that the opportunity search could not be completed.

## Server-Side Security

The AI model configuration and API credentials remain server-side.

The browser communicates with:

```text
/api/chat
```

The API route executes the AI model and tools on the server. No API key is exposed in the client-side chat component.

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── globals.css
│   └── page.js
│
├── components/
│   └── OpportunityChat.tsx
│
└── lib/
    ├── ai.ts
    └── tools/
        └── searchOpportunities.ts
```

## Verification

The application was verified using:

```bash
npm run build
```

The production build completed successfully, including the dynamic chat API route:

```text
ƒ /api/chat
```

The chat was also tested locally using:

```bash
npm run dev
```

The `/api/chat` request returned successfully during streaming.

## FE-07 Deliverable

Preview:

```text
https://phase3-foundations.vercel.app/
```

Tool definition:

```text
src/lib/tools/searchOpportunities.ts
```

Chat component:

```text
src/components/OpportunityChat.tsx
```

API route:

```text
src/app/api/chat/route.ts
```
