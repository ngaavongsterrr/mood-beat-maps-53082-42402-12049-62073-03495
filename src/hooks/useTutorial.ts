import { useState, useEffect, useCallback } from 'react';

export type TutorialStep = 
  | 'mode-toggle' 
  | 'location-filter' 
  | 'location-pins' 
  | 'playlist-tab' 
  | 'spotify-open' 
  | 'mood-visualizer' 
  | 'mood-summary' 
  | 'journal-tab';

const TUTORIAL_STORAGE_KEY = 'tutorial-progress';
const TUTORIAL_COMPLETED_KEY = 'tutorial-completed';

interface TutorialProgress {
  completedSteps: TutorialStep[];
  currentStep: TutorialStep | null;
}

export const useTutorial = () => {
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  const [completedSteps, setCompletedSteps] = useState<TutorialStep[]>([]);
  const [tutorialActive, setTutorialActive] = useState(false);

  // Load tutorial progress from localStorage
  useEffect(() => {
    const isCompleted = localStorage.getItem(TUTORIAL_COMPLETED_KEY) === 'true';
    if (isCompleted) {
      setTutorialActive(false);
      return;
    }

    const saved = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (saved) {
      try {
        const progress: TutorialProgress = JSON.parse(saved);
        setCompletedSteps(progress.completedSteps || []);
        setCurrentStep(progress.currentStep);
        setTutorialActive(true);
      } catch {
        // Invalid data, start fresh
        setCurrentStep('mode-toggle');
        setTutorialActive(true);
      }
    } else {
      // First time user
      setCurrentStep('mode-toggle');
      setTutorialActive(true);
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (tutorialActive) {
      const progress: TutorialProgress = {
        completedSteps,
        currentStep
      };
      localStorage.setItem(TUTORIAL_STORAGE_KEY, JSON.stringify(progress));
    }
  }, [currentStep, completedSteps, tutorialActive]);

  const completeStep = useCallback((step: TutorialStep) => {
    setCompletedSteps(prev => {
      if (prev.includes(step)) return prev;
      return [...prev, step];
    });

    // Auto-advance to next step
    const stepOrder: TutorialStep[] = [
      'mode-toggle',
      'location-filter',
      'location-pins',
      'playlist-tab',
      'spotify-open',
      'mood-visualizer',
      'mood-summary',
      'journal-tab'
    ];

    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    } else {
      // All steps completed
      setCurrentStep(null);
      setTutorialActive(false);
      localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
    }
  }, []);

  const dismissCurrentStep = useCallback(() => {
    if (currentStep) {
      completeStep(currentStep);
    }
  }, [currentStep, completeStep]);

  const skipAllSteps = useCallback(() => {
    setCurrentStep(null);
    setTutorialActive(false);
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, 'true');
  }, []);

  const resetTutorial = useCallback(() => {
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
    setCompletedSteps([]);
    setCurrentStep('mode-toggle');
    setTutorialActive(true);
  }, []);

  const highlightElement = useCallback((step: TutorialStep) => {
    return tutorialActive && currentStep === step;
  }, [tutorialActive, currentStep]);

  return {
    currentStep,
    completedSteps,
    tutorialActive,
    completeStep,
    dismissCurrentStep,
    skipAllSteps,
    resetTutorial,
    highlightElement
  };
};
