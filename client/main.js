// Redirect to long url if short
var url = getDomain();
if (url[0].indexOf("movieat.mp") > -1)
	window.location.replace("http://movieatmyplace.com/?" + url[1]);

// Set some site wide variables
Session.setDefault('isLoading', true);
Session.setDefault('movieSearch', false);
Session.setDefault("editMode", false);

// Generate userId if none
if (!isset(localStorage.getItem("userId")))
	localStorage.setItem("userId", generateHash());

// An empty event with all necessary details
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

// Parse event id
var eventId = getParams('eId');
Session.set("eId", eventId);

var interval = Meteor.setInterval(function(){
	
	// Interval checks if Events is ready
	if (!isset(Events))
		return false;
	else
		Meteor.clearInterval(Session.get('newEventInterval'));

	// When collection is actually ready
	Meteor.subscribe('events', eventId, function(){
		var eventId = Session.get("eId");
		var newEvent = false;

		// Must be new event
		if (!isset(eventId)) {
			newEvent = true;
			var eventId = generateHash();
		}

		// Create default event if needed
		if (!isset( Events.findOne({_id: eventId}) )) {
			newEvent = true;
			createDefaultEvent(eventId);
			Session.set("editMode", true);
		}

		// Need to subscribe a second time with correct eventId
		if (newEvent)
			Meteor.subscribe('events', eventId);

		// Save eventid for later
		Session.set('eId', eventId);
		
		// Remove loading screen
		Session.set('isLoading', false);
	});
}, 50);

// Save interval ID to cancel it later
Session.set('newEventInterval', interval);