global.mongodb = require("mongodb");
global.Discord = require("discord.js");
global.config = require("./config");

global.assets = new Map();
global.utils = new Map();
global.commands = new Map();
global.stores = {};
const fs = require("fs-extra");

const mongoClient = new mongodb.MongoClient(config.MongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
fs.readdirSync("./assets").forEach((file) => {
	let codename = file.split(".").slice(0, -1).join(".");
	assets.set(codename, fs.readFileSync("./assets/" + file));
});
fs.readdirSync("./commands").forEach((file) => {
	let codename = file.split(".").slice(0, -1).join(".");
	let mod = require("./commands/" + file);
	[...(mod.altNames || []), codename].forEach((cn) => {
		commands.set(cn, mod);
	});
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
		ws: { intents: Discord.Intents.ALL },
	});
	await client.login(config.token);
	utils.get("servicesCore")();
	global.action = new ActionManager();
	console.log(assets.get("ascii").toString());
	console.log(`Logged in as ${client.user.tag}`);

	client.on("message", utils.get("messageHandler"));
})();
