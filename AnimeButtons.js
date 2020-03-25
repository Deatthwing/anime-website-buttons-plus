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
// @version     2.05
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.listValues
// @grant       GM.deleteValue
// @namespace https://greasyfork.org/users/18375
// ==/UserScript==


//Find h1
var header;
var host = document.location.host;
var malHost = 'myanimelist.net';
var apHost = 'www.anime-planet.com';
var alHost = 'anilist.co';

if (host === apHost) {
    header = getHeader("#siteContainer h1");
    main();
}
else if (host === malHost) {
    header = getHeader('#contentWrapper span span');
    main();
}
else if (host === alHost) {
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


var hideList = [];

function main() {

    //Cut anime name
    var animeName;

    if (host === apHost) {
        animeName = getAnimeName();
    }
    else if (host === malHost) {
        animeName = header.childNodes[0].nodeValue;
    }
    else if (host === alHost) {
        animeName = getAnimeName();
    }


    function getAnimeName() {
        return header.textContent.trim();
    }


    function creteButton(icon, searchUrl, title) {
        var buttImg = createHTMLElement("img", null, null, [{ n: 'style', v: 'width:16px;height:16px;margin-right:2px;' }, { n: 'src', v: icon }]);
        var button = createHTMLElement("a", null, 'animeButton', [{ n: 'id', v: `animeButton${makeButtonId(title)}` },
        { n: 'href', v: searchUrl }, { n: 'target', v: "_blank" }, { n: 'title', v: title }]);
        button.appendChild(buttImg);
        return button;
    }

    //Set buttons with information

    var buttonCounter = 0;

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
    icon = 'https://www.google.com/s2/favicons?domain=www.google.com/';
    searchUrl = 'https://www.google.bg/search?tbm=isch&biw=&bih=&gbv=2&q=' + animeName;
    title = "Search with Google Images";

    var giButton = creteButton(icon, searchUrl, title);


    //Nyaa button
    icon = 'https://www.google.com/s2/favicons?domain=nyaa.si/';
    searchUrl = 'https://nyaa.si/?f=0&c=0_0&q=' + animeName;
    title = "Search Nyaa";

    var nyButton = creteButton(icon, searchUrl, title);
    header.addEventListener('mouseover', showEditButton);
    header.addEventListener('mouseout', hideEditButton);


    //Edit button
    icon = 'https://previews.dropbox.com/p/thumb/AAs_uEIlA0XGqQKA3-9SaVvSNTEfLD9T59ZRlYGPzHmrabhLYbrFL_7v07jrFvFwmHhfCyYTmwFjeC-00XVF7LE4zkSnA7q1f_dvUrhH-M9rDEL7ZaqzQLC_2lO3oxevjm235o8NS3R3-fBVijSrtHcdKgG_0B3FnCEYM5LHkvZO6P0HbrQQ2gmwo4m4JE4EbD44oSCMXcGqy0kU5kzBtKFgbP57Cv-k9HHw3SnNNsFiPC9HGRIiYA9PhCAjxFzy8gRFJlWwR5V7iIJJq9-ImQ_FLxlX_bn27k7IexLJvWHaf4UmK3nifCisIb0oMVUeyBfBhXd04kIVfmwFnwXgjnud/p.png?size=2048x1536&size_mode=3';
    title = "Edit Custom Buttons";

    var editButtonImg = createHTMLElement('img', null, 'editButton', [{ n: 'src', v: icon }, { n: 'title', v: title },
    { n: 'style', v: 'width:16px;height:16px;display:none;' }]);
    var editButton = createHTMLElement('div', null, null, [{ n: 'style', v: 'width:16px;height:16px;margin-right:2px;display:inline;padding-right:16px;' }]);
    editButton.appendChild(editButtonImg);

    editButton.addEventListener('click', editButtonHandler);


    const customButtons = [];
    const customButtonsObj = [];

    var valuesListPromise = GM.listValues();
    valuesListPromise.then(getCustomButtons);

    function appendCustomButtons(customButtonsObj) {
        customButtonsObj.forEach((b) => {
            customButtons.push(creteButton(b.icon, b.url.replace('ANIMENAME', animeName), b.title));
        })
        startAppending();
    }


    //Add Website Buttons
    function startAppending() {
        if (host === apHost) {
            appendButtons([malButton, alButton]);
        }
        else if (host === alHost) {
            appendButtons([malButton, apButton]);
        }
        else if (host === malHost) {
            appendButtons([apButton, alButton]);
        }
    }

    function appendButtons(buttonsArray) {
        header.appendChild(document.createTextNode(" "));

        const otherButtons = [ytButton, giButton, nyButton];
        const allButtons = buttonsArray.concat(otherButtons, customButtons, editButton);

        allButtons.forEach((b) => {
            if (b.id !== '') {
                hideList.push({ bId: b.id, h: 'show' })
            }
        });

        getHideList();
        appendChildren(header, allButtons);
    }

    function getHideList() {
        var promise = GM.getValue('hideList', '[]');

        promise.then((v) => {
            var localVal = JSON.parse(v);

            concatHideList(localVal);
            hideButtons();
            addButtonPopup();
        });
    }

    function concatHideList(v) {
        v.forEach(b => {
            var item = hideList.find(n => n.bId === b.bId);
            if (item) { return Object.assign(item, b); }
            hideList.push(b);
        });
    }


    function getCustomButtons(values) {
        values.forEach(async (n) => {
            if (n !== 'hideList') {
                customButtonsObj.push(JSON.parse(await GM.getValue(n)));
            }
        });

        checkIfDataReady();
    }

    function checkIfDataReady() {
        if (customButtonsObj.length > 0) {
            appendCustomButtons(customButtonsObj);
        }
        else {
            setTimeout(checkIfDataReady, 300);
        }
    }

    function hideButtons() {
        hideList.forEach((o) => {
            var button = document.querySelector(`#${o.bId}`);

            if (button) {
                if (o.h === 'show') {
                    button.style.display = '';
                }
                else if (o.h === 'hide') {
                    button.style.display = 'none';
                }
            }
        });
    }

    function makeButtonId(buttonName) {
        var result = 0;
        for (var i = 0; i < buttonName.length; i++) {
            result += buttonName.charCodeAt(i);
        }

        result *= buttonName.charCodeAt(0);

        return result;
    }


    function editButtonHandler(e) {
        togglePopup(true);
    }

    function getPopup() {
        return document.querySelector('.buttonPopup');
    }

    function showEditButton() {
        var editButton = document.querySelector('.editButton');
        editButton.style.display = '';
        editButton.parentElement.style.paddingRight = '0px';
    }

    function hideEditButton() {
        var editButton = document.querySelector('.editButton');
        editButton.style.display = 'none';
        editButton.parentElement.style.paddingRight = '16px';
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
        else if (targetEl.className === 'deleteButton') {
            GM.deleteValue(document.querySelector('.titleInput').value)
            togglePopup(false);
        }


    }

    function addAndEditTabButtonsHandler(e) {
        var target = e.target;

        if (target.className.includes('Text')) {
            target = e.target.parentElement;
        }

        if (target.className === 'addTab' && target.style.color === 'white') {
            var editTab = target.parentElement.children[1];
            hideTabSection(editTab, target);
        }
        else if (target.className === 'editTab' && target.style.color === 'white') {
            var addTab = target.parentElement.firstElementChild;
            hideTabSection(addTab, target);
        }
    }

    function hideTabSection(toHide, toShow) {
        toHide.style.color = 'white';
        toHide.style.backgroundColor = '#d8d8d8';
        toShow.style.color = 'black';
        toShow.style.backgroundColor = 'white';

        var sectionToHide;
        var sectionToShow;

        if (toHide.className === 'addTab') {
            sectionToHide = document.querySelector('.addSection');
            sectionToShow = document.querySelector('.editSection');
        }
        else {
            sectionToHide = document.querySelector('.editSection');
            sectionToShow = document.querySelector('.addSection');
        }

        sectionToHide.style.display = 'none';
        sectionToHide.style.height = '0%';
        sectionToHide.style.width = '0%';
        sectionToShow.style.display = 'block';
        sectionToShow.style.height = '100%';
        sectionToShow.style.width = '100%';
    }

    function togglePopup(v) {
        var popUp = getPopup();

        if (v) {
            popUp.style.opacity = '1';
            popUp.style.top = '50%';
        }
        else {
            popUp.style.opacity = '0';
            popUp.style.top = '-100%';
        }
    }

    function addButtonLogic(valuesList) {
        var titleField = document.querySelector('.titleInput');
        var searchField = document.querySelector('.URLInput');
        var iconField = document.querySelector('.iconInput');

        if (titleField.value === '') {
            toggleMsgBox(true, 'Title cannot be empty!', false);
        }
        else if (searchField.value === '') {
            toggleMsgBox(true, 'Search URL cannot be empty!', false);
        }
        else if (valuesList.includes(titleField.value)) {
            toggleMsgBox(true, 'Button with the same name already exists!', false);
        }
        else {
            if (iconField.value === '') {
                var regex = /(?:https?:\/\/)(w{0,3}\.?\w+\.\w+)\//;

                if (regex.test(searchField.value)) {
                    iconField.value = `https://www.google.com/s2/favicons?domain=${searchField.value.match(regex)[1]}`;
                }
            }

            GM.setValue(titleField.value, JSON.stringify({
                title: titleField.value,
                url: searchField.value,
                icon: iconField.value
            }));

            titleField.value = '';
            searchField.value = '';
            iconField.value = '';

            /*
            var animeButtonsList = document.querySelector('.buttonsList');
            
            createAndAppendEditListEntry(animeButtonsList, [button], 6);
            
            header.insertBefore(button, editButton);
            */

            toggleMsgBox(true, `Button ${titleField.value} added succsessfully! Reload to see it!`, true);

            var button = creteButton(iconField.value, searchField.value, titleField.value);
            hideList.push({ bId: button.id, h: 'show' });
            GM.setValue('hideList', JSON.stringify(hideList));
        }
    }

    function toggleMsgBox(toggle, msg, showReload) {
        var msgBox = document.querySelector('.addMsgBox');

        if (msg) {
            msgBox.firstElementChild.textContent = msg;
        }

        if (showReload) {
            msgBox.children[1].style.display = 'inline';
        }
        else {
            msgBox.children[1].style.display = 'none';
        }

        if (toggle) {
            msgBox.style.opacity = '1';
            msgBox.style.bottom = '15%';
        }
        else {
            msgBox.style.opacity = '0';
            setTimeout(() => { msgBox.style.bottom = '150%'; }, 250);
        }
    }

    function hideAndDeleteHandler(e) {
        var target = e.target;
        var buttPrent = target.parentElement;
        var button = document.querySelector(`#${buttPrent.className}`);

        if (target.className === "removeButton") {
            button.remove();
            target.parentElement.remove();
            GM.deleteValue(buttPrent.textContent);
            hideList = hideList.filter(obj => obj.bId !== button.id);

            GM.setValue('hideList', JSON.stringify(hideList));
        }
        else if (target.className === 'hideButton') {
            if (button.style.display === 'none') {
                button.style.display = '';
                concatHideList([{ bId: button.id, h: 'show' }]);
                target.setAttribute('src', iconEye);
            }
            else {
                button.style.display = 'none';
                concatHideList([{ bId: button.id, h: 'hide' }]);
                target.setAttribute('src', iconEyeGray);
            }

            GM.setValue('hideList', JSON.stringify(hideList));

            hideButtons();
        }
    }

    function msgButtonsHandler(e) {
        var target = e.target;

        if (target.className === 'reloadButton') {
            location.reload();
        }
        else if (target.className === 'closeButton') {
            toggleMsgBox(false);
        }
    }

    var iconEyeGray = 'https://previews.dropbox.com/p/thumb/AAuWCCOL6JyGmMweL1F-_5DiAS2zJYRa5Lir0SbwC5DvS_0nQEwjuJvONWL8a5aBxxvBhMbmATHXk6HOq_p16qq_FCjHezpZK-WG59CrRBfTl2mY7-e1lE-Ce2r1JEgpQFmo0LllAXnpcbeH7-68AxkfuMN4g6ChfpHCoaX7r9YH8MCQVu01ect1cCdqHDYlJBqgRWUrbTjwrlIlV9Y545Eldz5Xp948EIoHnNVeov_ybS2u-oGDZWwFtN5FLGCtJTyXK2sLylpQ8cvH7DVl0DAVcGO0YF6_RqIwbCpt-yCS58gfClH3lTEmPKunqrBwfNQe0SxXvyXTr-1GbCDiP_Lq/p.png?size=2048x1536&size_mode=3';

    var iconEye = 'https://previews.dropbox.com/p/thumb/AAvAf0hVyAwc9SRprGbA731CezYJ5amifW_2ApUxlRa0i98WlQoS13M3EQNGLv9kNTHsle6RsiUTlNZPtimWZM1ccs4i0orerrn0SwuPcsaGnU0cKho2IWWE-mEAhhoh779w04r8yWqJrAZZcYiy1mLZINV6SKIRq797-RW0gsZXZ8tgvcWa_nIAF2cpttnklJ93I0h2FFtmlrdX7WCzUBo2eML71mGMfRebI4b9wYnfFNT_77xWPeA1RoOaFLkYBKWF3wIsfnSCVGjodq_yHC6xjJJ2mwSbiRxuTO0glpiiT0AGN3hUTD0th5IbY5EPF-R4H1zPJMnPScAKax9RlrW5/p.png?fv_content=true&size_mode=5';


    function addButtonPopup() {
        var style = 'margin:auto;text-align: center;display:block;margin-bottom: 5px;';
        var popUp = createHTMLElement('div', null, 'buttonPopup', [{ n: 'style', v: 'position:absolute;top:-100%;left:50%;margin-top:-280px;margin-left:-200px;background-color:white;width:400px;height:560px;box-shadow: 0 0 15px rgba(0, 0, 0, 0.4);border-radius: 8px;font-size:medium;z-index:9999;opacity:0;transition: all 0.7s cubic-bezier(0.45, -0.24, 0.43, 1.14) 0s;' }]);

        var tabs = createHTMLElement('div', null, 'popupTabs', [{ n: 'style', v: 'width: 100%;height: 40px;' }]);
        var addTab = createHTMLElement('div', null, 'addTab', [{ n: 'style', v: 'height: 100%;width: 50%;background-color: white;left: 50%;border-top-left-radius: 8px;text-align: center;transition: all 0.2s linear 0s;' }]);
        var textTabsStyle = 'position: relative;top: 11px;font-weight: bold;';
        var addTabText = createHTMLElement('div', 'ADD', 'addTabText', [{ n: 'style', v: textTabsStyle }]);
        addTab.appendChild(addTabText);

        var editTab = createHTMLElement('div', null, 'editTab', [{ n: 'style', v: 'top: -40px;height: 100%;width: 50%;background-color: #d8d8d8;left: 50%;position: relative;border-top-right-radius: 8px;text-align: center;color: white;transition: all 0.2s linear 0s;' }]);
        var editTabText = createHTMLElement('div', 'EDIT', 'editTabText', [{ n: 'style', v: textTabsStyle }]);
        editTab.appendChild(editTabText);

        appendChildren(tabs, [addTab, editTab]);

        var addSection = createHTMLElement('div', null, 'addSection', [{ n: 'style', v: 'height:100%;width:100%;' }]);
        var addSectionTitle = createHTMLElement('h2', 'ADD CUSTOM BUTTON', null, [{ n: 'style', v: style + 'margin-top: 25px' }]);
        var title = createHTMLElement('h3', 'Title', null, [{ n: 'style', v: style + 'margin-top: 20px' }]);
        var titleInput = createHTMLElement('input', null, 'titleInput', [{ n: 'placeholder', v: 'Button title' }, { n: 'style', v: style }]);
        var URLTitle = createHTMLElement('h3', 'Search URL', null, [{ n: 'style', v: style + 'margin-top: 20px' }]);
        var URLDescr = createHTMLElement('div', 'To get the search URL first go the site you want to add and search the term "ANIMENAME" in the search field. Then copy the full URL (including http://) in the field below. (exaple: https://myanimelist.net/search/all?q=ANIMENAME)', null, [{ n: 'style', v: style + 'margin-left: 15px;margin-right: 15px;font-size: 90%;font-family: monospace;' }]);
        var URLInput = createHTMLElement('input', null, 'URLInput', [{ n: 'placeholder', v: 'Search URL' }, { n: 'style', v: style + 'width:80%' }]);
        var iconTitle = createHTMLElement('h3', 'Icon URL', null, [{ n: 'style', v: style + 'margin-top: 20px' }]);
        var iconDescr = createHTMLElement('div', null, null, [{ n: 'style', v: style + 'margin-left: 15px;margin-right: 15px;font-size: 90%;font-family: monospace;' }]);
        iconDescr.innerHTML = '(<b>Leave empty for automatic icon parse</b>)<br />Link to icon for the button. <br />The easiest way to get it is to copy this link "https://www.google.com/s2/favicons?domain=" and place the website url at the end (example: https://www.google.com/s2/favicons?domain=myanimelist.net).';
        var iconInput = createHTMLElement('input', null, 'iconInput', [{ n: 'placeholder', v: 'Icon URL' }, { n: 'style', v: style + 'width:80%' }]);

        var msgBoxDiv = createHTMLElement('div', null, 'addMsgBox', [{ n: 'style', v: 'width: 86%;position: absolute;margin-left: 7%;bottom: 150%;background-color: white;border-radius: 8px;box-shadow: rgba(0,0,0, 0.4) 0px 0px 15px;text-align: center;transition: opacity 0.2s linear;opacity:0' }]);
        var msgText = createHTMLElement('div', 'Button added succsessfully! Reload to see it!', 'addMgsText', [{ n: 'style', v: 'margin: 10px;' }]);
        var reloadButton = createHTMLElement('button', 'RELOAD', 'reloadButton', [{ n: 'style', v: 'margin: 10px;margin-right:0px;width:90px;' }]);
        var closeButton = createHTMLElement('button', 'CLOSE', 'closeButton', [{ n: 'style', v: 'margin: 10px;width:90px;' }]);
        appendChildren(msgBoxDiv, [msgText, reloadButton, closeButton]);

        var buttonsDiv = createHTMLElement('div', null, 'addAndCancelButtons', [{ n: 'style', v: style + 'bottom:10px;position:absolute;width:100%' }]);
        var addButton = createHTMLElement('button', 'ADD', 'addButton', [{ n: 'style', v: 'width:90px;margin:5px' }]);
        var cancelButton = createHTMLElement('button', 'CANCEL', 'cancelButton', [{ n: 'style', v: 'width:90px;margin:5px' }]);

        var editSection = createHTMLElement('div', null, 'editSection', [{ n: 'style', v: 'height:0%;width:0%;display:none' }]);
        var editSectionTitle = createHTMLElement('h2', 'EDIT CUSTOM BUTTONS', null, [{ n: 'style', v: style + 'margin-top: 25px' }]);
        var animeButtonsList = createHTMLElement('ul', null, 'buttonsList', [{ n: 'style', v: 'list-style: none;margin-top: 25px;padding-left: 40px;' }]);
        var animeButtons = document.querySelectorAll('.animeButton');
        var editButtonsDiv = createHTMLElement('div', null, 'addAndCancelButtons', [{ n: 'style', v: style + 'bottom:10px;position:absolute;width:100%' }]);
        var cancelButtonEdit = createHTMLElement('button', 'CLOSE', 'cancelButton', [{ n: 'style', v: 'width:90px;margin:5px' }]);
        editButtonsDiv.appendChild(cancelButtonEdit);

        createAndAppendEditListEntry(animeButtonsList, animeButtons, 1);

        popUp.appendChild(tabs);
        appendChildren(buttonsDiv, [addButton, cancelButton]);
        appendChildren(addSection, [addSectionTitle, title, titleInput, URLTitle, URLDescr, URLInput, iconTitle, iconDescr, iconInput, msgBoxDiv, buttonsDiv]);

        appendChildren(editSection, [editSectionTitle, animeButtonsList, editButtonsDiv]);

        appendChildren(popUp, [addSection, editSection]);
        var html = document.querySelector('html');
        html.appendChild(popUp);

        buttonsDiv.addEventListener('click', addAndCancelButtonsHandler);
        editButtonsDiv.addEventListener('click', addAndCancelButtonsHandler);
        tabs.addEventListener('click', addAndEditTabButtonsHandler);
        animeButtonsList.addEventListener('click', hideAndDeleteHandler);
        msgBoxDiv.addEventListener('click', msgButtonsHandler);
    }

    function createAndAppendEditListEntry(animeButtonsList, animeButtons, counterStartVal) {
        var counter = counterStartVal;

        animeButtons.forEach((b) => {
            var listEl = createHTMLElement('li', null, b.id, [{ n: 'style', v: 'width:90%;margin-top:5px;border-bottom-style: inset;border-bottom-width: thin;' }]);
            var imgUrl = b.firstElementChild.getAttribute('src');
            var img = createHTMLElement('img', null, null, [{ n: 'src', v: imgUrl }, { n: 'style', v: 'width: 16px;height: 16px;' }]);
            var span = createHTMLElement('span', b.getAttribute('title'), null, [{ n: 'style', v: 'margin-left:5px;bottom: 2px;position: relative;' }]);
            var hideIcon = createHTMLElement('img', null, 'hideButton', [{ n: 'src', v: iconEye }, { n: 'title', v: 'Toggle Hide' }, { n: 'style', v: 'height:16px;width:16px;position: absolute;right: 65px;' }]);
            var removeIcon = createHTMLElement('img', null, 'removeButton', [{ n: 'src', v: 'https://previews.dropbox.com/p/thumb/AAv_J1gX163dhysBBA0GBSGRBMMdRoTT2EVqs_xTg5PdES0EF5geKh9gJg0kCbmtTGSzjkZFZQ6qCVpKFmUKobTWUTYu-t6yYVdWg_ldZE8GBUfXu0NWx3q0RfyeelWLgApIOskJParENLlfHXLyKT_FeTPtESh3rNqWCr-7iY1v_snaIZo5WsajqOSeUoJ3jS6M0_lD_PN410Xv-hUbqlNejWUNJDoWz9nkQdhzLX3bFpErrb75jnys7fwG8NV0YYL-HDOKCOFnh0MCviaq_r-YeioUpcwdxVXv9AnHdgsfGnTSmfVdgY6oG5nk0IOjDfYs_R9-3zcOz5pClF6-9uM6/p.png?fv_content=true&size_mode=5' }, { n: 'title', v: 'DELETE' }, { n: 'style', v: 'height:16px;width:16px;position: absolute;right: 37px;' }]);

            if (b.style.display === 'none') {
                hideIcon.setAttribute('src', iconEyeGray);
            }

            appendChildren(listEl, [img, span, hideIcon]);

            if (counter++ > 5) {
                listEl.appendChild(removeIcon);
            }
            animeButtonsList.appendChild(listEl);
        });
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
