module.exports = {
  name: 'ping',
  permissions: ['SEND_MESSAGES'],
  description: `Check Bot's ping`,
  execute(message, args, cmd, client, Discord) {
    message.channel.send(`Websocket heartbeat: ${client.ws.ping}ms.`);
    message.channel.send('Pinging...').then((sent) => {
      sent.edit(
        `Roundtrip latency: ${
          sent.createdTimestamp - message.createdTimestamp
        }ms`,
      );
    });
  },
};
