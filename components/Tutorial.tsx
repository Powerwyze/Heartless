import React, { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, X, ChevronRight } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  target: string; // CSS selector or ID
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
    title: 'Welcome to Heartless Partner Dex!',
    description: 'Your AI-powered relationship tracking system. Let me show you around!',
    target: '',
    position: 'bottom',
    arrow: 'down',
  },
  {
    title: 'Create Your First Partner',
    description: 'Click the NEW button to add someone to your Dex. Upload their photo and answer a few questions - AI will do the rest!',
    target: '[data-tutorial="new-button"]',
    position: 'right',
    arrow: 'left',
  },
  {
    title: 'View Your Partners',
    description: 'All your partners appear here. Click any partner to view their full profile and stats.',
    target: '[data-tutorial="partner-list"]',
    position: 'right',
    arrow: 'left',
  },
  {
    title: 'Explore Different Views',
    description: 'Switch between Dex (overview), Stats (detailed analytics), and Timeline (interaction history).',
    target: '[data-tutorial="tabs"]',
    position: 'bottom',
    arrow: 'up',
  },
  {
    title: 'Track Interactions',
    description: 'Log events with Report Damage or Report Growth. Use Emotional Update for AI-guided relationship analysis.',
    target: '[data-tutorial="actions"]',
    position: 'left',
    arrow: 'right',
  },
  {
    title: "You're All Set!",
    description: 'Start by creating your first partner. Your data syncs automatically across devices!',
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
      // Center of screen for non-targeted steps
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };
    }

    const padding = 20;
    const tooltipWidth = 320;
    const tooltipHeight = 250; // Increased for content
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

        // Check if tooltip goes off right edge
        if (left + tooltipWidth > viewportWidth - padding) {
          left = targetRect.left - tooltipWidth - padding;
        }
        break;
      case 'left':
        top = targetRect.top + targetRect.height / 2;
        left = targetRect.left - tooltipWidth - padding;
        transform = 'translateY(-50%)';

        // Check if tooltip goes off left edge
        if (left < padding) {
          left = targetRect.right + padding;
        }
        break;
      case 'bottom':
        top = targetRect.bottom + padding;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translateX(-50%)';

        // Check if tooltip goes off bottom edge
        if (top + tooltipHeight > viewportHeight - padding) {
          top = targetRect.top - tooltipHeight - padding;
        }
        break;
      case 'top':
        top = targetRect.top - tooltipHeight - padding;
        left = targetRect.left + targetRect.width / 2;
        transform = 'translateX(-50%)';

        // Check if tooltip goes off top edge
        if (top < padding) {
          top = targetRect.bottom + padding;
        }
        break;
      default:
        return {};
    }

    // Clamp horizontal position
    const halfWidth = tooltipWidth / 2;
    if (transform.includes('translateX')) {
      left = Math.max(halfWidth + padding, Math.min(viewportWidth - halfWidth - padding, left));
    } else {
      left = Math.max(padding, Math.min(viewportWidth - tooltipWidth - padding, left));
    }

    // Clamp vertical position
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

    const arrowSize = 40;
    const offset = 60;

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
      {/* Backdrop with spotlight */}
      <div className="absolute inset-0 bg-black/80 pointer-events-auto" onClick={handleSkip}>
        {targetRect && (
          <div
            className="absolute border-4 border-pink-500 rounded-lg shadow-[0_0_30px_rgba(236,72,153,0.8)] animate-pulse"
            style={{
              top: `${targetRect.top - 8}px`,
              left: `${targetRect.left - 8}px`,
              width: `${targetRect.width + 16}px`,
              height: `${targetRect.height + 16}px`,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>

      {/* Arrow pointing to target */}
      {targetRect && ArrowIcon && (
        <div
          className="absolute text-[color:var(--theme-primary)] animate-bounce pointer-events-none"
          style={getArrowPosition() || {}}
        >
          <ArrowIcon size={40} strokeWidth={3} />
        </div>
      )}

      {/* Tooltip */}
      <div
        className="absolute bg-gradient-to-br from-gray-900 to-black border-4 border-pink-500 shadow-[0_0_40px_rgba(236,72,153,0.8)] p-6 rounded-lg pointer-events-auto"
        style={{
          ...getTooltipPosition(),
          width: '320px',
          maxWidth: '90vw',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-[color:var(--theme-primary)] mb-2 tracking-wide">
              {step.title}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-pink-500'
                    : index < currentStep
                    ? 'w-2 bg-pink-500/50'
                    : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
            >
              Skip Tour
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.6)]"
            >
              {currentStep < tutorialSteps.length - 1 ? (
                <>
                  Next <ChevronRight size={16} />
                </>
              ) : (
                "Let's Go!"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
