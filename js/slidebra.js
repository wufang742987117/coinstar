

/** sidebra **/
$(document).ready(function() {

  /** Now in the initController for each controller
      $(document).ready(function() {
      $('#sidebar').sidr({
      name: 'sidr-right',
      side: 'right',
      source: '.leader'
      });
      });
  **/

  $("body").click(function(e) {
    $.sidr('close','sidr-right');
  });

  $("#sidebar").click(function(e) {
    e.stopPropagation();
  });

  $( window ).resize(function () {
    $.sidr('close', 'sidr-right');
  });

});
/** end sidebra **/





/**左右滑动动画

(function(window){
	var SlideBra = {
		param:{},
		//动画定时器
		timer: null,
		//动画控制器
		count: 0,
		opacity:0,
		//动画方法
		animate:function(){
			var _this=SlideBra;
			var dom = _this.getDom(_this.param.selectId);
			var myhide = _this.getDom(".myhide");
			if(_this.param.type=="right_to_left"){
				if(_this.count<0){
					_this.count = _this.count+(_this.param.time/10)/100;
					if(_this.count>0){
						dom.style.right = "0%";
						myhide.style.opacity = 0.5;
						_this.opacity = 0.5;
						clearInterval(_this.timer);
					}else{
						dom.style.right = _this.count+"%";
						myhide.style.opacity = _this.opacity+(_this.param.time/10)/10000;
					}
				}
			}else if(_this.param.type=="left_to_right"){
				if(_this.count>-100){
					_this.count = _this.count-(_this.param.time/10)/100;
					myhide.style.opacity = _this.opacity-(_this.param.time/10)/10000;
					_this.opacity = _this.opacity-(_this.param.time/10)/10000;
					dom.style.right = _this.count+"%";
				}else if(_this.count<=-100){
					dom.style.right = "-100%";
					myhide.style.opacity = 0;
					_this.opacity = 0;
					clearInterval(_this.timer);
				}
			}
		},
		//时间方法
		time: function(){
			var _this=SlideBra;
			_this.timer = setInterval(_this.animate,10);
		},
		//获取dom
		getDom : function(elementName){
			return document.querySelector(elementName);
		},
		//创建遮罩层
		createHide:function(){
			var _this=SlideBra;
			if(!_this.getDom(".myhide")){
				var body = _this.getDom("body");
				var div = document.createElement("div");
				div.setAttribute("class","myhide");
				div.onclick = _this.hide;
				body.appendChild(div);
			}
		},
		//隐藏方法
		hide:function(){
			var _this=SlideBra;
			_this.param.type="left_to_right";
			_this.count = 0;
			_this.opacity = 0.5;
			_this.time();
			_this.headerShow();
		},//隐藏方法
		show:function(){
			var _this=SlideBra;
			_this.param.type="right_to_left";
			_this.count = -100;
			_this.opacity = 0;
			_this.time();
			_this.hideHeader();
		},
		//初始化
		init:function(param){
			var _this=SlideBra;
			_this.param = param;
			if(_this.param.type=="right_to_left"){
				_this.count = -100;
				_this.opacity = 0;
				_this.hideHeader();
			}else if(_this.param.type=="left_to_right"){
				_this.count = 0;
				_this.opacity = 0.5;
			}
			//初始化定时器
			//_this.time();
			//创建隐藏遮罩层
			var hide = _this.createHide();
			//初始化触屏事件
			_this.touch();
		},
		//隐藏头部
		hideHeader:function(){
			var _this=SlideBra;
			if(_this.getDom("#sidebar")){
				sidebar.style.display = "none";
			}
		},
		//显示头部
		headerShow:function(){
			var _this=SlideBra;
			if(_this.getDom("#sidebar")){
				setTimeout(function(){
					sidebar.style.display = "block";
				},_this.param.time/10)
				
			}
		},
		//触屏事件
		touch:function(){
			var _this=SlideBra;
			var startX = 0;
			var endX = 0;
			var startRight = -100;
			var endRightFlag = 0;
			var endLeftFlag = 0;
			document.addEventListener("touchstart",function(e){
				var target = e.touches[0];
				startX = target.pageX;
			});
			document.addEventListener("touchmove",function(e){
				var dom = _this.getDom(_this.param.selectId);
				var myhide = _this.getDom(".myhide");
				var target = e.touches[0];
				endX = target.pageX;
				if((endX-startX)<-100){
					_this.hideHeader();
					endRightFlag = 1;
					if(startRight==0){
						startRight = 0;
						dom.style.right = startRight;
					}else{
						startRight = startRight + 1;
						dom.style.right = startRight+"%";
						myhide.style.opacity = _this.opacity+(_this.param.time/10)/10000;
					}
				}else if((endX-startX)>100){
					_this.hideHeader();
					endLeftFlag = 1;
					if(startRight==-100){
						startRight = -100;
						dom.style.right = startRight;
					}else{
						startRight = startRight - 1;
						myhide.style.opacity = _this.opacity-(_this.param.time/10)/10000;
						_this.opacity = _this.opacity-(_this.param.time/10)/10000;
						dom.style.right = startRight+"%";
					}
				}
			});
			document.addEventListener("touchend",function(e){
				var target = e.target;
				var dom = _this.getDom(_this.param.selectId);
				var myhide = _this.getDom(".myhide");
				var timers = null;
				if(endRightFlag==1){
					timers = setInterval(function(){
						startRight = startRight+(_this.param.time/10)/100;
						if(startRight>0){
							dom.style.right = "0%";
							myhide.style.opacity = 0.5;
							_this.opacity = 0.5;
							endRightFlag = 0;
							clearInterval(timers);
						}else{
							dom.style.right = startRight+"%";
							myhide.style.opacity = _this.opacity+(_this.param.time/10)/10000;
						}
					},10);
				}
				//console.log(endLeftFlag);
				if(endLeftFlag==1){
					timers = setInterval(function(){
						if(startRight>-100){
							startRight = startRight-(_this.param.time/10)/100;
							myhide.style.opacity = _this.opacity-(_this.param.time/10)/10000;
							_this.opacity = _this.opacity-(_this.param.time/10)/10000;
							dom.style.right = startRight+"%";
						}else if(startRight<=-100){
							dom.style.right = "-100%";
							myhide.style.opacity = 0;
							_this.opacity = 0;
							endLeftFlag = 0;
							_this.headerShow();
							clearInterval(timers);
						}
					},10);
				}
			});
		}
	};
	window.SlideBra = SlideBra;
})(window);

**/
