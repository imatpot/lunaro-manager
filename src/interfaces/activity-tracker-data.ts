/** Configuration options for activity tracking. */
export interface ActivityTrackingConfig {
    /** Whether to track activities. */
    enabled: boolean;

    /** IDs of users who paused tracking for their account. */
    blocklist: string[];
}
