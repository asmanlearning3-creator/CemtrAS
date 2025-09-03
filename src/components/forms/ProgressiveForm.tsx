import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: React.ReactNode;
  validation?: () => boolean;
  optional?: boolean;
}

interface ProgressiveFormProps {
  steps: FormStep[];
  onComplete: (data: Record<string, any>) => void;
  onCancel?: () => void;
  className?: string;
}

export const ProgressiveForm: React.FC<ProgressiveFormProps> = ({
  steps,
  onComplete,
  onCancel,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState<Record<string, any>>({});

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const currentStepData = steps[currentStep];

  // Smart step validation
  const canProceed = () => {
    if (currentStepData.optional) return true;
    if (currentStepData.validation) {
      return currentStepData.validation();
    }
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    if (isLastStep) {
      onComplete(formData);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    // Allow jumping to completed steps or next step
    if (completedSteps.has(stepIndex) || stepIndex === currentStep + 1) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Smart Progress Indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Step {currentStep + 1} of {steps.length}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => handleStepClick(index)}
                disabled={!completedSteps.has(index) && index !== currentStep && index !== currentStep + 1}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm transition-all duration-200 ${
                  completedSteps.has(index)
                    ? 'bg-green-500 text-white shadow-lg'
                    : index === currentStep
                      ? 'bg-blue-600 text-white shadow-lg'
                      : index < currentStep
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                } ${
                  (completedSteps.has(index) || index === currentStep + 1) && !disabled
                    ? 'hover:scale-110 cursor-pointer'
                    : 'cursor-default'
                }`}
                aria-label={`${step.title} - ${
                  completedSteps.has(index) ? 'Completed' : 
                  index === currentStep ? 'Current step' : 
                  index < currentStep ? 'Previous step' : 'Future step'
                }`}
              >
                {completedSteps.has(index) ? (
                  <Check size={16} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                  completedSteps.has(index) ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="p-8">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {currentStepData.title}
            </h3>
            {currentStepData.description && (
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {currentStepData.description}
              </p>
            )}
          </div>

          {/* Step Fields */}
          <div className="space-y-6">
            {currentStepData.fields}
          </div>
        </div>

        {/* Smart Navigation */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-8 py-6 flex items-center justify-between border-t border-gray-200/50 dark:border-gray-600/50">
          <button
            type="button"
            onClick={isFirstStep ? onCancel : handlePrevious}
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-500 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-300 dark:border-gray-500"
          >
            <ChevronLeft size={16} />
            <span>{isFirstStep ? 'Cancel' : 'Previous'}</span>
          </button>

          <div className="flex items-center gap-3">
            {currentStepData.optional && (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Skip
              </button>
            )}
            
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 ${
                canProceed()
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white focus:ring-blue-500/50 hover:-translate-y-0.5'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{isLastStep ? 'Complete' : 'Continue'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};