
// Require admin controller
const adminCont = require('../controllers/adminCont');

const {auth, isAdmin, checkUser} = require('../../middleware/authMiddleware');



const route = require('express').Router(); 


// // Get the admin landing
route.get('/home', auth, isAdmin, checkUser, adminCont.get_admin_home);

// // Get deposit page
route.get('/deposit', auth, isAdmin, checkUser, adminCont.get_deposit);

route.get('/confirm-deposit', auth, isAdmin, checkUser, adminCont.confirm_deposit);

route.get('/view-users', auth, isAdmin, checkUser, adminCont.get_all_users);

// Create admin
route.get('/create-admin', auth, isAdmin, checkUser, adminCont.create_admin);

// Remove admin
route.get('/remove-admin', auth, isAdmin, checkUser, adminCont.remove_admin);
 

// Get referral withdrawal
route.get('/referral-withdrawals', auth, isAdmin, checkUser, adminCont.get_referral_withdrawal);

// Confirm referral withdrawal
route.get('/confirm-referral-withdrawal', auth, isAdmin, checkUser, adminCont.confirm_referral_withdrawal);

// get confirm mining withdrawal page
route.get('/mining-withdrawals', auth, isAdmin, checkUser, adminCont.get_mining_withdrawal); 

// Confirm mining withdrawal
route.get('/confirm-mining-withdrawal', auth, isAdmin, checkUser, adminCont.confirm_mining_withdrawal);

// Get wallet address page
route.get('/add-wallet', auth, isAdmin, checkUser, adminCont.add_wallet_page);

// Post the wallet address
route.post('/add-wallet', auth, isAdmin, checkUser, adminCont.post_wallet_address);

// Get edit trading page
route.get('/edit-trading-deposit', auth, isAdmin, checkUser, adminCont.edit_trading_deposit); 

// Post editted trading transaction
route.post('/edit-trading', auth, isAdmin, checkUser, adminCont.post_edit_trading); 

// Get edit mining page
route.get('/edit-mining-deposit', auth, isAdmin, checkUser, adminCont.edit_mining_deposit); 

// Post editted mining transaction
route.post('/edit-mining', auth, isAdmin, checkUser, adminCont.post_edit_mining); 

// Get the user account info
route.get('/user-account', auth, isAdmin, checkUser, adminCont.get_user_account); 

// Get user edit page
route.get('/edit-balance', auth, isAdmin, checkUser, adminCont.edit_user_account); 

// Edit user balance
route.post('/edit-balance', auth, isAdmin, checkUser, adminCont.post_edit_balance); 

// Get plan page
route.get('/add-plan', auth, isAdmin, checkUser, adminCont.get_plan); 

// Poat plan
route.post('/post-plan', auth, isAdmin, checkUser, adminCont.post_plan); 

// View registered plan
route.get('/view-plan', auth, isAdmin, checkUser, adminCont.view_plan); 

// Edit registered plan
route.get('/edit-plan', auth, isAdmin, checkUser, adminCont.edit_plan); 

// Post edited plan
route.post('/update-plan', auth, isAdmin, checkUser, adminCont.post_edit_plan); 

// Cancel withdrawal transaction
route.get('/cancel-withdrawal', auth, isAdmin, checkUser, adminCont.cancel_withdrawal); 

// Delete deposit
route.get('/delete-deposit', auth, isAdmin, checkUser, adminCont.delete_deposit); 

// Get reinvestment page
route.get('/reinvestment', auth, isAdmin, checkUser, adminCont.get_reinvestment);   

// confirm reinvestment
route.get('/confirm-reinvestment', auth, isAdmin, checkUser, adminCont.confirm_reinvestment); 

// Get wallet address
route.get('/view-wallet-address', auth, isAdmin, checkUser, adminCont.get_wallet_address); 

// Delete wallet address
route.get('/delete-address', auth, isAdmin, checkUser, adminCont.delete_wallet); 

// view confirm deposits
route.get('/view-confirm-deposits', auth, isAdmin, checkUser, adminCont.view_confirm_deposit); 

// View paid out
route.get('/view-paid-out', auth, isAdmin, checkUser, adminCont.view_paid_out); 

// Get Notice page
route.get('/notice', auth, isAdmin, checkUser, adminCont.get_notice); 

// Post notice
route.post('/publish-notice', auth, isAdmin, checkUser, adminCont.post_notice); 

// Get all published motice
route.get('/view-notice', auth, isAdmin, checkUser, adminCont.view_notice); 

// Delete notice
route.get('/delete-notice', auth, isAdmin, checkUser, adminCont.delete_notice); 

// View referaal
route.get('/view-referral', auth, isAdmin, checkUser, adminCont.view_referral); 

// Edit referral code
route.get('/edit-referral-bal', auth, isAdmin, checkUser, adminCont.get_referral_wallet); 

// Post referral balance update
route.post('/update-referral-wallet', auth, isAdmin, checkUser, adminCont.update_referral_bal); 

// View comments
route.get('/view-comments', auth, isAdmin, checkUser, adminCont.view_comment); 

// Delete comments
route.get('/delete-comment', auth, isAdmin, checkUser, adminCont.delete_comment); 

// View mining account
route.get('/view-mining-acccount', auth, isAdmin, checkUser, adminCont.get_mining_accounts); 

// Get edit mining session
route.get('/edit-mining-session', auth, isAdmin, checkUser, adminCont.get_edit_mining_session); 

// Update mining session
route.post('/update-mining-session', auth, isAdmin, checkUser, adminCont.update_mining_session); 

// Create promo plans
route.get('/create-promo', auth, isAdmin, checkUser, adminCont.create_promo_plan); 

// Post promo plan
route.post('/post-promo-plan', auth, isAdmin, checkUser, adminCont.post_promo_plan); 

// View all promo plans
route.get('/view-promo-plans', auth, isAdmin, checkUser, adminCont.view_promo_plan); 

// Edit promo plan
route.get('/edit-promo-plan', auth, isAdmin, checkUser, adminCont.edit_promo_plan); 

// Post edited promo
route.post('/update-promo-plan', auth, isAdmin, checkUser, adminCont.post_edited_promo); 

// publish promo
route.get('/start-promo', auth, isAdmin, checkUser, adminCont.start_promo); 

// unpublish or stop promo
route.get('/stop-promo', auth, isAdmin, checkUser, adminCont.stop_promo); 

// Delete promo
route.get('/delete-promo', auth, isAdmin, checkUser, adminCont.delete_promo); 

// Get bulk email view
route.get('/send-bulk-email', auth, isAdmin, checkUser, adminCont.send_bulk_email); 

// Post bulk email
route.post('/send-bulk-email', auth, isAdmin, checkUser, adminCont.post_send_bulk_email); 

// Get promo deposits
route.get('/promo-deposits', auth, isAdmin, checkUser, adminCont.get_promo_deposit); 

// Confirm promo deposit
route.get('/confirm-promo-deposit', auth, isAdmin, checkUser, adminCont.confirm_promo_deposit);

// Delete promo deposit
route.get('/delete-promo-deposit', auth, isAdmin, checkUser, adminCont.delete_promo_deposit);


module.exports = route;