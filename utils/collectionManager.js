let DataManager = utils.get("dataManager");
class CollectionManager {
	constructor(structName) {
		this.structName = structName;
	}
	async find(filter) {
		return new Subcollection(
			db.collection(this.structName).find(filter),
			this.structName
		);
	}
	async get(id) {
		let elManager = new DataManager(this.structName, id);
		await elManager.fetch();
		return elManager.get(id);
	}
	async set(id, prop, value) {
		let elManager = new DataManager(this.structName, id);
		await elManager.fetch();
		return elManager.set(prop, value);
	}
	async getManager(id) {
		let elManager = new DataManager(this.structName, id);
		await elManager.fetch();
		return elManager;
	}
}
class Subcollection {
	constructor(cursor, structName) {
		this.cursor = cursor;
		this.structName = structName;
	}
	forEach(cb) {
		return this._cursor.forEach(async (rawElement) => {
			let elManager = new DataManager(this.structName, rawElement.id);
			await elManager.fetch();
			return cb(elManager);
		});
	}
	async array() {
		return (await this._cursor.toArray()).map(async (rawElement) => {
			let elManager = new DataManager(this.structName, rawElement.id);
			await elManager.fetch();
			return elManager;
		});
	}
	async map(cb) {
		return await Promise.all(
			(await this.array()).map(async (rawElement) => {
				let elManager = new DataManager(this.structName, rawElement.id);
				await elManager.fetch();
				return cb(elManager);
			})
		);
	}
}
module.exports = CollectionManager;
