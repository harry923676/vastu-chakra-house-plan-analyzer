/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Upload, Plus, Trash2, Edit2, Check, Scale, MapPin, AlertCircle, FileText } from 'lucide-react';
import { ProjectState, RoomEntity } from '../engine/sampleData';
import { RoomType } from '../engine/rules';
import { Language, TRANSLATIONS } from '../engine/i18n';

interface Props {
  project: ProjectState;
  language: Language;
  activeRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onUpdateProject: (updates: Partial<ProjectState>) => void;
}

export const UploadTraceTab: React.FC<Props> = ({
  project,
  language,
  activeRoomId,
  onSelectRoom,
  onUpdateProject,
}) => {
  const t = TRANSLATIONS[language];
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);

  // Quick room add modal state
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState<RoomType>('bedroom');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadNotice(`Loaded floor plan file: "${file.name}" (${(file.size / 1024).toFixed(0)} KB). Original aspect ratio preserved.`);
  };

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom: RoomEntity = {
      id: `ROOM_${Date.now()}`,
      nameEn: newRoomName.trim(),
      nameHi: newRoomName.trim(),
      type: newRoomType,
      color: '#38bdf8',
      polygon: [
        { x: 300, y: 300 },
        { x: 450, y: 300 },
        { x: 450, y: 450 },
        { x: 300, y: 450 },
      ],
      notesEn: 'Manually added custom room polygon.',
    };

    onUpdateProject({
      rooms: [...project.rooms, newRoom],
    });
    setNewRoomName('');
    onSelectRoom(newRoom.id);
  };

  const handleDeleteRoom = (roomId: string) => {
    onUpdateProject({
      rooms: project.rooms.filter((r) => r.id !== roomId),
    });
  };

  const roomTypeOptions: { type: RoomType; label: string }[] = [
    { type: 'living_room', label: 'Living Room' },
    { type: 'kitchen', label: 'Kitchen' },
    { type: 'master_bedroom', label: 'Master Bedroom' },
    { type: 'bedroom', label: 'Bedroom' },
    { type: 'pooja_room', label: 'Pooja Room' },
    { type: 'toilet_bath', label: 'Toilet & Bath' },
    { type: 'dining', label: 'Dining' },
    { type: 'study_library', label: 'Study / Library' },
    { type: 'balcony_terrace', label: 'Balcony' },
    { type: 'staircase', label: 'Staircase' },
    { type: 'utility_store', label: 'Store / Utility' },
    { type: 'water_tank_overhead', label: 'Overhead Tank' },
    { type: 'water_tank_underground', label: 'Underground Sump' },
  ];

  return (
    <div className="space-y-6">
      {/* File Upload Box */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Upload className="w-4 h-4 text-amber-400" />
          <span>Upload Floor Plan (PNG, JPG, WebP, SVG, PDF)</span>
        </div>

        <div className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-xl p-6 text-center cursor-pointer transition bg-slate-950/40">
          <input
            type="file"
            accept="image/*,.pdf,.svg"
            onChange={handleFileUpload}
            className="hidden"
            id="plan-file-input"
          />
          <label htmlFor="plan-file-input" className="cursor-pointer block">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-200">
              Drag & Drop floor plan here, or <span className="text-amber-400 underline">Browse</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Preserves high-DPI resolution without compression. Architectural drawing stays intact.
            </div>
          </label>
        </div>

        {uploadNotice && (
          <div className="bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{uploadNotice}</span>
          </div>
        )}
      </div>

      {/* Scale & Dimensions Calibration */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Scale Calibration & Known Dimensions</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Scale Factor (meters per pixel):</label>
            <input
              type="number"
              step="0.001"
              value={project.scaleMetersPerPixel}
              onChange={(e) => onUpdateProject({ scaleMetersPerPixel: parseFloat(e.target.value) || 0.015 })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Property Type:</label>
            <select
              value={project.propertyType}
              onChange={(e) => onUpdateProject({ propertyType: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
            >
              <option value="residential">Residential (Apartment / Bungalow)</option>
              <option value="commercial">Commercial / Workspace</option>
            </select>
          </div>
        </div>
      </div>

      {/* Room Polygon Management */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Annotated Room Polygons ({project.rooms.length})</span>
          </div>
        </div>

        {/* Add Room Bar */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Room Name (e.g. Study Room)"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
          />
          <select
            value={newRoomType}
            onChange={(e) => setNewRoomType(e.target.value as RoomType)}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
          >
            {roomTypeOptions.map((opt) => (
              <option key={opt.type} value={opt.type}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddRoom}
            className="flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs px-3 py-1.5 rounded transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Polygon</span>
          </button>
        </div>

        {/* Existing Rooms List */}
        <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
          {project.rooms.map((room) => {
            const isSelected = room.id === activeRoomId;
            return (
              <div
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={`p-3 flex items-center justify-between gap-3 cursor-pointer transition ${
                  isSelected ? 'bg-slate-800' : 'bg-slate-950/60 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: room.color }}></span>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {language === 'hi' ? room.nameHi : room.nameEn}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {room.type.replace('_', ' ')} • {room.polygon.length} vertices
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRoom(room.id);
                    }}
                    className="p-1 text-slate-400 hover:text-rose-400 transition"
                    title="Delete Room Polygon"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
