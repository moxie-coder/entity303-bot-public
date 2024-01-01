const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { token } = require('./config.json');

const cooldown = new Set();
const cooldownTime = 5000;

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		if (cooldown.has(interaction.user.id)){
			// when the cooldown didn't end
			interaction.reply({content: "Please wait for the cooldown to end, this is so we don't reach the rate limit.", ephemeral: true});
		} else {
			await command.execute(interaction);

			// set the cooldown
			cooldown.add(interaction.user.id);
			setTimeout(() => {
				// removes the cooldown from the user
				cooldown.delete(interaction.user.id);
			}, cooldownTime);
		}
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
    }    
	console.log(interaction);
});

client.on('ready', () => {
    console.log('Bot is ready');

    // client.user.setStatus('invisible');
    client.user.setPresence({
        activities: [{ name: `Minecraft`, type: ActivityType.Playing }],
        status: 'idle',
    });
});


client.login(token);