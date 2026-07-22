const Privacy = () => (
  <main className="container mx-auto max-w-3xl px-4 py-12">
    <h1 className="mb-6 text-4xl font-bold">Privacy</h1>
    <p className="mb-4">This blog can use Google Analytics 4 for aggregate traffic and acquisition analytics and Microsoft Clarity for heatmaps and anonymous session analysis. Both are optional and remain disabled until you explicitly accept analytics.</p>
    <p className="mb-4">The blog does not intentionally send names, email addresses, authenticated identities, or other directly identifying information to analytics services. Test and production sites use separate analytics configurations.</p>
    <p className="mb-6">You can accept or reject analytics in the consent banner. Clearing this site's local storage makes the banner appear again.</p>
    <h2 className="mb-3 text-2xl font-semibold">Details to finalize before activation</h2>
    <ul className="list-disc space-y-2 pl-6">
      <li>Data controller: [DATA CONTROLLER NAME]</li>
      <li>Privacy contact: [CONTACT EMAIL]</li>
      <li>GA4 retention period: [RETENTION PERIOD]</li>
      <li>Clarity retention description: [RETENTION DESCRIPTION]</li>
      <li>Effective date: [EFFECTIVE DATE]</li>
    </ul>
  </main>
);

export default Privacy;
