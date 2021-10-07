const Discord = require('discord.js');
const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config();
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.events = new Collection();
client.commands = new Collection();

['eventshandler', 'commandhandler'].forEach((handler) => {
  require(`./handlers/${handler}`)(client, Discord);
});

// client.on('messageUpdate', (oldMessage, NewMsg) => {
//   console.log({ oldMessage, NewMsg });
// });

client.on('ready', async () => {
  console.log(`Bot: ${client.user.username} is ready`);
});

client.login(process.env.BOT_TOKEN);
