var args = arguments[0] || {};

function doClose() {
	if ($.username.getValue() !== '') {
		$.trigger('close', {
			username: $.username.getValue()
		});
	}
}

$.username.applyProperties({
	value: Ti.App.Properties.getString('username', 'naoya')
});