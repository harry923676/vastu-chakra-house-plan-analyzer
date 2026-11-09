/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle, BookOpen, ExternalLink, Filter, MapPin } from 'lucide-react';
import { FindingResult } from '../engine/rules';
import { VERIFIED_SOURCES } from '../engine/sources';
import { Language, TRANSLATIONS } from '../engine/i18n';

interface Props {
  findings: FindingResult[];
  language: Language;
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onToggleReview: (findingId: string) => void;
}

export const RoomAnalysisTab: React.FC<Props> = ({
  findings,
  language,
  activeRoomId,
  onSelectRoom,
  onToggleReview,
}) => {
  const t = TRANSLATIONS[language];
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCitationId, setSelectedCitationId] = useState<string | null>(null);

  const filteredFindings = findings.filter((f) => {
    if (filterStatus === 'all') return true;
    return f.status === filterStatus;
  });

  const activeSource = selectedCitationId ? VERIFIED_SOURCES[selectedCitationId] : null;

  return (
    <div className="space-y-5">
      {/* Filters and Stats Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Findings:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'favorable', 'acceptable', 'unfavorable'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition capitalize ${
                  filterStatus === st
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all'
                  ? `All (${findings.length})`
                  : st === 'favorable'
                  ? `${t.favorable} (${findings.filter((f) => f.status === 'favorable').length})`
                  : st === 'acceptable'
                  ? `${t.acceptable} (${findings.filter((f) => f.status === 'acceptable').length})`
                  : `${t.unfavorable} (${findings.filter((f) => f.status === 'unfavorable').length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Click any card to highlight on floor plan.
        </div>
      </div>

      {/* Findings Cards List */}
      <div className="space-y-4">
        {filteredFindings.map((finding) => {
          const isSelected = finding.roomId === activeRoomId;
          const statusColors = {
            favorable: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
            acceptable: 'border-sky-500/40 bg-sky-950/20 text-sky-400',
            unfavorable: 'border-amber-500/50 bg-amber-950/25 text-amber-400',
            neutral: 'border-slate-700 bg-slate-900 text-slate-400',
          };

          return (
            <div
              key={finding.id}
              onClick={() => onSelectRoom(finding.roomId)}
              className={`p-4 rounded-xl border transition cursor-pointer ${
                isSelected
                  ? 'border-amber-500 bg-slate-900/90 shadow-md ring-1 ring-amber-500/50'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Title & Status Badge */}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white">
                      {language === 'hi' ? finding.roomNameHi : finding.roomNameEn}
                    </h3>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        statusColors[finding.status]
                      }`}
                    >
                      {finding.status === 'favorable' && <CheckCircle2 className="w-3 h-3" />}
                      {finding.status === 'acceptable' && <HelpCircle className="w-3 h-3" />}
                      {finding.status === 'unfavorable' && <AlertTriangle className="w-3 h-3" />}
                      <span>
                        {finding.status === 'favorable'
                          ? t.favorable
                          : finding.status === 'acceptable'
                          ? t.acceptable
                          : finding.status === 'unfavorable'
                          ? t.unfavorable
                          : t.neutral}
                      </span>
                    </span>

                    {/* Uncertainty Sensitivity Badge */}
                    {finding.isSensitiveToUncertainty ? (
                      <span className="text-[10px] text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        ⚠️ Marginally sensitive (± angle crosses boundary)
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        ✓ Stable under ± margin
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {language === 'hi' ? finding.rationaleHi : finding.rationaleEn}
                  </p>
                </div>

                {/* Quick Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCitationId(finding.sourceId);
                    }}
                    className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-2 py-1 rounded transition"
                    title="View Classical Source Citation"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Source</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleReview(finding.id);
                    }}
                    className={`text-[11px] px-2 py-1 rounded border transition ${
                      finding.reviewed
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-600'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {finding.reviewed ? t.reviewedStatus : t.markReviewed}
                  </button>
                </div>
              </div>

              {/* Zone Overlap Breakdown Bars */}
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>{t.zoneDistribution}:</span>
                  <span className="font-mono text-slate-500 text-[10px]">Deterministic Polygon Sampling</span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-slate-950 border border-slate-800">
                  {finding.overlapBreakdown.map((z) => (
                    <div
                      key={z.zoneId}
                      style={{ width: `${z.overlapPercentage}%`, backgroundColor: z.color }}
                      title={`${z.zoneNameEn} (${z.sanskritName}): ${z.overlapPercentage}%`}
                      className="h-full transition-all duration-300"
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {finding.overlapBreakdown.map((z) => (
                    <span key={z.zoneId} className="text-[11px] text-slate-300 flex items-center gap-1.5 font-mono">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: z.color }}></span>
                      <span>
                        {language === 'hi' ? z.zoneNameHi : z.zoneNameEn} ({z.sanskritName}):{' '}
                        <strong className="text-white">{z.overlapPercentage}%</strong>
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Brahmasthan Impact Alert */}
              {finding.brahmasthanIntersects && (
                <div className="mt-3 bg-amber-950/20 border border-amber-600/30 rounded-lg p-2.5 flex items-center gap-2 text-xs text-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    Intersects Brahmasthāna central 1/9th core by <strong>{finding.brahmasthanOverlapPct}%</strong>.
                    Ensure structural columns or sanitation fixtures do not block this unburdened center.
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Classical Citation Modal */}
      {activeSource && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">{activeSource.title}</h4>
              </div>
              <button
                onClick={() => setSelectedCitationId(null)}
                className="text-slate-400 hover:text-white text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block font-semibold">Attribution & Edition:</span>
                <p className="text-slate-200">{activeSource.editorTranslatorEdition}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Chapter & Section:</span>
                <p className="text-amber-300 font-mono">{activeSource.chapterSection}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Text Excerpt / Paraphrase
                </span>
                <p className="text-slate-200 italic leading-relaxed">
                  "{language === 'hi' ? activeSource.citationTextHi : activeSource.citationTextEn}"
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-semibold">Scholarly Notes:</span>
                <p className="text-slate-300">{activeSource.scholarlyNotes}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <a
                href={activeSource.verifiableUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
              >
                <span>View Archival / IGNCA Catalog</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedCitationId(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
