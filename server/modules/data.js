import env from './env.js';
import * as db from './db.js';
import * as fs from "node:fs/promises";

const DATABASE_NAME = "project-1";
const ADVISORY_COLLECTION = "raw_advisories";
const ISO_COUNTRIES_COLLECTION = "iso_countries";
const ALERTS_COLLECTION = "alerts";

/*
 * Merge ISO country data with advisory data
 */
const mergeData = (isoCountries, rawAdvisories) => {

  const advisories = rawAdvisories.data;

  let countries = isoCountries.map(isoCountry => {

    const { name, region } = isoCountry;
    const code = isoCountry['alpha-2'];
    const sub_region = isoCountry['sub-region'];

    let advisoryEntry = advisories[code];
    const date = advisoryEntry ? advisories[code]['date-published']['date'] : '';
    const advisory = advisoryEntry ? advisories[code]['eng']['advisory-text'] : '';

    return {
      country_name: name,
      country_code: code,
      region,
      sub_region,
      advisory,
      date,
      bookmarked: false
    };
  });

  return countries;
};

/*
 * Drops and rebuilds the database
 */
const refreshDatabase = async () => {
  let context = undefined;

  try {
    context = await db.initDatabase(env.DB_URI);

    // Fetch advisory data
    let response = await fetch(env.ADVISORIES_URL);
    let rawAdvisories = await response.json();
    let timestamp = rawAdvisories.metadata.generated.date;

    // Drop database
    await db.deleteDatabase(context, DATABASE_NAME);
    console.log(`Database ${DATABASE_NAME} dropped.`);

    // Store raw advisories
    await db.insertDocument(context, DATABASE_NAME, ADVISORY_COLLECTION, rawAdvisories);
    console.log(`Advisories from ${timestamp} loaded into ${ADVISORY_COLLECTION}`);

    // Load ISO countries
    let isoFile = await fs.readFile(env.ISO_FILE_PATH);
    let isoCountries = JSON.parse(await isoFile.toString());

    await db.insertDocuments(context, DATABASE_NAME, ISO_COUNTRIES_COLLECTION, isoCountries);
    console.log(`ISO countries loaded into ${ISO_COUNTRIES_COLLECTION}`);

    // Merge + store alerts
    let mergedData = mergeData(isoCountries, rawAdvisories);
    let result = await db.insertDocuments(context, DATABASE_NAME, ALERTS_COLLECTION, mergedData);
    console.log(`${result.insertedCount} alerts loaded into ${ALERTS_COLLECTION}`);
  }
  catch (e) {
    console.error(e);
  }
  finally {
    context?.close();
  }
};

/*
 * Returns searchable alert data (name + code only)
 */
const retrieveAlerts = async () => {
  let context = undefined;

  try {
    context = await db.initDatabase(env.DB_URI);

    const projection = {
      _id: 0,
      country_code: 1,
      country_name: 1
    };

    return await db.findDocuments(
      context,
      DATABASE_NAME,
      ALERTS_COLLECTION,
      {},
      projection
    );
  }
  catch (e) {
    console.error(e);
    return [];
  }
  finally {
    context?.close();
  }
};

/*
 * Returns full alert details for a single country
 */
const retrieveAlertByCode = async (code) => {
  let context = undefined;

  try {
    context = await db.initDatabase(env.DB_URI);

    return await context
      .db(DATABASE_NAME)
      .collection(ALERTS_COLLECTION)
      .findOne(
        { country_code: code },
        { projection: { _id: 0 } }
      );
  }
  catch (e) {
    console.error(e);
    return null;
  }
  finally {
    context?.close();
  }
};

/*
 * Returns all bookmarked alerts
 */
const retrieveBookmarks = async () => {
  let context = undefined;

  try {
    context = await db.initDatabase(env.DB_URI);

    return await context
      .db(DATABASE_NAME)
      .collection(ALERTS_COLLECTION)
      .find(
        { bookmarked: true },
        { projection: { _id: 0 } }
      )
      .toArray();
  }
  catch (e) {
    console.error(e);
    return [];
  }
  finally {
    context?.close();
  }
};

/*
 * Sets or removes bookmark flag for a country
 */
const setBookmark = async (code, isBookmarked) => {
  let context = undefined;

  try {
    context = await db.initDatabase(env.DB_URI);

    await context
      .db(DATABASE_NAME)
      .collection(ALERTS_COLLECTION)
      .updateOne(
        { country_code: code },
        { $set: { bookmarked: isBookmarked } }
      );
  }
  catch (e) {
    console.error(e);
    throw e;
  }
  finally {
    context?.close();
  }
};

export {
  refreshDatabase,
  retrieveAlerts,
  retrieveAlertByCode,
  retrieveBookmarks,
  setBookmark,
  DATABASE_NAME,
  ADVISORY_COLLECTION,
  ISO_COUNTRIES_COLLECTION,
  ALERTS_COLLECTION
};
