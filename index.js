require('dotenv').config();
const pg = require('pg');

// Environment variables must be specified for the database connection
if (!process.env.PG_HOST || !process.env.PG_USER || ! process.env.PG_DB || !process.env.PG_PW || !process.env.PG_PORT) {
    throw new Error("Missing environment variables for database access")
}

const pool = new pg.Pool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    database: process.env.PG_DB,
    password: process.env.PG_PW,
    port: process.env.PG_PORT
});

const getChartersFromDb = async () => {
    let res = null;
    try {
        const client = await pool.connect();
        res = await client.query('select * from charters');
        client.release();
    } catch(exc) {
        console.error(`Unable to query the database: ${exc.message}`);
    }
    return res;
}

const getCharters = async(parms) => {
    // Either return all charters (short form) or the details of a single charter
    let allCharters = null;    
    if (parms && parms.id) {
        allCharters = [{
            id: parms.id,
            name: `Custom ${parms.id}`,
            description: "This is a custom charter"
        }];
    } else {
        try {
            const response = await getChartersFromDb();
            allCharters = response && response.rows ? response.rows : [];
        } catch(exc) {
            console.log(`Exception: ${exc.message}`);
            allCharters = [];
        }
    }
    
    // Note: This will be invoked from a static site, so enable CORS - if specified
    let response = {
        statusCode: 200,
        body: allCharters,
    };

    if (process.env.CORS_URL) {
        response.headers = {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": process.env.CORS_URL,
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        }
    }
    return response;
}

exports.handler = async (event) => {
    return await getCharters(event);
};

if (process.env.IS_LOCAL_DEV) {
    (async () => {
        const rc = await getCharters(null);
        console.log(JSON.stringify(rc, null, 2));
        await pool.end();
    })();
}