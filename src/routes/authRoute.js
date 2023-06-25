

const {Router} = require('express');

const authCont = require('../controllers/authCont');

const route = Router();

route.post('/sign-up', authCont.post_sign_up);

route.post('/sign-in', authCont.post_login);

route.get('/logout', authCont.logout);

module.exports = route;