const {
    existsSync,
    mkdirSync,
    writeFileSync,
    readFileSync,
    openSync,
    closeSync,
} = require('node:fs');

const whitelistFile = 'data/whitelist';

module.exports = {
    readWhitelist: () => {
        if (existsSync(whitelistFile)) {
            const whitelistText = readFileSync(whitelistFile, 'utf-8');
            return whitelistText ? whitelistText.split('\n') : [];
        } else {
            createWhitelistFile();
            return [];
        }
    },

    addToWhitelist: (id) => {
        const whitelist = module.exports.readWhitelist();
        whitelist.push(id);
        writeFileSync(whitelistFile, whitelist.join('\n'));
    },

    removeFromWhitelist: (id) => {
        let whitelist = module.exports.readWhitelist();
        whitelist = whitelist.filter((entry) => entry !== id);
        writeFileSync(whitelistFile, whitelist.join('\n'));
    },
};

const createWhitelistFile = () => {
    mkdirSync('data');
    closeSync(openSync(whitelistFile, 'w'));
};
