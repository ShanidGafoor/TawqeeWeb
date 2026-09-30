# Design direction

## Brief

Create a modern, approachable product website for Tawqee by ForgRise. Explain that the actual application runs in SharePoint. Make the supplied logo and demo useful without adding expensive decorative images.

## Palette and type

- Signature blue: `#2563EB` — actions and product accents.
- Ink: `#172033` — headlines and primary text.
- Slate: `#59657A` — supporting copy.
- Paper: `#FFFFFF` — document and primary surfaces.
- Workspace: `#F5F8FE` — section and workspace backgrounds.
- Complete: `#128469` — completion indicators, accompanied by text.

Self-hosted Plus Jakarta Sans connects the website to the supplied video. Large, tightly spaced headlines and quieter body copy establish hierarchy. The signature illustration has handwritten lettering as a specific reference to the product's purpose.

## Layout

```text
Logo / ForgRise                 Navigation / Request a demo
SharePoint context              Document with approval handoffs
Headline + explanation          and signature
Demo enquiry / Watch
                   Product capabilities
Short introduction              Video explanation
                  Large native demo player
Prepare                  Route                   Complete
Field preparation image          Request activity illustration
English / Arabic                 Revision handling
SharePoint workspace             Storage and processing explanation
Questions                        Expandable answers
                    Demo enquiry
Brand / contact / product disclaimer
```

## Review against the brief

Use the document handoff as the main visual, rather than a generic software dashboard or stock office photograph. The product's actual video supplies the main demonstration. Use numbering only for the three workflow steps. Avoid fake testimonials and metrics. Preserve a light visual rhythm with one blue closing section. The supplied media's legacy TQ icon remains visible inside the walkthrough; the website uses the new Tawqee logo.

## Implementation review

Reviewed local desktop and mobile screenshots. A decorative SharePoint orbit caused narrow-screen overflow; clipping is scoped to that section. No horizontal overflow in the final checks at 320, 390, 768, 1024 or 1440 pixels. Browser screenshots load lazy images before capture, while normal page visits retain lazy loading.
