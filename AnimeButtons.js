// ==UserScript==
// @author      Deathwing
// @name        Anime Website Buttons Plus
// @include     https://www.anime-planet.com/anime/*
// @include     http://myanimelist.net/anime/*
// @include     https://myanimelist.net/anime/*
// @include     https://anilist.co/anime/*
// @exclude     https://www.anime-planet.com/anime/
// @exclude     https://www.anime-planet.com/anime/all?name=*
// @exclude     https://www.anime-planet.com/anime/recommendations/*
// @description A script that adds buttons on Anime Planet, MAL and Anilist for searching various sites.
// @version     1.99(WIP)
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @grant       GM.notification
// @namespace https://greasyfork.org/users/18375
// ==/UserScript==


//Find h1
var header;
var host = document.location.host;

if (host == "www.anime-planet.com") {
    header = getHeader("#siteContainer h1");
    main();
}
else if (host == "myanimelist.net") {
    header = getHeader('#contentWrapper span span');
    main();
}
else if (host == "anilist.co") {
    function getAlHeader() {

        header = getHeader('div.content h1');

        if (header) {
            main();
        }
        else {
            setTimeout(getAlHeader, 500);
        }
    }

    getAlHeader();
}

function getHeader(atr) {
    return document.querySelector(atr);
}

function main() {

    //Cut anime name
    var animeName;

    if (document.location.host == "www.anime-planet.com") {
        animeName = getAnimeName();
    }
    else if (document.location.host == "myanimelist.net") {
        animeName = header.childNodes[0].nodeValue;
    }
    else if (document.location.host == "anilist.co") {
        animeName = getAnimeName();
    }


    function getAnimeName() {
        return header.textContent.trim();
    }


    function creteButton(icon, searchUrl, title) {
        var buttImg = document.createElement("img");
        buttImg.src = icon;
        buttImg.setAttribute("style", "width:16px;height:16px;margin-right:2px;");
        var button = document.createElement("a");
        button.href = searchUrl;
        button.target = "_blank";
        button.title = title;
        button.appendChild(buttImg);
        return button;
    }

    //Set buttons with information

    //MAL Button
    var icon = 'https://myanimelist.net/favicon.ico';
    var searchUrl = 'http://myanimelist.net/anime.php?q=' + animeName;
    var title = "Search MyAnimeList";

    var malButton = creteButton(icon, searchUrl, title);



    //Anilist Button
    icon = 'https://www.google.com/s2/favicons?domain=anilist.co';
    searchUrl = 'https://anilist.co/search/anime?search=' + animeName + '&sort=SEARCH_MATCH';
    title = "Search Anilist";

    var alButton = creteButton(icon, searchUrl, title);



    //Anime-Planet Button
    icon = 'https://www.anime-planet.com/favicon.ico';
    searchUrl = 'https://www.anime-planet.com/anime/all?name=' + animeName;
    title = "Search Anime-Planet";

    var apButton = creteButton(icon, searchUrl, title);



    //YouTube Button
    icon = 'https://www.google.com/s2/favicons?domain=youtube.com';
    searchUrl = 'https://www.youtube.com/results?search_query=' + animeName + " trailer";
    title = 'YouTube Trailer';

    var ytButton = creteButton(icon, searchUrl, title);


    //Google Images button
    icon = 'https://www.google.com/s2/favicons?domain=http://www.google.bg/';
    searchUrl = 'https://www.google.bg/search?tbm=isch&biw=&bih=&gbv=2&q=' + animeName;
    title = "Search with Google Images";

    var giButton = creteButton(icon, searchUrl, title);



    //Nyaa button
    icon = 'https://www.google.com/s2/favicons?domain=https://nyaa.si/';
    searchUrl = 'https://nyaa.si/?f=0&c=0_0&q=' + animeName;
    title = "Search Nyaa";

    var nyButton = creteButton(icon, searchUrl, title);



    //Plus button
    icon = 'https://img.favpng.com/5/16/6/computer-icons-font-awesome-symbol-png-favpng-RHypbMhS6fLtnQTPtKFLqJBdD.jpg';

    var plusButton = createHTMLElement('img', null, 'addCustomButton', [{ n: 'style', v: 'width:16px;height:16px;margin-right:2px;background:transparent;' },
    { n: 'src', v: icon }]);

    //plusButton.addEventListener('click', addButtonHandler);


    //Add Website Buttons

    if (document.location.host == "www.anime-planet.com") {
        appendButtons([malButton, alButton]);
    }
    else if (document.location.host == "anilist.co") {
        appendButtons([malButton, apButton]);
    }
    else if (document.location.host == "myanimelist.net") {
        appendButtons([apButton, alButton]);
    }


    function appendButtons(buttonsArray) {
        header.appendChild(document.createTextNode(" "));

        const otherButtons = [ytButton, giButton, nyButton, plusButton];
        const allButtons = buttonsArray.concat(otherButtons);
        allButtons.forEach(btn => {
            header.appendChild(btn);
        });
    }


    function addButtonHandler(e) {
        var popUp = getPopup();

        if (!popUp) {
            addButtonPopup();
        }

        popUp = getPopup();

        togglePopup(true);

        var buttonsDiv = popUp.querySelector('.addAndCancelButtons');
        buttonsDiv.addEventListener('click', addAndCancelButtonsHandler);
    }

    function getPopup() {
        return document.querySelector('.addButtonPopup');
    }

    function addAndCancelButtonsHandler(e) {
        var targetEl = e.target;

        if (targetEl.className === 'addButton') {
            var valuesListPromise = GM.listValues();
            valuesListPromise.then(addButtonLogic);
        }
        else if (targetEl.className === 'cancelButton') {
            togglePopup(false);
        }


    }

    function togglePopup(v) {
        var popUp = document.querySelector('.addButtonPopup');

        if (v) {
            popUp.style.display = 'block';
            popUp.style.width = '400px';
            popUp.style.height = '500px';
        }
        else {
            popUp.style.display = 'none';
            popUp.style.width = '0px';
            popUp.style.height = '0px';
        }

    }

    function addButtonLogic(valuesList) {
        var buttonTitle = document.querySelector('.titleInput');

        GM.deleteValue("Search Nyaa");
        if (valuesList.includes(buttonTitle.value)) {
            alert('Button with the same title already exists!');
        }
        else {
            var searchUrl = document.querySelector('.URLInput');
            var icon = document.querySelector('.iconInput');
            GM.setValue(buttonTitle, JSON.stringify({
                title: buttonTitle.value,
                url: searchUrl.value,
                icon: icon.value
            }));

            buttonTitle.value = '';
            searchUrl.value = '';
            icon.value = '';

            alert(`Button ${buttonTitle.value} successfully added!`);
            togglePopup(false);
        }
    }


    function addButtonPopup() {
        var style = 'margin:auto;text-align: center;display:block;margin-bottom: 5px;';
        var popUp = createHTMLElement('div', null, 'addButtonPopup', [{ n: 'style', v: 'position:absolute;display:none;top:50%;left:50%;margin-top:-250px;margin-left:-200px;background-color:white;width:0px;height:0px;box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);border-radius: 8px;' }]);
        var trueTitle = createHTMLElement('h2', 'ADD CUSTOM BUTTON', null, [{ n: 'style', v: style + 'margin-top: 20px' }])
        var title = createHTMLElement('h3', 'Title', null, [{ n: 'style', v: style + 'margin-top: 30px' }]);
        var titleInput = createHTMLElement('input', null, 'titleInput', [{ n: 'placeholder', v: 'Button title' }, { n: 'style', v: style }]);
        var URLTitle = createHTMLElement('h3', 'Search URL', null, [{ n: 'style', v: style + 'margin-top: 20px' }]);
        var URLDescr = createHTMLElement('div', 'To get the search URL first go the site you want to add and search the term "ANIMENAME" in the search field. Then copy the full URL (including http://) in the field below.', null, [{ n: 'style', v: style + 'margin-left: 15px;margin-right: 15px;font-size: 90%;font-family: monospace;' }]);
        var URLInput = createHTMLElement('input', null, 'URLInput', [{ n: 'placeholder', v: 'Search URL' }, { n: 'style', v: style + 'width:80%' }]);
        var iconTitle = createHTMLElement('h3', 'Icon URL', null, [{ n: 'style', v: style + 'margin-top: 20px' }]);
        var iconDescr = createHTMLElement('div', 'Link to icon for the button. The easiest way to get it is to copy this link "https://www.google.com/s2/favicons?domain=" and place the website url at the end (example: https://www.google.com/s2/favicons?domain=myanimelist.net).', null, [{ n: 'style', v: style + 'margin-left: 15px;margin-right: 15px;font-size: 90%;font-family: monospace;' }]);
        var iconInput = createHTMLElement('input', null, 'iconInput', [{ n: 'placeholder', v: 'Icon URL' }, { n: 'style', v: style + 'width:80%' }]);
        var buttonsDiv = createHTMLElement('div', null, 'addAndCancelButtons', [{ n: 'style', v: style + 'bottom:10px;position:absolute;width:100%' }]);
        var buttStyle = 'width:70px;margin:5px';
        var addButton = createHTMLElement('button', 'ADD', 'addButton', [{ n: 'style', v: buttStyle }]);
        var cancelButton = createHTMLElement('button', 'CANCEL', 'cancelButton', [{ n: 'style', v: buttStyle }]);

        appendChildren(buttonsDiv, [addButton, cancelButton]);
        appendChildren(popUp, [trueTitle, title, titleInput, URLTitle, URLDescr, URLInput, iconTitle, iconDescr, iconInput, buttonsDiv]);
        var html = document.querySelector('html');
        html.appendChild(popUp);
    }

    function createHTMLElement(tag, textContent, className, attributes) {
        var element = document.createElement(tag);

        if (className) {
            element.className = className;
        }
        if (textContent) {
            element.textContent = textContent;
        }
        if (attributes) {
            attributes.forEach((a) => {
                element.setAttribute(a.n, a.v);
            })
        }

        return element;
    }

    function appendChildren(element, children) {
        children.forEach((c) => {
            element.appendChild(c);
        })
    }

}
