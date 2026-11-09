/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Gold-Standard Realistic Sample Floor Plan (Explicitly labeled Fictional Demonstration)
 * Represents a standard 3BHK Indian residential layout (12m x 10m).
 */

import { Point, Segment } from './geometry';
import { RoomType } from './rules';

export interface RoomEntity {
  id: string;
  nameEn: string;
  nameHi: string;
  type: RoomType;
  polygon: Point[];
  color: string;
  notesEn?: string;
  notesHi?: string;
}

export interface DoorEntity {
  id: string;
  nameEn: string;
  nameHi: string;
  isMainEntrance: boolean;
  segment: Segment;
  flipNormal: boolean;
  widthMeters: number;
}

export interface WindowEntity {
  id: string;
  nameEn: string;
  segment: Segment;
}

export interface ProjectState {
  id: string;
  name: string;
  description: string;
  propertyType: 'residential' | 'commercial';
  constructionStage: 'existing' | 'proposed' | 'renovation';
  locationName: string;
  scaleMetersPerPixel: number; // e.g. 100px = 1.2m -> 0.012 m/px
  plotBoundary: Point[];
  buildingFootprint: Point[];
  selectedCenterType: 'footprint' | 'plot' | 'custom';
  customCenter: Point;
  trueNorthBearingBeta: number; // 0 to 359.9
  isMagneticMode: boolean;
  magneticBearing: number;
  magneticDeclination: number; // East positive
  uncertaintyMarginDeg: number; // e.g. ±1.5°
  selectedMode: '8-zone' | '16-zone' | 'mandala';
  chakraOpacity: number;
  showBoundaryRays: boolean;
  showBrahmasthan: boolean;
  rooms: RoomEntity[];
  doors: DoorEntity[];
  windows: WindowEntity[];
  activeFloorIndex: number;
}

export const SAMPLE_PROJECT: ProjectState = {
  id: 'DEMO_PROJECT_3BHK',
  name: 'Sample 3BHK Residence (Fictional Demo)',
  description: 'Verified benchmark architectural drawing representing a contemporary Indian 3BHK home with realistic non-zero North deviation (15.2°).',
  propertyType: 'residential',
  constructionStage: 'existing',
  locationName: 'Jaipur, Rajasthan, India',
  scaleMetersPerPixel: 0.015, // Canvas width 800px ~ 12 meters
  selectedCenterType: 'footprint',
  customCenter: { x: 400, y: 350 },
  trueNorthBearingBeta: 15.2, // 15.2° clockwise from image-up
  isMagneticMode: false,
  magneticBearing: 14.4,
  magneticDeclination: 0.8, // +0.8° East declination
  uncertaintyMarginDeg: 1.5,
  selectedMode: '16-zone',
  chakraOpacity: 0.22,
  showBoundaryRays: true,
  showBrahmasthan: true,
  activeFloorIndex: 0,

  plotBoundary: [
    { x: 50, y: 50 },
    { x: 750, y: 50 },
    { x: 750, y: 650 },
    { x: 50, y: 650 },
  ],

  buildingFootprint: [
    { x: 100, y: 100 },
    { x: 700, y: 100 },
    { x: 700, y: 600 },
    { x: 100, y: 600 },
  ],

  doors: [
    {
      id: 'DOOR_MAIN',
      nameEn: 'Main Entrance Door (Mahādvāra)',
      nameHi: 'मुख्य प्रवेश द्वार (महाद्वार)',
      isMainEntrance: true,
      segment: { start: { x: 700, y: 220 }, end: { x: 700, y: 280 } },
      flipNormal: false, // Normal points right (East)
      widthMeters: 1.2,
    },
    {
      id: 'DOOR_BALCONY',
      nameEn: 'North-East Balcony Door',
      nameHi: 'ईशान बालकनी द्वार',
      isMainEntrance: false,
      segment: { start: { x: 580, y: 100 }, end: { x: 620, y: 100 } },
      flipNormal: false,
      widthMeters: 0.9,
    },
    {
      id: 'DOOR_KITCHEN',
      nameEn: 'Kitchen Doorway',
      nameHi: 'रसोईघर द्वार',
      isMainEntrance: false,
      segment: { start: { x: 520, y: 440 }, end: { x: 560, y: 440 } },
      flipNormal: false,
      widthMeters: 0.9,
    }
  ],

  windows: [
    { id: 'WIN_1', nameEn: 'Living Room East Window', segment: { start: { x: 700, y: 260 }, end: { x: 700, y: 340 } } },
    { id: 'WIN_2', nameEn: 'Pooja North Window', segment: { start: { x: 630, y: 100 }, end: { x: 670, y: 100 } } },
    { id: 'WIN_3', nameEn: 'Kitchen South Window', segment: { start: { x: 600, y: 600 }, end: { x: 660, y: 600 } } },
    { id: 'WIN_4', nameEn: 'Master Bedroom West Window', segment: { start: { x: 100, y: 450 }, end: { x: 100, y: 530 } } },
  ],

  rooms: [
    {
      id: 'ROOM_POOJA',
      nameEn: 'Pooja & Meditation Room',
      nameHi: 'पूजा व ध्यान कक्ष',
      type: 'pooja_room',
      color: '#60a5fa', // Blue / Sacred Water
      polygon: [
        { x: 540, y: 100 },
        { x: 700, y: 100 },
        { x: 700, y: 200 },
        { x: 540, y: 200 },
      ],
      notesEn: 'Dedicated peaceful shrine with morning northeastern light.',
      notesHi: 'प्रातःकालीन शांत धूप से परिपूर्ण देवस्थान।',
    },
    {
      id: 'ROOM_LIVING',
      nameEn: 'Living & Dining Hall',
      nameHi: 'बैठक व भोजन दालान',
      type: 'living_room',
      color: '#34d399', // Emerald
      polygon: [
        { x: 300, y: 100 },
        { x: 540, y: 100 },
        { x: 540, y: 420 },
        { x: 700, y: 420 },
        { x: 700, y: 200 },
        { x: 540, y: 200 },
        { x: 300, y: 420 },
      ],
      notesEn: 'Expansive central living core bordering the Brahmasthāna.',
      notesHi: 'ब्रह्मस्थान से सटा विस्तृत खुला परिवार कक्ष।',
    },
    {
      id: 'ROOM_KITCHEN',
      nameEn: 'Kitchen & Pantry',
      nameHi: 'रसोईघर व भंडार',
      type: 'kitchen',
      color: '#f87171', // Red / Agni Fire
      polygon: [
        { x: 520, y: 420 },
        { x: 700, y: 420 },
        { x: 700, y: 600 },
        { x: 520, y: 600 },
      ],
      notesEn: 'Situated in South-East (Āgneya) quadrant, stove aligned facing East.',
      notesHi: 'आग्नेय कोण (दक्षिण-पूर्व) में पूर्व-मुखी चूल्हा व्यवस्था।',
    },
    {
      id: 'ROOM_MASTER_BED',
      nameEn: 'Master Bedroom',
      nameHi: 'मुख्य शयनकक्ष',
      type: 'master_bedroom',
      color: '#fbbf24', // Amber / Earth Nairṛtya
      polygon: [
        { x: 100, y: 400 },
        { x: 340, y: 400 },
        { x: 340, y: 600 },
        { x: 100, y: 600 },
      ],
      notesEn: 'Located in South-West (Nairṛtya) quadrant, ensuring privacy and acoustic quiet.',
      notesHi: 'नैऋत्य कोण में स्थित, श्रेष्ठ एकांत व स्थायित्व।',
    },
    {
      id: 'ROOM_BEDROOM_2',
      nameEn: 'Guest / Children Bedroom',
      nameHi: 'अतिथि / बाल शयनकक्ष',
      type: 'bedroom',
      color: '#a78bfa', // Purple / Space
      polygon: [
        { x: 100, y: 100 },
        { x: 300, y: 100 },
        { x: 300, y: 300 },
        { x: 100, y: 300 },
      ],
      notesEn: 'North-West (Vāyavya) bedroom with good evening cross-ventilation.',
      notesHi: 'वायव्य दिशा में शाम की ठंडी हवा से युक्त कक्ष।',
    },
    {
      id: 'ROOM_TOILET_1',
      nameEn: 'Common Toilet & Bath',
      nameHi: 'सार्वजनिक शौचालय व स्नानघर',
      type: 'toilet_bath',
      color: '#94a3b8', // Slate
      polygon: [
        { x: 100, y: 300 },
        { x: 240, y: 300 },
        { x: 240, y: 400 },
        { x: 100, y: 400 },
      ],
      notesEn: 'West-North-West sanitary location with external ventilation shaft.',
      notesHi: 'पश्चिम-वायव्य में बाहरी वेंटिलेशन शाफ्ट सहित शौचालय।',
    },
    {
      id: 'ROOM_TOILET_ATTACHED',
      nameEn: 'Attached Master Toilet',
      nameHi: 'संलग्न शौचालय (मास्टर बेड)',
      type: 'toilet_bath',
      color: '#64748b',
      polygon: [
        { x: 340, y: 480 },
        { x: 440, y: 480 },
        { x: 440, y: 600 },
        { x: 340, y: 600 },
      ],
      notesEn: 'Southern perimeter toilet with sealed traps and mechanical exhaust.',
      notesHi: 'दक्षिण दीवार पर सीलबंद ड्रेन और एक्जॉस्ट फैन सहित।',
    },
    {
      id: 'ROOM_BALCONY',
      nameEn: 'North-East Morning Balcony',
      nameHi: 'ईशान प्रभात बालकनी',
      type: 'balcony_terrace',
      color: '#38bdf8',
      polygon: [
        { x: 480, y: 60 },
        { x: 680, y: 60 },
        { x: 680, y: 100 },
        { x: 480, y: 100 },
      ],
      notesEn: 'Open verandah receiving fresh northeast morning breeze.',
      notesHi: 'सुबह की ताजी हवा और धूप का खुला स्थान।',
    }
  ]
};
