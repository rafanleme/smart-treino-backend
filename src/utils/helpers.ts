/**
 * Helper functions for common operations
 */

/**
 * Safely parse a route parameter as integer
 */
export function parseIntParam(param: string | string[] | undefined): number {
  const value = Array.isArray(param) ? param[0] : param;
  if (!value) {
    throw new Error('Missing parameter');
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error('Invalid parameter');
  }
  return parsed;
}

/**
 * Safely get a string parameter
 */
export function getStringParam(param: string | string[] | undefined): string {
  const value = Array.isArray(param) ? param[0] : param;
  if (!value) {
    throw new Error('Missing parameter');
  }
  return value;
}
