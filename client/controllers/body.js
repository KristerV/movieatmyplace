Template.body.helpers({
	isLoading: function(){
		return Session.get('isLoading');
	},
	isPopup: function(){
		return isset(Session.get('editData')) ? true : false;
	},
	youtubeImage: function() {
		var url = Session.get('topTrailer');
		if (!isset(url))
			return false;
		var image = "http://img.youtube.com/vi/"+getYoutubeId(url)+"/0.jpg";
		return image;
	},
	youtubePlayerReady: function() {
		return Session.get('youtubePlayer') ? true : false;
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
	_host: function() {
			return Events.findOne({_id: Session.get('eId')}).host['Host'];
	},
	location: function() {
			return Events.findOne({_id: Session.get('eId')}).host['Location'];
	},
	time: function() {
			return Events.findOne({_id: Session.get('eId')}).host['Time'];
	},
});