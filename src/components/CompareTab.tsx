/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, Compass, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { ProjectState } from '../engine/sampleData';
import { calculateRoomZoneOverlaps, polygonCentroid, checkBrahmasthanOverlap, calculateUncertaintySensitivity } from '../engine/geometry';
import { evaluateRoomFindings, calculateAlignmentIndex } from '../engine/rules';
import { Language, TRANSLATIONS } from '../engine/i18n';

interface Props {
  project: ProjectState;
  language: Language;
}

export const CompareTab: React.FC<Props> = ({ project, language }) => {
  const t = TRANSLATIONS[language];
  const [candidateAngle, setCandidateAngle] = useState<number>(0.0); // Compare against 0° True North

  const centroid = polygonCentroid(project.buildingFootprint);
  const minX = Math.min(...project.buildingFootprint.map((p) => p.x));
  const maxX = Math.max(...project.buildingFootprint.map((p) => p.x));
  const minY = Math.min(...project.buildingFootprint.map((p) => p.y));
  const maxY = Math.max(...project.buildingFootprint.map((p) => p.y));
  const bbox = { minX, maxX, minY, maxY };

  // Calculate Base Scenario (Current Orientation)
  const baseFindings = project.rooms.map((room) => {
    const overlaps = calculateRoomZoneOverlaps(room.polygon, centroid, project.trueNorthBearingBeta, project.selectedMode === '8-zone' ? '8-zone' : '16-zone');
    const bCheck = checkBrahmasthanOverlap(room.polygon, bbox);
    const sensitivity = calculateUncertaintySensitivity(room.polygon, centroid, project.trueNorthBearingBeta, project.uncertaintyMarginDeg, project.selectedMode === '8-zone' ? '8-zone' : '16-zone');
    return evaluateRoomFindings(room.id, room.nameEn, room.nameHi, room.type, overlaps, bCheck, sensitivity);
  });
  const baseIndex = calculateAlignmentIndex(baseFindings);

  // Calculate Candidate Scenario (Alternative Orientation)
  const candidateFindings = project.rooms.map((room) => {
    const overlaps = calculateRoomZoneOverlaps(room.polygon, centroid, candidateAngle, project.selectedMode === '8-zone' ? '8-zone' : '16-zone');
    const bCheck = checkBrahmasthanOverlap(room.polygon, bbox);
    const sensitivity = calculateUncertaintySensitivity(room.polygon, centroid, candidateAngle, project.uncertaintyMarginDeg, project.selectedMode === '8-zone' ? '8-zone' : '16-zone');
    return evaluateRoomFindings(room.id, room.nameEn, room.nameHi, room.type, overlaps, bCheck, sensitivity);
  });
  const candidateIndex = calculateAlignmentIndex(candidateFindings);

  return (
    <div className="space-y-6">
      {/* Notice distinguishing measurement vs physical house rotation */}
      <div className="bg-slate-900 border-l-4 border-sky-500 p-4 rounded-xl text-xs text-slate-300 leading-relaxed">
        <strong className="text-white block mb-1">
          Architectural Notice: Drawing Orientation vs. Physical Reconstruction
        </strong>
        Comparing angles in this analyzer evaluates the mathematical sensitivity of zone assignments. For an <em>existing constructed house</em>, the orientation of walls is physically fixed to the earth. Do not attempt hazardous structural rotation; instead use spatial reallocation or internal remedies. For a <em>proposed future construction</em>, this comparison allows optimizing plot layout before laying foundations.
      </div>

      {/* Angle Selector Bar */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-400">Current Measured Bearing:</div>
            <div className="text-lg font-bold font-mono text-amber-400">
              {project.trueNorthBearingBeta.toFixed(1)}° True North
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Test Alternative Bearing:</span>
            <input
              type="number"
              step="0.1"
              min="0"
              max="359.9"
              value={candidateAngle}
              onChange={(e) => setCandidateAngle(parseFloat(e.target.value) || 0)}
              className="w-24 bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-white text-center"
            />
            <span className="text-xs text-slate-400 font-mono">deg</span>
          </div>

          {/* Quick preset switches */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[0, 45, 90, 180, 270].map((deg) => (
              <button
                key={deg}
                onClick={() => setCandidateAngle(deg)}
                className={`px-2.5 py-1 text-xs font-mono rounded border transition ${
                  candidateAngle === deg
                    ? 'bg-sky-600 text-white border-sky-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {deg}°
              </button>
            ))}
          </div>
        </div>

        {/* Continuous Slider for candidate */}
        <input
          type="range"
          min="0"
          max="359.9"
          step="0.1"
          value={candidateAngle}
          onChange={(e) => setCandidateAngle(parseFloat(e.target.value))}
          className="w-full accent-sky-500 cursor-pointer"
        />
      </div>

      {/* Index Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenario A: Current */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Scenario A: Current Orientation
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">
              {project.trueNorthBearingBeta.toFixed(1)}°
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-extrabold text-white font-mono">
              {baseIndex.indexScore}
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </div>
            <div className="text-xs text-slate-400">
              {baseIndex.favorableCount} favorable, {baseIndex.unfavorableCount} review needed
            </div>
          </div>
        </div>

        {/* Scenario B: Candidate */}
        <div className="bg-slate-900 p-5 rounded-2xl border border-sky-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
              Scenario B: Tested Alternative
            </span>
            <span className="text-xs font-mono font-bold text-slate-300">
              {candidateAngle.toFixed(1)}°
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-3xl font-extrabold text-sky-300 font-mono">
              {candidateIndex.indexScore}
              <span className="text-xs text-slate-400 font-normal"> / 100</span>
            </div>
            <div className="text-xs text-slate-400">
              {candidateIndex.favorableCount} favorable, {candidateIndex.unfavorableCount} review needed
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Side-by-Side Room Comparison Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 font-bold text-xs text-slate-200">
          Room-by-Room Zone Shift & Transition Analysis
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px]">
              <tr>
                <th className="p-3">Room</th>
                <th className="p-3">Current Zone ({project.trueNorthBearingBeta.toFixed(1)}°)</th>
                <th className="p-3">Tested Zone ({candidateAngle.toFixed(1)}°)</th>
                <th className="p-3">Shift Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {project.rooms.map((room) => {
                const bF = baseFindings.find((f) => f.roomId === room.id);
                const cF = candidateFindings.find((f) => f.roomId === room.id);
                const isShifted = bF?.predominantZone !== cF?.predominantZone;

                return (
                  <tr key={room.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-white">
                      {language === 'hi' ? room.nameHi : room.nameEn}
                    </td>
                    <td className="p-3 font-mono text-slate-300">
                      {bF?.predominantZone || '—'} ({bF?.overlapBreakdown[0]?.overlapPercentage}%)
                    </td>
                    <td className="p-3 font-mono text-sky-300">
                      {cF?.predominantZone || '—'} ({cF?.overlapBreakdown[0]?.overlapPercentage}%)
                    </td>
                    <td className="p-3">
                      {isShifted ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          Crosses Boundary ({bF?.predominantZone} → {cF?.predominantZone})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-400">
                          Stable in {bF?.predominantZone}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
