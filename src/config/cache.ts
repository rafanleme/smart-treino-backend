import NodeCache from 'node-cache';

// Cache with 1 hour TTL for exercise catalog
export const exerciseCache = new NodeCache({
  stdTTL: 3600, // 1 hour
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false, // Don't clone objects (better performance)
});

// Cache with 5 minute TTL for general data
export const generalCache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60,
  useClones: false,
});
