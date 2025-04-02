import { v4 as uuidv4 } from "uuid";

const SESSION_KEY = "morph-session-id";

/**
 * Retrieves the session ID from localStorage.
 * If not found, generates a new UUID, stores it, and returns it.
 *
 * @returns {string} The session ID.
 */
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

/**
 * Removes the session ID from localStorage.
 */
export const removeSessionId = () => {
  localStorage.removeItem(SESSION_KEY);
};
