Template.outro.events({
	'click #about': function(e, tmpl) {
		if ( $( "#outro-hidden" ).is( ":hidden" ) ) {
			$( "#outro-hidden" ).css({'display': 'flex', 'color': 'rgba(0,0,0,0.5)'});
			$('#outro-hidden a').css({'color': 'rgba(0,0,0,0.5)', 'border-bottom': '1px solid rgba(0,0,0,0.5)'});
			var bottom = $(document).height() - $(window).height();
			var outroTop = $('.outro').offset().top + 5;
			var scrolltop = bottom < outroTop ? bottom : outroTop;
			$('html,body').animate({scrollTop: scrolltop}, 1000);
			$('.section:last-child').removeClass("with-background-image");
			$('.section:last-child').addClass("no-background-image");
			// $('.section:last-child').css({'background-color': 'rgba(230,230,230,0.9)'});
		} else {
			// $('.section:last-child').css({'background-color': 'transparent'});
			$( "#outro-hidden" ).css({'color': 'transparent'});
			$('#outro-hidden a').css({'color': 'transparent', 'border-bottom': '1px solid rgba(0,0,0,0)'});
			$( "#outro-hidden" ).slideUp(1000);
			if ($('.backstretch').length > 0) {
				$('.section:last-child').removeClass("no-background-image");
				$('.section:last-child').addClass("with-background-image");
			}
		}
	},
	'blur form[name=quickFeedback], submit form[name=quickFeedback]': function(e, tmpl) {
		e.preventDefault();
		var data = getFormData('form[name=quickFeedback]');
		if (!isset(data['body']))
			return false;
		var body = data.body;
		Meteor.call('emailFeedback', body, Session.get('eventId'));
		$('form[name=quickFeedback] input').prop('value', '').prop('placeholder', 'Sending...')
		Meteor.setTimeout(function(){
			$('form[name=quickFeedback] input').prop('placeholder', 'Sent. Thanks!')

			Meteor.setTimeout(function(){
				$('form[name=quickFeedback] input').prop('placeholder', 'Quick feedback...')
			}, 900)
		}, 1200)
	}
});