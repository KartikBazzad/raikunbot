const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { staffMembers, banned_users, temp_Banned_users, muted_users } =
  new PrismaClient();
module.exports = async (Discord, Client, guildMember) => {
  console.log(guildMember);
};
