/**
 * First Meta graphic-request batch — shared across brief, ad copy, and template board.
 * CMO positioning: hire full-time virtual staff through MedVirtual (not managed service / front-desk replacement).
 */

export const BRAND_NAME = 'MedVirtual';

export const ROLES = [
  'Virtual Medical Admin Assistant',
  'Virtual Medical Biller',
  'Virtual Dental Admin Assistant',
  'Virtual Scheduler',
  'Virtual Insurance Verification Assistant',
  'Virtual Prior Authorization Assistant',
  'Virtual Patient Support Assistant',
  'Virtual Front Desk Assistant',
];

export const USE_CASES = [
  'Answering calls',
  'Scheduling appointments',
  'Confirming appointments',
  'Patient reminders',
  'Insurance verification',
  'Prior authorizations',
  'Billing support',
  'EMR updates',
  'Patient intake',
  'Documentation support',
  'Reducing missed calls',
  'Reducing no-shows',
  'Helping overloaded in-office staff',
];

export const PRACTICE_TYPES = [
  'Dental practices',
  'Medical clinics',
  'Specialty practices',
  'Primary care practices',
  'Multi-location practices',
  'High-call-volume practices',
];

export const MESSAGING_RULES = {
  use: [
    'MedVirtual (brand name only — never MedVirtual.ai in ad copy)',
    'full-time virtual staff',
    'virtual staff member',
    'part of your practice team',
    'hire through MedVirtual',
    'trained virtual medical staff',
    'virtual medical admin',
    'virtual dental admin',
    'virtual medical biller',
    'starting at $10/hour (where relevant)',
  ],
  avoid: [
    'MedVirtual.ai',
    'managed service',
    'outsourced front desk',
    'front desk replacement',
    'we handle your front desk',
    'MedVirtual becomes your front desk',
    'vague hype',
    'overly long captions',
    'implying MedVirtual is the clinic’s front desk',
    'positioning MedVirtual as a managed service provider',
  ],
  positioning: [
    'Clinics and practices hire full-time virtual staff through MedVirtual.',
    'The virtual staff member becomes part of their practice team.',
    'The staff member works remotely but supports the clinic’s daily workflow.',
    'Show the virtual staff member handling calls, scheduling, and admin work.',
    'Use specific use-case copy — not only high-level brand messaging.',
  ],
};

export const DELIVERABLES = {
  staticConcepts: 4,
  variationsPerConcept: '1–2',
  feedFormat: '1080×1350 (4:5 feed)',
  storyFormat: '1080×1920 (9:16 story/reels)',
  video: 'Optional 1 short-form video using before/after structure',
};

/** Four test buckets × small concept set = 11 total ad concepts */
export const TEST_BUCKETS = [
  {
    id: 'front_desk_overload',
    label: 'Front Desk Overload',
    angle:
      'Overwhelmed clinic staff, missed calls, scheduling chaos — high-call-volume and multi-location practices.',
    correctMessage:
      'Hire full-time virtual staff through MedVirtual to support the practice team.',
    creativeDirection:
      'Before = overwhelmed in-office staff, ringing phones, scheduling chaos. After = virtual staff member with headset at computer, handling calls/scheduling/admin remotely as part of the team.',
    concepts: [
      {
        id: 'A1',
        name: 'Missed Calls — Feed Static',
        audience: 'High-call-volume medical clinics and specialty practices',
        primaryMessage:
          'Hire a full-time virtual staff member through MedVirtual to answer calls and keep scheduling on track.',
        primaryTexts: [
          'Phones won’t stop ringing? Hire full-time virtual staff through MedVirtual.\n\nYour virtual staff member joins your practice team — answering calls, scheduling, and admin support remotely.\n\nStarting at $10/hour · HIPAA-trained\n\nBook a demo →',
          'Missed calls add up fast. Add a trained virtual staff member to your practice team through MedVirtual.\n\nCalls · Scheduling · Patient follow-up\nStarting at $10/hour\n\nBook a demo →',
        ],
        headlines: ['Hire Virtual Staff for Your Practice', 'Full-Time Virtual Support'],
        description: 'Trained virtual medical staff — part of your practice team. Starting at $10/hour.',
        onImageText: 'Stop missing patient calls.',
        staticDirection:
          'Virtual staff member with headset at computer. Clean clinic visual or split: chaotic desk vs. calm remote worker handling calls. Short on-image text. Logo + Book a demo CTA.',
        videoDirection: 'N/A — static feed concept (1080×1350).',
        visualNotes: 'Reference: T1-MC-45 · AI_003 headset admin. Show work being done, not abstract healthcare stock.',
        avoid: 'Do not show MedVirtual as the clinic front desk. No “we answer your phones for you.”',
        format: 'static',
        templateRefs: ['T1-MC-45', 'T1-FD-45'],
        ratio: '4:5',
      },
      {
        id: 'A2',
        name: 'Front Desk Overload — Story/Reels',
        audience: 'Medical clinics with overloaded in-office staff',
        primaryMessage:
          'Relieve overloaded staff by hiring a virtual team member who handles calls and scheduling remotely.',
        primaryTexts: [
          'Your in-office team is stretched thin. Hire full-time virtual staff through MedVirtual.\n\nA virtual staff member supports calls, scheduling, and admin — as part of your practice team.\n\nBook a demo →',
          'Scheduling chaos? Overloaded front office? Hire trained virtual medical staff through MedVirtual.\n\nStarting at $10/hour\n\nBook a demo →',
        ],
        headlines: ['Support Your Practice Team', 'Hire Virtual Staff'],
        description: 'Full-time virtual staff for calls, scheduling, and admin. Starting at $10/hour.',
        onImageText: 'Hire virtual staff for your team.',
        staticDirection: 'Vertical 9:16. Person left, hook top-right. Minimal text.',
        videoDirection:
          '18–22s. Open on overwhelmed desk (stock/b-roll). Cut to virtual staff on headset. Text reveal: hook → support → CTA. Light zoom. Practice-ops VO only.',
        visualNotes: 'Reference: T1-MC-916 · strongest 9:16 prototype.',
        avoid: 'No “front desk replacement” language. No MedVirtual.ai.',
        format: 'video',
        templateRefs: ['T1-MC-916', 'T1-FD2-916'],
        ratio: '9:16',
      },
      {
        id: 'A3',
        name: 'Scheduling Backup — Feed Static',
        audience: 'Primary care and specialty practices with scheduling bottlenecks',
        primaryMessage:
          'A virtual staff member handles scheduling, confirmations, and reminders as part of your team.',
        primaryTexts: [
          'Appointments piling up? Hire a Virtual Scheduler through MedVirtual.\n\nConfirmations, reminders, and calendar support — remote, full-time, part of your practice team.\n\nStarting at $10/hour\n\nBook a demo →',
          'Keep scheduling moving without overloading in-office staff.\n\nHire full-time virtual staff through MedVirtual.\n\nBook a demo →',
        ],
        headlines: ['Virtual Scheduling Support', 'Keep Scheduling Moving'],
        description: 'Virtual schedulers join your practice team. Starting at $10/hour.',
        onImageText: 'Scheduling handled remotely.',
        staticDirection:
          'Virtual staff at calendar/scheduling screen. Optional appointment reminder visual. Teal CTA.',
        videoDirection: 'N/A — static.',
        visualNotes: 'Reference: T1-SCH-45 · AI_009.',
        avoid: 'No icons crowding the face. No managed-service framing.',
        format: 'static',
        templateRefs: ['T1-SCH-45'],
        ratio: '4:5',
      },
    ],
  },
  {
    id: 'dental_practice',
    label: 'Dental Practice Support',
    angle:
      'Dental practices need scheduling, patient reminders, insurance coordination, pre-authorizations, and documentation support.',
    correctMessage: 'Hire virtual dental admin support through MedVirtual.',
    creativeDirection:
      'Dental office visuals — appointment calendar, insurance forms, patient reminders. Virtual dental admin with headset. HIPAA-trained documentation support.',
    concepts: [
      {
        id: 'B1',
        name: 'Dental Admin — Scheduling & Reminders',
        audience: 'Dental practices',
        primaryMessage:
          'Hire a Virtual Dental Admin Assistant for patient communication, scheduling, and reminders.',
        primaryTexts: [
          'Dental practices: hire virtual dental admin support through MedVirtual.\n\nAppointment scheduling · Patient reminders · Phone support\n\nYour virtual staff member joins your practice team — remotely.\n\nStarting at $10/hour\n\nBook a demo →',
          'Patient communication and scheduling eating up your day?\n\nHire a Virtual Dental Admin Assistant through MedVirtual.\n\nBook a demo →',
        ],
        headlines: ['Virtual Dental Admin Support', 'Hire Dental Admin Staff'],
        description: 'Virtual dental admin for scheduling and patient communication. Starting at $10/hour.',
        onImageText: 'Virtual dental admin support.',
        staticDirection:
          'Dental-friendly visual (clean operatory front desk or scheduling screen). Virtual staff with headset. Bullets: Scheduling · Reminders.',
        videoDirection: 'N/A — static feed.',
        visualNotes: 'Use dental-appropriate stock or AI office scene. No scary clinical imagery.',
        avoid: 'Do not imply MedVirtual runs the dental front desk.',
        format: 'static',
        templateRefs: ['T1-SCH-45'],
        ratio: '4:5',
      },
      {
        id: 'B2',
        name: 'Dental — Insurance & Pre-Auth',
        audience: 'Dental practices handling insurance and pre-authorizations',
        primaryMessage:
          'Virtual dental admin support for insurance coordination and dental pre-authorizations.',
        primaryTexts: [
          'Insurance forms and pre-auths slowing your dental team down?\n\nHire virtual dental admin support through MedVirtual.\n\nInsurance coordination · Dental pre-authorizations · Documentation support\n\nStarting at $10/hour\n\nBook a demo →',
          'HIPAA-trained virtual dental admin for insurance and authorization support.\n\nHire through MedVirtual — part of your practice team.\n\nBook a demo →',
        ],
        headlines: ['Dental Insurance Support', 'Pre-Auth Help for Dental'],
        description: 'Insurance & authorization support for dental practices. Starting at $10/hour.',
        onImageText: 'Insurance & pre-auth support.',
        staticDirection:
          'Virtual staff reviewing insurance form on screen. Dental practice context. Short support line under hook.',
        videoDirection: 'N/A — static.',
        visualNotes: 'Insurance paperwork visual — keep generic, no real patient data.',
        avoid: 'No “we handle your billing” MSP tone.',
        format: 'static',
        templateRefs: ['T2-ADM-45'],
        ratio: '4:5',
      },
      {
        id: 'B3',
        name: 'Dental — Compliance & Documentation',
        audience: 'Dental practices needing HIPAA-trained documentation support',
        primaryMessage:
          'HIPAA-trained virtual dental admin for compliance and documentation support.',
        primaryTexts: [
          'Keep dental documentation accurate with HIPAA-trained virtual staff.\n\nHire a Virtual Dental Admin Assistant through MedVirtual.\n\nCompliance · Documentation · Patient intake\n\nStarting at $10/hour\n\nBook a demo →',
          'Documentation piling up? Hire virtual dental admin support through MedVirtual.\n\nYour virtual staff member works remotely as part of your team.\n\nBook a demo →',
        ],
        headlines: ['HIPAA-Trained Dental Admin', 'Documentation Support'],
        description: 'HIPAA-trained virtual dental admin. Starting at $10/hour.',
        onImageText: 'HIPAA-trained dental support.',
        staticDirection: 'Virtual staff at computer with documentation/EMR visual. Clean, professional.',
        videoDirection: 'Optional 9:16 — simple text reveal over dental admin at desk.',
        visualNotes: 'Reference vertical format if animated: T1-FD-916 style layout.',
        avoid: 'No MedVirtual.ai. No overstuffed caption on image.',
        format: 'static',
        templateRefs: ['T1-FD-916'],
        ratio: '9:16',
      },
    ],
  },
  {
    id: 'insurance_billing',
    label: 'Insurance / Billing Support',
    angle: 'Coverage checks and billing admin create bottlenecks before and after appointments.',
    correctMessage:
      'Virtual medical billers and insurance verification assistants check coverage before appointments and reduce billing surprises.',
    creativeDirection:
      'Virtual staff reviewing insurance details, appointment calendar, billing workflow. Starting at $10/hour stamp optional.',
    concepts: [
      {
        id: 'C1',
        name: 'Insurance Verification — Before Appointments',
        audience: 'Medical clinics and specialty practices',
        primaryMessage:
          'Virtual Insurance Verification Assistants check patient coverage before appointments.',
        primaryTexts: [
          'Virtual Medical Billers check patient insurance coverage before appointments — so there are fewer billing surprises later.\n\nHire through MedVirtual. Starting at $10/hour.\n\nBook a demo →',
          'Coverage checks slowing your team down?\n\nHire a Virtual Insurance Verification Assistant through MedVirtual.\n\nPart of your practice team · Remote · Full-time\n\nBook a demo →',
        ],
        headlines: ['Verify Insurance Before Visits', 'Reduce Billing Surprises'],
        description: 'Insurance verification support. Starting at $10/hour.',
        onImageText: 'Check coverage before visits.',
        staticDirection:
          'Virtual staff reviewing insurance portal/calendar. $10/hr stamp optional (site-backed).',
        videoDirection: 'N/A — static feed.',
        visualNotes: 'Reference: T2-WF-45 · workflow/admin visual.',
        avoid: 'Do not promise specific payer outcomes.',
        format: 'static',
        templateRefs: ['T2-WF-45'],
        ratio: '4:5',
      },
      {
        id: 'C2',
        name: 'Medical Biller — Billing Admin',
        audience: 'Medical clinics with billing admin backlog',
        primaryMessage:
          'Virtual Medical Billers support billing admin and coverage checks as part of your team.',
        primaryTexts: [
          'Billing admin backing up your practice?\n\nHire a Virtual Medical Biller through MedVirtual.\n\nInsurance verification · Billing support · Prior authorizations\n\nStarting at $10/hour\n\nBook a demo →',
          'Trained virtual medical billers join your practice team through MedVirtual.\n\nCheck coverage · Support billing workflow · Reduce surprises\n\nBook a demo →',
        ],
        headlines: ['Hire a Virtual Medical Biller', 'Billing Support for Clinics'],
        description: 'Virtual medical billers — starting at $10/hour.',
        onImageText: 'Virtual medical biller support.',
        staticDirection: 'Biller-focused visual (LP_002 headshot style or AI workflow). Support line + 2 bullets max.',
        videoDirection: 'Optional 9:16 static-to-short with text reveal.',
        visualNotes: 'Biller.avif headshot available in asset hub for Phase 2; use AI_014 admin for first batch.',
        avoid: 'No revenue guarantees. No MSP “we do your billing” framing.',
        format: 'static',
        templateRefs: ['T2-ADM-45', 'T2-WF-916'],
        ratio: '4:5',
      },
    ],
  },
  {
    id: 'virtual_med_admin',
    label: 'Virtual Medical Admin',
    angle:
      'A trained full-time virtual medical admin joins the practice team for calls, scheduling, EMR, intake, and follow-up.',
    correctMessage:
      'From scheduling to insurance coordination, your virtual medical admin handles the full front-desk workflow remotely — as part of your team.',
    creativeDirection:
      'Virtual staff at computer/headset. Clinic team relieved. Organized schedule. EMR updates on screen.',
    concepts: [
      {
        id: 'D1',
        name: 'Virtual Medical Admin — Full Workflow',
        audience: 'Medical clinics and primary care practices',
        primaryMessage:
          'Hire a Virtual Medical Admin Assistant for calls, scheduling, intake, and follow-up.',
        primaryTexts: [
          'From scheduling to insurance coordination, your virtual medical admin handles the full front-desk workflow remotely.\n\nHire full-time through MedVirtual — part of your practice team.\n\nStarting at $10/hour\n\nBook a demo →',
          'Hire a Virtual Medical Admin Assistant through MedVirtual.\n\nCalls · Scheduling · EMR updates · Patient intake\n\nBook a demo →',
        ],
        headlines: ['Hire a Virtual Medical Admin', 'Full Admin Workflow Support'],
        description: 'Virtual medical admin assistants. Starting at $10/hour.',
        onImageText: 'Your virtual medical admin.',
        staticDirection:
          'Virtual staff with headset + monitor showing schedule/EMR. Hook top-right or top-left per template.',
        videoDirection: 'N/A — static.',
        visualNotes: 'Reference: T2-RMA-45 · AI_007.',
        avoid: '“Front desk workflow” = tasks they help with, not MedVirtual replacing the desk.',
        format: 'static',
        templateRefs: ['T2-RMA-45'],
        ratio: '4:5',
      },
      {
        id: 'D2',
        name: 'EMR Updates — Data Accuracy',
        audience: 'Medical clinics needing EMR and intake support',
        primaryMessage:
          'Maintain accurate patient information in your EMR with Virtual Medical Admin Assistants.',
        primaryTexts: [
          'Maintain accurate patient information in your EMR with our Virtual Medical Admin Assistants. Starting at $10/hour.\n\nHire through MedVirtual — your virtual staff member joins your practice team.\n\nBook a demo →',
          'Patient intake and EMR updates eating up your day?\n\nHire trained virtual medical staff through MedVirtual.\n\nBook a demo →',
        ],
        headlines: ['EMR Support for Your Clinic', 'Accurate Patient Records'],
        description: 'EMR updates and patient intake. Starting at $10/hour.',
        onImageText: 'EMR updates handled remotely.',
        staticDirection: 'Staff at EMR screen. Short hook. $10/hr optional.',
        videoDirection: 'N/A — static.',
        visualNotes: 'Reference: T2-ADM-45 · admin at monitor.',
        avoid: 'No specific EMR brand logos unless licensed.',
        format: 'static',
        templateRefs: ['T2-ADM-45'],
        ratio: '4:5',
      },
      {
        id: 'D3',
        name: 'Before/After — Practice Team Relief',
        audience: 'Overloaded practices comparing before vs. after hiring virtual staff',
        primaryMessage:
          'Hire full-time virtual staff through MedVirtual — your practice team gets remote support for daily workflow.',
        primaryTexts: [
          'Before: overloaded staff, missed calls, scheduling gaps.\nAfter: a full-time virtual staff member on your practice team through MedVirtual.\n\nCalls · Scheduling · Admin · Starting at $10/hour\n\nBook a demo →',
          'Add a trained virtual staff member to your practice team.\n\nHire through MedVirtual — remote, full-time, HIPAA-trained.\n\nBook a demo →',
        ],
        headlines: ['Before & After Virtual Staff', 'Support Your Practice Team'],
        description: 'Full-time virtual staff for healthcare practices.',
        onImageText: 'Before → After',
        staticDirection: 'Split-frame or two-panel static if not video.',
        videoDirection:
          'Primary video concept. 20–30s before/after. Panel 1: chaos (missed call icon, full waiting room). Panel 2: virtual staff on headset, calendar organized. End CTA: Book a demo. VO: practice manager POV.',
        visualNotes: 'Label: Before/After MedVirtual. Can seed from T1-MC-916 motion notes.',
        avoid: 'No fake patient testimonials. No “MedVirtual fixed our practice” actor scenes.',
        format: 'video',
        templateRefs: ['T1-MC-916', 'T2-RMA-916'],
        ratio: '9:16',
      },
    ],
  },
];

export const ARCHIVED_CONCEPTS = TEST_BUCKETS.flatMap((b) =>
  b.concepts.map((c) => ({ ...c, bucketId: b.id, bucketLabel: b.label })),
);

/** @deprecated use ARCHIVED_CONCEPTS — kept for scripts that imported ALL_CONCEPTS */
export const ALL_CONCEPTS = ARCHIVED_CONCEPTS;

/** Campaign context — internal only, not for designer/VA */
export const CAMPAIGN_STRATEGY_NOTE =
  'This first batch will run against a high-quality lookalike audience built from booked demos. Audience targeting stays broad while the creative tests medical, dental, role-specific, and pain-first messaging.';

/** Internal media-buying context — not for designer/VA production */
export const INTERNAL_NOTES = [
  CAMPAIGN_STRATEGY_NOTE,
  'Confirm “Starting at $10/hour” with leadership before paid spend goes live. Use only on the Pain-First concept (concept 4).',
];

/** Designer-facing production deliverables — first batch only */
export const PRODUCTION_DELIVERABLES = [
  'Exactly 4 static concepts',
  '1080 × 1350 feed only',
  'One design per concept',
  'No variations yet',
  'No 1080 × 1920 resizes yet',
  'No video yet',
];

export const PRODUCTION_DELIVERABLES_NOTE =
  'Variations, resizes, and videos happen only after the first four designs are reviewed.';

/** Historic FirstBatch — KILLED. Do not feed VA queue. See creative-hopper-data.mjs. */
export const PRODUCTION_CONCEPTS = [
  {
    id: '1',
    name: 'General Medical Practice Callout',
    audience: 'Medical practice owners and practice managers',
    headline: 'Add full-time virtual support without adding office space.',
    support: 'Hire a Virtual Medical Admin — Role-Offer DNA.',
    visual:
      'Person left on light plate. Right: Hire a Virtual + Medical Admin pill, checklist, STARTING AT $10/hour box, Book a Demo. Match Role-Offer type.',
    cta: 'Book a Demo',
    warning: 'Do not imply MedVirtual operates or replaces the clinic front desk.',
    primaryText:
      'Medical practice owners: add full-time virtual support without adding office space.\n\nHire full-time virtual staff through MedVirtual — part of your practice team.\n\nBook a demo →',
    metaHeadline: 'Medical Practice Owners',
    description: 'Full-time virtual staff for medical practices.',
  },
  {
    id: '2',
    name: 'Dental Practice Callout',
    audience: 'Dental practice owners and dental practice managers',
    headline: 'Fewer missed calls. Fewer empty chairs.',
    support: 'Hire a Virtual Dental Admin — Role-Offer DNA.',
    visual:
      'Person hard-left (face clear of type). Right: DENTISTS! · Hire a Virtual + Dental Admin · checklist · $10 circle · Get Started. Role-Offer type + setup.',
    cta: 'Book a Demo',
    warning: 'Keep the visual clearly dental-specific without using graphic clinical imagery.',
    primaryText:
      'Dental practice owners: help with scheduling, insurance, and patient follow-up.\n\nHire full-time virtual dental staff through MedVirtual — part of your practice team.\n\nBook a demo →',
    metaHeadline: 'Dental Practice Owners',
    description: 'Virtual staff for dental scheduling and follow-up.',
  },
  {
    id: '3',
    name: 'Role-Specific Offer',
    audience: 'Medical practice decision-makers',
    headline: 'Give your front office backup, not burnout.',
    support: 'Hire a Virtual Medical Admin — checklist + price + CTA (Role-Offer look).',
    visual:
      'Light grid plate. Person right in scrubs (stock/AI). Left: Hire a Virtual + Medical Admin pill, checklist with check icons, Book a Consultation CTA, STARTING AT $10/hour overlay on photo. Match Role-Offer RO-ADMIN-BURNOUT — not the old all-caps HIRE A FULL-TIME stack.',
    cta: 'Book a Consultation',
    warning: 'Do not make the person look like a generic call-center agent or a job-seeker ad. Follow Role-Offer DNA.',
    primaryText:
      'Give your front office backup, not burnout.\n\nHire a virtual Medical Admin through MedVirtual — part of your practice team.\n\nStarting at $10/hour · Book a consultation →',
    metaHeadline: 'Give Your Front Office Backup',
    description: 'Trained virtual staff for medical practices.',
  },
  {
    id: '4',
    name: 'Pain-First Offer',
    audience: 'Medical and dental practice decision-makers',
    headline: 'Too many calls. Not enough staff.',
    support: 'Hire a Virtual Front Desk Support — Role-Offer DNA.',
    visual:
      'Person left. Right: Hire a Virtual + Front Desk Support pill, checklist, $10 box, Book a Demo. Pain headline in Role-Offer Be Vietnam hierarchy — not old all-caps stack.',
    cta: 'Book a Demo',
    warning: 'Keep the message simple. Do not add a long list of tasks.',
    primaryText:
      'Too many calls. Not enough staff.\n\nHire full-time virtual staff through MedVirtual — starting at $10/hour.\n\nBook a demo →',
    metaHeadline: 'Too Many Calls. Not Enough Staff.',
    description: 'Full-time virtual staff starting at $10/hour.',
  },
];

export const FIRST_BATCH_COUNT = PRODUCTION_CONCEPTS.length;

/** Map template IDs → test bucket for board labels */
export const TEMPLATE_BUCKET_MAP = {
  'T1-MC-45': 'front_desk_overload',
  'T1-MC-916': 'before_after',
  'T1-MC-11': 'front_desk_overload',
  'T1-FD-45': 'front_desk_overload',
  'T1-FD-916': 'dental_practice',
  'T1-FD-11': 'front_desk_overload',
  'T1-FD2-45': 'front_desk_overload',
  'T1-FD2-916': 'front_desk_overload',
  'T1-FD2-11': 'front_desk_overload',
  'T1-SCH-45': 'dental_practice',
  'T1-SCH-916': 'dental_practice',
  'T1-SCH-11': 'dental_practice',
  'T2-RMA-45': 'virtual_med_admin',
  'T2-RMA-916': 'virtual_med_admin',
  'T2-RMA-11': 'virtual_med_admin',
  'T2-RMA2-45': 'virtual_med_admin',
  'T2-RMA2-916': 'before_after',
  'T2-RMA2-11': 'virtual_med_admin',
  'T2-ADM-45': 'virtual_med_admin',
  'T2-ADM-916': 'insurance_billing',
  'T2-ADM-11': 'virtual_med_admin',
  'T2-WF-45': 'insurance_billing',
  'T2-WF-916': 'insurance_billing',
  'T2-WF-11': 'insurance_billing',
  'T3-CTR-45': 'virtual_med_admin',
  'T3-CTR-916': 'virtual_med_admin',
  'T3-CTR-11': 'virtual_med_admin',
};

export const BUCKET_LABELS = {
  front_desk_overload: 'Front Desk Overload',
  dental_practice: 'Dental Practice Support',
  insurance_billing: 'Insurance / Billing Support',
  virtual_med_admin: 'Virtual Medical Admin',
  before_after: 'Before/After MedVirtual',
};

export const BUCKET_COLORS = {
  front_desk_overload: '#0d9488',
  dental_practice: '#2563eb',
  insurance_billing: '#7c3aed',
  virtual_med_admin: '#059669',
  before_after: '#ea580c',
};

/** Monday.com / Slack graphic request — one brief link */
export function buildMondayFormCopy(baseUrl = 'https://medvirtual-ad-content-doc.vercel.app') {
  const concepts = PRODUCTION_CONCEPTS.map((c, i) => {
    return `${i + 1}. Headline: ${c.headline}
   Support: ${c.support}`;
  }).join('\n\n');

  return `PROJECT: MedVirtual Meta Ads — First Creative Batch

Brief (art + Meta copy):
${baseUrl}/graphic-request-brief.html

Produce exactly 4 static ads · 1080×1350 · CTA: Book a Demo · one design each · no variations yet

ON-IMAGE COPY

${concepts}

Brand: MedVirtual only (never MedVirtual.ai). No patient info. Don’t make it look like a call center or like we run their front desk.`;
}
