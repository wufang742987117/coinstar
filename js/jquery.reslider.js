/**
 * Created by wenyu on 15/4/16.
 */
(function($){
    function Reslider(){
        this.defaults = {
            speed:1000,//设置轮播的高度
            delay:5000,//设置轮播的延迟时间
            imgCount:6,//设置轮播的图片数
            dots:true,//设置轮播的序号点
            autoPlay:true//设置轮播是否自动播放
        }
        this.count = 0;//轮播计数器
        this.timer = null;//轮播计时器
    }

    var _repro = Reslider.prototype;

    _repro.init = function(){

        this.doEvent();
        this.setBackground();
        setTimeout(this.autoPlay(),this.defaults.delay);

        if(this.defaults.dots){
          this.dots()
        }

      this.setUrl(this.count);

    }

    _repro.setBackground = function(){

        $('.slider-block').eq(0).css({
            'z-index':'98',
            'opacity':'1'
        })

        $('.slider-direction').css({
          'z-index':parseInt($('.slider-block').css('z-index'))+1
        })

    }

    _repro.doEvent = function(){

      var _self = this;
      $('.slider-direction-next').on('click',function(){

        _self.next()

      });

      $('.slider-direction-prev').on('click',function(){

        _self.prev()

      })


    }

    _repro.nextNormal = function(position){

        var _self = this;
        _self.setUrl(position);

        $('.slider-block').eq(position).animate({
          'opacity':'1'
        },_self.defaults.speed)

        $('.slider-block').eq(position).siblings('.slider-block').animate({
          'opacity':'0'
        },_self.defaults.speed)

    }

    _repro.next = function(){

        var _self = this;

        _self.nextNormal(_self.count+1)

        _self.dotsActive($('.slider-dots ul li').eq(_self.count+1));

        if(_self.count>=(_self.defaults.imgCount-1)) {
          _self.count = 0;
          _self.dotsActive($('.slider-dots ul li').eq(_self.count));
          $('.slider-block').eq(0).animate({
            'opacity':'1'
          },1000)
        }
        else if(_self.count>=0 && (_self.defaults.imgCount-1)){
          _self.count++;
        }
      }

    _repro.prev = function(){

      var _self = this;

      $('.slider-block').eq(_self.count).prev().animate({
        'opacity':'1'
      },_self.defaults.speed)

      _self.dotsActive($('.slider-dots ul li').eq(_self.count-1));

      if(_self.count>0){

        $('.slider-block').eq(_self.count).animate({
          'opacity':'0'
        },_self.defaults.speed)

        _self.count--;
      }else{
        _self.count = 0;
      }

      console.log(_self.count)

    }

    _repro.autoPlay = function(){
      var _self = this;

      if(_self.defaults.autoPlay){
        _self.timer=setInterval(function(){
          _self.next()
        },_self.defaults.delay)
      }
      else{
        clearInterval(_self.timer);
      }

    }

    _repro.dots = function(){

      var _self = this;

        for(var i = 0 ;i<this.defaults.imgCount;i++){
          $('.slider-dots ul').append('<li></li>')
        }

        $('.slider-dots').css({
          'z-index':parseInt($('.slider-block').css('z-index'))+1
        })

        $('.slider-dots ul li').eq(0).addClass('active');

        $('.slider-dots ul li').on('click',function(){
          _self.dotsActive($(this));

          _self.nextNormal(($(this).index()))

          _self.count = $(this).index()
        })

    }

    _repro.dotsActive = function(elements){
      elements.addClass('active').siblings().removeClass('active')
    }

    _repro.setUrl = function(index){
      var $url = $('.slider-block').eq(index).attr('data-url');

      $('.slider-block').eq(index).css({
        'background-image':'url('+$url+')'
      })
    }

    //扩展jQuery.prototype
    $.fn.reSlider = function(options){
        var reSlider = new Reslider();
        $.extend(reSlider.defaults,options)
        reSlider.init()
    }
})(jQuery)