class DataManager {
	constructor(structName, ...ids) {
		this.structName = structName;
		this.id = ids.join("_");
		if (!stores[this.structName]) {
			stores[this.structName] = new Map();
		}
		this._store = stores[this.structName].get(this.id);
	}
	async fetch() {
		if (stores[this.structName].get(this.id)) {
			this._store = stores[this.structName].get(this.id);
		} else {
			let fetchedFromDb = await db
				.collection(this.structName)
				.findOne({ id: this.id });

			if (!fetchedFromDb) {
				let template = JSON.parse(
					assets.get(`${this.structName}Default`).toString()
				);
				template.id = this.id;
				fetchedFromDb = await db
					.collection(this.structName)
					.insertOne(template);
				let _id = fetchedFromDb.insertedId;
				fetchedFromDb = { ...fetchedFromDb.ops[0], _id };
			}

			let prettied = new Map(Object.entries(fetchedFromDb));
			this._store = prettied;

			stores[this.structName].set(this.id, this._store);
		}
	}
	get(prop) {
		return this._store.get(prop);
	}
	set(prop, value) {
		this._store.set(prop, value);
		stores[this.structName].set(this.id, this._store);
		db.collection(this.structName).updateOne(
			{ id: this.id },
			{ $set: { [prop]: value } }
		);
		return this._store.get(prop);
	}
}
module.exports = DataManager;
