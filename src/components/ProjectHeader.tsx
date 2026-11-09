/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Download, FileText, Globe, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { Language, TRANSLATIONS } from '../engine/i18n';
import { ProjectState } from '../engine/sampleData';

interface Props {
  project: ProjectState;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoadDemo: () => void;
  onResetPlan: () => void;
  onExportReport: () => void;
  onExportJson: () => void;
  onExportPng: () => void;
  alignmentScore: number;
}

export const ProjectHeader: React.FC<Props> = ({
  project,
  language,
  onLanguageChange,
  onLoadDemo,
  onResetPlan,
  onExportReport,
  onExportJson,
  onExportPng,
  alignmentScore,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Project Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-inner text-white font-bold">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white font-serif">
                {t.appTitle}
              </h1>
              <span className="text-[11px] font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                Survey 0.1°
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-2">
              <span>{project.name}</span>
              <span className="text-slate-600">•</span>
              <span className="capitalize">{project.propertyType}</span>
              <span className="text-slate-600">•</span>
              <span>{project.locationName}</span>
            </p>
          </div>
        </div>

        {/* Alignment Gauge Badge */}
        <div className="hidden md:flex items-center gap-2.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <div className="text-right">
            <div className="text-[10px] uppercase font-semibold text-slate-400">
              {t.alignmentIndex}
            </div>
            <div className="text-xs text-slate-300 font-mono">
              {alignmentScore}/100 <span className="text-[10px] text-amber-400">(Selected Texts)</span>
            </div>
          </div>
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-sm ${
              alignmentScore >= 80
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500'
                : alignmentScore >= 60
                ? 'bg-amber-950/80 text-amber-400 border-amber-500'
                : 'bg-rose-950/80 text-rose-400 border-rose-500'
            }`}
          >
            {alignmentScore}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 px-2.5 py-1.5 rounded-md transition"
            title="Load verified benchmark 3BHK Indian floor plan"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.loadDemoPlan}</span>
            <span className="sm:hidden">Demo</span>
          </button>

          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-medium px-2.5 py-1.5 rounded-md shadow transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.exportReportBtn}</span>
          </button>

          <div className="flex items-center border border-slate-700 rounded-md overflow-hidden bg-slate-800">
            <button
              onClick={onExportPng}
              className="p-1.5 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title={t.exportPngBtn}
              aria-label={t.exportPngBtn}
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onExportJson}
              className="px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-700 hover:text-white border-l border-slate-700 transition"
              title={t.exportJsonBtn}
            >
              JSON
            </button>
          </div>

          {/* Language Switch */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 px-2.5 py-1.5 rounded-md transition"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.languageSwitch}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
