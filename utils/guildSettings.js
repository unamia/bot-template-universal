class GuildSettings {
	constructor(id) {
		this.id = id;
	}
	async fetch() {
		if (stores.guildSettings.get(this.id)) {
			this._store = stores.guildSettings.get(this.id);
		} else {
			let fetchedFromDb = await db
				.collection("guildSettings")
				.findOne({ id: this.id });

			if (!fetchedFromDb) {
				let template = JSON.parse(
					assets.get("guildSettingsDefault").toString()
				);
				template.id = this.id;
				fetchedFromDb = await db
					.collection("guildSettings")
					.insertOne(template);
				let _id = fetchedFromDb.insertedId;
				fetchedFromDb = { ...fetchedFromDb.ops[0], _id };
			}

			let prettied = new Map(Object.entries(fetchedFromDb));
			this._store = prettied;

			stores.guildSettings.set(this.id, this._store);
		}
	}
	get(prop) {
		return this._store.get(prop);
	}
	set(prop, value) {
		this._store.set(prop, value);
		stores.guildSettings.set(this.id, this._store);
		db.collection("guildSettings").updateOne(
			{ id: this.id },
			{ $set: { [prop]: value } }
		);
		return this._store.get(prop);
	}
}
module.exports = GuildSettings;
