console.log('Loaded humble', window.location.href);

// chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
//     console.log(response.farewell);
// });



console.log('window.location.href', window.location.href);

if (window.location.href == 'https://www.humblebundle.com/home/keys') {
    refreshKeysAndChoices();
}


function refreshKeysAndChoices() {
    console.log('refreshKeysAndChoices');
    var choiceRows = document.getElementsByClassName("key-manager-choice-row");
    for (let choiceRow of choiceRows) {
        console.log('choiceRow in loop:', choiceRow);
        var url = choiceRow.getElementsByClassName('choice-button')[0].href
        var key = url.substr(url.lastIndexOf('/') + 1);
        var localStorageKey = 'bhc-' + key;
        var choicesRemaining = choiceRow.getElementsByTagName('b')[0].textContent;
        var storedDataString = localStorage.getItem(localStorageKey);
        try{
            let storedData = JSON.parse(storedDataString)
            if (storedData === null || !storedData.hasOwnProperty('choicesRemaining') || storedData.choicesRemaining != choicesRemaining) {
                //This key needs to be refreshed
                refreshChoice(key);
            }
        }
        catch(error){
            console.error(error);
            localStorage.removeItem(localStorageKey);
            refreshChoice(key);
        }
    }

    // //Get the first page of keys
    // console.log('refreshKeysAndChoices');

}

function refreshChoice(key) {
    console.log('refreshChoice', key);
    

    fetch('https://www.humblebundle.com/subscription/' + key)
        .then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + response.status, response);
                return new PromiseRejectionEvent();
            }
            return response.text();
        })
        .then(function (responseText) {
            console.log('refreshChoice then');
            var data = {
                key: key
            };
            var choicePage = new DOMParser().parseFromString(responseText, "text/html");
            //console.log('choicePage', choicePage);
            var choicesData = JSON.parse(choicePage.getElementById('webpack-monthly-product-data').innerText);
            console.log('choicesData', choicesData);
            console.log('extras', choicesData.contentChoiceOptions.contentChoiceData.extras);
            var choices = choicesData.contentChoiceOptions.contentChoiceData.initial.content_choices;
            console.log('choices', choices);
            var choicesMade = choicesData.contentChoiceOptions.contentChoicesMade.initial.choices_made;
            console.log('choicesMade', choicesMade);
            data.choicesRemaining = choicesData.contentChoiceOptions.contentChoiceData.initial.total_choices - choicesMade.length;
            console.log('data.choicesRemaining', data.choicesRemaining);
            var gameData = [];
            for (const property in choices) {
                console.log('property', property);
                if (choices.hasOwnProperty(property)) {
                    if (!choicesMade.includes(property)) {
                        var choice = choices[property];
                        var thisGame = {};
                        thisGame.title = choice.title;
                        thisGame.streamUrl = 'https://store.steampowered.com/app/' + choice.tpkds[0].steam_app_id;
                        thisGame.streamRating = choice.user_rating["steam_percent|decimal"] * 100;
                        console.log('thisGame', thisGame);
                        gameData.push(thisGame);
                    }
                }
            }
            data.gameData = gameData;
            var localStorageKey = 'bhc-' + key;
            localStorage.setItem(localStorageKey,JSON.stringify(data));
        });
}