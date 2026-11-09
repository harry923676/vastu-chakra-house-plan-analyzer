# MASTER PROMPT — Authentic Vāstu Chakra House-Plan Analyzer

Act as a senior full-stack engineer, architectural-plan computer-vision specialist, computational geometry engineer, UX designer, and rigorous researcher of traditional Indian Vāstuśāstra. Design and build a **production-quality, responsive, bilingual (English/Hindi) web application** named **“Vāstu Chakra — House Plan Analyzer.”** The user must be able to upload a house floor plan, align it precisely to geographic north, adjust the house-facing angle to a fraction of a degree, visually inspect a configurable Vāstu Chakra, review room-by-room findings, and obtain **specific, feasible, responsibly sourced remedies** for an existing house.

**Non-negotiable honesty rule:** Vāstu is a traditional architectural and cultural system. Do not claim that a ritual, object, color, metal strip, pyramid, mirror, or direction change is scientifically proven to cure illness, create wealth, fix relationships, or guarantee results. Keep (a) documented classical prescriptions, (b) contemporary Vāstu interpretations, and (c) measurable architectural improvements separate. Cite actual passages where available; mark unverified claims as unverified. The word “effective” must refer to concrete, verifiable changes (e.g., improved airflow or access) unless high-quality evidence supports more.

## 1. Required end-to-end experience

Create a complete working application, not a landing-page mockup. The main workflow is:

1. **Create project:** project name, address/location (optional), residential/commercial, existing/proposed construction, plot dimensions, floor count, construction constraints, budget, preferred language, and tradition/profile selection. Location should be used for magnetic declination only with consent.
2. **Upload floor plan:** drag-and-drop PDF, PNG, JPEG, WebP, and, if the selected stack supports reliable parsing, SVG/DXF. For multi-page PDFs select the relevant page/floor. Preserve the original uploaded file and never silently crop the building. Show thumbnail and page selection, upload progress, file limits, and errors.
3. **Calibrate the drawing:** correct skew/perspective if necessary; scale from a known dimension; draw editable plot boundary, building footprint, north reference, door/opening positions, walls, room polygons, and optional setbacks/balconies/courtyards. Auto-detect rooms and OCR labels if feasible, but **require user confirmation**. Every recognized item must be adjustable, deletable, and addable manually.
4. **Set orientation and exact facing:** the user specifies true north or magnetic north, then aligns the plan. Provide a highly visible **0°–359.9° compass**, clockwise bearing convention, numeric field (0.1° precision or better), slider, fine +/- 0.1° and +/- 1° buttons, drag-to-rotate north pointer, and presets (N/E/S/W and intercardinals). Provide “measured reading” and “uncertainty ± degrees” inputs. Provide an independently labeled **main-entrance outward-facing bearing** and distinguish it from the *north arrow*, *road direction*, and *long axis of the building*.
5. **Choose analysis mode:** 8 directions, 16 angular zones, and a properly sourced Vāstu Puruṣa Maṇḍala grid (e.g., 9×9 where applicable). Optionally display perimeter-door *padas* only when a particular traditional mapping and partition method have been verified. Do not misleadingly treat 32 perimeter door padas as the same thing as 32 equally spaced radial sectors.
6. **Explore interactive overlay:** superimpose the chakra on the original plan, set opacity and center, hide/show boundaries, switch floor, click zones or rooms to inspect annotations, and watch analysis update immediately whenever alignment, geometry, zone mode, or entrance changes.
7. **Analyze:** validate inferred room types and positions; show observations, conflicts, uncertainty, possible improvements, room-by-room rationale, and citations; give actionable remedies prioritized by feasibility, safety, cost, reversibility, and actual supporting evidence.
8. **Compare:** save original orientation, test alternative angles using a before/after view, display newly crossed zone boundaries, and create a proposed action plan. Clearly distinguish physically rotating a drawing for **measurement** from actually rotating or reconstructing the house.
9. **Export:** create a print-ready, searchable A4 PDF report; annotated high-resolution PNG; JSON/CSV findings; and an editable saved project. Do not crop the uploaded plan; include a legend, scale, north arrow, input assumptions, sources, confidence, and revision history.

## 2. Exact facing and compass mathematics — critically important

- Use surveying/navigation convention: **0° = true north, 90° = east, 180° = south, 270° = west; increase clockwise**. Normalize all inputs modulo 360, including negative angles and 360°.
- A door’s “facing” is the **outward normal to the selected main entrance**, not the direction from the building center to its centroid. Let the user flip the inward/outward normal and verify the side leading outside. For a recessed or angled entrance, use the actual doorway plane, not an arbitrary wall of the bounding box.
- Separate **plan rotation**, **north alignment**, and **door-facing bearing**. Store one coherent geometric reference: if the user changes a measured door bearing, recompute alignment only when the entrance vector is known and explicitly linked; otherwise flag the fields as independent/underdetermined. Never allow silently inconsistent orientations.
- The image coordinate system is x-right/y-down. Define image-up’s true bearing `beta` and calculate any point’s bearing from the selected center by `normalize360(beta + atan2(dx, -dy) * 180 / PI)`, where `dx = x - centerX`, `dy = y - centerY`. Document and unit-test all sign and coordinate conventions. Convert angular boundaries into plan-space rays using this same transform.
- Magnetic compass bearings and true bearings differ by **local magnetic declination**. If a location and measurement date are supplied, offer a verified geomagnetic-model conversion; show model, date and calculated declination. If not available, ask for a user-entered correction. With east-positive declination, `trueBearing = normalize360(magneticBearing + declination)`. Do not invent declination or claim phone sensors are survey-grade. Allow manual correction near steel/reinforced concrete or electromagnetic interference.
- Show one visible summary: **North reference / main entrance facing / magnetic correction / angle uncertainty / chosen center**.
- Let users shift angle continuously with the compass slider and enter exact degrees, with immediate rerender/reanalysis. Add snap-to-cardinal as **optional**, off by default. Never round the analysis angle to 45° or 22.5° internally.
- For generic 8-zone radial mode, use sectors of 45° centered on N, NE, E, SE, S, SW, W, NW. For generic 16-zone mode, use 22.5° centered on N, NNE, NE, ENE, E, ESE, SE, SSE, S, SSW, SW, WSW, W, WNW, NW, NNW. Mark both as **analysis conventions**, not automatically as a specific classical scripture’s 16-zone map. A point exactly on a boundary must receive an explicit tie/boundary flag, not an arbitrary unexplained assignment.
- Provide plots of angular uncertainty: when the bearing is ±2°, distinguish **stable findings** from those sensitive to this margin. Recompute findings at the limits (and at relevant crossed boundaries), not only the center bearing.

## 3. Robust floor-plan analysis and user corrections

- Implement zoom, pan, rotate view, rulers, snapping, undo/redo, keyboard shortcuts, high-DPI rendering, and touch-friendly handles. Preserve original aspect ratio and raw pixels.
- Mark building footprint and **plot boundary separately**. Let the user switch among plot centroid, built-up footprint centroid, a manually selected reference point, and any source-specific center definition. Show how different center choices affect results. For concave or irregular footprints, support polygon area centroids, holes, and multi-component shapes; do not default silently to the rectangle center.
- Define/edit room polygons and labels: main door, secondary entrances, living room, kitchen, master/other bedrooms, pooja/meditation space, toilets, baths, staircase, lift, store, garage, balconies, utilities, septic tank, underground/overhead water tank, borewell, fireplace/heating, courtyard, garden, windows, and unknown areas. A room can span multiple directions; report area-overlap percentages rather than assigning the entire room to its center point.
- If dimensions are unknown, all positions are relative to the image; explain that physical areas cannot be inferred. If OCR/computer vision is uncertain, display confidence and invite manual correction. Do not invent walls or doors hidden in an ambiguous sketch.
- Support irregular plots, diagonal entrances, shared walls, duplexes, apartments where the plot is not under user control, flats whose north differs from building axis, and multiple floors with shared orientation but independent room geometry.
- Treat central Brahmasthan/maṇḍala cells according to the explicitly selected grid and verified tradition; do not assume that every room intersecting the geometrical center is automatically a “defect.”
- Geometry should use deterministic polygon clipping/intersection and point-on-segment detection. Avoid judging room location from OCR label text placement alone.

## 4. Authentic source and rule engine (no invented authority)

The program must maintain a **versioned, inspectable rule and remedy database**, not a loose set of AI-generated claims. Seed only claims that are genuinely verified. Research the following classical works *where directly relevant to a rule*: **Mayamatam/Mayamata**, **Mānasāra**, **Samarāṅgaṇa Sūtradhāra**, and relevant chapters of **Bṛhat Saṃhitā**. Do **not** assume these texts agree, discuss every modern household feature, or support the fashionable 16-zone and 32-gate schemes. Provide a "tradition/profile" switch, preserve differences, and say “No verified classical rule available” when necessary.

For **every classical rule or remedy**, store:

- unique ID; exact claim in plain language; applicability (house/temple/site, region, tradition, construction stage, plan type);
- text title, original language, editor/translator/edition, chapter/verse/section/page, original excerpt **only if verified**, faithful translation or paraphrase, stable source URL, last verification date, and a quotation-permission flag;
- geometry trigger, directional range or actual perimeter-pada definition, center reference, exceptions, rule version, and severity rubric;
- whether the source explicitly recommends an intervention or the proposed intervention is a **modern extrapolation**;
- source confidence and evidence class: **Classical text verified**, **scholarly interpretation**, **contemporary practitioner guidance**, **building-science/code supported**, or **unverified assertion**.

Include an admin/reviewer workflow to add, approve, revise, retract, or disable rules. Each rule must pass source verification before being used in high-confidence recommendations. Present multiple interpretations side by side when they conflict; never invent Sanskrit ślokas or precise chapter numbers. Use AI for OCR, summarization, and explanations **only after** grounding it in rule records. Reject unsourced hallucinated references and label unresolved ambiguity.

For physical modifications, separately consult current applicable local building regulations and licensed professionals. Use the **Bureau of Indian Standards National Building Code** for relevant aspects such as lighting/ventilation, structural, fire, plumbing and accessibility; do **not** mislabel engineering provisions as ancient Vāstu rules. Provide region/jurisdiction caveats. Cite official technical sources and distinguish code recommendations from binding local law.

Initial trustworthy source entry points (verify exact passages and editions before claiming a specific rule):

1. IGNCA — *Mayamatam: Treatise of Housing, Architecture and Iconography*: https://ignca.gov.in/mayamatam/
2. IGNCA — *Kalāmūlaśāstra Database*, including classical architecture titles: https://ignca.gov.in/divisionss/kalakosa/kalamulasastra/kalamulasastra-database/
3. IGNCA — *Mānasāra*, digitized architectural text/translation listing: https://ignca.gov.in/Asi_data/22949.pdf
4. IGNCA — *Texts on Architecture & Sculpture*: https://ignca.gov.in/online-digital-resources/books/kalamulasastra-series/texts-on-architecture-sculpture/
5. BIS — *National Building Code of India*: https://www.bis.gov.in/standards/national-building-code/?lang=en
6. NOAA NCEI — *Magnetic Declination*: https://www.ncei.noaa.gov/products/magnetic-declination

## 5. Clear, actionable, honestly labeled remedy engine

After identifying a finding, show at least the following when applicable:

**Problem observed** → exact room/entrance/polygon → directional zone(s) with overlap percentages → angle and center used → source/rule → **why the app flags it** → uncertainty or conflicting sources → **feasible options** → cost/effort/risk → expected *measurable* change → who should implement it → verification checklist.

Implement three separate remedy categories:

**A. Practical architectural improvements (first priority):** improve daylight, airflow, moisture control, drainage, safe water storage, cleanliness, accessibility, fire safety, thermal comfort, privacy, usable circulation, and room function when these actual conditions are observed. Examples: remove an obstruction in an exit path; improve natural/assisted ventilation after assessing openings and outdoor air quality; seal a plumbing leak; fix drainage slope; add shading for excessive solar heat. Cite technical guidance; never pretend an uploaded plan alone confirms a leak, poor air quality, weak structure, or noncompliance.

**B. Traditionally prescribed Vāstu adjustments:** propose a shift in actual room function, furniture arrangement, room use, entry location, or spatial layout **only when the chosen source supports the premise and the geometry warrants it**. Always specify if the intervention itself is traditional rather than empirically proven. A large renovation must be a conditional option requiring professional design, never an automatic recommendation.

**C. Symbolic/ritual/contemporary practices:** optionally show faith-based practices and commonly marketed items **only in a separate, opt-in section**. Disclose when no classical textual support or reliable evidence exists. Do not promote costly crystals, pyramids, metallic strips, mirrors, colors, yantras, mantras, demolitions, or product purchases as guaranteed corrections. Do not use fear-driven language or suggest a person’s illness, death, infertility, financial loss, or marital difficulty is caused by an unverified “Vāstu defect.”

For each option, create fields: `title`, `category`, `exact_location`, `steps`, `materials`, `approximate_cost_band`, `estimated_effort`, `reversible`, `needs_professional`, `safety_notes`, `traditional_source_ids`, `building_science_source_ids`, `evidence_class`, `expected_outcome`, `how_to_verify`, `before_after_measurement`, and `confidence`. Show **Do now / Low-cost change / Professional assessment / Major renovation / Optional symbolic practice**. Offer “not enough information” or “no supported remedy” where honest.

Include a **before/after action checklist** where users confirm what they actually changed and can log measurements, photos, costs, and dates. No promise of wealth, health, or astrological effects. If an issue relates to an unsafe structural, electrical, fire, gas, or sanitation condition, clearly prioritize a qualified professional and applicable safety code over any directional prescription.

## 6. Transparent assessment, scoring, and report

- Display a **Vāstu observation summary**, not an objectively validated “luck”, “health”, “prosperity”, or “destiny” score. If offering an optional compliance score, name it **“selected rule-set alignment index”**, show exact formula, covered rules, weighting, missing inputs, and sensitivity. Never imply that a score predicts real-world outcomes.
- List each room’s area percentage in 8/16 zones, predominant zone where meaningful, center overlap, applicable rule IDs, source disputes, and confidence.
- Evaluate main and secondary entrances separately. For door padas, require perimeter intersection and the actual source-specific subdivision scheme; never infer padas from a radial wedge alone.
- A finding card must offer **“Show on plan”**, **“Why?”**, **“Original source”**, **“Possible remedy”**, **“Mark reviewed”**, and **“Not applicable / correct geometry.”**
- Add filters: room, zone, severity, effort, budget, evidence class, source, resolved/unresolved, and structural/nonstructural.
- Make report sections: project context; uploaded floor plan; image-alignment calibration; true north and door-facing degrees; selected center/mode; color-coded overlay; annotated room inventory; validated findings with source citations; specific remedies; top five low-risk priorities; assumptions/uncertainties; before/after proposal; citations and source editions; and safety disclaimer.
- Export A4 PDF with legible Hindi Devanagari and English fonts, and at least 300-dpi print assets where practical. Offer portrait/landscape layout; 3:4 and 4:3 digital exports as separate aspect-ratio presets that **add margins instead of cutting off the plan**.

## 7. Interface and visual design

Create a refined, modern, calm architectural interface: ivory/off-white background, deep navy/charcoal text, muted saffron/terracotta accents, soft sage/blue visualization, consistent design tokens, and accessible contrast. Do not allow decorative chakra art to obscure measured geometry.

**Desktop layout:** top project bar (save/export/language), left stepper and geometry tools, wide central plan canvas, right analysis/remedies inspector, and a compact bottom compass/angle timeline. **Mobile/tablet:** responsive collapsible panels, large touch targets, full-screen plan editing, no horizontal overflow.

Suggested tabs: **Upload & Trace | Compass & Facing | Chakra Overlay | Room Analysis | Remedies | Compare | Report | Sources**. The “Compass & Facing” tab should be especially polished: circular interactive compass, 360° numeric input, ±0.1° micro-adjust buttons, magnetic/true switch, uncertainty readout, entrance-face arrow, and live orientation badge (e.g., `12.7° clockwise from true north`).

Add complete **English and Hindi** localization for buttons, legends, reports, directions, explanations, and number units. Use accessible semantic controls, keyboard and screen-reader support, colorblind-safe patterns, clear loading/progress/error states, onboarding walkthrough, and optional dark mode. Include a sample house plan/demo project that is explicitly labeled fictional.

## 8. Technical implementation

Choose a maintainable stack suitable for production; a suggested solution is **Next.js/React + TypeScript**, SVG/Canvas or Konva for manipulable overlays, PDF.js for page rendering, OpenCV.js or backend computer vision for image correction, a deterministic geometry engine (e.g., Turf/JSTS or equivalent), PostgreSQL with versioned JSON geometry, and a server-generated PDF exporter. Use a **separate domain engine** for geometry and rules rather than embedding all calculations inside UI components. Prefer safe open-source solutions and licensed/documented dependencies.

Build actual components, API endpoints, validation, database schema/migrations, autosave, source editor, export queue, and example seeded projects. Include a privacy-first option for local/on-device plan analysis, secure uploads, configurable data retention/deletion, encryption at rest and transit, no public exposure of private house plans, explicit consent before geolocation, rate limits, and appropriate authorization. Do not expose API keys or uploaded plans in logs.

Data model should distinguish `Project`, `Floor`, `PlanAsset`, `Calibration`, `PlotPolygon`, `BuildingPolygon`, `RoomPolygon`, `DoorSegment`, `WindowSegment`, `OrientationMeasurement`, `AnalysisProfile`, `RuleSource`, `Rule`, `Remedy`, `Finding`, `FindingSnapshot`, and `ActionLog`. Store coordinate reference, calibration transforms, app/rule versions, evidence provenance, and all user overrides. Saved analysis must be reproducible.

Write unit/property tests for point-in-polygon, overlapping polygons, area centroids, image-to-world transforms, true/magnetic conversion, angle normalization, all 8/16 sector boundaries, 359.9°→0° wraparound, irregular footprint, doorway outward-normal, multi-floor handling, and ±-uncertainty sensitivity. Add integration and end-to-end tests for upload, manual correction, rotate-and-recalculate, source display, export, reload, and project deletion. Include at least one gold-standard manually annotated floor plan. Verify that moving 1° across a sector boundary changes the correct findings and that rotating the **view only** does not change geographic analysis.

## 9. Acceptance criteria — all mandatory

The result is acceptable only if:

1. A real user can upload a floor plan, trace/correct it, and keep all original pixels intact.
2. A user can set **any true-north or entrance-facing degree with 0.1° precision**, adjust it repeatedly, and see the actual chakra and computed findings change appropriately.
3. The app unambiguously distinguishes entrance-facing angle, north arrow, image rotation, and magnetic declination, with correct math and boundary behavior.
4. At least 8-zone and 16-zone modes genuinely calculate and display geometry intersections. A traditional grid is implemented with its specific validated definition, rather than decorative lines alone.
5. It identifies rooms and entrances only as confidently as the upload permits; users can override everything.
6. Every classical interpretation shown has a verifiable reference or an explicit **“source not verified”** label. A claim without evidence cannot be labeled “authentic.”
7. Recommended remedies are location-specific, feasible for an existing house, prioritized by safety and practicality, explain how to carry them out, and disclose their evidence level. The application never implies that untested rituals are proven to work.
8. Users can compare multiple orientation scenarios, save edits, reopen projects, and download an accurate annotated report.
9. The bilingual responsive UI is genuinely usable on mobile and desktop, passes accessibility checks, and handles privacy securely.
10. The delivered code includes running instructions, environment setup, migrations, sample data, source bibliography, automated tests, and a deployment guide. No placeholder buttons, fabricated results, mocked-up remedy citations, or TODO-only features may be presented as finished functionality.

## 10. Builder deliverables and execution order

Start by giving (i) a concise product architecture, (ii) an explicit orientation/coordinate-system specification, (iii) a wireframe of the upload/compass/analyzer view, (iv) a normalized data model, (v) a verified-source strategy, and (vi) an incremental implementation plan. Then **implement the actual application** in working code, providing enough files and configuration for it to run. Prioritize the complete usable path **Upload → Trace → Calibrate North → Set exact facing → Overlay → Analyze → View cited remedies → Export**, then implement advanced source review, saved comparisons, and optional automated room detection. At each stage, run tests and repair failures. If classical references cannot be verified, leave the relevant rule disabled rather than generating a plausible-sounding citation. If a specialized feature cannot be completed, clearly identify its limitation; never show a nonfunctional feature as complete.

**Final instruction:** Build the best trustworthy Vāstu planning and educational aid possible. Its strongest qualities must be **precise geometry, a movable degree-by-degree chakra, transparent sources, actionable safe recommendations, editable user inputs, and honesty about the limits of traditional claims**.
