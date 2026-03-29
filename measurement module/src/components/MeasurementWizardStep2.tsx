import { useState, useRef } from 'react';
import { CloudUpload, Camera, X, Check, AlertCircle, User, Shirt, ArrowRight } from 'lucide-react';

interface Step2Props {
  onComplete: (photo: File) => void;
}

type UploadState = 'empty' | 'uploading' | 'success' | 'error';

export default function MeasurementWizardStep2({ onComplete }: Step2Props) {
  const [uploadState, setUploadState] = useState<UploadState>('empty');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File too large. Please upload an image under 5MB.');
      setUploadState('error');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Invalid file type. Please upload an image file.');
      setUploadState('error');
      return;
    }

    setSelectedFile(file);
    setUploadState('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploadState('success');
          // Create preview URL
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleCancel = () => {
    setUploadState('empty');
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  const handleRetry = () => {
    setUploadState('empty');
    setErrorMessage('');
  };

  const handleContinue = () => {
    if (selectedFile) {
      onComplete(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1 bg-green-600 rounded-full" />
          <div className="flex-1 h-1 bg-green-600 rounded-full" />
          <div className="flex-1 h-1 bg-gray-200 rounded-full" />
          <div className="flex-1 h-1 bg-gray-200 rounded-full" />
        </div>
        <p className="text-sm text-gray-600">Step 2 of 4</p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-3 tracking-tight">Upload your photo</h1>
          <p className="text-gray-600">
            Upload a full-body photo for accurate AI measurement analysis
          </p>
        </div>

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-2xl p-8 mb-8 transition-all ${
            uploadState === 'error'
              ? 'border-red-300 bg-red-50'
              : uploadState === 'success'
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          {/* Empty State */}
          {uploadState === 'empty' && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <CloudUpload className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Upload full-body photo</h3>
              <p className="text-sm text-gray-600 mb-6">
                Stand against a plain background for best results
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleUploadClick}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all"
                >
                  Upload File
                </button>
              </div>
            </div>
          )}

          {/* Uploading State */}
          {uploadState === 'uploading' && (
            <div className="text-center">
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-2">{selectedFile?.name}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-2">{uploadProgress}% uploaded</p>
              </div>
              <button
                onClick={handleCancel}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Success State */}
          {uploadState === 'success' && previewUrl && (
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-48 h-64 object-cover rounded-xl"
                />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-sm text-green-700 mb-4">{selectedFile?.name}</p>
              <button
                onClick={handleCancel}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Change photo
              </button>
            </div>
          )}

          {/* Error State */}
          {uploadState === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-200 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Upload failed</h3>
              <p className="text-sm text-red-600 mb-6">{errorMessage}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Visual Guidance Section */}
        <div className="mb-8">
          <h3 className="text-sm text-gray-700 mb-4">Photo Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900 mb-1">Plain Background</p>
                <p className="text-xs text-gray-600">
                  Stand against a wall or plain surface
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Shirt className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-900 mb-1">Fitted Clothing</p>
                <p className="text-xs text-gray-600">
                  Wear well-fitted clothes
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-900 mb-1">Arms Slightly Away</p>
                <p className="text-xs text-gray-600">
                  Keep arms away from body
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={uploadState !== 'success'}
          className={`w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all ${
            uploadState === 'success'
              ? 'bg-green-600 hover:bg-green-700 hover:shadow-lg text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          style={{ fontSize: '16px' }}
        >
          <span>Process Image</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}