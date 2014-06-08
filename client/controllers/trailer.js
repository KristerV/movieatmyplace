Template.trailer.helpers({
	youtubeHash: function() {
		return getYoutubeId(Session.get('youtubePlayer'));
	}
});

Template.trailer.events({
});