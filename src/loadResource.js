import { pool } from './pool.js';

export const loadResource = ( url, ExpiresIn = 60000 ) => {

	return new Promise( resolve => {

		// dataURIの場合はそのまま返却
		if ( /^data:/.test( url ) ) {

			resolve( url );
			return;

		}

		const expires = Date.now() + ExpiresIn;

		// キャッシュがあればそれを返却して終了
		if ( !! pool[ url ] ) {

			// expiresの延長
			if ( pool[ url ].expires < expires ) {

				clearTimeout( pool[ url ].timeoutId );
				pool[ url ].expires = expires;
				pool[ url ].timeoutId = setTimeout( () => {

					URL.revokeObjectURL( pool[ url ].blobUrl );
					delete pool[ url ];

				}, ExpiresIn );

			}

			resolve( pool[ url ].blobUrl );
			return;

		}

		// キャッシュがなければバイナリロード
		// const startTime = Date.now();
		const xhr = new XMLHttpRequest();
		xhr.open( 'GET', url, true );
		xhr.responseType = 'arraybuffer';

		// xhr.onprogress = ( e ) => {

		// 	this.dispatch( {
		// 		type: 'progress',
		// 		loaded: e.loaded,
		// 		total: e.total,
		// 		elapsedTime: Date.now() - startTime
		// 	} );

		// };

		xhr.onload = () => {

			// xhr.response is an uint8 buffer
			const blob = new Blob( [ xhr.response ] );
			const blobUrl = URL.createObjectURL( blob );
			const timeoutId = setTimeout( () => {

				URL.revokeObjectURL( pool[ url ].blobUrl );
				delete pool[ url ];

			}, ExpiresIn );

			pool[ url ] = {
				blobUrl,
				expires,
				timeoutId,
			};
			resolve( blobUrl );

		};

		xhr.send();

	} );

}
