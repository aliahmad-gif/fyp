import './measurement-styles.css';
import { useState } from 'react';
import MeasurementWizardStep1 from './components/MeasurementWizardStep1';
import MeasurementWizardStep2 from './components/MeasurementWizardStep2';
import MeasurementWizardStep3 from './components/MeasurementWizardStep3';
import MeasurementWizardStep4 from './components/MeasurementWizardStep4';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    age: '',
    height: '',
    weight: '',
    photo: null as File | null,
    measurements: {}
  });

  const handleStep1Complete = (data: { age: string; height: string; weight: string }) => {
    setUserData({ ...userData, ...data });
    setCurrentStep(2);
  };

  const handleStep2Complete = (photo: File) => {
    setUserData({ ...userData, photo });
    setCurrentStep(3);
  };

  const handleStep3Complete = (measurements: any) => {
    setUserData({ ...userData, measurements });
    setCurrentStep(4);
  };

  const handleRetake = () => {
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      {currentStep === 1 && (
        <MeasurementWizardStep1 onComplete={handleStep1Complete} />
      )}
      {currentStep === 2 && (
        <MeasurementWizardStep2 onComplete={handleStep2Complete} />
      )}
      {currentStep === 3 && (
        <MeasurementWizardStep3
          onComplete={handleStep3Complete}
          onRetake={handleRetake}
        />
      )}
      {currentStep === 4 && (
        <MeasurementWizardStep4 />
      )}
    </div>
  );
}
