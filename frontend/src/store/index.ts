// Zustand stores
export { default as useAugConfigStore } from "./augConfigStore";
export { default as useBackendResponseStore } from "./backendResponseStore";

// Google Cloud Storage folder paths
export { default as bucketFolders } from "./googleCloudStore";

// Type exports for global access to store-related types
export type { AugConfig, AugConfigStore } from "./augConfigStore";
export type {
  BackendResponseLog,
  BackendResponseStore,
} from "./backendResponseStore";
