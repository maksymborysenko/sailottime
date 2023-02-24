const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { Pool } = require("pg");

app.use(bodyParser.json());

app.use(express.static("login"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/login/login.html");
});

var userEmail;
app.post("/", async (req, res) => {
  const { email, password } = req.body;
  userEmail = email;
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND password = $2",
    [email, password]
  );
  if (result.rows.length === 1) {
    res.status(200).send({ message: "Data added successfully" });
  } else {
    res.status(401).send({ message: "Invalid email or password" });
  }
});

app.post("/signup", (req, res) => {
  const { name, signup_email, signup_password } = req.body;
  userEmail = signup_email;
  pool.query(
    "INSERT INTO users (first_name, email, password) VALUES ($1, $2, $3)",
    [name, signup_email, signup_password],
    (error, result) => {
      if (error) {
        console.error("Error signing up:", error);
        res.status(500).send("Error signing up");
      } else {
        console.log("New user signed up:", name);
        res.redirect("/mainpage");
      }
    }
  );
});

//  connection to DB
const pool = new Pool({
  user: "maksym",
  host: "localhost",
  database: "my_application",
  password: "",
  port: "5432",
});

app.use(express.static("mainpage"));
app.get("/mainpage", function (req, res) {
  res.sendFile(__dirname + "/mainpage/index.html");
});

const addData = async (data) => {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO contracts (vessel_name, start_date, end_date, email) VALUES ($1, $2, $3, $4)",
      [data.column1, data.column2, data.column3, userEmail]
    );
    console.log(result);
    client.release();
  } catch (err) {
    console.error(err);
  }
};

app.post("/mainpage", (req, res) => {
  const data = req.body;

  addData(data)
    .then(() => {
      res.status(200).send({ message: "Data added successfully" });
    })
    .catch((error) => {
      res.status(500).send({ message: "Failed to add data", error });
    });
});
app.use(express.static("mycontracts"));
app.get("/my_contracts", (req, res) => {
  const query = {
    text: `SELECT vessel_name, 
    TO_CHAR(start_date, 'dd-Mon-yyyy') as start_date,
    case 
        when ROUND((end_date - start_date)/30) = 1 then concat(ROUND((end_date - start_date)/30), ' month')
        else concat(ROUND((end_date - start_date)/30), ' months')
    end as duration,
    case 
        when CURRENT_DATE - end_date >= 0 then (end_date - start_date)
        else (end_date - CURRENT_DATE)
    end as days,
    case 
        when CURRENT_DATE - end_date >= 0 then 'DONE'
        else 'LEFT'
    end as status
    FROM contracts
    WHERE email = $1
    order by end_date desc`,
    values: [userEmail],
  };
  const query_ud = {
    text: `with c as (
      select 
        email,
        vessel_name,
        case 
          when CURRENT_DATE - end_date >= 0 then (end_date - start_date)
          when CURRENT_DATE > start_date then (CURRENT_DATE - start_date)
          else 0
        end as days
      from contracts
      where email = $1
      )
    SELECT INITCAP(first_name) as first_name,
    case 
        when sum(c.days) < 364 then concat(sum(c.days), ' days')
        when sum(c.days) > 364 and sum(c.days) < 728 then concat('1 year')
        else concat(ROUND(sum(c.days)/364), ' years')
    end as sea_time
    FROM users u right join c on u.email = c.email
    group by INITCAP(first_name)`,
    values: [userEmail],
  };

  pool.query(query_ud, (err, result_ud) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching data from the database");
    } else {
      const info = result_ud.rows.find((row) => row && row.first_name);

      pool.query(query, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error fetching data from the database");
        } else {
          const rows = result.rows.map((row) => ({
            vesselName: row.vessel_name,
            startDate: row.start_date,
            duration: row.duration,
            days: row.days,
            status: row.status,
          }));
          const html = `
      <head>
      <link rel="stylesheet" href="mycontracts.css" />
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://fonts.cdnfonts.com/css/montserrat" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;900&family=Noticia+Text:wght@400;700&display=swap"
      rel="stylesheet" />
      <title>My contracts</title>
      </head>
      <body>
      <section id="header">
        <div class="header">
          <a href="/mainpage" class="logo">Sailortime</a>
          <div class="header-right">
            <a href="/mainpage">Home</a>
            <a href="/my_contracts">My contracts</a>
            <a href="/">Logout</a>
          </div>
        </div>
      </section>
        <div class="container">
            <h1><small>Hi</small> ${info.first_name}!</h1>
            <div class="summary">
        <div class="text">You totaly spent</div>
        <div class="years">${info.sea_time}</div>
        <div class="text">in the sea.</div>
        </div>
          <h2>My contracts</h2>
          <ul class="responsive-table">
            <li class="table-header">
              <div class="col col-1">Vessel Name</div>
              <div class="col col-2">Start date</div>
              <div class="col col-3">Duration</div>
              <div class="col col-4">Days</div>
              <div class="col col-5">Status</div>
            </li>
            ${rows
              .map(
                (row) => `
              <li class="table-row">
                <div class="col col-1" data-label="Vessel Name">${row.vesselName}</div>
                <div class="col col-2" data-label="Start date">${row.startDate}</div>
                <div class="col col-3" data-label="Contract duration">${row.duration}</div>
                <div class="col col-4" data-label="Days">${row.days}</div>
                <div class="col col-5" data-label="Status">${row.status}</div>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
        </body>
      `;
          res.send(html);
        }
      });
    }
  });
});

app.listen(3000, function () {
  console.log("best application on port 3000!");
});
