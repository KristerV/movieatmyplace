Session.setDefault('isLoading', true);

createDefaultEvent = function(eventId) {
	var defaultEvent = {
		_id: eventId,
		host: {
			Name: '',
			Location: '',
			Time: '',
		}
	}

	// Events collection isn't ready right away
	Meteor.setTimeout(function(){
		Events.insert(defaultEvent);
	}, 100);
}


Meteor.startup(function () {    
	Meteor.setTimeout(function(){
		var eventId = getParams('eventId');

		if (!isset(eventId)) {
			var eventId = generateHash();
			createDefaultEvent(eventId);
		} else if (!isset(Events.findOne({_id: eventId}))) {
			// User is trying to make custom id - good!
			createDefaultEvent(eventId);
		}

		Session.set('isLoading', false);
		Session.set('eventId', eventId);
	}, 1000);
});