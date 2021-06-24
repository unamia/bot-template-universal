exports.run = async (interaction) => {
	let roles = {
		advertiser: "855164089282461736",
		promoter: "855164120965709895",
	};
	let role = roles[interaction.options.get("role").value];
	Object.values(roles).forEach((r) => {
		if (r == role) {
			interaction.member.roles.add(r);
		} else {
			interaction.member.roles.remove(r);
		}
	});
	interaction.reply({
		content:
			"Теперь ваш аккаут получил возможности " +
			(await interaction.member.guild.roles.fetch(role)).name +
			"!",
		ephemeral: true,
	});
};
exports.public = true;
exports.description =
	"Переключить тип аккаунта (с рекламодателя на промоутера и наоборот)";
exports.options = [
	{
		type: "STRING",
		name: "role",
		description: "Выберите тип аккаунта.",
		required: true,
		choices: [
			{ name: "Рекламодатель", value: "advertiser" },
			{ name: "Промоутер", value: "promoter" },
		],
	},
];
