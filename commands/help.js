const { SlashCommandBuilder } = require('@discordjs/builders');
const { log } = require('../util/logger');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('🎓 Learn how to use Lunaro Tracker'),

    run: async (interaction) => {
        const message =
            "Hi, I'm the Lunaro Tracker. My job is to ensure people are aware of active Lunaro players.\n\n" +
            "I am equipped with slash commands to make input easy and intuitive. Let's see what I can do.\n\n" +
            'First of all, a server admin needs to enable the tracker. They can obviously also disable it later on. The tracker runs once per minute.\n' +
            '```/tracker enable\n/tracker disable```\n' +
            'However, tracking is opt-in. You need to allow Lunaro Tracker to watch your activity. You can opt-out at any time.\n' +
            '```/tracker allow\n/tracker deny```\n' +
            'You can obviously still manage your RTP status yourself.\nThe `tracking` parameter is optional and makes it easier to manage tracking when managing manually.\n' +
            '```/rtp join [tracking: bool]\n/rtp leave [tracking: bool]```\n' +
            'You can also quickly check how many players are ready to play.\n' +
            '```/tracker scan```\n' +
            'Some basic stats are also publicly accessible.\n' +
            '```/info```\n' +
            'Look at my source code on GitHub and contribute to it via pull requests or issues.\n' +
            '```/source```\n' +
            "And that's about it. Now go out there and make Teshin proud!";

        interaction.reply(message);

        log('Member asked for help.');
    },
};
