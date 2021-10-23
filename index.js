const Discord = require('discord.js');
const { Client, Intents, Collection } = require('discord.js');
const levels = require('./functions/levels');
require('dotenv').config();
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_INVITES,
  ],
});

client.events = new Collection();
client.commands = new Collection();

['eventshandler', 'commandhandler'].forEach((handler) => {
  require(`./handlers/${handler}`)(client, Discord);
});
client.on('ready', async () => {
  console.log(`Bot: ${client.user.username} is ready`);
  levels(Discord, client);
});

client.login(process.env.BOT_TOKEN);
