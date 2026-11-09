/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vāstu Rule Engine, Finding Evaluator & 3-Tier Responsible Remedy System
 * 
 * Non-negotiable honesty rule:
 * Distinguishes (A) Practical architectural improvements (NBC 2016 daylight, airflow, acoustics, safety),
 * (B) Traditionally prescribed classical spatial allocations, and
 * (C) Transparently labeled modern/symbolic folk practices (unverified).
 */

import { ZoneOverlap } from './geometry';
import { EvidenceClass } from './sources';

export type RoomType =
  | 'main_entrance'
  | 'kitchen'
  | 'master_bedroom'
  | 'bedroom'
  | 'pooja_room'
  | 'living_room'
  | 'toilet_bath'
  | 'dining'
  | 'staircase'
  | 'study_library'
  | 'water_tank_overhead'
  | 'water_tank_underground'
  | 'balcony_terrace'
  | 'courtyard'
  | 'utility_store'
  | 'brahmasthan';

export type RemedyCategory =
  | 'A_ARCHITECTURAL_PRACTICAL'
  | 'B_TRADITIONAL_LAYOUT'
  | 'C_SYMBOLIC_OPTIONAL';

export interface RemedyItem {
  id: string;
  category: RemedyCategory;
  categoryLabelEn: string;
  categoryLabelHi: string;
  titleEn: string;
  titleHi: string;
  priority: 'DO_NOW' | 'LOW_COST_CHANGE' | 'PROFESSIONAL_ASSESSMENT' | 'MAJOR_RENOVATION' | 'OPTIONAL_SYMBOLIC';
  priorityLabelEn: string;
  priorityLabelHi: string;
  stepsEn: string[];
  stepsHi: string[];
  materialsEn: string;
  materialsHi: string;
  approximateCostBand: 'Zero' | 'Low (< ₹5,000)' | 'Moderate (₹5,000–₹25,000)' | 'High (₹25,000+)';
  estimatedEffort: '1–2 hours' | '1–2 days' | '1 week' | 'Renovation project';
  reversible: boolean;
  needsProfessional: boolean;
  safetyNotesEn: string;
  safetyNotesHi: string;
  expectedMeasurableOutcomeEn: string;
  expectedMeasurableOutcomeHi: string;
  howToVerifyEn: string;
  howToVerifyHi: string;
  sourceIds: string[];
  evidenceClass: EvidenceClass;
}

export interface RuleDefinition {
  id: string;
  roomType: RoomType;
  favorableZones: string[];
  acceptableZones: string[];
  unfavorableZones: string[];
  titleEn: string;
  titleHi: string;
  classicalCitationEn: string;
  classicalCitationHi: string;
  primarySourceId: string;
  buildingScienceJustificationEn: string;
  buildingScienceJustificationHi: string;
  remedies: RemedyItem[];
}

export interface FindingResult {
  id: string;
  roomId: string;
  roomNameEn: string;
  roomNameHi: string;
  roomType: RoomType;
  ruleId: string;
  status: 'favorable' | 'acceptable' | 'unfavorable' | 'neutral';
  predominantZone: string;
  overlapBreakdown: ZoneOverlap[];
  brahmasthanIntersects: boolean;
  brahmasthanOverlapPct: number;
  findingTitleEn: string;
  findingTitleHi: string;
  rationaleEn: string;
  rationaleHi: string;
  sourceId: string;
  evidenceClass: EvidenceClass;
  remedies: RemedyItem[];
  isSensitiveToUncertainty: boolean;
  alternativeZonesUnderUncertainty: string[];
  reviewed: boolean;
}

export const VASTU_RULES: Record<RoomType, RuleDefinition> = {
  kitchen: {
    id: 'RULE_KITCHEN',
    roomType: 'kitchen',
    favorableZones: ['SE', 'SSE'], // Āgneya
    acceptableZones: ['NW', 'WNW', 'E', 'ESE'], // Vāyavya (air circulation)
    unfavorableZones: ['NE', 'NNE', 'N', 'SW', 'SSW'], // Water conflict (Īśāna) or Earth dampness
    titleEn: 'Kitchen (Pākaśālā) Orientation',
    titleHi: 'रसोईघर (पाकशाला) दिशा विन्यास',
    classicalCitationEn: 'Mayamatam (Ch. 26.54) & Mānasāra (Ch. 36): Hearth and fire cooking are situated in Āgneya (South-East), or alternately in Vāyavya (North-West). Placing the hearth in Īśāna (North-East) is strictly warned against due to elemental water-fire opposition.',
    classicalCitationHi: 'मयमतम् (अ. २६.५४) एवं मानसार (अ. ३६): भोजन पकाने का स्थान आग्नेय (दक्षिण-पूर्व) कोण में, अथवा वायव्य (उत्तर-पश्चिम) में स्थापित करें। ईशान (उत्तर-पूर्व) में अग्नि की स्थापना जल-अग्नि विरोध के कारण वर्जित है।',
    primarySourceId: 'MAYAMATAM_CH26',
    buildingScienceJustificationEn: 'In India’s tropical latitudes, prevailing winds carry kitchen smoke/moisture away when placed in the South-East or North-West, avoiding contamination of central living areas and bedroom quarters. Morning sunlight in the East/South-East also naturally disinfects cooking surfaces.',
    buildingScienceJustificationHi: 'भारतीय प्रायद्वीप में प्रचलित वायु धाराओं के अनुसार, दक्षिण-पूर्व में रसोई रखने से धुआँ और वाष्प मुख्य निवास कक्षों में नहीं फैलता। प्रातःकालीन धूप से रसोई में प्राकृतिक जीवाणु-शोधन होता है।',
    remedies: [
      {
        id: 'REM_KITCHEN_A1',
        category: 'A_ARCHITECTURAL_PRACTICAL',
        categoryLabelEn: 'Architectural & Ventilation (Priority 1)',
        categoryLabelHi: 'वास्तु-शिल्प व वायु-संचार सुधार (प्राथमिकता १)',
        titleEn: 'Install High-Efficiency Exhaust Hood & Natural Cross-Draft',
        titleHi: 'सक्रिय निकास पंखा (Exhaust) व प्राकृतिक वायु संचार स्थापित करें',
        priority: 'DO_NOW',
        priorityLabelEn: 'Do Now / Immediate',
        priorityLabelHi: 'तत्काल करणीय',
        stepsEn: [
          'Mount a minimum 600 m³/hr ducted chimney or exhaust fan directly above the cooking range.',
          'Verify that window area equals at least 10% of kitchen floor area as per BIS NBC 2016 Part 8.',
          'Install high-grade mesh to permit open breeze without pest ingress.'
        ],
        stepsHi: [
          'चूल्हे के ठीक ऊपर कम से कम ६०० घनमीटर/घंटा क्षमता की चिमनी या एक्जॉस्ट फैन लगाएँ।',
          'भारतीय मानक ब्यूरो (NBC 2016 भाग ८) के अनुसार खिड़की का क्षेत्रफल फर्श का न्यूनतम १०% रखें।',
          'कीट-रोधी जाली लगाकर प्राकृतिक हवा का प्रवाह निरंतर बनाए रखें।'
        ],
        materialsEn: 'Standard ducted range hood, electrical connection, weather-sealed exterior louvers.',
        materialsHi: 'डक-युक्त किचन चिमनी, विद्युत कनेक्शन, बाहरी वेदर-प्रूफ लूवर।',
        approximateCostBand: 'Moderate (₹5,000–₹25,000)',
        estimatedEffort: '1–2 days',
        reversible: true,
        needsProfessional: true,
        safetyNotesEn: 'Ensure gas piping adheres to IS 6044 (LPG storage and handling). Never obstruct gas shut-off valves.',
        safetyNotesHi: 'एलपीजी गैस पाइपिंग आईएस ६०४४ सुरक्षा मानकों के अनुरूप रखें। मुख्य गैस वॉल्व तक पहुँच सदैव बाधारहित रखें।',
        expectedMeasurableOutcomeEn: 'Complete extraction of cooking particulates (PM2.5) within 4 minutes; temperature reduction near cooking counter by 2–4°C.',
        expectedMeasurableOutcomeHi: 'पाक क्रिया के महीन कणों (PM2.5) का ४ मिनट में पूर्ण निकास; रसोई के तापमान में २–४ डिग्री सेल्सियस की कमी।',
        howToVerifyEn: 'Anemometer reading at exhaust intake; absence of grease deposition on adjacent walls.',
        howToVerifyHi: 'एनीमोमीटर द्वारा वायु गति का परीक्षण; निकटवर्ती दीवारों पर चिकनाई का न जमना।',
        sourceIds: ['BIS_NBC_2016'],
        evidenceClass: 'BUILDING_SCIENCE_CODE',
      },
      {
        id: 'REM_KITCHEN_B1',
        category: 'B_TRADITIONAL_LAYOUT',
        categoryLabelEn: 'Traditional Spatial Reorganization',
        categoryLabelHi: 'शास्त्रीय विन्यास संतुलन',
        titleEn: 'Orient Cooktop Facing East with Fire-Water Separation',
        titleHi: 'पूर्व-मुखी चूल्हा व्यवस्था व अग्नि-जल पृथक्करण',
        priority: 'LOW_COST_CHANGE',
        priorityLabelEn: 'Low Cost Spatial Shift',
        priorityLabelHi: 'अल्प व्यय स्थान परिवर्तन',
        stepsEn: [
          'Reorganize the preparation counter so the cook stands facing East towards the morning light.',
          'Maintain at least 60 cm (2 feet) physical clearance between the sink (Water element) and cooktop (Fire element).',
          'If sink and stove share the same counter, insert an insulating wooden or granite vertical divider partition.'
        ],
        stepsHi: [
          'काउंटर पर खाना पकाने वाले का मुख पूर्व दिशा (प्रातःकालीन प्रकाश) की ओर रखें।',
          'पानी के सिंक (जल) और चूल्हे (अग्नि) के बीच कम से कम ६० सेमी (२ फीट) की दूरी रखें।',
          'यदि सिंक व चूल्हा एक ही स्लैब पर हों, तो बीच में लकड़ी या ग्रेनाइट का छोटा ऊर्ध्वाधर विभाजक लगाएँ।'
        ],
        materialsEn: 'Countertop divider slab (granite or hardwood sealant), non-flammable thermal barrier.',
        materialsHi: 'ग्रेनाइट पट्टी या हार्डवुड विभाजक, अग्निरोधक सीलेंट।',
        approximateCostBand: 'Low (< ₹5,000)',
        estimatedEffort: '1–2 hours',
        reversible: true,
        needsProfessional: false,
        safetyNotesEn: 'Keep all flammable curtains and spices at least 1 meter away from open flames.',
        safetyNotesHi: 'ज्वलनशील पर्दे और सूखे मसाले खुली आग से कम से कम १ मीटर दूर रखें।',
        expectedMeasurableOutcomeEn: 'Ergonomic kitchen triangle workflow improvement; prevention of water splashes extinguishing burners.',
        expectedMeasurableOutcomeHi: 'रसोई कार्य-त्रिकोण (Kitchen Triangle) में सहजता; पानी के छींटों से बर्नर बुझने की रोकथाम।',
        howToVerifyEn: 'Physical clearance verification tape measure.',
        howToVerifyHi: 'टेप द्वारा दूरी की भौतिक पुष्टि।',
        sourceIds: ['MAYAMATAM_CH26', 'MANASARA_CH36'],
        evidenceClass: 'CLASSICAL_VERIFIED',
      },
      {
        id: 'REM_KITCHEN_C1',
        category: 'C_SYMBOLIC_OPTIONAL',
        categoryLabelEn: 'Contemporary / Folk Symbolic Practice (Unverified)',
        categoryLabelHi: 'समकालीन पारंपरिक प्रतीकात्मक उपाय (अपुष्ट)',
        titleEn: 'Neutral Earth Tones & Warm Accent Accouterments',
        titleHi: 'सौम्य प्राकृतिक रंग व सूक्ष्म प्रतीकात्मक संतुलन',
        priority: 'OPTIONAL_SYMBOLIC',
        priorityLabelEn: 'Optional Symbolic Practice',
        priorityLabelHi: 'वैकल्पिक प्रतीकात्मक उपाय',
        stepsEn: [
          'Apply neutral cream, off-white, or muted terracotta tiles behind the cooking area.',
          'Disclosed limitation: Traditional color remedies are folklore conventions; they do not alter electromagnetic or physical forces.'
        ],
        stepsHi: [
          'रसोई की पिछली दीवार पर सौम्य क्रीम, ऑफ-व्हाइट या हल्के टेराकोटा रंग की टाइलें लगाएँ।',
          'स्पष्ट प्रकटीकरण: रंगों के वास्तु प्रभाव पारंपरिक लोक-मान्यताएँ हैं; इनका कोई प्रमाणित भौतिक या चिकित्सकीय आधार नहीं है।'
        ],
        materialsEn: 'Ceramic wall tiles, heat-resistant washable paint.',
        materialsHi: 'सिरेमिक दीवार टाइल्स, धोने योग्य पेंट।',
        approximateCostBand: 'Low (< ₹5,000)',
        estimatedEffort: '1–2 days',
        reversible: true,
        needsProfessional: false,
        safetyNotesEn: 'Use non-toxic low-VOC paints only.',
        safetyNotesHi: 'केवल कम-वीओसी (लो-वीओसी) वाले विष-रहित पेंट का उपयोग करें।',
        expectedMeasurableOutcomeEn: 'Visual luminance increase and easier surface cleaning.',
        expectedMeasurableOutcomeHi: 'दृश्य प्रकाश में वृद्धि तथा दीवार की सफाई में सुगमता।',
        howToVerifyEn: 'Visual aesthetic inspection.',
        howToVerifyHi: 'सौंदर्यपरक दृश्य निरीक्षण।',
        sourceIds: ['CONTEMPORARY_16ZONE_TRADITION'],
        evidenceClass: 'UNVERIFIED_ASSERTION',
      }
    ]
  },

  master_bedroom: {
    id: 'RULE_MASTER_BEDROOM',
    roomType: 'master_bedroom',
    favorableZones: ['SW', 'SSW', 'WSW'], // Nairṛtya (Earth/Heavy)
    acceptableZones: ['S', 'SSE', 'W', 'WNW'],
    unfavorableZones: ['NE', 'NNE', 'E', 'SE'],
    titleEn: 'Master Bedroom (Śayana-Gṛha) Placement',
    titleHi: 'मुख्य शयनकक्ष (शयन-गृह) विन्यास',
    classicalCitationEn: 'Mayamatam (Ch. 26.58) & Samarāṅgaṇa Sūtradhāra (Ch. 38): The head of the household should occupy the Nairṛtya (South-West) corner. This sector represents stability, heavy structure, and security.',
    classicalCitationHi: 'मयमतम् (अ. २६.५८) एवं समराङ्गण सूत्रधार (अ. ३८): गृहस्वामी का निवास नैऋत्य (दक्षिण-पश्चिम) कोण में श्रेष्ठ है। यह दिशा स्थायित्व, भारी भार-वहन तथा सुरक्षा का प्रतीक मानी गई है।',
    primarySourceId: 'MAYAMATAM_CH26',
    buildingScienceJustificationEn: 'South-West receives strong afternoon solar thermal radiation (sol-air heating). Placing bedrooms with thick southern and western structural thermal mass buffers the rest of the dwelling. When properly shaded and ventilated in evening hours, it provides quiet privacy from street noise.',
    buildingScienceJustificationHi: 'दक्षिण-पश्चिम में दोपहर की तीव्र सौर गर्मी (Sol-air heating) आती है। मोटी दीवारों व अलमारियों द्वारा भारीपन रखने से शेष घर ठंडा रहता है तथा मार्ग के शोर से एकांत मिलता है।',
    remedies: [
      {
        id: 'REM_MBR_A1',
        category: 'A_ARCHITECTURAL_PRACTICAL',
        categoryLabelEn: 'Architectural & Acoustic Privacy (Priority 1)',
        categoryLabelHi: 'ध्वनि रोधन व सौर तापीय नियंत्रण (प्राथमिकता १)',
        titleEn: 'External Shading & Nighttime Thermal Comfort Management',
        titleHi: 'बाहरी छज्जे/शेडिंग तथा रात्रि कालीन तापीय आराम प्रबंधन',
        priority: 'DO_NOW',
        priorityLabelEn: 'Do Now / Immediate',
        priorityLabelHi: 'तत्काल करणीय',
        stepsEn: [
          'Install external horizontal sun-shades (chajjas) or solar reflective window films on SW facing glass to prevent daytime overheating.',
          'Position heavy wardrobes along the South and West internal walls to add acoustic and thermal insulation.',
          'Verify bedroom window acoustic seals if the wall faces an external roadway.'
        ],
        stepsHi: [
          'दोपहर की अत्यधिक गर्मी रोकने हेतु दक्षिण-पश्चिम की खिड़कियों पर बाहरी छज्जे या सोलर रिफ्लेक्टिव फिल्म लगाएँ।',
          'दक्षिण व पश्चिम की भीतरी दीवारों पर भारी अलमारियाँ लगाएँ, जिससे ध्वनि व ऊष्मा का प्राकृतिक रोधन हो सके।',
          'यदि सड़क की ओर खिड़की हो, तो ध्वनिरोधी रबर बीडिंग की जाँच करें।'
        ],
        materialsEn: 'Solar control glass film (minimum 60% heat rejection), acoustic weatherstripping.',
        materialsHi: 'सोलर कंट्रोल ग्लास फिल्म, ध्वनिरोधी मौसम सील।',
        approximateCostBand: 'Low (< ₹5,000)',
        estimatedEffort: '1–2 days',
        reversible: true,
        needsProfessional: false,
        safetyNotesEn: 'Do not compromise emergency egress egress through bedroom windows.',
        safetyNotesHi: 'आपातकालीन निकास में खिड़की के मार्ग में कोई स्थायी अवरोध न बनाएँ।',
        expectedMeasurableOutcomeEn: 'Reduction of peak interior afternoon bedroom temperature by 3–5°C; acoustic reduction by 6–10 dB.',
        expectedMeasurableOutcomeHi: 'दोपहर के अधिकतम भीतरी तापमान में ३–५ डिग्री सेल्सियस की कमी; बाहरी शोर में ६–१० डेसिबल की कमी।',
        howToVerifyEn: 'Digital thermometer comparison at 3:00 PM vs outside ambient.',
        howToVerifyHi: 'दोपहर ३ बजे भीतरी व बाहरी तापमान का तुलनात्मक मापन।',
        sourceIds: ['BIS_NBC_2016'],
        evidenceClass: 'BUILDING_SCIENCE_CODE',
      },
      {
        id: 'REM_MBR_B1',
        category: 'B_TRADITIONAL_LAYOUT',
        categoryLabelEn: 'Traditional Spatial Reorganization',
        categoryLabelHi: 'शास्त्रीय शयन दिशा विन्यास',
        titleEn: 'Bed Headboard Alignment Towards South or East',
        titleHi: 'सिरहाना दक्षिण अथवा पूर्व दिशा की ओर संरेखण',
        priority: 'LOW_COST_CHANGE',
        priorityLabelEn: 'Low Cost Spatial Shift',
        priorityLabelHi: 'अल्प व्यय स्थान परिवर्तन',
        stepsEn: [
          'Arrange the bed so sleeping posture places the head pointing South or East, never North.',
          'Keep at least 10 cm gap between the headboard and outer damp exterior walls.',
          'Ensure the bed is not aligned directly under a heavy exposed structural RCC beam.'
        ],
        stepsHi: [
          'पलंग का संरेखण इस प्रकार करें कि सोते समय सिरहाना दक्षिण या पूर्व दिशा में रहे, उत्तर में कदापि न हो।',
          'सीलन से बचाव हेतु पलंग के सिरहाने व दीवार के मध्य कम से कम १० सेमी की खाली जगह रखें।',
          'सुनिश्चित करें कि पलंग किसी भारी नग्न आरसीसी बीम के ठीक नीचे न हो।'
        ],
        materialsEn: 'Bed position adjustment casters or furniture sliders.',
        materialsHi: 'फर्नीचर स्लाइडर पैड।',
        approximateCostBand: 'Zero',
        estimatedEffort: '1–2 hours',
        reversible: true,
        needsProfessional: false,
        safetyNotesEn: 'Ensure clear 90 cm pathway around bed for unhindered nighttime walking.',
        safetyNotesHi: 'रात्रि में ठोकर से बचाव हेतु पलंग के चारों ओर न्यूनतम ९० सेमी का चलने का मार्ग रखें।',
        expectedMeasurableOutcomeEn: 'Optimal ergonomic circulation; absence of psychological claustrophobia from overhead beams.',
        expectedMeasurableOutcomeHi: 'सहज आवागमन और भारी बीम के नीचे सोने से होने वाले मनोवैज्ञानिक दबाव से मुक्ति।',
        howToVerifyEn: 'Visual tape measurement.',
        howToVerifyHi: 'मापन फीते द्वारा भौतिक जाँच।',
        sourceIds: ['BRIHAT_SAMHITA_CH53', 'MAYAMATAM_CH26'],
        evidenceClass: 'CLASSICAL_VERIFIED',
      }
    ]
  },

  pooja_room: {
    id: 'RULE_POOJA_ROOM',
    roomType: 'pooja_room',
    favorableZones: ['NE', 'NNE', 'ENE', 'N', 'E'], // Īśāna
    acceptableZones: ['W', 'NW'],
    unfavorableZones: ['S', 'SW', 'SSW', 'SE'],
    titleEn: 'Pooja / Sacred Meditation Sanctuary',
    titleHi: 'पूजा स्थल / ध्यान कक्ष विन्यास',
    classicalCitationEn: 'Mayamatam (Ch. 26.62) & Mānasāra (Ch. 36): The deity shrine and prayer chamber belong in Īśāna (North-East), where divine waters and subtle morning sunlight assemble.',
    classicalCitationHi: 'मयमतम् (अ. २६.६२) व मानसार (अ. ३६): देवस्थान व प्रार्थना कक्ष हेतु ईशान (उत्तर-पूर्व) सर्वोत्तम है, जहाँ प्रातःकालीन शांत प्रकाश व पवित्रता का वास होता है।',
    primarySourceId: 'MAYAMATAM_CH26',
    buildingScienceJustificationEn: 'North-East receives the softest infrared-free morning sunlight (diffuse daylight without thermal glare), ideal for early morning quietude, concentration, and reading.',
    buildingScienceJustificationHi: 'उत्तर-पूर्व दिशा में बिना चिलचिलाती धूप के शांत और स्निग्ध प्रातःकालीन विसरित प्रकाश (Diffuse daylight) प्राप्त होता है, जो ध्यान और एकाग्रता के सर्वथा अनुकूल है।',
    remedies: [
      {
        id: 'REM_POOJA_A1',
        category: 'A_ARCHITECTURAL_PRACTICAL',
        categoryLabelEn: 'Architectural Lighting & Ventilation',
        categoryLabelHi: 'वास्तु-शिल्प प्रकाश व संवातन',
        titleEn: 'Dedicated Incense Smoke Exhaust & Sacred Hygiene Buffer',
        titleHi: 'धूप-हवन धुआँ निकास व शुचिता अवरोधक',
        priority: 'DO_NOW',
        priorityLabelEn: 'Do Now / Immediate',
        priorityLabelHi: 'तत्काल करणीय',
        stepsEn: [
          'Install a silent low-RPM extractor fan to clear oil lamp and incense emissions, keeping indoor air quality below 15 µg/m³ PM2.5.',
          'Ensure the shrine never shares a common wall with a water closet (WC) or drainage soil pipe.',
          'Provide non-combustible marble, ceramic, or brass trays underneath all oil lamps.'
        ],
        stepsHi: [
          'दीपक व धूप के धुएँ के सुरक्षित निकास हेतु साइलेंट एक्जॉस्ट फैन लगाएँ, जिससे भीतरी वायु गुणवत्ता शुद्ध रहे।',
          'सुनिश्चित करें कि पूजा स्थल की दीवार किसी शौचालय की ड्रेनेज पाइप या कमोड से न सटी हो।',
          'दीपक व कपूर के नीचे संगमरमर, सिरेमिक या पीतल की अग्निरोधक थाली रखें।'
        ],
        materialsEn: 'Small silent exhaust fan, fire-resistant stone slab base.',
        materialsHi: 'छोटा शांत एक्जॉस्ट फैन, अग्निरोधक संगमरमर स्लैब।',
        approximateCostBand: 'Low (< ₹5,000)',
        estimatedEffort: '1–2 hours',
        reversible: true,
        needsProfessional: false,
        safetyNotesEn: 'Fire prevention: never leave naked flames unattended near combustible cotton wicks or wood carving.',
        safetyNotesHi: 'अग्नि सुरक्षा: जलते हुए दीपक को लकड़ी की नक्काशी या वस्त्रों के पास अकेला न छोड़ें।',
        expectedMeasurableOutcomeEn: 'Safe indoor air quality index; zero soot buildup on ceilings.',
        expectedMeasurableOutcomeHi: 'सुरक्षित भीतरी वायु गुणवत्ता; छत पर कालिख न जमना।',
        howToVerifyEn: 'Air quality monitor or visual inspection.',
        howToVerifyHi: 'वायु गुणवत्ता यंत्र या दृश्य निरीक्षण।',
        sourceIds: ['BIS_NBC_2016'],
        evidenceClass: 'BUILDING_SCIENCE_CODE',
      }
    ]
  },

  toilet_bath: {
    id: 'RULE_TOILET_BATH',
    roomType: 'toilet_bath',
    favorableZones: ['WNW', 'W', 'SSW', 'NW', 'S'], // Decontamination zones
    acceptableZones: ['SW', 'SE'],
    unfavorableZones: ['NE', 'NNE', 'ENE', 'N', 'brahmasthan'], // Strict taboos
    titleEn: 'Toilet & Sanitation (Śauca-Gṛha) Placement',
    titleHi: 'शौचालय व स्वच्छता कक्ष विन्यास',
    classicalCitationEn: 'Mayamatam (Ch. 26) & Samarāṅgaṇa Sūtradhāra (Ch. 38): Waste discharge, latrines, and refuse pits must be kept far away from Īśāna (North-East) and the central Brahmasthāna to prevent sacred contamination.',
    classicalCitationHi: 'मयमतम् व समराङ्गण सूत्रधार: मलमूत्र त्याग व जल-निकास के गड्ढे ईशान कोण व केंद्रीय ब्रह्मस्थान से सर्वथा दूर होने चाहिए, ताकि भवन का पवित्र केंद्र दूषित न हो।',
    primarySourceId: 'SAMARANGANA_CH38',
    buildingScienceJustificationEn: 'Pathogens, sewer gases (H2S), and high humidity must be exhausted downwind. North-East winds in tropical seasons would blow sewer moisture back into the home if toilets were positioned there. BIS NBC 2016 Part 9 mandates direct exterior ventilation shafts.',
    buildingScienceJustificationHi: 'रोगाणुओं, सीवर गैसों और सीलन को भवन के बाहर निकालना आवश्यक है। ईशान में शौचालय होने पर हवा सीवर की नमी को घर के भीतर धकेलती है। एनबीसी २०१६ सीधे बाहरी संवातन शाफ्ट का निर्देश देता है।',
    remedies: [
      {
        id: 'REM_TOILET_A1',
        category: 'A_ARCHITECTURAL_PRACTICAL',
        categoryLabelEn: 'Plumbing & Airflow Isolation (Priority 1)',
        categoryLabelHi: 'प्लंबिंग व वायु सीलिंग (प्राथमिकता १)',
        titleEn: 'Water-Seal Trap Inspection, Exhaust Venting & Negative Pressure',
        titleHi: 'वॉटर-सील ट्रैप निरीक्षण, बाहरी एक्जॉस्ट व नकारात्मक वायु दबाव',
        priority: 'DO_NOW',
        priorityLabelEn: 'Do Now / Immediate',
        priorityLabelHi: 'तत्काल करणीय',
        stepsEn: [
          'Verify that all floor drains and WCs have deep water-seal traps (minimum 50 mm depth) to prevent sewer gases from entering.',
          'Install an automatic timer-controlled continuous exhaust fan venting through an external wall or vertical shaft.',
          'Ensure the toilet door has a raised threshold (25 mm) to prevent floor wash water from spilling into adjacent rooms.'
        ],
        stepsHi: [
          'सभी फर्श ड्रेन व कमोड में न्यूनतम ५० मिमी गहरे वॉटर-सील ट्रैप की पुष्टि करें ताकि सीवर गैसें न आएँ।',
          'बाहरी दीवार या शाफ्ट की ओर सतत निकास पंखा लगाएँ जो दुर्गंध को तुरंत बाहर निकाले।',
          'शौचालय के दरवाजे पर २५ मिमी ऊंची देहरी (चौखट) रखें ताकि धुलाई का पानी बाहर कमरों में न फैले।'
        ],
        materialsEn: 'Deep-seal P-traps, heavy-duty bathroom exhaust fan, silicone waterproofing sealant.',
        materialsHi: 'डीप-सील पी-ट्रैप, बाथरूम एक्जॉस्ट फैन, सिलिकॉन वाटरप्रूफिंग सीलेंट।',
        approximateCostBand: 'Low (< ₹5,000)',
        estimatedEffort: '1–2 days',
        reversible: true,
        needsProfessional: true,
        safetyNotesEn: 'Sewer gases (hydrogen sulfide) are toxic and flammable. Ensure roof soil vent pipes terminate at least 1 meter above the parapet.',
        safetyNotesHi: 'सीवर गैसें (H2S) विषैली होती हैं। छत पर वेंट पाइप रेलिंग से कम से कम १ मीटर ऊपर निकलना अनिवार्य है।',
        expectedMeasurableOutcomeEn: 'Zero backdraft smell; 100% relative humidity evacuation within 10 minutes of hot shower.',
        expectedMeasurableOutcomeHi: 'शौचालय दुर्गंध का पूर्ण उन्मूलन; स्नान के १० मिनट में अतिरिक्त वाष्प का बाहर निकलना।',
        howToVerifyEn: 'Smoke pencil test for door draft; manometer for negative room pressure.',
        howToVerifyHi: 'स्मोक पेंसिल द्वारा वायु दिशा का परीक्षण।',
        sourceIds: ['BIS_NBC_2016'],
        evidenceClass: 'BUILDING_SCIENCE_CODE',
      },
      {
        id: 'REM_TOILET_B1',
        category: 'B_TRADITIONAL_LAYOUT',
        categoryLabelEn: 'Traditional Spatial Neutralization',
        categoryLabelHi: 'पारंपरिक विन्यास नियंत्रण',
        titleEn: 'Commode Orientation (Facing North or South)',
        titleHi: 'कमोड दिशा संरेखण (उत्तर या दक्षिण मुखी)',
        priority: 'LOW_COST_CHANGE',
        priorityLabelEn: 'Low Cost Spatial Shift',
        priorityLabelHi: 'अल्प व्यय स्थान परिवर्तन',
        stepsEn: [
          'Seat orientation during elimination should face North or South, avoiding direct facing towards the rising sun (East).',
          'Keep the toilet door shut with an automatic hydraulic door closer when not in use.',
          'If an existing toilet is mistakenly located in the North-East, avoid using it as a primary water closet; repurpose as a dry storage or powder room if feasible.'
        ],
        stepsHi: [
          'शौच के समय मुख उत्तर या दक्षिण की ओर हो, प्रत्यक्ष पूर्व (उगते सूर्य) की ओर मुख न हो।',
          'उपयोग न होने पर शौचालय का द्वार बंद रखने हेतु हाइड्रोलिक डोर क्लोजर लगाएँ।',
          'यदि मौजूदा मकान में शौचालय ईशान कोण में हो, तो उसे भारी उपयोग से बचाएँ और संभव हो तो ड्राई स्टोर के रूप में प्रयोग करें।'
        ],
        materialsEn: 'Hydraulic door closer, opaque modesty glass film.',
        materialsHi: 'हाइड्रोलिक डोर क्लोजर, फ्रॉस्टेड ग्लास फिल्म।',
        approximateCostBand: 'Low (< ₹5,000)',
        estimatedEffort: '1–2 hours',
        reversible: true,
        needsProfessional: false,
        safetyNotesEn: 'Ensure non-slip ceramic flooring (R10 rating) to prevent falls.',
        safetyNotesHi: 'फिसलन व चोट से बचाव हेतु नॉन-स्लिप मैट या आर-१० सिरेमिक टाइल का उपयोग करें।',
        expectedMeasurableOutcomeEn: 'Visual containment and separation of waste zone from living spaces.',
        expectedMeasurableOutcomeHi: 'मुख्य आवास से स्वच्छता कक्ष का पूर्ण दृश्य व गंध पृथक्करण।',
        howToVerifyEn: 'Visual confirmation of door self-closing mechanism.',
        howToVerifyHi: 'डोर-क्लोजर के स्वतः बंद होने का परीक्षण।',
        sourceIds: ['SAMARANGANA_CH38'],
        evidenceClass: 'CLASSICAL_VERIFIED',
      }
    ]
  },

  main_entrance: {
    id: 'RULE_MAIN_ENTRANCE',
    roomType: 'main_entrance',
    favorableZones: ['NE', 'E', 'N', 'NNE', 'ENE'], // Auspicious gates (Jayanta, Mahendra, Bhallata)
    acceptableZones: ['NW', 'SE', 'S'],
    unfavorableZones: ['SW', 'SSW', 'WSW'], // Nairṛtya entry
    titleEn: 'Main Entrance Door (Mahādvāra) Facing',
    titleHi: 'मुख्य प्रवेश द्वार (महाद्वार) अभिमुखता',
    classicalCitationEn: 'Bṛhat Saṃhitā (Ch. 53.70–73) & Mayamatam (Ch. 26): Main doors facing East, North, or West are extolled under auspicious deity padas (Jayanta, Mahendra, Puṣpadanta, Bhallāṭa). Doors opening directly into the South-West corner are cautioned against.',
    classicalCitationHi: 'बृहत्संहिता (अ. ५३.७०-७३) एवं मयमतम्: पूर्व, उत्तर तथा पश्चिम में शुभ पदों (जयन्त, महेन्द्र, पुष्पदन्त, भल्लाट) पर स्थित मुख्य द्वार उत्तम माना गया है। नैऋत्य (दक्षिण-पश्चिम) में मुख्य द्वार को प्रतिकूल बताया गया है।',
    primarySourceId: 'BRIHAT_SAMHITA_CH53',
    buildingScienceJustificationEn: 'The entrance governs natural foyer ventilation, greeting light, and street accessibility. Eastern and Northern entrances capture non-glaring morning sun and facilitate welcoming transitions without evening thermal buildup.',
    buildingScienceJustificationHi: 'प्रवेश द्वार प्रकाश, स्वच्छ वायु और मुख्य मार्ग से आवागमन को नियंत्रित करता है। पूर्व व उत्तर के द्वार सुखद धूप और ठंडी बयार लाते हैं।',
    remedies: [
      {
        id: 'REM_ENTRANCE_A1',
        category: 'A_ARCHITECTURAL_PRACTICAL',
        categoryLabelEn: 'Architectural Lighting & Threshold Ergonomics',
        categoryLabelHi: 'प्रकाश व्यवस्था व देहरी सुदृढ़ीकरण',
        titleEn: 'Unobstructed Well-Lit Foyer & Weatherproof Threshold Sill',
        titleHi: 'बाधारहित प्रकाशमान प्रवेश दालान व वेदरप्रूफ चौखट',
        priority: 'DO_NOW',
        priorityLabelEn: 'Do Now / Immediate',
        priorityLabelHi: 'तत्काल करणीय',
        stepsEn: [
          'Clear all shoe clutter, cardboard boxes, and unorganized storage within 1.5 meters of the entrance swing.',
          'Install bright warm LED illumination (minimum 300 lux) with motion sensor activation for night safety.',
          'Ensure the entrance door opens inward smoothly at 90° without squeaking or rubbing against floor tiles.'
        ],
        stepsHi: [
          'दरवाजे के खुलने के १.५ मीटर के घेरे में जूते-चप्पल या कबाड़ का कोई अवरोध न रहने दें।',
          'रात्रि में सुरक्षित प्रवेश हेतु ३०० लक्स का मोशन सेंसर-युक्त वार्म एलईडी प्रकाश लगाएँ।',
          'सुनिश्चित करें कि दरवाजा बिना किसी चरमराहट के भीतर की ओर सहज ९० डिग्री पर खुले।'
        ],
        materialsEn: 'Motion sensor LED luminaire, brass hinges, silicone lubricant.',
        materialsHi: 'मोशन सेंसर एलईडी लाइट, पीतल के कब्जे, सिलिकॉन लुब्रिकेंट।',
        approximateCostBand: 'Low (< ₹5,000)',
        estimatedEffort: '1–2 hours',
        reversible: true,
        needsProfessional: false,
        safetyNotesEn: 'Ensure entrance threshold does not create a tripping hazard for elderly occupants (max height 20 mm with bevelled edges).',
        safetyNotesHi: 'चौखट की ऊंचाई २० मिमी से अधिक न रखें तथा किनारों को ढालू रखें ताकि बुजुर्गों को ठोकर न लगे।',
        expectedMeasurableOutcomeEn: 'Zero trip incidents; smooth ingress and welcoming architectural ambiance.',
        expectedMeasurableOutcomeHi: 'ठोकर की घटनाओं की रोकथाम; सुरुचिपूर्ण व सुरक्षित गृह-प्रवेश।',
        howToVerifyEn: 'Lux meter measurement at foyer floor; free swing radius check.',
        howToVerifyHi: 'लक्स मीटर द्वारा प्रकाश स्तर की माप।',
        sourceIds: ['BIS_NBC_2016'],
        evidenceClass: 'BUILDING_SCIENCE_CODE',
      }
    ]
  },

  living_room: {
    id: 'RULE_LIVING_ROOM',
    roomType: 'living_room',
    favorableZones: ['E', 'N', 'NE', 'NW'],
    acceptableZones: ['W', 'SE'],
    unfavorableZones: ['SW'],
    titleEn: 'Living / Guest Drawing Room',
    titleHi: 'बैठक / ड्राइंग रूम विन्यास',
    classicalCitationEn: 'Mānasāra (Ch. 36) & Mayamatam (Ch. 26): Rooms intended for entertaining guests and gathering are well-placed in the North, East, or North-West.',
    classicalCitationHi: 'मानसार व मयमतम्: अतिथियों के सत्कार व पारिवारिक संवाद हेतु बैठक कक्ष उत्तर, पूर्व या वायव्य दिशा में उत्तम रहता है।',
    primarySourceId: 'MANASARA_CH36',
    buildingScienceJustificationEn: 'Living areas require abundant natural lighting during daytime social hours. East and North orientations maximize daylight factors without excessive air-conditioning heat loads.',
    buildingScienceJustificationHi: 'बैठक कक्ष में दिन के समय पर्याप्त प्राकृतिक रोशनी चाहिए। उत्तर व पूर्व दिशाएँ बिना अतिरिक्त तापीय भार के उत्कृष्ट प्रकाश प्रदान करती हैं।',
    remedies: [
      {
        id: 'REM_LIVING_A1',
        category: 'A_ARCHITECTURAL_PRACTICAL',
        categoryLabelEn: 'Daylight Optimization',
        categoryLabelHi: 'प्राकृतिक प्रकाश संवर्धन',
        titleEn: 'Maximize Glare-Free Natural Daylight & Cross-Ventilation',
        titleHi: 'चकाचौंध-मुक्त प्राकृतिक प्रकाश व क्रॉस-वेंटिलेशन',
        priority: 'DO_NOW',
        priorityLabelEn: 'Do Now / Immediate',
        priorityLabelHi: 'तत्काल करणीय',
        stepsEn: [
          'Replace heavy opaque curtains with sheer dual-layer blinds to admit daylight while safeguarding privacy.',
          'Arrange seating so conversation circles do not face blinding direct afternoon sunlight.'
        ],
        stepsHi: [
          'अंधेरे पर्दों के स्थान पर पारदर्शी दोहरे पर्दे लगाएँ ताकि दिन में पर्याप्त रोशनी आए।',
          'बैठने के सोफों की व्यवस्था इस प्रकार करें कि बात करते समय सीधी धूप आँखों पर न पड़े।'
        ],
        materialsEn: 'Dual-layer sheer blinds, low-energy ceiling fans.',
        materialsHi: 'हल्के पारदर्शी पर्दे, बीएलडीसी ऊर्जा-सक्षम पंखे।',
        approximateCostBand: 'Low (< ₹5,000)',
        estimatedEffort: '1–2 hours',
        reversible: true,
        needsProfessional: false,
        safetyNotesEn: 'Keep walking aisles at least 90 cm wide between coffee table and sofas.',
        safetyNotesHi: 'सोफे और मेज के बीच कम से कम ९० सेमी चौड़ा आवागमन मार्ग बनाए रखें।',
        expectedMeasurableOutcomeEn: 'Daylight factor exceeding 2% throughout daytime hours.',
        expectedMeasurableOutcomeHi: 'दिन के समय कृत्रिम बत्ती जलाए बिना पर्याप्त दृश्य स्पष्टता।',
        howToVerifyEn: 'Light meter verification.',
        howToVerifyHi: 'प्रकाश मापन।',
        sourceIds: ['BIS_NBC_2016'],
        evidenceClass: 'BUILDING_SCIENCE_CODE',
      }
    ]
  },

  brahmasthan: {
    id: 'RULE_BRAHMASTHAN',
    roomType: 'brahmasthan',
    favorableZones: ['brahmasthan'],
    acceptableZones: [],
    unfavorableZones: [],
    titleEn: 'Brahmasthāna (Central Spatial Core)',
    titleHi: 'ब्रह्मस्थान (केंद्रीय खुला नाभिनाल)',
    classicalCitationEn: 'Mayamatam (Ch. 26) & Samarāṅgaṇa Sūtradhāra (Ch. 38): The central 1/9th portion (Brahmasthāna) must be maintained open, well-lit, and unburdened by heavy load-bearing columns, water closets, or septic tanks.',
    classicalCitationHi: 'मयमतम् एवं समराङ्गण सूत्रधार: भवन के केंद्रीय नवम भाग (ब्रह्मस्थान) को सदैव खुला, प्रकाशमान तथा भारी खंभों या शौच-गड्डों से मुक्त रखना परम आवश्यक है।',
    primarySourceId: 'MAYAMATAM_CH26',
    buildingScienceJustificationEn: 'The traditional Indian courtyard (Aṅgana) functions as a passive stack-effect chimney, venting hot air upward while drawing cooler fresh air through peripheral rooms. A heavy column in the exact geometric center creates structural awkwardness and blocks circulation.',
    buildingScienceJustificationHi: 'पारंपरिक भारतीय आँगन प्राकृतिक रूप से गर्म हवा को ऊपर निकाल कर ताजी ठंडी हवा को भीतर खींचता है (Stack effect)। केंद्र में भारी अवरोध हवा और आवागमन को रोक देता है।',
    remedies: [
      {
        id: 'REM_BRAHMA_A1',
        category: 'A_ARCHITECTURAL_PRACTICAL',
        categoryLabelEn: 'Core Architectural Clearance',
        categoryLabelHi: 'केंद्रीय मार्ग व वायु शुद्धि',
        titleEn: 'Maintain Open Uncluttered Central Circulation Spine',
        titleHi: 'केंद्रीय भाग को पूर्णतः स्वच्छ व खुला आवागमन गलियारा रखें',
        priority: 'DO_NOW',
        priorityLabelEn: 'Do Now / Immediate',
        priorityLabelHi: 'तत्काल करणीय',
        stepsEn: [
          'Do not place heavy unmovable furniture, storage trunks, or partition dividers across the central floor intersection.',
          'Ensure central skylight or ambient ceiling fixture provides clear, soft overhead illumination.',
          'Keep central floor spotless, dry, and free of electrical extension cords.'
        ],
        stepsHi: [
          'भवन के मध्य भाग में भारी संदूक, विभाजन की दीवारें या भारी कबाड़ न रखें।',
          'छत की केंद्रीय लाइट या स्काईलाइट से पर्याप्त कोमल रोशनी का प्रबंध करें।',
          'फर्श को सूखा और बिजली के तारों के जाल से मुक्त रखें।'
        ],
        materialsEn: 'Recessed ceiling warm LED, cable organizers.',
        materialsHi: 'सीलिंग एलईडी लाइट, केबल ऑर्गेनाइजर।',
        approximateCostBand: 'Zero',
        estimatedEffort: '1–2 hours',
        reversible: true,
        needsProfessional: false,
        safetyNotesEn: 'Ensure non-slip transitions between rooms intersecting the center.',
        safetyNotesHi: 'कमरों के बीच फिसलने वाले पायदान न डालें।',
        expectedMeasurableOutcomeEn: 'Unrestricted breeze circulation throughout peripheral bedrooms.',
        expectedMeasurableOutcomeHi: 'कमरों में हवा का निर्बाध प्रवाह।',
        howToVerifyEn: 'Tape measure confirming 100% free perimeter radius.',
        howToVerifyHi: 'मापन द्वारा केंद्रीय खुलेपन की पुष्टि।',
        sourceIds: ['MAYAMATAM_CH26', 'BIS_NBC_2016'],
        evidenceClass: 'CLASSICAL_VERIFIED',
      }
    ]
  },

  // Fallbacks for remaining rooms with standard parameters
  bedroom: {
    id: 'RULE_BEDROOM_GENERAL',
    roomType: 'bedroom',
    favorableZones: ['W', 'S', 'NW', 'SW'],
    acceptableZones: ['SE', 'E'],
    unfavorableZones: ['NE'],
    titleEn: 'Secondary Bedroom / Children Room',
    titleHi: 'अन्य शयनकक्ष / बाल कक्ष',
    classicalCitationEn: 'Mayamatam: North-West is recommended for guests or unmarried youth; West for scholars.',
    classicalCitationHi: 'मयमतम्: वायव्य (उत्तर-पश्चिम) मेहमानों अथवा संतानों के लिए तथा पश्चिम अध्ययन हेतु उत्तम है।',
    primarySourceId: 'MAYAMATAM_CH26',
    buildingScienceJustificationEn: 'Secondary bedrooms benefit from western cross-ventilation and quiet evening isolation.',
    buildingScienceJustificationHi: 'अध्ययन व विश्राम हेतु शांत वातावरण व पश्चिमी हवा का लाभ मिलता है।',
    remedies: []
  },
  dining: {
    id: 'RULE_DINING',
    roomType: 'dining',
    favorableZones: ['E', 'SE', 'W', 'S'],
    acceptableZones: ['N', 'NW'],
    unfavorableZones: ['SW'],
    titleEn: 'Dining Hall (Bhojana-Śālā)',
    titleHi: 'भोजन कक्ष',
    classicalCitationEn: 'Mānasāra: Proximity to kitchen with pleasant light and clean circulation.',
    classicalCitationHi: 'मानसार: रसोई के समीप स्वच्छ व प्रकाशमान स्थान पर भोजन व्यवस्था।',
    primarySourceId: 'MANASARA_CH36',
    buildingScienceJustificationEn: 'Adjacency to food preparation reduces steps; natural ventilation exhausts food aromas.',
    buildingScienceJustificationHi: 'रसोई से निकटता आवागमन घटाती है तथा संवातन से भोजन की गंध नहीं ठहरती।',
    remedies: []
  },
  staircase: {
    id: 'RULE_STAIRCASE',
    roomType: 'staircase',
    favorableZones: ['S', 'SW', 'W', 'SE', 'NW'],
    acceptableZones: ['N', 'E'],
    unfavorableZones: ['NE', 'brahmasthan'],
    titleEn: 'Staircase (Sopāna) Placement',
    titleHi: 'सीढ़ियाँ (सोपान) विन्यास',
    classicalCitationEn: 'Mayamatam & Samarāṅgaṇa: Stairs add structural weight and belong on Southern or Western perimeter. Avoid placing heavy stairs directly on Īśāna or Brahmasthāna.',
    classicalCitationHi: 'मयमतम् व समराङ्गण: सीढ़ियों का भारी भार दक्षिण या पश्चिम दीवार पर उत्तम है। ईशान व ब्रह्मस्थान में सीढ़ियाँ वर्जित हैं।',
    primarySourceId: 'SAMARANGANA_CH38',
    buildingScienceJustificationEn: 'RCC staircases are heavy structural shear elements. Placing them on the periphery allows direct fire escape access as per NBC 2016 Part 4.',
    buildingScienceJustificationHi: 'सीढ़ियाँ भारी आरसीसी ढाँचा होती हैं। बाहरी दीवार पर होने से आग लगने पर सुरक्षित आपातकालीन निकास मिलता है (NBC भाग ४)।',
    remedies: []
  },
  study_library: {
    id: 'RULE_STUDY',
    roomType: 'study_library',
    favorableZones: ['NE', 'E', 'N', 'W'],
    acceptableZones: ['NW'],
    unfavorableZones: ['S', 'SE'],
    titleEn: 'Study / Home Office',
    titleHi: 'अध्ययन कक्ष / स्वाध्याय',
    classicalCitationEn: 'Mānasāra: North and East foster contemplation and intellectual focus.',
    classicalCitationHi: 'मानसार: उत्तर व पूर्व दिशाएँ एकाग्रता व अध्ययन हेतु श्रेष्ठ हैं।',
    primarySourceId: 'MANASARA_CH36',
    buildingScienceJustificationEn: 'Even northern light (diffuse daylight) causes no screen reflection on computers or reading glare.',
    buildingScienceJustificationHi: 'उत्तर दिशा से आने वाली शांत धूप में चकाचौंध नहीं होती, जो कंप्यूटर स्क्रीन व पढ़ाई के लिए आदर्श है।',
    remedies: []
  },
  water_tank_overhead: {
    id: 'RULE_OVERHEAD_TANK',
    roomType: 'water_tank_overhead',
    favorableZones: ['SW', 'W', 'S'],
    acceptableZones: ['NW', 'SE'],
    unfavorableZones: ['NE', 'brahmasthan'],
    titleEn: 'Overhead Water Tank',
    titleHi: 'ओवरहेड पानी की टंकी (छत)',
    classicalCitationEn: 'Samarāṅgaṇa Sūtradhāra: Massive structural heights and heavy loads belong in Nairṛtya (South-West).',
    classicalCitationHi: 'समराङ्गण सूत्रधार: छत पर भारी भार व ऊंचाई नैऋत्य (दक्षिण-पश्चिम) में श्रेष्ठ है।',
    primarySourceId: 'SAMARANGANA_CH38',
    buildingScienceJustificationEn: 'Water tanks hold thousands of kilograms. Positioning over robust SW shear walls balances building seismic response.',
    buildingScienceJustificationHi: 'हजारों लीटर पानी का भारी वजन मजबूत पिलरों पर होना चाहिए ताकि भूकंपीय स्थिरता बनी रहे।',
    remedies: []
  },
  water_tank_underground: {
    id: 'RULE_UNDERGROUND_TANK',
    roomType: 'water_tank_underground',
    favorableZones: ['NE', 'N', 'E'],
    acceptableZones: ['NW'],
    unfavorableZones: ['SW', 'S', 'SE', 'brahmasthan'],
    titleEn: 'Underground Sump / Borewell',
    titleHi: 'भूमिगत जल भंडार / बोरवेल',
    classicalCitationEn: 'Mayamatam: Sub-surface water bodies flourish in Īśāna (North-East). Avoid excavating water sumps in Nairṛtya or Āgneya.',
    classicalCitationHi: 'मयमतम्: भूमिगत जल स्रोत ईशान (उत्तर-पूर्व) में शुभ होते हैं। नैऋत्य या आग्नेय में गड्ढा खोदने से बचें।',
    primarySourceId: 'MAYAMATAM_CH26',
    buildingScienceJustificationEn: 'North-East low depression encourages natural ground aquifer recharge in monsoon sloping contours.',
    buildingScienceJustificationHi: 'उत्तर-पूर्व की प्राकृतिक ढाल वर्षा जल के भूमिगत पुनर्भरण में सहायक होती है।',
    remedies: []
  },
  balcony_terrace: {
    id: 'RULE_BALCONY',
    roomType: 'balcony_terrace',
    favorableZones: ['NE', 'E', 'N'],
    acceptableZones: ['NW', 'SE'],
    unfavorableZones: ['SW'],
    titleEn: 'Balcony / Open Verandah',
    titleHi: 'बालकनी / खुला बरामदा',
    classicalCitationEn: 'Mānasāra: Openings facing North and East capture benevolent breezes and morning sun.',
    classicalCitationHi: 'मानसार: उत्तर व पूर्व के खुले बरामदे स्वास्थ्यवर्धक वायु व धूप का स्वागत करते हैं।',
    primarySourceId: 'MANASARA_CH36',
    buildingScienceJustificationEn: 'Provides direct outdoor connection and natural ventilation without harsh solar radiation.',
    buildingScienceJustificationHi: 'बिना तीखी धूप के प्राकृतिक खुली हवा और प्रकाश प्रदान करता है।',
    remedies: []
  },
  courtyard: {
    id: 'RULE_COURTYARD',
    roomType: 'courtyard',
    favorableZones: ['brahmasthan', 'NE', 'N', 'E'],
    acceptableZones: ['NW'],
    unfavorableZones: ['SW'],
    titleEn: 'Central Courtyard (Aṅgana)',
    titleHi: 'केंद्रीय आँगन (अंगना)',
    classicalCitationEn: 'Mayamatam: An open courtyard brings natural balance to the entire dwelling.',
    classicalCitationHi: 'मयमतम्: खुला आँगन पूरे घर में प्रकाश और वायु का संचार बनाए रखता है।',
    primarySourceId: 'MAYAMATAM_CH26',
    buildingScienceJustificationEn: 'Courtyard creates a passive microclimate and convective air cooling stack effect.',
    buildingScienceJustificationHi: 'आँगन घर के तापमान को प्राकृतिक रूप से ठंडा रखने में अत्यंत प्रभावी होता है।',
    remedies: []
  },
  utility_store: {
    id: 'RULE_UTILITY',
    roomType: 'utility_store',
    favorableZones: ['NW', 'W', 'SW', 'SE'],
    acceptableZones: ['S'],
    unfavorableZones: ['NE', 'brahmasthan'],
    titleEn: 'Utility / Store Room',
    titleHi: 'स्टोर रूम / भंडार गृह',
    classicalCitationEn: 'Mānasāra: Storage of dry grains and heavy items belongs in Western or Southern quarters.',
    classicalCitationHi: 'मानसार: भारी सामान व अनाज का संचय पश्चिम या दक्षिण दिशा में उचित है।',
    primarySourceId: 'MANASARA_CH36',
    buildingScienceJustificationEn: 'Dry goods remain safe from northern dampness; store buffers outer heat.',
    buildingScienceJustificationHi: 'सूखी वस्तुएँ सीलन से सुरक्षित रहती हैं तथा भीतरी कमरों को गर्मी से बचाती हैं।',
    remedies: []
  }
};

/**
 * Evaluate a single room given its zone overlaps and Brahmasthāna intersection.
 */
export function evaluateRoomFindings(
  roomId: string,
  roomNameEn: string,
  roomNameHi: string,
  roomType: RoomType,
  overlaps: ZoneOverlap[],
  brahmasthanInfo: { overlaps: boolean; percentage: number },
  uncertaintySensitivity: { isStable: boolean; crossedBoundaries: string[] }
): FindingResult {
  const rule = VASTU_RULES[roomType] || VASTU_RULES.living_room;
  const primaryZone = overlaps[0]?.zoneId || 'N';

  let status: 'favorable' | 'acceptable' | 'unfavorable' | 'neutral' = 'neutral';
  let rationaleEn = '';
  let rationaleHi = '';

  if (brahmasthanInfo.overlaps && (roomType === 'toilet_bath' || roomType === 'kitchen')) {
    status = 'unfavorable';
    rationaleEn = `This room encroaches into the sacred central Brahmasthāna (${brahmasthanInfo.percentage}% overlap). Classical Vāstu and modern building science both demand an unencumbered, clean central core.`;
    rationaleHi = `यह कक्ष केंद्रीय ब्रह्मस्थान में फैला हुआ है (${brahmasthanInfo.percentage}% विस्तार)। शास्त्रीय वास्तु व आधुनिक भवन विज्ञान दोनों ही केंद्र को स्वच्छ व बाधारहित रखने का निर्देश देते हैं।`;
  } else if (rule.favorableZones.includes(primaryZone)) {
    status = 'favorable';
    rationaleEn = `Predominantly located in ${overlaps[0]?.zoneNameEn} (${overlaps[0]?.overlapPercentage}%), fully aligned with classical recommendations.`;
    rationaleHi = `यह कक्ष मुख्यतः ${overlaps[0]?.zoneNameHi} (${overlaps[0]?.overlapPercentage}%) में स्थित है, जो शास्त्रीय विधानों के पूर्णतः अनुकूल है।`;
  } else if (rule.acceptableZones.includes(primaryZone)) {
    status = 'acceptable';
    rationaleEn = `Located in ${overlaps[0]?.zoneNameEn} (${overlaps[0]?.overlapPercentage}%), considered an acceptable secondary position in classical texts.`;
    rationaleHi = `यह कक्ष ${overlaps[0]?.zoneNameHi} (${overlaps[0]?.overlapPercentage}%) में है, जिसे ग्रंथों में द्वितीयक स्वीकार्य स्थान माना गया है।`;
  } else if (rule.unfavorableZones.includes(primaryZone)) {
    status = 'unfavorable';
    rationaleEn = `Located in ${overlaps[0]?.zoneNameEn} (${overlaps[0]?.overlapPercentage}%), which presents an elemental conflict (e.g., water vs. fire or waste in sacred quadrants). Review feasible remedies below.`;
    rationaleHi = `यह कक्ष ${overlaps[0]?.zoneNameHi} (${overlaps[0]?.overlapPercentage}%) में है, जहाँ तत्वों का शास्त्रीय विरोध पाया गया है। नीचे सुगम व्यावहारिक उपाय देखें।`;
  } else {
    status = 'neutral';
    rationaleEn = `Located in ${overlaps[0]?.zoneNameEn} (${overlaps[0]?.overlapPercentage}%). No specific classical prohibition recorded.`;
    rationaleHi = `यह कक्ष ${overlaps[0]?.zoneNameHi} (${overlaps[0]?.overlapPercentage}%) में है। इसके लिए कोई विशेष शास्त्रीय निषेध नहीं है।`;
  }

  return {
    id: `FINDING_${roomId}`,
    roomId,
    roomNameEn,
    roomNameHi,
    roomType,
    ruleId: rule.id,
    status,
    predominantZone: primaryZone,
    overlapBreakdown: overlaps,
    brahmasthanIntersects: brahmasthanInfo.overlaps,
    brahmasthanOverlapPct: brahmasthanInfo.percentage,
    findingTitleEn: `${roomNameEn} in ${overlaps[0]?.zoneNameEn || primaryZone}`,
    findingTitleHi: `${roomNameHi} (${overlaps[0]?.zoneNameHi || primaryZone} में)`,
    rationaleEn,
    rationaleHi,
    sourceId: rule.primarySourceId,
    evidenceClass: 'CLASSICAL_VERIFIED',
    remedies: rule.remedies || [],
    isSensitiveToUncertainty: !uncertaintySensitivity.isStable,
    alternativeZonesUnderUncertainty: uncertaintySensitivity.crossedBoundaries,
    reviewed: false,
  };
}

/**
 * Computes the transparent "Selected Rule-Set Alignment Index".
 * Explains formula:
 * score = Sum(weight_i * status_score_i) / Sum(weight_i) * 100
 * Favorable = 1.0, Acceptable = 0.7, Neutral = 0.5, Unfavorable = 0.2
 * Key rooms (Entrance, Kitchen, Master Bedroom, Toilet, Brahmasthan) have weight 2.0; others 1.0.
 */
export function calculateAlignmentIndex(findings: FindingResult[]): {
  indexScore: number;
  totalRooms: number;
  favorableCount: number;
  acceptableCount: number;
  unfavorableCount: number;
  neutralCount: number;
  formulaExplanationEn: string;
  formulaExplanationHi: string;
} {
  if (findings.length === 0) {
    return {
      indexScore: 100,
      totalRooms: 0,
      favorableCount: 0,
      acceptableCount: 0,
      unfavorableCount: 0,
      neutralCount: 0,
      formulaExplanationEn: 'No rooms configured yet.',
      formulaExplanationHi: 'अभी कोई कक्ष चिह्नित नहीं किया गया है।',
    };
  }

  let totalWeight = 0;
  let weightedPoints = 0;
  let favorable = 0, acceptable = 0, unfavorable = 0, neutral = 0;

  const highPriorityTypes: RoomType[] = ['main_entrance', 'kitchen', 'master_bedroom', 'toilet_bath', 'brahmasthan'];

  for (const f of findings) {
    const weight = highPriorityTypes.includes(f.roomType) ? 2.0 : 1.0;
    totalWeight += weight;

    if (f.status === 'favorable') {
      favorable++;
      weightedPoints += weight * 1.0;
    } else if (f.status === 'acceptable') {
      acceptable++;
      weightedPoints += weight * 0.7;
    } else if (f.status === 'unfavorable') {
      unfavorable++;
      weightedPoints += weight * 0.2;
    } else {
      neutral++;
      weightedPoints += weight * 0.5;
    }
  }

  const score = totalWeight > 0 ? Math.round((weightedPoints / totalWeight) * 100) : 100;

  return {
    indexScore: score,
    totalRooms: findings.length,
    favorableCount: favorable,
    acceptableCount: acceptable,
    unfavorableCount: unfavorable,
    neutralCount: neutral,
    formulaExplanationEn: 'Alignment Index = (Σ weight_i × status_value_i) / (Σ weight_i) × 100. Favorable = 1.0, Acceptable = 0.7, Neutral = 0.5, Unfavorable = 0.2. Crucial areas (Entrance, Kitchen, Master Bed, Toilet, Brahmasthāna) carry double weight (2.0). Note: This is an architectural alignment measurement against selected texts, NOT a prediction of health, fortune, or destiny.',
    formulaExplanationHi: 'संरेखण सूचकांक = (Σ भार_i × स्थिति_मान_i) / (Σ भार_i) × १००। अनुकूल = १.०, स्वीकार्य = ०.७, सामान्य = ०.५, प्रतिकूल = ०.२। मुख्य स्थान (प्रवेश द्वार, रसोई, मुख्य शयनकक्ष, शौचालय, ब्रह्मस्थान) पर दोहरा भार (२.०) लागू है। ध्यान दें: यह चयनित ग्रंथों के आधार पर केवल स्थापत्य संरेखण सूचकांक है, भाग्य या स्वास्थ्य की कोई भविष्यवाणी नहीं।',
  };
}
