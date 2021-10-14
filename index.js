const Discord = require('discord.js');
const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config();
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_BANS,
  ],
});

client.events = new Collection();
client.commands = new Collection();

['eventshandler', 'commandhandler'].forEach((handler) => {
  require(`./handlers/${handler}`)(client, Discord);
});

client.on('messageCreate', async (message) => {
  const user = message.guild.members.cache.get(message.author.id);
  if (user.permissions.has(['ADMINISTRATOR'])) {
    console.log('true');
  } else {
    console.log(false);
  }
  // const user = message.mentions.members.first();
  // message.guild.channels.cache.map((ch) => {
  //   ch.permissionOverwrites.edit(user.id, {
  //     CONNECT: true,
  //     SEND_MESSAGES: true,
  //     VIEW_CHANNEL: true,
  //   });
  // });
  // console.log('Changed permissions for user');
  // const banAuditLogs = await message.guild.fetchAuditLogs({
  //   type: 'MEMBER_BAN_ADD',
  // });
  // const bans = await message.guild.bans.fetch();
  // console.log(bans.size);
  // bans.map((user) => console.log(user.user, user.reason));
  // const userArray = [];
  // banAuditLogs.entries.first()
  // banAuditLogs.entries.map((x) => {
  //   const { executor, target } = x;
  //   userArray.push(x);
  // });
  // console.log(userArray);
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
