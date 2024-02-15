const express = require('express');
const router = express.Router();

const { fetchEvent, fetchUser, showevents } = require('../middleware/index');
const { Event } = require('../middleware/mongo/index');
const { Users, } = require('../middleware/sessions/index');

router.get('/', fetchUser, async (req, res, next) => {

  const username = req.response?.data?.username;
  const admin = req.response?.data?.admin;
  const eventid = req.response?.data?.eventid?.trim();
  let title = "Home";


  if (req.response.statusCode != 200) res.redirect('/login');
  if (admin) {
    const DataEvent = await showevents();
    res.render('./home/admin', { DataEvent: DataEvent });
  }

  else {
    const event = await Event.findOne({ _id: eventid });
    title = event?.title
    res.render('./home/gebruiker', { username: username, eventid: eventid, title });
  }
});

router.get('/login', fetchUser, (req, res, next) => {

  const sessionId = req.cookies.Token;
  const user = Users.get(sessionId);
  if (user) res.redirect('/');

  res.render('login', { title: "Login", id: "admin", image: "/images/Placeholder.png" });
});

router.get('/login/:id', fetchUser, fetchEvent, (req, res, next) => {
  const sessionId = req.cookies.Token;
  const user = Users.get(sessionId);
  if (user) res.redirect('/');

  let title = "Login";
  let image = "/images/Placeholder.png";
  if (req.response.statusCode == 200) title = req.response.data.title;
  if (req.response.data) image = req.response.data.image

  res.render('login', { title, id: req.params.id, image });
});


router.get('/upload', fetchUser, async (req, res) => {
  const username = req.response?.data?.username;
  const admin = req.response?.data?.admin;
  const eventid = req.response?.data?.eventid?.trim();

  let title = "Upload";
  if (req.response.statusCode != 200) res.redirect('/login');
  if (admin) res.render('./upload/event');

  else {
    const event = await Event.findById(eventid)
    title = event?.title;
    res.render('./upload/foto', { username: username, eventid: eventid, title });
  }

});



module.exports = router;
