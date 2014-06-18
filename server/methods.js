Meteor.methods({
	editHashesEqual: function(eventId, editHash) {
		var Event = Events.findOne({_id: eventId});
		var eventHash = Event.editHash;
		if (eventHash == editHash)
			return true;
		else
			return false;
	},
	youtubeApi: function(search) {
		YoutubeApi.videos.list('id', {
		    "part": "id",
		    "maxResults": 5,
		    "q": search,
		    "key":"AIzaSyD9lR2v8mh4C7dCgvCNsEDSwovIwEoqPPs"
		}, function (err, data) {
		    console.log(err, data);
		});
	}
});