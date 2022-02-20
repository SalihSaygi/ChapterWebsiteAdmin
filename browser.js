import puppeteer from 'puppeteer';
import { timeFormatter } from './helperF.js';

async function CreateEvent(name, location, startDate, endDate) {
  const {
    startHour,
    startMinute,
    startTimeFrame,
    endHour,
    endMinute,
    endTimeFrame,
  } = timeFormatter(startDate, endDate);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://icatcard.ucmerced.edu/');
  await page.click(
    '#block-system-main > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > div > table > tbody > tr > td:nth-child(2) > div > a'
  );
  await page.waitForSelector('#username');
  await page.type('#username', ' acm', { delay: 100 });
  await page.type('#password', '@cm_UCM123!', { delay: 100 });
  await Promise.all([
    page.click('#fm1 > div.buttons > button'),
    page.waitForNavigation(),
  ]);
  await page.waitForSelector(
    '#block-system-main > div > table:nth-child(2) > tbody > tr > td:nth-child(4) > form'
  );
  await Promise.all([
    page.click(
      '#block-system-main > div > table:nth-child(2) > tbody > tr > td:nth-child(4) > form'
    ),
    page.waitForNavigation(),
  ]);
  await page.waitForSelector('#event_name');
  await page.type('#event_name', name, { delay: 100 });
  await page.type('#event_location', location, { delay: 100 });

  await page.select('#start_hour', startHour);
  await page.select('#start_minute', startMinute);
  await page.select('#start_ampm', startTimeFrame);

  await page.select('#end_hour', endHour);
  await page.select('#end_minute', endMinute);
  await page.select('#end_ampm', endTimeFrame);

  await page.click(
    '#block-system-main > div > form > table > tbody > tr > td:nth-child(2) > div > input'
  );
}

async function setAttendees(usernames) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://icatcard.ucmerced.edu/');
  await page.click(
    '#block-system-main > div > table > tbody > tr:nth-child(1) > td:nth-child(1) > table > tbody > tr > td:nth-child(2) > div > table > tbody > tr > td:nth-child(2) > div > a'
  );
  await page.waitForSelector('#username');
  await page.type('#username', 'acm', { delay: 50 });
  await page.type('#password', '@cm_UCM123!', { delay: 50 });
  await Promise.all([
    page.click('#fm1 > div.buttons > button'),
    page.waitForNavigation(),
  ]);
  await page.waitForSelector(
    '#block-system-main > div > table:nth-child(4) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(7) > form'
  );
  await Promise.all([
    await page.click(
      '#block-system-main > div > table:nth-child(4) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(7) > form'
    ),
    page.waitForNavigation(),
  ]);
  await page.waitForSelector('#proxid');
  usernames.forEach(id => {
    await page.type('#proxid', id, { delay: 50 });
    await page.click('#ucmnetid');
  });
}

export { CreateEvent, setAttendees };
