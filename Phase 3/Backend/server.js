const express = require("express")
const cors = require("cors")
const client = require("./db")
const { response } = require("express")
const { default: QueryPlayer } = require("../frontend/src/components/QueryPlayer")
// const { query } = require("express")

const app = express()

app.use(express.json())
app.use(cors())

app.listen(4000, () => console.log(`server listening on localhost:4000`))

// ==============================================================
// API ENDPOINTS 

// endpoint for retrieving data from project db (prompts select operation according to query variable)
app.get("/select", async (req, res) => {
    // res.send("Select Request Received: " + req.body)
    const table = req.query["table"]
    const field = req.query["field"]
    // try for condition 
    const condition = req.query["condition"]

    if (condition) {
        let queryData = await select(table, field, condition); 
        res.send(queryData);
    } else {
        let queryData = await select(table, field); 
        res.send(queryData);
    }
})


app.get("/custom", async (req, res) => {
    const customQuery = req.query["query"]
    let queryData = await custom(customQuery);
    res.send(queryData);
})


// endpoint for inserting data into project db (prompts insert operation according to query variable)
// NEEDS TO BE TESTED 
app.post("/insert", async (req, res) => {
    console.log(req.body)
    res.send("Insert Request Received: " + req.body)
    // console.log(req.query["table"])
    const table = req.query["table"]
    const field = req.query["field"]
    const values = req.query["values"]
    // try for condition 
    const condition = req.query["condition"]
    if (condition) {
        let queryData = await insert(table, field, values, condition);
        res.send(queryData);
    } else {
        let queryData = await insert(table, field, values);
        res.send(queryData);
    }
})

app.post("/customInsert", async (req, res) => {
    const customQuery = req.query["query"]
    let queryData = await custom(customQuery);
    res.send(queryData);
})



// endpoint for updating data into project db (prompts update operation according to query variable)
// NEEDS TO BE TESTED
app.put("/update", async (req, res) => {
    console.log(req.body)
    res.send("Update Request Received: " + req.body)
    // console.log(req.query["table"])
    const table = req.query["table"]
    const field = req.query["field"]
    const values = req.query["values"]
    const condition = req.query["condition"]
    let queryData = await update(table, field, values, condition);
    res.json(queryData);
})





// =======================================================================
// SQL FUNCTIONS 
async function select (table, field, condition = null) {
    var queryData = [];
    try {
        if(condition == null) {
            let q = `SELECT ${field} FROM ${table};`;
            console.log(`RUNNING QUERY: ${q}`)
            queryData = await client.query(q);
        } else {
            if (condition.includes("LIKE")) {
                // reformat bc of annoying shit where URL misinterprets % symbol 
                var unformattedCond = condition.split(" ")
                unformattedCond[2] = `'%${unformattedCond[2]}%'`
                condition = unformattedCond.join(" ");
            }
            console.log(condition)
            let q = `SELECT ${field} FROM ${table} WHERE ${condition};`;
            console.log(`RUNNING QUERY: ${q}`)
            queryData = await client.query(q);
        }
        console.log(queryData)
        console.log(queryData.rows);
        console.log(`SELECTED FROM ${table}`)
    } catch(err) {
        console.error(err);
        return err;
    } finally {
        console.log("SELECT RETURNING")
        console.log(queryData.rows)
        return queryData.rows;
    }
} 

async function insert (table, field, values, condition = null) {
    values = `(${values})`
    try {
        if(condition == null) {
            let q = `INSERT INTO ${table} ${field} VALUES ${values} RETURNING *;`;
            client.query(q, (err, res) => {
                console.log(`RUNNING QUERY: ${q}`)
                if (!err) {
                    console.log(res.rows);
                    console.log(`INSERTED INTO ${table}`)
                } else {
                    console.log(err.message);
                }
            });
        } else {
            let q = `INSERT INTO ${table} ${field} VALUES ${values} WHERE ${condition} RETURNING *;`;
            client.query(q, (err, res) => {
                console.log(`RUNNING QUERY: ${q}`)
                if (!err) {
                    console.log(res.rows);
                    console.log(`INSERTED INTO ${table}`)
                } else {
                    console.log(err.message);
                }
            });
        }
    } catch(err) {
        console.error(err);
    }
} 


async function update(table, field, values, condition) {
    // if (field != '*') {field = `(${field})`};
    values = `(${values})`;

    var queryData = [];
    try {
        let q = `UPDATE ${table} SET ${field}=${values} WHERE ${condition};`;
        console.log(`RUNNING QUERY: ${q}`)
        queryData = await client.query(q);
        console.log(queryData.rows);
    } catch(err) {
        console.error(err);
    } finally {
        console.log("UPDATE RETURNING")
        console.log(queryData.rows)
        return queryData.rows;
    }
}

async function custom(query) {
    var queryData = [];
    try {
        if (query.includes("LIKE")) {
            console.log("working detection")
            query = query.split(" ")
            var relInd = query.indexOf("ILIKE")
            query[relInd+1] = `'%${query[relInd]}%'`;
            query = " ".join(query);
        }
        console.log(`Running Query: ${query}`)
        queryData = await client.query(query);
        console.log(queryData)
        console.log(queryData.rows);
        console.log(`Ran Query: ${query}`)
    } catch(err) {
        console.error(err);
    } finally {
        console.log(queryData.rows)
        return queryData.rows;
    }
}