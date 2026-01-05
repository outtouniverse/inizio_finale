
export type AgentStep = 
  | 'PULSE'
  | 'VALIDATION'
  | 'FOUNDER_FIT' 
  | 'CUSTOMER'    
  | 'COMPETITORS'
  | 'BREAKDOWN'
  | 'EXPERIMENTS'
  | 'REALITY'
  | 'NAMING'
  | 'CREATIVE'
  | 'MVP'
  | 'ROADMAP'
  | 'STACK'
  | 'TIMELINE'
  | 'GEO'
  | 'LAUNCH'
  | 'DECK'
  | 'RISK'
  | 'SCORE';

export type SystemState = 
  | 'BOOT'
  | 'AUTH'
  | 'ONBOARDING'
  | 'VAULT'
  | 'VOID'
  | 'ORBIT'
  | 'PROFILE'
  | 'SETTINGS'
  | 'COLLAB'
  | 'PLAYGROUND'
  | 'HISTORY';

export type IndustryType = 'Tech' | 'Fashion' | 'Food' | 'Creator' | 'Service' | 'Hardware' | 'Community' | 'Art' | 'Other';

export type FounderStage = 
  | 'IDEA_FOG'
  | 'VALIDATION'
  | 'NAMING'
  | 'BUILDING'
  | 'GROWTH';

export interface IdeaContext {
  rawInput: string;
  description: string;
  industry: IndustryType;
  stage: FounderStage;
  userGoal: string;
  target?: string;
  constraints?: string;
}

// --- VERSIONING & FEEDBACK ---

export type FeedbackType = 'ACCURACY' | 'TONE' | 'DEPTH' | 'CREATIVITY' | 'RISK' | 'OTHER';

export interface Feedback {
  id: string;
  type: FeedbackType;
  text: string;
  timestamp: number;
}

export interface ArtifactVersion {
  id: string;
  timestamp: number;
  step: AgentStep;
  data: any;
  feedback?: Feedback;
  rationale?: string;
  changes?: string[];
}

export interface RethinkResponse {
  data: any;
  rationale: string;
  changes: string[];
}

// --- ARTIFACT DATA TYPES ---

export interface MarketPulseData {
  heatIndex: number;
  trendOverlap: number;
  culturalMomentum: string;
  marketFriction: string;
  sentiment: 'Positive' | 'Neutral' | 'Skeptical' | 'Hype';
  trends: {
    name: string;
    force: number;
    description: string;
  }[];
}

export interface ValidationData {
  marketSize: string;
  problemClarity: {
    statement: string;
    rating: 'Signal' | 'Noise' | 'Opportunity';
    explanation?: string;
  };
  verdict: string;
  score: number;
  competitors: {
    name: string;
    weakness: string;
  }[];
  swot: {
    strength: string;
    weakness?: string;
    opportunity: string;
    threat?: string;
  };
}

export interface FounderFitData {
  verdict: string;
  whyYou: string;
  blindSpots: string[];
  skillBridge: {
    required: string;
    status: 'Have' | 'Gap' | 'Outsource';
    strategy: string;
  }[];
}

export interface CustomerPersonaData {
  segments: {
    name: string;
    quote: string;
    psychology: string;
    trigger: string;
    barrier: string;
  }[];
  deepInsight: string;
}

export interface CompetitorData {
  landscape: string;
  competitors: {
    name: string;
    type: 'Direct' | 'Indirect' | 'Mental Model';
    strength: string;
    weakness: string;
  }[];
  opportunityGap: string;
}

export interface BreakDownData {
  weaknesses: string[];
  blindSpots: string[];
  contradictions: string;
  vcDoubt: string;
  customerFeeling: string;
  recoveryPlan: string;
}

export interface ExperimentData {
  experiments: {
    type: string;
    name: string;
    duration: string;
    cost: 'Low' | 'Medium' | 'High';
    difficulty: 'Easy' | 'Moderate' | 'Hard';
    impact: number;
    steps: string[];
  }[];
}

export interface NamingData {
  brandArchetype: string;
  colorPalette: string[];
  options: {
    name: string;
    tagline: string;
    rationale: string;
    available: boolean;
    vibe: string;
  }[];
}

export interface RealityData {
  brutalTruth: string;
  hardestChallenge: string;
  financialOutlook: string;
  survivalProbability: number;
}

export interface RoadmapItem {
  phase: string;
  timing: string;
  tasks: string[];
  milestone: string;
}

export interface TimelineData {
  scenarios: {
    name: 'Conservative' | 'Smart' | 'Insane';
    description: string;
    revenueProjection: string;
    milestones: string[];
    obstacles: string[];
    probability: number;
  }[];
}

export interface MVPBlock {
  id: string;
  name: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High';
  category: 'Core' | 'Experience' | 'Ops' | 'Admin' | 'Auth' | 'Data';
}

export interface TechStackTool {
  name: string;
  desc: string;
}

export interface TechStackSection {
  title?: string;
  tools: TechStackTool[];
  reasoning?: string;
}

export interface TechStackData {
  category: string;
  description: string;
  core: TechStackSection;
  ai: TechStackSection;
  brand: TechStackSection;
  ops: TechStackSection;
  infra: TechStackSection;
  budget: {
    lean: string;
    balanced: string;
    premium: string;
  };
  metrics: {
    difficulty: number;
    timeline: string[];
  };
  recommendation: {
    now: string;
    later: string;
  };
}

export interface GeoData {
  region: string;
  reason: string;
  tam: string;
  complexity: string;
}

export interface LaunchData {
  headline: string;
  channels: {
    name: string;
    strategy: string;
    type: 'Paid' | 'Organic' | 'Viral';
  }[];
  contentPillars: string[];
  timeline: string[];
}

export interface DeckSlide {
  title: string;
  content: string[];
}

export interface RiskItem {
  risk: string;
  impact: number;
  probability: number;
  mitigation: string;
}

export interface ScoreData {
  total: number;
  breakdown: {
    market: number;
    feasibility: number;
    tech: number;
    moat: number;
  };
  verdict: string;
}

export interface CreativeAsset {
  id: string;
  type: 'LOGO' | 'COLOR' | 'UI' | 'MERCH' | 'AD' | 'SCRIPT';
  content: string; 
  title: string;
  variant: string;
}

export interface CreativeData {
    assets: CreativeAsset[];
    brandVoice: string;
}

// --- CREATIVE STUDIO EXTENDED TYPES ---

export interface MoodboardTile {
  id: string;
  color: string;
  caption: string;
  texture: string;
}

export interface MoodboardState {
  activeMood: string;
  tiles: MoodboardTile[];
  lockedTiles: string[];
}

export interface CameraConfig {
  type: 'Handheld' | 'Steadicam' | 'Drone' | 'Tripod';
  lens: '16mm' | '35mm' | '50mm' | '85mm';
  motion: number;
  fps: number;
}

export interface StoryboardShot {
  id: string;
  title: string;
  description: string;
  angle: string;
  movement: string;
}

// Container for all artifacts
export interface ProjectArtifacts {
  [key: string]: any;
  PULSE?: MarketPulseData;
  VALIDATION?: ValidationData;
  FOUNDER_FIT?: FounderFitData;
  CUSTOMER?: CustomerPersonaData;
  NAMING?: NamingData;
  COMPETITORS?: CompetitorData;
  BREAKDOWN?: BreakDownData;
  EXPERIMENTS?: ExperimentData;
  REALITY?: RealityData;
  MVP?: MVPBlock[];
  ROADMAP?: RoadmapItem[];
  STACK?: TechStackData;
  TIMELINE?: TimelineData;
  GEO?: GeoData;
  CREATIVE?: CreativeData;
  LAUNCH?: LaunchData;
  DECK?: DeckSlide[];
  RISK?: RiskItem[];
  SCORE?: ScoreData;
}

export interface Project {
  // Backend fields
  _id?: string;
  userId?: string;
  name: string;
  pitch: string;
  industry?: string;
  stage: 'IDEA' | 'VALIDATION' | 'BUILDING' | 'LAUNCH' | 'GROWTH' | 'EXIT' | string;
  userGoal?: string;
  constraints?: string;
  tags: string[];
  revenue: string;
  validationScore: number;
  lastEdited?: string;
  isArchived?: boolean;
  metadata?: any;

  // Frontend compatibility fields
  id?: string; // For backward compatibility
  artifacts?: ProjectArtifacts;

  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  name: string;
  archetype: string;
  level: number;
  mission: string;
  badges: string[];
  traits?: { name: string; score: number }[];
  profilePicture?: string;
}

export interface AppSettings {
  theme: 'cyberwave' | 'minimal' | 'studio' | 'terminal' | 'nocturnal' | 'vapor';
  aiPersonality: {
    creativity: number;
    risk: number;
    verbosity: number;
    archetype: 'Strategic' | 'Technical' | 'Visionary';
  };
  privacyMode: boolean;
  soundEnabled: boolean;
}

export enum ProjectTab {
  CANVAS = 'CANVAS',
  VALIDATION = 'VALIDATION',
  BUILD_KIT = 'BUILD_KIT',
  TEAM = 'TEAM',
  ANALYTICS = 'ANALYTICS'
}

export interface AgentState {
  currentStep: AgentStep;
  history: AgentStep[];
  idea: IdeaContext;
  isThinking: boolean;
  
  // Live Data
  pulse?: MarketPulseData;
  validation?: ValidationData;
  founder_fit?: FounderFitData;
  customer?: CustomerPersonaData;
  naming?: NamingData;
  competitors?: CompetitorData;
  breakdown?: BreakDownData;
  experiments?: ExperimentData;
  reality?: RealityData;
  roadmap?: RoadmapItem[];
  mvp?: MVPBlock[];
  stack?: TechStackData;
  timeline?: TimelineData;
  geo?: GeoData;
  creative?: CreativeData;
  launch?: LaunchData;
  deck?: DeckSlide[];
  risks?: RiskItem[];
  score?: ScoreData;

  // Versioning System
  versions: Record<string, ArtifactVersion[]>;
  pendingRethink?: {
    step: AgentStep;
    variant: any;
    rationale: string;
    changes: string[];
    feedback: Feedback;
  };
}

export interface MemoryNode {
  id: string;
  label: string;
  type: 'STRENGTH' | 'WEAKNESS' | 'INTEREST' | 'TRAIT';
  value: number; 
  x: number; 
  y: number;
  connections: string[]; 
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  type: 'MILESTONE' | 'PIVOT' | 'IDEA' | 'FAILURE' | 'EXECUTION';
  description: string;
}

export interface HeatmapDay {
  date: string;
  intensity: number; 
  count: number;
}

export interface PlaygroundItem {
  id: string;
  type: 'NOTE' | 'IMAGE' | 'SKETCH';
  content: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  color?: string;
}

// --- AUDIO AGENT TYPES ---

export interface CallPersona {
  id: string;
  name: string;
  icon: any; // React Node or Lucide Icon
  description: string;
  tone: string;
  instructions: string;
}

export interface CallMessage {
  id: string;
  sender: 'USER' | 'AGENT';
  text: string;
  timestamp: number;
  isPartial?: boolean;
}

export interface LiveSessionState {
  isConnected: boolean;
  isSpeaking: boolean; // Agent is speaking
  isListening: boolean; // User is speaking (VAD)
  volumeLevel: number; // For visualization
  error: string | null;
}

// --- USER FINDER TYPES ---

export interface FinderPlatform {
  id: string;
  name: string;
  color: string;
}

export interface FinderResult {
  id: string;
  platform: string;
  username: string;
  snippet: string;
  relevance: number;
  url: string;
  date: string;
  sentiment?: 'Positive' | 'Negative' | 'Neutral';
}
