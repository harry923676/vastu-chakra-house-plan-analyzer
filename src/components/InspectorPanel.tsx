/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle, Layers, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { ProjectState } from '../engine/sampleData';
import { FindingResult } from '../engine/rules';
import { Language, TRANSLATIONS } from '../engine/i18n';
import { calculateDoorFacing } from '../engine/geometry';

interface Props {
  project: ProjectState;
  findings: FindingResult[];
  activeRoomId: string | null;
  alignmentIndex: number;
  language: Language;
  onSelectTab: (tab: string) => void;
}

export const InspectorPanel: React.FC<Props> = ({
  project,
  findings,
  activeRoomId,
  alignmentIndex,
  language,
  onSelectTab,
}) => {
  const t = TRANSLATIONS[language];

  const activeFinding = findings.find((f) => f.roomId === activeRoomId) || findings[0];
  const mainDoor = project.doors.find((d) => d.isMainEntrance) || project.doors[0];
  const doorFacingAngle = mainDoor
    ? calculateDoorFacing(mainDoor.segment, mainDoor.flipNormal, project.trueNorthBearingBeta)
    : 90;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 h-full overflow-y-auto">
      {/* Alignment Gauge Header */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            {t.alignmentIndex}
          </span>
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
              alignmentIndex >= 80
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500'
                : alignmentIndex >= 60
                ? 'bg-amber-950/80 text-amber-400 border-amber-500'
                : 'bg-rose-950/80 text-rose-400 border-rose-500'
            }`}
          >
            {alignmentIndex}/100
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 ${
              alignmentIndex >= 80 ? 'bg-emerald-500' : alignmentIndex >= 60 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${alignmentIndex}%` }}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-400">
          <span>{findings.filter((f) => f.status === 'favorable').length} Favorable</span>
          <span>{findings.filter((f) => f.status === 'unfavorable').length} Review Needed</span>
        </div>
      </div>

      {/* Live Geodetic Orientation Badge */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs">
        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
          <span>Orientation Readout</span>
          <button
            onClick={() => onSelectTab('compass')}
            className="text-amber-400 hover:underline flex items-center gap-0.5 text-[10px]"
          >
            Adjust <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
        <div className="flex items-center justify-between font-mono">
          <span className="text-slate-400">True North:</span>
          <span className="font-bold text-white">{project.trueNorthBearingBeta.toFixed(1)}° CW</span>
        </div>
        <div className="flex items-center justify-between font-mono">
          <span className="text-slate-400">Entrance Facing:</span>
          <span className="font-bold text-amber-300">{doorFacingAngle.toFixed(1)}° Outward</span>
        </div>
        <div className="flex items-center justify-between font-mono">
          <span className="text-slate-400">Declination:</span>
          <span className="text-slate-300">+{project.magneticDeclination.toFixed(1)}° E</span>
        </div>
        <div className="flex items-center justify-between font-mono">
          <span className="text-slate-400">Uncertainty:</span>
          <span className="text-slate-300">±{project.uncertaintyMarginDeg.toFixed(1)}°</span>
        </div>
      </div>

      {/* Selected Room Inspector */}
      {activeFinding ? (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white">
                {language === 'hi' ? activeFinding.roomNameHi : activeFinding.roomNameEn}
              </h3>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                activeFinding.status === 'favorable'
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500'
                  : activeFinding.status === 'acceptable'
                  ? 'bg-sky-950/80 text-sky-400 border-sky-500'
                  : 'bg-amber-950/80 text-amber-400 border-amber-500'
              }`}
            >
              {activeFinding.status.toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {language === 'hi' ? activeFinding.rationaleHi : activeFinding.rationaleEn}
          </p>

          {/* Overlap distribution */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Zone Distribution:
            </span>
            <div className="space-y-1">
              {activeFinding.overlapBreakdown.map((z) => (
                <div key={z.zoneId} className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color }}></span>
                    <span>{z.zoneNameEn} ({z.sanskritName})</span>
                  </span>
                  <span className="font-bold text-white">{z.overlapPercentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Step */}
          {activeFinding.remedies.length > 0 && (
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-[10px] text-amber-400 uppercase font-semibold block">
                Top Feasible Recommendation:
              </span>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs">
                <div className="font-bold text-slate-200">
                  {language === 'hi' ? activeFinding.remedies[0].titleHi : activeFinding.remedies[0].titleEn}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  {activeFinding.remedies[0].approximateCostBand} • {activeFinding.remedies[0].estimatedEffort}
                </div>
                <button
                  onClick={() => onSelectTab('remedies')}
                  className="mt-2 text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
                >
                  View Full Remedy Protocol <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-xs text-slate-500 text-center py-6">
          Click any room on the plan to inspect detailed findings.
        </div>
      )}
    </div>
  );
};
