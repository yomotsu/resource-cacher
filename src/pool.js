export const pool = {};
export const clearCacher = ( url ) => {

	if ( !! url ) {

		URL.revokeObjectURL( pool[ url ].blobUrl );
		delete pool[ url ];
		return;

	}

	Object.keys( pool ).forEach( ( key ) => {

		URL.revokeObjectURL( pool[ key ].blobUrl );
		delete pool[ key ];

	} );

};
