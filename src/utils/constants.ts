export const EXPORT_SIZES = {
  '1080x1350': { width: 1080, height: 1350, label: '4:5 Feed (1080×1350)' },
  '1080x1080': { width: 1080, height: 1080, label: 'Square (1080×1080)' },
  '1080x1920': { width: 1080, height: 1920, label: '9:16 Story (1080×1920)' },
} as const;

export const LAYOUT_LABELS: Record<string, string> = {
  split: 'Template A — Split (image + copy)',
  'bottom-band': 'Template B — Bottom band',
  'top-hook': 'Template C — Top hook / bottom CTA',
  'side-rail': 'Template D — Side rail',
  comparison: 'Template E — Comparison',
};

export const ROLE_URLS: Record<string, { url: string; pageName: string }> = {
  'General MedVirtual': {
    url: 'https://www.medvirtual.ai/explore-medical-virtual-assistants',
    pageName: 'Explore Medical Virtual Assistants',
  },
  'Medical Assistant': {
    url: 'https://www.medvirtual.ai/hire-virtual-medical-assistants',
    pageName: 'Hire Virtual Medical Assistants',
  },
  'Medical Nurse': {
    url: 'https://www.medvirtual.ai/hire-virtual-medical-nurse-now',
    pageName: 'Hire Virtual Medical Nurse',
  },
  'Medical Biller': {
    url: 'https://www.medvirtual.ai/hire-virtual-medical-biller-now',
    pageName: 'Hire Virtual Medical Biller',
  },
  'Medical Case Coordinator': {
    url: 'https://www.medvirtual.ai/hire-virtual-medical-case-coordinator-now',
    pageName: 'Hire Virtual Medical Case Coordinator',
  },
};

import type { ProductionStatus } from '../types/concept';

export const LOGO_PATH = '/assets/logo/medvirtual-logo.svg';

export const PRODUCTION_STATUSES: ProductionStatus[] = [
  'Needs logo',
  'Needs image approval',
  'Needs layout review',
  'Ready for Chris',
  'Ready for export',
  'Approved',
  'Exported',
];
