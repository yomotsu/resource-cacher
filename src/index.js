const pool = {};

export {
	ONE_SECOND,
	ONE_MINUTE,
	ONE_HOUR,
	ONE_DAY,
	getNow,
} from './constants.js';

import { ONE_MINUTE } from './constants.js';

export function loadResouce( url, options = {} ) {

	const exporedIn = options.exporedIn || 5 * ONE_MINUTE;

	return new Promise( resolve => {

		// dataURIの場合はそのまま返却
		if ( /^data:/.test( url ) ) {

			dataUriToImg( url ).then( img => {

				resolve( img );

			} );

			return;

		}

		const type = ( /\.jpg$/ ).test( url ) ? 'image/jpeg' :
		             ( /\.png$/ ).test( url ) ? 'image/png' :
		             ( /\.gif$/ ).test( url ) ? 'image/gif' :
		             undefined;

		// キャッシュがあればそれを返却して終了
		if ( !! pool[ url ] ) {

			bufferToImg( pool[ url ], type ).then( ( img ) => {

				resolve( img );

			} );

			return;

		}

		// キャッシュがなければ画像をバイナリロード
		// 完了後にresolve
		const startTime = Date.now();
		const xhr = new XMLHttpRequest();
		xhr.open( 'GET', url, true );
		xhr.responseType = 'arraybuffer';

		xhr.onprogress = ( e ) => {

			// this.dispatch( {
			// 	type: 'progress',
			// 	loaded: e.loaded,
			// 	total: e.total,
			// 	elapsedTime: Date.now() - startTime
			// } );

		};

		xhr.onload = () => {

			// xhr.response is a uint8 buffer
			pool[ url ] = xhr.response;
			bufferToImg( xhr.response, type ).then( ( img ) => {

				resolve( img );

			} );


		};

		xhr.send();

	} );

}

function dataUriToImg( dataUri ) {

	return new Promise( resolve => {

		const img = new Image();
		img.onload = () => { resolve( img ); }
		img.src = dataUri;

	} );

}

function bufferToImg( buffer, type ) {

	return new Promise( resolve => {

		const blob = new Blob( [ buffer ], { type: type } );
		const reader = new FileReader();
		reader.readAsDataURL( blob );

		reader.onload = () => {

			const dataUri = reader.result;

			// PIXI.js の初期化時に独自キャッシュ（pool）の参照先も破壊されてしまうので
			// 毎回新規imgを作成
			const img = new Image();
			img.onload = () => { resolve( img ); }
			img.src = dataUri;

		}

	} );

}
