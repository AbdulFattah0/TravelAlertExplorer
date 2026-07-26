import { MongoClient } from "mongodb";

const initDatabase = async (connectionString) => {
    try {
        const context = new MongoClient(connectionString);
        await context.connect();
        console.warn(`Database connected.`);
        return context;
    }
    catch (e) {
        console.error(e);
    }
}

const insertDocument = (context, database, collection, document) => {
    return context.db(database).collection(collection).insertOne(document);
}

const insertDocuments = (context, database, collection, documentArray) => {
    return context.db(database).collection(collection).insertMany(documentArray);
}

const deleteDocument = (context, database, collection, document) => {
    return context.db(database).collection(collection).deleteOne(document);
}

const deleteCollection = (context, database, collection) => {
    return context.db(database).collection(collection).drop();
}

const deleteDatabase = (context, database) => {
    return context.db(database).dropDatabase();
}

const findDocument = (context, database, collection, criteria, projection = { _id: 0 }) => {
    return context.db(database).collection(collection).findOne(criteria, { projection });
}

const findDocuments = (context, database, collection, criteria, projection = { _id: 0 }) => {
    return context.db(database).collection(collection).find(criteria, { projection }).toArray();
}

export {
    initDatabase,
    insertDocument,
    insertDocuments,
    deleteDocument,
    deleteCollection,
    deleteDatabase,
    findDocument,
    findDocuments
};