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
	editHash = generateHash();

	Events.insert({
		_id: eventId,
		editHash: editHash,
		host: {
			Name: '',
			'Phone nr': '',
			Location: '',
			Time: '',

		}
	});
	return editHash;
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
		var getEditHash = getParams('edit');
		var newEvent = false;


		// Must be new event
		if (!isset(eventId)) {
			newEvent = true;
			var eventId = generateHash();
		}

		// Create default event if needed
		if (!isset( Events.findOne({_id: eventId}) )) {
			var editHash = createDefaultEvent(eventId);

			// So the user does not lose session when server updates files
			var url = getDomain();
			window.history.replaceState( {} , 'movieatmyplace', getDomain() + "?eId=" + eventId + "&edit=" + editHash );
		}

		// Need to subscribe a second time with correct eventId
		if (newEvent)
			Meteor.subscribe('events', eventId);

		// if editHash present, go to edit mode
		else if (isset(getEditHash)) {
			Meteor.call('editHashesEqual', eventId, getEditHash, function(error, result){
				if (result)
					Session.set('editMode', true);
			});
		}

		// Save eventid for later
		Session.set('eId', eventId);
		
		// Remove loading screen
		Session.set('isLoading', false);
	});
}, 50);

// Save interval ID to cancel it later
Session.set('newEventInterval', interval);

// Disable automatic reload on file change, if autocomplete active
Meteor._reload.onMigrate(function(reloadFunction) {
	if (isset(Session.get('movieSearch'))) {
		Deps.autorun(function(c) {
			if (!isset(Session.get('movieSearch'))) {
				c.stop();
				reloadFunction();
			}
		});
		return [false];
	} else {
		return [true];
	}
});
