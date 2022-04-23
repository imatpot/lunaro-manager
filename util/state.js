const {
    existsSync,
    mkdirSync,
    writeFileSync,
    readFileSync,
} = require('node:fs');
const { updateRTP } = require('./lunaroPlayers');

const trackerEnabledFile = 'data/trackerEnabled';
let periodicTracker;

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

    enableTracker: (guild, client) => {
        writeFileSync(trackerEnabledFile, 'true');
        module.exports.enablePeriodicTracking(guild);
        client.user.setStatus('online');
        client.user.setActivity('Lunaro Tracker is on');
    },

    disableTracker: (client) => {
        writeFileSync(trackerEnabledFile, 'false');
        module.exports.disablePeriodicTracking();
        client.user.setStatus('dnd');
        client.user.setActivity('Lunaro Tracker is off');
    },

    enablePeriodicTracking: (guild) => {
        const oneMinInMs = 60 * 1000;
        periodicTracker = setInterval(() => updateRTP(guild), oneMinInMs);
    },

    disablePeriodicTracking: () => {
        clearInterval(periodicTracker);
    },
};

const createTrackerEnabledFile = () => {
    if (!existsSync('data')) mkdirSync('data');
    writeFileSync(trackerEnabledFile, 'false', { flag: 'w' });
};
