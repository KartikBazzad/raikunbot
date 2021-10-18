require('dotenv').config;
const { PrismaClient } = require('@prisma/client');
const { members, staffMembers, guildMemberLevels, guilds, users } =
  new PrismaClient();
const cooldowns = new Map();
module.exports = async (Discord, client, message) => {
  try {
    const guild = await guilds.findUnique({
      where: { guildId: message.guild.id },
    });
    if (!guild) {
      const fetchlogs = await message.guild
        .fetchAuditLogs({ type: 'BOT_ADD' })
        .entries.filter((log) => log.target.id === client.application.id)
        .first();
      const { executor, target } = fetchlogs;
      const user = await users.findUnique({
        where: { discordId: fetchlogs.executor.id },
      });
      if (!user) {
        const createNewUser = await users.create({
          data: {
            discordId: fetchlogs.executor.id,
            discordTag: executor.username + executor.discriminator,
            avatar: executor.avatar,
            discriminator: executor.discriminator,
          },
        });
      }
      const newguild = await guilds.create({
        data: {
          guildId: message.guild.id,
          guildName: message.guild.name,
          invitedBy: executor.id,
        },
      });
    }
    if (message.author.bot) return;
    const prefix = process.env.PREFIX;
    const finduser = await members.findUnique({
      where: {
        discordId: message.author.id,
      },
    });

    if (!finduser) {
      const newuser = await members.create({
        data: {
          discordId: message.author.id,
          discordTag: `${message.author.username}#${message.author.discriminator}`,
          discriminator: message.author.discriminator,
        },
      });
      const findUserLevels = await guildMemberLevels.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });
      if (!findUserLevels) {
        const newUserLevels = await guildMemberLevels.create({
          data: { discordId: message.author.id, guildId: message.guild.id },
        });
      }
    }
    const findUserLevels = await guildMemberLevels.findFirst({
      where: { discordId: message.author.id, guildId: message.guild.id },
    });
    if (!findUserLevels) {
      const newUserLevels = await guildMemberLevels.create({
        data: { discordId: message.author.id, guildId: message.guild.id },
      });
    }
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command =
      client.commands.get(cmd) ||
      client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

    if (!command) return;
    if (command.guildOnly && message.channel.type === 'dm') {
      return message.reply(`I can't execute that command inside DMs!`);
    }
    // if (command.staff) {
    //   const staff = await staffMembers.findFirst({
    //     where: { discordId: message.author.id, guildId: message.guild.id },
    //   });

    //   if (!staff)
    //     return message.reply('You are not authorized to use this Command');
    // }
    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;
      if (command.usage) {
        reply += `\nThe proper usage would be:\`${prefix}${command.name} ${command.usage}\` `;
      }
      return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }
    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = command.cooldown * 1000;

    if (time_stamps.has(message.author.id)) {
      const expiration_time =
        time_stamps.get(message.author.id) + cooldown_amount;
      if (current_time < expiration_time) {
        const time_left = (expiration_time - current_time) / 1000;
        return message.reply(
          `please wait ${time_left.toFixed(1)} more seconds before using ${
            command.name
          } command`,
        );
      }
    }

    time_stamps.set(message.author.id, current_time);
    setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);
    try {
      command.execute(message, args, cmd, client, Discord);
    } catch (error) {
      message.reply('there was an error in executing this command!');
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};
