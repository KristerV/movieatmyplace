Meteor.startup(function () {

	Meteor.methods({
		sendEmailEditLink: function (to, eventId) {

			this.unblock();

			var editHash = Events.findOne({_id: eventId}).editHash;
			var editLink = "http://movieat.mp/?eId=" + eventId + "&edit=" + editHash;
			var subject = 'Your movie event edit link';
			var body = '<p>Hi!</p>\
			<br>\
			<p>You can edit your movie event here: <a href="' + editLink + '">' + editLink + '</a></p>\
			<br>\
			<p>Have a good time,</p>\
			<p>MovieBot</p>';

			Meteor.http.post(process.env.MAILGUN_API_URL + '/' + process.env.MAILGUN_DOMAIN + '/messages', 
				{
					auth:"api:" + process.env.MAILGUN_API_KEY,
					params: {"from":"Movie at My Place <info@movieatmyplace.com>",
						"to":[to],
						"subject":subject,
						"html": body,
					}
				},
				function(error, result) {
					if(error){ console.log("Error: " + error)}

					console.log(result);
				}
			);
		},
		emailFeedback: function (body, eventId) {

			this.unblock();
			var eventLink = "http://movieat.mp/?eId=" + eventId;

			var subject = 'movieatmyplace.com quick feedback';

			Meteor.http.post(process.env.MAILGUN_API_URL + '/' + process.env.MAILGUN_DOMAIN + '/messages', 
				{
					auth:"api:" + process.env.MAILGUN_API_KEY,
					params: {"from":"Movie at My Place <info@movieatmyplace.com>",
						"to":['krister.viirsaar@gmail.com'],
						"subject":subject,
						"html": body,
					}
				},
				function(error, result) {
					if(error){ console.log("Error: " + error)}

					console.log(result);
				}
			);
		},
	});
});
