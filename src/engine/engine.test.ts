/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Comprehensive Unit Tests for Vāstu Chakra Engine
 * Tested via Node.js built-in test runner and strict assertions.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalize360,
  magneticToTrue,
  trueToMagnetic,
  polygonArea,
  polygonCentroid,
  isPointInPolygon,
  isAngleInSector,
  calculateDoorFacing,
  calculateRoomZoneOverlaps,
  calculateUncertaintySensitivity,
  checkBrahmasthanOverlap,
  ZONES_8,
  ZONES_16,
} from './geometry';
import {
  evaluateRoomFindings,
  calculateAlignmentIndex,
  FindingResult,
} from './rules';

test('normalize360 properly wraps angles to [0, 360)', () => {
  assert.equal(normalize360(0), 0);
  assert.equal(normalize360(360), 0);
  assert.equal(normalize360(720), 0);
  assert.equal(normalize360(-90), 270);
  assert.equal(normalize360(-1), 359);
  assert.equal(normalize360(360.5), 0.5);
  assert.equal(Math.round(normalize360(359.9) * 10) / 10, 359.9);
});

test('magneticToTrue and trueToMagnetic calculate east-positive declination', () => {
  // Magnetic reading 14.4° + 0.8° East declination = 15.2° True
  assert.equal(Math.round(magneticToTrue(14.4, 0.8) * 10) / 10, 15.2);
  // Wraparound at 359.5° + 1.0° = 0.5°
  assert.equal(Math.round(magneticToTrue(359.5, 1.0) * 10) / 10, 0.5);
  // Reversible conversion
  const trueBearing = 15.2;
  const decl = 0.8;
  const mag = trueToMagnetic(trueBearing, decl);
  assert.equal(Math.round(mag * 10) / 10, 14.4);
});

test('polygonArea calculates exact area of known geometry', () => {
  // Rectangle 100 x 200 = 20,000
  const rect = [
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 200 },
    { x: 0, y: 200 },
  ];
  assert.equal(polygonArea(rect), 20000);

  // Right triangle base 50, height 80 = 2,000
  const tri = [
    { x: 0, y: 0 },
    { x: 50, y: 0 },
    { x: 0, y: 80 },
  ];
  assert.equal(polygonArea(tri), 2000);
});

test('polygonCentroid accurately computes moments center', () => {
  const rect = [
    { x: 100, y: 100 },
    { x: 300, y: 100 },
    { x: 300, y: 200 },
    { x: 100, y: 200 },
  ];
  const c = polygonCentroid(rect);
  assert.equal(c.x, 200);
  assert.equal(c.y, 150);
});

test('isPointInPolygon ray-casts point containment', () => {
  const polygon = [
    { x: 10, y: 10 },
    { x: 100, y: 10 },
    { x: 100, y: 100 },
    { x: 10, y: 100 },
  ];
  assert.equal(isPointInPolygon({ x: 50, y: 50 }, polygon), true);
  assert.equal(isPointInPolygon({ x: 5, y: 50 }, polygon), false);
  assert.equal(isPointInPolygon({ x: 200, y: 200 }, polygon), false);
});

test('isAngleInSector correctly handles 0° wraparound sector', () => {
  // Sector from 337.5° to 22.5° (North in 8-zone system)
  assert.equal(isAngleInSector(0, 337.5, 22.5), true);
  assert.equal(isAngleInSector(350, 337.5, 22.5), true);
  assert.equal(isAngleInSector(15, 337.5, 22.5), true);
  assert.equal(isAngleInSector(23, 337.5, 22.5), false);
  assert.equal(isAngleInSector(90, 337.5, 22.5), false);

  // Sector from 67.5° to 112.5° (East)
  assert.equal(isAngleInSector(90, 67.5, 112.5), true);
  assert.equal(isAngleInSector(70, 67.5, 112.5), true);
  assert.equal(isAngleInSector(115, 67.5, 112.5), false);
});

test('calculateDoorFacing determines outward normal direction', () => {
  // Door on right wall (x = 700), from y=200 to y=300
  // Standard outward normal points right (East, 90°)
  const door = {
    start: { x: 700, y: 200 },
    end: { x: 700, y: 300 },
  };
  const facingNormal = calculateDoorFacing(door, false, 0);
  assert.equal(facingNormal, 90);

  // Inverted normal points West (270°)
  const flippedNormal = calculateDoorFacing(door, true, 0);
  assert.equal(flippedNormal, 270);
});

test('calculateRoomZoneOverlaps identifies predominant zones', () => {
  const center = { x: 400, y: 350 };
  const northBeta = 0; // True North is image-up

  // Room in top-right (North-East from center)
  const neRoom = [
    { x: 500, y: 150 },
    { x: 650, y: 150 },
    { x: 650, y: 250 },
    { x: 500, y: 250 },
  ];
  const overlaps8 = calculateRoomZoneOverlaps(neRoom, center, northBeta, '8-zone');
  assert.ok(overlaps8.length > 0);
  assert.equal(overlaps8[0].zoneId, 'NE');
  assert.ok(overlaps8[0].overlapPercentage > 60);

  // Room in bottom-right (South-East from center)
  const seKitchen = [
    { x: 500, y: 450 },
    { x: 650, y: 450 },
    { x: 650, y: 550 },
    { x: 500, y: 550 },
  ];
  const seOverlaps = calculateRoomZoneOverlaps(seKitchen, center, northBeta, '8-zone');
  assert.ok(seOverlaps.length > 0);
  assert.equal(seOverlaps[0].zoneId, 'SE');
});

test('calculateUncertaintySensitivity flags boundary crossing within ±2°', () => {
  const center = { x: 400, y: 350 };
  // Place a room whose center is close to a 45° boundary (e.g. around 22.5° between N and NE)
  // At radius 200, angle ~22°
  const rad = (22.5 * Math.PI) / 180;
  const rx = 400 + 200 * Math.sin(rad);
  const ry = 350 - 200 * Math.cos(rad);
  const boundaryRoom = [
    { x: rx - 10, y: ry - 10 },
    { x: rx + 10, y: ry - 10 },
    { x: rx + 10, y: ry + 10 },
    { x: rx - 10, y: ry + 10 },
  ];

  const sensitivity = calculateUncertaintySensitivity(boundaryRoom, center, 0, 3.0, '8-zone');
  // Since it sits right on the boundary between N and NE, ±3° changes predominant sector
  assert.equal(sensitivity.isStable, false);
  assert.ok(sensitivity.crossedBoundaries.length > 0);
});

test('checkBrahmasthanOverlap detects central 1/9th core encroachment', () => {
  const bbox = { minX: 100, maxX: 700, minY: 100, maxY: 600 };
  // Brahmasthan is X in [300, 500], Y in [266.6, 433.3]

  // Room completely outside
  const outerRoom = [
    { x: 100, y: 100 },
    { x: 200, y: 100 },
    { x: 200, y: 200 },
    { x: 100, y: 200 },
  ];
  const outsideCheck = checkBrahmasthanOverlap(outerRoom, bbox);
  assert.equal(outsideCheck.overlaps, false);

  // Room overlapping center
  const centerRoom = [
    { x: 350, y: 300 },
    { x: 450, y: 300 },
    { x: 450, y: 400 },
    { x: 350, y: 400 },
  ];
  const insideCheck = checkBrahmasthanOverlap(centerRoom, bbox);
  assert.equal(insideCheck.overlaps, true);
  assert.ok(insideCheck.percentage > 90);
});

test('evaluateRoomFindings and calculateAlignmentIndex compute verifiable metrics', () => {
  const mockOverlaps = [
    {
      zoneId: 'SE',
      zoneNameEn: 'South-East',
      zoneNameHi: 'आग्नेय',
      sanskritName: 'Āgneya',
      element: 'Fire',
      color: '#f87171',
      overlapArea: 100,
      overlapPercentage: 100,
    }
  ];

  const kitchenFinding = evaluateRoomFindings(
    'KITCHEN_1',
    'Kitchen',
    'रसोई',
    'kitchen',
    mockOverlaps,
    { overlaps: false, percentage: 0 },
    { isStable: true, crossedBoundaries: [] }
  );

  assert.equal(kitchenFinding.status, 'favorable');
  assert.equal(kitchenFinding.predominantZone, 'SE');
  assert.ok(kitchenFinding.remedies.length > 0);

  const findings: FindingResult[] = [kitchenFinding];
  const index = calculateAlignmentIndex(findings);
  assert.equal(index.favorableCount, 1);
  assert.equal(index.indexScore, 100);
});
