import { useEffect } from 'react';

const APP_NAME = 'AdminHub';

/**
 * Sets document.title to "<title> | AdminHub".
 * Falls back to just "AdminHub" when no title provided.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
    return () => {
      document.title = APP_NAME;
    };
  }, [title]);
}
