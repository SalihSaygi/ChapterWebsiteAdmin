import axios from 'axios';
import { setAttendees } from './browser.js';
import { tagRemover } from './helperF';

async function getAndRunSetAttendees(eventID, db) {
  db.collection('events')
    .doc(eventID)
    .onSnapshot(doc => {
      console.log('Current data: ', doc.data());
      setInterval(setAttendees(doc.data().attendees), 1000 * 60 * 3); //every 3min
    });
}
// setInterval(CreateEvent, 1000 * 60 * 60 * 24);

async function uploadEventsToFirebase(db) {
  const response = await axios.get(
    'https://api.presence.io/ucmerced/v1/organizations/events/association-for-computing-machinery-uc-merced'
  );
  if (!response.data) {
    console.log('no data');
    return [];
  }
  const detailedEvents = await Promise.all(
    response.data.map(async event => {
      let detailedEvent;
      try {
        detailedEvent = await axios.get(
          `https://api.presence.io/ucmerced/v1/events/${event.uri}`
        );
      } catch (err) {
        return err;
      }
      console.log(detailedEvent.data, '33');
      return detailedEvent.data;
    })
  );

  // const categories = ["workshop", "general", "talk", "koding kata"];

  // function categoryFinder(eventName) {
  //   const lowerName = eventName.toLowerCase();
  //   categories.forEach((category) => {
  //     if (lowerName.includes(category)) {
  //       return category;
  //     }
  //   });
  // }
  detailedEvents.forEach(async event => {
    const code = (Math.random() + 1).toString(36).substring(7);
    const formattedEvent = {
      apiID: event.apiId,
      eventName: event.eventName,
      description: tagRemover(event.description),
      location: event.location,
      startTime: event.startDateTimeUtc,
      endTime: event.endDateTimeUtc,
      image: event.hasCoverImage ? event.photoUri : 'null',
      attendees: [],
      // category: categoryFinder(event.eventName),
    };
    const codeDoc = {
      apiID: event.apiId,
      code: code,
    };

    const eventRef = db.collection('events').doc(formattedEvent.apiID);
    const eventSnap = eventRef.get().then(docSnap => {
      return docSnap;
    });
    if (eventSnap) {
      eventRef.update(formattedEvent).then(res => {
        console.log('event doc is updated at: ', res.updateTime);
      });
    } else {
      console.log('No such document!');
      eventRef.create(formattedEvent).then(res => {
        console.log('event doc is created at: ', res.updateTime);
      });
      const codeRef = db.collection('codes').doc(formattedEvent.apiID);

      codeRef
        .create(codeDoc)
        .then(res => {
          console.log('code doc is created at: ', res.updateTime);
        })
        .catch(err => {
          console.log(`Failed to create document: ${err}`);
        });
    }
  });
}

export { getAndRunSetAttendees, uploadEventsToFirebase };
