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
	}
});