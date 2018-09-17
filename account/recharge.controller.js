'use strict';

angular.module('app').controller('RechargeController', RechargeController);

function RechargeController($scope,PrivateService,PublicService,SinaPayService, $interval, $stateParams){
	
	$scope.accountObj = {
		digital:false,
		cny:true,
		offline:false
	};
	
	//分页数据
	$scope.params = {
        currentPage: 0,
        digitalcurrentPage: 0,
        pagesize: 10,
		totalItems:10,
		digitaltotalItems:10
    };
	
	//请求参数
	$scope.bankReqParam = {
		currency:'cny',
		bank_code:false,
		bankCode:bankCode
	};
	
	//查询人民币结果参数
	$scope.bankResResult = {
		cnyhistoryArr:[],
		balancesArr:[]
	};
	
	//查询数字货币结果参数
	$scope.digitalResResult = {
		tickersArr:[],
		depositaddress:'',
		memo:'',
		digitalhistoryArr:[]
	};
	
	//数字货币操作参数
	$scope.digitalCreate = {
		market:'ETHBTC'
	};
	
	//人民币操作参数
	$scope.dataCreate = {
		tabclass:true,
		tabofflineclass:true,
		tabonlineclass:false,
		tabgiftclass:false,
		offlineInput:true,
		offlineInputErrMsg:'',
		giftInputErrMsg:'',
		digitalmenuss:false,
		digitalmenushow:true,
		digitaladdreass:false,
		balanceTitle:'总资产折合CNY',
		giftclass:true,
		realname:false,
		holhflag:false,
		setpassword:false,
		bindcard:false,
		sinadeposit:false,
		cnybl:false,
		offline_load:false,
		onlineSP_load:false,
		onlineBC_load:false,
		onlineHLD_load:false,
		onlineDS_load:false,
		onlineGF_load:false
	};
	
	(function(){
		hrefload();
	})();
	
	//查询是否进行过一级实名认证
	function getSettings(href){
		PrivateService.getSettings()
		.then(function(response){
			if(response.success){
				if(response.data.kyc_level==0){
					$scope.dataCreate.cnybl = true;
					$scope.dataCreate.realname = true;
					$scope.accountObj.cny = false;
					$scope.accountObj.digital = false;
				}else{
					if(href.indexOf('?')==-1){
						getBalances('CNY');
						var market='CNY?'+'page='+ ($scope.params.currentPage);
						getCnyDepositHistory(market);
						//$scope.params.currentPage=2;
					}
				}
			}else{
				//$scope.dataCreate.offlineInputErrMsg = '有点尴尬,网络连接错误哦,请稍后重试吧！';
			}
		});
	};
	//点击某个市场
	$scope.marketClick = function(market,item){
		location.href="#!/account/recharge/" + market;
        // PrivateService.getWithdrawalAmount(market).then(function (res) {
        //
        //     $scope.limit = res.data;
        // })

		$scope.isactive = market;
		if(item && item.coin_type==1){
			$scope.dataCreate.digitaladdreass = true;
		}else{
			$scope.dataCreate.digitaladdreass = false;
		}
		$scope.dataCreate.balanceTitle="ASSET."+market;
		$scope.digitalCreate.market=market;
		for(var i =0;i<$scope.bankResResult.balancesArr.length;i++){
			var item = $scope.bankResResult.balancesArr[i];
			if(item.market == market){
				$scope.bankResResult.balances.balance=0;
				$scope.bankResResult.balances.frozen=0;
				$scope.bankResResult.balances.balance=item.balance;
				$scope.bankResResult.balances.frozen=item.frozen;
			}
		}
		$scope.dataCreate.digitalmenushow = false;
		$scope.dataCreate.digitalmenuss = false;
		//var symbol = market.substr(0,market.length-3);
		getDepositAddress(market,item);
		var markets=market+'?page='+ ($scope.params.currentPage);
		getCnyDepositHistory(markets);
	};
	//页面跳转过来
	function hrefload(){
		var href = window.location.href;
		getSettings(href);
		if(href.indexOf('?')!=-1 && href.split("=")[1]=='sina'){
			$scope.dataCreate.tabofflineclass=false;
			$scope.dataCreate.tabonlineclass=true;
			$scope.dataCreate.tabgiftclass=false;
			querySinaInfo({});
			getBalances('CNY');
			var market='CNY'+'?page='+ ($scope.params.currentPage);
			getCnyDepositHistory(market);
		}else if(href.indexOf('?')!=-1 && href.split("=")[1]!='sina'){
			var market = href.split("=")[1];
			$scope.dataCreate.balanceTitle="ASSET."+market;
			$scope.digitalCreate.market=market;
			$scope.dataCreate.tabclass = false;
			$scope.accountObj.digital = true;
			$scope.accountObj.cny = false;
			if(market=='BTS' || market=='OBS' || market=='GXS'){
				$scope.dataCreate.digitaladdreass = true;
			}else{
				$scope.dataCreate.digitaladdreass = false;
			}
			$scope.dataCreate.digitalmenushow = false;
			$scope.dataCreate.digitalmenuss = false;
			getBalances(market);
			getDepositAddress(market);
			var market=market+'?page='+ ($scope.params.currentPage);
			getCnyDepositHistory(market);
		}
	};
	
	//查询用户人民币持仓
	function getBalances(type){
		PrivateService.Balances()
		.then(function(response){
			if(response.success){
				$scope.bankResResult.balancesArr = response.data;
				for(var i=0;i<response.data.length;i++){
					if(response.data[i].asset==type)
						$scope.bankResResult.balances = response.data[i];
				}
			}
		});
	};
	
	//人民币充值切换
	$scope.tab = function(type){
		//if($scope.dataCreate.cnybl){
		//	$scope.dataCreate.realname = true;
		//	$scope.accountObj.cny = false;
		//	$scope.accountObj.digital = false;
		//}else{
		//	if(type=='cny'){
		//		$scope.dataCreate.tabclass = true;
		//		$scope.bankReqParam.currency = 'cny';
		//		var market='CNY?page='+ ($scope.params.currentPage);
		//		getCnyDepositHistory(market);
		//		$scope.accountObj.cny = true;
		//		$scope.accountObj.digital = false;
		//		$scope.dataCreate.digitalmenuss = false;
		//		$scope.dataCreate.digitalmenushow = false;
		//		$scope.dataCreate.balanceTitle='总资产折合CNY';
		//		getBalances('CNY');
		//	}else{
				$scope.dataCreate.tabclass = false;
				$scope.accountObj.digital = true;
				$scope.accountObj.cny = false;
				$scope.dataCreate.digitalmenuss = true;
				$scope.dataCreate.digitalmenushow = true;
				getMarkets();
		        $stateParams.type = $stateParams.type ? $stateParams.type : 'BTC';
				$scope.marketClick($stateParams.type,'');
			//}
		//}
	};
	$scope.tab('digital');
	//人民币充值方式切换
	$scope.tabMethod = function(type){
		$scope.dataCreate.giftInputErrMsg ="";
		$scope.dataCreate.offlineInputErrMsg ="";
		if(type=='offline'){
			if($scope.dataCreate.cnybl){
				$scope.dataCreate.realname = true;
			}else{
				$scope.dataCreate.tabofflineclass = true;
				$scope.dataCreate.tabonlineclass = false;
				$scope.dataCreate.tabgiftclass = false;
				$scope.dataCreate.offlineInput = true;
			}
		}else if(type=='online'){
			if($scope.dataCreate.cnybl){
				$scope.dataCreate.realname = true;
			}else{
				$scope.dataCreate.tabofflineclass = false;
				$scope.dataCreate.tabonlineclass = true;
				$scope.dataCreate.tabgiftclass = false;
				querySinaInfo({});
			}
		}else if(type=='giftcard'){
			if($scope.dataCreate.cnybl){
				$scope.dataCreate.realname = true;
			}else{
				$scope.dataCreate.tabofflineclass = false;
				$scope.dataCreate.tabonlineclass = false;
				$scope.dataCreate.tabgiftclass = true;
			}
		}
	};
	
	//点击获取线下充值验证码
	$scope.getBankVerifyCode = function(){
		if(isNaN($scope.bankReqParam.offlineamount)){
			$scope.dataCreate.offlineInputErrMsg="hi,说好填写数字的呢！";
		}else if(!isNaN($scope.bankReqParam.offlineamount) && $scope.bankReqParam.offlineamount<100){
			$scope.dataCreate.offlineInputErrMsg="么么,请多充值一点嘛，大于100好么！";
		}else{
			cnyDeposit($scope.bankReqParam.currency,$scope.bankReqParam.offlineamount*100000000);
		}
	};
	
	//点击礼品卡充值
	$scope.giftClick = function(){
		//if($scope.bankReqParam.giftcode==undefined)
			
		//else
			Giftcode($scope.bankReqParam.giftcode);
	};
	
	//人民币线下充值
	function cnyDeposit(symbol,amount){
		$scope.dataCreate.offline_load = true;
		PrivateService.FiatOfflineDeposit(symbol,amount)
		.then(function(response){
			if(response.success){
				$scope.dataCreate.offlineInput = false;
				$scope.bankResResult.transfer_code = response.data.transfer_code;
			}else{
				if(response.message=="ERR_AMOUNT_MISSING"){
					$scope.dataCreate.offlineInputErrMsg="么么,请多充值一点嘛，大于100好么！";
				}else{
					$scope.dataCreate.offlineInputErrMsg = '有点尴尬,网络连接错误哦,请稍后重试吧！';
				}
			}
			$scope.dataCreate.offline_load = false;
		});
	};
	
	//礼品卡充值
	function Giftcode(code){
		$scope.dataCreate.onlineGF_load = true;
		PrivateService.Giftcode(code)
		.then(function(response){
			$scope.dataCreate.onlineGF_load = false;
			if(response.success){
				$scope.dataCreate.giftclass = true;
			}else{
				if(response.message=='ERR_DEPOSIT_CODE_NOT_FOUND'){
					$scope.dataCreate.giftInputErrMsg = '哎呀，不好意思,您的礼品卡号不对哦！';
				}else{
					$scope.dataCreate.offlineInputErrMsg = '有点尴尬,网络连接错误哦,请稍后重试吧！';
				}
			}
		});
	};
	
	// Code counter on Ask
    function cancelCount(){
      $interval.cancel(count);
    }
    function cleanupCount(){
      $scope.code_count=false;
      vm.code_sent=false;
    }
    var count;
    function Counter() {
			$scope.code_count = true;
      $scope.counter=60;
			count = $interval(()=>{
        $scope.counter--;
      }, 1000, 60);
      count.then(()=>cleanupCount(), ()=>cleanupCount());
    }
	
	//查询人民币充值记录
	function getCnyDepositHistory(symbol){
		PrivateService.getDepositFiatHistory(symbol)
		.then(function(response){
			if(response.success){
				if(symbol.split('?')[0]=='CNY'){
					$scope.bankResResult.cnyhistoryArr = response.data.data;
					if($scope.params.currentPage==0){
						$scope.params.totalItems = response.data.count+1;
						$scope.params.currentPage=1;
					}else{
						$scope.params.totalItems = response.data.count;
					}
				}else{
					if($scope.params.digitalcurrentPage==0){
						$scope.params.digitaltotalItems = response.data.count+1;
						$scope.params.digitalcurrentPage=1;
					}else{
						$scope.params.digitaltotalItems = response.data.count;
					}
					$scope.digitalResResult.digitalhistoryArr = response.data.data;
				}
			}else{
				$scope.dataCreate.offlineInputErrMsg = '有点尴尬,网络连接错误哦,请稍后重试吧！';
			}
		});
	};
	
	//获取市场
	function getMarkets(){
		PrivateService.getAssets()
		.then(function(response){
			if(response.success){
				$scope.digitalResResult.tickersArr = response.data.data;
			}else{
				//$scope.dataCreate.offlineInputErrMsg = '有点尴尬,网络连接错误哦,请稍后重试吧！';
			}
		});
	};
	
	//获取充值地址
	function getDepositAddress(symbol,type){
		PrivateService.getDepositAddress(symbol)
		.then(function(response){
			if(response.success){
				if(type && type.coin_type==1){
					$scope.digitalResResult.depositaddress = 'szzc-com-wallet';
				    $scope.digitalResResult.memo = response.data;
				}else{
				   $scope.digitalResResult.depositaddress = response.data;
				}
				var qrcode = document.getElementById('qrcode');
				qrcode.getContext("2d").clearRect(0,0,qrcode.width,qrcode.height);
				if($scope.digitalResResult && $scope.digitalResResult.depositaddress) {
					$scope.qrCode($scope.digitalResResult.depositaddress);
				}
			}else{
				//$scope.dataCreate.offlineInputErrMsg = '有点尴尬,网络连接错误哦,请稍后重试吧！';
			}
		});
	};
	
	// function to be recalled during mouse over
	$scope.qrCode = function(url) {
      qrcodelib.toCanvas(document.getElementById('qrcode'), url, {
        color: {
          dark: '#000000'
        },
        scale: 4
      }, (error)=>{
        if(error!=null)
          console.error(error);
      });
    };
	
	//查询会员新浪相关信息
	function querySinaInfo(params){
		//loadingFun('load');
		SinaPayService.querySinaInfo(params)
			.then((response)=>{
				//loadingFun();
				if(response.success){
					//还没有创建激活新浪会员
					if(response.data.length==0){
						create_activate_member(params);
					}else{
						$scope.sinaInfoData = response.data[0];
						//实名认证
						if($scope.sinaInfoData.is_bind_identity_card==0){
							$scope.dataCreate.realname = true;
							$scope.dataCreate.setpassword = false;
							$scope.dataCreate.holhflag = false;
							$scope.dataCreate.bindcard = false;
							$scope.dataCreate.sinadeposit = false;
							$scope.dataCreate.cnybl = true;
							$scope.dataCreate.realname = true;
							$scope.accountObj.cny = false;
							$scope.accountObj.digital = false;
							//realName();
						//是否设置支付密码	
						}else if($scope.sinaInfoData.is_set_paykey==0){
							$scope.dataCreate.realname = false;
							$scope.dataCreate.setpassword = true;
							$scope.dataCreate.holhflag = false;
							$scope.dataCreate.bindcard = false;
							$scope.dataCreate.sinadeposit = false;
							querySetPayKey(params);
						//是否绑定银行卡	
						}else if($scope.sinaInfoData.is_bind_card==0){
							$scope.dataCreate.realname = false;
							$scope.dataCreate.setpassword = false;
							$scope.dataCreate.holhflag = false;
							$scope.dataCreate.bindcard = true;
							$scope.dataCreate.sinadeposit = false;
						//是否设置委托扣款	
						}else if($scope.sinaInfoData.is_handle_withhold==0){
							query_withhold_authority(params);
						//充值
						}else{
							$scope.dataCreate.realname = false;
							$scope.dataCreate.setpassword = false;
							$scope.dataCreate.holhflag = false;
							$scope.dataCreate.bindcard = false;
							$scope.dataCreate.sinadeposit = true;
							queryCardBindSina(params);
						}
					}
				}
			});
	};

	//创建激活新浪会员
	function create_activate_member(params){
		SinaPayService.create_activate_member(params)
			.then((response)=>{
				/*if(response.success){
					
				}else if(response.message.response_code!="APPLY_SUCCESS"){
					$scope.dataCreate.offlineInputErrMsg = '有点尴尬,网络连接错误哦,请稍后重试吧！';
				}*/
			});
	};
	
	//请求新浪查询是否设置过支付密码
	function querySetPayKey(params){
		SinaPayService.querySetPayKey(params)
			.then((response)=>{
				if(response.success){
					if(response.data="Suc_Had_SetPayKey"){
						$scope.dataCreate.realname = false;
						$scope.dataCreate.setpassword = true;
						$scope.dataCreate.holhflag = false;
						$scope.dataCreate.bindcard = false;
						$scope.dataCreate.sinadeposit = false;
					}else{
						$scope.dataCreate.realname = false;
						$scope.dataCreate.setpassword = false;
						$scope.dataCreate.holhflag = false;
						$scope.dataCreate.bindcard = true;
						$scope.dataCreate.sinadeposit = false;
					}
				}else{
					$scope.dataCreate.realname = false;
					$scope.dataCreate.setpassword = true;
					$scope.dataCreate.holhflag = false;
					$scope.dataCreate.bindcard = false;
					$scope.dataCreate.sinadeposit = false;
				}
			});
	};
	
	//设置新浪支付密码
	$scope.setPayPassword = function(){
		set_pay_password({});
	};
	
	//设置新浪支付密码
	function set_pay_password(params){
		params.url = "http://121.43.191.224/#!/account/recharge?flag=sina";
		$scope.dataCreate.onlineSP_load=true;
		SinaPayService.set_pay_password(params)
			.then((response)=>{
				$scope.dataCreate.onlineSP_load=false;
				if(response.success){
					if(response.data.response_code=="APPLY_SUCCESS"){
						window.location.href=response.data.redirect_url;
					}else{
						$scope.bankReqParam.bindErr = response.message.response_message;
					}
				}else{
					$scope.bankReqParam.bindErr = '有点尴尬,网络连接错误哦,请稍后重试吧！';
				}
			});
	};
	
	//点击获取验证码
	$scope.getVerifyCode = function(){
		Counter();
		$scope.bankReqParam.card_type = "DEBIT";
		$scope.bankReqParam.card_attribute = "C";
		$scope.bankReqParam.uaa_account_type = "BASIC";
		if($scope.bankReqParam.bank_code==undefined || $scope.bankReqParam.bank_code==""){
			$scope.bankReqParam.bindErr = 'hi,说好的银行没选择呢！';
		}else if($scope.bankReqParam.bank_account_no==undefined || $scope.bankReqParam.bank_account_no=="" || isNaN($scope.bankReqParam.bank_account_no)){
			$scope.bankReqParam.bindErr = 'hi,说好的银行卡号没填呢';
		}else if($scope.bankReqParam.phone_no==undefined || $scope.bankReqParam.phone_no==""){
			$scope.bankReqParam.bindErr = 'hi,说好的银行卡绑定手机号呢';
		}else if($scope.bankReqParam.province==undefined || $scope.bankReqParam.province==""){
			$scope.bankReqParam.bindErr = 'hi,说好的省份没填呢';
		}else if($scope.bankReqParam.city==undefined || $scope.bankReqParam.city==""){
			$scope.bankReqParam.bindErr = 'hi,说好的城市没填呢';
		}else{
			getBinding_Bank_Card($scope.bankReqParam);
		}
	};
	
	//绑定银行卡提交新浪获取短信验证码接口
	function getBinding_Bank_Card(params){
		//loadingFun('load');
		SinaPayService.getBinding_Bank_Card(params)
			.then((response)=>{
				//loadingFun();
				if(response.success){
					if(response.data.response_code=="APPLY_SUCCESS"){
						$scope.bankReqParam.ticket = response.data.ticket;
					}else{
						$scope.bankReqParam.bindErr = response.message.response_message;
					}
				}else{
					$scope.bankReqParam.bindErr = response.message.response_message;
				}
			});
	};
	
	
	//提交保存数据
	$scope.saveBankCardInfo = function(){
		if($scope.bankReqParam.valid_code==undefined || $scope.bankReqParam.valid_code==""){
			$scope.bankReqParam.bindErr = 'hi,说好的验证码呢？';
		}else{
			saveBankCardInfo($scope.bankReqParam);
		}
	};
	
	//查询是否委托扣款
	function query_withhold_authority(params){
		SinaPayService.query_withhold_authority(params)
			.then((response)=>{
				if(response.success){
					if(response.data.is_withhold_authoity!="Y"){
						$scope.dataCreate.realname = false;
						$scope.dataCreate.setpassword = false;
						$scope.dataCreate.holhflag = true;
						$scope.dataCreate.bindcard = false;
						$scope.dataCreate.sinadeposit = false;
					}else{
						$scope.dataCreate.realname = false;
						$scope.dataCreate.setpassword = false;
						$scope.dataCreate.holhflag = false;
						$scope.dataCreate.bindcard = false;
						$scope.dataCreate.sinadeposit = true;
					}
				}
			});
	};
	
	//提交保存数据
	function saveBankCardInfo(params){
		$scope.dataCreate.onlineBC_load= true;
		SinaPayService.saveBankCardInfo(params)
			.then((response)=>{
				$scope.dataCreate.onlineBC_load= false;
				if(response.success){
					if(response.data.response_code=="APPLY_SUCCESS" && response.data.is_verified=="Y"){
						$scope.dataCreate.realname = false;
						$scope.dataCreate.setpassword = false;
						$scope.dataCreate.holhflag = true;
						$scope.dataCreate.bindcard = false;
						$scope.dataCreate.sinadeposit = false;
					}else{
						$scope.bankReqParam.bindErr="呜呜,绑卡失败啦";
					}
				}else{
					$scope.bankReqParam.bindErr = response.message.response_message;
				}
			});
	};
	
	//设置委托扣款
	$scope.handle_withhold_authority = function(){
		handle_withhold_authority($scope.bankReqParam);
	};
	
	//设置委托扣款
	function handle_withhold_authority(params){
		params.url = "http://121.43.191.224/#!/account/recharge?flag=sina";
		$scope.dataCreate.onlineHLD_load= true;
		SinaPayService.handle_withhold_authority(params)
			.then((response)=>{
				$scope.dataCreate.onlineHLD_load= false;
				if(response.success){
					if(response.data.response_code=="APPLY_SUCCESS")
						window.location.href=response.data.redirect_url;
					else
						$scope.bankReqParam.hanldErr="呜呜,获取新浪委托收银台失败啦";
				}else{
					$scope.bankReqParam.hanldErr = response.message.response_message;
				}
			});
	};
	
	//充值
	$scope.depositSubmit = function(){
		if($scope.bankReqParam.amount==undefined || isNaN($scope.bankReqParam.amount)){
			$scope.bankReqParam.depositErr = 'hi,说好的填写数字的呢？';
		}else if($scope.bankReqParam.amount<100){
			$scope.bankReqParam.depositErr = '么么,请多充值一点嘛，大于100好么！';
		}else{
			//$scope.bankReqParam.amount = $scope.bankReqParam.amount*100000000;
			depositSubmit($scope.bankReqParam);
		}
	};
	
	//查询新浪绑定的卡
	function queryCardBindSina(params){
		SinaPayService.queryCardBindSina(params)
			.then((response)=>{
				if(response.success){
					$scope.bankReqParam.pay_method = 'online_bank';
					$scope.bankReqParam.bank_code = 'SINAPAY';
					$scope.bankReqParam.public_flag = response.data[0].card_attribute;
					$scope.bankReqParam.debit = response.data[0].card_type;
					$scope.bankReqParam.bank_account_no = response.data[0].uaa_user_address;
				}else{
					$scope.bankReqParam.depositErr = '呜呜,没有查到新浪卡哦！';
				}
			});
	};
	
	//充值
	function depositSubmit(params){
		params.url = "http://121.43.191.224/#!/account/recharge?flag=sina";
		$scope.dataCreate.onlineDS_load= true;
		SinaPayService.depositSubmit(params)
			.then((response)=>{
				$scope.dataCreate.onlineDS_load= false;
				if(response.success){
					window.location.href=response.data.redirect_url;
				}else{
					$scope.bankReqParam.depositErr="呜呜,充值失败了!";
				}
			});
	};
	
	
	$scope.selectPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };
    $scope.pageChanged = function () {
      $scope.digitalCreate.market='CNY?page='+ ($scope.params.currentPage);
      getCnyDepositHistory($scope.digitalCreate.market);
    };
};

