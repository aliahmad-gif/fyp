import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface Step1Props {
  onComplete: (data: { age: string; height: string; weight: string }) => void;
}

export default function MeasurementWizardStep1({ onComplete }: Step1Props) {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (age && (parseInt(age) < 16 || parseInt(age) > 100)) {
      newErrors.age = 'Age must be between 16 and 100 years';
    }
    if (height && (parseInt(height) < 100 || parseInt(height) > 250)) {
      newErrors.height = 'Height must be between 100 and 250 cm';
    }
    if (weight && (parseInt(weight) < 30 || parseInt(weight) > 200)) {
      newErrors.weight = 'Weight must be between 30 and 200 kg';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onComplete({ age, height, weight });
    }, 1500);
  };

  const isFormValid = age && height && weight && Object.keys(errors).length === 0;

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
                  errors.age ? 'text-red-600' : focusedField === 'age' ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                Age
              </label>
              <div className="relative">
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setErrors({ ...errors, age: '' });
                  }}
                  onFocus={() => setFocusedField('age')}
                  onBlur={() => {
                    setFocusedField(null);
                    validateForm();
                  }}
                  placeholder="25"
                  className={`w-full bg-transparent border-0 border-b-2 pb-3 pr-16 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.age
                      ? 'border-red-600'
                      : focusedField === 'age' 
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
              {errors.age && (
                <p className="text-xs text-red-600 mt-2">{errors.age}</p>
              )}
            </div>

            {/* Height Input */}
            <div className="relative">
              <label 
                htmlFor="height" 
                className={`block text-sm mb-3 transition-colors ${
                  errors.height ? 'text-red-600' : focusedField === 'height' ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                Height
              </label>
              <div className="relative">
                <input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => {
                    setHeight(e.target.value);
                    setErrors({ ...errors, height: '' });
                  }}
                  onFocus={() => setFocusedField('height')}
                  onBlur={() => {
                    setFocusedField(null);
                    validateForm();
                  }}
                  placeholder="175"
                  className={`w-full bg-transparent border-0 border-b-2 pb-3 pr-16 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.height
                      ? 'border-red-600'
                      : focusedField === 'height' 
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
              {errors.height && (
                <p className="text-xs text-red-600 mt-2">{errors.height}</p>
              )}
            </div>

            {/* Weight Input */}
            <div className="relative">
              <label 
                htmlFor="weight" 
                className={`block text-sm mb-3 transition-colors ${
                  errors.weight ? 'text-red-600' : focusedField === 'weight' ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                Weight
              </label>
              <div className="relative">
                <input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setErrors({ ...errors, weight: '' });
                  }}
                  onFocus={() => setFocusedField('weight')}
                  onBlur={() => {
                    setFocusedField(null);
                    validateForm();
                  }}
                  placeholder="70"
                  className={`w-full bg-transparent border-0 border-b-2 pb-3 pr-16 text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
                    errors.weight
                      ? 'border-red-600'
                      : focusedField === 'weight' 
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
              {errors.weight && (
                <p className="text-xs text-red-600 mt-2">{errors.weight}</p>
              )}
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
