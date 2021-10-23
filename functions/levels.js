const { PrismaClient } = require('@prisma/client');
const { guildMemberLevels } = new PrismaClient();
module.exports = async (Discord, client) => {
  try {
    client.on('messageCreate', async (message) => {
      if (message.author.bot) return;
      if (message.guild) {
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
        const result = await guildMemberLevels
          .findFirst({
            where: {
              discordId: message.author.id,
              guildId: message.guild.id,
            },
          })
          .then(async (data) => {
            let { exp, level, requiredXp } = data;
            let neededxp = getNeededXP(level);
            if (exp >= neededxp) {
              ++level;
              exp -= neededxp;
              requiredXp = getNeededXP(level);
              message.channel.send(
                `<@${data.discordId}>, You just advanced to level ${level}`,
              );
              await guildMemberLevels.update({
                where: { id: data.id },
                data: {
                  exp: exp,
                  level: level,
                  requiredXp: requiredXp,
                },
              });
            }
          });
      }
    });
  } catch (error) {
    console.log(error);
  }
};
