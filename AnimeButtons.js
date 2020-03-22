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
// @version     1.04
// @grant       none
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

        const otherButtons = [ytButton, giButton, nyButton];
        const allButtons = buttonsArray.concat(otherButtons);
        allButtons.forEach(btn => {
            header.appendChild(btn);
        });
    }

}
