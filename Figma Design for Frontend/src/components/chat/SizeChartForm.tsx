import { useState } from 'react';
import { ArrowLeft, Ruler } from 'lucide-react';

interface SizeChartFormProps {
  onBack: () => void;
  onSubmit: (measurements: Measurements) => void;
}

interface Measurements {
  chest: string;
  waist: string;
  hips: string;
  armLength: string;
}

export default function SizeChartForm({ onBack, onSubmit }: SizeChartFormProps) {
  const [measurements, setMeasurements] = useState<Measurements>({
    chest: '',
    waist: '',
    hips: '',
    armLength: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(measurements);
  };

  const handleChange = (field: keyof Measurements, value: string) => {
    setMeasurements({ ...measurements, [field]: value });
  };

  const isFormValid = Object.values(measurements).every((value) => value.trim() !== '');

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a1a] text-white px-4 md:px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="size-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="size-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Ruler className="size-5" />
          </div>
          <h1 className="text-xl font-semibold">Send Measurements</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Tip:</span> For the most accurate measurements, please have someone help you measure or visit a professional tailor.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Chest */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Chest (inches) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={measurements.chest}
                  onChange={(e) => handleChange('chest', e.target.value)}
                  placeholder="e.g., 38"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  inches
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Measure around the fullest part of your chest
              </p>
            </div>

            {/* Waist */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Waist (inches) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={measurements.waist}
                  onChange={(e) => handleChange('waist', e.target.value)}
                  placeholder="e.g., 32"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  inches
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Measure around your natural waistline
              </p>
            </div>

            {/* Hips */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Hips (inches) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={measurements.hips}
                  onChange={(e) => handleChange('hips', e.target.value)}
                  placeholder="e.g., 40"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  inches
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Measure around the fullest part of your hips
              </p>
            </div>

            {/* Arm Length */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Arm Length (inches) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={measurements.armLength}
                  onChange={(e) => handleChange('armLength', e.target.value)}
                  placeholder="e.g., 24"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  inches
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Measure from shoulder to wrist with arm slightly bent
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
              >
                Send Measurements
              </button>
            </div>
          </form>

          {/* Measurement Guide */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Measurement Guide</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900 mb-1">Best Time to Measure</p>
                <p>Take measurements without heavy clothing</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Use a Soft Tape</p>
                <p>Flexible measuring tape works best</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Stand Naturally</p>
                <p>Don't hold your breath or tense up</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Measure Twice</p>
                <p>Double-check for accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
