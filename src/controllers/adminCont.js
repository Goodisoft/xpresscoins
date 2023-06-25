

const Users = require('../models/userModel');

const Deposit = require('../models/deposit');

const confirmDeposit = require('../models/confirm_deposit');

const ReferralWallet = require('../models/referral_wallet');

const RefWithdrawal =  require('../models/referral_withdrawal');

const MiningWithdrawal =  require('../models/mining_withdrawal');

const WalletAddress = require('../models/wallet_address');

const MiningWallet = require('../models/mining_wallet');

const Plan = require('../models/plan');

const {addMonths, addDays, addHoursToDateTime} = require('../helpers/timeHandler');

const {sendEmail} = require('../helpers/send_mail');

const Reinvestment = require('../models/reinvestment');
const ReferralPaidOut = require('../models/referral_paid_out');
const PaidOut = require('../models/paid_out');
const Notice = require('../models/notice');
const Comment = require('../models/comment');
const Mining = require('../models/mining');
const Promo = require('../models/promo');
const { sendBulkEmail } = require('../helpers/send_bulk_email');
const PromoDeposit = require('../models/promo_deposit');
const PromoWallet = require('../models/promo_wallet');


module.exports = {

    get_admin_home: async (req, res) =>{

        const context = {};

        // Count members
        const count_members = await Users.find().count();
        count_members === null ?  context['count_members'] = 0 
        : context['count_members'] =  count_members;
        

        // Count blocked account
        const blocked_account = await Users.find({isBlock: true}).count();
        blocked_account == null ? context['blocked_account'] = 0 
        : context['blocked_account'] = blocked_account;

        const active_account = await Users.find({isBlock: false}).count();
        active_account == null ? context['active_account'] = 0 
        : context['active_account'] = active_account;

        
        // Get total members deposit
        const all_deposit = await Deposit.aggregate([
            {$group: {_id: null, sumDeposits: {$sum:'$amount'}}},
            {$project: {_id: 0}}
        ])
        all_deposit[0] == null ? context['all_deposit'] = 0 
        : context['all_deposit'] = all_deposit[0]['sumDeposits'];

        
        // Get total withdrawal
        const all_withdrawal = await MiningWithdrawal.aggregate([
            {$group: {_id: null, sumWithdrawal: {$sum: '$amount'}}},
            {$project: {_id: 0}}
        ])
        // Sum all paid withdrawal
        all_withdrawal[0] === undefined ? context['all_withdrawal'] = 0 
        : context['all_withdrawal'] = all_withdrawal[0]['sumWithdrawal'];

       
        // Get total members deposit that is approve
        const total_deposit = await confirmDeposit.aggregate([
            {$group: {_id: null, totalDeposit: {$sum: '$amount'}}},
            { $project: { _id: 0 } },
        ]);
        total_deposit[0] === undefined || total_deposit[0]['totalDeposit'] === undefined 
        ? context['total_deposit'] = 0 
        : context['total_deposit'] = total_deposit[0]['totalDeposit'];
  

        // Get total member withdrawal that has been approved
        const total_withdrawal = await confirmDeposit.aggregate([
             {$group: {_id: '$isPaid', totalWithdrawal: {$sum: '$amount'}}},
        ])
        total_withdrawal[0] === undefined || total_withdrawal[0]['_id'] === undefined 
        || total_withdrawal[0]['_id'] === false
        ? context['total_withdrawal'] = 0
        : context['total_withdrawal'] = total_withdrawal[0]['totalWithdrawal'];

        // Total wallet balance
        const total_balance = await MiningWallet.aggregate([
            {$group: {_id: null, totalBalance: {$sum: '$balance'}}},
            {$project: {_id: 0}}
        ]);
        total_balance[0] === null || total_balance[0]['totalBalance'] === undefined 
        ? context['total_balance'] = 0
        : context['total_balance'] = total_balance[0]['totalBalance'];
       
        // Get total referral statistic
        const referral_earning = await ReferralWallet.aggregate([
            {$group: {_id: null, totalRefEarning: {$sum: '$balance'}}},
            {$project: {_id: 0}}
        ])
        referral_earning[0] === undefined ? context['total_ref_earning'] = 0 
        : context['total_ref_earning'] = referral_earning[0]['totalRefEarning'];


        // Get total number of mining deposit that has not been confirm
        const  count_mining_d = await Deposit.find({isConfirm: false}).count();
        count_mining_d === null ? context['count_mining_deposit'] = 0 
        : context['count_mining_deposit'] = count_mining_d;

        // Get the total amount of the deposit that is not confirm
        const unconfirm_deposit = await Deposit.find({isConfirm: false});
        let total_unconfirm_deposit = 0;
        if (unconfirm_deposit === null) {
            context['unconfirm_deposit'] = 0;
        }
        else{
            unconfirm_deposit.forEach(d => {
                total_unconfirm_deposit +=  d.amount;
            });
            context['unconfirm_deposit'] = total_unconfirm_deposit;
        }

        // Get all withdrawal transaction that has not been paid
        const pending_withdrawal = await MiningWithdrawal.find({isPaid: false});
        let total_pending_withdrawal = 0;
        if (pending_withdrawal === null) {
            context['pending_withdrawal'] = 0
        }
        else{
            pending_withdrawal.forEach(w => {
                total_pending_withdrawal += w.amount;
            });
            context['pending_withdrawal'] = total_pending_withdrawal;
        }

        // Get total referral paid out
        const referral_paid_out = await ReferralPaidOut.aggregate([
            {$group: {_id: null, totalPayOut: {$sum: '$amount'}}},
            {$project: {_id: 0}}
        ]);
        referral_paid_out[0] === undefined ? context['total_ref_paid_out']
        : context['total_ref_paid_out'] = referral_paid_out[0]['totalPayOut']

        // Get total unpaid referral withdrawal request
        const total_referral_withdrawal = await RefWithdrawal.find({isPaid: false});
        let total_ref_withdrawal = 0;
        if (total_referral_withdrawal === null) {
            context['total_referral_withdrawal'] = 0
        }
        else{
            total_referral_withdrawal.forEach(ref => {
                total_ref_withdrawal += ref.amount;
            });
            context['total_referral_withdrawal'] = total_ref_withdrawal;
        }


        // Get total number of mining withdrawal that has not been paid
        const count_mining_w = await MiningWithdrawal.find({isPaid: false}).count();
        count_mining_w === null ? context['count_mining_withdrawal'] = 0 
        : context['count_mining_withdrawal'] = count_mining_w;


        // Get total number of referral withdrawal that has not been paid
        const count_ref_w = await RefWithdrawal.find({isPaid: false}).count();
        count_ref_w === null ? context['count_referral_withdrawal'] = 0 
        : context['count_referral_withdrawal'] = count_ref_w;

        const total_paid = await PaidOut.aggregate([
            {$group: {_id: null, totalPaid: {$sum: '$amount'}}},
            {$project: {_id: 0}}
        ]);
        total_paid[0] === undefined ? context['total_paid'] = 0 
        : context['total_paid'] = total_paid[0]['totalPaid'];

        // Count wallet address
        const count_address = await WalletAddress.find().count();
        context['count_address'] = count_address;

        // Count investment plans
        const count_plans = await Plan.find().count();
        context['count_plan'] = count_plans;

        return res.render('./adminViews/index', {context});
    },
  
     // Get all users page
    get_all_users: async (req, res) =>{

        const context = {};

        try {
            const _users = await Users.find();
            // console.log(_users);
            context['users'] = _users; 

            return res.render('./adminViews/users', {context});

        } catch (error) {
            context['error'] = 'Something went wrong. Try again';
            return res.render('./adminViews/users', {context});
        }

    },

    // Create admin
    create_admin: async (req,res) => {

        let context = {};

        const user_id = req.query.user_id;

        try {
            // Update the admin 
            let u = await Users.findOneAndUpdate({_id: user_id}, {isAdmin: 'true'});
            context['success'] = 'New admin has been created';
            return res.render('./adminViews/users', {context});

        } catch (error) {

            context['error'] = 'Something went wrong';
            return res.render('./adminViews/users', {context});
        }
        
    },

    // Remove admin
    remove_admin: async (req,res) => {

        let context = {};

        const user_id = req.query.user_id;

        try {
            // Update the admin 
            let u = await Users.findOneAndUpdate({_id: user_id}, {isAdmin: 'false'});
            context['success'] = 'Admin has been remove';
            return res.render('./adminViews/users', {context});

        } catch (error) {

            context['error'] = error.message;
            return res.render('./adminViews/users', {context});
        }
        
    },


    get_deposit: async (req, res) => {

        let context = {};

        try {
            const _deposit = await Deposit.find({isConfirm: false}).populate('user');

            context['deposit'] = _deposit;

            return res.render('./adminViews/deposit', {context});

        } catch (error) {
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/deposit', {context});
        }
    },

    confirm_deposit: async (req, res) => {

        let context = {};

        const deposit_id = req.query.payer;

        try {
            // Get the deposit
            let _deposit = await Deposit.findOne({$and: [{_id: deposit_id}, {isConfirm: false}]}).populate('user');
            // console.log('Get the deposit: ', _deposit);

            // Check if there is any new deposit
            if (_deposit === null) {
                context['error'] = 'No new deposit';
                return res.render('./adminViews/deposit', {context});
            }


            // Get plan
            const _plans = await Plan.find();
            // console.log(_plans);

            if (_plans === null) {
                context['error'] = 'Please customize plan';
                return res.render('./adminViews/deposit', {context});
            }

            let plan = '';

            _plans.forEach(p => {

                let _amount = p.activation;
                // console.log('Activation from db: ', _amount)
                const fee = _amount.split('-');
                // console.log('Splitted fee: ', fee)

                // Asign investment levels
                // Level 1
                if (parseFloat(_deposit.amount) >= parseFloat(fee[0]) && parseFloat(_deposit.amount) < parseFloat(fee[1])) {
                    plan = p.title;
                }
                
            });
            

            //  console.log('Activated Plan: ', plan);

            //  calculate referral percentage earning
            // Direct upline(referral) 10%
            let direct_upline_earning = 0;

            let upline2_earning = 0;

            // Calculate referral eearning
            direct_upline_earning = (parseInt(_deposit.amount) * 5) / 100; // Direct upline
            upline2_earning = (parseInt(_deposit.amount) * 3) / 100; // Level 2 upline
            
            // Get referrals
            let direct_upline = "";
            let upline2 = "";
            // console.log('Staking: ', _deposit.user.referral)

            if (_deposit.user.referral === undefined) {
                direct_upline = "";
                upline2 = ""; 
            } else {
                direct_upline = _deposit.user.referral.direct_referral; // Direct upline
                upline2 = _deposit.user.referral.level1_code; // Level 2 upline
            }


            let depositor = _deposit.user._id;
            let amount = _deposit.amount;

            // Initialize driect upline and upline2 earning to 0 is if there are no uplines
            if (direct_upline === "" ) {
                direct_upline_earning = 0;
            }

            if (upline2 === "" ) {
                upline2_earning = 0;
            }

            // console.log('Depositor: ', depositor);

            // console.log('Direct upline Code: ', direct_upline);
            // console.log('upline2 Code: ', upline2);
            // console.log('Amount: ', amount);
             
            
            if (direct_upline !== "") {
               // Credit the referral wallet
                // Create the referral wallet if the user has no wallet
                // Else, Update the existing wallet

                /**
                 * Create referral wallet for the direct upline
                 */
                let _referralWallet_direct_upline = await ReferralWallet.findOne({user_code: direct_upline});
                // console.log('Referral wallet direct upline : ', _referralWallet_direct_upline.balance);


                if (_referralWallet_direct_upline === null || _referralWallet_direct_upline.balance === undefined) {
                    // create an upline referral wallet
                    let create_ref_wallet = await ReferralWallet.create({user_code: direct_upline, balance: direct_upline_earning});
                    // console.log('Creeate direct upline Earning: ', create_ref_wallet);

                }
                else{ 

                    // console.log('Direct upline balance: ', _referralWallet_direct_upline.balance)
                    // Get the direct upline current wallet ballance
                    let ref_bal = parseFloat(_referralWallet_direct_upline.balance) + direct_upline_earning;
                    // console.log('Direct upline bal: ', ref_bal)
                    // Update Referral wallet
                    // Update the direct referral wallet 
                    let updateDirect_upline = await ReferralWallet.findOneAndUpdate({user_code: direct_upline}, {balance: ref_bal});
                    // console.log('Current Direct upline bal: ', updateDirect_upline);
                }
            }


            if (upline2 !== "") {
             
                /**
                 * Create referral wallet for upline 2
                 */
                let _referralWallet_upline2 = await ReferralWallet.findOne({user_code: upline2});
                // console.log('Referral wallet upline2 : ', _referralWallet_upline2.balance);

                if ( _referralWallet_upline2 === null || _referralWallet_upline2.balance === undefined) {

                    // Create upline2 referral wallet
                    let create_ref_wallet_upline2 = await ReferralWallet.create({user_code: upline2, balance: upline2_earning});
                    // console.log('Creeate an upline2 Earning: ', create_ref_wallet_upline2);
                }
                else{

                    // Get the direct upline current wallet ballance
                    let ref_bal = parseInt(_referralWallet_upline2.balance) + upline2_earning; 

                    // Update upline2 referral wallet
                    let upline2_ref_wallet = await ReferralWallet.findOneAndUpdate({user_code: upline2}, {balance: ref_bal});
                    // console.log('Current upline 2 bal: ', upline2_ref_wallet);
                }
            }


            // Create record in Confirm depsoit collection
            let _confirmDeposit = await confirmDeposit.create({depositor, deposit_id, plan, amount, direct_upline, upline2, direct_upline_earning, upline2_earning});
            // console.log('Confirm deposit: ', _confirmDeposit);

            // Update isConfirm in deposit collection
            let _updateDepsoit = await Deposit.findOneAndUpdate({_id: deposit_id}, {isConfirm: true});
            // console.log('IsConfirm is updated: ', _updateDepsoit);


            // Calculate the mining percent
            const date = new Date(_confirmDeposit.confirm_date);  

            // Holds mining percentage
            let mining_percentage = 0;
            let mining_completion_date;

            if (_plans !== null) {
                _plans.forEach(p => {
                    // check mining plan which will help to calculate %
                    // Also add the expected completion date base on plan
                    if (_confirmDeposit.plan === p.title) {
                        
                        // Add 3 days to the confirmation date
                        // This will help to track when the mining session has been completed
                        mining_completion_date = addDays(parseInt(p.duration), date);
                        
                        //  Get deposit amount which will be use to calculate earning %
                        // Earning % will be use for the calculation of the mining unit
                        mining_percentage = (parseFloat(_confirmDeposit.amount) * parseFloat(p.profit)) / 100;

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
            const bal = mine_unit * total_sec;
            const paid_out = bal+parseFloat(_confirmDeposit.amount);
            // console.log('Complete Mining bal: ', paid_out); 
            

            // Create record in the mining collections
            const mining = await Mining.create({
                user: depositor, paid_out, investment_amount:_confirmDeposit.amount, active_plan: _confirmDeposit.plan, 
                mining_unit: mine_unit, mining_completion_date
            });
            // console.log('Mining created: ', mining);
            
            // send Deposit confirmation mail 
            sendEmail( 
                _deposit.user.email, _deposit.user.username,
                "Transaction Confirmation",
                `Your mining deposit has been confirm successfully. plan: ${plan}, currency: ${_deposit.currency},  amount: $ ${amount},  Please click the button below to login and view your account` 
            );

            context['success'] = 'Deposit confirm successfully';

            return res.render('./adminViews/deposit', {context});

        } catch (error) {
            // console.log(error)
            context['error'] = error.message;
            return res.render('./adminViews/deposit', {context});
        }
    },

    // Get referral withdrawal request
    get_referral_withdrawal: async (req, res) =>{

        let context = {} ;

        try {
            // Get referral withdrawl request 
            let _w = await RefWithdrawal.find({isPaid: false}).populate('user');
            context['withdrawals'] = _w;
            return res.render('./adminViews/referral_withdrawal', {context});

        } catch (error) {
            // console.log(error)
            context['error'] = 'Something went wrong. Try again';
            return res.render('./adminViews/referral_withdrawal', {context});
        }
    },

    // Confirm referral deposit
    confirm_referral_withdrawal: async (req, res) =>{

        let context = {};

        let withdrawal_id = req.query.wit_id;

        try {
            // Get the withdrawal by ID
            let _d = await RefWithdrawal.findOne({$and: [{_id: withdrawal_id}, {isPaid: false}]});
            // console.log('Referral withdrawal: ', _d);

            if (_d === null) {
                context['error'] = 'No such withdrawal request';
                return res.render('./adminViews/referral_withdrawal', {context});   
            }

            // Update isPaid  in referral withdrawal collection
            let _update = await RefWithdrawal.findOneAndUpdate({_id: withdrawal_id}, {isPaid: true});

            // Track total referral paid out
            const referral_paid = await ReferralPaidOut.create({
                user: _d.user,
                paid_id: _d._id,
                amount: _d.amount
            })

            sendEmail( 
                _d.user.email, _d.user.username,
                "Withdrawal Confirmation",
                `Your referral withdrawal of $${_d.amount} has been paid to your ${_d.currency} wallet address.  Kindly click the button below to login and view your account` 
            );

            context['success'] = 'Transaction confirm successfully';
            return res.render('./adminViews/referral_withdrawal', {context});      
            
        } catch (error) {
            // console.log(error)
            context['error'] = 'Something went wrong. Try again';
            return res.render('./adminViews/referral_withdrawal', {context});     
        }

    },

    get_mining_withdrawal: async (req, res) =>{

        let context ={};

        // Get all mining withdrawal request
        let w = await MiningWithdrawal.find({isPaid: false}).populate('user');
        context['withdrawals'] = w;

        return res.render('./adminViews/mining_withdrawal', {context});
    },

    // confirm mining withdrawal
    confirm_mining_withdrawal: async (req, res) =>{

        let context = {};

        let withdrawal_id = req.query.wit_id;

        try {
            // Get the withdrawal by id
            let w = await MiningWithdrawal.findOne({$and: [{_id: withdrawal_id}, {isPaid: false}]}).populate('user');

            if (w === null) {
                context['error'] = 'No such withdrawal request';
                return res.render('./adminViews/mining_withdrawal', {context});   
            }

            // Update isPaid in mining withdrawal collection to true
            let u = await MiningWithdrawal.findOneAndUpdate({_id: withdrawal_id}, {isPaid: true});
            // console.log('Updated: ', u);

            // Track paid out
            const paid_out = await PaidOut.create({
                user: w.user,
                currency: w.currency,
                amount: w.amount
            });

            sendEmail( 
                w.user.email, w.user.username,
                "Withdrawal Confirmation",
                `Your withdrawal of $${w.amount} has been paid to your ${w.currency} wallet address.  Kindly click the button below to login and view your account` 
            );
            

            context['success'] = 'Transaction confirm successfully';
            return res.render('./adminViews/mining_withdrawal', {context});

        } catch (error) {
            // console.log(error);
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/mining_withdrawal', {context});
        }
    },

    // Get add wallet address page
    add_wallet_page: (req, res) => {
        return res.render('./adminViews/post_wallet');
    },

    // Post wallet address
    post_wallet_address: async (req, res) =>{

        const {currency, wallet_address} = req.body;

        if (currency.length < 1 || wallet_address.length < 1) {
            let err = 'All fields are required';
            return res.status(401).json({error: err});
        }

        try {
            // Post wallet address
            const _address = await WalletAddress.create({user: req.user.id, currency, wallet_address});
            // console.log('Wallet added: ', _address);
            return res.status(200).json({success: 'Wallet added successfully'});
        } catch (error) {
            let err = 'Something went wrong. Please try again';
            return res.status(401).json({error: err});
        }
    },

    edit_trading_deposit: async (req, res) => {
        
        let context = {};

        const trans_id = req.query.trans_id;

        try {
            const trans = await Staking.findById({_id: trans_id});
            context['trans'] = trans;
            return res.render('./adminViews/edit_staking', {context})
        } catch (error) {
            console.log(error);
        }
    },

    post_edit_trading: async (req, res) =>{
        const {amount, trans_id} = req.body;

        if(amount.length < 1){
            return res.status(401).json({error: 'Something went wrong'});
        }

        try {
            // Update transaction
            const u = await Staking.findOneAndUpdate({_id: trans_id}, {amount});
            return res.status(200).json({success: 'Transaction edited successfully'});
        } catch (error) {
            console.log(error);
            return res.status(401).json({error: 'Something went wrong'});

        }
    },

    edit_mining_deposit: async (req, res) => {
        
        let context = {};

        const trans_id = req.query.trans_id;

        try {
            const trans = await Deposit.findById({_id: trans_id}).populate('user');
            context['trans'] = trans;
            return res.render('./adminViews/edit_mining', {context})
        } catch (error) {
            console.log(error);
        }
    },

    post_edit_mining: async (req, res) =>{
        const {amount, trans_id} = req.body;

        if(amount.length < 1){
            return res.status(401).json({error: 'Something went wrong'});
        }

        try {
            // Update transaction
            const u = await Deposit.findOneAndUpdate({_id: trans_id}, {amount});
            return res.status(200).json({success: 'Transaction edited successfully'});
        } catch (error) {
            // console.log(error);
            return res.status(401).json({error: 'Something went wrong'});

        }
    },

    get_user_account: async (req, res) => {

        let context = {};

        try {

            const u = await MiningWallet.find().populate('user');
            context['users'] = u;
            return res.render('./adminViews/user_account', {context});
        } catch (error) {
            console.log(error);
        }
    },

    edit_user_account: async (req, res) => {

        let context = {};

        // Get wallet ID
        const wallet_id = req.query.wallet_id;

        try {
            // Get the wallet and the user ifo
            const w = await MiningWallet.findById(wallet_id).populate('user');
            context['user'] = w;
            return res.render('./adminViews/edit_wallet', {context});

        } catch (error) {
            console.log(error);
        }
    },

    post_edit_balance: async (req, res) =>{
        // console.log(req.body);

        const {wallet_id, balance, comment} = req.body;

        if (wallet_id.length < 5 || balance.length < 1) {
            let err = 'All fields are required';
            return res.status(401).json({error: err});
        }

        try {
            // Post wallet address
            const _w = await MiningWallet.findOneAndUpdate({_id: wallet_id}, {balance});
            // console.log('Balance updated: ', _w);

            // Post comment
            if (comment !== '') {
                // Insert comment
                const _comment = await Comment.create({user: _w.user, comment});
            }

            return res.status(200).json({success: 'Changes seaved successfully'});
        } catch (error) {
            let err = 'Something went wrong. Please try again';
            return res.status(401).json({error: err});
        }
    },

    get_plan: async (req, res) =>{
        return res.render('./adminViews/add_plan');
    },

    post_plan: async (req, res) =>{

        const {title, profit, duration, activation} = req.body;

        if (title.length < 1 || profit.length < 1 || duration.length < 1 || activation.length < 1) {
            let err = 'All fields are required';
            return res.status(401).json({error: err});
        }

        try {
            // Post wallet address
            const _w = await Plan.create({user: req.user.id, title, profit, duration, activation});
            // console.log(_w);
            return res.status(200).json({success: 'Plan save successfully'});
        } catch (error) {
            let err = 'Something went wrong. Please try again';
            return res.status(401).json({error: err});
        }
    },

    view_plan: async (Req, res ) =>{
        const context = {};

        try {

            const u = await Plan.find();
            context['plans'] = u;
            return res.render('./adminViews/view_plans', {context});
        } catch (err) {
            console.log(err);
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/view_plans', {context});
        }
    },

    edit_plan: async (req, res )=>{

        let context = {};

        const planId = req.query.plan_id;
        // console.log(planId)

        try {
            // Update the admin 
            let u = await Plan.findOne({_id: planId});
            // console.log(u); 
            context['plan'] = u;
            return res.render('./adminViews/edit_plan', {context});

        } catch (error) {

            context['error'] = 'Something went wrong';
            return res.render('./adminViews/view_plans', {context});
        }
    },

    post_edit_plan: async (req, res )=>{

        const {plan_id, profit, duration, activation} = req.body;

        if (plan_id.length < 1 || profit.length < 1 || duration.length < 1 || activation.length < 1) {
            let err = 'All fields are required';
            return res.status(401).json({error: err});
        }
 
        try {  
 
            // Post wallet address
            const _w = await Plan.findOneAndUpdate({_id: plan_id}, {profit, duration, activation});
            // console.log(_w);
            return res.status(200).json({success: 'Plan updated successfully'});
        } catch (e) {
            console.log(e)
            let err = 'Something went wrong. Please try again';
            return res.status(401).json({error: err});
        }
    },

    cancel_withdrawal: async (req, res) => {

        const context = {};

        try {
            //  get the withdrawal
            const w = await MiningWithdrawal.findById(req.query.trans_id);
            if(w === null){
                throw new Error('Withdrawal not found');
            }

            // refund the withdrawal amount to the user wallet
            // Get current wallet address
            const c = await MiningWallet.findOne({user: w.user});
            const new_balance = w.amount + c.balance;

            // Update user wallet
            const current = await MiningWallet.findOneAndUpdate({user: w.user}, {balance:  new_balance});

            // Delete withdrawal request
            const drawal = await MiningWithdrawal.findOneAndDelete({_id: req.query.trans_id});

            context['success'] = 'Withdrawal amount has been refunded';
            return res.render('./adminViews/mining_withdrawal', {context});
        } catch (error) {
            context['error'] = error.message;
            return res.render('./adminViews/mining_withdrawal', {context});
        }
    },

    delete_deposit: async (req, res) => {
        const context = {};

        try {
            // Update withdrawal request
            const delet = await Deposit.findOneAndDelete(
                {_id: req.query.trans_id}
            );
            context['success'] = 'Transaction has been deleted';
            return res.render('./adminViews/deposit', {context});
        } catch (error) {
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/deposit', {context});
        }
    },

    get_reinvestment: async (req, res) => {

        const context = {};
        try {
            // Get reinvestments
            const reinvestments = await Reinvestment.find().populate('user');
            context['reinvestments'] = reinvestments;
            return res.render('./adminViews/reinvestment', {context});

        } catch (error) {
            console.log(error);
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/reinvestment', {context});
        }

    },

    confirm_reinvestment: async (req, res) => {
        let context = {};

        const trans_id = req.query.trans_id;

        try {
            // Get the deposit
            let _reinvestment = await Reinvestment.findOne({$and: [{_id: trans_id}, {isConfirm: false}]}).populate('user');
            // console.log('Get the deposit: ', _reinvestment);

            // Check if there is any new deposit
            if (_reinvestment === null) {
                context['error'] = 'No new reinvestment';
                return res.render('./adminViews/reinvestment', {context});
            }

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
                if (parseFloat(_reinvestment.amount) <= parseFloat(fee[1]) && parseFloat(_reinvestment.amount) >= parseFloat(fee[0])) {
                    plan = p.title;
                }
                
            });

            //  console.log('Activated Plan: ', plan);

            // Create record in Confirm depsoit collection
            // let confirmReinvestment = await confirmDeposit.create({
            //     depositor:_reinvestment.user._id, trans_id, plan, 
            //     amount: _reinvestment.amount, direct_upline: '', upline2: '', 
            //     direct_upline_earning: 0, 
            //     upline2_earning: 0
            // });
            // console.log('Confirm reinvestment: ', confirmReinvestment);

            // Update isConfirm in deposit collection
            let _updateReinvestment = await Reinvestment.findOneAndUpdate({_id: trans_id}, {isConfirm: true});
            // console.log('IsConfirm is updated: ', _updateReinvestment);
            
            sendEmail( 
                _reinvestment.user.email, _reinvestment.user.username,
                "Reinvestment Confirmation",
                `Your Reinvestment of $${_reinvestment.amount} is successful.  Kindly click the button below to login and view your account` 
            );

            context['success'] = 'Deposit confirm successfully';

            return res.render('./adminViews/reinvestment', {context});

        } catch (error) {
            // console.log(error)
            context['error'] = error.message;
            return res.render('./adminViews/reinvestment', {context});
        }

    },

    get_wallet_address: async (req, res) => {
        const context = {};

        try {

            const address = await WalletAddress.find();
            context['addresses'] = address;
            return res.render('./adminViews/view_wallet_address', {context});
        } catch (err) {
            // console.log(err);
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/view_wallet_address', {context});
        }
    },

    delete_wallet: async (req, res) => {
        const context = {};
        console.log(req.query.address_id)
        try {
            // Update withdrawal request
            const address = await WalletAddress.findOneAndDelete(
                {_id: req.query.address_id}
            );
            context['success'] = 'Wallet address has been deleted';
            return res.render('./adminViews/view_wallet_address', {context});
        } catch (error) {
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/view_wallet_address', {context});
        }
    },

    view_confirm_deposit: async (req, res) => {
        const context = {};
        try {
            const c = await confirmDeposit.find({isConfirm: true})
            .populate('depositor').populate('deposit_id');

            context['confirm_deposits'] = c;
            return res.render('./adminViews/view_confirm_deposit', {context});
            
        } catch (error) {
            // console.log(error);
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/view_confirm_deposit', {context});
        }

    },

    view_paid_out: async (req, res) => {
        const context = {};

        try {
            const p = await PaidOut.find().populate('user');
            context['paid_outs'] = p;
            return res.render('./adminViews/paid_out', {context});

        } catch (error) {
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/paid_out', {context});
        }
    }, 

    get_notice: async (req, res) => {
        return res.render('./adminViews/post_notice');
    },

    post_notice: async (req, res) => {
        const {title, comment} = req.body;
        const commentReg = /^[a-zA-z0-9\s.,!':#%$+=()]+$/;
        try {

            if (!commentReg.test(title)) {
                throw new Error('Invalid character in the title');
            }
            if (!commentReg.test(comment)) {
                throw new Error('Invalid character in the comment');
            }
            // Create comment
            const n = await Notice.create( {admin: req.user.id, title, comment} );

            return res.status(200).json({success: 'Notice has been publish to users'});

        } catch (error) {
            // console.log(error);
            return res.status(500).json({error: error.message});
        }
    },

    view_notice: async (req, res) => {
        const context = {};
        try {
            const n = await Notice.find().populate('admin');
            context['notices'] = n;
            return res.render('./adminViews/view_notice', {context});

        } catch (error) {
            // console.log(error);
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/view_notice', {context});
        }
    },

    delete_notice: async (req, res) => {
        const context = {};
        try {
            const n = await Notice.findByIdAndDelete(req.query.notice_id);
            context['success'] = 'Notce deleted successfully';
            return res.render('./adminViews/view_notice', {context});

        } catch (error) {
            context['error'] = error.message;
            return res.render('./adminViews/view_notice', {context});
        }        
    },

    view_referral: async (req, res) => {

        const context = {};
        try {
            
            // Get all downlines
            const downlines =  await Users.find({isAdmin: false}, {password: 0, __v: 0}); 

            let affiliates = {};

            for (const user of downlines) {
            affiliates[user.username] = { user: user.username, direct_downlines: [], indirect_downlines: [] };

                for (const downline of downlines) {
                    if (user.code === downline.referral.direct_referral) {
                        affiliates[user.username].direct_downlines.push(downline.username);
                    }

                    if (user.code === downline.referral.level1_code) {
                        affiliates[user.username].indirect_downlines.push(downline.username);
                    }

                }
            }

            // console.log(affiliates);

            context['downlines'] = affiliates;

            return res.render('./adminViews/view_referral', {context});

        } catch (error) {
            context['error'] = error.message;
            return res.render('./adminViews/view_referral', {context});
        }
    },

    get_referral_wallet: async (req, res) => {
        const context = {};
 
        try {
            // Get referral wallet
            const u = await ReferralWallet.findOne({user_code: req.query.wallet_code})
            context['referral_wallet'] = u;
            return res.render('./adminViews/edit_referral_wallet', {context});

        } catch (error) {
            context['error'] = error.message;
            return res.render('./adminViews/edit_referral_wallet', {context});
        }
    },

    update_referral_bal: async (req, res) => {
        const {user_code, balance, comment} = req.body;

        const commentReg = /^\s*[a-zA-z0-9\s.,!':#%$+=()]*$/;

        try {
            if (!commentReg.test(comment)) {
                throw new Error('Invalid character in the comment');
            }

            const w = await ReferralWallet.findOneAndUpdate(
                {user_code}, {balance}
            );
            // Get the user
            const user = await User.findOne({code: user_code});

            if (comment !== '') {
                // Insert comment
                const _comment = await Comment.create({user: user._id, comment});
            }
            

            return res.status(200).json({success: 'Referral balance has been updated'});

        } catch (error) {
            return res.status(500).json({error: error.message});
        }

    },

    view_comment: async (req, res) => {
        const context = {};
        try {
            const n = await Comment.find().populate('user');
            context['comments'] = n;
            return res.render('./adminViews/view_comments', {context});

        } catch (error) {
            // console.log(error);
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/view_comments', {context});
        }
    },

    delete_comment: async (req, res) => {
        const context = {};
        try {
            const n = await Comment.findByIdAndDelete(req.query.comment_id);
            context['success'] = 'Comment deleted successfully';
            return res.render('./adminViews/view_comments', {context});

        } catch (error) {
            context['error'] = error.message;
            return res.render('./adminViews/view_comments', {context});
        }        
    },

    get_mining_accounts: async (req, res) => {
        const context = {};
        try {
            const mining = await Mining.find().populate('user');
            // console.log(mining);
            context['minings'] = mining;
            return res.render('./adminViews/view_mining_account', {context});

        } catch (error) {
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/view_mining_account', {context});
        }
    },

    get_edit_mining_session: async (req, res) => {
        const context = {};
        try {
            const mining = await Mining.findOne({_id: req.query.mining_id}).populate('user');
            // console.log(mining);
            context['mining'] = mining;
            return res.render('./adminViews/edit_mining_session', {context});

        } catch (error) {
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/edit_mining_session', {context});
        }
    },

    update_mining_session: async (req, res) => {
        const {investment_amount, withdrawal_day, mining_id, comment} = req.body;

        const commentReg = /^\s*[a-zA-z0-9\s.,!':#%$+=()]*$/;

        try {
            if (!commentReg.test(comment)) {
                throw new Error('Invalid character in the comment');
            }

            // Get mining session account
            const mining_sessions = await Mining.findById(mining_id);
            console.log(mining_sessions);
            if (mining_sessions  === null) {
                throw new Error('No mining account found');
            }
            // Get plan
            const _plans = await Plan.find();

            if (_plans === null) {
                throw new Error('Please customize plan');
            }

           

            // Holds mining percentage
            let mining_percentage = 0;

            if (_plans !== null) {
                _plans.forEach(p => {
                    const amount = p.activation.split('-');
                    // check mining plan which will help to calculate %
                    // Also add the expected completion date base on plan
                    if (investment_amount <= parseFloat(amount[1]) && investment_amount >= parseFloat(amount[0])) {
                        
                        //  Get deposit amount which will be use to calculate earning %
                        // Earning % will be use for the calculation of the mining unit
                        mining_percentage = (parseFloat(investment_amount) * parseFloat(p.profit)) / 100;

                    }
                });
            }

            let mining_completion_date;

            if (withdrawal_day !== '') {
                  // Add Withdrawal day
                mining_completion_date = addDays(parseInt(withdrawal_day), mining_sessions.confirm_date);
            }
            else{
                mining_completion_date = new Date(mining_sessions.confirm_date);
            }
          

            // console.log('Mining completion date: ',mining_completion_date);
            // console.log('Mining percentage: ', mining_percentage);

            // Total seconds to complete mining
            // Add months minus confirm date
            const total_sec = Math.abs(new Date(mining_sessions.confirm_date).getTime() - mining_completion_date.getTime())/1000;
            // console.log('Total sec: ', total_sec)

            // Mining percentage divided by total seconds in a day
            // Get mining unit
            const mine_unit = mining_percentage / (60*60*24);  
            // console.log('Mining unit:', mine_unit);
            const mining_unit = mine_unit.toFixed(6)

            // Total mining
            const bal = mine_unit * total_sec;
            const paid_out = bal+parseFloat(investment_amount);
            // console.log('Complete Mining bal: ', paid_out); 
            

            // Create record in the mining collections
            const mining = await Mining.findOneAndUpdate(
                {_id: mining_id}, {investment_amount, mining_completion_date, mining_unit}
            );
            // console.log('Mining updated: ', mining);
            

            if (comment !== '') {
                // Insert comment
                const _comment = await Comment.create({user: mining_sessions.user, comment});
            }
            
            return res.status(200).json({success: 'Mining bonus has been added'});

        } catch (error) {
            console.log(error);
            return res.status(500).json({error: error.message});
        }

    },

    create_promo_plan: (req, res) => {
        return res.render('./adminViews/promo');
    },

    post_promo_plan: async (req, res) => {
        const {title, profit, duration, activation} = req.body;

        try {
            if (title.length < 1 || profit.length < 1 || duration.length < 1 || activation.length < 1) {
                throw new Error('All fields are required');
            }

            // Post wallet address
            const _w = await Promo.create({user: req.user.id, title, profit, duration, activation});
            console.log(_w);
            return res.status(200).json({success: 'Promo Created successfully'});
        } catch (error) {
            console.log(error);
            return res.status(500).json({error: error.message});
        }
    },

    view_promo_plan: async (Req, res ) =>{
        const context = {};

        try {
            const p = await Promo.find();
            context['promo_plans'] = p;
            return res.render('./adminViews/view_promo_plan', {context});
        } catch (err) {
            console.log(err);
            context['error'] = 'Something went wrong';
            return res.render('./adminViews/view_promo_plan', {context});
        }
    },

    edit_promo_plan: async (req, res )=>{

        const context = {};

        try {
            // Update the admin 
            let u = await Promo.findOne({_id: req.query.promo_id});
            // console.log(u); 
            context['promos'] = u;
            return res.render('./adminViews/edit_promo', {context});

        } catch (error) {

            context['error'] = 'Something went wrong';
            return res.render('./adminViews/edit_promo', {context});
        }
    },

    post_edited_promo: async (req, res )=>{

        const {promo_id, profit, duration, activation} = req.body;

        try {  

            if (promo_id.length < 1 || profit.length < 1 || duration.length < 1 || activation.length < 1) {
               throw new Error('All fields are required');
            }
 
            // Post wallet address
            const _w = await Promo.findOneAndUpdate({_id: promo_id}, {profit, duration, activation});
            // console.log(_w);
            return res.status(200).json({success: 'Promo plan has been updated successfully'});
        } catch (e) {
            console.log(e)
            return res.status(401).json({error: error.message});
        }
    },

    start_promo: async (req, res) => {
        const context = {};

        try {
            const p = await Promo.findOneAndUpdate({_id: req.query.promo_id}, {isRunning: true});

            // Get all users
            const users = await Users.find();
            const email_addresses = [];
            users.forEach(user => {
                email_addresses.push(user.email);
            });

            // send bulk email
            sendBulkEmail(email_addresses, `Earn Big With Our ${p.title}!`, 
            `${p.title} enables you to earn ${p.profit}% within 
            ${p.duration} hours when you invest withn ${p.activation}$.
            \n\nHurry now and participate on the promo.`,)

            context['success'] = 'Promo publish successfully';
            return res.render('./adminViews/view_promo_plan', {context});

        } catch (error) {
            context['error'] = error.message;
            return res.render('./adminViews/view_promo_plan', {context});
        }
    },

    stop_promo: async (req, res) => {
        const context = {};

        try {
            const p = await Promo.findOneAndUpdate({_id: req.query.promo_id}, {isRunning: false});

            // Get all users
            const users = await Users.find();
            const email_addresses = [];
            users.forEach(user => {
                email_addresses.push(user.email);
            });

            // send bulk email
            sendBulkEmail(email_addresses, `End Of ${p.title}!!`, 
            `${p.title} that enables you to earn ${p.profit}% within 
            ${p.duration} hours when you invest withn ${p.activation}$ has just ended.
            \n\nCongratulations to those that participated in the promo.`,)

            context['success'] = 'Promo has stop running';
            return res.render('./adminViews/view_promo_plan', {context});

        } catch (error) {
            context['error'] = error.message;
            return res.render('./adminViews/view_promo_plan', {context});
        }
    },

    delete_promo: async (req, res) => {
        const context = {};

        try {
            const p = await Promo.findOneAndDelete({_id: req.query.promo_id});
            context['success'] = 'Promo has been deleted';
            return res.render('./adminViews/view_promo_plan', {context});

        } catch (error) {
            context['error'] = error.message;
            return res.render('./adminViews/view_promo_plan', {context});
        }
    },

    send_bulk_email: async (req, res) => {
        return res.render('./adminViews/bulk_email');
    },

    post_send_bulk_email: async (req, res )=>{
        const {subject, message} = req.body;
        const msgReg = /^[a-zA-z0-9\s.,!':#%$+=()]+$/;
        try {

            if (!msgReg.test(subject)) {
                throw new Error('Invalid character in the subject');
            }
            if (!msgReg.test(message)) {
                throw new Error('Invalid character in the message');
            }

            // Get all users
            const users = await User.find();
            const email_addresses = [];
            users.forEach(user => {
                email_addresses.push(user.email);
            });

            // send bulk email
            sendBulkEmail(email_addresses, subject, message);
            
            return res.status(200).json({success: 'Bulk email has been sent to all users'});

        } catch (error) {
            console.log(error);
            return res.status(500).json({error: error.message});
        }
    },

    get_promo_deposit: async (req, res) => {
        const context = {};

        try {
            const pd = await PromoDeposit.find({isConfirm: false}).populate('user');

            context['deposit'] = pd;

            return res.render('./adminViews/promo_deposit', {context});

        } catch (error) {
            context['error'] = error.message;
            return res.render('./adminViews/promo_deposit', {context});
        }
    },

    confirm_promo_deposit: async (req, res) => {
        const context = {};

        try {
            // Get the deposit
            const promoDeposit = await PromoDeposit.findOne({$and: [{_id: req.query.promo_id}, {isConfirm: false}]})
            .populate('user').populate('promo');
            // console.log('Get the promo deposit: ', promoDeposit);

            // Check if there is any new deposit
            if (promoDeposit === null) {
                context['error'] = 'No such deposit';
                return res.render('./adminViews/promo_deposit', {context});
            }

            // Check minimum and maximum
            const activation = promoDeposit.promo.activation;
            const activated_amount = activation.split('-');

            let percent = 0;
            // check user deposit range
            if (promoDeposit.amount <= parseFloat(activated_amount[1]) 
            && parseFloat(promoDeposit.amount) >= parseFloat(activated_amount[0])) {
                // calculate earning percentage
                percent =  (promoDeposit.amount * parseFloat(promoDeposit.promo.profit)) / 100;
            }

            // Total promo earning
            const totalEarning = percent + promoDeposit.amount;
            // console.log('Percentage: ', percent);
            // console.log('totalEarning: ', totalEarning);

            // Completion time
            const cashout_date = addHoursToDateTime(promoDeposit.promo.duration, new Date());
            // console.log('Current time: ', new Date());
            // console.log('cashout time: ', cashout_date);

            // Insert to the promo wallet
            const promo_wallet = await PromoWallet.create({
                user: promoDeposit.user._id, total_earning: totalEarning,
                investment_amount: promoDeposit.amount, promo_title: promoDeposit.promo.title,
                cashout_date
            });
            // console.log('Promo confirmed: ', promo_wallet);

            // Update promo deposit 
            const update_promo_deposit =  await PromoDeposit.findOneAndUpdate({_id: req.query.promo_id}, {isConfirm: true})
            // console.log(('Promo deposit has been updated', update_promo_deposit));


             // send Deposit confirmation mail 
            sendEmail( 
                promoDeposit.user.email, promoDeposit.user.username,
                "Promo Transaction Confirmation",
                `Your promo deposit has been confirm successfully. 
                Promo title: ${promoDeposit.promo.title}, 
                currency: ${promoDeposit.currency},  amount: $ ${promoDeposit.amount},  
                Please click the button below to login and view your account` 
            );

            context['success'] = 'Promo deposit confirm successfully';

            return res.render('./adminViews/promo_deposit', {context});

        } catch (error) {
            // console.log(error)
            context['error'] = error.message;
            return res.render('./adminViews/promo_deposit', {context});
        }
    },

    delete_promo_deposit: async (req, res) => {
        const context = {};

        try {
            // Update withdrawal request
            const delet = await PromoDeposit.findOneAndDelete(
                {_id: req.query.promo_id}
            );
            // console.log(delet);
            context['success'] = 'Promo transaction has been deleted';
            return res.render('./adminViews/promo_deposit', {context});
        } catch (error) {
            context['error'] = error.message;
            return res.render('./adminViews/promo_deposit', {context});
        }
    }

}

