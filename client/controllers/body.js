Template.body.helpers({
	isLoading: function(){
		return Session.get('isLoading');
	},
	isPopup: function(){
		return isset(Session.get('editData')) ? true : false;
	},
	youtubeImage: function() {
		var url = 'https://www.youtube.com/watch?v=QJ-TwPHs-Ss';
		var results = url.match("[\?&amp;]v=([^&amp;#]*)");
		var vid = ( results === null ) ? url : results[1];
		var image = "http://img.youtube.com/vi/"+vid+"/0.jpg";
		return image;
	}
});