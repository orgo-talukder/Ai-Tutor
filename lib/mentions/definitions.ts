export type MentionCategory = 'create' | 'learn' | 'solve' | 'context';
export type MentionType = 'capability' | 'context';

export interface MentionDefinition {
  id: string;
  label: string;
  description: string;
  category: MentionCategory;
  type: MentionType;
  icon: string; // Lucide icon identifier or descriptive label
}

export const MENTION_DEFINITIONS: MentionDefinition[] = [
  // CATEGORY 1: CREATE
  {
    id: 'canvas',
    label: 'Canvas',
    description: 'Create an interactive workspace',
    category: 'create',
    type: 'capability',
    icon: 'LayoutTemplate',
  },
  {
    id: 'notes',
    label: 'Notes',
    description: 'Create structured study notes',
    category: 'create',
    type: 'capability',
    icon: 'FileText',
  },
  {
    id: 'diagram',
    label: 'Diagram',
    description: 'Create a conceptual diagram',
    category: 'create',
    type: 'capability',
    icon: 'Network',
  },
  {
    id: 'mindmap',
    label: 'MindMap',
    description: 'Create a visual mind map',
    category: 'create',
    type: 'capability',
    icon: 'GitFork',
  },
  {
    id: 'table',
    label: 'Table',
    description: 'Create structured comparison table',
    category: 'create',
    type: 'capability',
    icon: 'Table',
  },

  // CATEGORY 2: LEARN
  {
    id: 'explain',
    label: 'Explain',
    description: 'Explain a concept clearly',
    category: 'learn',
    type: 'capability',
    icon: 'Compass',
  },
  {
    id: 'step-by-step',
    label: 'StepByStep',
    description: 'Step-by-step guidance & derivation',
    category: 'learn',
    type: 'capability',
    icon: 'ListOrdered',
  },
  {
    id: 'practice',
    label: 'Practice',
    description: 'Solve real practice exercises',
    category: 'learn',
    type: 'capability',
    icon: 'Activity',
  },
  {
    id: 'quiz',
    label: 'Quiz',
    description: 'Generate an interactive quiz',
    category: 'learn',
    type: 'capability',
    icon: 'GraduationCap',
  },
  {
    id: 'flashcards',
    label: 'Flashcards',
    description: 'Create revision flashcards',
    category: 'learn',
    type: 'capability',
    icon: 'Layers',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    description: 'Synthesize high-yield summary',
    category: 'learn',
    type: 'capability',
    icon: 'Sparkles',
  },
  {
    id: 'study-plan',
    label: 'StudyPlan',
    description: 'Create structured learning plan',
    category: 'learn',
    type: 'capability',
    icon: 'Calendar',
  },

  // CATEGORY 3: SOLVE
  {
    id: 'solve',
    label: 'Solve',
    description: 'Diagnose and solve physics/math',
    category: 'solve',
    type: 'capability',
    icon: 'Cpu',
  },
  {
    id: 'exam',
    label: 'Exam',
    description: 'Mock exam prep & standard questions',
    category: 'solve',
    type: 'capability',
    icon: 'Award',
  },
  {
    id: 'code',
    label: 'Code',
    description: 'Explain or generate clean code',
    category: 'solve',
    type: 'capability',
    icon: 'Code',
  },

  // CATEGORY 4: CONTEXT
  {
    id: 'current-chat',
    label: 'CurrentChat',
    description: 'Reference current conversation',
    category: 'context',
    type: 'context',
    icon: 'MessageSquare',
  },
  {
    id: 'this-message',
    label: 'ThisMessage',
    description: 'Reference this active query context',
    category: 'context',
    type: 'context',
    icon: 'CornerDownLeft',
  },
  {
    id: 'last-answer',
    label: 'LastAnswer',
    description: 'Reference previous assistant response',
    category: 'context',
    type: 'context',
    icon: 'Undo2',
  },
  {
    id: 'file',
    label: 'File',
    description: 'Reference selected files & documents',
    category: 'context',
    type: 'context',
    icon: 'Paperclip',
  },
  {
    id: 'image',
    label: 'Image',
    description: 'Reference attached image content',
    category: 'context',
    type: 'context',
    icon: 'Image',
  },
];

export const ALLOWED_MENTIONS_ALLOWLIST = MENTION_DEFINITIONS.map((m) => m.id);
