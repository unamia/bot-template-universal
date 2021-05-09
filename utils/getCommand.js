module.exports = (commandName, root) => {
	let cm = commands.find((c) => {
		let [id, module] = c;
		return module.names.includes(commandName) && module.root == root;
	});
	return cm ? cm[1] : null;
};
