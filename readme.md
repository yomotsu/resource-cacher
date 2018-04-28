# resource-cacher

resource loading and cache in Browser.

Load and cache it,
```javascript
import { ONE_MINUTE } from 'resource-cacher';
import { loadResource } from 'resource-cacher';

const url = './img.png';
const expiresIn = ONE_MINUTE;

loadResource( './img.png', expiresIn ).then( ( blobUrl ) => {

	const img = new Image();
	img.src = blobUrl;
	document.body.appendChild( img );

} );
```

Once it was cached, it will be loaded from memory without http request.
```javascript
const url = './img.png';
const expiresIn = ONE_MINUTE;

loadResource( './img.png', expiresIn ).then( ( blobUrl ) => {

	const img = new Image();
	img.src = blobUrl;
	document.body.appendChild( img );

} );
```

To force clear cache, use `clearCacher()`.
```javascript
import { clearCacher } from 'resource-cacher';

const url = './img.png';

clearCacher( url );
```
