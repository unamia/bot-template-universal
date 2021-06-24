let fs = require("fs-extra"),
	path = require("path");
const config = require("../config");
module.exports = async function registerCommands(root, dir) {
	await client.application.commands.set([]);
	await Promise.all(
		fs.readdirSync(dir, { withFileTypes: true }).map(async (fse) => {
			let name = fse.name.split(".");
			name = (name.length > 1 ? name.slice(0, -1) : name).join(".");
			let command = {
				root,
				name,
				perms: [],
				options: [],
				userPerms: [],
				description: "Description placeholder",
				public: true,
				...require(path.join(dir, fse.name)),
			};

			client.slashCommands.set(name, command);
			return command;
		})
	);
	client.slashCommands = new Discord.Collection(
		await Promise.all(
			(
				await client.application.commands.set(
					client.slashCommands.map((command) => {
						return {
							name: command.name,
							description: command.description,
							options: command.options,
							defaultPermission: command.public,
						};
					}),
					"855149762399698964"
				)
			).map(async (slashCommand) => {
				let command = client.slashCommands.find(
					(c) => c.name == slashCommand.name
				);
				command.slash = slashCommand;
				command.id = slashCommand.id;
				await command.slash.setPermissions(
					[
						...command.perms,
						...config.admins.map((admin) => ({
							id: admin,
							type: "USER",
							permission: true,
						})),
					],
					config.systemGuild
				);
				return [command.id, command];
			})
		)
	);

	return;
};
