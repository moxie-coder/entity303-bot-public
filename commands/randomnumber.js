const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('randomnumber')
		.setDescription('Shows latency for the bot'),
	async execute(interaction) {
        await interaction.reply(`Here's a random number: ${Math.floor(Math.random() * 101)}`);
	},
};