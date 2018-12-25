// ==UserScript==
// @name        Youtube Shortcuts
// @author      Jed Caychingco
// @namespace   Youtube
// @include     https://www.youtube.com/*

// @require     https://raw.githubusercontent.com/jed1337/WebpageModifier/master/WebpageModifier.js
// @require     https://raw.githubusercontent.com/ccampbell/mousetrap/master/mousetrap.js
// @require     https://raw.githubusercontent.com/ccampbell/mousetrap/master/plugins/bind-dictionary/mousetrap-bind-dictionary.js

// @require     https://code.jquery.com/jquery-3.3.1.min.js

// @version     3.3
// @grant       none

// @icon        https://cdn1.iconfinder.com/data/icons/logotypes/32/youtube-256.png
// ==/UserScript==

"use strict";

var CONTEXT_CLASS   = "contextArea";
var HIGHLIGHT_CLASS = "highlight";

addCss('.'+HIGHLIGHT_CLASS+'{\
   background: rgba(52, 152, 219,0.8) ! important; \
   border: none ! important; \
   color: #fff ! important; \
   -webkit-transition: linear 0.1s ! important; \
   -o-transition: linear 0.1s ! important; \
   transition: linear 0.1s ! important; \
}');

addCss("."+HIGHLIGHT_CLASS+" a{color:#fff!important ;outline:none}");

// MutationObserver checks for changes made to the DOM tree
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
// Callback function to execute when mutations are observed
var callback = function(mutationsList) {

   // Let is like var except that let is scoped to the block it's in
   for(let mutation of mutationsList) {
      console.log(mutation);
      rebindKeyboardShortcuts();
   }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the title node for configured mutations
// Observe the adding and removing of this element's child nodes (including text nodes)
observer.observe(document.querySelector('title'), {childList: true});

rebindKeyboardShortcuts();

function rebindKeyboardShortcuts(){
   console.log("Rebounded keyboard shortcuts");

   rebindGeneralShortcuts();
   rebindResultsShortcuts();
   rebindPlaylistShortcuts();
   rebindWatchShortcuts();
}

function rebindGeneralShortcuts(){
   let watchLater = "button.addto-watch-later-button";

   Mousetrap.bind({
      'W'        : function(){clickInContext(watchLater);},         // Add to watch later
      'R W'      : function(){clickInContext("button.addto-watch-later-button-success");}, // Remove from watch later
      'shift+a W': function(){applyToAll(watchLater,clickInContext)},

      'shift+U'  : function(){clickInContext("div.yt-lockup-byline>a");},                  // User
      'shift+S'  : function(){click("span.subscribe-label")},                              // Subscribe

      's'        : function(){$("video").focus();},                              // focus on the screen
   })

   bindJK(
      "ytd-radio-renderer, ytd-video-renderer, ytd-playlist-renderer",
      "a#video-title, div#content>a.yt-simple-endpoint.style-scope",
      "a#video-title, div#content>a.yt-simple-endpoint.style-scope"
   );
}

function applyToAll(selector, func){
   $(selector).each(function(){
      func($(this));
   })
}

function rebindResultsShortcuts(){
   if(!validPath("/results?")){
      return;
   }
   Mousetrap.bind({
      'ctrl+shift+c l'  : function(){
         let hostname  = window.location.hostname;
         let watchLink = $("div.contextArea").find("a:first").attr("href");

         copy(hostname+watchLink);
      },
      'P'       : function(){clickInContext("li>a:contains(View full playlist)");},
   });
}

function rebindPlaylistShortcuts(){
   if(!validPath("/playlist?")){
      return;
   }
   Mousetrap.bind({
      'S' : function(){click("button[data-like-tooltip='Save to Playlists']");},
      'P' : function(){click("a.play-all-icon-btn");},
      'R' : function(){clickInContext(".pl-video-edit-remove");},
   })

   bindJK(
      "tr.pl-video.yt-uix-tile",
      "a.pl-video-title-link.yt-uix-tile-link.yt-uix-sessionlink.spf-link",
      "a.pl-video-title-link.yt-uix-tile-link.yt-uix-sessionlink.spf-link"
   );
}

function rebindWatchShortcuts(){
   if(!validPath("/watch?")){
      return;
   }
   Mousetrap.unbind("j");
   Mousetrap.unbind("k");

   Mousetrap.bind({
      'A'   : function(){click("button[aria-label=Save]");}, // Add to

      'U'   : function(){click("button[aria-label^=like]");},
      'D'   : function(){click("button[aria-label^=dislike]");},

      'S'   : function(){click("yt-formatted-string.more-button.style-scope.ytd-video-secondary-info-renderer");}, //Show more
      'R S' : function(){click("yt-formatted-string.less-button.style-scope.ytd-video-secondary-info-renderer");}, //Show less

      'W'   : function(){
         click("button.ytp-watch-later-button.ytp-button");
         return false;
      },

      'Q'   : function(){
         openVideoQualityPanel();
      },

      'H Q'   : function(){
         openVideoQualityPanel();
         click("span:contains(720)");
      },
   });
}

function openVideoQualityPanel(){
   click("button.ytp-settings-button");
   click("div.ytp-menuitem-label:contains(Quality)");
}