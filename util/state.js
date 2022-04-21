const {
    existsSync,
    mkdirSync,
    writeFileSync,
    readFileSync,
} = require('node:fs');

const trackerEnabledFile = 'data/trackerEnabled';

module.exports = {
    isTrackerEnabled: () => {
        if (existsSync(trackerEnabledFile)) {
            const trackerEnabledText = readFileSync(
                trackerEnabledFile,
                'utf-8'
            );
            return trackerEnabledText === 'true';
        } else {
            createTrackerEnabledFile();
            return false;
        }
    },

    enableTracker: () => {
        const trackerEnabled = module.exports.isTrackerEnabled();
        if (!trackerEnabled) {
            writeFileSync(trackerEnabledFile, 'true');
        }
    },

    disableTracker: () => {
        const trackerEnabled = module.exports.isTrackerEnabled();
        if (trackerEnabled) {
            writeFileSync(trackerEnabledFile, 'false');
        }
    },

    enablePeriodicTracking: () => {},

    disablePeriodicTracking: () => {},
};

const createTrackerEnabledFile = () => {
    if (!existsSync('data')) mkdirSync('data');
    writeFileSync(trackerEnabledFile, 'false', { flag: 'w' });
};
