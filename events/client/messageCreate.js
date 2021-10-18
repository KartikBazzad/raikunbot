const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { members, guildMemberLevels } = new PrismaClient();
module.exports = async (Discord, client, message) => {
  if (message.author.bot) return;
  try {
    let xpToAdd = Math.floor(Math.random() * 15) + 1;
    let getNeededXP = (level) => level * level * 100;
    const user = await guildMemberLevels.updateMany({
      where: { discordId: message.author.id, guildId: message.guild.id },
      data: {
        exp: {
          increment: xpToAdd,
        },
      },
    });
    const result = await guildMemberLevels.findFirst({
      where: {
        discordId: message.author.id,
        guildId: message.guild.id,
      },
    });
    let { exp, level, requiredXp } = result;
    let neededxp = getNeededXP(level);
    if (exp >= neededxp) {
      ++level;
      exp -= neededxp;
      requiredXp = getNeededXP(level);
      message.channel.send(
        `<@${result.discordId}>, You just advanced to level ${level}`,
      );
      await guildMemberLevels.update({
        where: { id: result.id },
        data: {
          exp: exp,
          level: level,
          requiredXp: requiredXp,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
