# Opportunity Finder

Opportunity Finder is a Next.js application that helps people(students, early career professions and opportunity aspirants) discover scholarships, internships, fellowships, and competitions through an AI-powered conversational interface.

The application uses the Vercel AI SDK with Google's Gemini model. The AI assistant can understand a user's criteria and call a server-side opportunity search tool that returns structured opportunity data. Results are displayed as readable opportunity cards rather than raw tool output.

## Production

**Live application:**
https://phase3-foundations.vercel.app/

The production deployment provides the complete Opportunity Finder experience, including the AI chat, opportunity search tool, streaming responses, and responsive interface.

## Features

* Conversational AI opportunity discovery
* Scholarships, internships, fellowships, and competitions
* Structured opportunity search using an AI tool
* Streaming AI responses
* Thinking state while the assistant is generating
* Stop/cancel control during generation
* Automatic scrolling while the user remains at the bottom
* "Jump to latest" control when reviewing earlier messages
* Structured opportunity result cards
* Tool lifecycle states for searching and errors
* Responsive chat interface
* Keyboard-accessible primary flow
* Accessible streamed conversation output
* Server-side API credentials
* Input limits to reduce trivial API abuse

## Screenshots

### Lighthouse Before

### Lighthouse After

## Getting Started

### Prerequisites

* Node.js
* npm
* A Google Generative AI API key

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/adjarhojennifer8-prog/phase3-foundations.git
cd phase3-foundations
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```text
GOOGLE_GENERATIVE_AI_API_KEY=
```

The API key is used only by the server-side AI configuration.

Do not commit `.env.local` or expose the API key in client-side code.

The repository includes `.env.example` as a template.

### Run Locally

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Architecture

The application uses Next.js App Router with React and TypeScript.

```text
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── Navigation.js
│   ├── OpportunityChat.tsx
│   └── OpportunityChat.test.tsx
│
└── lib/
    ├── ai.ts
    └── tools/
        └── searchOpportunities.ts
```

### Request Flow

```text
User
  │
  ▼
OpportunityChat
  │
  ▼
/api/chat
  │
  ├── Input validation
  │
  ▼
AI SDK
  │
  ▼
Gemini model
  │
  ├── normal response
  │
  └── searchOpportunities tool
          │
          ▼
   Structured opportunity data
          │
          ▼
   Opportunity cards
```

##Main Components

OpportunityChat.tsx

The client-side chat interface. It handles user input, conversation rendering, streaming states, tool lifecycle states, retry behaviour, scrolling, and keyboard-accessible controls.

src/app/api/chat/route.ts

The server-side AI route. It receives chat messages, validates request size, converts messages for the AI SDK, runs the configured model and opportunity search tool, and streams the response back to the client.

src/lib/ai.ts

Contains the central AI model configuration and system prompt.

src/lib/tools/searchOpportunities.ts

Contains the structured opportunity dataset and the searchOpportunities AI tool. Zod is used to define the tool's input schema.

##AI Implementation

The application uses the Vercel AI SDK with Google's Generative AI model.

The model configuration is kept server-side:

src/lib/ai.ts

The API route connects the model to the structured search tool:

src/app/api/chat/route.ts

The system prompt instructs the assistant to:

* Help users clarify opportunity preferences.
* Use the opportunity search tool when appropriate.
* Reuse information already provided by the user.
* Ask concise follow-up questions when important criteria are missing.
* Avoid inventing opportunities.
* Clearly explain tool results.
* State when no matching opportunities exist.
* Treat the dataset as a demonstration dataset rather than a complete listing of current opportunities.
```

It uses a Zod input schema and searches a structured demonstration dataset.

Supported criteria include:

```text
field
type
location
funding
```

Example:

```text
{
  "field": "Technology",
  "type": "Internship",
  "location": "Remote",
  "funding": "Paid"
}
```

The tool returns the matching opportunities together with the original search criteria and result count.

The client renders these results as opportunity cards.

## Tool Lifecycle UI

The chat interface provides visual feedback throughout the tool lifecycle.

### Input Streaming

The user sees:

```text
Preparing opportunity search
Getting the search criteria ready...
```

### Input Available

The user sees:

```text
Searching opportunities
```

along with relevant search criteria.

### Output Available

Successful results are displayed as structured cards showing:

* Opportunity type
* Funding
* Title
* Field
* Location
* Description

### Output Error

If the tool fails, the interface displays a dedicated error state instead of exposing raw error information.

## Accessibility

Accessibility was evaluated as part of FE-10 using WAVE, Lighthouse, and manual keyboard testing.

WAVE reported:

* 0 errors
* 0 contrast errors
* 0 alerts
* AIM Score: 10/10

Lighthouse reported:

* Accessibility: 100/100
* Best Practices: 100/100
* SEO: 100/100

The chat conversation uses:

```text
role="log"
aria-live="polite"
aria-label="Conversation"
```

The chat input has an associated label, and the Stop button is keyboard reachable while the assistant is responding.

Manual keyboard testing verified that the primary chat interaction can be completed using keyboard navigation.

Full audit details are available in:

```text
AUDIT.md
```

## Performance

The Lighthouse mobile audit was performed using:

* Mobile emulation: Moto G Power
* Slow 4G throttling
* Chromium
* Lighthouse 13.4.1

The recorded after-audit performance result was:

| Metric                   | Result |
| ------------------------ | -----: |
| Performance              |     96 |
| Accessibility            |    100 |
| Best Practices           |    100 |
| SEO                      |    100 |
| First Contentful Paint   |  1.2 s |
| Largest Contentful Paint |  1.6 s |
| Cumulative Layout Shift  |      0 |

The earlier baseline performance score was lower, and the FE-10 audit documents the before/after measurements and screenshots.

Generated `.next` files were not manually edited because they are generated build artifacts.

## Production Security

The AI API route is handled server-side:

```text
/api/chat
```

The Google API key is stored in the server environment and is not exposed to the browser.

The chat route also applies input limits to reduce trivial abuse:

* Maximum conversation messages: 20
* Maximum text length per message: 4,000 characters
* Invalid request structures are rejected.
* Oversized requests return an HTTP 413 response.
* Invalid requests return an HTTP 400 response.
* Streaming requests have a maximum duration of 30 seconds.

These protections are intended to reduce unnecessary API usage and prevent simple oversized-request abuse. They are not a replacement for a full distributed rate-limiting system.

## Testing

The project uses Vitest and Testing Library.

Run the test suite:

```bash
npm test
```

Current component coverage includes:

* First-run empty state
* User messages
* Assistant responses
* Searching state
* Opportunity result cards
* Tool error state
* Thinking state
* Chat error and retry behaviour

The current test suite contains:

```text
1 test file
8 tests
8 passing
```

The project was also verified with:

```bash
npm run lint
npm test
npm run build
```

All three checks passed during final verification.

## Key Technical Decisions

### Next.js App Router

Next.js App Router was used to provide the application structure and server-side API route.

### Server-Side AI Route

AI model calls are performed through `/api/chat` rather than directly from the browser. This keeps the API credential server-side.

### AI Tool Calling

Opportunity discovery uses a structured tool rather than asking the model to invent or manually format opportunity records.

### Demonstration Dataset

The opportunity data is intentionally small and structured for the project. The AI assistant is explicitly instructed not to present it as a complete source of currently available opportunities.

### Input Protection

The chat endpoint limits message count and message size and has a maximum streaming duration to reduce unnecessary resource consumption.

### Accessibility

The chat was designed with semantic structure, labelled controls, live regions, keyboard accessibility, and explicit tool-state feedback.

## How AI Tools Built This

AI tools were used as development assistants throughout the project.

AI assistance was used for:

* Designing of the interface

**Example: Designing the Interface with AI Assistance**

One example of how I used AI during the project was when deciding how the opportunity results should be presented.

I had an initial idea for the interface based on a simple sketch of the layout. I wanted the opportunity information to be presented in separate **box/card-style sections** rather than as a plain list of text. The intention was to make each opportunity easier to scan and visually separate the important information.

I used AI to help translate that visual idea into a working interface.

An example of the prompt I used was:

I want the opportunities on the page to be displayed in separate boxes/cards

rather than just appearing as a list. I want the layout to feel clean,

organised and easy to scan. How can I structure the UI to achieve this?

\

AI suggested possible card structures and CSS approaches. I reviewed the suggestions against my original idea and adapted them to fit the application.

The final cards were structured to separate information such as:

Opportunity type

Funding

Title

Field

Location

Description

This approach was not simply copied from the AI response. I used the suggestions to explore implementation options and then decided how the final layout should look and behave.

The process was:

My initial sketch / idea

        ↓

Describe the visual idea to AI

        ↓

AI suggests possible implementation

        ↓

Review the suggestions

        ↓

Adapt the implementation

        ↓

Test the interface

        ↓

Refine the final design

\

This was representative of how I used AI throughout the project: I generally started with a requirement, idea, problem, or design direction and used AI to help translate it into a technical implementation or explore possible solutions. It was also used in:

* Helping me figure out a way to get around issues sighted during manual test run. For example, during one of the manual testing, I noticed that chat box was not pinned to the background; hence, the stop/send button always moved during response which mad it difficult for users to interact properly with the chat box. I used AI's assistance to figure out how to make it work in a way that problem was eliminated. 

**ME:** “The streamed AI response needs to be accessible and the Stop button needs to be reachable by keyboard.”

→ AI helped me identify appropriate `aria-live`, `role="log"`, labels, and keyboard behaviour.

* Helping define the application's component and file structure.

* Generating and explaining React and Next.js code.

* Implementing the AI chat interface.

* Integrating the AI SDK and Gemini.

* Designing the server-side opportunity search tool.

* Troubleshooting JavaScript, TypeScript, Next.js, ESLint, and build errors.

* Improving responsive layout and visual presentation.

* Suggesting accessibility improvements.

* Creating and reviewing automated tests.

* Interpreting Lighthouse and WAVE findings

AI-generated code was not treated as automatically correct. The implementation was reviewed, tested, linted, built, and manually corrected during development. 

Examples of development prompts included:

```text
Help me build the Opportunity Finder chat interface using Next.js.

How should I implement streaming responses with the AI SDK?

Help me create a server-side opportunity search tool.

How can I render tool results as structured opportunity cards?

Help me make streamed assistant output accessible.

How can I protect the AI route against oversized requests.
```

## Project Verification

Final verification commands:

```bash
npm run lint
npm test
npm run build
```

All checks passed.

Production application:

```text
https://phase3-foundations.vercel.app/
```

Repository:

```text
https://github.com/adjarhojennifer8-prog/phase3-foundations
```

## FE-11 Deliverable

**Production URL**

https://phase3-foundations.vercel.app/

**Final README**

This file.

**Key documentation**

```text
AUDIT.md
README.md
```

**Security**

```text
src/app/api/chat/route.ts
```

**AI configuration**

```text
src/lib/ai.ts
```

**Opportunity search tool**

```text
src/lib/tools/searchOpportunities.ts
```

**Chat interface**

```text
src/components/OpportunityChat.tsx
```
