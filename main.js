Events = new Meteor.Collection('events');

if (Meteor.isServer) {

	Meteor.publish('events', function publishFunction(eventId) {
		return Events.find({_id: eventId});
	});

	Events.allow({
		'update': function(userId, doc, fieldNames, modifier) {
			return true;
		},
		'insert': function(userId, doc) {
			return true;
		},
	});
}