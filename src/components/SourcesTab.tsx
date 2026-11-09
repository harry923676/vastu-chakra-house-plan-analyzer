/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { VERIFIED_SOURCES, SourceRecord } from '../engine/sources';
import { Language } from '../engine/i18n';

interface Props {
  language: Language;
}

export const SourcesTab: React.FC<Props> = ({ language }) => {
  const sources = Object.values(VERIFIED_SOURCES);

  const evidenceBadges: Record<string, { label: string; color: string }> = {
    CLASSICAL_VERIFIED: { label: 'Classical Text Verified', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    BUILDING_SCIENCE_CODE: { label: 'Building Science / Code Supported', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
    SCHOLARLY_INTERPRETATION: { label: 'Scholarly Interpretation', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    CONTEMPORARY_PRACTICE: { label: 'Contemporary Practitioner Convention', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    UNVERIFIED_ASSERTION: { label: 'Unverified Modern Assertion', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border-l-4 border-emerald-500 p-4 rounded-xl text-xs text-slate-300 leading-relaxed space-y-1">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Verifiable Sources & Evidence Provenance Registry</span>
        </h2>
        <p>
          Every rule in this engine is mapped to authentic documented literature: classical treatises preserved at the Indira Gandhi National Centre for the Arts (IGNCA), the Bureau of Indian Standards National Building Code (NBC 2016), and the NOAA World Magnetic Model. No invented citations or fabricated Sanskrit verses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src: SourceRecord) => {
          const badge = evidenceBadges[src.evidenceClass] || evidenceBadges.UNVERIFIED_ASSERTION;

          return (
            <div
              key={src.id}
              className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                    {badge.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{src.originalLanguage}</span>
                </div>

                <h3 className="text-sm font-bold text-white mt-2.5">{src.title}</h3>
                <div className="text-xs text-amber-400 font-mono mt-0.5">{src.chapterSection}</div>

                <p className="text-xs text-slate-400 mt-2">
                  <strong className="text-slate-300">Edition / Translator:</strong> {src.editorTranslatorEdition}
                </p>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-3 text-xs text-slate-300 italic leading-relaxed">
                  "{language === 'hi' ? src.citationTextHi : src.citationTextEn}"
                </div>

                <p className="text-[11px] text-slate-400 mt-2.5">
                  <strong className="text-slate-300">Scholarly Notes:</strong> {src.scholarlyNotes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 mt-3">
                <a
                  href={src.verifiableUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 hover:underline font-medium"
                >
                  <span>Archival & Catalog Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
