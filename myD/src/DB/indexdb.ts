import Database from "better-sqlite3";

async function initDB() {
    const ops = { verbose: console.log }
    const db = new Database('DB.db' , ops) 
    return db;
}

const db = await initDB() ;

export default db;