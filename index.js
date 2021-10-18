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
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_INVITES,
  ],
});

client.events = new Collection();
client.commands = new Collection();

['eventshandler', 'commandhandler'].forEach((handler) => {
  require(`./handlers/${handler}`)(client, Discord);
});

const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { staffMembers, banned_users, guilds, temp_Banned_users, muted_users } =
  new PrismaClient();
const ms = require('ms');

client.on('messageCreate', async (message) => {});

client.on('guildMemberRemove', async (member) => {
  const fetchKickLogs = await member.guild.fetchAuditLogs({
    type: 'MEMBER_KICK',
    limit: 10,
  });
  const { executor, target } = fetchKickLogs.entries
    .filter((x) => x.target.id === member.user.id)
    .first();
});
client.on('ready', async () => {
  console.log(`Bot: ${client.user.username} is ready`);
});

client.login(process.env.BOT_TOKEN);

// client.on('guildMemberAdd', async (member) => {
//   try {
//     const guild = await guilds.findUnique({
//       where: { guildId: member.guild.id },
//     });
//     const muted = await muted_users.findFirst({
//       where: { discordId: member.user.id, guildId: member.guild.id },
//     });

//     if (muted) {
//       const muteRole = member.guild.roles.cache.find(guild.muteRole);
//       if (muteRole) {
//         member.roles.add(muteRole.id);
//       }
//       member.guild.channels.cache.map((ch) => {
//         ch.permissionOverwrites.edit(user.id, {
//           CONNECT: false,
//           SEND_MESSAGES: false,
//           VIEW_CHANNEL: true,
//         });
//       });
//       if (muted.duration) {
//         setTimeout(() => {
//           member.guild.channels.cache.map((ch) => {
//             ch.permissionOverwrites.edit(user.id, {
//               CONNECT: true,
//               SEND_MESSAGES: true,
//               VIEW_CHANNEL: true,
//             });
//           });
//           member.roles.remove(muteRole.id);
//         }, ms(muted.duration));
//       }
//     }

//     const bannedUser = await banned_users.findFirst({
//       where: { discordId: member.user.id, guildId: member.guild.id },
//     });
//     if (bannedUser) {
//       const reason = 'Banned previously';
//       const bannedBy = await staffMembers.findUnique({
//         where: { id: bannedUser.bannedBy },
//       });
//       const staffUser = client.users.cache.get(bannedBy.discordId);
//       member.ban({ reason }).then(() => {
//         if (guild.logChannel !== null) {
//           const embed = new MessageEmbed()
//             .setAuthor(
//               member.user.username + member.user.discriminator,
//               member.user.displayAvatarURL(),
//             )
//             .setTitle('Member Banned Again')
//             .setDescription(
//               'User was banned previously by ' +
//                 staffUser.username +
//                 staffUser.discriminator,
//             )
//             .addField(
//               'Banned On',
//               '`' + bannedUser.createdAt.toLocaleDateString() + '`',
//             );
//           const logChannel = member.guild.channels.cache.get(guild.logChannel);
//           if (logChannel) {
//             logChannel.send({ embeds: [embed] });
//           }
//         }
//       });
//       return;
//     }
//     const tempbanned = await temp_Banned_users.findFirst({
//       where: { discordId: member.user.id, guildId: member.guild.id },
//     });
//     if (tempbanned) {
//       const reason = 'The user was Banned temporarily previously';
//       const bannedBy = await staffMembers.findUnique({
//         where: { id: tempbanned.bannedBy },
//       });
//       const staffUser = client.users.cache.get(bannedBy.discordId);
//       member.ban({ reason: reason }).then(() => {
//         if (tempbanned.duration) {
//           const embed = new MessageEmbed()
//             .setAuthor(
//               member.user.username + member.user.discriminator,
//               member.user.displayAvatarURL(),
//             )
//             .setTitle('Member Banned Again')
//             .setDescription(
//               'User was banned previously by ' +
//                 staffUser.username +
//                 staffUser.discriminator,
//             )
//             .addField('Previous Reason', tempbanned.reason)
//             .addField(
//               'Banned On',
//               '`' + bannedUser.createdAt.toLocaleDateString() + '`',
//             );
//           if (guild.logChannel !== null) {
//             const logChannel = member.guild.channels.cache.get(
//               guild.logChannel,
//             );
//             if (logChannel) {
//               logChannel.send({ embeds: [embed] });
//             }
//           }
//           setTimeout(() => {
//             member.guild.members.unban(member.id);
//           }, ms(tempbanned.duration));
//         }
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });
