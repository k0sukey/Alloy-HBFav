var args = arguments[0] || {};

var current,
	doBack = _.debounce(function(){
			$.web.goBack();
		}, 500, true),
	doForward = _.debounce(function(){
			$.web.goForward();
		}, 500, true),
	doRefresh = _.debounce(function(){
			$.web.reload();
		}, 500, true),
	doSafari = _.debounce(function(){
			Ti.Platform.openURL(current);
		}, 500, true);

function doBeforeload(e) {
	current = e.url;
}

function doTouchstart(e) {
	e.source.applyProperties({
		color: '#a7bfda'
	});
}

function doTouchcancel(e) {
	e.source.applyProperties({
		color: '#007aff'
	});
}

function doTouchend(e) {
	e.source.applyProperties({
		color: '#007aff'
	});
}

$.browser.applyProperties({
	title: args.title
});

$.web.applyProperties({
	url: args.link
});

$.count.applyProperties({
	text: args.count + ' users'
});