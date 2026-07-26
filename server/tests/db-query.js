import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from "mongodb";
const client = new MongoClient(process.env.DB_URI);

const database = client.db("sample_mflix");
const movies = database.collection("movies");
const query = { title: "Dune" };
const options = { projection: { _id: 0, title: 1, year: 1 } };

try {
    const movie = await movies.findOne(query, options);
    console.log(movie);
} catch (e) {
    console.error(e);
}
finally {
    client.close();
}