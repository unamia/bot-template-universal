const { APIMessage, Structures } = require("discord.js");
module.exports = () => {
	class Message extends Structures.get("Message") {
		async inlineReply(options) {
			const mentionRepliedUser =
				typeof ((options || content || {}).allowedMentions || {})
					.repliedUser === "undefined"
					? true
					: (options || content).allowedMentions.repliedUser;
			delete ((options || content || {}).allowedMentions || {}).repliedUser;

			const apiMessage =
				content instanceof APIMessage
					? content.resolveData()
					: APIMessage.create(this.channel, { options }).resolveData();
			Object.assign(apiMessage.data, {
				message_reference: { message_id: this.id },
			});

			if (
				!apiMessage.data.allowed_mentions ||
				Object.keys(apiMessage.data.allowed_mentions).length === 0
			)
				apiMessage.data.allowed_mentions = {
					parse: ["users", "roles", "everyone"],
				};
			if (typeof apiMessage.data.allowed_mentions.replied_user === "undefined")
				Object.assign(apiMessage.data.allowed_mentions, {
					replied_user: mentionRepliedUser,
				});

			if (Array.isArray(apiMessage.data.content)) {
				return Promise.all(
					apiMessage
						.split()
						.map((x) => {
							x.data.allowed_mentions = apiMessage.data.allowed_mentions;
							return x;
						})
						.map(this.inlineReply.bind(this))
				);
			}

			const { data, files } = await apiMessage.resolveFiles();
			return this.client.api.channels[this.channel.id].messages
				.post({ data, files })
				.then((d) => this.client.actions.MessageCreate.handle(d).message);
		}
	}
	class Guild extends Structures.get("Guild") {
		get data() {
			let DataManager = utils.get("dataManager");
			return new DataManager("guildData", this.id);
		}
		get settings() {
			let DataManager = utils.get("dataManager");
			return new DataManager("guildSettings", this.id);
		}
	}
	class GuildMember extends Structures.get("GuildMember") {
		get data() {
			let DataManager = utils.get("dataManager");
			return new DataManager("memberData", this.guild.id, this.user.id);
		}
	}
	class User extends Structures.get("User") {
		get data() {
			let DataManager = utils.get("dataManager");
			return new DataManager("userData", this.id);
		}
	}
	Structures.extend("Message", () => Message);
	Structures.extend("Guild", () => Guild);
	Structures.extend("GuildMember", () => GuildMember);
	Structures.extend("User", () => User);
};
