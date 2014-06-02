if (isset(getParams('eventId')))
	Session.set('eventId', getParams('eventId'))
else {
	Session.set('eventId', generateHash())
	var defaultEvent = {
		_id: Session.get('eventId'),
		host: {
			name: '',
			location: '',
			date: '',
			time: '',
		},
	}

	Meteor.setTimeout(function(){
		Events.insert(defaultEvent);
	}, 100);
}
