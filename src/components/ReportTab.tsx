/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Printer, Download, FileJson, ShieldCheck, Compass, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ProjectState } from '../engine/sampleData';
import { FindingResult } from '../engine/rules';
import { Language, TRANSLATIONS } from '../engine/i18n';
import { calculateDoorFacing } from '../engine/geometry';

interface Props {
  project: ProjectState;
  findings: FindingResult[];
  alignmentIndex: number;
  language: Language;
  onExportJson: () => void;
  onExportPng: () => void;
}

export const ReportTab: React.FC<Props> = ({
  project,
  findings,
  alignmentIndex,
  language,
  onExportJson,
  onExportPng,
}) => {
  const t = TRANSLATIONS[language];

  const handlePrint = () => {
    window.print();
  };

  const mainDoor = project.doors.find((d) => d.isMainEntrance) || project.doors[0];
  const doorFacingAngle = mainDoor
    ? calculateDoorFacing(mainDoor.segment, mainDoor.flipNormal, project.trueNorthBearingBeta)
    : 90;

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in Print) */}
      <div className="print:hidden bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white">Print-Ready A4 Architectural Report</h2>
          <p className="text-xs text-slate-400">
            Formatted with crisp typography, verifiable citations, room findings, and safety disclaimers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            onClick={onExportPng}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            <Download className="w-4 h-4" />
            <span>Plan PNG</span>
          </button>
          <button
            onClick={onExportJson}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          >
            <FileJson className="w-4 h-4" />
            <span>Project JSON</span>
          </button>
        </div>
      </div>

      {/* A4 Printable Document Container */}
      <div className="bg-slate-900 print:bg-white print:text-black p-6 sm:p-10 rounded-2xl border border-slate-800 print:border-none shadow-xl space-y-8 font-sans max-w-4xl mx-auto">
        {/* Document Header */}
        <div className="border-b-2 border-amber-500 pb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 print:text-amber-700 font-bold">
              Architectural & Traditional Vāstu Assessment
            </div>
            <h1 className="text-2xl font-extrabold text-white print:text-black font-serif mt-1">
              Vāstu Chakra — House Plan Analysis Report
            </h1>
            <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
              Project: <strong className="text-slate-200 print:text-black">{project.name}</strong> • Location: {project.locationName}
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 print:text-gray-600">Generated Date</div>
            <div className="text-sm font-bold text-white print:text-black font-mono">
              {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="text-xs text-amber-400 print:text-amber-800 font-bold mt-1">
              Index: {alignmentIndex}/100
            </div>
          </div>
        </div>

        {/* Survey & Geodetic Alignment Parameters */}
        <div className="bg-slate-950 print:bg-gray-100 p-4 rounded-xl border border-slate-800 print:border-gray-300">
          <h3 className="text-xs font-bold text-slate-200 print:text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-amber-400 print:text-amber-600" />
            <span>1. Survey & Geodetic Alignment Reference</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">True North Bearing:</span>
              <strong className="text-white print:text-black font-mono text-sm">{project.trueNorthBearingBeta.toFixed(1)}° CW</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">Main Entrance Facing:</span>
              <strong className="text-amber-400 print:text-amber-800 font-mono text-sm">{doorFacingAngle.toFixed(1)}° Outward</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">Magnetic Declination:</span>
              <strong className="text-white print:text-black font-mono text-sm">+{project.magneticDeclination.toFixed(1)}° E (NOAA)</strong>
            </div>
            <div>
              <span className="text-slate-500 print:text-gray-600 block text-[10px]">Angle Uncertainty:</span>
              <strong className="text-white print:text-black font-mono text-sm">±{project.uncertaintyMarginDeg.toFixed(1)}° Margin</strong>
            </div>
          </div>
        </div>

        {/* Transparent Formula & Scope Notice */}
        <div className="text-xs text-slate-400 print:text-gray-700 leading-relaxed border-l-2 border-amber-500 pl-3">
          <strong>Alignment Index Formula:</strong> Index = (Σ weight_i × status_score_i) / (Σ weight_i) × 100.
          Scores are derived purely from spatial orientation relative to classical Indian architectural texts (Mayamatam, Mānasāra, Samarāṅgaṇa Sūtradhāra) and the Bureau of Indian Standards National Building Code (NBC 2016).
          <br />
          <em>Important Disclosure:</em> This assessment measures traditional spatial alignment and daylight/ventilation ergonomics. It is not an objective prediction of luck, health, or financial prosperity.
        </div>

        {/* Room Inventory & Findings Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-200 print:text-black uppercase tracking-wider">
            2. Room-by-Room Evaluation & Sector Distribution
          </h3>
          <div className="border border-slate-800 print:border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 print:bg-gray-200 text-slate-400 print:text-black uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Room Name</th>
                  <th className="p-2.5">Predominant Zone</th>
                  <th className="p-2.5">Zone Distribution</th>
                  <th className="p-2.5">Evaluation</th>
                  <th className="p-2.5">Uncertainty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                {findings.map((f) => (
                  <tr key={f.id} className="print:text-black">
                    <td className="p-2.5 font-semibold text-white print:text-black">
                      {f.roomNameEn} ({f.roomNameHi})
                    </td>
                    <td className="p-2.5 font-mono text-slate-300 print:text-gray-800">
                      {f.predominantZone}
                    </td>
                    <td className="p-2.5 font-mono text-[11px] text-slate-400 print:text-gray-700">
                      {f.overlapBreakdown.map((z) => `${z.zoneId}: ${z.overlapPercentage}%`).join(', ')}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          f.status === 'favorable'
                            ? 'text-emerald-400 print:text-emerald-800'
                            : f.status === 'acceptable'
                            ? 'text-sky-400 print:text-sky-800'
                            : 'text-amber-400 print:text-amber-800'
                        }`}
                      >
                        {f.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-2.5 text-[10px] text-slate-400 print:text-gray-700">
                      {f.isSensitiveToUncertainty ? '⚠️ Marginally Sensitive' : '✓ Stable'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Prioritized Remedies & Architectural Corrections */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-200 print:text-black uppercase tracking-wider">
            3. Actionable Remedies & Technical Enhancements
          </h3>
          <div className="space-y-3">
            {findings.flatMap((f) => f.remedies).map((r, idx) => (
              <div
                key={`${r.id}-${idx}`}
                className="bg-slate-950 print:bg-white p-3.5 rounded-lg border border-slate-800 print:border-gray-300 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white print:text-black">{r.titleEn}</h4>
                  <span className="text-[10px] font-semibold text-amber-400 print:text-amber-800 font-mono">
                    {r.priorityLabelEn} • {r.approximateCostBand}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 print:text-gray-700">
                  <strong>Expected Outcome:</strong> {r.expectedMeasurableOutcomeEn}
                </p>
                <p className="text-[11px] text-slate-400 print:text-gray-600">
                  <strong>Verification:</strong> {r.howToVerifyEn} | <strong>Safety:</strong> {r.safetyNotesEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Legal & Scientific Disclaimer */}
        <div className="pt-4 border-t border-slate-800 print:border-gray-300 text-[10px] text-slate-500 print:text-gray-600 leading-relaxed">
          <strong>Mandatory Architectural & Cultural Disclosure:</strong>
          This report is generated for educational and architectural planning purposes under the traditional Indian Vāstuśāstra framework. Structural, fire safety, and plumbing decisions must be executed in full compliance with local municipal building bye-laws and certified by a licensed structural engineer or architect.
        </div>
      </div>
    </div>
  );
};
