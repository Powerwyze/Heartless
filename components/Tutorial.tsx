import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, X, ChevronRight } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  arrow: 'up' | 'down' | 'left' | 'right';
}

interface TutorialProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to Heartless',
    description: 'Your AI-powered relationship tracking system. Let me show you around.',
    target: '',
    position: 'bottom',
    arrow: 'down',
  },
  {
    title: 'Create Your First Partner',
    description: 'Click NEW to add someone. Upload their photo and answer questions - AI handles the rest.',
    target: '[data-tutorial="new-button"]',
    position: 'right',
    arrow: 'left',
  },
  {
    title: 'View Your Partners',
    description: 'All partners appear here. Click any to view their profile and stats.',
    target: '[data-tutorial="partner-list"]',
    position: 'right',
    arrow: 'left',
  },
  {
    title: 'Explore Views',
    description: 'Switch between Dex, Stats, Intel, and Logs for different perspectives.',
    target: '[data-tutorial="tabs"]',
    position: 'bottom',
    arrow: 'up',
  },
  {
    title: 'Track Interactions',
    description: 'Log events with Damage or Growth. Use Emotional Update for AI analysis.',
    target: '[data-tutorial="actions"]',
    position: 'left',
    arrow: 'right',
  },
  {
    title: "You're Ready",
    description: 'Start by creating your first partner. Data syncs across devices automatically.',
    target: '',
    position: 'bottom',
    arrow: 'down',
  },
];

export const Tutorial: React.FC<TutorialProps> = ({ isOpen, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = tutorialSteps[currentStep];

  useEffect(() => {
    if (!isOpen) return;

    const updateTargetPosition = () => {
      if (step.target) {
        const element = document.querySelector(step.target);
        if (element) {
          setTargetRect(element.getBoundingClientRect());
        } else {
          setTargetRect(null);
        }
      } else {
        setTargetRect(null);
      }
    };

    updateTargetPosition();
    window.addEventListener('resize', updateTargetPosition);
    window.addEventListener('scroll', updateTargetPosition);

    return () => {
      window.removeEventListener('resize', updateTargetPosition);
      window.removeEventListener('scroll', updateTargetPosition);
    };
  }, [currentStep, isOpen, step.target]);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (!isOpen) return null;

  const getTooltipPosition = () => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 20;
    const tooltipWidth = 280;
    const tooltipHeight = 200;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top = 0;
    let left = 0;
    let transform = '';

    switch (step.position) {
      case 'right':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.right + padding;
        transform = 'translateY(-50%)';
        if (left + tooltipWidth > viewportWidth - padding) {
          left = targetRect.left - tooltipWidth - padding;
        }
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.left - tooltipWidth - padding;
        transform = 'translateY(-50%)';
        if (left < padding) {
          left = targetRect.right + padding;
        }
        break;
      case 'bottom':
        top = targetRect.bottom + padding;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translateX(-50%)';
        if (top + tooltipHeight > viewportHeight - padding) {
          top = targetRect.top - tooltipHeight - padding;
        }
        break;
      case 'top':
        top = targetRect.top - tooltipHeight - padding;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translateX(-50%)';
        if (top < padding) {
          top = targetRect.bottom + padding;
        }
        break;
      default:
        return {};
    }

    const halfWidth = tooltipWidth / 2;
    if (transform.includes('translateX')) {
      left = Math.max(halfWidth + padding, Math.min(viewportWidth - halfWidth - padding, left));
    } else {
      left = Math.max(padding, Math.min(viewportWidth - tooltipWidth - padding, left));
    }

    const halfHeight = tooltipHeight / 2;
    if (transform.includes('translateY')) {
      top = Math.max(halfHeight + padding, Math.min(viewportHeight - halfHeight - padding, top));
    } else {
      top = Math.max(padding, Math.min(viewportHeight - tooltipHeight - padding, top));
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      transform,
    };
  };

  const getArrowPosition = () => {
    if (!targetRect) return null;

    const arrowSize = 32;
    const offset = 50;

    switch (step.arrow) {
      case 'left':
        return {
          top: `${targetRect.top + targetRect.height / 2 - arrowSize / 2}px`,
          left: `${targetRect.right + offset}px`,
        };
      case 'right':
        return {
          top: `${targetRect.top + targetRect.height / 2 - arrowSize / 2}px`,
          left: `${targetRect.left - offset - arrowSize}px`,
        };
      case 'up':
        return {
          top: `${targetRect.bottom + offset}px`,
          left: `${targetRect.left + targetRect.width / 2 - arrowSize / 2}px`,
        };
      case 'down':
        return {
          top: `${targetRect.top - offset - arrowSize}px`,
          left: `${targetRect.left + targetRect.width / 2 - arrowSize / 2}px`,
        };
      default:
        return null;
    }
  };

  const ArrowIcon = {
    up: ArrowUp,
    down: ArrowDown,
    left: ArrowLeft,
    right: ArrowRight,
  }[step.arrow];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 pointer-events-auto" onClick={handleSkip}>
        {targetRect && (
          <div
            className="absolute border border-[var(--theme-primary,#F0F6F7)] rounded"
            style={{
              top: `${targetRect.top - 4}px`,
              left: `${targetRect.left - 4}px`,
              width: `${targetRect.width + 8}px`,
              height: `${targetRect.height + 8}px`,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Arrow */}
      {targetRect && ArrowIcon && (
        <div
          className="absolute text-[var(--theme-primary,#F0F6F7)] pointer-events-none opacity-60"
          style={getArrowPosition() || {}}
        >
          <ArrowIcon size={32} strokeWidth={2} />
        </div>
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded-lg p-4 pointer-events-auto"
        style={{
          ...getTooltipPosition(),
          width: '280px',
          maxWidth: '90vw',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-2 right-2 text-[var(--theme-text-subtle,#747474)] hover:text-[var(--theme-text,#F0F6F7)] transition-colors"
        >
          <X size={16} />
        </button>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-[var(--theme-text,#F0F6F7)] mb-1">
              {step.title}
            </h3>
            <p className="text-xs text-[var(--theme-text-muted,#919FA5)] leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-1.5">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-4 bg-[var(--theme-primary,#F0F6F7)]'
                    : index < currentStep
                    ? 'w-1 bg-[var(--theme-text-muted,#919FA5)]'
                    : 'w-1 bg-[var(--theme-border,#2a2a2a)]'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              className="flex-1 px-3 py-1.5 bg-transparent text-[var(--theme-text-muted,#919FA5)] hover:text-[var(--theme-text,#F0F6F7)] rounded border border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)] transition-colors text-xs"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-3 py-1.5 bg-[var(--theme-surface,#141414)] text-[var(--theme-text,#F0F6F7)] rounded border border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)] transition-colors text-xs font-medium flex items-center justify-center gap-1"
            >
              {currentStep < tutorialSteps.length - 1 ? (
                <>
                  Next <ChevronRight size={14} />
                </>
              ) : (
                "Start"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
