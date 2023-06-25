
const {Router} = require('express');

// Import user controller
const userCont = require('../controllers/userCont');

const {auth, checkUser} = require('../../middleware/authMiddleware');

const route = Router(); 

// Sign up page
route.get('/account', auth, checkUser, userCont.get_account);

// Get the deposit page
route.get('/init-deposit', auth, checkUser, userCont.init_deposit);

// Post deposit request
route.post('/deposit', auth, checkUser, userCont.post_deposit);


// Get the deposit page
route.get('/withdraw', auth, checkUser, userCont.get_withdraw_page);


// Post deposit request
route.post('/withdraw', auth, checkUser, userCont.post_withdrawal);

// Set withdrawal password
route.post('/withdrawal-password', auth, checkUser, userCont.withdrawal_password);

// Post referral withdrawal request
route.post('/affiliate-withdrawal', auth, checkUser, userCont.post_referral_withdrawal);

// Post referral withdrawal request
route.get('/referrals', auth, checkUser, userCont.get_referral_page);

// Get the profile page
route.get('/profile', auth, checkUser, userCont.get_profile);

// Post updated password to db
route.post('/update-password', auth, checkUser, userCont.post_update_password);

// Transfer mining balance
route.post('/transfer-mining', auth, checkUser, userCont.transfer_mining_balance);

// Get history page
route.get('/history', auth, checkUser, userCont.get_history);

// Get reinvestment page
route.get('/reinvestment', auth, checkUser, userCont.get_reinvestment);

// Post reinvestment
route.post('/reinvestment', auth, checkUser, userCont.post_reinvestment);

// Get promo
route.get('/promo', auth, checkUser, userCont.get_promo);

// Get promo Payment page
route.get('/promo-payment', auth, checkUser, userCont.get_promo_payment_page);

// Post promo deposit
route.post('/promo-deposit', auth, checkUser, userCont.post_promo_deposit);

// Post transfer promo
route.post('/transfer-promo', auth, checkUser, userCont.transfer_promo);

module.exports = route;