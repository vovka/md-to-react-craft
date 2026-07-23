const Privacy = () => (
  <main className="container mx-auto max-w-3xl px-4 py-12">
    <h1 className="mb-6 text-4xl font-bold">Privacy</h1>
    <p className="mb-4">
      This blog can use Google Analytics 4 for aggregate traffic and acquisition analytics and Microsoft
      Clarity for heatmaps and anonymous session analysis. Both are optional and remain disabled until you
      explicitly accept analytics.
    </p>
    <p className="mb-4">
      The blog does not intentionally send names, email addresses, authenticated identities, or other directly
      identifying information to analytics services. Test and production sites use separate analytics
      configurations.
    </p>
    <p className="mb-4">
      You can accept, reject, or revoke analytics from the Analytics preferences link in the footer. A Global
      Privacy Control signal keeps analytics disabled.
    </p>
    <p className="mb-6">
      GA4 user-level and event-level data retention is configured for 14 months. Clarity playback data is
      retained for 30 days; aggregated click and heatmap data and labeled or favorited sessions are retained for
      9 months.
    </p>
    <h2 className="mb-3 text-2xl font-semibold">Data controller and privacy contact</h2>
    <ul className="list-disc space-y-2 pl-6">
      <li>Data controller: Volodymyr Shcherbyna</li>
      <li>
        Privacy contact:{" "}
        <a className="underline" href="mailto:volodymyr@shcherbyna.me">
          volodymyr@shcherbyna.me
        </a>
      </li>
      <li>Effective date: July 23, 2026</li>
    </ul>
  </main>
);

export default Privacy;
