exports.run = async (interaction) => {
	if (!config.admins.includes(interaction.user.id)) {
		return;
	}
	let code = interaction.options.get("code").value;
	let res;
	try {
		res = eval(code);

		res = await res;
	} catch (e) {
		res = e;
	}
	if (String(res) == "[object Object]") {
		res = JSON.stringify(res);
	}
	interaction.reply({ content: "```" + res + "```", ephemeral: true });
};
exports.userPerms = [];
exports.perms = [];
exports.description = `[Dev only] execute code`;
exports.usage = "";
exports.public = false;
exports.options = [
	{
		type: "STRING",
		name: "code",
		description: "Code to execute",
		required: true,
	},
];
