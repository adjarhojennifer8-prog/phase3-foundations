import OpportunityChat from "@/components/OpportunityChat";

const categories = [
  {
    title: "Scholarships",
    description: "Funding opportunities for students at different education levels.",
  },
  {
    title: "Internships",
    description: "Opportunities to gain practical experience and build your career.",
  },
  {
    title: "Fellowships",
    description: "Programs for learning, leadership, research, and professional growth.",
  },
  {
    title: "Competitions",
    description: "Challenges and competitions for showcasing your skills and ideas.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Opportunity Finder
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find opportunities that move you forward.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600">
            Discover scholarships, internships, fellowships, and competitions
            in one place. Use the AI assistant to explain what you are looking
            for and narrow down your options.
          </p>
        </header>

        <section
          aria-labelledby="categories-heading"
          className="mb-12"
        >
          <h2
            id="categories-heading"
            className="mb-5 text-2xl font-semibold"
          >
            Explore opportunities
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <article
                key={category.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{category.title}</h3>

                <p className="mt-2 text-zinc-600">
                  {category.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <OpportunityChat />
      </div>
    </main>
  );
}