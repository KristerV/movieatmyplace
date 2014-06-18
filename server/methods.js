Meteor.methods({
	editHashesEqual: function(eventId, editHash) {
		var Event = Events.findOne({_id: eventId});
		var eventHash = Event.editHash;
		if (eventHash == editHash)
			return true;
		else
			return false;
	}
});