
const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "ams2022",
    host: "cosc-257-node11.cs.amherst.edu",
    port: "5432",
    database: "project"
});

try {
    pool.connect()
}
catch(err) {
    console.error(err)
}



// select("player", "name, email");
// select("recordsstatson", "email, distance", "distance > 9500")
// select("tracks", "*")



module.exports = pool;
