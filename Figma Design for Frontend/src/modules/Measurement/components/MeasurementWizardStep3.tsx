import { ArrowRight, RotateCw, RefreshCw, Ruler, User } from 'lucide-react';

interface Step3Props {
  onComplete: (measurements: any) => void;
  onRetake: () => void;
}

const measurements = [
  { label: 'Length', value: '42', icon: '📏', unit: 'in' },
  { label: 'Shoulder', value: '18', icon: '👔', unit: 'in' },
  { label: 'Chest', value: '40', icon: '📐', unit: 'in' },
  { label: 'Arm', value: '24', icon: '💪', unit: 'in' },
  { label: 'Collar', value: '15.5', icon: '👕', unit: 'in' },
  { label: 'Lap', value: '32', icon: '📏', unit: 'in' },
  { label: 'Pant Length', value: '40', icon: '👖', unit: 'in' },
  { label: 'Paincha', value: '8', icon: '📌', unit: 'in' }
];

export default function MeasurementWizardStep3({ onComplete, onRetake }: Step3Props) {
  const handleConfirm = () => {
    const measurementData = measurements.reduce((acc, m) => {
      acc[m.label.toLowerCase()] = m.value;
      return acc;
    }, {} as any);
    onComplete(measurementData);
  };

  return (
    <div className="w-full max-w-6xl">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1 bg-green-600 rounded-full" />
          <div className="flex-1 h-1 bg-green-600 rounded-full" />
          <div className="flex-1 h-1 bg-green-600 rounded-full" />
          <div className="flex-1 h-1 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm text-gray-600">Step 3 of 4</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - 3D Model Viewer */}
          <div>
            <h2 className="text-gray-900 mb-6">Body Model</h2>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 h-[500px] flex flex-col items-center justify-center relative">
              {/* Placeholder 3D Model */}
              <div className="relative">
                {/* Simple human silhouette SVG */}
                <svg
                  width="200"
                  height="400"
                  viewBox="0 0 200 400"
                  fill="none"
                  className="opacity-30"
                >
                  {/* Head */}
                  <circle cx="100" cy="40" r="30" stroke="#1e8e3e" strokeWidth="2" />
                  {/* Body */}
                  <line x1="100" y1="70" x2="100" y2="200" stroke="#1e8e3e" strokeWidth="3" />
                  {/* Shoulders */}
                  <line x1="60" y1="100" x2="140" y2="100" stroke="#1e8e3e" strokeWidth="2" />
                  {/* Arms */}
                  <line x1="60" y1="100" x2="40" y2="180" stroke="#1e8e3e" strokeWidth="2" />
                  <line x1="140" y1="100" x2="160" y2="180" stroke="#1e8e3e" strokeWidth="2" />
                  {/* Legs */}
                  <line x1="100" y1="200" x2="75" y2="360" stroke="#1e8e3e" strokeWidth="2" />
                  <line x1="100" y1="200" x2="125" y2="360" stroke="#1e8e3e" strokeWidth="2" />
                </svg>

                {/* Measurement indicators */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                  <div className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Shoulder: 18"
                  </div>
                </div>
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
                  <div className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                    Chest: 40"
                  </div>
                </div>
              </div>

              {/* Model Controls */}
              <div className="absolute bottom-6 flex items-center gap-3">
                <button className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 text-sm text-gray-700">
                  <RotateCw className="w-4 h-4" />
                  Rotate
                </button>
                <button className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 text-sm text-gray-700">
                  <RefreshCw className="w-4 h-4" />
                  Reset View
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Measurements Dashboard */}
          <div>
            <div className="mb-6">
              <h2 className="text-gray-900 mb-2">Your AI Measurements</h2>
              <p className="text-sm text-gray-600">Based on your image and details</p>
            </div>

            {/* Measurements Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {measurements.map((measurement, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-green-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{measurement.icon}</span>
                    <Ruler className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{measurement.label}</p>
                  <p className="text-gray-900">
                    {measurement.value}
                    <span className="text-sm text-gray-600 ml-1">{measurement.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onRetake}
                className="flex-1 px-6 py-3 border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Retake Measurement</span>
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg"
              >
                <span>Confirm & Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confidence Indicator */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
          <span className="text-sm text-green-700">AI Confidence: 94%</span>
        </div>
      </div>
    </div>
  );
}
