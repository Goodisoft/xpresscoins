
const User = require('../models/userModel'); 

const Deposit = require('../models/deposit'); 

const ReferralWallet = require('../models/referral_wallet');

const ReferralWithdrawal = require('../models/referral_withdrawal');

const confirmDeposit = require('../models/confirm_deposit');

const MiningWallet = require('../models/mining_wallet');

const MiningWithdrawal = require('../models/mining_withdrawal');

const WalletAddress = require('../models/wallet_address');

const Plan = require('../models/plan');

const passwordVaildator = require('../helpers/validateData');

const {addMonths, addDays} = require('../helpers/timeHandler');

const {sendEmail} = require('../helpers/send_mail');


const axios = require('axios');

const bcrypt = require('bcrypt');

const {validate} = require('crypto-address-validators');

const TotalEarning = require('../models/total_earning');

const Reinvestment = require('../models/reinvestment');
const Notice = require('../models/notice');
const Comment = require('../models/comment');
const Mining = require('../models/mining');
const Promo = require('../models/promo');
const PromoDeposit = require('../models/promo_deposit');
const PromoWallet = require('../models/promo_wallet');




module.exports = {

    // Get the user dashboard
    get_account: async(req, res) => {

        let context = {};

        try {
            let _user = await User.findOne({_id: req.user.id});
            context['ref_code'] = _user.code;
            
            context['withdrawal_pin'] = _user.withdraw_password;

            

            // Get the mining sessions
            const mining_sessions = await Mining.find({$and: [{user: req.user.id}, {isMining: true}]}).sort({_id: 1});
            // console.log(mining_sessions);
            context['mining_sessions'] = mining_sessions;   
            if (mining_sessions == "") {
                context['mining_sessions'] = undefined;
            }
            else{
                context['mining_sessions'] = mining_sessions;
            }
            

            // get Mining wallet
            let mine_wallet = await MiningWallet.findOne({user: req.user.id});
            // console.log('mining wallet: ', mine_wallet)

            if (mine_wallet === null) {
                context['mine_wallet'] = '0.0';
            }
            else{
                // let balance = mine_wallet.balance.split('.');
                // console.log(balance)
                context['mine_wallet'] = parseFloat(mine_wallet.balance);
            }

            // Get total percentage earning
            const total_earning = await TotalEarning.findOne({user: req.user.id});
            if(total_earning === null){
                context['total_earning'] = '0.0';
            }
            else{
                context['total_earning'] = total_earning.total;
            }


            // Get total withdrawal
            const withdrawals = await MiningWithdrawal.find({$and: [{user: req.user.id}, {isPaid: true}]});

            let total_withdrawal = 0;
            if (withdrawals === null) {
                context['total_withdrawal'] = 0.00;
            }
            else{
                withdrawals.forEach(amount => {
                    total_withdrawal += parseFloat(amount.amount);
                });
                context['total_withdrawal'] = total_withdrawal;
            }

            // Get notice
            const notice = await Notice.find({}, {admin: 0});
            if (notice !== null) {
                context['notice'] = notice;
            }

            // Get comment
            const comments = await Comment.find({user: req.user.id});
            context['comments'] = comments;

            // Get promo
            const promo_count = await Promo.find({isRunning: true}).count();
            context['promo_count'] = promo_count 
            // console.log(promo_count);

            // Get promo investments
            const promos = await PromoWallet.find({$and: [{user: req.user.id}, {isPaid: false}]}).sort({_id: 1})
            // console.log(promos);
            context['promos'] = promos
            return res.render('./userViews/index', {context});

            
        } catch (error) {
            console.log(error)
            context['error'] = 'Something went wrong. Try again';
            return res.render('./userViews/index', {context});
        }

        
    },

    // Get deposit page
    init_deposit: async(req, res) => {

        let context = {};

        try {
          // Get Admin wallet address
          const _address = await WalletAddress.find();
  
          context['address'] = _address;
  
          return res.render('./userViews/init_deposit', {context});

        } catch (error) {
         console.log(error)
        }

    },

    // Post deposit
    post_deposit: async (req, res) => {

        let {currency, amount, transaction_id} = req.body;

        let amountReg = /^[0-9\.]+$/;
        let testExp = new RegExp(amountReg);

        let IdReg = /^[A-Z a-z 0-9.]+$/;
        let testId = new RegExp(IdReg);

        if (currency === '' || amount === '' || transaction_id ==='' || !testExp.test(amount) ) {
            let err = 'All fields are required';
            return res.status(401).json({error: err});
        }

        if (!testId.test(transaction_id)) {
            let err = 'Invalid transaction ID';
            return res.status(401).json({error: err});
        }


        // Get plan
        const plan = await Plan.findOne();

        if (plan === null) {
            return res.status(401).json({error: 'Something went wrong. Please try again'});
        }

        const fee = plan.activation;
        const minimum = fee.split('-');

        if (parseInt(amount) < parseInt(minimum[0])) {
            let err = `Minimum deposit of $ ${minimum[0]} is accepted`;
            return res.status(401).json({error: err});
        }


        // Get the admin the post the nft
        const user = req.user.id;

        try {
            // Post deposit
            const _deposit = await Deposit.create({user, currency, amount, transaction_id});
            if (_deposit) {

                sendEmail(
                    process.env.EMAIL_USER, 
                    process.env.EMAIL_USER,
                    'Deposit',
                    `A client just made a deposit of $${amount} to your ${currency} wallet address`
                );

                const  msg = 'Success: Your deposit is processing and it will be completed in few minutes.';
                return res.status(200).json({success: msg});
            }

        } catch (error) {
            // console.log(error);
            let err = 'Something went wrong';
            return res.status(401).json({error: err});
        }

    },

    // Get the withdrawal page
    get_withdraw_page: async (req, res) => {

        let context = {};

        // Get the user code
        let u = await User.findById({_id: req.user.id});
        // console.log(u);

        // Get referral wallet balance
        const ref_bal = await ReferralWallet.findOne({user_code: u.code});
        // console.log('Referral bal: ',ref_bal);


        if (ref_bal === null || ref_bal.balance === undefined) {
            context['ref_bal'] = 0;
        }
        else{
            context['ref_bal'] = ref_bal.balance;
        }

        // Get Mining wallet
        const mining_wallet = await MiningWallet.findOne({user: req.user.id});
        // console.log('Mining wallet: ', mining_wallet);

        if (mining_wallet === null || mining_wallet.balance === undefined) {
            context['mining_bal'] = 0;
        }
        else{
            // let bal = mining_wallet.balance.split('.');
            // console.log(bal);

            context['mining_bal'] = mining_wallet.balance;
        }

        return res.render('./userViews/withdrawal_page', {context});
    },

    // Handle withdrawal request
    post_withdrawal: async(req, res) => {

        const {currency, amount, walletAddress} = req.body;

        let amountReg = /^[0-9\.]+$/;
        let testExp = new RegExp(amountReg);

        let addressReg = /^[A-Z a-z 0-9.]+$/;
        let testAddress = new RegExp(addressReg);

        const today = new Date();

        if (currency === '') {
            let err = 'Please select currency';
            return res.status(401).json({error: err});
        }

        if (amount === '' || !testExp.test(amount) ) {
            let err = 'Invalid withdrawal amount';
            return res.status(401).json({error: err});
        }
        if (walletAddress === '') {
            let err = 'Invalid withdrawal address';
            return res.status(401).json({error: err});
        }
        if (!testAddress.test(walletAddress) ) {
            let err = 'Invalid wallet address';
            return res.status(401).json({error: err});
        }
        

        try {

            // const today = new Date();
            // const checkDay = today.getDay();
            // if (checkDay === 5 || checkDay === 6) {
            
                // Get mininig wallet balance
                let mining_bal = await MiningWallet.findOne({user: req.user.id});
                // console.log('Mining wallet', mining_bal);

                // Validate the db balance and user input bal
                if (mining_bal === null || parseFloat(amount) > parseFloat(mining_bal.balance) || mining_bal === undefined) {
                    let err = 'Insufficient balance';
                    return res.status(401).json({error: err});
                }

                // Get mining withdrawal request
                const mine_withdraw = await MiningWithdrawal.findOne({$and: [{user: req.user.id}, {isPaid: false}]}).count();
                // Check if the user have submit withdrawal request for the day
                if (mine_withdraw > 0) {
                    return res.status(401).json({
                        error: 'You have pending withdrawal that has not been confirm. Please try again'
                    });
                }

                    // Post to withdrawal request table
                    const withdraw_mining = await MiningWithdrawal.create({user: req.user.id, currency, amount, address: walletAddress});
                    // console.log('Mining withdrawal request creadted: ', withdraw_mining);

                    // Minus withdrawal  amount from wallet balance
                    const remaining_bal = parseFloat(mining_bal.balance) - parseFloat(amount);
                    // console.log('Remaining balance:', remaining_bal);

                    const bal_update = await MiningWallet.findOneAndUpdate({user: req.user.id}, {balance: remaining_bal});
                    // console.log('Mining balance update: ', bal_update);

                    sendEmail(
                        process.env.EMAIL_USER, 
                        process.env.EMAIL_USER,
                        'Withdrawal Notification',
                        `A client has requested for a withdrawal of $${amount} in ${currency}`
                    );

                    return res.status(200).json({success: 'Withdrawal request has been submitted'});
            // }
            // else{
            //     return res.status(401).json({
            //         error: 'Payout is only on Friday and Saturday'
            //     });
            // }
        } catch (error) {
            // console.log(error)
            let err = 'Something went wrong. Please try again';
            return res.status(401).json({error: err});
        }

    },


    withdrawal_password: async (req, res) =>{

        let {password, withdraw_password} = req.body;

        password = password.trim();
        withdraw_password = withdraw_password.trim();

        let withPassword_pattern= /^[0-9]+$/;
        let testExp = new RegExp(withPassword_pattern);

        // validate the form data 
        if (!testExp.test(withdraw_password) || withdraw_password.length > 6) {
            let err = 'Only 6 digit numbers are required';
            return res.status(401).json({error: err});
        }

        try {
             // Get the user 
            let _u = await User.findById({_id: req.user.id});

            if (_u) {
                // Check if login password is correct
                const _password = await bcrypt.compare(password, _u.password);
                if (_password) {
                    // Update withdrawal_password in the user collection
                    let _wp = await User.findOneAndUpdate({_id: _u._id}, {withdraw_password});
                    // console.log(_wp);

                    return res.status(401).json({success: 'Withdrawal password has been set.'});
                }
                else{
                    let err = 'Please provide your correct login password';
                    return res.status(401).json({error: err});
                }
            }
        } catch (error) {
            // console.log(error)
            let err = 'Something went wrong';
            return res.status(401).json({error: err});
        }
       
        
    },

    post_referral_withdrawal: async (req, res) => {


        let {ref_currency, ref_withdrawal_amount, password, address} = req.body;

        let amountReg = /^[0-9\.]+$/;
        let testExp = new RegExp(amountReg);

        let addressReg = /^[A-Z a-z 0-9.]+$/;
        let testAddress = new RegExp(addressReg);

        if (ref_currency === '') {
            let err = 'Please select currency';
            return res.status(401).json({error: err});
        }
        if (ref_withdrawal_amount === '' || !testExp.test(ref_withdrawal_amount) ) {
            let err = 'Invalid withdrawal amount';
            return res.status(401).json({error: err});
        }
        if (address === '') {
            let err = 'Invalid withdrawal address';
            return res.status(401).json({error: err});
        }
        if (ref_withdrawal_amount < 10) {
            let err = 'Minimum withdrawal is $10';
            return res.status(401).json({error: err});
        }
        if (!testAddress.test(address) ) {
            let err = 'Invalid wallet address';
            return res.status(401).json({error: err});
        }

        try {
            // Get the withdrawal password
            let _wpin = await User.findById({_id: req.user.id}); 
            // console.log(_wpin);

             // Get the staking wallet
             let ref_wallet = await ReferralWallet.findOne({user_code: _wpin.code});
            //  console.log('Available Bal: ', ref_wallet)
 
            // validate the withdrawal amount
            if ( ref_wallet === null || ref_wallet.balance === undefined || ref_withdrawal_amount > parseFloat(ref_wallet.balance) ) {
                let err = 'Insufficient balance';
                return res.status(401).json({error: err});
            }

            // Create referrral withdrawal
            let referral_w = await ReferralWithdrawal.create({user: req.user.id, currency: ref_currency, amount: ref_withdrawal_amount, address: address});
            // console.log(referral_w);

            if (referral_w) {
                // Deduct withdrawal amount from current balance
                let current_bal =  parseFloat(ref_wallet.balance) - parseFloat(ref_withdrawal_amount);
                // console.log('Current bal: ', current_bal);

                // update wallet balance 
                let _bal = await ReferralWallet.findOneAndUpdate({user_code: _wpin.code}, {balance: current_bal});
                // console.log('Referral balance has been updated', _bal);

                sendEmail(
                    process.env.EMAIL_USER, 
                    process.env.EMAIL_USER,
                    'Referral',
                    `A client has requested for referral withdrawal of $${ref_withdrawal_amount} in ${ref_currency}`
                );

                return res.status(200).json({success: 'Withdrawal has been submitted'});  

            }

        } catch (error) {
            console.log(error);
            let err = 'Something went wrong';
            return res.status(401).json({error: err});
        }
    },

    // Get referral dashboard
    get_referral_page: async (req, res) =>{

        let context = {};

         // Get the user
         let _user = await User.findOne({_id: req.user.id}, {__v: 0, password: 0, isAdmin: 0});
         if (_user !== null) {
            context['user'] = _user.code
         }
        // Get referral wallet
        let ref_wallet = await ReferralWallet.findOne({user_code: _user.code});

        if (ref_wallet === null) {
            context['ref_wallet'] = '0.0';
        }
        else{
            context['ref_wallet'] = ref_wallet.balance;
        }

        // Get user downlines
        let _downlines =  await User.find(
            {
                $or: [{'referral.direct_referral': _user.code}, 
                {'referral.level1_code': _user.code}]
            }, 
            {__v: 0, password: 0, isAdmin: 0}); 
        context['downlines'] = _downlines;


        return res.render('./userViews/referrals', {context})
    },

    // Get the profile page
    get_profile: (req, res) =>{
        return res.render('./userViews/profile');
    },

    // Post update password
    post_update_password: async(req, res) =>{

        const {old_password, new_password, confirm_password} = req.body;

        // Validate password field 
        // Regex pattern
        let password_pattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        
        // Check if the field is empty
        if (new_password.length < 1) {
        let error = 'This field is require';
            return res.status(401).json({error});
        }
        if (new_password.length > 30) {
            let error = 'Password length is longer than expected';
            return res.status(401).json({error});
        }
        // Regex Validator function
        let password_validator = passwordVaildator.validate(new_password, password_pattern);
        if (!password_validator.errors['isValid']) {
            let error = 'Invalid password format';
            return res.status(401).json({error});
        }


        // Validate confirmPass field 
        if (confirm_password !== new_password) {
            let error = 'Password do not match';
            return res.status(401).json({error});
        }

        //  Checks whether the old password ids correct
        try {
            const user = await User.findById(req.user.id);

            if (user) {
                const auth = await bcrypt.compare(old_password, user.password);
                // console.log(auth);
                if (auth) {
                    //  console.log(auth);
                    const salt = await bcrypt.genSalt();
                    const hashPassword = await bcrypt.hash(new_password, salt);
                    // console.log(hashPassword)
                    const u = await User.findOneAndUpdate({ _id: req.user.id }, { password: hashPassword });
                    // console.log(u);
                    let success = 'Password updated sucessfully'; 
                    return res.status(401).json({success});   
                } 
                
                let error = 'Incorreect old password';
                return res.status(401).json({error});
                
            }

        } catch (err) {
            // console.log(err);
            let error = 'Something went wrong. Please try again or contact support team.'
            return res.status(401).json({error});   

        }
    }, 
    
    // Transfer mining balance
    transfer_mining_balance: async (req, res) =>{


        const {mining_id} = req.body;

        let amountReg = /^[0-9a-zA-Z\.]+$/;

        if (!amountReg.test(mining_id) ) {
            let err = 'Invalid character';
            return res.status(401).json({error: err});
        }

        try {
            // Get the mining
            const mining = await Mining.findById(mining_id);
            console.log(mining);
            if (mining === null) {
                return res.status(401).json({error: 'No mining session found!'});
            }
            
            //  // check if the user has completed his/her mining session
            if(mining.mining_completion_date <= new Date()){

                // Get total earning
                const t_earning = await TotalEarning.findOne({user: req.user.id});
                if (t_earning === null) {
                    // Create total eaning
                    const _earning = await TotalEarning.create({user: req.user.id, total: mining.paid_out});
                    // console.log('Total eaning created: ', _earning);
                }
                else{
                    // Update total earning
                    const sum = t_earning.total + mining.paid_out;
                    // Update total earning
                    const earning_update = await TotalEarning.findOneAndUpdate({user: req.user.id}, {total: sum});
                    // console.log('Total earrning has been updated: ', earning_update);
                }

                // Get user's wallet
                let w = await MiningWallet.findOne({user: req.user.id});
                // console.log('wallet balance: ', w)

                // Check if the wallet is null
                if (w === null) {
                    // create wallet
                    let cw = await MiningWallet.create({user: req.user.id, balance: mining.paid_out});
                    // console.log('Wallet created: ', cw);
                }
                else{
                    // Get current balance
                    const bal = parseFloat(w.balance) + mining.paid_out;
                    // console.log(`current bal: ${bal}`);
                    
                    // update the wallet with the new mining balance
                    let u = await MiningWallet.findOneAndUpdate({user: req.user.id}, {balance: bal});
                    // console.log('Wallet updated: ', u); 
                }   
 

                // update isPaid in confirm_deposit collection
                // This will make the mining stop and reset the mining balance to zero 
                let _up = await confirmDeposit.findOneAndUpdate({$and: [{depositor: req.user.id}, {isPaid: false}]}, {isPaid: true});
                // console.log('Update ispaid in confirm deposit', _up);

                // Update isMining in mining collection
                const mineCollection = await Mining.findOneAndUpdate({_id: mining._id}, {isMining: false});
                // console.log('Mining collection is updated: ', mineCollection);
                
                let msg = 'Transfer successful. Your coin is now in your wallet.';
                return res.status(200).json({success: msg});

            }
            else{
                let err = 'You have not completed your mining session';
                return res.status(401).json({error: err});
            }

        } catch (error) {
            console.log(error);
            let err = 'Something went wrong. Please try again';
            return res.status(500).json({error: err});
        }
    },

    // Get History page
    get_history: async (req, res) => {
        let context = {};

        try {
        
            // Deposit history
            let mining_deposit_history = await Deposit.find({user: req.user.id});
            context['mining_deposit'] = mining_deposit_history;

           
            // mining withdrawal history
            let mining_withdrawal_history = await MiningWithdrawal.find({user: req.user.id});
            context['mining_withdrawal'] = mining_withdrawal_history;

            // Referral Withdrawal history
            let ref_withdrawal_history = await ReferralWithdrawal.find();
            context['ref_withdrawal'] = ref_withdrawal_history;

            return res.render('./userViews/history', {context});
               
        } catch (error) {
            console.log(error);
        }
    },

    // Reinvestment
    get_reinvestment: async (req, res) => {
        const context = {};

        try {
            // Get Mining wallet
            const mining_wallet = await MiningWallet.findOne({user: req.user.id});
            // console.log('Mining wallet: ', mining_wallet);

            if (mining_wallet === null || mining_wallet.balance === undefined) {
                context['wallet_balance'] = 0;
            }
            else{
                // let bal = mining_wallet.balance.split('.');
                // console.log(bal);

                context['wallet_balance'] = mining_wallet.balance;
            }
            return res.render('./userViews/reinvestment', {context});

        } catch (error) {
            
        }
    },

    // Post reinvestment
    post_reinvestment: async (req, res) => {

        const {amount} = req.body;

        try {

            const user = await User.findById({_id: req.user.id});
            // Get Mining wallet
            const mining_wallet = await MiningWallet.findOne({user: req.user.id}).populate('user');

            if (parseFloat(amount) < 50) {
                throw Error('Minimum of $50 can be reinvested');
            }
            if (mining_wallet === null) {
                throw Error('Insufficient fund');
            }
            // Check available balance
            if (parseFloat(amount) > parseFloat(mining_wallet.balance)) {
                throw Error('Insufficient fund');
            }


            // Subtract the investment amount from the wallet balance
            const bal = parseFloat(mining_wallet.balance) - parseFloat(amount);
            // console.log('Balance: ', bal);
            
            // Update wallet balance
            const update_wallet = await MiningWallet.findOneAndUpdate(
                {user: req.user.id}, {balance: bal},
            );
            // console.log('Wallet has been updated: ', update_wallet);

            // Create reinvestment
            const reinvest = await Reinvestment.create({user: req.user.id, amount});
            // console.log(reinvest);



            // Automatically confirm reinvestment
             // Get plan
             const _plans = await Plan.find();
             // console.log(_plans);
 
             if (_plans === null) {
                 context['error'] = 'Please customize plan';
                 return res.render('./adminViews/reinvestment', {context});
             }
 
             let plan = '';
 
             _plans.forEach(p => {
 
                 let _amount = p.activation;
                 // console.log('Activation from db: ', _amount)
                 const fee = _amount.split('-');
                 // console.log('Splitted fee: ', fee)
 
                 // Asign investment levels
                 // Level 1
                 if (parseFloat(reinvest.amount) >= parseFloat(fee[0]) && 
                    parseFloat(reinvest.amount) < parseFloat(fee[1])) {
                     plan = p.title;
                 }
                 if (parseFloat(reinvest.amount) <= parseFloat(fee[1]) 
                 && parseFloat(reinvest.amount) >= parseFloat(fee[0])) {
                    plan = p.title;
                }
                 
             });

            //  Notify the admin
            sendEmail(
                process.env.EMAIL_USER, 
                process.env.EMAIL_USER,
                'Reinvestment',
                `${mining_wallet.user.username} has made $${reinvest.amount} reinvestment`
            );
 
             // Create record in Confirm depsoit collection
            let confirmReinvestment = await confirmDeposit.create({
                depositor:reinvest.user._id, trans_id: reinvest._id, plan, 
                amount: reinvest.amount, direct_upline: '', upline2: '', 
                direct_upline_earning: 0, 
                upline2_earning: 0
            });
            // console.log('Confirm reinvestment: ', confirmReinvestment);

            // Calculate the mining percent
            const date = new Date(confirmReinvestment.confirm_date);  

            // Holds mining percentage
            let mining_percentage = 0;
            let mining_completion_date;

            if (_plans !== null) {
                _plans.forEach(p => {
                    // check mining plan which will help to calculate %
                    // Also add the expected completion date base on plan
                    if (confirmReinvestment.plan === p.title) {
                        
                        // Add 3 days to the confirmation date
                        // This will help to track when the mining session has been completed
                        mining_completion_date = addDays(parseInt(p.duration), date);
                        
                        //  Get deposit amount which will be use to calculate earning %
                        // Earning % will be use for the calculation of the mining unit
                        mining_percentage = (parseFloat(confirmReinvestment.amount) * parseFloat(p.profit)) / 100;

                    }
                });
            }

            // console.log('Mining completion date: ', mining_completion_date);
            // console.log('Mining percentage: ', mining_percentage);

            // Total seconds to complete mining
            // Add months minus confirm date
            const total_sec = Math.abs(mining_completion_date.getTime() - date.getTime())/1000;
            // console.log('Total sec: ', total_sec)

            // Mining percentage divided by total seconds in a day
            // Get mining unit
            const mining_unit = mining_percentage / (60*60*24);  
            // console.log('Mining unit:', mine_unit);
            const mine_unit = mining_unit.toFixed(6);

            // Total mining
            const balance = mine_unit * total_sec;
            const paid_out = balance+parseFloat(confirmReinvestment.amount);
            // console.log('Complete Mining bal: ', paid_out); 
            

            // Create record in the mining collections
            const mining = await Mining.create({
                user: confirmReinvestment.depositor, paid_out, investment_amount:confirmReinvestment.amount, 
                active_plan: confirmReinvestment.plan, 
                mining_unit: mine_unit, mining_completion_date
            });
            // console.log('Mining account created:', mining);

            // Update isConfirm in deposit collection
            let _updateReinvestment = await Reinvestment.findOneAndUpdate({_id: reinvest._id}, {isConfirm: true});
            // console.log('IsConfirm is updated: ', _updateReinvestment);
            
            sendEmail( 
                user.email, user.username,
                "Reinvestment Confirmation",
                `Your Reinvestment of $${reinvest.amount} is successful.  Your new mining session has started.` 
            );
            
            return res.status(401).json({success: 'Your reinvestment was successful. Your new mining session has started'});
        } catch (err) {
            return res.status(401).json({error: err.message});
        }
    },

    // Get promo plan
    get_promo: async (req, res) => {
        const context = {};

        try {
            const promo = await Promo.find({isRunning: true});
            context['promos'] = promo;
            return res.render('./userViews/list_promo', {context});

        } catch (error) { 
            console.log(error);
        }
    },

    // Promo payment
    get_promo_payment_page: async (req, res) => {
        const context = {};

        try {

            const promo = await Promo.findById(req.query.promo_id);

            // Get wallet address
            const address = await WalletAddress.find();
            
            context['promo'] = promo;

            context['address'] = address;
            return res.render('./userViews/promo_payment', {context});

        } catch (error) { 
            console.log(error);
        }
    },

    post_promo_deposit: async (req, res) => {

        const {currency, amount, transaction_id, promo_id} = req.body;

        try {
            const amountReg = /^[0-9\.]+$/;

            const IdReg = /^[A-Z a-z 0-9.]+$/;

            if (currency === '' || amount === '' || transaction_id ==='' || !amountReg.test(amount) ) {
                throw new Error('All fields are required');
            }

            if (!IdReg.test(transaction_id)) {
                throw new Error('Invalid wallet ID');
            }
            // Get the promo plan
            const promo = await Promo.findById(promo_id);
            if (promo === null) {
                throw new Error('Promo not found!!');
            }

            const fee = promo.activation;
            const minimum = fee.split('-');

            if (parseInt(amount) < parseInt(minimum[0])) {
                throw new Error(`You can join the promo with minimum of $${minimum[0]}`);
            }

            // Get the user
            const user = await User.findById(req.user.id);

            // Post deposit
            const pd = await PromoDeposit.create({
                user: req.user.id, promo: promo_id, 
                currency, amount, transaction_id
            });

            if (pd) {

                sendEmail(
                    process.env.EMAIL_USER, 
                    process.env.EMAIL_USER,
                    'Promo Deposit',
                    `${user.username} just made a deposit of $${amount} to your ${currency} wallet address`
                );

                return res.status(200).json({
                    success: 'Your promo deposit is processing and will be completed within few minutes!'
                });
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({error: error.message});
        }
    },

    transfer_promo: async (req, res) => {
        const {promo_id} = req.body;

        const amountReg = /^[0-9a-zA-Z\.]+$/;

        try {
            if (!amountReg.test(promo_id) ) {
                throw new Error('Invalid character!');
            }
    
            const promo_wallet = await PromoWallet.findById(promo_id);
            // console.log(promo_wallet);
    
            if (promo_wallet === null) {
                throw new Error('No such promo!');
            }
            
             //  // check if the user has completed his/her mining session
            if(promo_wallet.cashout_date <= new Date()){

                // Get total earning
                const t_earning = await TotalEarning.findOne({user: req.user.id});
                if (t_earning === null) {
                    // Create total eaning
                    const _earning = await TotalEarning.create({user: req.user.id, total: promo_wallet.total_earning});
                    // console.log('Total eaning created: ', _earning);
                }
                else{
                    // Update total earning
                    const sum = t_earning.total + parseFloat(promo_wallet.total_earning);
                    // Update total earning
                    const earning_update = await TotalEarning.findOneAndUpdate({user: req.user.id}, {total: sum});
                    // console.log('Total earrning has been updated: ', earning_update);
                }

                // Get user's wallet
                let w = await MiningWallet.findOne({user: req.user.id});
                // console.log('wallet balance: ', w)

                // Check if the wallet is null
                if (w === null) {
                    // create wallet
                    let cw = await MiningWallet.create({user: req.user.id, balance: promo_wallet.total_earning});
                    // console.log('Wallet created: ', cw);
                }
                else{
                    // Get current balance
                    const bal = parseFloat(w.balance) + parseFloat(promo_wallet.total_earning);
                    // console.log(`current bal: ${bal}`);
                    
                    // update the wallet with the new mining balance
                    let u = await MiningWallet.findOneAndUpdate({user: req.user.id}, {balance: bal});
                    // console.log('Wallet updated: ', u); 
                }   
 

                // update isPaid in confirm_deposit collection
                // This will make the mining stop and reset the mining balance to zero 
                let _up = await PromoWallet.findOneAndUpdate({user: req.user.id}, {isPaid: true});
                // console.log('Update ispaid deposit', _up);

                
                let msg = 'Promo Transfer successful. Your wallet has been updated.';
                return res.status(200).json({success: msg});

            }
            else{
                throw new Error('Your promo withdrawal is not due yet.');
            }
        } catch (error) {
            console.log(error);
            return res.status(401).json({error: error.message});
        }
        

    }
}