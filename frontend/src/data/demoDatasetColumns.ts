/**
 * Mock column names used by api.inspectDatasetFile() to fabricate a
 * plausible schema until the real Python profiler exists. No file
 * parsing happens anywhere in the frontend — see services/api.ts.
 */
export const demoDatasetColumns: string[] = [
  'review_text',
  'text',
  'content',
  'label',
  'target',
  'rating',
  'user_id',
  'timestamp',
  'category',
  'sentiment',
];