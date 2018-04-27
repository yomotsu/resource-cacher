/*!
 * resouce-cache
 * https://github.com/yomotsu/resouce-cache
 * (c) 2018 @yomotsu
 * Released under the MIT License.
 */
var ONE_SECOND = 1000;
var ONE_MINUTE = 60 * ONE_SECOND;
var ONE_HOUR = 60 * ONE_MINUTE;
var ONE_DAY = 24 * ONE_HOUR;
var getNow = function getNow() {
  return Date.now();
};

var pool = {};

function loadResouce(url) {
	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


	var exporedIn = options.exporedIn || 5 * ONE_MINUTE;

	return new Promise(function (resolve) {

		// dataURIの場合はそのまま返却
		if (/^data:/.test(url)) {

			dataUriToImg(url).then(function (img) {

				resolve(img);
			});

			return;
		}

		var type = /\.jpg$/.test(url) ? 'image/jpeg' : /\.png$/.test(url) ? 'image/png' : /\.gif$/.test(url) ? 'image/gif' : undefined;

		// キャッシュがあればそれを返却して終了
		if (!!pool[url]) {

			bufferToImg(pool[url], type).then(function (img) {

				resolve(img);
			});

			return;
		}
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';

		xhr.onprogress = function (e) {

			// this.dispatch( {
			// 	type: 'progress',
			// 	loaded: e.loaded,
			// 	total: e.total,
			// 	elapsedTime: Date.now() - startTime
			// } );

		};

		xhr.onload = function () {

			// xhr.response is a uint8 buffer
			pool[url] = xhr.response;
			bufferToImg(xhr.response, type).then(function (img) {

				resolve(img);
			});
		};

		xhr.send();
	});
}

function dataUriToImg(dataUri) {

	return new Promise(function (resolve) {

		var img = new Image();
		img.onload = function () {
			resolve(img);
		};
		img.src = dataUri;
	});
}

function bufferToImg(buffer, type) {

	return new Promise(function (resolve) {

		var blob = new Blob([buffer], { type: type });
		var reader = new FileReader();
		reader.readAsDataURL(blob);

		reader.onload = function () {

			var dataUri = reader.result;

			// PIXI.js の初期化時に独自キャッシュ（pool）の参照先も破壊されてしまうので
			// 毎回新規imgを作成
			var img = new Image();
			img.onload = function () {
				resolve(img);
			};
			img.src = dataUri;
		};
	});
}

export { loadResouce, ONE_SECOND, ONE_MINUTE, ONE_HOUR, ONE_DAY, getNow };
