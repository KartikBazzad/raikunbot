const Discord = require('discord.js');
const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config();
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

client.events = new Collection();
client.commands = new Collection();

['eventshandler', 'commandhandler'].forEach((handler) => {
  require(`./handlers/${handler}`)(client, Discord);
});

client.on('messageCreate', (message) => {
  // const online = message.guild.presences.cache.size;
  // const user = message.guild.members.cache.get(
  //   message.mentions.members.first().id,
  // );
  // const roles = [];
  // user.roles.cache.map((key) => {
  //   if (key.name === '@everyone') return;
  //   roles.push(key.id);
  //   user.roles.remove(key.id);
  // });
  // user.roles.add('896715607888764928');
  // console.log(user.roles.cache.toJSON());
  // console.log(roles.join('|'));
  // message.guild.channels.cache.size;
  // const Textchannels = message.guild.channels.cache.filter(
  //   (c) => c.type === 'GUILD_TEXT',
  // ).size;
  // const voice = message.guild.channels.cache.filter(
  //   (c) => c.type === 'GUILD_VOICE',
  // ).size;
  // const category = message.guild.channels.cache.filter(
  //   (c) => c.type === 'GUILD_CATEGORY',
  // ).size;
  // console.log(client.application.id);
  // console.log({ Textchannels, voice, category });
});

client.on('ready', async () => {
  console.log(`Bot: ${client.user.username} is ready`);
});

client.login(process.env.BOT_TOKEN);
