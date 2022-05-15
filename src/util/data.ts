import { ActivityTrackingData } from ':interfaces/activity-tracker-data.ts';
import { log } from ':util/logger.ts';

const dataDirPath = 'data';
const activityTrackerDataFile = dataDirPath + '/activity-tracker.json';

const createDataDirIfNotExists = () => {
    try {
        Deno.statSync(dataDirPath);
    } catch {
        log('Creating directory ' + dataDirPath);
        Deno.mkdirSync(dataDirPath);
    }
};

const createActivityTrackerDataIfNotExists = () => {
    try {
        Deno.statSync(activityTrackerDataFile);
    } catch {
        const emptyData: ActivityTrackingData = {
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

const initializeData = () => {
    createDataDirIfNotExists();
    createActivityTrackerDataIfNotExists();
};

export const readActivityTrackerData = (): ActivityTrackingData => {
    initializeData();

    const fileContents = Deno.readTextFileSync(activityTrackerDataFile);
    const activityTrackerData: ActivityTrackingData = JSON.parse(fileContents);

    return activityTrackerData;
};

export const writeActivityTrackingData = (data: ActivityTrackingData) => {
    initializeData();

    log('Writing file ' + activityTrackerDataFile);

    Deno.writeTextFileSync(
        activityTrackerDataFile,
        JSON.stringify(data, null, 2)
    );
};
