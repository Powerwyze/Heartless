import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Heart, Plus, Power, MessageSquare, Camera, User, History, Activity, ShieldAlert, BookOpen, Settings as SettingsIcon, Image as ImageIcon, CheckCircle2, ArrowRight, X, ThumbsUp, ThumbsDown, Sparkles, AlertCircle, Send, Zap, Shield, Target, Award, Brain, Star, MapPin, CheckSquare, Square, Clock, TrendingUp, Info, Save, Edit2, Trash2, PlusCircle } from 'lucide-react';
import { Partner, RelationshipType, InteractionLog, AppState, LogType, Trait, Preference, AuthUser } from './types';
import { INITIAL_PARTNERS } from './constants';
import { PixelButton as ModernButton, CompassionMeter, StatBar, TagPill, RadarChart, Modal } from './components/RetroUI';
import { PRDView } from './components/PRDView';
import { HeartlessAIService } from './services/geminiService';
import { onAuthStateChange, signOut as firebaseSignOut } from './services/authService';
import { getPartners, createPartner, updatePartner as updatePartnerFirestore, addInteractionLog, updateChecklistItem as updateChecklistFirestore, addTrait, addPreference, deleteTrait, deletePreference } from './services/firestoreService';
import { AuthUI } from './components/AuthUI';
import { Tutorial } from './components/Tutorial';
import { Settings } from './components/Settings';
import { getTheme } from './src/config/themes';

const LOADING_QUOTES = [
  "All of me loves all of you — John Legend",
  "I’m lucky I’m in love with my best friend — Jason Mraz",
  "At last, my love has come along — Etta James",
  "How sweet it is to be loved by you — James Taylor",
  "You’re still the one I run to — Shania Twain",
  "You look wonderful tonight — Eric Clapton",
  "I just wanna be yours — Arctic Monkeys",
  "We belong together — Mariah Carey",
  "Your love is my turning page — Sleeping At Last",
  "Nothing compares to you — Sinéad O’Connor",
  "I could stay awake just to hear you breathing — Aerosmith",
  "I don’t want to miss a thing — Aerosmith",
  "I wanna grow old with you — Adam Sandler",
  "You’re my end and my beginning — John Legend",
  "I found love where it wasn’t supposed to be — Rihanna",
  "You make loving fun — Fleetwood Mac",
  "You’re my sunshine on a cloudy day — The Temptations",
  "I’m yours — Jason Mraz",
  "I’ll stand by you — The Pretenders",
  "I feel it in my bones — John Mayer",
  "You and me, we’re on fire — Adele",
  "I love you for infinity — Jaymes Young",
  "You’re the best thing that’s ever been mine — Taylor Swift",
  "I choose you — Sara Bareilles",
  "Forever can never be long enough — Train",
  "🛡️ 25 — Protecting Your Heart / Guarded Love",
  "I’m not afraid, I just don’t trust you — SZA",
  "I built walls, you ran into them — Halsey",
  "I don’t get attached, that’s my problem — Drake",
  "I can’t give you my heart — The Weeknd",
  "I learned love don’t love nobody — The Weeknd",
  "I keep my heart locked in a safe — Jhene Aiko",
  "I don’t wanna fall in love — XXXTENTACION",
  "I been hurt before — Mary J. Blige",
  "Trust is expensive — Kehlani",
  "I don’t wanna open up again — Post Malone",
  "Love don’t live here anymore — Rose Royce",
  "I guard my heart like a loaded gun — Summer Walker",
  "I don’t feel a thing — The Weeknd",
  "You don’t get my tears — Ariana Grande",
  "I learned to love myself first — Whitney Houston",
  "I can’t save you — SZA",
  "I got trust issues — The Weeknd",
  "I’m too guarded — Bryson Tiller",
  "I don’t fall in love, I deploy — Drake",
  "I don’t need nobody — Rihanna",
  "I can’t give my heart away — Miguel",
  "I been protecting my peace — J. Cole",
  "I don’t love easily — Sam Smith",
  "I learned the hard way — Mary J. Blige",
  "I don’t wanna feel — Frank Ocean",
  "😈 25 — Player / Toxic / Non-Committal Energy",
  "I got hoes, callin’ — Future",
  "I’m not faithful — Drake",
  "I treat her like a dog — Future",
  "She ain’t the only one — Trey Songz",
  "I’m for everybody — City Girls",
  "I don’t do commitments — Chris Brown",
  "I’m too playa for this — Juicy J",
  "I don’t cuff — Future",
  "I be lying to her face — The Weeknd",
  "I can’t love no ho — Future",
  "She fell in love with the lifestyle — Drake",
  "I got options — Lil Baby",
  "I’m still a dog — DMX",
  "She knew what it was — Future",
  "I’m not your man — PartyNextDoor",
  "I’m emotionally unavailable — Summer Walker",
  "I don’t wanna be saved — Future",
  "I’m heartless — The Weeknd",
  "I love women, not one woman — Future",
  "I can’t be faithful — Chris Brown",
  "I break hearts — Rod Wave",
  "I’m living fast — Future",
  "I don’t catch feelings — NAV",
  "She knew I was a dog — Future",
  "I’m not changing — Drake",
  "🎯 25 — Finding the Right One / Clarity",
  "I knew you were the one — Alicia Keys",
  "You feel like home — Jhene Aiko",
  "I found what I was missing — Miguel",
  "You changed my whole life — Kanye West",
  "You were worth the wait — Bruno Mars",
  "You the reason I believe again — Usher",
  "You make me better — Ne-Yo",
  "I choose you every time — Alicia Keys",
  "You showed me real love — Mary J. Blige",
  "You my peace — Summer Walker",
  "You calm my demons — The Weeknd",
  "You feel different — Drake",
  "I finally got it right — John Legend",
  "You healed parts of me — Kehlani",
  "I don’t wanna lose you — Usher",
  "You’re my safe place — H.E.R.",
  "This love feels grown — Alicia Keys",
  "You bring balance to my life — Nas",
  "You the one I prayed for — K-Ci & JoJo",
  "I see forever with you — Beyoncé",
  "You showed me patience — Frank Ocean",
  "You made me believe again — Brent Faiyaz",
  "You’re worth changing for — Drake",
  "I found peace in you — Jhene Aiko",
  "You feel like destiny — Alicia Keys",
  "🧠 25 — Self-Respect / Boundaries / Knowing Your Worth",
  "I know my worth — Nicki Minaj",
  "I won’t beg for love — Mary J. Blige",
  "I choose me — Ariana Grande",
  "I’m better on my own — Ne-Yo",
  "I don’t need validation — Beyoncé",
  "I love myself first — Whitney Houston",
  "I set boundaries — Summer Walker",
  "I won’t chase you — Rihanna",
  "I’m done settling — Kehlani",
  "I deserve better — Drake",
  "I respect myself — Mary J. Blige",
  "I won’t lose myself — Alicia Keys",
  "I stand on my own — H.E.R.",
  "I protect my peace — J. Cole",
  "I don’t need approval — Kanye West",
  "I won’t dim my light — Beyoncé",
  "I put myself first — Ariana Grande",
  "I’m done explaining myself — Summer Walker",
  "I won’t accept less — SZA",
  "I learned self-love — Mary J. Blige",
  "I don’t chase, I attract — Nicki Minaj",
  "I’m standing my ground — Alicia Keys",
  "I deserve real love — Jhene Aiko",
  "I won’t settle for confusion — Kehlani",
  "I’m choosing peace — Lauryn Hill"
];

const shuffleQuotes = (quotes: string[]) => {
  for (let i = quotes.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
  }
  return quotes;
};

const App: React.FC = () => {
  // Authentication state
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [isOnboarding, setIsOnboarding] = useState(false);
  const [chatHistory, setChatHistory] = useState<{role: 'Cupid' | 'User', text: string}[]>([]);
  const [userInput, setUserInput] = useState('');
  const [manualLogDesc, setManualLogDesc] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Emotional Update State
  const [isEmotionalUpdateOpen, setIsEmotionalUpdateOpen] = useState(false);
  const [emotionalChat, setEmotionalChat] = useState<{role: 'Cupid' | 'User', text: string}[]>([]);
  const [verdict, setVerdict] = useState<{ delta: number, reason: string } | null>(null);

  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    return localStorage.getItem('heartless_theme') || 'pink';
  });

  const currentTheme = useMemo(() => getTheme(currentThemeId), [currentThemeId]);
  const themeVars = useMemo(() => ({
    ['--theme-primary' as any]: currentTheme.colors.primary,
    ['--theme-primary-hover' as any]: currentTheme.colors.primaryHover,
    ['--theme-primary-glow' as any]: currentTheme.colors.primaryGlow,
    ['--theme-accent' as any]: currentTheme.colors.accent,
    ['--theme-accent-hover' as any]: currentTheme.colors.accentHover,
    ['--theme-accent-glow' as any]: currentTheme.colors.accentGlow,
  }), [currentTheme]);

  const shuffledQuotesRef = useRef<string[]>([]);
  const getNextLoadingQuote = useCallback(() => {
    if (shuffledQuotesRef.current.length === 0) {
      shuffledQuotesRef.current = shuffleQuotes([...LOADING_QUOTES]);
    }
    return shuffledQuotesRef.current.pop() as string;
  }, []);
  const [loadingQuote, setLoadingQuote] = useState<string>(() => getNextLoadingQuote());

  const [state, setState] = useState<AppState>({
    partners: [],
    selectedPartnerId: null,
    currentTab: 'dex',
    showPRD: false,
    showScanner: false,
    showDamageModal: false,
    userSession: null,
    isLoadingPartners: false,
  });

  const ai = useMemo(() => new HeartlessAIService(), []);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const emotionalBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPartner = state.partners.find(p => p.id === state.selectedPartnerId);
  const isTerminated = selectedPartner && selectedPartner.currentCompassion <= 0;

  const terminationMessage = useMemo(() => {
    if (!selectedPartner || !isTerminated) return "";
    const recentNegative = selectedPartner.interactionLog
      .filter(l => l.type === LogType.NEGATIVE)
      .slice(0, 2)
      .map(l => l.description.toLowerCase())
      .join(" and ");

    const logContext = recentNegative ? `, specifically following issues like "${recentNegative}"` : "";
    return `Termination Required. Distance yourself from ${selectedPartner.name} immediately${logContext}. Connection resonance has reached critical zero. Self-preservation mode: ACTIVE.`;
  }, [selectedPartner, isTerminated]);

  useEffect(() => {
    if (isAuthLoading || state.isLoadingPartners) {
      setLoadingQuote(getNextLoadingQuote());
    }
  }, [isAuthLoading, state.isLoadingPartners, getNextLoadingQuote]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setAuthUser(user);
      setIsAuthLoading(false);
      if (user) {
        setState(prev => ({
          ...prev,
          userSession: { id: user.uid, email: user.email || '' }
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch partners from Firestore when authenticated
  useEffect(() => {
    if (!authUser) return;

    const fetchPartners = async () => {
      setState(prev => ({ ...prev, isLoadingPartners: true }));
      try {
        const partners = await getPartners(authUser.uid);
        setState(prev => ({
          ...prev,
          partners,
          selectedPartnerId: partners.length > 0 ? partners[0].id : null,
          isLoadingPartners: false,
        }));

        // Check if user has seen tutorial
        const hasSeenTutorial = localStorage.getItem('heartless_tutorial_completed');
        if (!hasSeenTutorial) {
          // Show tutorial after a short delay
          setTimeout(() => {
            setShowTutorial(true);
          }, 500);
        }
      } catch (error) {
        console.error('Failed to fetch partners:', error);
        setState(prev => ({ ...prev, isLoadingPartners: false }));
      }
    };

    fetchPartners();
  }, [authUser]);

  useEffect(() => {
    if (chatBottomRef.current) chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isProcessing]);

  useEffect(() => {
    if (emotionalBottomRef.current) emotionalBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [emotionalChat, isProcessing]);

  // --- Update Helpers ---
  const updatePartner = async (updates: Partial<Partner>) => {
    if (!selectedPartner) return;

    // Optimistic update (immediate UI feedback)
    setState(prev => ({
      ...prev,
      partners: prev.partners.map(p => p.id === selectedPartner.id ? { ...p, ...updates } : p)
    }));

    // Persist to Firestore (background)
    try {
      await updatePartnerFirestore(selectedPartner.id, updates);
    } catch (error) {
      console.error('Failed to save partner:', error);
    }
  };

  const startOnboarding = () => {
    setIsOnboarding(true);
    setChatHistory([{ 
      role: 'Cupid', 
      text: "Welcome to the Lab, darling! I sense a new connection in the air. To get started, I'll need a visual signature. Upload a photo of your interest and I'll work my magic to manifest their spirit in our system!" 
    }]);
    setOnboardingStep(1);
    setUploadedImage(null);
  };

  const handleOnboardingChat = async () => {
    if (onboardingStep === 1 && !uploadedImage) return; 
    if (!userInput.trim() && isProcessing) return;

    const currentInput = userInput;
    const newHistory = [...chatHistory, { role: 'User', text: currentInput } as const];
    setChatHistory(newHistory);
    setUserInput('');
    setIsProcessing(true);

    const questions = [
      "",
      "Signature captured. Now, what do they call this entity? (Name)",
      "Where did your orbits first cross? App, work, a fever dream? (Location)",
      "What is their defining trait? Tell me their essence. (Personality)",
      "Warning: Every rose has thorns. What's the one thing that makes you go 'yikes'? (Red Flags)",
      "Compiling data. Calculating compatibility... manifesting!"
    ];

    if (onboardingStep < questions.length - 1) {
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'Cupid', text: questions[onboardingStep] }]);
        setOnboardingStep(prev => prev + 1);
        setIsProcessing(false);
      }, 1000);
    } else {
      const profile = await ai.synthesizeProfile(newHistory);
      if (profile && authUser) {
        // Generate partner ID first so we can use it for sprite upload
        const partnerId = Math.random().toString(36).substr(2, 9);

        // Generate sprite and upload to Firebase Storage
        const sprite = await ai.generateSprite(
          `${profile.name} - ${profile.category}`,
          authUser.uid,
          partnerId,
          uploadedImage || undefined
        );

        const newPartner: Partner = {
          id: partnerId,
          userId: authUser.uid,
          dexNumber: (state.partners.length + 1).toString().padStart(3, '0'),
          name: profile.name,
          category: profile.category,
          flavorText: profile.flavorText,
          totalCompassion: 10,
          currentCompassion: 7,
          relationshipType: profile.relationshipType as RelationshipType,
          meetingLocation: profile.meetingLocation,
          redFlags: 20,
          greenFlags: profile.stats.personality,
          notes: '',
          spriteUrl: sprite,
          sprites: { idle: sprite },
          status: 'ACTIVE',
          stats: profile.stats,
          evolutionPath: profile.evolutionPath,
          effectiveness: profile.effectiveness,
          traits: profile.traits.map((t: string, i: number) => ({ id: i.toString(), partnerId, name: t, isPrimary: i === 0 })),
          preferences: [
            ...profile.likes.map((l: string) => ({ id: Math.random().toString(), partnerId, label: l, isLove: true })),
            ...profile.dislikes.map((d: string) => ({ id: Math.random().toString(), partnerId, label: d, isLove: false }))
          ],
          hiddenSkill: { ...profile.hiddenSkill, isUnlocked: false },
          dateChecklist: [
            { id: '1', label: 'Coffee date', isCompleted: false },
            { id: '2', label: 'Dinner', isCompleted: false },
            { id: '3', label: 'Movie night', isCompleted: false },
            { id: '4', label: 'Trip together', isCompleted: false },
            { id: '5', label: 'Grocery shopping (Endgame)', isCompleted: false }
          ],
          interactionLog: [{ id: '0', partnerId, timestamp: Date.now(), type: LogType.SYSTEM, description: "Connection Initialized.", compassionDelta: 0 }]
        };

        // Save to Firestore
        try {
          await createPartner(authUser.uid, newPartner);
          setState(prev => ({ ...prev, partners: [...prev.partners, newPartner], selectedPartnerId: newPartner.id, currentTab: 'dex' }));
          setIsOnboarding(false);
          setOnboardingStep(0);
        } catch (error) {
          console.error('Failed to create partner:', error);
        }
      }
      setIsProcessing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setChatHistory(prev => [...prev, { role: 'Cupid', text: "Visual ID verified. Background Purged. What is their name?" }]);
        setOnboardingStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEmotionalUpdate = () => {
    if (!selectedPartner) return;
    setEmotionalChat([{ role: 'Cupid', text: `Status update for ${selectedPartner.name}? What happened recently?` }]);
    setIsEmotionalUpdateOpen(true);
    setVerdict(null);
  };

  const handleEmotionalUpdateChat = async () => {
    if (!userInput.trim() || isProcessing || verdict) return;
    const userMsg = userInput;
    const newHistory = [...emotionalChat, { role: 'User', text: userMsg } as const];
    setEmotionalChat(newHistory);
    setUserInput('');
    setIsProcessing(true);

    try {
      if (newHistory.length < 4) {
        const response = await ai.getCupidAdvice(selectedPartner?.name || 'them', [userMsg], 0.5);
        setEmotionalChat(prev => [...prev, { role: 'Cupid', text: response }]);
      } else {
        const result = await ai.getEmotionalVerdict(selectedPartner?.name || 'them', newHistory);
        setEmotionalChat(prev => [...prev, { role: 'Cupid', text: `${result.reason}\n\nAdjust by ${result.delta} compassion units?` }]);
        setVerdict(result);
      }
    } catch {
      setEmotionalChat(prev => [...prev, { role: 'Cupid', text: "Signal interference. Try again, sweetie." }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyVerdict = (agreed: boolean) => {
    if (agreed && verdict && selectedPartner) logEvent(verdict.delta, verdict.reason);
    setIsEmotionalUpdateOpen(false);
    setEmotionalChat([]);
    setVerdict(null);
  };

  const logEvent = async (delta: number, desc: string) => {
    if (!selectedPartner) return;
    const log: InteractionLog = {
      id: Math.random().toString(),
      partnerId: selectedPartner.id,
      timestamp: Date.now(),
      type: delta < 0 ? LogType.NEGATIVE : LogType.POSITIVE,
      description: desc,
      compassionDelta: delta
    };
    const newCompassion = Math.max(0, Math.min(selectedPartner.totalCompassion, selectedPartner.currentCompassion + delta));

    // Optimistic update
    setState(prev => ({
      ...prev,
      partners: prev.partners.map(p => p.id === selectedPartner.id ? {
        ...p,
        currentCompassion: newCompassion,
        interactionLog: [log, ...p.interactionLog]
      } : p)
    }));

    // Persist to Firestore
    try {
      await addInteractionLog(selectedPartner.id, log);
      await updatePartnerFirestore(selectedPartner.id, { currentCompassion: newCompassion });
    } catch (error) {
      console.error('Failed to save interaction log:', error);
    }

    setManualLogDesc('');
  };

  const toggleChecklist = async (id: string) => {
    if (!selectedPartner) return;
    const item = selectedPartner.dateChecklist.find(c => c.id === id);
    if (!item) return;

    // Optimistic update
    setState(prev => ({
      ...prev,
      partners: prev.partners.map(p => p.id === selectedPartner.id ? {
        ...p,
        dateChecklist: p.dateChecklist.map(c => c.id === id ? { ...c, isCompleted: !c.isCompleted } : c)
      } : p)
    }));

    // Persist to Firestore
    try {
      await updateChecklistFirestore(selectedPartner.id, id, { isCompleted: !item.isCompleted });
    } catch (error) {
      console.error('Failed to update checklist item:', error);
    }
  };

  const handleTutorialComplete = () => {
    localStorage.setItem('heartless_tutorial_completed', 'true');
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    localStorage.setItem('heartless_tutorial_completed', 'true');
    setShowTutorial(false);
  };

  const handleThemeChange = (themeId: string) => {
    setCurrentThemeId(themeId);
    localStorage.setItem('heartless_theme', themeId);
  };

  // Show loading state while checking auth
  if (isAuthLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black" style={themeVars}>
        <div className="text-[color:var(--theme-primary)] text-2xl font-bold animate-pulse">LOADING...</div>
        <div className="mt-6 text-center text-2xl text-[color:var(--theme-primary)] italic max-w-md">{loadingQuote}</div>
      </div>
    );
  }

  // Show auth UI if not authenticated
  if (!authUser) {
    return (
      <div style={themeVars}>
        <AuthUI onAuthSuccess={() => {}} />
      </div>
    );
  }

  // Show loading state while fetching partners
  if (state.isLoadingPartners) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black" style={themeVars}>
        <div className="text-[color:var(--theme-primary)] text-xl font-bold animate-pulse">LOADING PARTNERS...</div>
        <div className="mt-6 text-center text-2xl text-[color:var(--theme-primary)] italic max-w-md">{loadingQuote}</div>
      </div>
    );
  }

  if (false) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0a0a0f]">
        <div className="glass p-12 max-w-md w-full text-center space-y-10 shadow-[0_0_50px_rgba(112,0,255,0.2)] border-white/5">
          <div className="flex justify-center">
             <div className="w-24 h-24 bg-gradient-to-br from-[#7000ff] to-[#ff007a] rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(112,0,255,0.4)] animate-pulse">
                <Heart className="w-12 h-12 text-white" />
             </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter text-white neon-text uppercase">HEARTLESS</h1>
            <p className="text-white/40 text-[10px] font-bold tracking-[0.4em] uppercase">Partner Analysis v2.5</p>
          </div>
          <ModernButton className="w-full py-4 text-sm tracking-widest" onClick={() => setIsLoggedOut(false)}>INITIALIZE DEX</ModernButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#050508]" style={themeVars}>
      {/* Sidebar */}
      <div className="order-last md:order-first w-full md:w-24 flex md:flex-col flex-row items-center md:py-10 py-3 border-t md:border-t-0 md:border-r border-white/5 bg-black/40 backdrop-blur-xl shrink-0">
        <div
          className="w-10 h-10 md:w-12 md:h-12 glass flex items-center justify-center md:mb-10 mb-0 ml-4 md:ml-0 animate-pulse"
          style={{ color: currentTheme.colors.primary }}
        >
          <Heart size={24} fill="currentColor" />
        </div>
        <div className="flex-1 flex md:flex-col flex-row gap-4 md:gap-8 px-4 md:px-0 overflow-x-auto md:overflow-visible" data-tutorial="tabs">
          <NavIcon icon={<User size={20}/>} active={state.currentTab === 'dex'} onClick={() => setState(s => ({...s, currentTab: 'dex'}))} label="DEX" />
          <NavIcon icon={<Activity size={20}/>} active={state.currentTab === 'stats'} onClick={() => setState(s => ({...s, currentTab: 'stats'}))} label="STATS" />
          <NavIcon icon={<BookOpen size={20}/>} active={state.currentTab === 'lore'} onClick={() => setState(s => ({...s, currentTab: 'lore'}))} label="INTEL" />
          <NavIcon icon={<History size={20}/>} active={state.currentTab === 'history'} onClick={() => setState(s => ({...s, currentTab: 'history'}))} label="LOGS" />
        </div>
        <div className="mt-0 md:mt-auto flex md:flex-col flex-row gap-4 md:gap-8 mr-4 md:mr-0">
          <div data-tutorial="new-button">
            <NavIcon icon={<Plus size={20}/>} active={isOnboarding} onClick={startOnboarding} label="NEW" />
          </div>
          <NavIcon icon={<SettingsIcon size={20} />} active={showSettings} onClick={() => setShowSettings(true)} label="THEME" />
          <NavIcon icon={<Power size={20}/>} onClick={async () => {
            try {
              await firebaseSignOut();
            } catch (error) {
              console.error('Failed to sign out:', error);
            }
          }} label="OFF" color="text-red-500" />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Header */}
        <header className="h-auto md:h-20 flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-10 py-4 md:py-0 border-b border-white/5 bg-black/20 gap-4">
          <div className="flex items-center gap-4 md:gap-6 flex-wrap">
            <h2 className="text-lg md:text-xl font-bold tracking-tighter uppercase text-white/90">
               {isOnboarding ? 'Onboarding Protocol' : (selectedPartner?.name || 'Database')}
            </h2>
            {!isOnboarding && selectedPartner && (
               <div className="flex gap-2 flex-wrap">
                  <TagPill variant="pink">{selectedPartner.relationshipType}</TagPill>
                  <span className="text-[10px] font-mono text-white/20 self-center">#{selectedPartner.dexNumber}</span>
               </div>
            )}
          </div>
          {!isOnboarding && (
            <div className="flex items-center gap-4 flex-wrap">
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isEditing ? 'bg-[#ff007a] text-white shadow-[0_0_15px_#ff007a/50]' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
              >
                {isEditing ? <><Save size={14}/> Save Changes</> : <><Edit2 size={14}/> Edit Profile</>}
              </button>
              <div className="flex -space-x-3 overflow-x-auto" data-tutorial="partner-list">
                {state.partners.map(p => (
                  <button key={p.id} onClick={() => setState(s => ({...s, selectedPartnerId: p.id}))} className={`w-10 h-10 rounded-full border-2 overflow-hidden transition-all hover:scale-110 active:scale-95 ${state.selectedPartnerId === p.id ? 'border-[#ff007a] ring-2 ring-[#ff007a]/20' : 'border-white/10 opacity-40 hover:opacity-100'}`}>
                    <img src={p.spriteUrl} alt={p.name} className="w-full h-full object-cover mix-blend-screen" />
                  </button>
                ))}
              </div>
              <button onClick={() => setState(s => ({...s, showPRD: true}))} className="p-2 hover:bg-white/5 rounded-full text-white/30 transition-colors"><SettingsIcon size={18} /></button>
            </div>
          )}
        </header>

        <main className="flex-1 flex overflow-hidden min-h-0">
          {isOnboarding ? (
            <div className="flex-1 flex flex-col p-4 md:p-10 max-w-3xl mx-auto w-full">
              <div className="flex-1 overflow-y-auto space-y-6 pr-0 md:pr-4 custom-scrollbar">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'Cupid' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2`}>
                    <div className={`max-w-[80%] p-6 ${msg.role === 'Cupid' ? 'chat-bubble-cupid' : 'chat-bubble-user'} shadow-xl`}>
                      <div className="text-[9px] font-bold uppercase tracking-[0.3em] mb-2 opacity-30">{msg.role} Protocol</div>
                      <p className="text-sm leading-relaxed text-white/90">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isProcessing && <div className="chat-bubble-cupid p-4 w-16 animate-pulse ml-2" />}
                <div ref={chatBottomRef} />
              </div>
              <div className="mt-4 md:mt-8 flex gap-3 md:gap-4 p-4 glass rounded-3xl border border-white/5 items-center">
                {onboardingStep === 1 && (
                  <button onClick={() => fileInputRef.current?.click()} className={`p-4 rounded-2xl transition-all shrink-0 ${uploadedImage ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-indigo-500/20 text-[color:var(--theme-accent)] animate-pulse border border-indigo-500/30'}`}>
                    {uploadedImage ? <CheckCircle2 size={24} /> : <Camera size={24} />}
                  </button>
                )}
                <input className="flex-1 bg-transparent px-4 text-white outline-none placeholder:text-white/10 text-sm" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleOnboardingChat()} placeholder={onboardingStep === 1 ? "Upload evidence first..." : "Enter response..."} disabled={onboardingStep === 1 && !uploadedImage} />
                <button onClick={handleOnboardingChat} disabled={onboardingStep === 1 && !uploadedImage} className="bg-[#7000ff] hover:bg-[#8521ff] text-white p-3 md:p-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-20"><ArrowRight size={24} /></button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          ) : selectedPartner ? (
            <div className="flex-1 flex flex-col xl:flex-row p-4 md:p-10 gap-6 md:gap-10 overflow-hidden">
              {/* Profile Card Left */}
              <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
                <div className={`glass p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden transition-all duration-700 ${isTerminated ? 'border-red-600 grayscale bg-red-950/5 shadow-[0_0_40px_rgba(220,38,38,0.2)]' : 'border-white/5'}`}>
                  <div className="relative w-full aspect-square flex items-center justify-center bg-white/5 rounded-3xl overflow-hidden">
                     <img src={selectedPartner.spriteUrl} className={`w-3/4 h-3/4 object-contain z-10 transition-all duration-700 ${isTerminated ? 'opacity-20 scale-90' : 'float-animation mix-blend-screen'}`} />
                     {isTerminated && (
                       <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-in zoom-in duration-500">
                          <X size={160} className="text-red-600 drop-shadow-[0_0_20px_rgba(220,38,38,1)] opacity-80" strokeWidth={5} />
                       </div>
                     )}
                  </div>
                  <div className="mt-8 text-center z-10 w-full space-y-4">
                    {isEditing ? (
                      <input 
                        className="text-2xl font-bold tracking-tighter uppercase bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full text-center outline-none focus:border-[#ff007a]/50" 
                        value={selectedPartner.name}
                        onChange={(e) => updatePartner({ name: e.target.value })}
                      />
                    ) : (
                      <div className={`text-2xl font-bold tracking-tighter uppercase transition-all ${isTerminated ? 'text-red-600 line-through' : 'text-white/90'}`}>{selectedPartner.name}</div>
                    )}
                    <div className="flex justify-center"><CompassionMeter current={selectedPartner.currentCompassion} max={selectedPartner.totalCompassion} big /></div>
                  </div>
                </div>
                
                <div className={`glass p-6 space-y-4 transition-all duration-700 ${isTerminated ? 'bg-red-900/20 border-red-500/40' : 'border-white/5'}`}>
                  <h4 className={`text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 ${isTerminated ? 'text-red-400' : 'text-white/30'}`}>
                    {isTerminated ? <><AlertCircle size={14}/> TERMINATION ALERT</> : "Cupid Intel"}
                  </h4>
                  {isEditing ? (
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white/60 outline-none focus:border-[#ff007a]/50 italic min-h-[80px]"
                      value={selectedPartner.flavorText}
                      onChange={(e) => updatePartner({ flavorText: e.target.value })}
                    />
                  ) : (
                    <p className={`text-xs leading-relaxed italic ${isTerminated ? 'text-red-200' : 'text-white/60'}`}>
                      {isTerminated ? terminationMessage : `"${selectedPartner.flavorText}"`}
                    </p>
                  )}
                </div>
              </div>

              {/* Tabs Right */}
              <div className="flex-1 overflow-y-auto pr-0 md:pr-4 space-y-6 md:space-y-8 custom-scrollbar">
                {state.currentTab === 'dex' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <DataCard title="TRAITS & ABILITIES">
                         <div className="space-y-4">
                           <TraitList 
                            label="Primary" 
                            traits={selectedPartner.traits.filter(t => t.isPrimary)} 
                            isEditing={isEditing}
                            onUpdate={(newTraits) => updatePartner({ traits: [...selectedPartner.traits.filter(t => !t.isPrimary), ...newTraits] })}
                            isPrimary={true}
                           />
                           <TraitList 
                            label="Secondary" 
                            traits={selectedPartner.traits.filter(t => !t.isPrimary)} 
                            isEditing={isEditing}
                            onUpdate={(newTraits) => updatePartner({ traits: [...selectedPartner.traits.filter(t => t.isPrimary), ...newTraits] })}
                            isPrimary={false}
                           />
                         </div>
                       </DataCard>
                       <DataCard title="HIDDEN SKILL" className="-mt-2">
                          <div className="p-2 transition-all h-full min-h-[180px] flex flex-col justify-center">
                             {isEditing ? (
                               <div className="space-y-3">
                                 <input 
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-[color:var(--theme-accent)] font-bold uppercase outline-none"
                                  value={selectedPartner.hiddenSkill.name}
                                  onChange={(e) => updatePartner({ hiddenSkill: { ...selectedPartner.hiddenSkill, name: e.target.value } })}
                                 />
                                 <textarea 
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-[11px] text-white/60 outline-none h-12"
                                  value={selectedPartner.hiddenSkill.description}
                                  onChange={(e) => updatePartner({ hiddenSkill: { ...selectedPartner.hiddenSkill, description: e.target.value } })}
                                 />
                               </div>
                             ) : (
                               <div className="space-y-2 text-center">
                                 <div className="text-[color:var(--theme-accent)] font-bold uppercase text-xs flex items-center justify-center gap-2 break-words"><Award size={14}/> {selectedPartner.hiddenSkill?.name}</div>
                                 <p className="text-[11px] text-white/60 italic break-words">"{selectedPartner.hiddenSkill?.description}"</p>
                               </div>
                             )}
                          </div>
                       </DataCard>
                    </div>

                    <DataCard title="TYPE EFFECTIVENESS">
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                          <StringListEditor 
                            label="EFFECTIVE AGAINST" 
                            items={selectedPartner.effectiveness.effectiveAgainst}
                            isEditing={isEditing}
                            color="text-green-400"
                            icon={<Zap size={14}/>}
                            onUpdate={(newList) => updatePartner({ effectiveness: { ...selectedPartner.effectiveness, effectiveAgainst: newList } })}
                          />
                          <StringListEditor 
                            label="WEAK TO" 
                            items={selectedPartner.effectiveness.weakTo}
                            isEditing={isEditing}
                            color="text-red-400"
                            icon={<Target size={14}/>}
                            onUpdate={(newList) => updatePartner({ effectiveness: { ...selectedPartner.effectiveness, weakTo: newList } })}
                            variant="pink"
                          />
                       </div>
                    </DataCard>

                    <DataCard title="EVENT LOG" className="relative group">
                       <div className="absolute -top-4 right-4"><Sparkles size={24} className="text-[color:var(--theme-accent)] opacity-20 group-hover:opacity-100 transition-opacity" /></div>
                       <div className="space-y-6">
                          <div data-tutorial="actions">
                            {!isTerminated && (
                              <button onClick={startEmotionalUpdate} className="w-full bg-[#7000ff]/10 hover:bg-[#7000ff]/20 text-[color:var(--theme-accent)] py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] border border-[#7000ff]/20 flex items-center justify-center gap-3 transition-all">
                                 <MessageSquare size={16} /> INITIALIZE EMOTIONAL UPDATE
                              </button>
                            )}
                          </div>
                          <div className="space-y-3 p-5 bg-white/5 rounded-2xl border border-white/5">
                             <input className="w-full bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-white/10 border-b border-white/10" value={manualLogDesc} onChange={e => setManualLogDesc(e.target.value)} placeholder="Enter interaction summary..." />
                             <div className="flex gap-4">
                               <button onClick={() => logEvent(-1, manualLogDesc || "Damage reported")} disabled={!manualLogDesc.trim()} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2.5 rounded-xl text-[10px] font-bold uppercase border border-red-500/10 transition-all disabled:opacity-20">REPORT DAMAGE</button>
                               <button onClick={() => logEvent(1, manualLogDesc || "Growth reported")} disabled={!manualLogDesc.trim()} className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 py-2.5 rounded-xl text-[10px] font-bold uppercase border border-green-500/10 transition-all disabled:opacity-20">REPORT GROWTH</button>
                             </div>
                          </div>
                       </div>
                    </DataCard>
                  </div>
                )}

                {state.currentTab === 'stats' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
                       <DataCard title="BASE STATS" className="flex-1">
                          <div className="space-y-5 py-2">
                             {(['compassion', 'smarts', 'looks', 'personality', 'reliability', 'chemistry'] as const).map(key => (
                               <div key={key} className="space-y-2">
                                 {isEditing && (
                                   <input 
                                    type="range" min="0" max="100" 
                                    className="w-full accent-[#ff007a]" 
                                    value={selectedPartner.stats[key]} 
                                    onChange={(e) => updatePartner({ stats: { ...selectedPartner.stats, [key]: parseInt(e.target.value) } })}
                                   />
                                 )}
                                 <StatBar 
                                  label={key === 'compassion' ? 'Compassion' : key.charAt(0).toUpperCase() + key.slice(1)} 
                                  value={selectedPartner.stats[key]} 
                                  color={key === 'compassion' ? 'bg-red-500' : key === 'smarts' ? 'bg-indigo-500' : key === 'looks' ? 'bg-cyan-500' : key === 'personality' ? 'bg-pink-500' : key === 'reliability' ? 'bg-green-500' : 'bg-amber-500'} 
                                 />
                               </div>
                             ))}
                          </div>
                       </DataCard>
                       <DataCard title="CONNECTION RADAR" className="w-full lg:w-72 flex items-center justify-center">
                          <RadarChart stats={[
                             { label: 'Compassion', value: selectedPartner.stats?.compassion || 0 },
                             { label: 'Smarts', value: selectedPartner.stats?.smarts || 0 },
                             { label: 'Looks', value: selectedPartner.stats?.looks || 0 },
                             { label: 'Personality', value: selectedPartner.stats?.personality || 0 },
                             { label: 'Reliability', value: selectedPartner.stats?.reliability || 0 },
                             { label: 'Chemistry', value: selectedPartner.stats?.chemistry || 0 },
                          ]} />
                       </DataCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <DataCard title="RELATIONSHIP LEVEL">
                          <div className="flex items-center gap-4 py-4 h-full">
                             <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[color:var(--theme-primary)]"><Award size={24}/></div>
                             {isEditing ? (
                               <select 
                                className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none uppercase tracking-tighter"
                                value={selectedPartner.relationshipType}
                                onChange={(e) => updatePartner({ relationshipType: e.target.value as RelationshipType })}
                               >
                                {Object.values(RelationshipType).map((level) => (
                                  <option key={level} value={level}>{level}</option>
                                ))}
                               </select>
                             ) : (
                               <div className="text-sm font-bold text-white/90 leading-relaxed uppercase tracking-widest">{selectedPartner.relationshipType}</div>
                             )}
                          </div>
                       </DataCard>
                       <DataCard title="CURRENT STATUS">
                          <div className="flex items-center gap-4 py-4 h-full">
                             <div className={`w-3 h-3 rounded-full ${selectedPartner.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-red-500'} animate-pulse`}></div>
                             {isEditing ? (
                               <select 
                                className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none"
                                value={selectedPartner.status}
                                onChange={(e) => updatePartner({ status: e.target.value as any })}
                               >
                                 <option value="ACTIVE">ACTIVE</option>
                                 <option value="ARCHIVED">ARCHIVED</option>
                                 <option value="TERMINATED">TERMINATED</option>
                               </select>
                             ) : (
                               <div className="text-lg font-bold text-white uppercase tracking-widest">{selectedPartner.status}</div>
                             )}
                          </div>
                       </DataCard>
                    </div>
                  </div>
                )}

                {state.currentTab === 'lore' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <DataCard title="MEETING DATA">
                          <div className="flex items-start gap-4 py-2">
                             <MapPin size={20} className="text-cyan-400 shrink-0 mt-1" />
                             <div className="flex-1">
                                <div className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Deployment Zone</div>
                                {isEditing ? (
                                  <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-white outline-none"
                                    value={selectedPartner.meetingLocation}
                                    onChange={(e) => updatePartner({ meetingLocation: e.target.value })}
                                  />
                                ) : (
                                  <p className="text-sm text-white/80 font-medium">{selectedPartner.meetingLocation}</p>
                                )}
                             </div>
                          </div>
                       </DataCard>
                       <DataCard title="INTERACTION TIMELINE">
                          <div className="flex items-start gap-4 py-2">
                             <Clock size={20} className="text-amber-400 shrink-0 mt-1" />
                             <div>
                                <div className="text-[10px] text-white/20 uppercase tracking-widest mb-1">Latest Pulse</div>
                                <p className="text-sm text-white/80 font-medium">
                                   {selectedPartner.interactionLog[0] ? new Date(selectedPartner.interactionLog[0].timestamp).toLocaleDateString() : 'N/A'}
                                </p>
                             </div>
                          </div>
                       </DataCard>
                    </div>

                    <DataCard title="DATE CHECKLIST">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 md:gap-x-10 py-2">
                          {selectedPartner.dateChecklist.map(item => (
                             <div key={item.id} className="flex items-center gap-4 group text-left">
                                <button onClick={() => toggleChecklist(item.id)} className="shrink-0">
                                  {item.isCompleted ? <CheckSquare size={18} className="text-[#00f2ff]" /> : <Square size={18} className="text-white/10 group-hover:text-white/30" />}
                                </button>
                                {isEditing ? (
                                  <input 
                                    className="flex-1 bg-transparent border-b border-white/10 text-xs uppercase tracking-widest text-white/80 outline-none"
                                    value={item.label}
                                    onChange={(e) => {
                                      const newChecklist = selectedPartner.dateChecklist.map(c => c.id === item.id ? { ...c, label: e.target.value } : c);
                                      updatePartner({ dateChecklist: newChecklist });
                                    }}
                                  />
                                ) : (
                                  <span className={`text-xs uppercase tracking-widest ${item.isCompleted ? 'text-white/80' : 'text-white/30'}`}>{item.label}</span>
                                )}
                                {isEditing && (
                                  <button onClick={() => updatePartner({ dateChecklist: selectedPartner.dateChecklist.filter(c => c.id !== item.id) })}>
                                    <Trash2 size={12} className="text-red-500/50 hover:text-red-500" />
                                  </button>
                                )}
                             </div>
                          ))}
                          {isEditing && (
                            <button 
                              className="col-span-2 flex items-center gap-2 text-[10px] text-cyan-400/50 hover:text-cyan-400 uppercase tracking-widest py-2 border-2 border-dashed border-white/5 rounded-xl justify-center mt-2"
                              onClick={() => updatePartner({ dateChecklist: [...selectedPartner.dateChecklist, { id: Math.random().toString(), label: 'NEW TASK', isCompleted: false }] })}
                            >
                              <PlusCircle size={14} /> Add Checklist Item
                            </button>
                          )}
                       </div>
                    </DataCard>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       <PreferenceListEditor 
                        label="LOVES" 
                        items={selectedPartner.preferences.filter(p => p.isLove)}
                        isEditing={isEditing}
                        onUpdate={(newLoveItems) => updatePartner({ preferences: [...selectedPartner.preferences.filter(p => !p.isLove), ...newLoveItems] })}
                        isLove={true}
                       />
                       <PreferenceListEditor 
                        label="HATES" 
                        items={selectedPartner.preferences.filter(p => !p.isLove)}
                        isEditing={isEditing}
                        onUpdate={(newHateItems) => updatePartner({ preferences: [...selectedPartner.preferences.filter(p => p.isLove), ...newHateItems] })}
                        isLove={false}
                       />
                    </div>
                  </div>
                )}

                {state.currentTab === 'history' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    {selectedPartner.interactionLog.map(l => (
                      <div key={l.id} className="glass p-6 flex justify-between items-center border border-white/5 hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-6">
                          <div className={`w-2 h-2 rounded-full ${l.type === LogType.NEGATIVE ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : l.type === LogType.POSITIVE ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-indigo-500 shadow-[0_0_10px_#7000ff]'}`}></div>
                          <div>
                            <p className="text-sm font-medium text-white/90 leading-relaxed">{l.description}</p>
                            <p className="text-[9px] text-white/20 uppercase mt-1 tracking-[0.2em]">{new Date(l.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-xs font-mono font-bold text-white/10">{l.compassionDelta > 0 ? '+' : ''}{l.compassionDelta} RESONANCE</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-10">
               <ShieldAlert size={80} className="text-[color:var(--theme-primary)]" />
               <p className="mt-6 text-[10px] font-bold tracking-[0.5em] uppercase text-white/40">Searching Database...</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal - Emotional Lab */}
      <Modal isOpen={isEmotionalUpdateOpen} onClose={() => setIsEmotionalUpdateOpen(false)} title="Cupid's Analytical Lab">
        <div className="h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {emotionalChat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'Cupid' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-4 rounded-3xl ${msg.role === 'Cupid' ? 'chat-bubble-cupid shadow-indigo-900/10' : 'chat-bubble-user shadow-cyan-900/10'} shadow-lg`}>
                  <p className="text-sm text-white/90 whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  {i === emotionalChat.length - 1 && verdict && (
                    <div className="mt-5 flex gap-3 animate-in zoom-in duration-300">
                      <button onClick={() => applyVerdict(true)} className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-green-500/20 transition-all">
                        <ThumbsUp size={16} /> CONFIRM
                      </button>
                      <button onClick={() => applyVerdict(false)} className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border border-red-500/20 transition-all">
                        <ThumbsDown size={16} /> REJECT
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isProcessing && <div className="chat-bubble-cupid p-3 w-14 animate-pulse" />}
            <div ref={emotionalBottomRef} />
          </div>
          {!verdict && (
            <div className="mt-6 flex gap-3">
              <input className="flex-1 glass bg-white/5 rounded-2xl px-5 text-sm text-white outline-none border border-white/5 h-12" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleEmotionalUpdateChat()} placeholder="Spill it to Cupid..." />
              <button onClick={handleEmotionalUpdateChat} className="bg-[#7000ff] text-white w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-[#8521ff] transition-all shadow-lg"><Send size={20} /></button>
            </div>
          )}
        </div>
      </Modal>

      {state.showPRD && <PRDView onClose={() => setState(s => ({ ...s, showPRD: false }))} />}

      {/* Tutorial Overlay */}
      <Tutorial
        isOpen={showTutorial && !isOnboarding}
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentTheme={currentThemeId}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
};

// --- Subcomponents for Editing ---

const TraitList: React.FC<{ label: string, traits: Trait[], isEditing: boolean, onUpdate: (newTraits: Trait[]) => void, isPrimary: boolean }> = ({ label, traits, isEditing, onUpdate, isPrimary }) => {
  const [newVal, setNewVal] = useState('');
  return (
    <div className="space-y-1">
      <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest flex justify-between items-center">
        {label}
        {isEditing && (
          <div className="flex gap-1">
            <input 
              className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[8px] text-white w-20"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              placeholder="Add trait..."
            />
            <button 
              onClick={() => {
                if (newVal.trim()) {
                  onUpdate([...traits, { id: Math.random().toString(), partnerId: '', name: newVal.trim(), isPrimary }]);
                  setNewVal('');
                }
              }}
            >
              <PlusCircle size={10} className="text-[color:var(--theme-accent)]" />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {traits.map(t => (
          <div key={t.id} className="relative group">
            <TagPill variant={isPrimary ? 'cyan' : 'pink'}>{t.name}</TagPill>
            {isEditing && (
              <button 
                onClick={() => onUpdate(traits.filter(x => x.id !== t.id))}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform"
              >
                <X size={8} className="text-white" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const StringListEditor: React.FC<{ label: string, items: string[], isEditing: boolean, color: string, icon: React.ReactNode, onUpdate: (newList: string[]) => void, variant?: 'cyan' | 'pink' }> = ({ label, items, isEditing, color, icon, onUpdate, variant }) => {
  const [newVal, setNewVal] = useState('');
  return (
    <div className="space-y-3">
      <div className={`text-[10px] font-bold ${color} flex items-center justify-between gap-2`}>
        <div className="flex items-center gap-2">{icon} {label}</div>
        {isEditing && (
          <div className="flex gap-1">
            <input 
              className="bg-white/5 border border-white/10 rounded px-2 py-0.5 text-[8px] text-white w-24"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              placeholder="Add item..."
            />
            <button 
              onClick={() => {
                if (newVal.trim()) {
                  onUpdate([...items, newVal.trim()]);
                  setNewVal('');
                }
              }}
            >
              <PlusCircle size={12} />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((e, i) => (
          <div key={i} className="relative group">
            <TagPill variant={variant}>{e}</TagPill>
            {isEditing && (
              <button 
                onClick={() => onUpdate(items.filter((_, idx) => idx !== i))}
                className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform"
              >
                <X size={8} className="text-white" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const PreferenceListEditor: React.FC<{ label: string, items: Preference[], isEditing: boolean, onUpdate: (newItems: Preference[]) => void, isLove: boolean }> = ({ label, items, isEditing, onUpdate, isLove }) => {
  const [newVal, setNewVal] = useState('');
  return (
    <DataCard title={label}>
      <div className="space-y-3">
        {items.map(p => (
          <div key={p.id} className={`flex items-center justify-between gap-3 p-2.5 rounded-xl border ${isLove ? 'bg-green-500/5 border-green-500/10' : 'bg-red-500/5 border-red-500/10'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${isLove ? 'bg-green-500' : 'bg-red-500'}`} />
              {isEditing ? (
                <input 
                  className="bg-transparent text-[11px] text-white/70 uppercase tracking-widest outline-none border-b border-white/5"
                  value={p.label}
                  onChange={(e) => onUpdate(items.map(x => x.id === p.id ? { ...x, label: e.target.value } : x))}
                />
              ) : (
                <span className="text-[11px] text-white/70 uppercase tracking-widest">{p.label}</span>
              )}
            </div>
            {isEditing && (
              <button onClick={() => onUpdate(items.filter(x => x.id !== p.id))}>
                <Trash2 size={12} className="text-red-500/50 hover:text-red-500" />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <div className="flex gap-2 mt-4">
            <input 
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              placeholder="Add preference..."
            />
            <button 
              onClick={() => {
                if (newVal.trim()) {
                  onUpdate([...items, { id: Math.random().toString(), partnerId: '', label: newVal.trim(), isLove }]);
                  setNewVal('');
                }
              }}
              className="bg-white/5 p-2 rounded-lg text-white/40 hover:text-white"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </DataCard>
  );
};

// --- Generic Components ---

const NavIcon: React.FC<{ icon: React.ReactNode, active?: boolean, onClick: () => void, label: string, color?: string }> = ({ icon, active, onClick, label, color = "text-white" }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-2 md:gap-3 group transition-all duration-300 ${active ? 'scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'}`}>
    <div className={`p-3 md:p-4 rounded-2xl transition-all duration-500 ${active ? 'bg-white/10 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] text-[color:var(--theme-primary)]' : color}`}>{icon}</div>
    <span className={`hidden md:block text-[8px] font-bold tracking-[0.3em] uppercase transition-colors ${active ? 'text-white' : 'text-white/75'}`}>{label}</span>
  </button>
);

const DataCard: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className = '' }) => (
  <div className={`glass p-6 md:p-8 border border-white/5 hover:border-white/10 transition-all duration-500 group ${className}`}>
    <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] mb-6 md:mb-8 border-b border-white/5 pb-3 flex items-center justify-between">
       {title}
       <Info size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </h4>
    {children}
  </div>
);

export default App;
