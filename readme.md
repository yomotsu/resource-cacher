# resource-cacher

```
import { loadResource } from 'resourceCacher';

const url = './img.png';
const expiresIn = resourceCacher.ONE_MINUTE;

loadResource( './img.png', expiresIn ).then( ( blobUrl ) => {

	const img = new Image();
	img.src = blobUrl;
	document.body.appendChild( img );

} );
```

```
import { clearCacher } from 'resourceCacher';

const url = './img.png';

clearCacher( url );
```
