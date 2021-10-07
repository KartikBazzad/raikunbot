const { PrismaClient } = require('@prisma/client');
const { banned_users } = new PrismaClient();
module.exports = async (Discord, Client, guildMember) => {
  try {
    console.log(guildMember);
  } catch (error) {}
};
