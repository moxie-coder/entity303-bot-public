const { Client, SlashCommandBuilder, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Shows latency for the bot'),
	async execute(interaction) {
		await interaction.reply(`Pong! \n${Date.now() - interaction.createdTimestamp} ms.`);
	},
};