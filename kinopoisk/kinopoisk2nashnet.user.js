// ==UserScript==
// @name        kinopoisk2nashnet
// @description Добавляет ссылки на video.nash.net для страницы результатов кинопоиска
// @author      Liksu
// @license     MIT
// @version     1.16
// @include     http://*kinopoisk.ru/*
// @namespace	kinopoisk2nashnet.us.liksu.com
// ==/UserScript==

(function(window, undefined) {

	// normalize window
	var w = window.unsafeWindow = window.unsafeWindow || window;
	if (w.self != w.top) return;

	// get actual jQuery link
	var jQ_link = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
	for (var i = 0; i < document.scripts.length; i++) {
		if (/ajax.googleapis.com.*jquery.*jquery.min.js$/.test(document.scripts[i].src)) {
			jQ_link = document.scripts[i].src;
			break;
		}
	}

	// loader
	var load,execute,loadAndExecute;load=function(a,b,c){var d;d=document.createElement("script"),d.setAttribute("src",a),b!=null&&d.addEventListener("load",b),c!=null&&d.addEventListener("error",c),document.body.appendChild(d);return d},execute=function(a){var b,c;typeof a=="function"?b="("+a+")();":b=a,c=document.createElement("script"),c.textContent=b,document.body.appendChild(c);return c},loadAndExecute=function(a,b){return load(a,function(){return execute(b)})};

	// page processing after loading jQuery
	loadAndExecute(jQ_link, function() {
		$.fn.outerHTML = function() {return jQuery('<div>').append(this.clone()).html()}

		var tmp = {}, kp_ids = $.grep($('a[href*="film"]:not(.nnLink)').map(function(){var id = $(this).attr('href').match(/film\/(\d+)/); return id ? +id[1] : undefined}).get(), function(id) {return tmp[id] ? false : tmp[id] = true});
		$.getJSON('https://video.nashnet.ua:3000/kp_connector?kp_id=' + kp_ids.join(','), function(json) {
			for (var id in json.kp_id) { if (id != 'link') {
				// create text links to nn films
				var nn_links = [' ('];
				for (var nn = 0; nn < json.kp_id[id].length; nn++) {
					nn_links.push(
						$('<a>')
							.addClass('nnLink')
							.attr({
								href: json['link'] + json.kp_id[id][nn].id,
								title: json.kp_id[id][nn].title
							 })
							.html( nn + 1 )
							.outerHTML()
						, ', '
					);
				}
				nn_links[nn_links.length - 1] = ')';
				// insert image link
				nn_links.splice(1, json.kp_id[id].length == 1 ? 1 : 0,
						$('<a>')
							.attr({
								href: json['link'] + json.kp_id[id][0].id,
								title: json.kp_id[id][0].title
							 })
							.addClass('nnLink')
							.html(
								$('<img>')
									.attr({src: 'http://video.nash.net.ua/www.nashnet.ua/img/logo.gif', width: 12, height: 12})
									.css({verticalAlign: 'middle'}),
								json.kp_id[id].length == 1 ? '' : ' '
							)
							.outerHTML()
						);

				// append them
				var re = {
					films: new RegExp('film/' + id + '/?$'),
					sr: new RegExp('film/' + id + '/sr')
				};
				$('a[href*="film/' + id + '"]:not(:has(img)):not(.nnLink)')
					.filter(function() {
						return re.films.test(this.href) || re.sr.test(this.href)
					 })
					.filter(':not(:has(i s))')
						.after( nn_links )
						.end()
					.find('i s')
						.append( nn_links )
						.find('*').css({display: 'inline', float: 'none'}).end()
						.end()
					;
			}}
		});
	});

})(window);