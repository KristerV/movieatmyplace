Template.body.helpers({
	isLoading: function(){
		return Session.get('isLoading');
	},
	isPopup: function(){
		return isset(Session.get('editData')) ? true : false;
	},
	coverImage: function() {
		var url = Session.get('topTrailer');
		console.log(url);
		if (!isset(url))
			return false;
		$.backstretch(url);
		return url;
	},
	youtubePlayer: function() {
		return isset(Session.get('youtubeTerms')) ? true : false;
	},
	anyMovies: function() {
		var Event = Events.findOne({_id: Session.get('eId')}, {sort: {'movies.$.votesSum': -1}});
		if (isset(Event)) {
			return isset(Event['movies']) ? true : false;
		}
	},
	isEditMode: function() {
		return Session.get('editMode');
	},
	name: function() {
		var Event = Events.findOne({_id: Session.get('eId')});
		if (!Event)
			return false;
		var info = Event.host['Name'];
		return info ? info : 'Somebody';
	},
	phone: function() {
		var Event = Events.findOne({_id: Session.get('eId')});
		if (!Event)
			return false;
		var info = Event.host['Phone nr'];
		return info ? ' (' + info + ')' : '';
	},
	location: function() {
		var Event = Events.findOne({_id: Session.get('eId')});
		if (!Event)
			return false;
		var info = Event.host['Location'];
		return info ? ' at ' + info : '';
	},
	time: function() {
		var Event = Events.findOne({_id: Session.get('eId')});
		if (!Event)
			return false;
		var info = Event.host['Time'];
		return info ? ', ' + info : '';
	},
	friendsAddMovies: function() {
		if (!Session.get('editMode')) {
			var Event = Events.findOne({_id: Session.get('eId')});

			if (!Event)
				return false;

			return Event.host['friendsAddMovies'];
		} else
			return true;
	},
	friendsInvite: function() {
		if (!Session.get('editMode')) {
			var Event = Events.findOne({_id: Session.get('eId')});

			if (!Event)
				return false;

			return Event.host['friendsInvite'];
		} else
			return true;
	}
});