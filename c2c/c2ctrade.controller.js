/**
 * Created by HJJ on 2018/2/28.
 */

'use strict';

angular.module('app')
    .controller('C2ctradeController', C2ctradeController)
    .filter('typeFilter', function () {
        return function (type, lang) {
            if (lang == 'zh') {
                if (type == 1) {
                    var typeName = '買入';
                } else {
                    typeName = '賣出';
                }
            }
            if (lang == 'en') {
                if (type == 1) {
                    var typeName = 'buy in';
                } else {
                    typeName = 'sell out';
                }
            }
            return typeName;
        };
    })
    .filter('statusFilter', function () {
        return function (sta, lang) {
            if (lang == 'zh') {
                if (sta == 1) {
                    var staName = '待確認';
                } else if (sta == 2) {
                    staName = '確認中';
                } else if (sta == 3) {
                    staName = '完成';
                } else if (sta == 4) {
                    staName = '已撤銷';
                } else if (sta == 0) {
                    staName = '待審核';
                }
            }
            if (lang == 'en') {
                if (sta == 1) {
                    staName = 'To be confirmed';
                } else if (sta == 2) {
                    staName = 'Confirmation';
                } else if (sta == 3) {
                    staName = 'complete';
                } else if (sta == 4) {
                    staName = 'Revoked';
                } else if (sta == 0) {
                    staName = 'be audited';
                }
            }
            return staName;
        }
    })
    .filter('dateFilter', function () {
        return function (date) {
            var newDate = new Date(date);
            newDate = newDate.getTime();
            return newDate;
        }
    })
    .filter('amount', function () {
        return function (number) {
            var number = parseInt(number);
            if (number.toString() == 'NaN') number = 0;
            return number / Math.pow(10, 8);
        };
    })
    .filter('numUpFilter', function () {
        return function (num) {
            var numUp = Math.ceil(num);
            return numUp;
        }
    })
    .filter('nFilter', function () {
        return function toDecimal2(num, obj) {
            var f = parseFloat(num);
            if (isNaN(f)) {
                return false;
            }
            var f = Math.round(num * 100) / 100;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + 2) {
                s += '0';
            }
            // console.log(obj);
            var m = 0, s1 = (obj + "").toString(), s2 = Number(s).toString();
            try {
                m += s1.split(".")[1].length
            } catch (e) {
            }
            try {
                m += s2.split(".")[1].length
            } catch (e) {
            }
            var aa = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
            // console.log(aa);
            return aa;
        }
    })

    .filter('n2Filter', function () {
        return function toDecimal2(num) {
            var f = parseFloat(num);
            if (isNaN(f)) {
                return false;
            }
            var f = Math.round(num * 100) / 100;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + 2) {
                s += '0';
            }
            return s;
        }
    })


function C2ctradeController($scope, C2cService,$translate, FlashService, PrivateService, $http, $cookies) {
	if(!$scope.language) {
		$scope.language = $translate.use();
	}
    var warmTip = localStorage.getItem('_warmTip_');
    $scope.userFirstInPop = warmTip ? 1 : 0;
    $scope.uid = 10;
    $scope.CardPop = false;
    $scope.buyPop = false;
    $scope.dayLimitPop = false;
    $scope.params = {};
    $scope.type = 'button';
    $scope.cardUser = {name: '', id: '', branch: '', card: '', selBankId: 102};
    $scope.goldPrice = '';
    $scope.buyFormData = {};
    $scope.sellFormData = {};
    $scope.bankNames = [
        // { name:"请选择银行名字",    id: 1},
        {name: "中国工商银行", id: 102},
        {name: "中国农业银行", id: 103},
        {name: "中国银行", id: 104},
        {name: "中国建设银行", id: 105},
        {name: "中国中信银行", id: 302},
        {name: "中国光大银行", id: 303},
        {name: "华夏银行", id: 304},
        {name: "中国民生银行", id: 305},
        {name: "招商银行", id: 308},
        {name: "兴业银行", id: 309},
        {name: "广东发展银行", id: 306},
        {name: "平安银行", id: 307},
        {name: "浦发银行", id: 310},
        {name: "恒丰银行", id: 315},
        {name: "浙商银行", id: 316},
        {name: "渤海银行", id: 318},
        {name: "中国邮政储蓄银行", id: 403},
        {name: "城市商业银行", id: 313},
        {name: "北京银行", id: 4031000},
        {name: "上海银行", id: 4012900},
        {name: "宁波银行", id: 4083320},
        {name: "南京银行", id: 4243010},
        {name: "东亚银行", id: 502},
        {name: "徽商银行", id: 319},
        {name: "国家开发银行", id: 201},
        {name: "中国进出口银行", id: 202},
        {name: "中国农业发展银行", id: 203},
        {name: "深圳发展银行", id: 307},
        {name: "农村商业银行", id: 314},
        {name: "农村合作银行", id: 317},
        {name: "城市信用社", id: 401},
        {name: "农村信用社", id: 402},
        {name: "汇丰银行", id: 501},
        {name: "南洋商业银行", id: 503},
        {name: "恒生银行(中国)有限公司", id: 504},
        {name: "中国银行(香港)有限公司", id: 104},
        {name: "集友银行有限公司", id: 506},
        {name: "创兴银行有限公司", id: 507},
        {name: "星展银行(中国)有限公司", id: 509},
        {name: "意大利联合圣保罗银行股份有限公司", id: 732},
        {name: "瑞士信贷银行股份有限公司", id: 741},
        {name: "瑞士银行", id: 742},
        {name: "加拿大丰业银行有限公司", id: 751},
        {name: "加拿大蒙特利尔银行有限公司", id: 752},
        {name: "澳大利亚和新西兰银行集团有限公司", id: 761},
        {name: "摩根士丹利国际银行(中国)有限公司", id: 771},
        {name: "联合银行(中国)有限公司", id: 775},
        {name: "荷兰合作银行有限公司", id: 776},
        {name: "厦门国际银行", id: 781},
        {name: "法国巴黎银行(中国)有限公司", id: 782},
        {name: "华一银行", id: 787},
        {name: "(澳门地区)银行", id: 969},
        {name: "(香港地区)银行", id: 989},
        {name: "中信实业银行", id: 3020000},
        {name: "厦门市商业银行", id: 4023930},
        {name: "烟台市商业银行", id: 4044560},
        {name: "福州市商业银行", id: 4053910},
        {name: "长春市商业银行", id: 4062410},
        {name: "镇江市商业银行", id: 4073140},
        {name: "宁波市商业银行", id: 4083320},
        {name: "济南市商业银行", id: 4094510},
        {name: "焦作市商业银行", id: 4115010},
        {name: "温州市商业银行", id: 4123330},
        {name: "广州市商业银行", id: 4135810},
        {name: "武汉市商业银行", id: 4145210},
        {name: "齐齐哈尔市商业银行", id: 4162640},
        {name: "湖北农信社", id: 4025350},
        {name: "乐山商行", id: 3136650},
        {name: "宁波银行", id: 4083320},
        {name: "昆仑银行", id: 3138820},
        {name: "沈阳市商业银行", id: 4172210},
        {name: "洛阳市商业银行", id: 4184930},
        {name: "辽阳市商业银行", id: 4192310},
        {name: "大连市商业银行", id: 4202220},
        {name: "苏州市商业银行", id: 4213050},
        {name: "杭州市商业银行", id: 4233310},
        {name: "南京市商业银行", id: 4243010},
        {name: "金华市商业银行", id: 4263380},
        {name: "绍兴市商业银行", id: 4283370},
        {name: "成都市商业银行", id: 4296510},
        {name: "抚顺市商业银行", id: 4302240},
        {name: "临沂市商业银行", id: 4314730},
        {name: "宜昌市商业银行", id: 4325250},
        {name: "天津市商业银行", id: 4341100},
        {name: "郑州市商业银行", id: 4354910},
        {name: "银川市商业银行", id: 4368710},
        {name: "珠海市商业银行", id: 4375850},
        {name: "淄博市商业银行", id: 4384530},
        {name: "锦州市商业银行", id: 4392270},
        {name: "合肥市商业银行", id: 4403610},
        {name: "重庆市商业银行", id: 4416530},
        {name: "贵阳市商业银行", id: 4437010},
        {name: "西安市商业银行", id: 4447910},
        {name: "无锡市商业银行", id: 4453020},
        {name: "丹东市商业银行", id: 4462260},
        {name: "兰州市商业银行", id: 4478210},
        {name: "南昌市商业银行", id: 4484220},
        {name: "太原市商业银行", id: 4491610},
        {name: "青岛市商业银行", id: 4504520},
        {name: "吉林市商业银行", id: 4512420},
        {name: "南通市商业银行", id: 4523060},
        {name: "扬州市商业银行", id: 4533120},
        {name: "九江市商业银行", id: 4544240},
        {name: "日照市商业银行", id: 4554732},
        {name: "鞍山市商业银行", id: 4562230},
        {name: "西宁市商业银行", id: 4588510},
        {name: "台州市商业银行", id: 4593450},
        {name: "长沙市商业银行", id: 4615510},
        {name: "潍坊市商业银行", id: 4624580},
        {name: "赣州市商业银行", id: 4634280},
        {name: "营口市商业银行", id: 4652280},
        {name: "昆明市商业银行", id: 4667310},
        {name: "阜新市商业银行", id: 4672290},
        {name: "常州市商业银行", id: 4683040},
        {name: "淮安市商业银行", id: 4693080},
        {name: "嘉兴市商业银行", id: 4703350},
        {name: "芜湖市商业银行", id: 4713620},
        {name: "廊坊市商业银行", id: 4721460},
        {name: "盐城市商业银行", id: 313},
        {name: "泉州银行", id: 4643970},
        {name: "农信湖南", id: 4025510},
        {name: "东莞银行", id: 4256020},
        {name: "永隆银行", id: 512},
        {name: "威海商业银行", id: 4814650},
        {name: "淮北商业银行", id: 4823660},
        {name: "农信社(北京", id: 4021000},
        {name: "安庆商业银行", id: 4843680},
        {name: "绵阳商业银行", id: 4856590},
        {name: "泸州商业银行", id: 4866570},
        {name: "大同商业银行", id: 4871620},
        {name: "南宁商业银行", id: 4786110},
        {name: "包头商业银行", id: 4791920},
        {name: "湖州市商业银行", id: 4753360},
        {name: "连云港商业银行", id: 4803070},
        {name: "攀枝花商业银行", id: 4836560},
        {name: "马鞍山商业银行", id: 4773650},
        {name: "张家口商业银行", id: 4901380},
        {name: "青岛农村信用社", id: 14144520},
        {name: "东莞农村信用社", id: 14156020},
        {name: "上海市农村信用社", id: 14012900},
        {name: "昆山市农村信用社", id: 14023052},
        {name: "常熟市农村信用社", id: 14033055},
        {name: "深圳市农村信用社", id: 14045840},
        {name: "广州市农村信用社", id: 14055810},
        {name: "三门峡城市信用社", id: 4885050},
        {name: "石家庄市商业银行", id: 4221210},
        {name: "秦皇岛市商业银行", id: 4571260},
        {name: "葫芦岛市商业银行", id: 4332350},
        {name: "哈尔滨市商业银行", id: 4422610},
        {name: "南海市农村信用社", id: 14075882},
        {name: "顺德市农村信用社", id: 14085883},
        {name: "昆明市农村信用社", id: 14097310},
        {name: "武汉市农村信用社", id: 14105210},
        {name: "重庆市农村信用社", id: 14136530},
        {name: "厦门市农村信用社", id: 14173930},
        {name: "北京农村信用联社", id: 14181000},
        {name: "天津市农村信用社", id: 14191100},
        {name: "成都市农村信用社", id: 14226510},
        {name: "沧州市农村信用社", id: 14231440},
        {name: "江苏省农村信用社", id: 14243000},
        {name: "荷兰银行", id: 661},
        {name: "渣打银行", id: 671},
        {name: "南昌银行", id: 44842},
        {name: "农信安徽", id: 40236},
        {name: "绵阳商行", id: 48565},
        {name: "台州市泰隆城市信用社", id: 4733450},
        {name: "宁波鄞州农村合作银行", id: 14203320},
        {name: "张家港市农村商业银行", id: 14163056},
        {name: "徐州市市郊农村信用社", id: 14113030},
        {name: "山东省市农村信用社", id: 14144500},
        {name: "呼和浩特市商业银行", id: 4741900},
        {name: "乌鲁木齐市商业银行", id: 4278810},
        {name: "永亨银行(中国)有限公", id: 510},
        {name: "佛山市三水区农村信用社", id: 14215881},
        {name: "杭州市萧山区农村信用社", id: 14063317},
        {name: "花旗银行(中国)有限公司", id: 531},
        {name: "美国银行有限公司", id: 532},
        {name: "韩国产业银行", id: 594},
        {name: "摩根大通银行(中国)有限公司", id: 533},
        {name: "三菱东京日联银行(中国)有限公司", id: 561},
        {name: "日本三井住友银行股份有限公司", id: 563},
        {name: "韩国中小企业银行有限公司", id: 596},
        {name: "日本山口银行股份有限公司", id: 565},
        {name: "韩国外换银行股份有限公司", id: 591},
        {name: "友利银行(中国)有限公司", id: 593},
        {name: "新韩银行(中国)有限公司", id: 595},
        {name: "韩亚银行(中国)有限公司", id: 597},
        {name: "华侨银行(中国)有限公司", id: 621},
        {name: "大华银行(中国)有限公司", id: 622},
        {name: "星展银行(中国)有限公司", id: 623},
        {name: "瑞穗实业银行(中国)有限公司", id: 564},
        {name: "泰国盘谷银行(大众有限公司)", id: 631},
        {name: "奥地利中央合作银行股份有限公司", id: 641},
        {name: "比利时联合银行股份有限公司", id: 651},
        {name: "比利时富通银行有限公司", id: 652},
        {name: "荷兰安智银行股份有限公司", id: 662},
        {name: "英国苏格兰皇家银行公众有限公司", id: 672},
        {name: "法国兴业银行(中国)有限公司", id: 309},
        {name: "法国东方汇理银行股份有限公司", id: 694},
        {name: "法国外贸银行股份有限公司", id: 695},
        {name: "德国德累斯登银行股份公司", id: 711},
        {name: "德意志银行(中国)有限公司", id: 712},
        {name: "德国商业银行股份有限公司", id: 713},
        {name: "德国西德银行股份有限公司", id: 714},
        {name: "德国巴伐利亚州银行", id: 715},
        {name: "德国北德意志州银行", id: 716},
        {name: "江西农信社", id: 4024210},
        {name: "山东农信社", id: 14144500}
    ];
    $scope.account = {};
    $scope.msg = false;
    $scope.busniessBalanceSmall = false;
    $scope.C2C_TIP_NOTONLINE = false;
    $scope.C2C_ORDER_UN_LIMIT = false;
    $scope.C2C_TIP_NOTONLINE_2 = false;
    $scope.C2C_ORDER_UN_LIMIT_2 = false;
    $scope.buyOutLimit = false;
    $scope.canNotBuy = false;
    $scope.sellLimit = false;
    $scope.busniessBalanceSmall_2 = false;
    $scope.orderId = 0;
    $scope.sellMsg = false;
    $scope.changeRecord = [];
    $scope.changeRecord2 = [];
    $scope.changeRecord3 = [];
    $scope.changeRecordAll = [];
    $scope.changeRecordList = [];
    $scope.changeRecordList2 = [];
    $scope.changeRecordList3 = [];
    $scope.changeRecordList4 = [];
    $scope.changeRecordList5 = [];
    $scope.scrollDataOdd = [];
    $scope.scrollDataEven = [];
    $scope.changeRecordSell = [];
    $scope.changeRecordList2 = [];
    $scope.showCard = 0;
    $scope.real = 0;
    $scope.params = {
        currentPage: 1,
        pagesize: 10,
        dataList: [],
        totalItems: 0
    };
    // var clickIndex = false;
    var keepGoing = true;
    var keepGoing2 = true;
    var keepGoing3 = true;
    var timer = null;

    $scope.revoke = function (order_id) { //撤销此笔订单
        C2cService.cancelOrder(
            order_id,
        ).then(function (res) {
            if (!res.success) {
                FlashService.Toast("C2CORDERCANCEL.ERROR", 'error');
            } else {
                FlashService.Toast("C2CORDERCANCEL.SUCCESS", 'success');
                $scope.getChangeReloadList(1, $scope.uid)
            }
        })
    }
    $scope.clearNum = function (obj, attr) {
        obj[attr] = obj[attr].replace(/\D/g, "");
    }
    $scope.GetGoldPrice = function () {
		C2cService.getUsdtPrice().then(function (res) {
			$scope.goldPrice = res.data;
		})
    };
    $scope.checkBussiness = function () {
        C2cService.checkBussiness().then(function (res) {
            $scope.uid = res.data.business_type;
            if ($scope.uid === 0) { //卖出商户
                $scope.getBalance();
                $scope.sellBuyInfo(1);//获取求购/出售信息
                $scope.getChangeReloadList(1, $scope.uid) //获取下面当前记录
            }
            if ($scope.uid === 5) {  //用户// 获取滚动数据
                $scope.scrollList()//买单
                $scope.scrollList2()//卖单
                $scope.getAuthInfo();
            }
            if ($scope.uid === 1) { //商户
                $scope.getChangeReloadList(1, $scope.uid) //获取下面当前记录
                $scope.sellBuyInfo(1);//获取求购/出售信息
            }
            // $scope.getChangeReloadList('', $scope.uid);

            $cookies.put('uid', $scope.uid);
        });
    };
    $scope.checkAuthInfo = function (type, vol) {
        C2cService.checkAuthInfo($scope.params).then(function (res) {
            if (!res.success) {
                $scope.real = 1;
                return;
            } else {
                $scope.real = 2;
                $scope.getChangeReloadList('', $scope.uid)
                // clickIndex = true;
                $scope.subForm(type, vol);
            }
        });
    };
    $scope.getAuthInfo = function () {
        C2cService.checkAuthInfo($scope.params).then(function (res) {
            if (res.success) {
                $scope.getChangeReloadList('', $scope.uid)
                $scope.showCard = 1;
            }
        });

    }
    $scope.deleteMsg = function (type) {
        if (type === 1) {
            $scope.msg = false;
        } else if (type === 2) {
            $scope.sellMsg = false;
            $scope.sellLimit = false;
            if($scope.sellFormData.sell_vol<38){
                $scope.SELL_LIMIT = true;
                $scope.sellMsg = true;
            }else {
                $scope.SELL_LIMIT = false;
                $scope.sellMsg = false;
            }
        }
        $scope.real = 0;
    };
    $scope.checkAuthInfoBtn = function () {
        C2cService.checkAuthInfo($scope.params).then(function (res) {
            if (res.success) {
                return;
            } else if (!res.success ) {
                $scope.popStatus('新增银行卡');
            }else {
                return
            }
        });
    };
    $scope.submitCard = function () {
        $scope.cardUser.selBankId = $scope.cardUser.selBankId.toString();
        C2cService.authUserInfo(
            $scope.cardUser.name,
            $scope.cardUser.id,
            $scope.cardUser.selBankId,
            $scope.cardUser.branch,
            $scope.cardUser.card
        ).then(function (res) {
            if (res.success) {
                setTimeout($scope.popStatus('关闭新增银行卡'), 1000)
            }
        })
    };
    $scope.subForm = function (type, vol) {
        vol = Number(vol);
        if (type === 2) {
            C2cService.getUserLimit(
                vol,
            ).then(function (res) {
                // console.log(res);
                if (!res.success) {
                    $scope.sellMsg = true;
                    if(res.message=="ORDER_UN_LIMIT") {
                        $scope.C2C_ORDER_UN_LIMIT_2=true;
                        $scope.sellLimit = false;
                        $scope.C2C_TIP_NOTONLINE_2 = false;
                        $scope.busniessBalanceSmall_2 = false
                    }else if(res.message=="OUT_LIMIT"){
                        $scope.sellLimit = true;
                        $scope.C2C_TIP_NOTONLINE_2 = false;
                        $scope.C2C_ORDER_UN_LIMIT_2 = false;
                        $scope.busniessBalanceSmall_2 = false
                    }else if(res.message=="BUSINESS_BALANCE_TOO_SMALL") {
                        $scope.busniessBalanceSmall_2 = true;
                        $scope.sellLimit = false;
                        $scope.C2C_TIP_NOTONLINE_2 = false;
                        $scope.C2C_ORDER_UN_LIMIT_2 = false;
                    }
                } else {
                    C2cService.createOrder(
                        type,
                        'USDT',
                        vol
                    ).then(function (res) {
                        if (res.success) {
                            FlashService.Toast("C2CORDER.SUCCESS", 'success');
                            $scope.sellFormData.sell_vol = '';
                            $scope.getChangeReloadList('', $scope.uid)
                        } else {
                            $scope.sellMsg = true;
                            if (res.message === 'OUT_LIMIT') {
                                FlashService.Toast("C2CORDER.LIMIT", 'error');
                                $scope.sellMsg = false;
                            } else if (res.message === 'USER_BALANCE_TOO_SMALL') {
                                FlashService.Toast("C2CORDER.USER_BALANCE_TOO_SMALL", 'error');
                                $scope.sellMsg = false;
                            }else if(res.message=='BUSINESS_NOT_ONLINE'||res.message=='NOT_FOUND_BUSINESS') {
                                $scope.C2C_TIP_NOTONLINE_2 = true;
                                $scope.C2C_ORDER_UN_LIMIT_2 = false;
                                $scope.busniessBalanceSmall_2 = false
                            }else if(res.message=='C2C_ORDER_UN_LIMITS'){
                                $scope.C2C_ORDER_UN_LIMIT_2 = true;
                                $scope.C2C_TIP_NOTONLINE_2 = false;
                                $scope.busniessBalanceSmall_2 = false
                            }else if(res.message=="BUSINESS_BALANCE_TOO_SMALL"){
                                $scope.busniessBalanceSmall_2 = true;
                                $scope.C2C_ORDER_UN_LIMIT_2 = false;
                                $scope.C2C_TIP_NOTONLINE_2 = false;
                            }
                            // else if(res.message=="USER_WITHDRAW_LIMIT") {
                            //     $scope.sellMsg = false;
                            //     FlashService.Toast("USER_WITHDRAW_LIMIT", 'error');
                            // }
                            else {
                                $scope.sellMsg = false;
                                FlashService.Toast("C2CORDER.ELSE", 'error');
                            }
                        }
                    });
                }
            })
        } else {
            C2cService.createOrder(
                type,
                'USDT',
                vol
            ).then(function (res) {
                if (!res.success) {
                    $scope.msg = true;
                    if (res.message === 'BUSINESS_BALANCE_TOO_SMALL') {
                        $scope.busniessBalanceSmall = true;
                        $scope.C2C_TIP_NOTONLINE = false;
                        $scope.C2C_ORDER_UN_LIMIT = false;
                    }else if(res.message=='BUSINESS_NOT_ONLINE') {
                        $scope.C2C_TIP_NOTONLINE = true;
                        $scope.C2C_ORDER_UN_LIMIT = false;
						$scope.canNotBuy = false;
                    }else if(res.message=='ORDER_UN_LIMIT'){
                        $scope.C2C_ORDER_UN_LIMIT = true;
                        $scope.C2C_TIP_NOTONLINE = false;
                    }
                    else if (res.message === 'OUT_LIMIT') {
                        $scope.buyOutLimit = true;
                        $scope.C2C_TIP_NOTONLINE = false;
                        $scope.C2C_ORDER_UN_LIMIT = false;
                        // console.log($scope.buyOutLimit)
                    } else {
                        $scope.canNotBuy = true;
                        $scope.C2C_TIP_NOTONLINE = false;
                        $scope.C2C_ORDER_UN_LIMIT = false;
                    }
                } else {
                    $scope.orderId = res.data.id;
                    $scope.asset_price = res.data.asset_price;
                    $scope.asset_amount = res.data.asset_amount;
                    $scope.remit_code = res.data.remit_code;
                    $scope.order_type = res.data.order_type;
                    $scope.popStatus('打开收款账户', $scope.orderId, $scope.asset_price, $scope.asset_amount, $scope.remit_code, $scope.order_type);
                    $scope.buyOutLimit = false;
                    $scope.C2C_ORDER_UN_LIMIT = false;
                    $scope.C2C_TIP_NOTONLINE = false;
                    $scope.msg = false;
                }
            });
        }
    };


    $scope.getRecords = function (type, order_type, create_time_start, create_time_end, commercial_id, remark) {
        C2cService.getChangeReloadList(
            type,
            order_type,
            create_time_start,
            create_time_end,
            commercial_id,
            remark,
            $scope.params.currentPage,
            $scope.params.pagesize
        ).then(function (res) {
            $scope.changeRecordAll = res.data.data;
            $scope.params.totalItems = res.data.count;
        })

    }
    $scope.confirmOrder = function (id) {
        C2cService.confirmOrder(
            id,
        ).then(function (res) {
            if (!res.success) {
                if(res.message=="USER_WITHDRAW_LIMIT") {
                    FlashService.Toast("USER_WITHDRAW_LIMIT", 'error');
                }else
                FlashService.Toast("C2CORDER.ERROR", 'error');
            } else {
                FlashService.Toast("C2CORDER.SUCCESS", 'success');
                setTimeout(function () {
                    $scope.getChangeReloadList(1, $scope.uid)
                }, 1000)
            }
        })

    };
    $scope.sellBuyInfo = function (order_type) {
        $scope.orderType = order_type;
        C2cService.userScrollInfo(
            order_type,
        ).then(function (res) {
            if (order_type === 2) {
                if (!res.data.data) {
                    return;
                }
                $scope.changeRecordSell = res.data.data;

            } else {
                if (!res.data.data) {
                    return;
                }
                $scope.changeRecord = res.data.data;
            }
        })
    }
    $scope.getBankInfo = function (id, price, amount, code, order_type, status) {  //点击列表里的待确认或者点击买单里的提交按钮
        C2cService.querybusinessInfo(//获取收款账户弹窗回写信息
            id,
        ).then(function (res) {
            $scope.account = res.data;
            $scope.asset_price = price;
            $scope.asset_amount = amount;
            $scope.remit_code = code;
            $scope.order_type = order_type;
            $scope.orderId = id;
            $scope.status = status;
            // console.log($scope.status)
        })
    }
    $scope.popStatus = function (type, orderId, price, amount, code, order_type, status) {
        switch (type) {
            case '新增银行卡':
                $scope.CardPop = true;
                break;
            case '关闭新增银行卡':
                $scope.CardPop = false;
                break;
            case '打开收款账户':
                $scope.buyPop = true;
                $scope.getBankInfo(orderId, price, amount, code, order_type, status);
                break;
            case '关闭收款账户':

                $scope.buyPop = false;
                $scope.buyFormData.buy_vol = '';
                $scope.msg = false;
                if ($scope.uid !== 5) {
                    //商户里待确认的时候可以有确认这个功能
                    if (status === 1) {
                        $scope.confirmOrder(orderId);
                    }
                } else {
                    $scope.getChangeReloadList('', $scope.uid);
                }
                break;
            case '打开每日限额':
                $scope.dayLimitPop = true;
                break;
            case '关闭收款账户按钮':
                $scope.buyPop = false;
                $scope.buyFormData.buy_vol = '';
                $scope.msg = false;
                break;
            case '关闭每日限额':
                $scope.dayLimitPop = false;
                break;
            case '关闭温馨提示':
                $scope.userFirstInPop = 1;
                localStorage.setItem('_warmTip_', 1);
                break;
        }
    };
    $scope.getChangeReloadList = function (type, id, remark) {
        $scope.orderType = type;
        if (id === 0) { //卖出商户
            C2cService.getChangeReloadList(
                type,
                '',
                remark
            ).then(function (res) {
                if (!res.data.data) {
                    return;
                }
                $scope.changeRecordAll = res.data.data;
            })
        } else if (id === 5) { //会员
            C2cService.getChangeReloadList(
                2
            ).then(function (res) {
                if (!res.data.data) {
                    return;
                }
                $scope.changeRecord = res.data.data.slice(0, 10);
            });
        } else if (id === 1) {  //商户
            C2cService.getChangeReloadList(
                1,
                remark
            ).then(function (res) {
                if (!res.data.data) {
                    return;
                }
                $scope.changeRecordAll = res.data.data.slice(0, 10);
            });

        }
    };
    $scope.getBalance = function () {
        PrivateService.Balances(
        ).then(function (res) {
            var temp = {};
            for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].asset === 'USDT') {
                    temp[res.data[i].asset] = res.data[i];
                }
            }
            $scope.balanceData = temp;
        })

    }

    $scope.scrollList = function () {
        //你先改这个，这个是左边的，改好了，我就复制，右边就好了，
        C2cService.userScrollInfo(
            1
        ).then(function (res) {
            $scope.scrollDataOdd = res.data.data;
            (function(){
                $.fn.FontScroll = function(options){
                    var d = {time: 3000,num: 1}
                    var o = $.extend(d,options);
                    this.children('ul').addClass('lines_left');
                    var _con_left = $('.lines_left').eq(0);
                    var _conH_left = $scope.scrollDataOdd.length*40; //滚动总高度
                    var _conChildH_left = 40;//一次滚动高度
                    var _temp = _conChildH_left;  //临时变量
                    var _time = d.time;  //滚动间隔
                    var _s = d.s;  //滚动间隔

                    _con_left.clone().insertAfter(_con_left);//初始化克隆

                    //样式控制
                    var num = d.num;
                    var _p = this.find('li');
                    var allNum = _p.length;

                    if(_conH_left > 80) {
                        var timeID_left = setInterval(Up_left,_time);
                        this.hover(function(){clearInterval(timeID_left)},function(){timeID_left = setInterval(Up_left,_time);});
                    }

                    function Up_left(){
                        _con_left.animate({marginTop: '-'+_conChildH_left});
                        //样式控制
                        _p.removeClass(_s);
                        num += 1;
                        _p.eq(num).addClass(_s);

                        if(_conH_left <=_conChildH_left){
                            _con_left.animate({marginTop: '-'+_conChildH_left},"normal",over_left);
                        } else {
                            _conChildH_left += _temp;
                        }
                    }
                    function over_left(){
                        _con_left.attr("style",'margin-top:0');
                        _conChildH_left = _temp;
                        num=1;
                    }
                }
            })();
            $('#FontScroll').FontScroll({time: 3000,num: 1});
            // $(function () {
            //     var $uList2 = $('.scroll-box2');
            //     var num2 = 0;
            //     var scrollHeight2 = $(".scroll-box2 ul:first").height();
            //
            //     setInterval(function () {
            //         $uList2.animate({'marginTop': -(scrollHeight2 * num2) + 'px'}, 500);
            //         if ($scope.scrollDataOdd.length<= (num2+1)) {
            //             num2 = 0;
            //         } else {
            //             num2++;
            //         }
            //     }, 3000)
            //
            //
            // })
        })
    }

    $scope.scrollList2 = function () {

        // 好使的 可是我左右两边数据有可能不是一样多啊 你这都是用的同一个变量  哪个变量

        C2cService.userScrollInfo(
            2
        ).then(function (res) {
            $scope.scrollDataEven = res.data.data;
            (function(){
                $.fn.FontScroll2 = function(options){
                    var d = {time: 3000,num: 1}
                    var o = $.extend(d,options);
                    this.children('ul').addClass('lines');
                    var _con = $('.lines').eq(0);
                    var _conH = $scope.scrollDataEven.length*40; //滚动总高度
                    var _conChildH = 40;//一次滚动高度
                    var _temp = _conChildH;  //临时变量
                    var _time = d.time;  //滚动间隔
                    var _s = d.s;  //滚动间隔

                    _con.clone().insertAfter(_con);//初始化克隆
                    //样式控制
                    var num = d.num;
                    var _p = this.find('li');
                    var allNum = _p.length;


                    if(_conH > 80) {
                        var timeID = setInterval(Up,_time);
                        this.hover(function(){clearInterval(timeID)},function(){timeID = setInterval(Up,_time);});

                    }
                    function Up(){
                        _con.animate({marginTop: '-'+_conChildH});
                        //样式控制
                        _p.removeClass(_s);
                        num += 1;
                        _p.eq(num).addClass(_s);

                        if(_conH <=_conChildH){
                            _con.animate({marginTop: '-'+_conChildH},"normal",over);
                        } else {
                            _conChildH += _temp;
                        }
                    }
                    function over(){
                        _con.attr("style",'margin-top:0');
                        _conChildH = _temp;
                        num=1;
                    }
                }
            })();
            $('#FontScroll2').FontScroll2({time: 3000,num: 1});
            // $('#FontScroll2').FontScroll2({time: 3000,num: 1});
            // $('#FontScroll2').FontScroll({time: 3000,num: 1});
            // $(function () {
            //     var $uList = $('.scroll-box');
            //     var num = 0;
            //     var scrollHeight = $(".scroll-box ul:first").height();
            //
            //     setInterval(function () {
            //         $uList.animate({'marginTop': -(scrollHeight * num) + 'px'}, 500);
            //         if ($scope.scrollDataEven.length<= (num+1)) {
            //             num = 0;
            //         } else {
            //             num++;
            //         }
            //     }, 3000)
            //
            // })
        })
    }


    $scope.init = function () {
        $scope.checkBussiness();
        $scope.GetGoldPrice();
    };
    $scope.init();
}
