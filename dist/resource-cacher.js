/*!
 * resource-cacher
 * https://github.com/yomotsu/resource-cacher
 * (c) 2018 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.resourceCacher = {})));
}(this, (function (exports) { 'use strict';

	var ONE_SECOND = 1000;
	var ONE_MINUTE = 60 * ONE_SECOND;
	var ONE_HOUR = 60 * ONE_MINUTE;
	var ONE_DAY = 24 * ONE_HOUR;

	var pool = {};
	var clearCacher = function clearCacher(url) {

		if (!!url) {

			URL.revokeObjectURL(pool[url].blobUrl);
			delete pool[url];
			return;
		}

		Object.keys(pool).forEach(function (key) {

			URL.revokeObjectURL(pool[key].blobUrl);
			delete pool[key];
		});
	};

	var loadResource = function loadResource(url) {
		var ExpiresIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 60000;


		return new Promise(function (resolve) {

			// dataURIの場合はそのまま返却
			if (/^data:/.test(url)) {

				resolve(url);
				return;
			}

			var expires = Date.now() + ExpiresIn;

			// キャッシュがあればそれを返却して終了
			if (!!pool[url]) {

				// expiresの延長
				if (pool[url].expires < expires) {

					clearTimeout(pool[url].timeoutId);
					pool[url].expires = expires;
					pool[url].timeoutId = setTimeout(function () {

						URL.revokeObjectURL(pool[url].blobUrl);
						delete pool[url];
					}, ExpiresIn);
				}

				resolve(pool[url].blobUrl);
				return;
			}

			// キャッシュがなければバイナリロード
			// const startTime = Date.now();
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.responseType = 'arraybuffer';

			// xhr.onprogress = ( e ) => {

			// 	this.dispatch( {
			// 		type: 'progress',
			// 		loaded: e.loaded,
			// 		total: e.total,
			// 		elapsedTime: Date.now() - startTime
			// 	} );

			// };

			xhr.onload = function () {

				// xhr.response is an uint8 buffer
				var blob = new Blob([xhr.response]);
				var blobUrl = URL.createObjectURL(blob);
				var timeoutId = setTimeout(function () {

					URL.revokeObjectURL(pool[url].blobUrl);
					delete pool[url];
				}, ExpiresIn);

				pool[url] = {
					blobUrl: blobUrl,
					expires: expires,
					timeoutId: timeoutId
				};
				resolve(blobUrl);
			};

			xhr.send();
		});
	};

	exports.ONE_SECOND = ONE_SECOND;
	exports.ONE_MINUTE = ONE_MINUTE;
	exports.ONE_HOUR = ONE_HOUR;
	exports.ONE_DAY = ONE_DAY;
	exports.loadResource = loadResource;
	exports.clearCacher = clearCacher;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
