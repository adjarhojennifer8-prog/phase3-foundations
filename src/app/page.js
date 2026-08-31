
import Image from "next/image";
import OpportunityChat from "@/components/OpportunityChat";

const categories = [
  {
    title: "Scholarships",
    description:
      "Funding opportunities for students at different education levels.",
     },
  {
    title: "Internships",
    description:
      "Opportunities to gain practical experience and build your career.",
      },
  {
    title: "Fellowships",
    description:
      "Programs for learning, leadership, research, and professional growth.",
  },
  {
    title: "Competitions",
    description:
      "Challenges and competitions for showcasing your skills and ideas.",
      },
];

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed px-6 py-12 text-zinc-900"
      style={{ backgroundImage: 'url("/images/white background.jpg")' }}
    >
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 overflow-hidden rounded-3xl border border-[#ddd6fe] bg-white/90 p-8 text-center shadow-sm backdrop-blur-sm sm:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2 md:text-left">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#6d28d9]">
                Opportunity Finder
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-[#4c1d95] sm:text-5xl">
                Find opportunities that move you forward.
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
                Discover scholarships, internships, fellowships, and
                competitions in one place. Use the AI assistant to explain
                what you are looking for and narrow down your options.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#ddd6fe] shadow-sm">
              <Image
                src="/images/site.jpeg"
                alt="Students celebrating a scholarship award at a university"
                width={800}
                height={500}
                className="h-64 w-full object-cover"
                priority
              />
            </div>
          </div>
        </header>

        <section
          aria-labelledby="categories-heading"
          className="mb-12"
        >
          <div className="mb-5 rounded-2xl border border-[#ddd6fe] bg-white/90 p-5 shadow-sm backdrop-blur-sm">
            <h2
              id="categories-heading"
              className="text-2xl font-semibold text-[#4c1d95]"
            >
              Explore opportunities
            </h2>

            <p className="mt-2 text-zinc-600">
              Explore different paths and find an opportunity that matches
              your goals.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {categories.map((category) => (
              <article
                key={category.title}
                className="overflow-hidden rounded-2xl border border-[#ddd6fe] bg-white/95 shadow-sm backdrop-blur-sm"
              >
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.alt}
                    width={800}
                    height={400}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#4c1d95]">
                    {category.title}
                  </h3>

                  <p className="mt-2 leading-relaxed text-zinc-600">
                    {category.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12 overflow-hidden rounded-3xl border border-[#ddd6fe] bg-white/90 shadow-sm backdrop-blur-sm">
          <div className="grid items-center md:grid-cols-2">
            <div className="p-8 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#6d28d9]">
                Your next step
              </p>

              <h2 className="mt-2 text-3xl font-bold text-[#4c1d95]">
                Keep moving toward your goals.
              </h2>

              <p className="mt-4 leading-relaxed text-zinc-600">
                Whether you are looking for funding, experience, professional
                development, or a chance to showcase your skills, start by
                telling the Opportunity Assistant what you need.
              </p>
            </div>

            <Image
              src="/images/download.jpeg"
              alt="Person walking along a path toward a bright destination"
              width={800}
              height={500}
              className="h-64 w-full object-cover md:h-full"
            />
          </div>
        </section>

        <OpportunityChat />
      </div>
    </main>
  );
}