export type ProjectStatus = 'draft' | 'review' | 'export-ready';
export type Language = 'EN' | 'ES' | 'Bilingual';
export type FunnelStage = 'Awareness' | 'Consideration' | 'Conversion' | 'Retention';
export type MotionPreset = 'none' | 'reveal' | 'stagger' | 'slow-zoom' | 'offer-pop';
export type ExportFormat = 'png' | 'jpeg';
export type TemplateCategory =
  | 'Bold headline'
  | 'Offer-led'
  | 'Trust and compliance'
  | 'Proof'
  | 'Problem / solution'
  | 'Display';

export type CreativeContent = {
  eyebrow: string;
  headline: string;
  supportingText: string;
  offer: string;
  cta: string;
  disclaimer: string;
  highlight: string;
};

export type BrandKit = {
  id: string;
  name: string;
  logoDataUrl?: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  headingFont: string;
  bodyFont: string;
  defaultCta: string;
  defaultDisclaimer: string;
  imageStyleNotes: string;
  createdAt: string;
  updatedAt: string;
};

export type ImageAsset = {
  dataUrl: string;
  name: string;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  zoom: number;
  overlay: number;
  tint: boolean;
};

export type CreativeVariant = {
  id: string;
  name: string;
  content: CreativeContent;
  language: Language;
  version: number;
  image?: ImageAsset;
  colorMode: 'brand' | 'inverse' | 'accent';
  motionPreset: MotionPreset;
  motionDuration: number;
};

export type CreativeProject = {
  schemaVersion: 2;
  id: string;
  name: string;
  brandKitId: string;
  campaign: string;
  concept: string;
  angle: string;
  audience: string;
  offer: string;
  language: Language;
  funnelStage: FunnelStage;
  templateId: string;
  variants: CreativeVariant[];
  activeVariantId: string;
  selectedPlacementIds: string[];
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

export type PlacementDefinition = {
  id: string;
  platform: 'Meta' | 'Google Display';
  name: string;
  shortName: string;
  width: number;
  height: number;
  family: 'square' | 'portrait' | 'story' | 'landscape' | 'rectangle' | 'leaderboard' | 'half-page' | 'mobile-banner';
  safeInset: number;
  maxHeadlineChars: number;
  maxSupportingChars: number;
  actualSizePreview?: boolean;
};

export type TemplateDefinition = {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  tags: string[];
  supportedPlacementIds: string[];
  motionPresets: MotionPreset[];
  defaultContent: CreativeContent;
  thumbnailVariant: 'split' | 'type' | 'offer' | 'proof' | 'frame' | 'minimal';
};

export type CreativeWarning = {
  field: keyof CreativeContent | 'image' | 'resolution';
  level: 'info' | 'warning';
  message: string;
};

export type ExportManifestItem = {
  filename: string;
  placementId: string;
  platform: string;
  width: number;
  height: number;
  variant: string;
  version: number;
  warnings: string[];
};

export type ExportManifest = {
  schemaVersion: 1;
  generatedAt: string;
  project: {
    id: string;
    name: string;
    campaign: string;
    concept: string;
    angle: string;
    audience: string;
    offer: string;
    language: Language;
    funnelStage: FunnelStage;
    status: ProjectStatus;
  };
  brand: { id: string; name: string };
  template: { id: string; name: string };
  items: ExportManifestItem[];
};

export type WorkspaceView = 'dashboard' | 'templates' | 'brands' | 'studio';
export type StudioPanel = 'edit' | 'family' | 'export';
