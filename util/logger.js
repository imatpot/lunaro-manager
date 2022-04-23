module.exports = {
    log: (message) => {
        const now = new Date();

        const hh = now.getHours().toString().padStart(2, '0');
        const mm = now.getMinutes().toString().padStart(2, '0');
        const ss = now.getSeconds().toString().padStart(2, '0');

        const timestamp = `[${hh}:${mm}:${ss}]`;
        console.log(`${timestamp} ${message}`);
    },
};
