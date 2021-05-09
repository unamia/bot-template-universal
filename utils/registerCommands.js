let fs = require("fs-extra"),
	path = require("path");
module.exports = async function registerCommands(root, dir) {
	return await Promise.all(
		fs.readdirSync(dir, { withFileTypes: true }).map(async (fse) => {
			let cid = utils.get("idMaker")("cmd");
			let nameFromFile = fse.name.split(".");
			nameFromFile = (nameFromFile.length > 1
				? nameFromFile.slice(0, -1)
				: nameFromFile
			).join(".");
			let command = {};
			command.root = root;

			command.names = [nameFromFile];
			command.id = cid;
			command.userPerms = [];
			command.botPerms = [];
			command.description = null;
			command.usage = null;
			if (fse.isDirectory()) {
				let subcommands = await registerCommands(cid, path.join(dir, fse.name));

				let replyEmbed = new Discord.MessageEmbed()
					.setColor("BLUE")
					.setTitle(`Subcommands of ${nameFromFile}`);
				subcommands.forEach((sc) => {
					replyEmbed.addField(sc.names[0], sc.description, true);
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
