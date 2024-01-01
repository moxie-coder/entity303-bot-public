const { SlashCommandBuilder, Guild, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('membercount')
		.setDescription('Gets the number of members'),
	async execute(interaction) {
        // let memberCount = message.guild.members.cache.filter(member => !member.user.bot).size;
        // let totalCount = message.guild.memberCount;
        // let botCount = message.guild.members.cache.filter(member => member.user.bot).size;

        try {
            await interaction.guild.fetch();
        }
        catch (e){
            return await interaction.reply('Failed to fetch member count, error: ' + e);
        }
		await interaction.reply(`Total members is ${interaction.guild.approximateMemberCount} members`);
	},
};