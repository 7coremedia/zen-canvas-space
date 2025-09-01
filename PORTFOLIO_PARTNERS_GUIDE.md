# Portfolio Partners Guide

This guide explains how to use the new partner components for portfolio items.

## Overview

The portfolio system now supports two scenarios:

1. **Single Partner** - Simple "Follow" button (e.g., "By KING")
2. **Multiple Partners** - "Follow All" button with dropdown showing all collaborating brands

## How to Use

### For Multiple Partners (e.g., Periscope)

When a portfolio item involves multiple partners (like printing and marketing), use the multiple partners configuration:

```typescript
// In src/data/caseStudies.ts
{
  slug: "periscope",
  title: "Periscope", // This becomes the brand name displayed
  client: "Periscope",
  category: "Branding",
  year: "2024",
  tagline: "A beautiful and simple financial dashboard that educates while reporting.",
  cover: portfolio1,
  // Multiple partners configuration
  isMultiplePartners: true,
  partners: [
    {
      id: "1",
      name: "Brand Name", // Replace with actual brand name
      socialName: "Social name", // Replace with actual social handle
      socialLink: "https://instagram.com/thedrawingboard.ng", // Replace with actual social link
    },
    {
      id: "2", 
      name: "Another Brand",
      socialName: "@anotherbrand",
      socialLink: "https://instagram.com/anotherbrand",
    },
    // Add more partners as needed
  ],
  sections: [...],
}
```

### For Single Partner (e.g., "By KING")

When a portfolio item is created by a single partner, use the single partner configuration:

```typescript
// In src/data/caseStudies.ts
{
  slug: "luxury-fashion",
  title: "Reflection", // This becomes the partner name displayed
  client: "Elegance Couture",
  category: "Branding",
  year: "2023",
  tagline: "Redefining luxury fashion with timeless elegance and modern aesthetics.",
  cover: portfolio2,
  // Single partner configuration
  isMultiplePartners: false,
  singlePartner: {
    type: "By KING", // The type text (e.g., "By KING")
  },
  sections: [...],
}
```

## Components Created

### 1. MultiplePartnersHeader
- **File**: `src/components/case-study/MultiplePartnersHeader.tsx`
- **Features**: 
  - Shows brand name + "Multiple Partners" text
  - "Follow All" button with compact dropdown
  - Dropdown shows all partners with their images (no gray background)
  - Uses placeholder image from `/ig-img-place.svg` if no image provided
  - No duplicate titles - brand name appears only once beside the follow button

### 2. SinglePartnerHeader
- **File**: `src/components/case-study/SinglePartnerHeader.tsx`
- **Features**:
  - Shows partner name + "By KING" (or custom type) text
  - Simple "Follow" button without dropdown
  - Clean, minimal interface
  - No duplicate titles - partner name appears only once beside the follow button

## Customization

### Adding/Removing Partners

To add or remove partners from the dropdown, simply modify the `partners` array in the case study data:

```typescript
partners: [
  // Add new partner
  {
    id: "4",
    name: "New Brand",
    socialName: "@newbrand",
    socialLink: "https://instagram.com/newbrand",
  },
  // Remove partners by deleting their entries
]
```

### Social Links

Each partner can have a custom social link. Currently using Instagram as default:

```typescript
socialLink: "https://instagram.com/thedrawingboard.ng"
```

### Images

- If a partner has an `imageUrl`, it will be displayed
- If no `imageUrl` is provided, the placeholder from `/ig-img-place.svg` will be used
- You can import images from Instagram or use local images

## Current Examples

1. **Periscope** - Multiple partners (shows dropdown)
2. **Reflection** - Single partner ("By KING")
3. **Minimalist Logo** - Single partner ("By KING")

## Testing

Visit `/portfolio/periscope` to see the multiple partners dropdown in action.
Visit `/portfolio/luxury-fashion` to see the single partner interface.
