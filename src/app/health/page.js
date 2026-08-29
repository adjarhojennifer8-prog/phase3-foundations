async function getHealthData() {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch health data')
  }

  return response.json()
}

export default async function HealthPage() {
  const data = await getHealthData()

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-primary">
        Health Check
      </h1>

      <p className="mt-4 text-muted">
        The health-check endpoint is responding and fetched data successfully.
      </p>

      <section className="mt-8 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold">
          Fetched Data
        </h2>

        <dl className="mt-4 space-y-3">
          <div>
            <dt className="font-medium">Post ID</dt>
            <dd>{data.id}</dd>
          </div>

          <div>
            <dt className="font-medium">Title</dt>
            <dd>{data.title}</dd>
          </div>
        </dl>
      </section>
    </main>
  )
}