// ==UserScript==
// @name        VK print
// @description Приводит пост на vk к печатному виду
// @author      Liksu
// @license     MIT
// @version     1.89
// @include     http://vkontakte.ru/wall*
// @include     http://vkontakte.ru/*?w=wall*
// @include     http://vk.com/wall*
// @include     http://vk.com/*?w=wall*
// @namespace	vk_print.us.liksu.kiev.ua
// ==/UserScript==

(function(window, undefined) {

	var w = window.unsafeWindow = window.unsafeWindow || window;
	if (w.self != w.top) return;

	var gTN = function(selector) {return document.getElementsByTagName(selector)};
	var gCN = function(selector) {return document.getElementsByClassName(selector)};
	
	function addLink(el, url) {
		var box = document.createElement('div'); box.setAttribute('class', 'fl_l'); box.setAttribute('id', 'link2print');
		var divide = document.createElement('span'); divide.innerHTML = '|'; divide.setAttribute('class', 'divide');
		box.appendChild(divide);
		var link = document.createElement('a'); link.innerHTML = 'версия для печати'; link.href = url;
		link.addEventListener("click", function() { w.location.href = url; return false }, false);
		box.appendChild(link);
		el.appendChild(box);
	}

	function clearScript() {
		while(gTN('script').length) gTN('script')[0].parentNode.removeChild(gTN('script')[0]);
	}

	function log(msg) {
		var mConsole = document.getElementById('manualConsole');
		if (!mConsole) {
			mConsole = document.createElement('div');
			mConsole.setAttribute('id', 'manualConsole');
			document.body.insertBefore(mConsole, document.body.firstChild);
		}

		mConsole.innerHTML += (mConsole.innerHTML ? '<br>' : '') + msg;
	}
	
	var url = w.location.href.match(/^(https?:\/\/vk(?:ontakte)?\.(?:(?:com)|(?:ru))\/)(.*(wall\-?[\d\_]+).*)$/);
	if ( url.length ) {
			if (/\?print$/.test(w.location.href)) {
				clearScript();
				setTimeout(clearScript, 1000);
				updSideTopLink = function() {};
				var b = gTN('body')[0];
				b.innerHTML = gCN('fw_post_info')[1].innerHTML;
				b.removeChild(gCN('fw_post_bottom')[0]);
				var link = document.createElement('span');
				link.innerHTML = '<hr>'+document.location;
				b.appendChild(link);
				if (gCN('published_by_wrap').length) gCN('published_by_wrap')[0].parentNode.removeChild(gCN('published_by_wrap')[0]);
				if (gCN('wall_post_text').length) document.title = gCN('wall_post_text')[0].innerHTML.replace(/<br>.*$/mi, '');
				gTN('head')[0].innerHTML += '<style>.page_media_caption {clear: both !important} .post_media {margin-top: 1em} body {margin: 1em} .wall_post_text {font-size: 14px !important; width: 800px !important}</style>';

				for (var i = 0; i < document.images.length; i++) {
					var img = document.images[i];
					var sizes = img.parentElement.getAttribute('onclick').replace(/&quot;|"/g, '').match(/\[[\w\-]{3,6}\/[\w\-]{11},\d+,\d+\]/g);
					var biggest = sizes.length ? sizes.pop().match(/([\w\-]{3,6}\/.{11}),(\d+),(\d+)/) : false;
					if (biggest) {
						img.src = img.src.replace(/[\w\-]{3,6}\/[\w\-]{11}\./, biggest[1] + '.');
						img.width = +biggest[2];
						img.height = +biggest[3];
						img.parentElement.style.width = biggest[2] + 'px';
						img.parentElement.style.height = biggest[3] + 'px';
						img.parentElement.parentElement.style.width = biggest[2] + 'px';
						img.parentElement.parentElement.style.height = biggest[3] + 'px';
					}
				}
			} else if (/\?w=wall\-?/.test(url[2])) {
				setTimeout(function() {
					addLink( document.getElementById('wl_post_actions_wrap'), url[1] + url[3] + '?print' );
					document.getElementById('link2print').style.padding = '6px 10px';
				}, 1500);
			} else {
				addLink( gCN('fw_post_bottom')[0], w.location.href + "?print" );
			}
	}

})(window);