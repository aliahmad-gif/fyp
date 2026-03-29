import { Check, Clock, Star, Package, Truck } from 'lucide-react';

interface TailorProgressProps {
  productName: string;
  tailorName: string;
  tailorRating?: number;
  tailorLocation?: string;
  currentStep: number; // 0-4 (index of current step)
  progressPercentage: number;
  estimatedDispatchDays: number;
  expectedDeliveryDate: string;
  deliveryType: string;
}

const steps = [
  'Order Received',
  'Cutting',
  'Stitching',
  'Finishing',
  'Dispatched'
];

export default function TailorProgress({
  productName,
  tailorName,
  tailorRating,
  tailorLocation,
  currentStep,
  progressPercentage,
  estimatedDispatchDays,
  expectedDeliveryDate,
  deliveryType
}: TailorProgressProps) {
  const isDispatched = currentStep >= 4;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      {/* Top Section - Product and Tailor Info */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-gray-900 mb-2">{productName}</h2>
        <div className="flex items-center gap-2 text-gray-700">
          <span>Tailor: {tailorName}</span>
          {tailorRating && tailorLocation && (
            <>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span className="text-gray-700">{tailorRating}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-700">{tailorLocation}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Middle Section - Stepper */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center" style={{ flex: index === steps.length - 1 ? '0 0 auto' : '1' }}>
              {/* Step Circle and Line Container */}
              <div className="flex items-center w-full">
                {/* Circle */}
                <div className="flex flex-col items-center relative z-10 flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      index < currentStep
                        ? 'bg-green-500'
                        : index === currentStep
                        ? 'bg-orange-500'
                        : 'bg-white border-2 border-gray-300'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : index === currentStep ? (
                      <Clock className="w-5 h-5 text-white" />
                    ) : null}
                  </div>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 relative" style={{ top: '-20px' }}>
                    <div
                      className={`h-full ${
                        index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="mt-3 text-center max-w-[100px]">
                <p
                  className={`text-sm ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Text */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="space-y-2">
          <p className="text-gray-900">
            {steps[currentStep]} in progress ({progressPercentage}% completed)
          </p>
          {!isDispatched && (
            <p className="text-gray-600">
              Estimated dispatch in {estimatedDispatchDays} days
            </p>
          )}
          <p className="text-gray-600">
            Expected delivery: {expectedDeliveryDate}
          </p>
        </div>
      </div>

      {/* Bottom Section - Dispatch and Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-gray-900 mb-1">Dispatch Status</p>
            <p className="text-sm text-gray-600">
              {isDispatched ? 'Dispatched' : 'Not dispatched yet'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <p className="text-gray-900 mb-1">Delivery Type</p>
            <p className="text-sm text-gray-600">{deliveryType}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">📍</span>
          </div>
          <div>
            <p className="text-gray-900 mb-1">Tracking</p>
            <p className="text-sm text-gray-600">
              {isDispatched ? (
                <span className="text-orange-600 cursor-pointer hover:underline">
                  Track shipment
                </span>
              ) : (
                'Available after dispatch'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
