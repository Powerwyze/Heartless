import React from 'react';
import { PixelButton } from './RetroUI';

export const PRDView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-[var(--theme-bg,#0a0a0a)] overflow-y-auto p-4 md:p-6 text-sm text-[var(--theme-text-muted,#919FA5)]">
      <div className="max-w-2xl mx-auto space-y-8 pb-24">
        <div className="flex justify-between items-center sticky top-0 bg-[var(--theme-bg,#0a0a0a)] py-3 z-10 border-b border-[var(--theme-border,#2a2a2a)]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[var(--theme-primary,#F0F6F7)] rounded-full"></div>
            <h1 className="font-mono text-sm text-[var(--theme-text,#F0F6F7)] uppercase tracking-wide">User Guide</h1>
          </div>
          <PixelButton onClick={onClose} variant="secondary">Close</PixelButton>
        </div>

        <section className="space-y-3">
          <h2 className="font-mono text-xs text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide border-l-2 border-[var(--theme-primary,#F0F6F7)] pl-3">What is Heartless?</h2>
          <div className="bg-[var(--theme-surface,#141414)] p-4 border border-[var(--theme-border,#2a2a2a)] rounded">
            <p className="leading-relaxed">
              <strong className="text-[var(--theme-text,#F0F6F7)]">Heartless</strong> is a private diary to help you keep track of your relationships.
              Think of it like a character collection for the people you meet. You can track how happy the relationship makes you, note down things they do, and get advice when things feel a bit off.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-mono text-xs text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide border-l-2 border-[var(--theme-primary,#F0F6F7)] pl-3">How to Use</h2>
          <div className="space-y-3">

            <GuideCard
              title="1. Add a Partner"
              description="Click NEW to create a profile. Upload a photo to generate a pixel character."
            />

            <GuideCard
              title="2. Track Happiness"
              description="Hearts show relationship health. Log Damage when hurt, Growth when things go well."
            />

            <GuideCard
              title="3. Get Advice"
              description="When hearts get low, Cupid offers honest advice to help protect your peace."
            />

            <GuideCard
              title="4. Watch for Signs"
              description="The Sign Checker identifies Red Flags (warnings) and Green Flags (good signs)."
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-mono text-xs text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide border-l-2 border-[var(--theme-primary,#F0F6F7)] pl-3">Privacy</h2>
          <div className="bg-[var(--theme-surface,#141414)] border border-[var(--theme-border,#2a2a2a)] rounded p-4 space-y-3 text-xs">
            <p><span className="text-[var(--theme-text,#F0F6F7)]">Your Data is Private:</span> Everything stays in this app. We don't share your data.</p>
            <p><span className="text-[var(--theme-text,#F0F6F7)]">Photo Safety:</span> Location data is stripped from uploaded photos.</p>
            <p><span className="text-[var(--theme-text,#F0F6F7)]">Healthy Boundaries:</span> AI advice focuses on your well-being and self-respect.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

const GuideCard: React.FC<{ title: string, description: string }> = ({ title, description }) => (
  <div className="bg-[var(--theme-surface,#141414)] border border-[var(--theme-border,#2a2a2a)] rounded p-4">
    <h3 className="font-mono text-xs text-[var(--theme-text,#F0F6F7)] mb-1.5 uppercase tracking-wide">{title}</h3>
    <p className="text-[var(--theme-text-muted,#919FA5)] text-xs leading-relaxed">{description}</p>
  </div>
);
