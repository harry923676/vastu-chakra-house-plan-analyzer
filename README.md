# Vāstu Chakra — House Plan Analyzer

> **Authentic, survey-grade, bilingual (English/Hindi) Vāstu Chakra house plan analyzer with 0.1° compass precision, deterministic polygon zoning, verified classical citations, and feasible architectural remedies.**

---

## 🌐 Live URLs

- **Vercel Production App**: [https://vastu-chakra-house-plan-analyzer.vercel.app](https://vastu-chakra-house-plan-analyzer.vercel.app)
- **Vercel Project URL**: [https://vastu-chakra-house-plan-analyzer-im5g97gua-pawanpaji.vercel.app](https://vastu-chakra-house-plan-analyzer-im5g97gua-pawanpaji.vercel.app)
- **AI Studio Live App**: [https://ais-pre-y44jdy6a57jtvk5whfew5x-279333895425.asia-southeast1.run.app](https://ais-pre-y44jdy6a57jtvk5whfew5x-279333895425.asia-southeast1.run.app)
- **AI Studio Development Preview**: [https://ais-dev-y44jdy6a57jtvk5whfew5x-279333895425.asia-southeast1.run.app](https://ais-dev-y44jdy6a57jtvk5whfew5x-279333895425.asia-southeast1.run.app)

---

## 🚀 Publish to GitHub & Vercel in 2 Minutes

### Step 1: Push to your GitHub Repository

1. Create a new repository on your GitHub account (e.g., named `vastu-chakra-analyzer`):
   - Go to [https://github.com/new](https://github.com/new)
   - Set the repository name to `vastu-chakra-analyzer` (Public or Private)
   - Do **not** initialize with a README (this repository already has one ready!)

2. From your terminal (or from this app directory), run:

```bash
# Add your GitHub repository as the origin remote (replace with your GitHub username)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/vastu-chakra-analyzer.git

# Push the main branch
git branch -M main
git push -u origin main
```

---

### Step 2: Publish on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Import Git Repository"** and select `vastu-chakra-analyzer`.
3. Vercel will automatically detect **Vite** as the framework using the included `vercel.json`.
4. Click **Deploy**!
5. In ~30 seconds, Vercel will generate your live production URL (e.g., `https://vastu-chakra-analyzer.vercel.app`).

---

## 🛠 Features & Capabilities

- **Surveying Precision (0.1° step)**: Continuous 0°–359.9° circular compass dial, drag-to-rotate needle, and micro-adjust buttons (`±0.1°`, `±1.0°`).
- **True North & Magnetic Declination**: East-positive geodetic correction based on NOAA World Magnetic Model data.
- **Outward Door-Facing Vector**: Calculates outward normal vectors to doorway planes with inward/outward flip.
- **Multiple Zoning Frameworks**:
  - 16 Angular Zones (22.5° each)
  - 8 Directions (Aṣṭa-Dikpāla 45° each)
  - 9×9 Vāstu Puruṣa Maṇḍala Grid (81 padas with central 3×3 Brahmasthāna)
- **Authentic Citations Registry**: Cites *Mayamatam*, *Mānasāra*, *Samarāṅgaṇa Sūtradhāra*, *Bṛhat Saṃhitā*, and Bureau of Indian Standards **NBC 2016**.
- **3-Tier Responsible Remedies**:
  - Class A: Practical architectural & ventilation fixes (daylight factor, mechanical exhaust, plumbing traps, fire safety)
  - Class B: Traditional spatial & furniture reallocations (headboard South/East, fire-water divider)
  - Class C: Transparently labeled optional symbolic folklore
- **Bilingual English & Hindi (हिन्दी)**: Complete UI and reporting localization.
- **Printable A4 Report**: Print-ready styling with survey parameters, room distribution table, prioritized remedies, and legal disclaimers.

---

## 🧪 Unit Tests

Run the built-in deterministic geometry and rule unit tests:

```bash
npx --yes tsx --test src/engine/engine.test.ts
```

All 11 tests pass covering angle normalization, declination, Shoelace polygon area, centroid moments, ray-casting sector intersection, outward normal vectors, and Brahmasthāna intersection.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```
