export type LayoutTemplate =
  | 'split'
  | 'bottom-band'
  | 'top-hook'
  | 'side-rail'
  | 'comparison';

export type ImageUsageStatus =
  | 'Owned'
  | 'AI-generated'
  | 'Reference only'
  | 'Needs approval';

export type ProductionStatus =
  | 'Needs logo'
  | 'Needs image approval'
  | 'Needs layout review'
  | 'Ready for Chris'
  | 'Ready for export'
  | 'Approved'
  | 'Exported';

export type ExportSize = '1080x1350' | '1080x1080' | '1080x1920';

export interface Concept {
  concept_id: string;
  role: string;
  angle: string;
  source_url: string;
  source_page_name: string;
  image_prompt: string;
  image_file: string;
  image_direction: string;
  image_usage_status: ImageUsageStatus;
  layout_template: LayoutTemplate;
  image_side?: 'left' | 'right';
  layout_warning?: string;
  on_image_hook: string;
  supporting_line?: string;
  bullet_1: string;
  bullet_2: string;
  bullet_3: string;
  cta: string;
  primary_text: string;
  headline: string;
  description: string;
  file_name: string;
  production_status: ProductionStatus;
  notes: string;
  verify_flags?: string[];
  qa_checks?: Record<string, boolean>;
}
