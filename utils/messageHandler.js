module.exports = async (message) => {
	if (message.author.bot) {
		return;
	}
	if (message.guild) {
		let dataManager = utils.get("dataManager");
		message.guild.settings = new dataManager("guildSettings", message.guild.id);
		await message.guild.settings.fetch();
		utils.get("commandHandler")(message);
	} else {
	}
};
