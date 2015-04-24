exports.definition = {
	config: {
		debug: false,
		adapter: {
			type: 'restapi',
			collection_name: 'feed'
		},
		headers: {
			'Content-Type': 'application/json'
		},
		parentNode: 'bookmarks'
	},
	extendModel: function(Model){
		_.extend(Model.prototype, {});
		return Model;
	},
	extendCollection: function(Collection){
		_.extend(Collection.prototype, {});
		return Collection;
	}
}