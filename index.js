let Discord = require("discord.js");
global.mongodb = require("mongodb");
global.Discord = Discord;
global.config = require("./config");

global.assets = new Map();
global.utils = new Map();
global.commands = [];
global.stores = {};
const fs = require("fs-extra");
const path = require("path");
const mongoClient = new mongodb.MongoClient(config.MongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
fs.readdirSync("./assets").forEach((file) => {
	let codename = file.split(".").slice(0, -1).join(".");
	assets.set(codename, fs.readFileSync("./assets/" + file));
});
fs.readdirSync("./utils").forEach((file) => {
	let codename = file.split(".").slice(0, -1).join(".");
	utils.set(codename, require("./utils/" + file));
});

(async () => {
	let ActionManager = utils.get("actionManager");
	await mongoClient.connect();
	global.db = mongoClient.db(config.database);
	utils.get("djsExtend")();

	global.client = new Discord.Client({
		intents: Discord.Intents.ALL,
	});
	client.slashCommands = new Discord.Collection();
	await client.login(config.token);
	utils.get("registerCommands")(null, path.join(__dirname, "./commands/"));
	utils.get("servicesCore")();
	global.action = new ActionManager();

	console.log(`Logged in as ${client.user.tag}`);

	client.on("message", utils.get("messageHandler"));

	client.on("interaction", (interaction) => {
		({
			APPLICATION_COMMAND: async () => {
				client.slashCommands.get(interaction.commandID).run(interaction);
			},
		}[interaction.type]());
	});
})();
