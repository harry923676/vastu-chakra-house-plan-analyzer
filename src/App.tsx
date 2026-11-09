/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Vāstu Chakra — House Plan Analyzer
 * Production-quality, survey-grade, bilingual (English/Hindi) web application.
 */

import React, { useState, useMemo } from 'react';
import {
  Compass,
  Upload,
  Layers,
  CheckCircle2,
  FileText,
  BookOpen,
  ArrowRightLeft,
  Wrench,
  Sparkles,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { SAMPLE_PROJECT, ProjectState } from './engine/sampleData';
import { Language, TRANSLATIONS } from './engine/i18n';
import {
  polygonCentroid,
  calculateRoomZoneOverlaps,
  checkBrahmasthanOverlap,
  calculateUncertaintySensitivity,
  calculateDoorFacing,
} from './engine/geometry';
import { evaluateRoomFindings, calculateAlignmentIndex, FindingResult } from './engine/rules';
import { ProjectHeader } from './components/ProjectHeader';
import { CanvasPlanViewer } from './components/CanvasPlanViewer';
import { CompassTab } from './components/CompassTab';
import { ChakraControlsTab } from './components/ChakraControlsTab';
import { RoomAnalysisTab } from './components/RoomAnalysisTab';
import { RemediesTab } from './components/RemediesTab';
import { CompareTab } from './components/CompareTab';
import { ReportTab } from './components/ReportTab';
import { SourcesTab } from './components/SourcesTab';
import { UploadTraceTab } from './components/UploadTraceTab';
import { InspectorPanel } from './components/InspectorPanel';

export default function App() {
  const [project, setProject] = useState<ProjectState>(SAMPLE_PROJECT);
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('compass');
  const [activeRoomId, setActiveRoomId] = useState<string | null>('ROOM_KITCHEN');
  const [reviewedFindings, setReviewedFindings] = useState<Set<string>>(new Set());

  const t = TRANSLATIONS[language];

  // Dynamic geometry calculations
  const centroid = useMemo(() => {
    return polygonCentroid(project.buildingFootprint);
  }, [project.buildingFootprint]);

  const boundingBox = useMemo(() => {
    const minX = Math.min(...project.buildingFootprint.map((p) => p.x));
    const maxX = Math.max(...project.buildingFootprint.map((p) => p.x));
    const minY = Math.min(...project.buildingFootprint.map((p) => p.y));
    const maxY = Math.max(...project.buildingFootprint.map((p) => p.y));
    return { minX, maxX, minY, maxY };
  }, [project.buildingFootprint]);

  // Compute room findings dynamically on every angle/mode change
  const findings: FindingResult[] = useMemo(() => {
    const mode = project.selectedMode === '8-zone' ? '8-zone' : '16-zone';
    return project.rooms.map((room) => {
      const overlaps = calculateRoomZoneOverlaps(
        room.polygon,
        centroid,
        project.trueNorthBearingBeta,
        mode
      );
      const bCheck = checkBrahmasthanOverlap(room.polygon, boundingBox);
      const sensitivity = calculateUncertaintySensitivity(
        room.polygon,
        centroid,
        project.trueNorthBearingBeta,
        project.uncertaintyMarginDeg,
        mode
      );
      const res = evaluateRoomFindings(
        room.id,
        room.nameEn,
        room.nameHi,
        room.type,
        overlaps,
        bCheck,
        sensitivity
      );
      return {
        ...res,
        reviewed: reviewedFindings.has(res.id),
      };
    });
  }, [
    project.rooms,
    centroid,
    project.trueNorthBearingBeta,
    project.selectedMode,
    project.uncertaintyMarginDeg,
    boundingBox,
    reviewedFindings,
  ]);

  const alignmentStats = useMemo(() => {
    return calculateAlignmentIndex(findings);
  }, [findings]);

  const handleUpdateProject = (updates: Partial<ProjectState>) => {
    setProject((prev) => ({ ...prev, ...updates }));
  };

  const handleLoadDemo = () => {
    setProject({ ...SAMPLE_PROJECT });
    setActiveRoomId('ROOM_KITCHEN');
  };

  const handleResetPlan = () => {
    setProject((prev) => ({
      ...prev,
      rooms: [],
      doors: [],
      windows: [],
    }));
  };

  const handleToggleReview = (findingId: string) => {
    setReviewedFindings((prev) => {
      const next = new Set(prev);
      if (next.has(findingId)) next.delete(findingId);
      else next.add(findingId);
      return next;
    });
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `vastu_project_${project.id}.json`);
    dlAnchorElem.click();
  };

  const handleExportPng = () => {
    const svgEl = document.getElementById('vastu-plan-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    canvas.width = 1700;
    canvas.height = 1400;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.setAttribute('src', 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData))));
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const a = document.createElement('a');
        a.download = `vastu_annotated_plan_${Date.now()}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    };
  };

  const mainDoor = project.doors.find((d) => d.isMainEntrance) || project.doors[0];
  const doorFacingAngle = mainDoor
    ? calculateDoorFacing(mainDoor.segment, mainDoor.flipNormal, project.trueNorthBearingBeta)
    : 90;

  // Tabs definition
  const tabs = [
    { id: 'trace', label: t.tabUploadTrace, icon: Upload },
    { id: 'compass', label: t.tabCompassFacing, icon: Compass },
    { id: 'chakra', label: t.tabChakraOverlay, icon: Layers },
    { id: 'analysis', label: t.tabRoomAnalysis, icon: CheckCircle2 },
    { id: 'remedies', label: t.tabRemedies, icon: Wrench },
    { id: 'compare', label: t.tabCompare, icon: ArrowRightLeft },
    { id: 'report', label: t.tabReport, icon: FileText },
    { id: 'sources', label: t.tabSources, icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* 1. Project Navigation Header */}
      <ProjectHeader
        project={project}
        language={language}
        onLanguageChange={setLanguage}
        onLoadDemo={handleLoadDemo}
        onResetPlan={handleResetPlan}
        onExportReport={() => setActiveTab('report')}
        onExportJson={handleExportJson}
        onExportPng={handleExportPng}
        alignmentScore={alignmentStats.indexScore}
      />

      {/* 2. Primary Tabs Bar */}
      <nav aria-label="Main Navigation" className="bg-slate-900/90 border-b border-slate-800 sticky top-14 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto no-scrollbar py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Main Workspace Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3 sm:p-5 flex flex-col gap-5">
        {/* Upper Interactive Split View: Canvas + Right Inspector (shown for trace, compass, chakra, analysis) */}
        {activeTab !== 'report' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[520px]">
            {/* Interactive Floor Plan Canvas */}
            <div className="lg:col-span-8 flex flex-col h-[520px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
              <CanvasPlanViewer
                project={project}
                language={language}
                activeRoomId={activeRoomId}
                onSelectRoom={(id) => {
                  setActiveRoomId(id);
                  if (activeTab !== 'analysis' && activeTab !== 'remedies') {
                    // keep tab or inspect
                  }
                }}
              />
            </div>

            {/* Right Context Inspector */}
            <div className="lg:col-span-4 h-[520px]">
              <InspectorPanel
                project={project}
                findings={findings}
                activeRoomId={activeRoomId}
                alignmentIndex={alignmentStats.indexScore}
                language={language}
                onSelectTab={setActiveTab}
              />
            </div>
          </div>
        )}

        {/* Lower Active Tab Content Panel */}
        <section aria-label="Tab Content" className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-lg">
          {activeTab === 'trace' && (
            <UploadTraceTab
              project={project}
              language={language}
              activeRoomId={activeRoomId}
              onSelectRoom={setActiveRoomId}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {activeTab === 'compass' && (
            <CompassTab
              project={project}
              language={language}
              onUpdateOrientation={handleUpdateProject}
            />
          )}

          {activeTab === 'chakra' && (
            <ChakraControlsTab
              project={project}
              language={language}
              onUpdate={handleUpdateProject}
            />
          )}

          {activeTab === 'analysis' && (
            <RoomAnalysisTab
              findings={findings}
              language={language}
              activeRoomId={activeRoomId}
              onSelectRoom={setActiveRoomId}
              onToggleReview={handleToggleReview}
            />
          )}

          {activeTab === 'remedies' && (
            <RemediesTab findings={findings} language={language} />
          )}

          {activeTab === 'compare' && (
            <CompareTab project={project} language={language} />
          )}

          {activeTab === 'report' && (
            <ReportTab
              project={project}
              findings={findings}
              alignmentIndex={alignmentStats.indexScore}
              language={language}
              onExportJson={handleExportJson}
              onExportPng={handleExportPng}
            />
          )}

          {activeTab === 'sources' && (
            <SourcesTab language={language} />
          )}
        </section>
      </main>

      {/* 4. Bottom Survey Orientation Status Bar */}
      <footer className="bg-slate-950 border-t border-slate-800 py-2.5 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '15s' }} />
              True North: {project.trueNorthBearingBeta.toFixed(1)}°
            </span>
            <span className="text-slate-600">|</span>
            <span>Entrance Outward: {doorFacingAngle.toFixed(1)}°</span>
            <span className="text-slate-600">|</span>
            <span>Declination: +{project.magneticDeclination.toFixed(1)}° E</span>
          </div>

          <div className="text-[11px] text-slate-500">
            Center: <strong className="text-slate-400 capitalize">{project.selectedCenterType} Centroid</strong> • Grid:{' '}
            <strong className="text-slate-400">{project.selectedMode}</strong> • Precision: ±{project.uncertaintyMarginDeg}°
          </div>
        </div>
      </footer>
    </div>
  );
}
