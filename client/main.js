if (isset(getParams('eventId'))) // Get event from DB
	Session.set('eventId', getParams('eventId'))
else { // Create new event
	Session.set('eventId', generateHash())
	var defaultEvent = {
		_id: Session.get('eventId'),
		host: {
			name: '',
			location: '',
			date: '',
			time: '',
		},
		films: []
	}

	Meteor.setTimeout(function(){
		Events.insert(defaultEvent);
	}, 100);
}
