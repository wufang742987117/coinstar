(function() {
    'use strict';
    angular
        .module('app')
        .factory('PrivateService', PrivateService);

    function PrivateService($http, $cookies, $rootScope, $location, $translate, FlashService,CONFIG, UserTokenService, $q) {
        let service = {};

        var SERVER = CONFIG.private;


        service.debug = true;
        service.SERVER = SERVER;
        service.Balances = Balances;
        service.Balance = Balance;
        service.SetPassword = SetPassword;
        service.SetPhone = SetPhone;


        service.BindEmail = BindEmail;
        service.ChangeEmail = ChangeEmail;
        service.BindPhone = BindPhone;
        service.ChangePhone = ChangePhone;
        service.getApi = getApi;
        service.postApi = postApi;
        service.createTfa = createTfa;
        service.enableTfa = enableTfa;
        service.deleteTfa = deleteTfa;
        service.changeTpass = changeTpass;
        service.createTpass = createTpass;
        service.resetTpass = resetTpass;
        service.setTpass = setTpass;

        service.googleCodeget=googleCodeget;
        service.googleCodeset=googleCodeset;
        service.setSecurity=setSecurity;
        service.getVerifyType=getVerifyType;

        service.checkTpass = checkTpass;
        service.getActiveOrders = getActiveOrders;
        service.createOrder = createOrder;
        service.getSafetySettings=getSafetySettings;
        service.createTransactionOrder = createTransactionOrder;
        service.createMarketOrder = createMarketOrder;//创建市场订单
        service.deleteOrder = deleteOrder;
        service.getTradingPairs = getTradingPairs;
        service.getAssets = getAssets;
        service.getDepositAddress = getDepositAddress;
        service.getOrderHistory = getOrderHistory;
        service.getTxs = getTxs;

        service.checkPhone=checkPhone;

        service.getCurrentTCommission = getCurrentTCommission;
        service.getHistoryTCommission = getHistoryTCommission;
        service.getTradesFromOrders = getTradesFromOrders;
        service.getWithdrawalHistory = getWithdrawalHistory;

        service.Giftcode = Giftcode;
        service.FiatOfflineDeposit = FiatOfflineDeposit;
        service.FiatDepositOptions = FiatDepositOptions;
        service.getSettings = getSettings;
        service.ListBankAccounts = ListBankAccounts;
        service.AddBankAccount=AddBankAccount;
        service.fiatWithdrawal = fiatWithdrawal;
        service.ListAssetAccounts = ListAssetAccounts;
        service.AddAssetAccount = AddAssetAccount;
        service.coinWithdrawal = coinWithdrawal;
        service.UnbindBankAccount = UnbindBankAccount;
        service.UnbindAddress = UnbindAddress;

        service.KycBasicInfo = KycBasicInfo;
        service.KycInfo = KycInfo;
        service.KycLevelUp = KycLevelUp;

        service.getDepositHistory = getDepositHistory;
        service.getWithdrawalCoinHistory = getWithdrawalCoinHistory;
        service.getWithdrawalFiatHistory = getWithdrawalFiatHistory;
        service.getDepositCoinHistory = getDepositCoinHistory;
        service.getStoreHistory=getStoreHistory;
        service.getDepositFiatHistory = getDepositFiatHistory;
        service.getLockActive = getLockActive;
        service.getLockHistory = getLockHistory;
        service.getDataAnalysisPage=getDataAnalysisPage;

        service.lockRates = lockRates;
        service.lockETP = lockETP;

        service.getMobileVersion = getMobileVersion;


        service.registerUser = registerUser;//注册用户


        service.getUserID = getUserID;//获取身份类型
        service.resetpwd = resetpwd;//重置密码
        service.checkUserName = checkUserName;//检查用户是否注册
        service.verify = verify;//检查身份ID

        service.getWithdrawalAmount = getWithdrawalAmount;//提币限额
        service.getOrdersHistory = getOrdersHistory;//提币限额
        service.withdrawalsHash = withdrawalsHash;//提币限额
        service.AddCNYBankAccount = AddCNYBankAccount;//添加银行卡
        service.AddAssetAccountaddress = AddAssetAccountaddress;//添加地址
        service.fiatnewWithdrawal = fiatnewWithdrawal;//提现
        service.coinnewWithdrawal = coinnewWithdrawal;//提币
        service.getETPLocks = getETPLocks;//锁仓利息提示

        service.submitOrder = submitOrder;  //提工单



        return service;
        //锁仓利息提示
        function getETPLocks() {
            return _get('locks/etp',{});
        }
        //提币明细列表
        function withdrawalsHash(type,params) {
            return _get('withdrawalsHash/'+ type +'?page='+ (params.currentPage-1) +'&items_per_page='+params.pagesize);
        }

        //提币限额
        function getWithdrawalAmount(type) {
            return _post('getWithdrawalAmount/',{coin_type:type});
        }


        function checkTpass() {
            return _post("checkTpass", {});
        }

        //检查身份ID
        function verify(params) {
            return _post("user/kyc_verify", params);
        }
        //检查用户是否注册
        function checkUserName(params) {
            return _post("checkUsername", params);
        }
        //获取身份类型
        function getUserID(params) {
            return _post("user/kyc_type", params);
        }
        //重置密码
        function resetpwd(params) {
            return _post("user/reset", params);
        }

        //注册用户
        function registerUser(params) {
            return _post("registerUser", params);
        }

        //提工单
        function submitOrder(params) {
            return _post("worker/submitOrder",params)
        }

        // ---------- (づ｡◕‿‿◕｡)づ TradingDesk functions ------------------>
        function Balances(no_caching) {
            var url = 'account/getBalances';
            if(no_caching)
                url+='?no_cache=1';
			else 
				url += '?time' + new Date().getTime();
            return _get(url,{});
        }

        function getActiveOrders(trading_pair) {
            return _get('orders/' + trading_pair);
        }

        function getCurrentTCommission(trading_pair) {
            return _get('getCurrentTCommission/' + trading_pair);
        }

        function getHistoryTCommission(trading_pair, page, perpage) {
            return _get('getHistoryTCommission/'+trading_pair+'?page='+page+'&items_per_page='+perpage);
        }

        function getTradesFromOrders(trading_pair, order_id) {
            return _get('getTradesFromOrders/' + trading_pair + '/' + order_id);
        }

        function getWithdrawalHistory(trading_pair, page, perpage) {
            return _get('getWithdrawalHistory/'+trading_pair+'?page='+page+'&items_per_page='+perpage);
        }

        // need to add orders
        function createOrder(side, type, quantity, limit, trading_pair, tpass) {
            return _post('order', {side: side,
                type: type,
                quantity: quantity,
                limit: limit,
                trading_pair: trading_pair,
                transaction_password: tpass
            });
        }

        // 新创建订单
        function createTransactionOrder(side, type, quantity, limit, trading_pair, tpass,secret_code) {
            return _post('createTransactionOrder', {side: side,
                type: type,
                quantity: quantity,
                limit: limit,
                trading_pair: trading_pair,
                transaction_password: tpass,
                secret_code:secret_code
            });
        }
        
        //创建市场订单
        function createMarketOrder(side, type, quantity, limit, trading_pair, tpass,secret_code) {
        	return _post('createMarketOrder', {side: side,
        		type: type,
        		quantity: quantity,
        		limit: limit,
        		trading_pair: trading_pair,
        		transaction_password: tpass,
        		secret_code:secret_code
        	});
        }

        //提工单
        // function submitOrder(type,uid,phone,email,description,asset,custom_field_1,custom_field_2,custom_field_3,file_list) {
        //     return _post('submitOrder', {
        //         type: type,
        //         uid: uid,
        //         phone: phone,
        //         email: email,
        //         description: description,
        //         asset:asset,
        //         custom_field_1: custom_field_1,
        //         custom_field_2:custom_field_2,
        //         custom_field_3:custom_field_3,
        //         file_list: file_list,
        //     });
        // }

        function deleteOrder(trading_pair, order_id) {
            return _delete('order/' + trading_pair + '/' + order_id);
        }

        function getTradingPairs() {
            return $q((resolve,reject)=>{
                if($rootScope.availableTradingPairs)
                    resolve($rootScope.availableTradingPairs);
                else{
                    _get('pairs').then((response)=>{
                        if(response.success)
                            $rootScope.availableTradingPairs=response;
                        resolve(response);
                    }, (error) => reject(error));
                }
            });
        }


        function getAssets() {
            return $q((resolve,reject)=>{
                if($rootScope.availableAssets)
                    resolve($rootScope.availableAssets);
                else{
                    _get('assets').then((response)=>{
                        if(response.success)
                            $rootScope.availableAssets=response;
                        resolve(response);
                    }, (error) => reject(error));
                }
            });
        }
        // ---------- END ------------------>


        // ---------- (づ｡◕‿‿◕｡)づ  ETP Lock functions ------------------>
        function lockRates() {
            return _get('lockrates/ETP');
        }

        function lockETP(asset, amount, lock_days, authtoken, tpass) {
            return _post('lock', {
                symbol: asset,
                amount: amount,
                lock_days: lock_days,
                authtoken: authtoken,
                transaction_password: tpass
            });
        }

        // ---------- END ------------------>

        // ---------- (づ｡◕‿‿◕｡)づ  Setting functions ------------------>

        function getSettings() {
            return _get("settings", {});
        }

        function getApi(tpass) {
            return _get("apikey?transaction_password="+tpass, {});
        }

        function postApi(tpass) {
            return _post("apikey", {transaction_password: tpass});
        }

        function RegisterMobile(mobileNumber, authtoken) {
            return _post("register", {phone: mobileNumber,
                authtoken:  authtoken});
        }

        function RegisterEmail(email, authtoken) {
            return _post("register", {email: email,
                authtoken:  authtoken});
        }

        function BindEmail(authtoken, email) {
            return _post('user/email', {"authtoken": authtoken, "email": email});
        }

        function ChangeEmail(authtoken, email) {
            return _post('user/changeemail', {"authtoken": authtoken, "email": email});
        }

        function BindPhone(authtoken, phone) {
            return _post('user/phone', {"authtoken": authtoken, "phone": phone});
        }

        function ChangePhone(authtoken, phone) {
            return _post('user/changephone', {"authtoken": authtoken, "phone": phone});
        }

        function SetPassword(old_password, new_password) {
            return _post('modifyPassword', {old: old_password, new: new_password});
        }

        function SetPhone(old_phone, new_phone) {
            return _post('modifyPhone', {oldPhone: old_phone, newPhone: new_phone});
        }

        function createTfa() {
            return _post('tfa', {});
        }

        function enableTfa(code) {
            return _post('tfa/enable', {code:code});
        }

        function deleteTfa(code) {
            return _delete('tfa?code='+code);
        }

        function createTpass(password, transaction_password) {
            return _post('tpass', {password: password, transaction_password: transaction_password});
        }

        function setTpass(authtoken, tpass) {
            return _post('create_tpass', {"authtoken": authtoken, "transaction_password": tpass});
        }

        function resetTpass(authtoken, tpass) {
            return _post('reset_tpass', {"authtoken": authtoken, "new_password": tpass});
        }

        function changeTpass(old_password, new_password) {
            return _post('change_tpass', {old_password: old_password, new_password: new_password});
        }

        function tradingTpass(password, enable) {
            return _post('tpass/trading', {password: password, enable: enable});
        }

        function googleCodeget() {
            return _post('gym/getGenSecret', {});
        }

        function googleCodeset(secret_passwd,secret_key,secret_code) {
            return _post('gym/verifyGenSecret', {secret_passwd: secret_passwd, secret_key: secret_key,secret_code:secret_code});
        }

        function setSecurity(type,way) {
            return _post('gym/setSecurity', {type:type,way:way});
        }

        function getSafetySettings() {
            return _get('getSafetySettings', {});
        }

        function getVerifyType(type) {
            return _get('getVerifyType', {});
        }

        function checkPhone(phone) {
            return _get('gym/checkPhone?user_phone=' + phone);
        }


        // ------------ END ------------------>



        // ---------- (づ｡◕‿‿◕｡)づ Account functions ------------------>
        function getDepositAddress(pair) {
            return _get('depositaddress/' + pair);
        }

        function Balance(symbol) {
            return _get('account/balance/'+symbol,{});

        }
        // ----------- END ------------------>



        // ---------- (づ｡◕‿‿◕｡)づ History functions ------------------>
        function getOrderHistory(side, params) {
            return _get('orders/history?side='+side+'&page='+ (params.currentPage-1) +'&items_per_page='+params.pagesize);
        }
        function getOrdersHistory(params) {
            return _get('orders/orderHistory?'+'&page='+ (params.currentPage-1) +'&items_per_page='+params.pagesize);
        }

        function getTxs(side, page, perpage) {
            return _get('txs?side='+side +'&page='+page+'&items_per_page='+perpage);
        }

        function getDepositHistory(symbol) {
            return _get('deposits/'+symbol);
        }



        function getWithdrawalCoinHistory(symbol) {
            return _get('withdrawals/'+symbol);
        }

        function getWithdrawalFiatHistory(symbol,params) {
            if(params){

                return _get('fiat/withdrawals/'+symbol +'?page='+ (params.currentPage-1) +'&items_per_page='+params.pagesize);

            }else{

                return _get('fiat/withdrawals/'+symbol);
            }
        }

        function getDepositCoinHistory(symbol,params) {
            return _get('deposits/'+symbol+'?page='+ (params.currentPage-1) +'&items_per_page='+params.pagesize);
        }

        function getStoreHistory(symbol,params) {
            return _get('account/stroke/'+symbol+'?page='+ (params.currentPage-1) +'&items_per_page='+params.pagesize);
        }

        function getDepositFiatHistory(symbol,params) {
            if(params){

                return _get('fiat/deposits/'+symbol +'?page='+ (params.currentPage-1) +'&items_per_page='+params.pagesize);

            }else{

                return _get('fiat/deposits/'+symbol);
            }

        }

        function getLockActive(symbol,params) {
            if(params){

                return _get('locks/active/'+symbol+'?page='+ (params.currentPage-1) +'&items_per_page='+params.pagesize);

            }else{

                return _get('locks/active/'+symbol);
            }
        }

        function getLockHistory(symbol) {
            return _get('locks/history/' + symbol);
        }

        // ----------- END ------------------>



        // ---------- (づ｡◕‿‿◕｡)づ Withdrawal functions ------------------>
        function ListBankAccounts(symbol) {
            return _get('fiat/accounts/'+symbol);
        }

        function ListAssetAccounts(symbol) {
            return _get('withdrawaladdresses/' + symbol);
        }

        function AddAssetAccount(symbol, address, remark, memo) {
            return _post('withdrawaladdresses/' + symbol, {
                "address": address,
                "remark": remark,
                "address_part_two": memo
            });
        }

        function AddAssetAccountaddress(symbol, address, remark, memo,authtoken) {
            return _post('bindwithdrawaladdresses/' + symbol, {
                "address": address,
                "remark": remark,
                "address_part_two": memo,
                "authtoken": authtoken
            });
        }

        function AddBankAccount(symbol, bank_account_type, bank_name, bank_address, account_number, real_name, remark){
            return _post('fiat/account',{
                "bank_account_type": bank_account_type,
                "bank_name": bank_name,
                "address": bank_address,
                "number": account_number,
                "name": real_name,
                "remark": remark
            });
        }

        function AddCNYBankAccount(symbol, bank_account_type, bank_name, bank_address, account_number, real_name, remark,authtoken){
            return _post('fiat/bindCard',{
                "bank_account_type": bank_account_type,
                "bank_name": bank_name,
                "address": bank_address,
                "number": account_number,
                "name": real_name,
                "remark": remark,
                "authtoken": authtoken
            });
        }

        function fiatWithdrawal(bank_account_id, currency, amount, authtoken, tpass) {
            return _post('fiat/withdrawal', {
                "bank_account_id": bank_account_id,
                "currency": currency,
                "amount": parseInt(amount),
                "authtoken": authtoken,
                "transaction_password": tpass
            });
        }
        function fiatnewWithdrawal(bank_account_id, currency, amount, authtoken, tpass) {
            return _post('fiat/fiat_withdrawal', {
                "bank_account_id": bank_account_id,
                "currency": currency,
                "amount": parseInt(amount),
                "authtoken": authtoken,
                "transaction_password": tpass
            });
        }

        function coinWithdrawal(address_id, fee, amount, currency, authtoken, tpass,limit) {
            return _post('withdrawal/' + address_id, {
                "fee": fee,
                "amount": amount,
                "currency": currency,
                "authtoken": authtoken,
                "transaction_password": tpass,
                "limit":limit
            });
        }

        function coinnewWithdrawal(address_id, fee, amount, currency, authtoken, tpass,limit,secret_code,isphone) {
            return _post('coin_withdrawal/' + address_id, {
                "fee": fee,
                "amount": amount,
                "currency": currency,
                "authtoken": authtoken,
                "transaction_password": tpass,
                "limit":limit,
                "secret_code":secret_code,
                "isphone":isphone
            });
        }

        function UnbindBankAccount(bank_account_id) {
            return _post('fiat/unBindCard', {
                "id": bank_account_id
            });
        }

        function UnbindAddress(address_id) {
            return _delete('withdrawaladdress/'+address_id);
        }
        // ----------- END ------------------>

        function KycLevelUp(level){
            return _post('/kyc/level/'+level);
        }

        function KycBasicInfo(name,document_type,document_number){
            return _post('/kyc/basic',{
                "name": name,
                "document_type": document_type,
                "document_number": document_number
            });
        }

        function KycInfo() {
            return _post('getUserkyc', {});
        }

        // ---------- (づ｡◕‿‿◕｡)づ Deposit functions ------------------>
        function Giftcode(code) {
            return _post('giftcode',{"code": code});
        }

        function FiatDepositOptions(symbol){
            return _get('fiat/depositoptions');
        }

        function FiatOfflineDeposit(symbol, amount){
            return _post('fiat/deposit',{"currency": symbol, "amount": amount});
        }
        // ----------- END ------------------>


        // ---------- (づ｡◕‿‿◕｡)づ Mobile functions ------------------>
        // TODO: check transaction password get
        function getMobileVersion(platform) {
            return _get('app/update/'+platform, {});
        }

        // ----------- END ------------------>


        // ---------- (づ｡◕‿‿◕｡)づ call functions ------------------>
        function _post(method, params) {
            var token = $rootScope.globals.token;
            return $http.post(SERVER + method ,params, { headers : { "x-access-token" :token }}).then(
                function(res){
                    return handleSuccess(res);
                },
                function(res){
                    return handleError(res);
                });
        } // end _post




        function _get(method, params) {
            var token = $rootScope.globals.token;
            return $http.get(SERVER + method ,{ headers : { "x-access-token" :token }}).then(
                function(res){
                    return handleSuccess(res);
                },
                function(res){
                    return handleError(res);
                });
        }

        function _delete(method, params) {
            var token = $rootScope.globals.token;
            return $http.delete(SERVER + method, { headers : { "x-access-token" :token }}).then(
                function(res) {
                    return handleSuccess(res);
                },
                function(res) {
                    return handleError(res);
                }
            );
        }
        function _put(method, params) {
            var token = $rootScope.globals.token;
            return $http.put(SERVER + method, { headers : {"x-access-token": token }}).then(
                function(res) {
                    return handleSuccess(res);
                },
                function(res) {
                    return handleError(res);
                }
            );
        }
        // ------------END------------------>


        // ---------- (づ｡◕‿‿◕｡)づ private functions ------------------>
        function handleSuccess(res) {
            if(res.data && res.data.status && res.data.status.success)
                return { success: true, data: res.data.result};
            else
                return handleError(res);
        } // end handleSuccess

        function handleError(res) {
            if(res.data && res.data.status && res.data.status.message){
                if(res.data.status.message==="ERR_USERTOKEN_NOT_FOUND"){
                    $location.url('/login');
                }
                else if(res.data.status.message==='ERR_USERTOKEN_VERIFY'){
                    $translate("MESSAGE.ERROR_USERTOKEN_VERIFY")
                        .then(function (data) {
                            UserTokenService.ClearCredentials();
                            FlashService.Error(data,true);
                            $location.url('/login');
                        });
                }
                return { success: false, message: res.data.status.message };
            }
            return { success: false, message: 'General connection error' };
        } // end handleError
        // -------- END ----------------->



        // ---------- (づ｡◕‿‿◕｡)づ dataAnalysis functions ------------------>

        function getDataAnalysisPage(params) {//数据分析
            return _get('account/listDataAnalysis'+'?page='+ (params.currentPage-1) +'&items_per_page='+params.pagesize);
        }



    } // end PrivateService


})();
