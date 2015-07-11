var express = require('express'),
	router = express.Router(),
	twss = require('twss');

var paragraphToSentences = function(str) {
	var re = /[^\r\n.!?]+(:?(:?\r\n|[\r\n]|[.!?])+|$)/gi;
	var arr = str.match(re);
	return arr === null ? [] : arr;
}

/* GET home page. */
router.get(
	'/',
	function(req, res, next) {
		res.render(
			'index',
			{ 'title' : 'Did she say that?' }
		);
	}
);

router.get(

	'/sentence/:sentence',

	function(req, res, next) {

		var result = {
			'sheSaidThat' : false,
			'probability' : 0,
			'error' : null
		};

		if(typeof req.params.sentence != "string") {
			result.error = "Your 'sentence' parameter was invalid or missing.";
		} else if(req.params.sentence.length < 3) {
			result.error = "Your 'sentence' parameter was too short.";
		} else if(req.params.sentence.length > 250) {
			result.error = "Your 'sentence' parameter was too long.";
		} else {
			result.sheSaidThat = twss.is(req.params.sentence);
			result.probability = twss.probability(req.params.sentence);
		}

		res.json(result);
		res.end();

	}

);

router.get(

	'/paragraph/:paragraph',

	function(req, res, next) {

		var result = {
			'error' : null,
			'sentences' : []
		};

		if(typeof req.params.paragraph != "string") {
			result.error = "Your 'paragraph' parameter was invalid or missing.";
		} else if(req.params.paragraph.length < 3) {
			result.error = "Your 'paragraph' parameter was too short.";
		} else if(req.params.paragraph.length > 5000) {
			result.error = "Your 'paragraph' parameter was too long.";
		} else {
			var sentences = paragraphToSentences(req.params.paragraph);
			for(var s = 0; s < sentences.length; s++) {
				if(!twss.is(sentences[s]))
					continue;
				result.sentences.push(
					{	'sentence' : sentences[s],
						'probability' : twss.probability(sentences[s])
					}
				);
			}
		}

		res.json(result);
		res.end();

	}

);

module.exports = router;