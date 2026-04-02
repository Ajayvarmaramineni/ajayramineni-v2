// JSON-LD structured data for homepage — renders in <head> for Google rich results
export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":       "WebApplication",
        "@id":         "https://datastatz.com/#app",
        name:          "DataStatz",
        url:           "https://datastatz.com",
        description:
          "Upload a CSV or Excel file and get automatic EDA, data cleaning diagnostics, " +
          "scope assessment, and plain-English insights in under 10 seconds.",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price:   "0",
          priceCurrency: "USD",
        },
        audience: {
          "@type":        "Audience",
          audienceType:   "Students and Researchers",
        },
      },
      {
        "@type":       "Organization",
        "@id":         "https://datastatz.com/#org",
        name:          "DataStatz",
        url:           "https://datastatz.com",
        logo:          "https://datastatz.com/icon.svg",
        contactPoint: {
          "@type":            "ContactPoint",
          email:              "analytics@datastatz.com",
          contactType:        "customer support",
        },
      },
      {
        "@type":       "WebSite",
        "@id":         "https://datastatz.com/#website",
        url:           "https://datastatz.com",
        name:          "DataStatz",
        publisher: { "@id": "https://datastatz.com/#org" },
        potentialAction: {
          "@type":       "SearchAction",
          target:        "https://datastatz.com/upload",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
