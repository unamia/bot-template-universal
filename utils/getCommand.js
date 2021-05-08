module.exports = (commandName, root) => {
	return commands.find((c) => {
		let [id, module] = c;
		return module.names.includes(commandName) && module.root == root;
	});
};
