$('.choice-button').each(function (e) {
	console.log(this.href);
	$.get(this.href, function (choicePageHtml) {
		console.log('loaded: ' + choicePageHtml.length);
		var choicePage = $($.parseHTML(choicePageHtml, document, true));
		console.log(choicePage);
		var choicesData = JSON.parse(choicePage.filter('#webpack-monthly-product-data')[0].innerText);
		console.log(choicesData);
		console.log('extras', choicesData.contentChoiceOptions.contentChoiceData.extras);
		var choices = choicesData.contentChoiceOptions.contentChoiceData.initial.content_choices;
		console.log('choices', choices);
		var choicesMade = choicesData.contentChoiceOptions.contentChoicesMade.initial.choices_made;
		console.log('choicesMade', choicesMade);
		for (const property in choices) {
			console.log('property', property);
			if (choices.hasOwnProperty(property)) {
				var choice = choices[property];
				console.log(property, choice.title);
				console.log('https://store.steampowered.com/app/' + choice.tpkds[0].steam_app_id);
				console.log('steam rating:', choice.user_rating["steam_percent|decimal"] * 100 + '%');
				if (choicesMade.includes(property)) {
					console.log('redeamed', choice.tpkds[0].redeemed_key_val);
				}
			}
		}
	});
});
