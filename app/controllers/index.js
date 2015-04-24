var dialogs = require('alloy/dialogs'),
	feed = Alloy.Collections.feed,
	offset = 0,
	isFetch = false;

function doTransform(model) {
	var json = model.toJSON();
	return {
			template: 'feed',
			feed: json,
			proficon: json.user.profile_image_url,
			username: json.user.name,
			createdAt: json.created_at,
			bottom: json.comment === '' ? 0 : 4,
			height: json.comment === '' ? 0 : Ti.UI.SIZE,
			comment: json.comment,
			favicon: json.favicon_url,
			title: json.title
		};
}

function doFetch() {
	if (isFetch) {
		return;
	}

	isFetch = true;
	feed.off('add');

	feed.fetch({
		timeout: 15000,
		url: 'http://feed.hbfav.com/' +
			Ti.App.Properties.getString('username', 'naoya') +
			'?of=' + offset,
		add: true,
		success: function(){
			$.refresh.endRefreshing();
			isFetch = false;
			feed.on('add', doTransform);

			$.list.applyProperties({
				marker: {
						itemIndex: feed.length - 1,
						sectionIndex: 0
					}
			});
			offset = feed.length;
		},
		error: function(){
			$.refresh.endRefreshing();
			isFetch = false;
			feed.on('add', doTransform);

			dialogs.confirm({
				title: 'エラー',
				message: 'ブックマークの読み込みに失敗しました。リトライしますか？',
				buttonNames: [
						'キャンセル',
						'リトライ'
					],
				callback: function(){
					doFetch();
				}
			});
		}
	});
}

function doRefresh() {
	offset = 0;
	feed.reset();
	var sections = $.list.getSections();
	sections[0].setItems([]);

	doFetch();
}

function doLoad(){
	doFetch();
}

var doItemclick = _.debounce(function(e){
	var item = e.section.getItemAt(e.itemIndex),
		controller = Alloy.createController('browser', item.properties.feed),
		browser = controller.getView();
	$.index.openWindow(browser);
}, 500, true);

var doSetting = _.debounce(function(){
	var controller = Alloy.createController('setting'),
		setting = controller.getView(),
		current = Ti.App.Properties.getString('username', 'naoya');

	controller.on('close', function(e){
		Ti.App.Properties.setString('username', e.username);

		$.index.animate({
			transform: Ti.UI.create2DMatrix({
					scale: 1.0
				}),
			opacity: 1.0,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: 300,
			delay: 100
		});

		setting.animate({
			transform: Ti.UI.create2DMatrix({
					scale: 2.0
				}),
			opacity: 0.0,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: 300
		}, function(){
			setting.close();
		});

		if (current !== e.username) {
			doFetch();
		}
	});

	setting.applyProperties({
		transform: Ti.UI.create2DMatrix({
				scale: 2.0
			}),
		opacity: 0.0
	});
	setting.open();

	$.index.animate({
		transform: Ti.UI.create2DMatrix({
				scale: 0.7
			}),
		opacity: 0.5,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration: 300
	});

	setting.animate({
		transform: Ti.UI.create2DMatrix({
				scale: 1.0
			}),
		opacity: 1.0,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT,
		duration: 300,
		delay: 100
	});
}, 500, true);

function doOpen() {
	doFetch();
}

$.index.open();