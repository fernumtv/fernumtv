import { siteConfig } from "@/config/site";

export function getHomeSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://fernum.online/#organization",
        "name": siteConfig.businessName,
        "url": "https://fernum.online",
        "email": siteConfig.contactEmail,
        "logo": "https://fernum.online/images/og-image.webp",
        "sameAs": []
      },
      {
        "@type": "WebSite",
        "@id": "https://fernum.online/#website",
        "name": siteConfig.name,
        "url": "https://fernum.online",
        "publisher": {
          "@id": "https://fernum.online/#organization"
        }
      },
      {
        "@type": "Service",
        "@id": "https://fernum.online/#service",
        "name": "Direct-Response Short-Form Video Ad Subscription",
        "provider": {
          "@id": "https://fernum.online/#organization"
        },
        "serviceType": "Video Production & Paid Social Creative",
        "offers": [
          {
            "@type": "Offer",
            "name": "Launch",
            "price": "499",
            "priceCurrency": "USD",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "499",
              "priceCurrency": "USD",
              "unitText": "MONTH"
            },
            "description": "1 finished video ad every month, 3 alternate hooks per ad, Full HD vertical 9:16 + square 1:1 + wide 16:9, 2 revision rounds."
          },
          {
            "@type": "Offer",
            "name": "Growth",
            "price": "799",
            "priceCurrency": "USD",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "799",
              "priceCurrency": "USD",
              "unitText": "MONTH"
            },
            "description": "2 finished video ads every month, 3 alternate hooks per ad, Full HD vertical 9:16 + square 1:1 + wide 16:9, 2 revision rounds."
          },
          {
            "@type": "Offer",
            "name": "Scale",
            "price": "1099",
            "priceCurrency": "USD",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "1099",
              "priceCurrency": "USD",
              "unitText": "MONTH"
            },
            "description": "3 finished video ads every month, 3 alternate hooks per ad, Full HD vertical 9:16 + square 1:1 + wide 16:9, 2 revision rounds."
          }
        ]
      }
    ]
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function getFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}
