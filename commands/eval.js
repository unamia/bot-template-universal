exports.run = async (message, args) => {
	console.log(args);
	if (!config.admins.includes(message.author.id)) {
		return;
	}
	let code = args.join(" ");
	let res;
	try {
		res = eval(`(async ()=>{${code}})()`);

		res = await res;
	} catch (e) {
		res = e;
	}
	if (String(res) == "[object Object]") {
		res = JSON.stringify(res);
	}
	message.inlineReply(
		new Discord.MessageEmbed().setDescription("```" + res + "```")
	);
};
exports.userPerms = [];
exports.botPerms = [];
exports.description = `Command that tells about other commands`;
exports.usage = "";
