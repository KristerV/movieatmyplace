Template.share.helpers({
	sharelink: function() {
		var link = 'movieat.mp/?eId=' + Session.get('eId');
		return link;
	}
});