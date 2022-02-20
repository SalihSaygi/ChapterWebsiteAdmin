import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { uploadEventsToFirebase, getAndRunSetAttendees } from './firebase.js';
import { CreateEvent } from './browser.js';
import * as dotenv from 'dotenv';

dotenv.config();

import serviceAccount from './key.js';
// import CreateEvent from './browser.js';
const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);

//google function will run below on the scheduled event
// time and will return the following data:
// { name, location, startDate, endDate } of the event doc

async function catAPI() {
  await CreateEvent('name', 'location', 'startDate', 'endDate').then(() => {
    await getAndRunSetAttendees('eventID', db);
  });
}

//---------------------------------------------------------

uploadEventsToFirebase(db);
