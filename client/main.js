Session.setDefault('isLoading', true);
if (!isset(localStorage.getItem("userId")))
	localStorage.setItem("userId", generateHash());

createDefaultEvent = function(eventId) {
	Events.insert({
		_id: eventId,
		host: {
			Name: '',
			Location: '',
			Time: '',
		}
	});
}


Meteor.startup(function () {
	count = 0;
	var interval = Meteor.setInterval(function(){
		count++;
		if (typeof Events != 'undefined' && isset(Events.findOne())) {
			var eventId = getParams('eId');

			if (!isset(eventId)) {
				var eventId = generateHash();
				createDefaultEvent(eventId);
			} else if (!isset(Events.findOne({_id: eventId}))) {
				// User is trying to make custom id - good!
				createDefaultEvent(eventId);
			}

			Session.set('isLoading', false);
			Session.set('eId', eventId);
			Meteor.clearInterval(interval);
		}
	}, 50);
});
