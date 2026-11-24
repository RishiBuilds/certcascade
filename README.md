<div align="center">

<img src="certcascade/public/logo.svg" alt="CertCascade logo" width="76" />

# CertCascade

**Generate bulk certificates, report cards, and ID cards in seconds — upload a template, add a CSV, download a ZIP. Free, no sign-up, runs entirely in your browser.**

Upload a design once, connect a CSV, and download hundreds of personalized documents in one go.

<!-- Off Campus verification: 9M445N -->

</div>

---

## How it works

1. **Upload your template.** Add a PNG or JPG of your certificate, report card, or ID design.
2. **Add your data.** Upload a CSV (up to 5 MB) or paste it in. The first row holds the column names, and each row after it becomes one document.
3. **Place your fields.** Click a column to add it to the design, then drag it into position. Set the font, size, color, bold, italic, underline, and exact position for each field.
4. **Preview.** Step through your rows to see how each document will look with real data. Edit any cell in the built-in table if something needs fixing.
5. **Generate.** CertCascade renders every row onto your template and downloads everything as a single ZIP.

Everything runs in your browser, so your template and data are never sent to a server.

## Tech stack

- [Next.js](https://nextjs.org) and [React](https://react.dev) with TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- HTML Canvas for rendering
- [PapaParse](https://www.papaparse.com) for CSV parsing
- [JSZip](https://stuk.github.io/jszip/) for bundling downloads

## Getting started

```bash
git clone https://github.com/RishiBuilds/certcascade.git
cd certcascade
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

<div align="center">

Built by [✦ RISHI](https://github.com/RishiBuilds)

[X (@rishitwts\_)](https://x.com/rishitwts_) · [rishi.chaurasia.dev@gmail.com](mailto:rishi.chaurasia.dev@gmail.com)

</div>
