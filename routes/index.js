var express = require("express");
var router = express.Router();
const db = require("../models");

const crypto = require('crypto');
const exec = require('child_process').exec;


/* GET home page. */
router.get("/", async function (req, res) {
  const tasks = await db.Task.findAll();
  res.render("index", { title: "Hatsu Koi", tasks });
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
  console.log(req.get('X-Hub-Signature-256'))
  secret = 'dznURzbtTcZbfPQ'
  hashedSecret = crypto.createHash('sha256').update(secret, 'utf8').digest('hex')
  if (req.get('X-Hub-Signature-256') == hashedSecret) {
    exec('git pull');
  } else {
    const newTask = db.Task.build({
      task: 'test',
      done: false,
    });
    await newTask.save();
  }

  res.redirect("/");
});

module.exports = router;
