module.exports = async function registerCommands(root, dir) {
	return await Promise.all(
		fs.readdirSync(dir, { withFileTypes: true }).map(async (fse) => {
			let cid = utils.get("idMaker")("cmd");
			let command = {};
			command.root = root;
			command.names = [fse.name.split(".").slice(0, -1).join(".")];
			command.id = cid;
			command.userPerms = [];
			command.botPerms = [];
			command.description = null;
			command.usage = null;
			if (fse.isDirectory()) {
				let subcommands = await registerCommands(cid, path.join(dir, fse.name));

				let replyEmbed = new Discord.MessageEmbed();
				subcommands.forEach((sc) => {
					replyEmbed.addField(sc.name, sc.description, true);
				});
				command.run = async (message, args) => {
					message.inlineReply(replyEmbed);
				};
			} else {
				let mod = require(path.join(dir, fse.name));
				command.names = [...command.names, ...(fse.altNames || [])];
				command = { ...command, ...mod };
			}
			commands.push([cid, command]);
			return command;
		})
	);
};
