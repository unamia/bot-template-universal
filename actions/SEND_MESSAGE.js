module.exports = (channel, message, attachments = {}) => {
	attachments = Object.entries(attachments).map((attachment) => {
		let [name, content] = attachment;
		return new Discord.MessageAttachment(content || "", name);
	});
	clientInformation.channels.cache
		.get(channel)
		.send(message, { files: attachments });
};
