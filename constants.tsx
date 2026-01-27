import { RelationshipType, Partner, LogType } from './types';

export const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'p1',
    userId: 'usr_123',
    dexNumber: '001',
    name: 'Alex',
    category: 'The Ghoster',
    flavorText: 'Often disappears for days. You might see them online, but your messages stay on read.',
    totalCompassion: 10,
    currentCompassion: 4.5,
    relationshipType: RelationshipType.SITUATIONSHIP,
    meetingLocation: 'Dating App',
    redFlags: 75,
    greenFlags: 20,
    notes: 'Seems nice but disappears for 3 days at a time.',
    spriteUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop',
    sprites: { 
      idle: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop' 
    },
    status: 'ACTIVE',
    stats: {
      compassion: 30,
      smarts: 80,
      looks: 85,
      personality: 40,
      reliability: 10,
      chemistry: 60
    },
    evolutionPath: 'Crush -> Situationship -> Archived',
    effectiveness: {
      effectiveAgainst: ['People with anxious attachment'],
      weakTo: ['Boundaries', 'Direct communication']
    },
    traits: [
      { id: 't1', partnerId: 'p1', name: 'Mysterious', isPrimary: true },
      { id: 't2', partnerId: 'p1', name: 'Slow Responder', isPrimary: false }
    ],
    preferences: [
      { id: 'pr1', partnerId: 'p1', label: 'Late night texts', isLove: true },
      { id: 'pr2', partnerId: 'p1', label: 'Direct questions', isLove: false }
    ],
    hiddenSkill: {
      name: 'Vanishing Act',
      description: 'Goes silent right when things get serious.',
      isUnlocked: true,
      unlockThreshold: 3
    },
    dateChecklist: [
      { id: 'dc1', label: 'Coffee date', isCompleted: true },
      { id: 'dc2', label: 'Dinner', isCompleted: false }
    ],
    interactionLog: [
      { id: 'l1', partnerId: 'p1', timestamp: Date.now() - 172800000, type: LogType.NEGATIVE, description: 'No reply for a whole day', compassionDelta: -1.5 },
      { id: 'l2', partnerId: 'p1', timestamp: Date.now() - 86400000, type: LogType.NEGATIVE, description: 'Cancelled plans last minute', compassionDelta: -2.0 }
    ]
  },
  {
    id: 'p2',
    userId: 'usr_123',
    dexNumber: '002',
    name: 'Sam',
    category: 'The Enthusiast',
    flavorText: 'Very intense and affectionate. They want to spend every waking second together.',
    totalCompassion: 15,
    currentCompassion: 14.0,
    relationshipType: RelationshipType.GF,
    meetingLocation: 'Through a Friend',
    redFlags: 15,
    greenFlags: 90,
    notes: 'Very intense early on. Sent 45 memes today.',
    spriteUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    sprites: { 
      idle: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop' 
    },
    status: 'ACTIVE',
    stats: {
      compassion: 95,
      smarts: 70,
      looks: 75,
      personality: 90,
      reliability: 85,
      chemistry: 80
    },
    evolutionPath: 'Crush -> Dating -> Wifey Material',
    effectiveness: {
      effectiveAgainst: ['Loneliness', 'Quiet weekends'],
      weakTo: ['Smothering', 'Lack of space']
    },
    traits: [
      { id: 't3', partnerId: 'p2', name: 'Very Affectionate', isPrimary: true },
      { id: 't4', partnerId: 'p2', name: 'Gift Giver', isPrimary: false }
    ],
    preferences: [
      { id: 'pr3', partnerId: 'p2', label: 'Constant attention', isLove: true },
      { id: 'pr4', partnerId: 'p2', label: 'Alone time', isLove: false }
    ],
    hiddenSkill: {
      name: 'Heart Eyes',
      description: 'Ignores all flaws for the first few weeks.',
      isUnlocked: false,
      unlockThreshold: 20
    },
    dateChecklist: [
      { id: 'dc3', label: 'Surprise weekend trip', isCompleted: false },
      { id: 'dc4', label: 'Meeting the family', isCompleted: false }
    ],
    interactionLog: [
      { id: 'l3', partnerId: 'p2', timestamp: Date.now() - 3600000, type: LogType.POSITIVE, description: 'Surprised me with lunch', compassionDelta: 0.5 }
    ]
  }
];

export const TABS = [
  { id: 'dex', label: 'PROFILE' },
  { id: 'stats', label: 'HEALTH' },
  { id: 'lore', label: 'DIARY' },
  { id: 'log', label: 'HISTORY' },
  { id: 'flags', label: 'SIGNS' }
];