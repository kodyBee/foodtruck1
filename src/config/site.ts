export const siteConfig = {
  name: "Crown Majestic Kitchen",
  description: "Experience gourmet street food with crown-worthy presentation",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/truckpic2.jpg",
  links: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
  },
  contact: {
    email: "contact@crownmajestic.com",
    phone: "(555) 123-4567",
  },
} as const;
