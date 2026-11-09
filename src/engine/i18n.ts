/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Bilingual (English / Hindi) Localization Dictionary
 * High-fidelity architectural and classical Vāstu terminology.
 */

export type Language = 'en' | 'hi';

export const TRANSLATIONS = {
  en: {
    appTitle: 'Vāstu Chakra — House Plan Analyzer',
    appSubtitle: 'Authentic Traditional Architectural Analysis & Feasible Remedies',
    scientificNoticeTitle: 'Non-Negotiable Honesty & Transparency Notice',
    scientificNoticeBody: 'Vāstuśāstra is a traditional Indian architectural, cultural, and climatological discipline. This application explicitly distinguishes classical textual prescriptions (Mayamatam, Mānasāra, Samarāṅgaṇa Sūtradhāra, Bṛhat Saṃhitā) and modern building science (BIS NBC 2016) from unverified popular folklore. Directional remedies, mirrors, pyramids, or rituals are not scientifically proven to cure diseases, guarantee wealth, or alter destiny.',
    
    // Header & Tabs
    tabUploadTrace: 'Upload & Trace',
    tabCompassFacing: 'Compass & Facing',
    tabChakraOverlay: 'Chakra Overlay',
    tabRoomAnalysis: 'Room Analysis',
    tabRemedies: 'Remedies & Actions',
    tabCompare: 'Compare Angles',
    tabReport: 'Export & Report',
    tabSources: 'Source Bibliography',
    
    // Quick Actions
    loadDemoPlan: 'Load Benchmark Demo (3BHK)',
    resetPlan: 'Reset Plan',
    exportReportBtn: 'Export A4 Report',
    exportPngBtn: 'Export High-Res PNG',
    exportJsonBtn: 'Export Project JSON',
    languageSwitch: 'हिन्दी',
    
    // Compass & Facing
    orientationSummary: 'Orientation & Geodetic Alignment',
    trueNorth: 'True North Bearing',
    magneticNorth: 'Magnetic North',
    declination: 'Magnetic Declination',
    entranceFacing: 'Main Entrance Outward Facing',
    bearingAccuracy: 'Survey Precision: 0.1° step',
    uncertaintyMargin: 'Angle Uncertainty Margin (±°)',
    clockwiseConvention: '0° = North, 90° = East, 180° = South, 270° = West (Clockwise)',
    doorFacingExplanation: 'The entrance facing is the outward normal vector leading outdoors, independent of the house long-axis.',
    flipEntranceNormal: 'Flip Inward / Outward Normal',
    presets: 'Cardinal Presets',
    snapCardinal: 'Snap to 45° (Off by default)',
    
    // Overlay Controls
    analysisMode: 'Analysis Grid Mode',
    mode8Zone: '8 Directions (Aṣṭa-Dikpāla 45°)',
    mode16Zone: '16 Angular Zones (22.5°)',
    modeMandala: '9×9 Vāstu Puruṣa Maṇḍala Grid',
    chakraCenter: 'Reference Center Point',
    centerFootprint: 'Building Footprint Centroid',
    centerPlot: 'Plot Boundary Centroid',
    centerCustom: 'User Selected Reference Center',
    opacity: 'Overlay Opacity',
    showRays: 'Show Angular Boundary Rays',
    showBrahmasthan: 'Highlight Central Brahmasthāna (1/9th core)',
    
    // Findings & Analysis
    alignmentIndex: 'Rule-Set Alignment Index',
    favorable: 'Favorable',
    acceptable: 'Acceptable',
    unfavorable: 'Review Needed',
    neutral: 'Neutral',
    brahmasthanStatus: 'Brahmasthāna Status',
    brahmasthanClear: 'Central Core Open & Clean',
    brahmasthanObstructed: 'Intersects Central Core',
    uncertaintyWarning: 'Sensitive to ± uncertainty margin; review crossed boundaries.',
    stableFinding: 'Stable under angular margin.',
    
    // Remedy Tabs
    priorityDoNow: 'Do Now / Immediate',
    priorityLowCost: 'Low-Cost Spatial Shift',
    priorityProfessional: 'Professional Assessment',
    priorityMajor: 'Major Renovation (Conditional)',
    prioritySymbolic: 'Optional Folk / Symbolic Practice',
    
    remedyCatA: 'Class A: Practical Architectural & Ventilation (Priority 1)',
    remedyCatB: 'Class B: Traditionally Prescribed Spatial Adjustments',
    remedyCatC: 'Class C: Optional Symbolic Folk Practice (Unverified)',
    
    // Rooms
    roomName: 'Room Name',
    roomType: 'Functional Category',
    zoneDistribution: 'Zone Distribution (%)',
    primaryZone: 'Predominant Zone',
    
    // Action Checklist
    actionChecklist: 'Verified Implementation Log',
    markReviewed: 'Mark as Reviewed',
    reviewedStatus: 'Reviewed',
    unreviewedStatus: 'Pending Review',
  },
  
  hi: {
    appTitle: 'वास्तु चक्र — गृह योजना विश्लेषक',
    appSubtitle: 'प्रामाणिक शास्त्रीय वास्तु विश्लेषण एवं व्यावहारिक वास्तुशिल्प समाधान',
    scientificNoticeTitle: 'पारदर्शिता एवं वैज्ञानिक सत्यनिष्ठा प्रकटीकरण',
    scientificNoticeBody: 'वास्तुशास्त्र भारत की प्राचीन स्थापत्य व जलवायु-आधारित शास्त्रीय परंपरा है। यह ऐप्लिकेशन प्रमाणित प्राचीन ग्रंथों (मयमतम्, मानसार, समराङ्गण सूत्रधार, बृहत्संहिता) तथा आधुनिक भवन निर्माण संहिता (BIS NBC 2016) को भ्रामक अंधविश्वासों से स्पष्टतः अलग रखता है। धातु की पत्तियाँ, पिरामिड, दर्पण या दिशा परिवर्तन किसी रोग का इलाज, धन प्राप्ति या भाग्य बदलने का कोई वैज्ञानिक दावा नहीं करते।',
    
    // Header & Tabs
    tabUploadTrace: 'नक्शा व अंकन',
    tabCompassFacing: 'कम्पास व अभिमुखता',
    tabChakraOverlay: 'वास्तु चक्र आवरण',
    tabRoomAnalysis: 'कक्ष विश्लेषण',
    tabRemedies: 'उपाय व कार्ययोजना',
    tabCompare: 'कोण तुलना',
    tabReport: 'रिपोर्ट व निर्यात',
    tabSources: 'प्रामाणिक ग्रंथ संदर्भ',
    
    // Quick Actions
    loadDemoPlan: 'प्रामाणिक नमूना नक्शा लोड करें (3BHK)',
    resetPlan: 'नक्शा रीसेट करें',
    exportReportBtn: 'A4 रिपोर्ट प्रिंट / सुरक्षित करें',
    exportPngBtn: 'उच्च-रिजॉल्यूशन PNG डाउनलोड',
    exportJsonBtn: 'प्रोजेक्ट डेटा JSON डाउनलोड',
    languageSwitch: 'English',
    
    // Compass & Facing
    orientationSummary: 'दिशा निर्धारण व सटीक संरेखण',
    trueNorth: 'वास्तविक उत्तर दिशा (True North)',
    magneticNorth: 'चुंबकीय उत्तर (Magnetic)',
    declination: 'चुंबकीय झुकाव सुधार (Declination)',
    entranceFacing: 'मुख्य द्वार की बाहरी दिशा (Facing)',
    bearingAccuracy: 'मापन परिशुद्धता: ०.१° चरण',
    uncertaintyMargin: 'कोणीय अनिश्चितता मार्जिन (±°)',
    clockwiseConvention: '०° = उत्तर, ९०° = पूर्व, १८०° = दक्षिण, २७०° = पश्चिम (दक्षिणावर्त)',
    doorFacingExplanation: 'द्वार का मुख बाहर की ओर जाने वाला लंबवत तीर है, जो मकान की सामान्य दिशा से स्वतंत्र हो सकता है।',
    flipEntranceNormal: 'भीतर / बाहर तीर दिशा बदलें',
    presets: 'मुख्य दिशाएं',
    snapCardinal: '४५° पर स्वतः लॉक (सामान्यतः बंद)',
    
    // Overlay Controls
    analysisMode: 'विश्लेषण चक्र प्रारूप',
    mode8Zone: '८ दिशाएँ (अष्ट-दिक्पाल ४५°)',
    mode16Zone: '१६ कोणीय क्षेत्र (२२.५°)',
    modeMandala: '९×९ वास्तु पुरुष मण्डल ग्रिड',
    chakraCenter: 'चक्र का केंद्रीय संदर्भ बिंदु',
    centerFootprint: 'भवन निर्माण क्षेत्र का केंद्र (Centroid)',
    centerPlot: 'संपूर्ण भूखंड (Plot) का केंद्र',
    centerCustom: 'उपयोगकर्ता द्वारा चुना गया केंद्र',
    opacity: 'चक्र की पारदर्शिता',
    showRays: 'दिशा विभाजन रेखाएं दिखाएं',
    showBrahmasthan: 'केंद्रीय ब्रह्मस्थान (१/९ भाग) चिह्नित करें',
    
    // Findings & Analysis
    alignmentIndex: 'ग्रंथ-संरेखण सूचकांक',
    favorable: 'अनुकूल',
    acceptable: 'स्वीकार्य',
    unfavorable: 'समीक्षा अपेक्षित',
    neutral: 'सामान्य',
    brahmasthanStatus: 'ब्रह्मस्थान स्थिति',
    brahmasthanClear: 'केंद्र खुला एवं स्वच्छ',
    brahmasthanObstructed: 'केंद्रीय ब्रह्मस्थान में विस्तार',
    uncertaintyWarning: '± कोणीय मार्जिन पर दिशा बदलने की संभावना; सीमा रेखा जाँचें।',
    stableFinding: 'कोणीय मार्जिन में स्थिर।',
    
    // Remedy Tabs
    priorityDoNow: 'तत्काल करणीय',
    priorityLowCost: 'अल्प व्यय स्थान परिवर्तन',
    priorityProfessional: 'इंजीनियर / वास्तुविद् मूल्यांकन',
    priorityMajor: 'बड़ा जीर्णोद्धार (शर्तों के अधीन)',
    prioritySymbolic: 'वैकल्पिक लोक / प्रतीकात्मक उपाय',
    
    remedyCatA: 'श्रेणी क: व्यावहारिक वास्तु-शिल्प व वायु-संचार (प्राथमिकता १)',
    remedyCatB: 'श्रेणी ख: शास्त्रीय विन्यास संतुलन व कक्ष पुनर्गठन',
    remedyCatC: 'श्रेणी ग: समकालीन प्रतीकात्मक लोक उपाय (अपुष्ट)',
    
    // Rooms
    roomName: 'कक्ष का नाम',
    roomType: 'उपयोगिता श्रेणी',
    zoneDistribution: 'दिशा विस्तार (%)',
    primaryZone: 'प्रमुख दिशा',
    
    // Action Checklist
    actionChecklist: 'क्रियान्वयन व सत्यापन सूची',
    markReviewed: 'समीक्षित चिह्नित करें',
    reviewedStatus: 'समीक्षित',
    unreviewedStatus: 'समीक्षा लंबित',
  }
};
