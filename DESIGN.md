# Design direction

## Brief (2026-10-01 redesign)

Redesign the Tawqee by ForgRise website completely, using SignWell as inspiration for structure. Position Tawqee as SharePoint-first and approval-first, include its features and the security of its signatures, and clearly warn that it is not certificate-based signing and is meant for everyday documents. Use `assets/tawqee-modern.mp4` as the demo.

## What was borrowed from SignWell, and what wasn't

- Borrowed: a direct value statement with the product in view, feature tabs where each tab shows its own product view, a dedicated security section, and a comparison table.
- Not borrowed: customer logos, award badges, ratings, testimonials and usage statistics. Tawqee has none, and inventing them would be false. Compliance badges are replaced by an honest notice that this is not certificate-based signing, and the comparison table helps visitors choose Tawqee or a certificate-based service.

## Palette

- Night `#101A33`: demo and closing sections (matches the video's navy).
- Ink `#172033`: headings and text. Slate `#56627A`: supporting copy.
- Paper `#FFFFFF` and Mist `#EEF2F8`: surfaces and alternating sections.
- Signature blue `#2563EB`: Sign stages and primary actions (logo blue).
- Approval teal `#0F8A6C`: Approve stages and completion.
- Caution amber `#7A4A00` on `#FFF6E3`: used only for the signing-type notice.

Colour carries meaning: teal is Approve, blue is Sign, the same split as the app's stage colours.

## Type

One family: self-hosted Plus Jakarta Sans (variable, 200–800), the same family as the video. Headlines are 700 weight with tight tracking (−0.03 to −0.04em); body text is 17px at 1.6 line height, with lines kept under about 75 characters.

## Layout

```text
Logo / nav                                       Request a demo
Headline, lead, actions          [Animated approval route card]
------------------------------ night ------------------------------
Demo heading                                     short line
[ video 16:9                         ]   chapter buttons 0:05 ... 0:42
--------------------------------------------------------------------
Approval types heading           explanation
[ tab list ]   [ panel: product view + note ]
------------------------------ mist -------------------------------
Features: 8 items in a ruled 4-column list (no cards)
--------------------------------------------------------------------
Signing and security heading
[ amber notice: not certificate-based ]
Recorded | Checked | Limits
Comparison table
--------------------------------------------------------------------
FAQ intro | accordion
------------------------------ night ------------------------------
Closing line                                  Request a demo / email
Footer
```

Content is left-aligned throughout. Numbers appear only where content is a sequence: the route stops, the stage list and the video chapter times.

## Principles

- The one bold element is the hero route: on load the connectors fill teal, each approval ticks, the signature draws itself, and the status changes to Completed (about 4 seconds, once). Reduced motion shows the finished state. Nothing else animates on its own.
- Plain language, sentence case, no eyebrow labels, no arrows on buttons.
- Be candid about the signature type wherever signing is mentioned (hero aside, security section, FAQ).

## Review notes

- First pass: the route connector ran past the last stop. It was rebuilt as per-stop segments.
- On mobile, stage rows squeezed names onto two lines; the Approve/Sign switch now moves below the name.
- Checked in local headless Chromium at 1440 and 390 px (full-page) and with the tabs switched; no horizontal overflow at 1440, 1024, 768, 390 or 320 px.
