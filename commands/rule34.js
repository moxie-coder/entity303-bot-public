const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const Booru = require('booru')
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// my plan was to have them all in one place, but nevermind that since it gives errors when I try to
module.exports = {
	data: new SlashCommandBuilder()
	.setName('rule34')
    .setDescription('Gets a image from Rule34.xxx')
    .addStringOption(option => option.setName('tags').setDescription('Tags for the image').setRequired(true))
    .addStringOption(option => option.setName('tags2').setDescription('2nd optional tags for the image').setRequired(false))
    .setDMPermission(true),
	async execute(interaction) {
        const channels = ['nsfw', 'nsfw2', 'nsfw3', 'areas-corner'];
        // let areaChannel = client.channels.cache.get('1181805691829239849');
        if (interaction.guild != null){
            let channel = channels.filter(chan => chan === interaction.channel.name);
            console.log(channel);
            console.log(channel[0] === interaction.channel.name);
            console.log(interaction.channel.name === channel[0]);
            if (interaction.channel.name === channel[0] || interaction.channel.nsfw)
            {
                await interaction.deferReply()
                if (interaction.options.get('tags') == null) // this apparently was possible
                    return interaction.editReply('The tags must not be blank or invalid!');

                Booru.search('rule34', [interaction.options.get('tags').value, interaction.options.get('tags2') != null ? interaction.options.get('tags2').value : ''], {random: true})
                    .then(posts => {
                        if (posts.length == 0)
                            return interaction.editReply('Could not find image for specified tags/failed to locate image, make sure you typed your tags correctly and try again');
                        for (let post of posts){
                            interaction.editReply(post.fileUrl)
                        }
                    })
            }
            else {
                return interaction.reply(`This is not a NSFW channel. :warning: Please enter a NSFW channel to use this command.`);
            }
        }
        else{
            // same thing, had to do it this way since discord.js is a cunt
            await interaction.deferReply()
            if (interaction.options.get('tags') == null) // this apparently was possible
                return interaction.editReply('The tags must not be blank or invalid!');

            Booru.search('rule34', [interaction.options.get('tags').value, interaction.options.get('tags2') != null ? interaction.options.get('tags2').value : ''], {random: true})
                .then(posts => {
                    if (posts.length == 0)
                        return interaction.editReply('Could not find image for specified tags/failed to locate image, make sure you typed your tags correctly and try again');
                    for (let post of posts){
                        interaction.editReply(post.fileUrl)
                    }
                },
                (fail) => {
                    interaction.editReply('An error occured! ' + fail);
                }
            );
        }
	},
};