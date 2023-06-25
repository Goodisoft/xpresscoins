

const {Router} = require('express');

const pagesCont = require('../controllers/pagesCont');

const route = Router();

route.get('/', pagesCont.index);

route.get('/sign-in', pagesCont.get_login);

route.get('/sign-up', pagesCont.get_register);

route.get('/terms-conditions', pagesCont.get_terms_conditions);

route.get('/about', pagesCont.about);

route.get('/contact', pagesCont.contact);

route.get('/services', pagesCont.services);

route.get('/faqs', pagesCont.get_faqs);

route.get('/forgottern-password', pagesCont.forgottern_password);

route.get('/plans', pagesCont.get_plan);

// Post forgottern password
route.post('/forgottern-password', pagesCont.post_forgottern_password);

route.get('/reset-password', pagesCont.get_reset_password);

route.post('/update-password', pagesCont.post_update_password);


module.exports = route;