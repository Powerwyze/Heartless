
import React from 'react';
import { PixelButton } from './RetroUI';

export const PRDView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black bg-opacity-95 overflow-y-auto p-6 retro-font text-lg text-slate-300">
      <div className="max-w-4xl mx-auto space-y-12 pb-32">
        <div className="flex justify-between items-center sticky top-0 bg-black py-4 z-10 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <h1 className="pixel-font text-2xl text-red-600 uppercase italic tracking-tighter">User Guide</h1>
          </div>
          <PixelButton onClick={onClose} color="red">CLOSE</PixelButton>
        </div>

        <section className="space-y-4">
          <h2 className="pixel-font text-xl text-indigo-400 border-l-4 border-indigo-600 pl-4">What is Heartless?</h2>
          <div className="bg-slate-900 p-6 border-2 border-slate-800">
            <p className="leading-relaxed">
              <strong className="text-white uppercase">Heartless</strong> is a private diary to help you keep track of your relationships. 
              Think of it like a character collection for the people you meet. You can track how happy the relationship makes you, note down things they do, and get advice when things feel a bit off.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="pixel-font text-xl text-indigo-400 border-l-4 border-indigo-600 pl-4">How to Use the App</h2>
          <div className="space-y-6">
            
            <GuideCard 
              title="1. Add a Partner" 
              description="Click 'NEW_PARTNER' to create a profile. You can even upload a photo to generate a cute pixel character of them!"
            />

            <GuideCard 
              title="2. Track Your Happiness" 
              description="The hearts show how healthy the relationship feels. If they do something that hurts your feelings, log a 'Damage Report'. If they're great, log a 'Good Time'!"
            />

            <GuideCard 
              title="3. Get Advice" 
              description="If your hearts get too low, Cupid will step in to give you some honest advice. We're here to help you protect your peace."
            />

            <GuideCard 
              title="4. Watch for Signs" 
              description="Our 'Sign Checker' looks at your history and picks out Red Flags (warnings) and Green Flags (good signs) for you."
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="pixel-font text-xl text-indigo-400 border-l-4 border-indigo-600 pl-4">Privacy & Safety</h2>
          <div className="bg-slate-900 border-2 border-slate-800 p-6 space-y-4 text-sm">
            <p><strong>Your Data is Private:</strong> Everything you type stays in this app. We don't share your diary with anyone.</p>
            <p><strong>Photo Safety:</strong> When you upload a photo, we strip out any hidden location data before we use it to make your character.</p>
            <p><strong>Healthy Boundaries:</strong> Our AI advice is focused on your well-being. We will always encourage you to respect yourself and stay safe.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

const GuideCard: React.FC<{ title: string, description: string }> = ({ title, description }) => (
  <div className="bg-slate-900 border-4 border-slate-700 p-6 relative dex-frame">
    <h3 className="pixel-font text-white text-lg mb-2 uppercase italic tracking-tighter">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">{description}</p>
  </div>
);
