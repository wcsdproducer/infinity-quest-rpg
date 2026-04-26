const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // maybe it exists? Or use default credentials.

// Let's just try to list URLs by querying firestore if the media URLs are stored there.
