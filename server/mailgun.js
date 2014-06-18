process.env['MAILGUN_API_KEY'] = "key-1talxhfv0icwp3725e5yjgf2jx0wp792";
process.env['MAILGUN_DOMAIN'] = "movieatmyplace.com";
process.env['MAILGUN_API_URL'] = "https://api.mailgun.net/v2";

/*var app = __meteor_bootstrap__.app
var connect = Meteor.require('connect');
var connectRoute = Meteor.require('connect-route');
var Fiber = Meteor.require('fibers');
var crypto = Meteor.require('crypto');

app = connect();

var router = connectRoute(function(route)
{
	route.post('/mailgun/receive', function(req, res)
	{
		var raw_post_body = "";
		var post_data = [];

		req.on('data', function (chunk) {
			raw_post_body += chunk.toString();
		});

		req.on('end', function () {
				pairs = raw_post_body.split('&');
				for(var i = 0; i < pairs.length; i++) {
					kv = pairs[i].split('=');
					post_data[kv[0]]=decodeURIComponent((kv[1]+'').replace(/\+/g, '%20'));
				}

				//Verify sender is Mailgun
				var sig = crypto.createHmac('sha256', process.env.MAILGUN_API_KEY).update(post_data['timestamp']+post_data['token']).digest('hex');
				if(sig !== post_data['signature']) {
					res.writeHead(403);
					res.end();
				}
				else {
					Fiber(function() {
							res.writeHead(200);
							res.end();
					}).run();
				}
		});
	});
});

app.use(router);*/

Meteor.startup(function () {

	Meteor.methods({
		sendEmail: function (to, subject, body) {

			this.unblock();

			Meteor.http.post(process.env.MAILGUN_API_URL + '/' + process.env.MAILGUN_DOMAIN + '/messages', 
				{
					auth:"api:" + process.env.MAILGUN_API_KEY,
					params: {"from":"Movie Place at My Place <info@movieatmyplace.com>",
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
		}
	});
});
