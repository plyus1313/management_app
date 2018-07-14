const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const token = "6f73b60749e250e3963341bfb7d84204";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "pass123",
    database: "management",
    timezone: "UTC"
  }
});


function totalEUR() {
  return new Promise((resolve, reject) => {
    return db("person")
      .select(knex.raw("SUM(money) as total"))
      .first()
      .then(data => {
        console.log(data);
        resolve(data["total"]);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function convert(sum, to, reverse) {
  to = to.toUpperCase();
  return new Promise((resolve, reject) => {
    const request = require("request");

    request(
      "http://data.fixer.io/api/latest?access_key=" + token + "&symbols=" + to,
      function(err, res, body) {
        if (err) {
          console.log(to);
          return reject(err);
        }
        data = JSON.parse(body);
        console.log(data);

        rate = data["rates"][to];
        console.log(sum / rate);
        if (reverse) return resolve(sum / rate);
        return resolve(sum * rate);
      }
    );
  });
}

const app = express();

app.use(bodyParser.json());
app.use(cors());

//Routes
app.get("/", (req, res) => {
  db("person")
    .returning("*")
    .orderBy("expense", "desc")
    .then(data => {
      data = data.map(item => {
        item['money']= item['money'].toFixed(2)
        item["expense"] = new Date(item["expense"]);
        item["expense"].setTime(
          item["expense"].getTime() -
            item["expense"].getTimezoneOffset() * 60 * 1000
        );
        item["expense"] =
          item["expense"].getFullYear() +
          "-" +
          (item["expense"].getMonth() + 1 < 10
            ? "0" + (item["expense"].getMonth() + 1)
            : item["expense"].getMonth() + 1) +
          "-" +
          (item["expense"].getDate() < 10
            ? "0" + item["expense"].getDate()
            : item["expense"].getDate());

        return item;
      });
      res.json(data);
    });
});

app.get("/total", (req, res) => {
  totalEUR()
    .then(total => {
      convert(total, req.query.currency || "PLN").then(result => {
        console.log("RES: " + result);
        res.json({ total: result });
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.put("/add", (req, res) => {
  let { name, money, currency, expense } = req.body;
  let date = new Date(expense);
  convert(money, currency || "PLN", true)
    .then(money_converted => {
      console.log("RES: " + money_converted);
      db("person")
        .returning("*")
        .insert({
          name: name,
          money: money_converted,
          currency: "EUR",
          expense: date
        })
        .then(data => {
          res.json(data);
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
});

app.delete("/clear", (req, res) => {
  let expense = req.query.expense;
  let date = new Date(expense);
  date.setHours(0);
  let maxDate = new Date(expense);
  maxDate.setHours(23);
  maxDate.setMinutes(59);
  maxDate.setSeconds(59);

  db("person")
    .delete()
    .whereBetween("expense", [date, maxDate])
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.status(400).json(err);
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
