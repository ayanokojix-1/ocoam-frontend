import { useState } from 'react';
import { ChevronDown, ArrowLeft } from 'lucide-react';
import curriculumData from '../data/curriculum.json';

function DataTable({ rows }) {
  if (!rows || rows.length === 0) return null;

  const columns = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach((key) => {
        if (key === 'semester') return;
        set.add(key);
      });
      return set;
    }, new Set())
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-green-100">
      <table className="min-w-full text-sm">
        <thead className="bg-green-50">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2 text-left font-semibold text-green-900 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, i) => (
            <tr key={i} className="even:bg-gray-50">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2 align-top text-gray-700">
                  {row[col] ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CourseSection({ label, courses }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-green-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center gap-3 px-4 py-3 bg-green-50 hover:bg-green-100 transition-colors font-semibold text-green-900 text-left"
      >
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="p-4">
          <DataTable rows={courses} />
        </div>
      )}
    </div>
  );
}

function PathwayBlock({ pathway }) {
  if (!pathway) return null;

  const courseBlocks = pathway.semesters || pathway.phases || [];

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-bold text-green-800">{pathway.name}</h4>

      {pathway.note && (
        <p className="text-sm text-gray-600 bg-gray-50 border-l-4 border-gray-300 p-3 rounded">
          {pathway.note}
        </p>
      )}

      {pathway.overview && (
        <div>
          <h5 className="font-semibold text-green-900 mb-2">Overview</h5>
          <DataTable rows={pathway.overview} />
        </div>
      )}

      {pathway.epaa_placement && (
        <div>
          <h5 className="font-semibold text-green-900 mb-2">Entry-Point Apprenticeship Assessment (EPAA) Placement</h5>
          <DataTable rows={pathway.epaa_placement} />
        </div>
      )}

      {courseBlocks.length > 0 && (
        <div className="space-y-3">
          {courseBlocks.map((block, i) => (
            <CourseSection key={i} label={block.label} courses={block.courses} />
          ))}
        </div>
      )}

      {pathway.phase_structure && (
        <div>
          <h5 className="font-semibold text-green-900 mb-2">Phase Structure</h5>
          <DataTable rows={pathway.phase_structure} />
        </div>
      )}
    </div>
  );
}

function ProgrammeBlock({ programme }) {
  const [activePathway, setActivePathway] = useState('pathway_1');

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 space-y-8">
      <h3 className="text-2xl font-bold text-green-900">{programme.name}</h3>

      {programme.apprenticeship_stages && (
        <div>
          <h4 className="font-bold text-green-800 mb-3">Apprenticeship Stages</h4>
          <DataTable rows={programme.apprenticeship_stages} />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActivePathway('pathway_1')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activePathway === 'pathway_1'
              ? 'bg-green-700 text-white'
              : 'bg-green-50 text-green-800 hover:bg-green-100'
          }`}
        >
          Pathway 1 (Full-Time)
        </button>
        <button
          type="button"
          onClick={() => setActivePathway('pathway_2')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
            activePathway === 'pathway_2'
              ? 'bg-green-700 text-white'
              : 'bg-green-50 text-green-800 hover:bg-green-100'
          }`}
        >
          Pathway 2 (Part-Time)
        </button>
      </div>

      <PathwayBlock pathway={programme[activePathway]} />

      {programme.bridging_module && (
        <div className="border-t-2 border-gray-100 pt-6">
          <h4 className="font-bold text-green-800 mb-1">{programme.bridging_module.name}</h4>
          <p className="text-sm text-gray-600 mb-4">
            Duration: {programme.bridging_module.duration} &middot; Credits: {programme.bridging_module.credits} &middot; Assessment: {programme.bridging_module.assessment}
          </p>
          <DataTable rows={programme.bridging_module.summary_table} />
        </div>
      )}
    </div>
  );
}

export default function Curriculum() {
  const [activeProgramme, setActiveProgramme] = useState('yoruba_medicine');
  const programme = curriculumData[activeProgramme];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-green-900 mb-2">Curriculum</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Detailed course structure and apprenticeship stages for each programme and track.
          </p>
        </header>

        <div className="flex justify-center flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setActiveProgramme('yoruba_medicine')}
            className={`px-5 py-2.5 rounded-full font-semibold transition-colors ${
              activeProgramme === 'yoruba_medicine'
                ? 'bg-green-800 text-white shadow-md'
                : 'bg-white text-green-800 border-2 border-green-200 hover:bg-green-50'
            }`}
          >
            Yoruba Medicine
          </button>
          <button
            type="button"
            onClick={() => setActiveProgramme('eco_medical_architecture')}
            className={`px-5 py-2.5 rounded-full font-semibold transition-colors ${
              activeProgramme === 'eco_medical_architecture'
                ? 'bg-green-800 text-white shadow-md'
                : 'bg-white text-green-800 border-2 border-green-200 hover:bg-green-50'
            }`}
          >
            Eco-medical Architecture
          </button>
        </div>

        <ProgrammeBlock programme={programme} />

        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-green-900 mb-3">Cross-Track Summary</h3>
            <DataTable rows={curriculumData.cross_track_summary} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-900 mb-3">Physical Intensive Calendar</h3>
            <DataTable rows={curriculumData.intensive_calendar} />
          </div>
        </div>

        <div className="text-center pt-4">
          <a
            href="/form"
            className="inline-flex items-center gap-2 text-green-700 font-semibold hover:text-green-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Application
          </a>
        </div>
      </div>
    </div>
  );
}
