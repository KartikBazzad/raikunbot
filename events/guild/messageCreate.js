require('dotenv').config;
const { PrismaClient } = require('@prisma/client');
const { members, staffMembers } = new PrismaClient();
const cooldowns = new Map();
module.exports = async (Discord, client, message) => {
  const prefix = process.env.PREFIX;
  if (message.author.bot) return;
  try {
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
