import { ActivityTrackingConfig } from ':interfaces/activity-tracker-data.ts';
import { log } from ':util/logger.ts';

const dataDirPath = 'data';
const activityTrackerDataFile = dataDirPath + '/activity-tracker.json';

/** Creates a `projectRoot/data/` directory if it doesn't exist. */
const createDataDirIfNotExists = () => {
    try {
        Deno.statSync(dataDirPath);
    } catch {
        log('Creating directory ' + dataDirPath);
        Deno.mkdirSync(dataDirPath);
        Deno.chmod(dataDirPath, 0o777);
    }
};

/** Creates a `projectRoot/data/activity-tracker.json` file if it doesn't exist. */
const createActivityTrackerConfigIfNotExists = () => {
    try {
        Deno.statSync(activityTrackerDataFile);
    } catch {
        const emptyData: ActivityTrackingConfig = {
            enabled: false,
            blocklist: [],
        };

        log('Creating file ' + activityTrackerDataFile);

        Deno.writeTextFileSync(
            activityTrackerDataFile,
            JSON.stringify(emptyData, null, 2)
        );
    }
};

/** Creates all necessary directories and files to store the bot's data. */
const initializeData = () => {
    createDataDirIfNotExists();
    createActivityTrackerConfigIfNotExists();
};

/**
 * Reads the activity tracking configuration from the disk.
 * @returns the configuration
 */
export const readActivityTrackingConfig = (): ActivityTrackingConfig => {
    initializeData();

    const fileContents = Deno.readTextFileSync(activityTrackerDataFile);
    const activityTrackerData: ActivityTrackingConfig =
        JSON.parse(fileContents);

    return activityTrackerData;
};

/**
 * Saves the activity tracking configuration to the disk.
 * @param config to be saved
 */
export const writeActivityTrackingConfig = (config: ActivityTrackingConfig) => {
    initializeData();

    log('Writing file ' + activityTrackerDataFile);

    Deno.writeTextFileSync(
        activityTrackerDataFile,
        JSON.stringify(config, null, 2)
    );
};
