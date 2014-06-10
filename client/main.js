// Redirect to long url if short
var url = getDomain();
if (url[0].indexOf("movieat.mp") > -1)
	window.location.replace("http://movieatmyplace.com/?" + url[1]);

// Hide content while still loading site
Session.setDefault('isLoading', true);

// Generate userId if none
if (!isset(localStorage.getItem("userId")))
	localStorage.setItem("userId", generateHash());

// An empty event with all necessary details
createDefaultEvent = function(eventId) {
	Events.insert({
		_id: eventId,
		host: {
			Host: '',
			Location: '',
			Time: '',
		}
	});
}


// When meteor starts up
Meteor.startup(function () {

	// Check if database is ready in interval
	var interval = Meteor.setInterval(function(){
		if (typeof Events != 'undefined' && isset(Events.findOne())) {
			var eventId = getParams('eId');

			if (!isset(eventId)) {

				// If no event id in GET, generate one
				var eventId = generateHash();
				createDefaultEvent(eventId);

			} else if (!isset(Events.findOne({_id: eventId}))) {

				// EventId is in GET, but not in database
				// User is trying to make custom id - good!
				createDefaultEvent(eventId);
			}

			// Remove loading screen
			Session.set('isLoading', false);

			// Save eventid for later
			Session.set('eId', eventId);

			// Stop interval
			Meteor.clearInterval(interval);
		}
	}, 50);
});
