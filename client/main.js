var eventId = getParams('eventId');

if (isset(eventId)){

	// Get event from DB
	Session.set('eventId', eventId);
} else {

	// Create new event
	Session.set('eventId', generateHash())

	var defaultEvent = {
		_id: Session.get('eventId'),
		host: {
			name: '',
			location: '',
			date: '',
			time: '',
		}
	}

	// Events isn't ready right away
	Meteor.setTimeout(function(){
		Events.insert(defaultEvent);
	}, 100);
}
