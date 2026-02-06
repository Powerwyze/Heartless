import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Heart, Plus, Power, MessageSquare, Camera, User, History, Activity, ShieldAlert, BookOpen, Settings as SettingsIcon, Image as ImageIcon, CheckCircle2, ArrowRight, X, ThumbsUp, ThumbsDown, Sparkles, AlertCircle, Send, Zap, Shield, Target, Award, Brain, Star, MapPin, CheckSquare, Square, Clock, TrendingUp, Info, Save, Edit2, Trash2, PlusCircle, Archive } from 'lucide-react';
import { Partner, RelationshipType, InteractionLog, AppState, LogType, Trait, Preference, AuthUser } from './types';
import { INITIAL_PARTNERS } from './constants';
import { PixelButton as ModernButton, CompassionMeter, StatBar, TagPill, RadarChart, Modal } from './components/RetroUI';
import { PRDView } from './components/PRDView';
import { HeartlessAIService } from './services/geminiService';
import { onAuthStateChange, signOut as firebaseSignOut, deleteAccount as deleteFirebaseAccount } from './services/authService';
import { getPartners, createPartner, updatePartner as updatePartnerFirestore, addInteractionLog, updateChecklistItem as updateChecklistFirestore, addTrait, addPreference, deleteTrait, deletePreference, deletePartner, deleteUserData } from './services/firestoreService';
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
  const TAROT_CARDS = [
    'The Fool',
    'The Magician',
    'The High Priestess',
    'The Empress',
    'The Emperor',
    'The Hierophant',
    'The Lovers',
    'The Chariot',
    'Strength',
    'The Hermit',
    'Wheel of Fortune',
    'Justice',
    'The Hanged Man',
    'Death',
    'Temperance',
    'The Devil',
    'The Tower',
    'The Star',
    'The Moon',
    'The Sun',
    'Judgement',
    'The World',
    'Ace of Wands',
    'Two of Wands',
    'Three of Wands',
    'Four of Wands',
    'Five of Wands',
    'Six of Wands',
    'Seven of Wands',
    'Eight of Wands',
    'Nine of Wands',
    'Ten of Wands',
    'Page of Wands',
    'Knight of Wands',
    'Queen of Wands',
    'King of Wands',
    'Ace of Cups',
    'Two of Cups',
    'Three of Cups',
    'Four of Cups',
    'Five of Cups',
    'Six of Cups',
    'Seven of Cups',
    'Eight of Cups',
    'Nine of Cups',
    'Ten of Cups',
    'Page of Cups',
    'Knight of Cups',
    'Queen of Cups',
    'King of Cups',
    'Ace of Swords',
    'Two of Swords',
    'Three of Swords',
    'Four of Swords',
    'Five of Swords',
    'Six of Swords',
    'Seven of Swords',
    'Eight of Swords',
    'Nine of Swords',
    'Ten of Swords',
    'Page of Swords',
    'Knight of Swords',
    'Queen of Swords',
    'King of Swords',
    'Ace of Pentacles',
    'Two of Pentacles',
    'Three of Pentacles',
    'Four of Pentacles',
    'Five of Pentacles',
    'Six of Pentacles',
    'Seven of Pentacles',
    'Eight of Pentacles',
    'Nine of Pentacles',
    'Ten of Pentacles',
    'Page of Pentacles',
    'Knight of Pentacles',
    'Queen of Pentacles',
    'King of Pentacles',
  ];
  const defaultCompatibility = {
    tarotQuestion: '',
    tarotDeck: [],
    tarotSelected: [],
    tarotReading: '',
    partnerSign: '',
    userSign: '',
    horoscopeFortune: '',
    horoscopeDateKey: '',
    libidoRating: 5,
    wingPreference: '',
    introExtro: '',
    faith: '',
  };
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
  const [isHoroscopeLoading, setIsHoroscopeLoading] = useState(false);
  const [isTarotLoading, setIsTarotLoading] = useState(false);
  const [tarotDealCount, setTarotDealCount] = useState(0);
  const [isTarotDealing, setIsTarotDealing] = useState(false);
  const [onboardingGroup, setOnboardingGroup] = useState<'family' | 'friend' | 'romantic' | null>(null);

  // Emotional Update State
  const [isEmotionalUpdateOpen, setIsEmotionalUpdateOpen] = useState(false);
  const [emotionalChat, setEmotionalChat] = useState<{role: 'Cupid' | 'User', text: string}[]>([]);
  const [verdict, setVerdict] = useState<{ delta: number, reason: string } | null>(null);

  // Tutorial State
  const [showTutorial, setShowTutorial] = useState(false);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState(() => {
    const storedTheme = localStorage.getItem('heartless_theme');
    return storedTheme && storedTheme !== 'mono' ? storedTheme : 'ocean';
  });
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('heartless_mode') as 'light' | 'dark') || 'light';
  });

  const currentTheme = useMemo(() => getTheme(currentThemeId), [currentThemeId]);

  useEffect(() => {
    if (currentThemeId === 'mono') {
      setCurrentThemeId('ocean');
      localStorage.setItem('heartless_theme', 'ocean');
    }
  }, [currentThemeId]);
  const toRgba = (hex: string, alpha: number) => {
    const cleaned = hex.replace('#', '');
    const normalized = cleaned.length === 3
      ? cleaned.split('').map((c) => c + c).join('')
      : cleaned;
    const num = parseInt(normalized, 16);
    if (Number.isNaN(num)) return hex;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const modeVars = useMemo(() => {
    if (themeMode === 'light') {
      return {
        bg: '#f2f2f5',
        bgAlt: '#ffffff',
        surface: '#f7f7fa',
        text: '#0f1115',
        textMuted: '#4b5563',
        textSubtle: '#6b7280',
        border: toRgba(currentTheme.colors.primary, 0.25),
        borderHover: toRgba(currentTheme.colors.primary, 0.45),
        gradA: toRgba(currentTheme.colors.primary, 0.12),
        gradB: toRgba(currentTheme.colors.accent, 0.10),
      };
    }
    return {
      bg: '#0f0f12',
      bgAlt: '#0d0d12',
      surface: '#14141a',
      text: '#f0f6f7',
      textMuted: '#9aa4ab',
      textSubtle: '#6b7280',
      border: toRgba(currentTheme.colors.primary, 0.25),
      borderHover: toRgba(currentTheme.colors.primary, 0.5),
      gradA: toRgba(currentTheme.colors.primary, 0.08),
      gradB: toRgba(currentTheme.colors.accent, 0.06),
    };
  }, [currentTheme, themeMode, toRgba]);

  const themeVars = useMemo(() => ({
    ['--theme-primary' as any]: currentTheme.colors.primary,
    ['--theme-primary-hover' as any]: currentTheme.colors.primaryHover,
    ['--theme-accent' as any]: currentTheme.colors.accent,
    ['--theme-accent-hover' as any]: currentTheme.colors.accentHover,
    ['--theme-bg' as any]: modeVars.bg,
    ['--theme-bg-alt' as any]: modeVars.bgAlt,
    ['--theme-surface' as any]: modeVars.surface,
    ['--theme-text' as any]: modeVars.text,
    ['--theme-text-muted' as any]: modeVars.textMuted,
    ['--theme-text-subtle' as any]: modeVars.textSubtle,
    ['--theme-border' as any]: modeVars.border,
    ['--theme-border-hover' as any]: modeVars.borderHover,
    ['--theme-grad-a' as any]: modeVars.gradA,
    ['--theme-grad-b' as any]: modeVars.gradB,
  }), [currentTheme, modeVars]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeVars).forEach(([key, value]) => {
      root.style.setProperty(key, String(value));
    });
  }, [themeVars]);

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
  const compatibility = { ...defaultCompatibility, ...(selectedPartner?.compatibility || {}) };

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

  const updateCompatibility = (updates: Partial<NonNullable<Partner['compatibility']>>) => {
    if (!selectedPartner) return;
    updatePartner({ compatibility: { ...compatibility, ...updates } });
  };

  const getRelationshipGroup = (relationshipType: RelationshipType) => {
    const family = new Set([
      RelationshipType.MOTHER,
      RelationshipType.FATHER,
      RelationshipType.SIBLING,
      RelationshipType.COUSIN,
      RelationshipType.AUNT_UNCLE,
      RelationshipType.GRANDPARENT,
      RelationshipType.CHILD,
    ]);
    const friends = new Set([
      RelationshipType.FRIEND,
      RelationshipType.BEST_FRIEND,
      RelationshipType.COWORKER,
    ]);

    if (family.has(relationshipType)) return 'family';
    if (friends.has(relationshipType)) return 'friend';
    return 'romantic';
  };

  const createTarotDeck = () => {
    const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  };

  const tarotSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const majorArcanaSet = new Set([
    'The Fool',
    'The Magician',
    'The High Priestess',
    'The Empress',
    'The Emperor',
    'The Hierophant',
    'The Lovers',
    'The Chariot',
    'Strength',
    'The Hermit',
    'Wheel of Fortune',
    'Justice',
    'The Hanged Man',
    'Death',
    'Temperance',
    'The Devil',
    'The Tower',
    'The Star',
    'The Moon',
    'The Sun',
    'Judgement',
    'The World',
  ]);

  const getTarotSuit = (card: string) => {
    if (card.includes('Wands')) return 'Wands';
    if (card.includes('Cups')) return 'Cups';
    if (card.includes('Swords')) return 'Swords';
    if (card.includes('Pentacles')) return 'Pentacles';
    return '';
  };

  const handleStartTarot = () => {
    if (!compatibility.tarotQuestion.trim()) return;
    updateCompatibility({
      tarotDeck: createTarotDeck(),
      tarotSelected: [],
      tarotReading: '',
    });
    setTarotDealCount(0);
    setIsTarotDealing(true);
  };

  const handleResetTarot = () => {
    updateCompatibility({
      tarotQuestion: '',
      tarotDeck: [],
      tarotSelected: [],
      tarotReading: '',
    });
    setTarotDealCount(0);
    setIsTarotDealing(false);
  };

  const handleSelectTarotCard = async (card: string) => {
    if (!selectedPartner || isTarotLoading) return;
    if (compatibility.tarotSelected.includes(card)) return;
    if (compatibility.tarotSelected.length >= 3) return;

    const nextSelected = [...compatibility.tarotSelected, card];
    updateCompatibility({ tarotSelected: nextSelected });

    if (nextSelected.length === 3) {
      setIsTarotLoading(true);
      try {
        const reading = await ai.getTarotReading(compatibility.tarotQuestion, nextSelected);
        updateCompatibility({ tarotReading: reading });
      } catch (error) {
        console.error('Failed to generate tarot reading:', error);
        updateCompatibility({ tarotReading: 'The cards are quiet right now. Try again.' });
      } finally {
        setIsTarotLoading(false);
      }
    }
  };

  const getEasternDateKey = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  };

  const getEasternParts = () => {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || '0';
    return {
      year: parseInt(getPart('year'), 10),
      month: parseInt(getPart('month'), 10),
      day: parseInt(getPart('day'), 10),
      hour: parseInt(getPart('hour'), 10),
      minute: parseInt(getPart('minute'), 10),
      second: parseInt(getPart('second'), 10),
    };
  };

  const handleGenerateHoroscope = async () => {
    if (!selectedPartner || !compatibility.userSign || !compatibility.partnerSign || isHoroscopeLoading) return;
    setIsHoroscopeLoading(true);
    try {
      const fortune = await ai.getHoroscopeCompatibility(compatibility.userSign, compatibility.partnerSign);
      updateCompatibility({ horoscopeFortune: fortune, horoscopeDateKey: getEasternDateKey() });
    } catch (error) {
      console.error('Failed to generate horoscope fortune:', error);
      updateCompatibility({ horoscopeFortune: 'Signal interference. Try again in a moment.' });
    } finally {
      setIsHoroscopeLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedPartner || !compatibility.userSign || !compatibility.partnerSign || isHoroscopeLoading) return;
    const todayKey = getEasternDateKey();
    if (compatibility.horoscopeDateKey === todayKey && compatibility.horoscopeFortune) return;
    handleGenerateHoroscope();
  }, [selectedPartner?.id, compatibility.userSign, compatibility.partnerSign, compatibility.horoscopeDateKey, compatibility.horoscopeFortune]);

  useEffect(() => {
    if (!selectedPartner || !compatibility.userSign || !compatibility.partnerSign) return;
    const { year, month, day, hour, minute, second } = getEasternParts();
    const nowUtc = Date.UTC(year, month - 1, day, hour, minute, second);
    const nextMidnightUtc = Date.UTC(year, month - 1, day + 1, 0, 0, 5);
    const delay = Math.max(1000, nextMidnightUtc - nowUtc);
    const timeoutId = window.setTimeout(() => {
      handleGenerateHoroscope();
    }, delay);
    return () => window.clearTimeout(timeoutId);
  }, [selectedPartner?.id, compatibility.userSign, compatibility.partnerSign]);

  useEffect(() => {
    if (!isTarotDealing || compatibility.tarotDeck.length === 0) return;
    let current = 0;
    setTarotDealCount(0);
    const intervalId = window.setInterval(() => {
      current += 1;
      setTarotDealCount(current);
      if (current >= 10) {
        window.clearInterval(intervalId);
        setIsTarotDealing(false);
      }
    }, 120);
    return () => window.clearInterval(intervalId);
  }, [isTarotDealing, compatibility.tarotDeck.length]);

  const handleRemovePartner = async () => {
    if (!selectedPartner) return;
    const confirmed = window.confirm(`Remove ${selectedPartner.name} from your database? This cannot be undone.`);
    if (!confirmed) return;

    const previousPartners = state.partners;
    const removedId = selectedPartner.id;

    setIsEditing(false);
    setState(prev => {
      const partners = prev.partners.filter(p => p.id !== removedId);
      const nextSelectedId = prev.selectedPartnerId === removedId ? (partners[0]?.id ?? null) : prev.selectedPartnerId;
      return { ...prev, partners, selectedPartnerId: nextSelectedId };
    });

    try {
      await deletePartner(removedId);
    } catch (error) {
      console.error('Failed to delete partner:', error);
      setState(prev => ({
        ...prev,
        partners: previousPartners,
        selectedPartnerId: prev.selectedPartnerId ?? previousPartners[0]?.id ?? null,
      }));
    }
  };

  const startOnboarding = () => {
    setIsOnboarding(true);
    setChatHistory([{ 
      role: 'Cupid', 
      text: "Welcome to the Lab, darling! I sense a new connection in the air. To get started, I'll need a visual signature. Upload a photo of your interest and I'll work my magic to manifest their spirit in our system!" 
    }]);
    setOnboardingStep(0);
    setUploadedImage(null);
    setOnboardingGroup(null);
  };

  const handleOnboardingChat = async () => {
    if (onboardingStep === 0 && !uploadedImage) return;
    if (!userInput.trim() || isProcessing) return;

    const currentInput = userInput;
    const newHistory = [...chatHistory, { role: 'User', text: currentInput } as const];
    setChatHistory(newHistory);
    setUserInput('');
    setIsProcessing(true);

    const questionSets = {
      romantic: [
        "What's their name?",
        "Where did your orbits first cross? App, work, a fever dream?",
        "What is their defining trait? Tell me their essence.",
        "Warning: Every rose has thorns. What's the one thing that makes you go 'yikes'?",
      ],
      friend: [
        "What's their name?",
        "How do you know each other?",
        "What's their defining trait as a friend?",
        "What do they do that you love most?",
        "What's the biggest friction point between you two?",
      ],
      family: [
        "What's their name?",
        "What's your relation (mom, dad, sibling, cousin, etc.)?",
        "What role do they play in your life?",
        "What's your strongest memory with them?",
        "What's the biggest tension or boundary right now?",
      ],
    } as const;

    if (onboardingStep === 1) {
      const normalized = currentInput.toLowerCase();
      const group = normalized.includes('family')
        ? 'family'
        : normalized.includes('friend')
        ? 'friend'
        : (normalized.includes('romantic') || normalized.includes('partner'))
        ? 'romantic'
        : null;
      if (!group) {
        setChatHistory(prev => [...prev, { role: 'Cupid', text: "Pick one: family, friend, or romantic partner." }]);
        setIsProcessing(false);
        return;
      }
      setOnboardingGroup(group);
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'Cupid', text: questionSets[group][0] }]);
        setOnboardingStep(2);
        setIsProcessing(false);
      }, 600);
      return;
    }

    const groupKey = onboardingGroup || 'romantic';
    const currentQuestions = questionSets[groupKey];
    const questionIndex = onboardingStep - 2;

    if (questionIndex < currentQuestions.length - 1) {
      setTimeout(() => {
        setChatHistory(prev => [...prev, { role: 'Cupid', text: currentQuestions[questionIndex + 1] }]);
        setOnboardingStep(prev => prev + 1);
        setIsProcessing(false);
      }, 1000);
    } else {
        const profile = await ai.synthesizeProfile(newHistory, groupKey);
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
          interactionLog: [{ id: '0', partnerId, timestamp: Date.now(), type: LogType.SYSTEM, description: "Connection Initialized.", compassionDelta: 0 }],
          compatibility: {
            tarotQuestion: '',
            tarotDeck: [],
            tarotSelected: [],
            tarotReading: '',
            partnerSign: '',
            userSign: '',
            horoscopeFortune: '',
            horoscopeDateKey: '',
            libidoRating: 5,
            wingPreference: '',
            introExtro: '',
            faith: '',
          }
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
      setChatHistory(prev => [
        ...prev,
        { role: 'Cupid', text: "Visual ID verified. Who is this person you're adding: family, friend, or romantic partner?" }
      ]);
      setOnboardingStep(1);
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
  const handleThemeModeChange = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    localStorage.setItem('heartless_mode', mode);
  };

  const handleDeleteAccount = async () => {
    if (!authUser) return;
    const confirmed = window.confirm('Delete your account and all data? This cannot be undone.');
    if (!confirmed) return;
    setShowSettings(false);

    try {
      await deleteUserData(authUser.uid);
      await deleteFirebaseAccount();
      setState(prev => ({ ...prev, partners: [], selectedPartnerId: null }));
      setAuthUser(null);
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      alert(error?.message || 'Failed to delete account. Please sign in again and try.');
    }
  };

  // Show loading state while checking auth
  if (isAuthLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[var(--theme-bg,#0a0a0a)]" style={themeVars}>
        <div className="font-mono text-sm uppercase tracking-wide text-[var(--theme-text-muted,#919FA5)]">Loading...</div>
        <div className="mt-4 text-center text-sm text-[var(--theme-text-subtle,#747474)] italic max-w-md">{loadingQuote}</div>
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
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[var(--theme-bg,#0a0a0a)]" style={themeVars}>
        <div className="font-mono text-sm uppercase tracking-wide text-[var(--theme-text-muted,#919FA5)]">Loading Partners...</div>
        <div className="mt-4 text-center text-sm text-[var(--theme-text-subtle,#747474)] italic max-w-md">{loadingQuote}</div>
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
    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[var(--theme-bg,#0a0a0a)]" style={themeVars}>
      {/* Sidebar */}
      <div className="order-last md:order-first w-full md:w-20 flex md:flex-col flex-row items-center md:py-8 py-3 border-t md:border-t-0 md:border-r border-[var(--theme-border,#2a2a2a)] bg-[var(--theme-bg,#0a0a0a)] shrink-0 fixed md:static bottom-0 left-0 z-50">
        <button
          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center md:mb-8 mb-0 ml-4 md:ml-0 rounded border border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)] transition-colors"
          style={{ color: currentTheme.colors.primary }}
          onClick={() => setShowSettings(true)}
          aria-label="Open theme settings"
        >
          <Heart size={18} fill="currentColor" />
        </button>
        <div className="flex-1 flex md:flex-col flex-row gap-2 md:gap-4 px-4 md:px-0 overflow-x-auto md:overflow-visible" data-tutorial="tabs">
          <NavIcon icon={<User size={18}/>} active={state.currentTab === 'dex'} onClick={() => setState(s => ({...s, currentTab: 'dex'}))} label="DEX" />
          <NavIcon icon={<Activity size={18}/>} active={state.currentTab === 'stats'} onClick={() => setState(s => ({...s, currentTab: 'stats'}))} label="STATS" />
          <NavIcon icon={<Sparkles size={18}/>} active={state.currentTab === 'compat'} onClick={() => setState(s => ({...s, currentTab: 'compat'}))} label="MATCH" />
          <NavIcon icon={<Archive size={18}/>} active={state.currentTab === 'storage'} onClick={() => setState(s => ({...s, currentTab: 'storage'}))} label="STORAGE" />
          <NavIcon icon={<BookOpen size={18}/>} active={state.currentTab === 'lore'} onClick={() => setState(s => ({...s, currentTab: 'lore'}))} label="INTEL" />
          <NavIcon icon={<History size={18}/>} active={state.currentTab === 'history'} onClick={() => setState(s => ({...s, currentTab: 'history'}))} label="LOGS" />
        </div>
        <div className="mt-0 md:mt-auto flex md:flex-col flex-row gap-2 md:gap-4 mr-4 md:mr-0">
          <div data-tutorial="new-button">
            <NavIcon icon={<Plus size={18}/>} active={isOnboarding} onClick={startOnboarding} label="NEW" />
          </div>
          <NavIcon icon={<Power size={18}/>} onClick={async () => {
            try {
              await firebaseSignOut();
            } catch (error) {
              console.error('Failed to sign out:', error);
            }
          }} label="OFF" color="text-red-400" />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0 pb-16 md:pb-0">
        {/* Header */}
        <header className="h-auto md:h-16 flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-8 py-3 md:py-0 border-b border-[var(--theme-border,#2a2a2a)] bg-[var(--theme-bg-alt,#111111)] gap-3">
          <div className="flex items-center gap-3 md:gap-4 flex-wrap">
            <h2 className="text-sm md:text-base font-semibold tracking-tight text-[var(--theme-text,#F0F6F7)]">
               {isOnboarding ? 'Onboarding Protocol' : (selectedPartner?.name || 'Database')}
            </h2>
            {!isOnboarding && selectedPartner && (
               <div className="flex gap-2 flex-wrap items-center">
                  <TagPill variant="pink">{selectedPartner.relationshipType}</TagPill>
                  <span className="font-mono text-[10px] text-[var(--theme-text-subtle,#747474)]">#{selectedPartner.dexNumber}</span>
               </div>
            )}
          </div>
          {!isOnboarding && (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex -space-x-2 overflow-x-auto" data-tutorial="partner-list">
                {state.partners.map(p => (
                  <button key={p.id} onClick={() => setState(s => ({...s, selectedPartnerId: p.id}))} className={`w-8 h-8 rounded border overflow-hidden transition-all hover:scale-105 ${state.selectedPartnerId === p.id ? 'border-[var(--theme-primary,#F0F6F7)] opacity-100' : 'border-[var(--theme-border,#2a2a2a)] opacity-50 hover:opacity-100'}`}>
                    <img src={p.spriteUrl} alt={p.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                  </button>
                ))}
              </div>
              <button onClick={() => setState(s => ({...s, showPRD: true}))} className="p-1.5 hover:bg-[var(--theme-surface,#141414)] rounded transition-colors text-[var(--theme-text-subtle,#747474)] hover:text-[var(--theme-text,#F0F6F7)]"><SettingsIcon size={16} /></button>
            </div>
          )}
        </header>

        <main className="flex-1 flex overflow-hidden min-h-0">
          {isOnboarding ? (
            <div className="flex-1 flex flex-col p-4 md:p-8 max-w-3xl mx-auto w-full">
              <div className="flex-1 overflow-y-auto space-y-4 pr-0 md:pr-4 custom-scrollbar">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'Cupid' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[80%] p-4 ${msg.role === 'Cupid' ? 'chat-bubble-cupid' : 'chat-bubble-user'}`}>
                      <div className="font-mono text-[9px] uppercase tracking-wide mb-2 text-[var(--theme-text-subtle,#747474)]">{msg.role}</div>
                      <p className="text-sm leading-relaxed text-[var(--theme-text,#F0F6F7)]">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isProcessing && <div className="chat-bubble-cupid p-4 w-16 ml-2"><div className="w-2 h-2 rounded-full bg-[var(--theme-text-subtle,#747474)] animate-pulse" /></div>}
                <div ref={chatBottomRef} />
              </div>
              <div className="mt-4 md:mt-6 flex gap-3 p-3 bg-[var(--theme-surface,#141414)] rounded border border-[var(--theme-border,#2a2a2a)] items-center">
                {onboardingStep === 1 && (
                  <button onClick={() => fileInputRef.current?.click()} className={`p-3 rounded transition-colors shrink-0 border ${uploadedImage ? 'bg-green-950/30 text-green-400 border-green-900/50' : 'bg-[var(--theme-bg-alt,#111111)] text-[var(--theme-text-muted,#919FA5)] border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)]'}`}>
                    {uploadedImage ? <CheckCircle2 size={20} /> : <Camera size={20} />}
                  </button>
                )}
                <input className="flex-1 bg-transparent px-3 text-[var(--theme-text,#F0F6F7)] outline-none placeholder:text-[var(--theme-text-subtle,#747474)] text-sm" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleOnboardingChat()} placeholder={onboardingStep === 0 ? "Upload evidence first..." : "Enter response..."} disabled={onboardingStep === 0 && !uploadedImage} />
                <button onClick={handleOnboardingChat} disabled={onboardingStep === 0 && !uploadedImage} className="bg-[var(--theme-surface,#141414)] hover:bg-[var(--theme-bg-alt,#111111)] text-[var(--theme-text,#F0F6F7)] p-2.5 rounded border border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)] transition-colors disabled:opacity-30"><ArrowRight size={20} /></button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          ) : selectedPartner ? (
            <div className="flex-1 flex flex-col xl:flex-row p-4 md:p-8 gap-4 md:gap-6 overflow-hidden">
              {/* Profile Card Left */}
              <div className="w-full xl:w-72 flex flex-col gap-4 shrink-0">
              <div className={`glass p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-300 ${isTerminated ? 'border-red-900/50 bg-red-950/10' : ''}`}>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`absolute top-3 right-3 p-1.5 rounded border transition-colors ${isEditing ? 'border-[var(--theme-primary,#F0F6F7)] text-[var(--theme-primary,#F0F6F7)]' : 'border-[var(--theme-border,#2a2a2a)] text-[var(--theme-text-subtle,#747474)] hover:text-[var(--theme-text,#F0F6F7)] hover:border-[var(--theme-border-hover,#3a3a3a)]'}`}
                  aria-label={isEditing ? "Save changes" : "Edit profile"}
                >
                  {isEditing ? <Save size={14} /> : <Edit2 size={14} />}
                </button>
                <div className="relative w-full aspect-square flex items-center justify-center bg-[var(--theme-bg-alt,#111111)] rounded overflow-hidden">
                     <img src={selectedPartner.spriteUrl} className={`w-3/4 h-3/4 object-contain z-10 transition-all duration-300 ${isTerminated ? 'opacity-20 grayscale' : 'grayscale hover:grayscale-0'}`} />
                     {isTerminated && (
                       <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                          <X size={120} className="text-red-500 opacity-60" strokeWidth={4} />
                       </div>
                     )}
                  </div>
                  <div className="mt-6 text-center z-10 w-full space-y-3">
                    {isEditing ? (
                      <input
                        className="text-lg font-semibold tracking-tight bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-3 py-1.5 w-full text-center text-[var(--theme-text,#F0F6F7)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                        value={selectedPartner.name}
                        onChange={(e) => updatePartner({ name: e.target.value })}
                      />
                    ) : (
                      <div className={`text-lg font-semibold tracking-tight transition-colors ${isTerminated ? 'text-red-400 line-through' : 'text-[var(--theme-text,#F0F6F7)]'}`}>{selectedPartner.name}</div>
                    )}
                    <div className="flex justify-center"><CompassionMeter current={selectedPartner.currentCompassion} max={selectedPartner.totalCompassion} big /></div>
                    <button
                      onClick={handleRemovePartner}
                      className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded border border-red-900/50 text-red-400 text-[10px] font-mono uppercase tracking-wide py-2 transition-colors hover:border-red-700 hover:text-red-300 hover:bg-red-950/30"
                    >
                      <Trash2 size={12} /> Remove Partner
                    </button>
                  </div>
                </div>
                
                <div className={`glass p-4 space-y-3 transition-colors duration-300 ${isTerminated ? 'bg-red-950/20 border-red-900/50' : ''}`}>
                  <h4 className={`font-mono text-[10px] uppercase tracking-wide flex items-center justify-between gap-2 ${isTerminated ? 'text-red-400' : 'text-[var(--theme-text-subtle,#747474)]'}`}>
                    {isTerminated ? <><AlertCircle size={12}/> Termination Alert</> : "Intel"}
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`p-1 rounded border transition-colors ${isEditing ? 'border-[var(--theme-primary,#F0F6F7)] text-[var(--theme-primary,#F0F6F7)]' : 'border-[var(--theme-border,#2a2a2a)] text-[var(--theme-text-subtle,#747474)] hover:text-[var(--theme-text,#F0F6F7)] hover:border-[var(--theme-border-hover,#3a3a3a)]'}`}
                      aria-label={isEditing ? "Save changes" : "Edit profile"}
                    >
                      {isEditing ? <Save size={10} /> : <Edit2 size={10} />}
                    </button>
                  </h4>
                  {isEditing ? (
                    <textarea
                      className="w-full bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded p-2 text-xs text-[var(--theme-text-muted,#919FA5)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)] min-h-[60px]"
                      value={selectedPartner.flavorText}
                      onChange={(e) => updatePartner({ flavorText: e.target.value })}
                    />
                  ) : (
                    <p className={`text-xs leading-relaxed ${isTerminated ? 'text-red-300' : 'text-[var(--theme-text-muted,#919FA5)]'}`}>
                      {isTerminated ? terminationMessage : `"${selectedPartner.flavorText}"`}
                    </p>
                  )}
                </div>
              </div>

              {/* Tabs Right */}
              <div className="flex-1 overflow-y-auto pr-0 md:pr-4 space-y-4 md:space-y-6 custom-scrollbar">
                {state.currentTab === 'dex' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                       <DataCard title="TRAITS & ABILITIES" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
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
                       <DataCard title="Hidden Skill" className="" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                          <div className="py-2 transition-all h-full min-h-[140px] flex flex-col justify-center">
                             {isEditing ? (
                               <div className="space-y-2">
                                 <input
                                  className="w-full bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-2 py-1 font-mono text-xs text-[var(--theme-accent,#919FA5)] uppercase outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                                  value={selectedPartner.hiddenSkill.name}
                                  onChange={(e) => updatePartner({ hiddenSkill: { ...selectedPartner.hiddenSkill, name: e.target.value } })}
                                 />
                                 <textarea
                                  className="w-full bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-2 py-1 text-xs text-[var(--theme-text-muted,#919FA5)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)] h-12"
                                  value={selectedPartner.hiddenSkill.description}
                                  onChange={(e) => updatePartner({ hiddenSkill: { ...selectedPartner.hiddenSkill, description: e.target.value } })}
                                 />
                               </div>
                             ) : (
                               <div className="space-y-2 text-center">
                                 <div className="text-[var(--theme-accent,#919FA5)] font-mono text-xs uppercase flex items-center justify-center gap-2 break-words"><Award size={14}/> {selectedPartner.hiddenSkill?.name}</div>
                                 <p className="text-xs text-[var(--theme-text-muted,#919FA5)] break-words">"{selectedPartner.hiddenSkill?.description}"</p>
                               </div>
                             )}
                          </div>
                       </DataCard>
                    </div>

                    <DataCard title="Type Effectiveness" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
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

                    <DataCard title="Event Log" className="relative" showEditToggle={false}>
                       <div className="space-y-4">
                          <div data-tutorial="actions">
                            {!isTerminated && (
                              <button onClick={startEmotionalUpdate} className="w-full bg-[var(--theme-surface,#141414)] hover:bg-[var(--theme-bg-alt,#111111)] text-[var(--theme-text-muted,#919FA5)] hover:text-[var(--theme-text,#F0F6F7)] py-3 rounded font-mono text-[10px] uppercase tracking-wide border border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)] flex items-center justify-center gap-2 transition-colors">
                                 <MessageSquare size={14} /> Emotional Update
                              </button>
                            )}
                          </div>
                          <div className="space-y-3 p-4 bg-[var(--theme-bg-alt,#111111)] rounded border border-[var(--theme-border,#2a2a2a)]">
                             <input className="w-full bg-transparent px-2 py-1.5 text-sm text-[var(--theme-text,#F0F6F7)] outline-none placeholder:text-[var(--theme-text-subtle,#747474)] border-b border-[var(--theme-border,#2a2a2a)] focus:border-[var(--theme-border-hover,#3a3a3a)]" value={manualLogDesc} onChange={e => setManualLogDesc(e.target.value)} placeholder="Enter interaction summary..." />
                             <div className="flex gap-3">
                               <button onClick={() => logEvent(-1, manualLogDesc || "Damage reported")} disabled={!manualLogDesc.trim()} className="flex-1 bg-transparent hover:bg-red-950/30 text-red-400 py-2 rounded font-mono text-[10px] uppercase border border-red-900/50 hover:border-red-700 transition-colors disabled:opacity-30">Damage</button>
                               <button onClick={() => logEvent(1, manualLogDesc || "Growth reported")} disabled={!manualLogDesc.trim()} className="flex-1 bg-transparent hover:bg-green-950/30 text-green-400 py-2 rounded font-mono text-[10px] uppercase border border-green-900/50 hover:border-green-700 transition-colors disabled:opacity-30">Growth</button>
                             </div>
                          </div>
                       </div>
                    </DataCard>
                  </div>
                )}

                {state.currentTab === 'stats' && (
                  <div className="space-y-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                       <DataCard title="Base Stats" className="flex-1" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                          <div className="space-y-4 py-2">
                             {(['compassion', 'smarts', 'looks', 'personality', 'reliability', 'chemistry'] as const).map(key => (
                               <div key={key} className="space-y-1">
                                 {isEditing && (
                                   <input
                                    type="range" min="0" max="100"
                                    className="w-full accent-[var(--theme-primary,#F0F6F7)] h-1"
                                    value={selectedPartner.stats[key]}
                                    onChange={(e) => updatePartner({ stats: { ...selectedPartner.stats, [key]: parseInt(e.target.value) } })}
                                   />
                                 )}
                                 <StatBar
                                  label={key === 'compassion' ? 'Compassion' : key.charAt(0).toUpperCase() + key.slice(1)}
                                  value={selectedPartner.stats[key]}
                                  color="bg-[var(--theme-primary,#F0F6F7)]"
                                 />
                               </div>
                             ))}
                          </div>
                       </DataCard>
                       <DataCard title="Connection Radar" className="w-full lg:w-64 flex items-center justify-center" showEditToggle={false}>
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                       <DataCard title="Relationship Level" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                          <div className="flex items-center gap-3 py-2 h-full">
                             <div className="w-10 h-10 rounded bg-[var(--theme-bg-alt,#111111)] flex items-center justify-center text-[var(--theme-primary,#F0F6F7)]"><Award size={20}/></div>
                             {isEditing ? (
                               <select
                                className="flex-1 bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-3 py-1.5 text-sm text-[var(--theme-text,#F0F6F7)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                                value={selectedPartner.relationshipType}
                                onChange={(e) => updatePartner({ relationshipType: e.target.value as RelationshipType })}
                               >
                                {Object.values(RelationshipType).map((level) => (
                                  <option key={level} value={level}>{level}</option>
                                ))}
                               </select>
                             ) : (
                               <div className="text-sm font-medium text-[var(--theme-text,#F0F6F7)]">{selectedPartner.relationshipType}</div>
                             )}
                          </div>
                       </DataCard>
                       <DataCard title="Current Status" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                          <div className="flex items-center gap-3 py-2 h-full">
                             <div className={`w-2 h-2 rounded-full ${selectedPartner.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                             {isEditing ? (
                               <select
                                className="flex-1 bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-3 py-1.5 text-sm text-[var(--theme-text,#F0F6F7)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                                value={selectedPartner.status}
                                onChange={(e) => updatePartner({ status: e.target.value as any })}
                               >
                                 <option value="ACTIVE">ACTIVE</option>
                                 <option value="ARCHIVED">ARCHIVED</option>
                                 <option value="TERMINATED">TERMINATED</option>
                               </select>
                             ) : (
                               <div className="font-mono text-sm text-[var(--theme-text,#F0F6F7)] uppercase">{selectedPartner.status}</div>
                             )}
                          </div>
                       </DataCard>
                    </div>
                  </div>
                )}

                {state.currentTab === 'compat' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <DataCard title="Tarot Reading" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                        <div className="space-y-3">
                          <input
                            className="w-full bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-3 py-2 text-sm text-[var(--theme-text,#F0F6F7)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                            placeholder="Ask your question..."
                            value={compatibility.tarotQuestion}
                            onChange={(e) => updateCompatibility({ tarotQuestion: e.target.value })}
                          />
                          <button
                            onClick={compatibility.tarotReading ? handleResetTarot : handleStartTarot}
                            disabled={(!compatibility.tarotQuestion.trim() && !compatibility.tarotReading) || isTarotDealing}
                            className="w-full px-3 py-2 rounded border border-[var(--theme-border,#2a2a2a)] text-[10px] font-mono uppercase tracking-wide text-[var(--theme-text-muted,#919FA5)] hover:text-[var(--theme-text,#F0F6F7)] hover:border-[var(--theme-border-hover,#3a3a3a)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {isTarotDealing ? 'Shuffling...' : (compatibility.tarotReading ? 'New Reading' : 'Ready for Reading')}
                          </button>
                          <div className="grid grid-cols-5 gap-2">
                            {compatibility.tarotDeck.map((card, index) => {
                              const isSelected = compatibility.tarotSelected.includes(card);
                              const isRevealed = isSelected;
                              const isMajor = majorArcanaSet.has(card);
                              const cardSrc = isRevealed && isMajor ? `/tarot/${tarotSlug(card)}.png` : '/tarot/back.png';
                              const suit = getTarotSuit(card);
                              const isDealt = index < tarotDealCount;
                              return (
                                <button
                                  key={card}
                                  onClick={() => handleSelectTarotCard(card)}
                                  className={`h-16 rounded border text-[9px] font-mono uppercase tracking-wide transition-all duration-300 ${
                                    isRevealed
                                      ? 'border-[var(--theme-border-hover,#3a3a3a)] bg-[var(--theme-surface,#141414)] text-[var(--theme-text,#F0F6F7)]'
                                      : 'border-[var(--theme-border,#2a2a2a)] bg-[var(--theme-bg-alt,#111111)] text-[var(--theme-text-subtle,#747474)] hover:border-[var(--theme-border-hover,#3a3a3a)]'
                                  }`}
                                  style={{
                                    opacity: isDealt ? 1 : 0,
                                    transform: isDealt ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
                                    transitionDelay: `${index * 60}ms`,
                                  }}
                                  disabled={isTarotLoading || isTarotDealing || !isDealt || compatibility.tarotSelected.length >= 3 || !compatibility.tarotDeck.length}
                                >
                                  <div className="flex flex-col items-center justify-center gap-1">
                                    {isRevealed && !isMajor ? (
                                      <div className="w-8 h-10 rounded border border-[var(--theme-border,#2a2a2a)] bg-[var(--theme-bg-alt,#111111)] flex items-center justify-center text-[8px] text-[var(--theme-text,#F0F6F7)]">
                                        {suit ? suit[0] : 'M'}
                                      </div>
                                    ) : (
                                      <img src={cardSrc} alt={card} className="w-8 h-10 object-contain" />
                                    )}
                                    {isRevealed ? (isMajor ? card : card) : 'Card'}
                                  </div>
                                </button>
                              );
                            })}
                            {compatibility.tarotDeck.length === 0 && (
                              <div className="col-span-5 text-[10px] font-mono uppercase tracking-wide text-[var(--theme-text-subtle,#747474)]">
                                Ask a question to deal 10 cards.
                              </div>
                            )}
                          </div>
                          <div className="rounded border border-[var(--theme-border,#2a2a2a)] bg-[var(--theme-bg-alt,#111111)] p-3 text-xs text-[var(--theme-text-muted,#919FA5)] min-h-[70px]">
                            {isTarotLoading
                              ? 'Shuffling the deck...'
                              : (compatibility.tarotReading || (isTarotDealing ? 'Dealing the cards...' : 'Pick 3 cards to reveal your reading.'))}
                          </div>
                        </div>
                      </DataCard>
                      <DataCard title="Horoscope" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                        <div className="space-y-3">
                          {isEditing ? (
                            <>
                              <div className="space-y-1.5">
                                <div className="text-[10px] font-mono uppercase tracking-wide text-[var(--theme-text-subtle,#747474)]">Their Sign</div>
                                <select
                                  className="w-full bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-3 py-2 text-sm text-[var(--theme-text,#F0F6F7)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                                  value={compatibility.partnerSign}
                                  onChange={(e) => updateCompatibility({ partnerSign: e.target.value })}
                                >
                                  <option value="">Select sign</option>
                                  <option value="Aries">Aries</option>
                                  <option value="Taurus">Taurus</option>
                                  <option value="Gemini">Gemini</option>
                                  <option value="Cancer">Cancer</option>
                                  <option value="Leo">Leo</option>
                                  <option value="Virgo">Virgo</option>
                                  <option value="Libra">Libra</option>
                                  <option value="Scorpio">Scorpio</option>
                                  <option value="Sagittarius">Sagittarius</option>
                                  <option value="Capricorn">Capricorn</option>
                                  <option value="Aquarius">Aquarius</option>
                                  <option value="Pisces">Pisces</option>
                                </select>
                              </div>
                              <div className="space-y-1.5">
                                <div className="text-[10px] font-mono uppercase tracking-wide text-[var(--theme-text-subtle,#747474)]">Your Sign</div>
                                <select
                                  className="w-full bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-3 py-2 text-sm text-[var(--theme-text,#F0F6F7)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                                  value={compatibility.userSign}
                                  onChange={(e) => updateCompatibility({ userSign: e.target.value })}
                                >
                                  <option value="">Select sign</option>
                                  <option value="Aries">Aries</option>
                                  <option value="Taurus">Taurus</option>
                                  <option value="Gemini">Gemini</option>
                                  <option value="Cancer">Cancer</option>
                                  <option value="Leo">Leo</option>
                                  <option value="Virgo">Virgo</option>
                                  <option value="Libra">Libra</option>
                                  <option value="Scorpio">Scorpio</option>
                                  <option value="Sagittarius">Sagittarius</option>
                                  <option value="Capricorn">Capricorn</option>
                                  <option value="Aquarius">Aquarius</option>
                                  <option value="Pisces">Pisces</option>
                                </select>
                              </div>
                            </>
                          ) : (
                            <div className="space-y-1 text-sm text-[var(--theme-text,#F0F6F7)]">
                              <div>Them: {compatibility.partnerSign || 'Unassigned'}</div>
                              <div>You: {compatibility.userSign || 'Unassigned'}</div>
                            </div>
                          )}

                          <div className="rounded border border-[var(--theme-border,#2a2a2a)] bg-[var(--theme-bg-alt,#111111)] p-3 text-xs text-[var(--theme-text-muted,#919FA5)] min-h-[60px]">
                            {isHoroscopeLoading
                              ? 'Reading stars...'
                              : (compatibility.horoscopeFortune || 'Set both signs to reveal today\'s compatibility fortune.')}
                          </div>
                          <div className="text-[10px] font-mono uppercase tracking-wide text-[var(--theme-text-subtle,#747474)]">
                            Auto-refreshes at midnight ET
                          </div>
                        </div>
                      </DataCard>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <DataCard title="Libido Rater" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              type="range"
                              min="1"
                              max="10"
                              className="w-full accent-[var(--theme-primary,#F0F6F7)] h-1"
                              value={compatibility.libidoRating}
                              onChange={(e) => updateCompatibility({ libidoRating: parseInt(e.target.value, 10) })}
                            />
                            <div className="text-xs text-[var(--theme-text-muted,#919FA5)]">
                              {compatibility.libidoRating}/10
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-[var(--theme-text,#F0F6F7)]">
                            {compatibility.libidoRating}/10
                          </div>
                        )}
                      </DataCard>
                      <DataCard title="Flats or Drumsticks" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                        {isEditing ? (
                          <select
                            className="w-full bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-3 py-2 text-sm text-[var(--theme-text,#F0F6F7)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                            value={compatibility.wingPreference}
                            onChange={(e) => updateCompatibility({ wingPreference: e.target.value })}
                          >
                            <option value="">Select</option>
                            <option value="Flats">Flats</option>
                            <option value="Drumsticks">Drumsticks</option>
                          </select>
                        ) : (
                          <div className="text-sm text-[var(--theme-text,#F0F6F7)]">
                            {compatibility.wingPreference || 'Unassigned'}
                          </div>
                        )}
                      </DataCard>
                      <DataCard title="Introvert or Extrovert" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                        {isEditing ? (
                          <select
                            className="w-full bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-3 py-2 text-sm text-[var(--theme-text,#F0F6F7)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                            value={compatibility.introExtro}
                            onChange={(e) => updateCompatibility({ introExtro: e.target.value })}
                          >
                            <option value="">Select</option>
                            <option value="Introvert">Introvert</option>
                            <option value="Extrovert">Extrovert</option>
                            <option value="Ambivert">Ambivert</option>
                          </select>
                        ) : (
                          <div className="text-sm text-[var(--theme-text,#F0F6F7)]">
                            {compatibility.introExtro || 'Unassigned'}
                          </div>
                        )}
                      </DataCard>
                    </div>

                    <DataCard title="Faith" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                      {isEditing ? (
                        <input
                          className="w-full bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-3 py-2 text-sm text-[var(--theme-text,#F0F6F7)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                          placeholder="e.g., Spiritual, Christian, Agnostic"
                          value={compatibility.faith}
                          onChange={(e) => updateCompatibility({ faith: e.target.value })}
                        />
                      ) : (
                        <div className="text-sm text-[var(--theme-text,#F0F6F7)]">
                          {compatibility.faith || 'Unassigned'}
                        </div>
                      )}
                    </DataCard>
                  </div>
                )}

                {state.currentTab === 'storage' && (
                  <div className="space-y-6">
                    {['family', 'friend', 'romantic'].map((group) => {
                      const groupLabel = group === 'family' ? 'Family Storage' : group === 'friend' ? 'Friend Storage' : 'Romantic Storage';
                      const groupPartners = state.partners.filter(p => getRelationshipGroup(p.relationshipType) === group);
                      return (
                        <DataCard key={group} title={groupLabel} showEditToggle={false}>
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-xs font-mono uppercase tracking-wide text-[var(--theme-text-subtle,#747474)]">
                              {groupPartners.length} in Dex
                            </div>
                            <div className="text-[10px] font-mono uppercase tracking-wide text-[var(--theme-text-subtle,#747474)]">
                              Group is determined by relationship level
                            </div>
                          </div>
                          {groupPartners.length === 0 ? (
                            <div className="text-sm text-[var(--theme-text-muted,#919FA5)]">No entries yet.</div>
                          ) : (
                            <div className="space-y-2">
                              {groupPartners.map(p => (
                                <div key={p.id} className="flex items-center justify-between rounded border border-[var(--theme-border,#2a2a2a)] bg-[var(--theme-bg-alt,#111111)] px-3 py-2">
                                  <div className="text-sm text-[var(--theme-text,#F0F6F7)]">{p.name}</div>
                                  <div className="text-[10px] font-mono uppercase tracking-wide text-[var(--theme-text-subtle,#747474)]">{p.relationshipType}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </DataCard>
                      );
                    })}
                  </div>
                )}

                {state.currentTab === 'lore' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                       <DataCard title="Meeting Data" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                          <div className="flex items-start gap-3 py-2">
                             <MapPin size={18} className="text-[var(--theme-accent,#919FA5)] shrink-0 mt-0.5" />
                             <div className="flex-1">
                                <div className="font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide mb-1">Location</div>
                                {isEditing ? (
                                  <input
                                    className="w-full bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-2 py-1 text-sm text-[var(--theme-text,#F0F6F7)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                                    value={selectedPartner.meetingLocation}
                                    onChange={(e) => updatePartner({ meetingLocation: e.target.value })}
                                  />
                                ) : (
                                  <p className="text-sm text-[var(--theme-text,#F0F6F7)]">{selectedPartner.meetingLocation}</p>
                                )}
                             </div>
                          </div>
                       </DataCard>
                       <DataCard title="Timeline" showEditToggle={false}>
                          <div className="flex items-start gap-3 py-2">
                             <Clock size={18} className="text-[var(--theme-accent,#919FA5)] shrink-0 mt-0.5" />
                             <div>
                                <div className="font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide mb-1">Latest Pulse</div>
                                <p className="text-sm text-[var(--theme-text,#F0F6F7)]">
                                   {selectedPartner.interactionLog[0] ? new Date(selectedPartner.interactionLog[0].timestamp).toLocaleDateString() : 'N/A'}
                                </p>
                             </div>
                          </div>
                       </DataCard>
                    </div>

                    <DataCard title="Date Checklist" isEditing={isEditing} onToggleEdit={() => setIsEditing(!isEditing)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 md:gap-x-6 py-2">
                          {selectedPartner.dateChecklist.map(item => (
                             <div key={item.id} className="flex items-center gap-3 group text-left">
                                <button onClick={() => toggleChecklist(item.id)} className="shrink-0">
                                  {item.isCompleted ? <CheckSquare size={16} className="text-[var(--theme-primary,#F0F6F7)]" /> : <Square size={16} className="text-[var(--theme-text-subtle,#747474)] group-hover:text-[var(--theme-text-muted,#919FA5)]" />}
                                </button>
                                {isEditing ? (
                                  <input
                                    className="flex-1 bg-transparent border-b border-[var(--theme-border,#2a2a2a)] font-mono text-xs text-[var(--theme-text,#F0F6F7)] outline-none focus:border-[var(--theme-border-hover,#3a3a3a)]"
                                    value={item.label}
                                    onChange={(e) => {
                                      const newChecklist = selectedPartner.dateChecklist.map(c => c.id === item.id ? { ...c, label: e.target.value } : c);
                                      updatePartner({ dateChecklist: newChecklist });
                                    }}
                                  />
                                ) : (
                                  <span className={`font-mono text-xs ${item.isCompleted ? 'text-[var(--theme-text,#F0F6F7)]' : 'text-[var(--theme-text-subtle,#747474)]'}`}>{item.label}</span>
                                )}
                                {isEditing && (
                                  <button onClick={() => updatePartner({ dateChecklist: selectedPartner.dateChecklist.filter(c => c.id !== item.id) })}>
                                    <Trash2 size={12} className="text-red-400/50 hover:text-red-400" />
                                  </button>
                                )}
                             </div>
                          ))}
                          {isEditing && (
                            <button
                              className="col-span-2 flex items-center gap-2 font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] hover:text-[var(--theme-text-muted,#919FA5)] py-2 border border-dashed border-[var(--theme-border,#2a2a2a)] rounded justify-center mt-2 transition-colors"
                              onClick={() => updatePartner({ dateChecklist: [...selectedPartner.dateChecklist, { id: Math.random().toString(), label: 'New Task', isCompleted: false }] })}
                            >
                              <PlusCircle size={12} /> Add Item
                            </button>
                          )}
                       </div>
                    </DataCard>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                       <PreferenceListEditor 
                        label="LOVES" 
                        items={selectedPartner.preferences.filter(p => p.isLove)}
                        isEditing={isEditing}
                        onUpdate={(newLoveItems) => updatePartner({ preferences: [...selectedPartner.preferences.filter(p => !p.isLove), ...newLoveItems] })}
                        isLove={true}
                        onToggleEdit={() => setIsEditing(!isEditing)}
                       />
                       <PreferenceListEditor 
                        label="HATES" 
                        items={selectedPartner.preferences.filter(p => !p.isLove)}
                        isEditing={isEditing}
                        onUpdate={(newHateItems) => updatePartner({ preferences: [...selectedPartner.preferences.filter(p => p.isLove), ...newHateItems] })}
                        isLove={false}
                        onToggleEdit={() => setIsEditing(!isEditing)}
                       />
                    </div>
                  </div>
                )}

                {state.currentTab === 'history' && (
                  <div className="space-y-3">
                    {selectedPartner.interactionLog.map(l => (
                      <div key={l.id} className="glass p-4 flex justify-between items-center hover:bg-[var(--theme-bg-alt,#111111)] transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-1.5 h-1.5 rounded-full ${l.type === LogType.NEGATIVE ? 'bg-red-400' : l.type === LogType.POSITIVE ? 'bg-green-400' : 'bg-[var(--theme-text-subtle,#747474)]'}`}></div>
                          <div>
                            <p className="text-sm text-[var(--theme-text,#F0F6F7)] leading-relaxed">{l.description}</p>
                            <p className="font-mono text-[9px] text-[var(--theme-text-subtle,#747474)] mt-1">{new Date(l.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="font-mono text-xs text-[var(--theme-text-subtle,#747474)]">{l.compassionDelta > 0 ? '+' : ''}{l.compassionDelta}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
               <ShieldAlert size={48} className="text-[var(--theme-text-subtle,#747474)]" />
               <p className="mt-4 font-mono text-[10px] uppercase tracking-wide text-[var(--theme-text-subtle,#747474)]">Searching Database...</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal - Emotional Lab */}
      <Modal isOpen={isEmotionalUpdateOpen} onClose={() => setIsEmotionalUpdateOpen(false)} title="Emotional Update">
        <div className="h-[400px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {emotionalChat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'Cupid' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] p-3 ${msg.role === 'Cupid' ? 'chat-bubble-cupid' : 'chat-bubble-user'}`}>
                  <p className="text-sm text-[var(--theme-text,#F0F6F7)] whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  {i === emotionalChat.length - 1 && verdict && (
                    <div className="mt-4 flex gap-2">
                      <button onClick={() => applyVerdict(true)} className="flex-1 bg-transparent hover:bg-green-950/30 text-green-400 py-2 rounded font-mono text-xs flex items-center justify-center gap-2 border border-green-900/50 hover:border-green-700 transition-colors">
                        <ThumbsUp size={14} /> Confirm
                      </button>
                      <button onClick={() => applyVerdict(false)} className="flex-1 bg-transparent hover:bg-red-950/30 text-red-400 py-2 rounded font-mono text-xs flex items-center justify-center gap-2 border border-red-900/50 hover:border-red-700 transition-colors">
                        <ThumbsDown size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isProcessing && <div className="chat-bubble-cupid p-3 w-12"><div className="w-2 h-2 rounded-full bg-[var(--theme-text-subtle,#747474)] animate-pulse" /></div>}
            <div ref={emotionalBottomRef} />
          </div>
          {!verdict && (
            <div className="mt-4 flex gap-2">
              <input className="flex-1 bg-[var(--theme-surface,#141414)] rounded px-3 text-sm text-[var(--theme-text,#F0F6F7)] outline-none border border-[var(--theme-border,#2a2a2a)] focus:border-[var(--theme-border-hover,#3a3a3a)] h-10" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleEmotionalUpdateChat()} placeholder="Share your thoughts..." />
              <button onClick={handleEmotionalUpdateChat} className="bg-[var(--theme-surface,#141414)] text-[var(--theme-text,#F0F6F7)] w-10 h-10 flex items-center justify-center rounded border border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)] transition-colors"><Send size={16} /></button>
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
        currentMode={themeMode}
        onModeChange={handleThemeModeChange}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
};

// --- Subcomponents for Editing ---

const TraitList: React.FC<{ label: string, traits: Trait[], isEditing: boolean, onUpdate: (newTraits: Trait[]) => void, isPrimary: boolean }> = ({ label, traits, isEditing, onUpdate, isPrimary }) => {
  const [newVal, setNewVal] = useState('');
  return (
    <div className="space-y-2">
      <div className="font-mono text-[9px] text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide flex justify-between items-center">
        {label}
        {isEditing && (
          <div className="flex gap-1">
            <input
              className="bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-2 py-0.5 text-[8px] text-[var(--theme-text,#F0F6F7)] w-20 outline-none"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              placeholder="Add..."
            />
            <button
              onClick={() => {
                if (newVal.trim()) {
                  onUpdate([...traits, { id: Math.random().toString(), partnerId: '', name: newVal.trim(), isPrimary }]);
                  setNewVal('');
                }
              }}
            >
              <PlusCircle size={10} className="text-[var(--theme-accent,#919FA5)]" />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
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
    <div className="space-y-2">
      <div className={`font-mono text-[10px] ${color} flex items-center justify-between gap-2`}>
        <div className="flex items-center gap-2">{icon} {label}</div>
        {isEditing && (
          <div className="flex gap-1">
            <input
              className="bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-2 py-0.5 text-[8px] text-[var(--theme-text,#F0F6F7)] w-24 outline-none"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              placeholder="Add..."
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
      <div className="flex flex-wrap gap-1.5">
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

const PreferenceListEditor: React.FC<{ label: string, items: Preference[], isEditing: boolean, onUpdate: (newItems: Preference[]) => void, isLove: boolean, onToggleEdit?: () => void }> = ({ label, items, isEditing, onUpdate, isLove, onToggleEdit }) => {
  const [newVal, setNewVal] = useState('');
  return (
    <DataCard title={label} isEditing={isEditing} onToggleEdit={onToggleEdit}>
      <div className="space-y-2">
        {items.map(p => (
          <div key={p.id} className={`flex items-center justify-between gap-2 p-2 rounded border ${isLove ? 'bg-green-950/20 border-green-900/30' : 'bg-red-950/20 border-red-900/30'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isLove ? 'bg-green-400' : 'bg-red-400'}`} />
              {isEditing ? (
                <input
                  className="bg-transparent font-mono text-xs text-[var(--theme-text-muted,#919FA5)] outline-none border-b border-[var(--theme-border,#2a2a2a)]"
                  value={p.label}
                  onChange={(e) => onUpdate(items.map(x => x.id === p.id ? { ...x, label: e.target.value } : x))}
                />
              ) : (
                <span className="font-mono text-xs text-[var(--theme-text-muted,#919FA5)]">{p.label}</span>
              )}
            </div>
            {isEditing && (
              <button onClick={() => onUpdate(items.filter(x => x.id !== p.id))}>
                <Trash2 size={12} className="text-red-400/50 hover:text-red-400" />
              </button>
            )}
          </div>
        ))}
        {isEditing && (
          <div className="flex gap-2 mt-3">
            <input
              className="flex-1 bg-[var(--theme-bg-alt,#111111)] border border-[var(--theme-border,#2a2a2a)] rounded px-2 py-1.5 font-mono text-xs text-[var(--theme-text,#F0F6F7)] outline-none"
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              placeholder="Add..."
            />
            <button
              onClick={() => {
                if (newVal.trim()) {
                  onUpdate([...items, { id: Math.random().toString(), partnerId: '', label: newVal.trim(), isLove }]);
                  setNewVal('');
                }
              }}
              className="bg-[var(--theme-surface,#141414)] p-1.5 rounded border border-[var(--theme-border,#2a2a2a)] text-[var(--theme-text-subtle,#747474)] hover:text-[var(--theme-text,#F0F6F7)] hover:border-[var(--theme-border-hover,#3a3a3a)] transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </DataCard>
  );
};

// --- Generic Components ---

const NavIcon: React.FC<{ icon: React.ReactNode, active?: boolean, onClick: () => void, label: string, color?: string }> = ({ icon, active, onClick, label, color = "text-[var(--theme-text-muted,#919FA5)]" }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 md:gap-2 group transition-colors duration-200 ${active ? '' : 'opacity-60 hover:opacity-100'}`}>
    <div
      className={`p-2.5 md:p-3 rounded border-2 transition-colors duration-200 ${
        active
          ? 'bg-[var(--theme-surface,#141414)] border-[var(--theme-border-hover,#3a3a3a)] text-[var(--theme-primary,#F0F6F7)]'
          : `border-[var(--theme-border,#2a2a2a)] hover:border-[var(--theme-border-hover,#3a3a3a)] ${color}`
      }`}
    >
      {icon}
    </div>
    <span className={`hidden md:block font-mono text-[8px] uppercase tracking-wide transition-colors ${active ? 'text-[var(--theme-text,#F0F6F7)]' : 'text-[var(--theme-text-subtle,#747474)]'}`}>{label}</span>
  </button>
);

const DataCard: React.FC<{ title: string, children: React.ReactNode, className?: string, showEditToggle?: boolean, onToggleEdit?: () => void, isEditing?: boolean }> = ({ title, children, className = '', showEditToggle = true, onToggleEdit, isEditing }) => (
  <div className={`glass p-4 md:p-5 transition-colors duration-200 ${className}`}>
    <h4 className="font-mono text-[10px] text-[var(--theme-text-subtle,#747474)] uppercase tracking-wide mb-4 md:mb-5 border-b-2 border-[var(--theme-border,#2a2a2a)] pb-2 flex items-center justify-between gap-2">
       <span>{title}</span>
       <div className="flex items-center gap-1.5">
         {showEditToggle && onToggleEdit && (
           <button
             onClick={onToggleEdit}
             className={`p-1 rounded border transition-colors ${isEditing ? 'border-[var(--theme-primary,#F0F6F7)] text-[var(--theme-primary,#F0F6F7)]' : 'border-[var(--theme-border,#2a2a2a)] text-[var(--theme-text-subtle,#747474)] hover:text-[var(--theme-text,#F0F6F7)] hover:border-[var(--theme-border-hover,#3a3a3a)]'}`}
             aria-label={isEditing ? "Save changes" : "Edit section"}
           >
             {isEditing ? <Save size={10} /> : <Edit2 size={10} />}
           </button>
         )}
       </div>
    </h4>
    {children}
  </div>
);

export default App;
