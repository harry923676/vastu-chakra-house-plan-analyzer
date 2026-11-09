/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Clock,
  DollarSign,
  UserCheck,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { FindingResult, RemedyItem, RemedyCategory } from '../engine/rules';
import { Language, TRANSLATIONS } from '../engine/i18n';

interface Props {
  findings: FindingResult[];
  language: Language;
}

interface ActionItemRecord {
  remedyId: string;
  completed: boolean;
  actualCost: string;
  dateCompleted: string;
  notes: string;
}

export const RemediesTab: React.FC<Props> = ({ findings, language }) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<RemedyCategory | 'ALL'>('ALL');
  const [actionLog, setActionLog] = useState<Record<string, ActionItemRecord>>({});

  // Collect all unique remedies from findings
  const allRemediesWithRoom: { roomName: string; remedy: RemedyItem }[] = [];
  findings.forEach((f) => {
    f.remedies.forEach((r) => {
      if (!allRemediesWithRoom.some((item) => item.remedy.id === r.id)) {
        allRemediesWithRoom.push({
          roomName: language === 'hi' ? f.roomNameHi : f.roomNameEn,
          remedy: r,
        });
      }
    });
  });

  const filteredRemedies = allRemediesWithRoom.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.remedy.category === selectedCategory;
  });

  const toggleAction = (remedyId: string) => {
    setActionLog((prev) => {
      const existing = prev[remedyId] || {
        remedyId,
        completed: false,
        actualCost: '',
        dateCompleted: '',
        notes: '',
      };
      return {
        ...prev,
        [remedyId]: {
          ...existing,
          completed: !existing.completed,
          dateCompleted: !existing.completed ? new Date().toISOString().split('T')[0] : '',
        },
      };
    });
  };

  const updateActionDetails = (remedyId: string, updates: Partial<ActionItemRecord>) => {
    setActionLog((prev) => {
      const existing = prev[remedyId] || {
        remedyId,
        completed: false,
        actualCost: '',
        dateCompleted: '',
        notes: '',
      };
      return {
        ...prev,
        [remedyId]: { ...existing, ...updates },
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Honesty & Ethics Banner */}
      <div className="bg-slate-900 border-l-4 border-amber-500 p-4 rounded-xl shadow-sm space-y-1.5">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>{t.scientificNoticeTitle}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {t.scientificNoticeBody}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            selectedCategory === 'ALL'
              ? 'bg-amber-600 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          All Feasible Options ({allRemediesWithRoom.length})
        </button>
        <button
          onClick={() => setSelectedCategory('A_ARCHITECTURAL_PRACTICAL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            selectedCategory === 'A_ARCHITECTURAL_PRACTICAL'
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {t.remedyCatA}
        </button>
        <button
          onClick={() => setSelectedCategory('B_TRADITIONAL_LAYOUT')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            selectedCategory === 'B_TRADITIONAL_LAYOUT'
              ? 'bg-sky-600 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {t.remedyCatB}
        </button>
        <button
          onClick={() => setSelectedCategory('C_SYMBOLIC_OPTIONAL')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
            selectedCategory === 'C_SYMBOLIC_OPTIONAL'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {t.remedyCatC}
        </button>
      </div>

      {/* Remedies List */}
      <div className="space-y-5">
        {filteredRemedies.map(({ roomName, remedy }) => {
          const action = actionLog[remedy.id] || {
            remedyId: remedy.id,
            completed: false,
            actualCost: '',
            dateCompleted: '',
            notes: '',
          };

          return (
            <div
              key={remedy.id}
              className={`p-5 rounded-2xl border transition ${
                action.completed
                  ? 'bg-emerald-950/20 border-emerald-500/50'
                  : remedy.category === 'A_ARCHITECTURAL_PRACTICAL'
                  ? 'bg-slate-900 border-slate-700/80'
                  : remedy.category === 'B_TRADITIONAL_LAYOUT'
                  ? 'bg-slate-900 border-sky-900/50'
                  : 'bg-slate-900 border-purple-900/40'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {roomName}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        remedy.category === 'A_ARCHITECTURAL_PRACTICAL'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : remedy.category === 'B_TRADITIONAL_LAYOUT'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      }`}
                    >
                      {language === 'hi' ? remedy.categoryLabelHi : remedy.categoryLabelEn}
                    </span>
                    <span className="text-[11px] font-medium bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                      {language === 'hi' ? remedy.priorityLabelHi : remedy.priorityLabelEn}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mt-2">
                    {language === 'hi' ? remedy.titleHi : remedy.titleEn}
                  </h3>
                </div>

                {/* Mark Done Checkbox */}
                <button
                  onClick={() => toggleAction(remedy.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    action.completed
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{action.completed ? 'Implemented' : 'Mark Implemented'}</span>
                </button>
              </div>

              {/* Action Steps */}
              <div className="mt-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Feasible Action Protocol:
                </div>
                <ul className="space-y-1.5">
                  {(language === 'hi' ? remedy.stepsHi : remedy.stepsEn).map((step, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practical Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    <span>Cost Band</span>
                  </div>
                  <div className="font-semibold text-slate-200 mt-0.5">{remedy.approximateCostBand}</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" />
                    <span>Estimated Effort</span>
                  </div>
                  <div className="font-semibold text-slate-200 mt-0.5">{remedy.estimatedEffort}</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>Reversible</span>
                  </div>
                  <div className="font-semibold text-slate-200 mt-0.5">{remedy.reversible ? 'Yes (100%)' : 'Structural'}</div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-purple-400" />
                    <span>Execution</span>
                  </div>
                  <div className="font-semibold text-slate-200 mt-0.5">
                    {remedy.needsProfessional ? 'Licensed Trades' : 'DIY / Self'}
                  </div>
                </div>
              </div>

              {/* Measurable Outcome & Verification */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-950/20 border border-emerald-600/30 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Expected Measurable Outcome:
                  </span>
                  <p className="text-slate-200 mt-1">
                    {language === 'hi' ? remedy.expectedMeasurableOutcomeHi : remedy.expectedMeasurableOutcomeEn}
                  </p>
                </div>

                <div className="bg-sky-950/20 border border-sky-600/30 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                    Verification Method:
                  </span>
                  <p className="text-slate-200 mt-1">
                    {language === 'hi' ? remedy.howToVerifyHi : remedy.howToVerifyEn}
                  </p>
                </div>
              </div>

              {/* Safety Caveat */}
              <div className="mt-3 text-[11px] text-amber-300/90 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  Safety Note: {language === 'hi' ? remedy.safetyNotesHi : remedy.safetyNotesEn}
                </span>
              </div>

              {/* Implementation Log Sub-form */}
              {action.completed && (
                <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block">Date Completed</label>
                    <input
                      type="date"
                      value={action.dateCompleted}
                      onChange={(e) => updateActionDetails(remedy.id, { dateCompleted: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Actual Cost Incurred</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹3,500"
                      value={action.actualCost}
                      onChange={(e) => updateActionDetails(remedy.id, { actualCost: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block">Verification Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Measured 2.5°C temp drop"
                      value={action.notes}
                      onChange={(e) => updateActionDetails(remedy.id, { notes: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
