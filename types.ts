export type Depth = 'foundational' | 'advanced' | 'expert' | 'visionary';

export type Category = 
  | 'core-catalysts'
  | 'technical-mastery'
  | 'creative-fusion'
  | 'system-orchestration'
  | 'cognitive-evolution'
  | 'meta-thinking'
  | 'philosophical-methodology'
  | 'breakthrough-innovation'
  | 'prompt-foundations'
  | 'prompt-structuring'
  | 'prompt-optimization'
  | 'prompt-operations'
  | 'prompt-augmentation'
  | 'prompt-governance';

export interface MagicKeyword {
    term: string;
    category: Category;
    depth: Depth;
    description: string;
    examples: string[];
    related: string[];
    cognitiveImpact: string;
    crossDomains: string[];
}

export interface FilterState {
    search: string;
    category: Category | 'all' | 'favorites';
    depth: Depth | 'all';
}
