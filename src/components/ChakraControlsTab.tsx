/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Layers, Eye, Compass, Grid, Info, ShieldCheck } from 'lucide-react';
import { ProjectState } from '../engine/sampleData';
import { Language, TRANSLATIONS } from '../engine/i18n';
import { polygonCentroid } from '../engine/geometry';

interface Props {
  project: ProjectState;
  language: Language;
  onUpdate: (updates: Partial<ProjectState>) => void;
}

export const ChakraControlsTab: React.FC<Props> = ({
  project,
  language,
  onUpdate,
}) => {
  const t = TRANSLATIONS[language];

  const footprintCentroid = polygonCentroid(project.buildingFootprint);
  const plotCentroid = polygonCentroid(project.plotBoundary);

  return (
    <div className="space-y-6">
      {/* Grid Mode Selection */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
          <Grid className="w-4 h-4 text-amber-400" />
          <span>{t.analysisMode}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 16 Zones (Modern Architectural Standard) */}
          <button
            onClick={() => onUpdate({ selectedMode: '16-zone' })}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
              project.selectedMode === '16-zone'
                ? 'bg-amber-950/30 border-amber-500 text-white shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{t.mode16Zone}</span>
                {project.selectedMode === '16-zone' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Sixteen 22.5° angular sectors. Popular contemporary practitioner convention for fine spatial subdivisions.
              </p>
            </div>
            <span className="text-[10px] text-amber-400/80 font-mono mt-3">
              16 sectors × 22.5° = 360°
            </span>
          </button>

          {/* 8 Directions (Asta-Dikpala Classical) */}
          <button
            onClick={() => onUpdate({ selectedMode: '8-zone' })}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
              project.selectedMode === '8-zone'
                ? 'bg-amber-950/30 border-amber-500 text-white shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{t.mode8Zone}</span>
                {project.selectedMode === '8-zone' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Classical Aṣṭa-Dikpāla (45° sectors): N, NE, E, SE, S, SW, W, NW. Grounded in Mayamatam & Mānasāra texts.
              </p>
            </div>
            <span className="text-[10px] text-cyan-400/80 font-mono mt-3">
              8 directions × 45° = 360°
            </span>
          </button>

          {/* 9x9 Vastu Purusha Mandala */}
          <button
            onClick={() => onUpdate({ selectedMode: 'mandala' })}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
              project.selectedMode === 'mandala'
                ? 'bg-amber-950/30 border-amber-500 text-white shadow-sm'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{t.modeMandala}</span>
                {project.selectedMode === 'mandala' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Authentic 81-pada (Paramaśāyika) grid with central 3×3 Brahmasthāna core and perimeter guardian devatās.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-mono mt-3">
              9×9 = 81 Pada Classical Grid
            </span>
          </button>
        </div>
      </div>

      {/* Centroid & Reference Center Point */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>{t.chakraCenter}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => onUpdate({ selectedCenterType: 'footprint' })}
            className={`p-3 rounded-lg border text-left transition ${
              project.selectedCenterType === 'footprint'
                ? 'bg-amber-950/20 border-amber-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <div className="font-semibold text-xs">{t.centerFootprint}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              ({footprintCentroid.x.toFixed(0)}, {footprintCentroid.y.toFixed(0)}) px
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Standard architectural recommendation for built-up apartments & flats.
            </p>
          </button>

          <button
            onClick={() => onUpdate({ selectedCenterType: 'plot' })}
            className={`p-3 rounded-lg border text-left transition ${
              project.selectedCenterType === 'plot'
                ? 'bg-amber-950/20 border-amber-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <div className="font-semibold text-xs">{t.centerPlot}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              ({plotCentroid.x.toFixed(0)}, {plotCentroid.y.toFixed(0)}) px
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Used when assessing independent villas, bungalows, or open plots.
            </p>
          </button>

          <button
            onClick={() => onUpdate({ selectedCenterType: 'custom' })}
            className={`p-3 rounded-lg border text-left transition ${
              project.selectedCenterType === 'custom'
                ? 'bg-amber-950/20 border-amber-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <div className="font-semibold text-xs">{t.centerCustom}</div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              ({project.customCenter.x}, {project.customCenter.y}) px
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              User-specified reference point for irregular, L-shaped, or split-level layouts.
            </p>
          </button>
        </div>
      </div>

      {/* Visual Layer Toggles & Opacity Slider */}
      <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Layer Visibility & Transparency</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Opacity Slider */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">{t.opacity}</span>
              <span className="font-mono text-amber-400">
                {Math.round(project.chakraOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.65"
              step="0.01"
              value={project.chakraOpacity}
              onChange={(e) => onUpdate({ chakraOpacity: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Preserves underlying architectural lines without visual clutter.
            </p>
          </div>

          {/* Feature Checkboxes */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-3">
            <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={project.showBoundaryRays}
                onChange={(e) => onUpdate({ showBoundaryRays: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span>{t.showRays}</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={project.showBrahmasthan}
                onChange={(e) => onUpdate({ showBrahmasthan: e.target.checked })}
                className="w-4 h-4 accent-amber-500 rounded"
              />
              <span>{t.showBrahmasthan}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
