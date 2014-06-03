Template.share.helpers({
	sharelink: function() {
		var link = document.URL.split('?')[0] + '?eventId=' + Session.get('eventId');
		return link;
	}
});