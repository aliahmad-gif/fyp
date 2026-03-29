import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

export default function MeasurementWizard() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Submitted:', { age, height, weight });
      // Move to next step
    }, 1500);
  };

  const isFormValid = age && height && weight;

  return (
    <div className="w-full max-w-md">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1 bg-green-600 rounded-full" />
          <div className="flex-1 h-1 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm text-gray-600">Step 1 of 4</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-gray-900 mb-3 tracking-tight">Your details</h1>
          <p className="text-gray-600">
            Enter your basic measurements to help us create your perfect fit
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-8 mb-10">
            {/* Age Input */}
            <div className="relative">
              <label 
                htmlFor="age" 
                className={`block text-sm mb-3 transition-colors ${
                  focusedField === 'age' ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                Age
              </label>
              <div className="relative">
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onFocus={() => setFocusedField('age')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="25"
                  className={`w-full bg-transparent border-0 border-b-2 pb-3 pr-16 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                    focusedField === 'age' 
                      ? 'border-green-600' 
                      : age 
                      ? 'border-gray-400' 
                      : 'border-gray-300'
                  }`}
                  style={{ fontSize: '16px' }}
                />
                <span className="absolute right-0 bottom-3 text-gray-500">
                  years
                </span>
              </div>
            </div>

            {/* Height Input */}
            <div className="relative">
              <label 
                htmlFor="height" 
                className={`block text-sm mb-3 transition-colors ${
                  focusedField === 'height' ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                Height
              </label>
              <div className="relative">
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  onFocus={() => setFocusedField('height')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="175"
                  className={`w-full bg-transparent border-0 border-b-2 pb-3 pr-16 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                    focusedField === 'height' 
                      ? 'border-green-600' 
                      : height 
                      ? 'border-gray-400' 
                      : 'border-gray-300'
                  }`}
                  style={{ fontSize: '16px' }}
                />
                <span className="absolute right-0 bottom-3 text-gray-500">
                  cm
                </span>
              </div>
            </div>

            {/* Weight Input */}
            <div className="relative">
              <label 
                htmlFor="weight" 
                className={`block text-sm mb-3 transition-colors ${
                  focusedField === 'weight' ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                Weight
              </label>
              <div className="relative">
                <input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  onFocus={() => setFocusedField('weight')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="70"
                  className={`w-full bg-transparent border-0 border-b-2 pb-3 pr-16 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                    focusedField === 'weight' 
                      ? 'border-green-600' 
                      : weight 
                      ? 'border-gray-400' 
                      : 'border-gray-300'
                  }`}
                  style={{ fontSize: '16px' }}
                />
                <span className="absolute right-0 bottom-3 text-gray-500">
                  kg
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all ${
              isFormValid && !isLoading
                ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            style={{ fontSize: '16px' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Disclaimer */}
          <div className="mt-6 text-center">
            <a 
              href="#" 
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              How we use your measurements
            </a>
          </div>
        </form>
      </div>

      {/* Optional: Visual Context Indicator */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            className="opacity-40"
          >
            <path d="M12 2v20M7 6l5-4 5 4M7 18l5 4 5-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>AI-powered custom tailoring</span>
        </div>
      </div>
    </div>
  );
}
