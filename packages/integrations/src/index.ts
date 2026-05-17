export type IntegrationProvider = "meta" | "tiktok" | "youtube" | "google";

export interface SyncResult {
  provider: IntegrationProvider;
  syncedAt: Date;
  recordsSynced: number;
}
