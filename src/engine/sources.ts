/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Verified Vāstu Sources & Evidence Classification Registry
 * Sourced strictly from documented texts with chapter/verse references and
 * modern Indian National Building Code (NBC 2016) parallels.
 */

export type EvidenceClass =
  | 'CLASSICAL_VERIFIED'
  | 'SCHOLARLY_INTERPRETATION'
  | 'CONTEMPORARY_PRACTICE'
  | 'BUILDING_SCIENCE_CODE'
  | 'UNVERIFIED_ASSERTION';

export interface SourceRecord {
  id: string;
  title: string;
  originalLanguage: string;
  authorOrAttribution: string;
  editorTranslatorEdition: string;
  chapterSection: string;
  verifiableUrl: string;
  citationTextEn: string;
  citationTextHi: string;
  scholarlyNotes: string;
  isClassicalText: boolean;
  evidenceClass: EvidenceClass;
}

export const VERIFIED_SOURCES: Record<string, SourceRecord> = {
  MAYAMATAM_CH26: {
    id: 'MAYAMATAM_CH26',
    title: 'Mayamatam (Traité d’architecture / Treatise of Housing)',
    originalLanguage: 'Sanskrit',
    authorOrAttribution: 'Attributed to Sage Maya',
    editorTranslatorEdition: 'Bruno Dagens (IGNCA / Motilal Banarsidass, 1994, Kalamulasastra Series 14-15)',
    chapterSection: 'Chapter 26 (Dwelling places / Gṛhabhūmi) & Chapter 3 (Site orientation)',
    verifiableUrl: 'https://ignca.gov.in/mayamatam/',
    citationTextEn: 'Prescribes cardinal orientation of dwellings, placing the hearth/cooking in Āgneya (South-East) or Vāyavya (North-West), heavy master resting quarters in Nairṛtya (South-West), and sacred water/worship in Īśāna (North-East). Stresses that the Brahmasthāna (central 9 cells) must be free from load-bearing pillars and filth.',
    citationTextHi: 'मयमतम् अध्याय २६ में गृह-विन्यास का विधान है: आग्नेय (दक्षिण-पूर्व) में पाकशाला, नैऋत्य (दक्षिण-पश्चिम) में मुख्य शयनकक्ष, तथा ईशान (उत्तर-पूर्व) में देवस्थान व जल की स्थापना शुभ मानी गई है। ब्रह्मस्थान को भारमुक्त और शुद्ध रखने का स्पष्ट निर्देश है।',
    scholarlyNotes: 'One of the most coherent surviving Dravidian vastu treatises. Stresses functional breeze and natural solar light paths.',
    isClassicalText: true,
    evidenceClass: 'CLASSICAL_VERIFIED',
  },
  MANASARA_CH36: {
    id: 'MANASARA_CH36',
    title: 'Mānasāra (Vāstuśāstra)',
    originalLanguage: 'Sanskrit',
    authorOrAttribution: 'Attributed to Sage Mānasāra',
    editorTranslatorEdition: 'P.K. Acharya (Oxford University Press / Mansara Series, 1934; IGNCA Catalog)',
    chapterSection: 'Chapters 7–9 (Gnomon & Orientation), Chapter 36 (House arrangement)',
    verifiableUrl: 'https://ignca.gov.in/Asi_data/22949.pdf',
    citationTextEn: 'Describes the 81-pada (Paramaśāyika) and 64-pada (Maṇḍūka) diagrams for houses. Emphasizes alignment with true sun-path via Śaṅku (gnomon) shadow casting at equinoxes.',
    citationTextHi: 'मानसार में ८१-पद (परमशायिक) और ६४-पद (मण्डूक) मण्डलों का विशद वर्णन है। शंकु-छाया द्वारा सूर्य के विषुवत् वृत्त से सटीक उत्तर-दक्षिण रेखा निर्धारण का विधान है।',
    scholarlyNotes: 'Standard academic baseline for Indian architectural proportions.',
    isClassicalText: true,
    evidenceClass: 'CLASSICAL_VERIFIED',
  },
  SAMARANGANA_CH38: {
    id: 'SAMARANGANA_CH38',
    title: 'Samarāṅgaṇa Sūtradhāra',
    originalLanguage: 'Sanskrit',
    authorOrAttribution: 'Mahārājā Bhoja of Dhārā (11th Century CE)',
    editorTranslatorEdition: 'Ed. D.N. Shukla (Vastu Sastra Vol. 1, Lucknow, 1960)',
    chapterSection: 'Chapter 38 (Pura-niveśa & Gṛha-vinyāsa)',
    verifiableUrl: 'https://ignca.gov.in/divisionss/kalakosa/kalamulasastra/kalamulasastra-database/',
    citationTextEn: 'Details structural stability, courtyard ventilation, and warns against dampness in South-West or fires in North-East.',
    citationTextHi: 'समराङ्गण सूत्रधार (अध्याय ३८) में भवन की दृढ़ता, वायु-संचार और प्रकाश का शास्त्रीय समन्वय है। नैऋत्य में सीलन और ईशान में अग्नि-दोष से बचने की चेतावनी दी गई है।',
    scholarlyNotes: 'Medieval northern Indian encyclopedia of engineering and civic planning.',
    isClassicalText: true,
    evidenceClass: 'CLASSICAL_VERIFIED',
  },
  BRIHAT_SAMHITA_CH53: {
    id: 'BRIHAT_SAMHITA_CH53',
    title: 'Bṛhat Saṃhitā',
    originalLanguage: 'Sanskrit',
    authorOrAttribution: 'Varāhamihira (6th Century CE)',
    editorTranslatorEdition: 'M. Ramakrishna Bhat (Motilal Banarsidass, 1981)',
    chapterSection: 'Chapter 53 (Vāstuvidyā — Architecture & Site Selection)',
    verifiableUrl: 'https://archive.org/details/BrihatSamhita',
    citationTextEn: 'Treats door placements along perimeter padas (Mahendra, Jayanta, Puṣpadanta, Bhallāṭa) as auspicious for entrance breezes and morning sunlight.',
    citationTextHi: 'वराहमिहिर-कृत बृहत्संहिता (अध्याय ५३ - वास्तुविद्या) में मुख्य द्वार हेतु महेन्द्र, जयन्त, पुष्पदन्त एवं भल्लाट पदों को उत्तम वायु व सूर्य-प्रकाश की दृष्टि से श्रेष्ठ माना गया है।',
    scholarlyNotes: 'Oldest major encyclopedic compilation containing dedicated Vāstuvidyā verses.',
    isClassicalText: true,
    evidenceClass: 'CLASSICAL_VERIFIED',
  },
  BIS_NBC_2016: {
    id: 'BIS_NBC_2016',
    title: 'Bureau of Indian Standards — National Building Code of India 2016 (SP 7)',
    originalLanguage: 'English',
    authorOrAttribution: 'Bureau of Indian Standards (Govt. of India)',
    editorTranslatorEdition: 'NBC 2016 Vol 1 & 2 (Part 3 Development Control Rules & Part 8 Building Services)',
    chapterSection: 'Part 8 Section 1 (Lighting and Natural Ventilation), Part 3 (Open Spaces & Setbacks)',
    verifiableUrl: 'https://www.bis.gov.in/standards/national-building-code/?lang=en',
    citationTextEn: 'Requires aggregate opening area of habitable rooms to be at least 1/10th of floor area in hot-dry/warm-humid climates. Preserves unobstructed courtyard ventilation and cross-draft paths.',
    citationTextHi: 'भारतीय मानक ब्यूरो (NBC 2016 भाग ८ धारा १): प्रत्येक निवास कक्ष में प्राकृतिक प्रकाश व वायु हेतु खिड़कियों का क्षेत्रफल कुल फर्श के कम से कम १०% होना अनिवार्य है। केंद्रीय आँगन से क्रॉस-वेंटिलेशन को प्रोत्साहन दिया गया है।',
    scholarlyNotes: 'Binding modern building science standard. Completely independent of mystical or ritual claims.',
    isClassicalText: false,
    evidenceClass: 'BUILDING_SCIENCE_CODE',
  },
  NOAA_WMM_2025: {
    id: 'NOAA_WMM_2025',
    title: 'NOAA NCEI & British Geological Survey — World Magnetic Model (WMM)',
    originalLanguage: 'English',
    authorOrAttribution: 'National Centers for Environmental Information (NCEI)',
    editorTranslatorEdition: 'WMM 2020–2025 / 2025–2030 Release',
    chapterSection: 'Declination & True North Navigation Data for the Indian Subcontinent',
    verifiableUrl: 'https://www.ncei.noaa.gov/products/magnetic-declination',
    citationTextEn: 'In India, magnetic declination currently ranges between ~0.5°W in Gujarat to ~1.8°E in Assam. Handheld compasses align to magnetic north, requiring local declination compensation to yield true geographic north.',
    citationTextHi: 'भूचुंबकीय मॉडल के अनुसार भारत में चुंबकीय झुकाव (Magnetic Declination) ०.५° प. से १.८° पू. के मध्य है। वास्तविक भौगोलिक उत्तर हेतु चुंबकीय कम्पास में यह सुधार आवश्यक है।',
    scholarlyNotes: 'Rigorous physical science model for navigation and alignment.',
    isClassicalText: false,
    evidenceClass: 'BUILDING_SCIENCE_CODE',
  },
  CONTEMPORARY_16ZONE_TRADITION: {
    id: 'CONTEMPORARY_16ZONE_TRADITION',
    title: 'Contemporary 16-Zone & 32-Entrance Geometric Grid Paradigm',
    originalLanguage: 'Hindi / English',
    authorOrAttribution: 'Late 20th / 21st Century Indian Vastu Consultants (e.g. MahaVastu / Dr. Khushdeep Bansal paradigm)',
    editorTranslatorEdition: 'Modern trade publications (2000–present)',
    chapterSection: '16 Angular Zones of 22.5° each and 32 door quadrants',
    verifiableUrl: 'https://en.wikipedia.org/wiki/Vastu_shastra#Modern_adaptations',
    citationTextEn: 'Dividing 360° into sixteen 22.5° sectors is an influential late-20th-century geometric adaptation used by contemporary consultants. It has become popular in commercial practice but does not appear in classical treatises like Mayamatam or Mānasāra which primarily used 8 directions or 64/81 square padas.',
    citationTextHi: '१६ कोणीय क्षेत्रों (प्रत्येक २२.५°) का विभाजन २०वीं सदी के उत्तरार्ध का आधुनिक व्यावहारिक रूपांतरण है। यह समकालीन सलाहकारों में लोकप्रिय है, किंतु मयमतम् या मानसार जैसे प्राचीन ग्रंथों में यह ८ दिशाओं व ६४/८१ पद मण्डलों के रूप में ही मिलता है।',
    scholarlyNotes: 'Carefully labeled as contemporary practitioner convention, not ancient scripture.',
    isClassicalText: false,
    evidenceClass: 'CONTEMPORARY_PRACTICE',
  },
};
