var express = require("express");
var router = express.Router();
const db = require("../models");

const crypto = require('crypto');
const exec = require('child_process').exec;


/* GET home page. */
router.get("/", async function (req, res) {
  const tasks = await db.Task.findAll();
  res.render("index", { title: "Anju", tasks });
});

router.post("/create", async function (req, res) {
  const newTask = db.Task.build({
    task: req.body.task,
    done: false,
  });
  await newTask.save();
  res.redirect("/");
});

router.post("/update", async function (req, res) {
  const task = await db.Task.findByPk(req.body.id);
  if (task) {
    task.done = !!req.body.done;
    await task.save();
  }
  res.redirect("/");
});

router.post("/delete", async function (req, res) {
  const task = await db.Task.findByPk(req.body.id);
  if (task) {
    await task.destroy();
  }
  res.redirect("/");
});

router.post("/webhook", async function (req, res) {
  var crypto = reqire('crypto')
  var
    hmac,
    calculatedSignature,
    payload = req.body;

  secret = 'dznURzbtTcZbfPQ'

  hmac = crypto.createHmac('sha1', secret);
  hmac.update(JSON.stringify(payload));
  calculatedSignature = 'sha1=' + hmac.digest('hex');

  if (req.headers['x-hub-signature'] === calculatedSignature) {
    exec('git pull');
  } else {
    console.log('not good');
  }

  res.sendStatus(200);
});

module.exports = router;
