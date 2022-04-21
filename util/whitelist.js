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
        if (!whitelist.includes(id)) {
            whitelist.push(id);
            writeFileSync(whitelistFile, whitelist.join('\n'));
        }
    },

    removeFromWhitelist: (id) => {
        let whitelist = module.exports.readWhitelist();
        if (whitelist.includes(id)) {
            whitelist = whitelist.filter((entry) => entry !== id);
            writeFileSync(whitelistFile, whitelist.join('\n'));
        }
    },
};

const createWhitelistFile = () => {
    if (!existsSync('data')) mkdirSync('data');
    writeFileSync(whitelistFile, '', { flag: 'w' });
};
