export enum RelationshipType {
  CRUSH = 'CRUSH',
  SITUATIONSHIP = 'SITUATIONSHIP',
  FWB = 'FRIENDS WITH BENEFITS',
  TALKING = 'TALKING STAGE',
  DATING = 'DATING',
  GF = 'GIRLFRIEND',
  BF = 'BOYFRIEND',
  GF_MATERIAL = 'GF MATERIAL',
  BF_MATERIAL = 'BF MATERIAL',
  WIFEY_MATERIAL = 'WIFEY MATERIAL',
  HUBBY_MATERIAL = 'HUBBY MATERIAL',
  PARTNER = 'LIFE PARTNER',
  EX = 'EX',
  ARCHIVED = 'ARCHIVED'
}

export enum LogType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  SYSTEM = 'SYSTEM'
}

export interface SpriteVariants {
  idle: string;
  happy?: string;
  hurt?: string;
  smug?: string;
  dateNight?: string;
}

export interface Preference {
  id: string;
  partnerId: string;
  label: string;
  isLove: boolean;
}

export interface Trait {
  id: string;
  partnerId: string;
  name: string;
  isPrimary: boolean;
}

export interface InteractionLog {
  id: string;
  partnerId: string;
  timestamp: number;
  type: LogType;
  description: string;
  compassionDelta: number;
}

export interface BaseStats {
  compassion: number; // Emotional availability
  smarts: number; // Intelligence
  looks: number; // Attraction
  personality: number; // Vibe/Humor
  reliability: number; // Dependability
  chemistry: number; // Chemistry/Connection
}

export interface Partner {
  id: string;
  userId: string;
  dexNumber: string;
  name: string;
  category: string;
  flavorText: string;
  totalCompassion: number;
  currentCompassion: number;
  relationshipType: RelationshipType;
  meetingLocation: string;
  redFlags: number; 
  greenFlags: number; 
  notes: string;
  spriteUrl: string;
  sprites: SpriteVariants;
  status: 'ACTIVE' | 'ARCHIVED' | 'TERMINATED';
  
  stats: BaseStats;
  evolutionPath: string; // e.g. "Crush -> Talking -> Dating"
  effectiveness: {
    effectiveAgainst: string[];
    weakTo: string[];
  };

  traits: Trait[];
  preferences: Preference[];
  hiddenSkill: {
    name: string;
    description: string;
    isUnlocked: boolean;
    unlockThreshold: number;
  };
  dateChecklist: { id: string; label: string; isCompleted: boolean }[];
  interactionLog: InteractionLog[];
}

export interface AuthUser {
  uid: string;
  email: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  partners: Partner[];
  selectedPartnerId: string | null;
  currentTab: string;
  showPRD: boolean;
  showScanner: boolean;
  showDamageModal: boolean;
  userSession: { id: string; email: string } | null;
  isLoadingPartners: boolean;
}