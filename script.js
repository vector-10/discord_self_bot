require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
const { Client: BotClient, GatewayIntentBits } = require("discord.js");

// Define multiple bot instances, each with a single user token
const botInstances = [
  {
    botToken: process.env.BOT_TOKEN,
    recipientUserId: process.env.RECIPIENT_USER_ID,
    userToken: process.env.USER_TOKEN,
    email: process.env.EMAIL,
  },
];

// Function to initialize a bot client
const initializeBot = ({ botToken, recipientUserId, userToken, email }) => {
  const botClient = new BotClient({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
  });

  botClient.once("ready", () => {
    console.log(`Bot logged in as ${botClient.user.tag}`);
  });

  botClient.login(botToken).catch((error) => {
    console.error("Bot failed to log in:", error);
  });

  const client = new Client();

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag} on account ${email}!`);
  });

  client.on("guildMemberAdd", async (member) => {
    try {
      // const welcomeMessage = `Welcome <@${member.user.id}> (${member.user.tag} / ${member.user.id}) to **${member.guild.name}**!`;
      const welcomeMessage = `Hello <@${member.user.id}> with name ${member.user.tag} and ID (${member.user.id}) just joined **${member.guild.name}**!`;
    const channel = await botClient.channels.fetch(process.env.CHANNEL_ID);
    await channel.send(welcomeMessage);
    console.log(`Sent message to channel for ${member.user.tag}`);
    } catch (error) {
      console.error(`Failed to send DM for ${email}:`, error);
    }
  });

  client.login(userToken).catch((error) => {
    console.error(`Failed to log in with token for account ${email}:`, error);
  });
};

// Loop through all bot instances and initialize them
botInstances.forEach(initializeBot);
