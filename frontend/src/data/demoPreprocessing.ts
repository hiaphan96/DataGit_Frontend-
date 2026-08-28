import type {
  CleaningStepConfig,
  BeforeAfterMetric,
  DataWarning,
  AiSuggestion,
  DataPreview,
  ExpandableSectionConfig,
} from '../types/preprocessing';

// Mirrors the same demo dataset used in Stage 3's version lineage (V01 → V02 → V03).
// sourceVersionId points at the latest existing version; Stage 4 output becomes the next one.
export const DEMO_PREPROCESSING_SOURCE = {
  datasetId: 'ds-sentiment-reviews',
  sourceVersionId: 'v-03',
};

export const demoCleaningSteps: CleaningStepConfig[] = [
  {
    id: 'handle_missing_values',
    icon: 'file-x',
    title: 'handle missing values',
    description: 'fill or impute missing values in columns',
    controlType: 'select',
    enabled: true,
    selectValue: 'median',
    selectOptions: [
      { value: 'median', label: 'fill with median' },
      { value: 'mean', label: 'fill with mean' },
      { value: 'mode', label: 'fill with mode' },
      { value: 'drop', label: 'drop rows' },
    ],
  },
  {
    id: 'remove_duplicates',
    icon: 'copy',
    title: 'remove duplicates',
    description: 'remove duplicate rows from dataset',
    controlType: 'toggle',
    enabled: true,
  },
  {
    id: 'remove_empty_rows',
    icon: 'trash-2',
    title: 'remove empty rows',
    description: 'remove rows where all values are empty',
    controlType: 'toggle',
    enabled: true,
  },
  {
    id: 'lowercase_text',
    icon: 'type',
    title: 'lowercase text',
    description: 'convert all text to lowercase',
    controlType: 'toggle',
    enabled: true,
  },
  {
    id: 'remove_special_characters',
    icon: 'code',
    title: 'remove special characters',
    description: 'remove punctuation, symbols, and emojis',
    controlType: 'toggle',
    enabled: true,
  },
  {
    id: 'trim_white_spaces',
    icon: 'list',
    title: 'trim white spaces',
    description: 'trim leading and trailing white spaces',
    controlType: 'toggle',
    enabled: true,
  },
];

export const demoDataPreview: DataPreview = {
  columns: [
    { key: 'review_text', label: 'review_text' },
    { key: 'rating', label: 'rating' },
    { key: 'helpful_votes', label: 'helpful_votes' },
  ],
  rows: [
    { review_text: 'great product really loved it', rating: 5, helpful_votes: 12 },
    { review_text: 'works well and good quality', rating: 4, helpful_votes: 8 },
    { review_text: 'not bad could be better', rating: 3, helpful_votes: 3 },
    { review_text: 'terrible experience waste money', rating: 1, helpful_votes: 0 },
    { review_text: 'excellent value for price', rating: 5, helpful_votes: 15 },
  ],
  totalRows: 10266,
};

export const demoBeforeAfterMetrics: BeforeAfterMetric[] = [
  {
    id: 'rows',
    label: 'rows',
    before: '10,266',
    after: '9,168',
    changeLabel: '↓ 1,098 (10.6%)',
    direction: 'negative',
  },
  {
    id: 'missing_values',
    label: 'missing values',
    before: '2.31%',
    after: '0.21%',
    changeLabel: '↓ 2.10%',
    direction: 'positive',
  },
  {
    id: 'duplicate_rows',
    label: 'duplicate rows',
    before: '1.12%',
    after: '0%',
    changeLabel: '↓ 1.12%',
    direction: 'positive',
  },
  {
    id: 'unique_values_avg',
    label: 'unique values (avg)',
    before: '—',
    after: '+3.4%',
    changeLabel: '↑ 3.4%',
    direction: 'positive',
  },
  {
    id: 'text_length_avg',
    label: 'text length (avg)',
    before: '78.4',
    after: '73.1',
    changeLabel: '↓ 5.3',
    direction: 'neutral',
  },
  {
    id: 'quality_score',
    label: 'quality score',
    before: '91 / 100',
    after: '96 / 100',
    changeLabel: '↑ 4',
    direction: 'positive',
  },
];

export const demoWarnings: DataWarning[] = [
  {
    id: 'high-cardinality',
    message: "column 'product_category' has high cardinality (523 unique values).",
    severity: 'warning',
  },
  {
    id: 'rare-category-suggestion',
    message: 'consider removing or merging rare categories.',
    severity: 'info',
  },
];

export const demoAiSuggestion: AiSuggestion = {
  message: 'your text column looks clean. tokenization will improve model performance.',
};

export const demoExpandableSections: ExpandableSectionConfig[] = [
  {
    id: 'feature_preparation',
    title: 'feature preparation',
    description: 'configure feature-related preprocessing',
  },
  {
    id: 'output_options',
    title: 'output options',
    description: 'save preprocessed data as new version',
  },
];