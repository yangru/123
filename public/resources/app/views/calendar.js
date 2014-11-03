(function(method){
    if(typeof(define) === "function"){
        define(method);
    }else{
        method();
    }
})(function(require,exports,module){
    var $ = window.$ || window.jQuery || require("jquery");

    $.fn.jCal = function (opt) {
        $.jCal(this, opt);
    };
    $.jCal = function (target, opt) {
        opt = $.extend({
            day:            new Date(),                                 // date to drive first cal
            beginDate:      new Date(),                                   //
            endDate:        new Date(),                                   // 
            showMonths:     3,                                          // how many side-by-side months to show
            monthSelect:    true,                                       // show selectable month and year ranges via animated comboboxen
            dateSelect:     false,
            dCheck:         function (date){ 
                if(date < new Date()){
                    return true; 
                }else{
                    return false;
                }
            },                                                          // handler for checking if single date is valid or not
            callback:       function (beginDate, endDate) { return true; },     // callback function for click on date
            selectedBG:     'rgba(216, 208, 10, 0.59)',                         // default bgcolor for selected date cell
            defaultBG:      'rgb(255, 255, 255)',                       // default bgcolor for unselected date cell
            dayOffset:      0,                                          // 0=week start with sunday, 1=week starts with monday
            forceWeek:      false,                                      // true=force selection at start of week, false=select days out from selected day
            dow:            [LANG('日'), LANG('一'), LANG('二'), LANG('三'), LANG('四'), LANG('五'), LANG('六')],        // days of week - change this to reflect your dayOffset
            ml:             [LANG('一月'), LANG('二月'), LANG('三月'), LANG('四月'), LANG('五月'), LANG('六月'), LANG('七月'), LANG('八月'), LANG('九月'), LANG('十月'), LANG('十一月'), LANG('十二月')],
            ms:             ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            _target:        target                                      // target DOM element - no need to set extend this variable
        }, opt);
        /*获取当前年月*/
        opt.day = (opt.status==="rebuild")?new Date(opt.day.getFullYear(), opt.day.getMonth(), 1):new Date(opt.endDate.getFullYear(), opt.endDate.getMonth(), 1);
        /*销毁之前的内容*/
        $(target).stop().empty();
        /*新建日历容器*/
        for (var sm=0; sm < opt.showMonths; sm++)
            $(target).append('<div class="jCalMo"></div>');
        opt.cID = 'c' + $('.jCalMo').length;
        /*构造日历*/
        $('.jCalMo', target).each(
            function (ind) {
                drawCalControl($(this), $.extend( {}, opt, { 'ind':ind, 
                        'day':new Date( new Date( opt.day.getTime() ).setMonth( new Date( opt.day.getTime() ).getMonth() - ($('.jCalMo').length-ind-1) ) ) }
                    ));
                drawCal($(this), $.extend( {}, opt, { 'ind':ind, 
                        'day':new Date( new Date( opt.day.getTime() ).setMonth( new Date( opt.day.getTime() ).getMonth() - ($('.jCalMo').length-ind-1) ) ) }
                    ));
            });
        $(opt._target).data('beginDate', opt.beginDate);
        $(opt._target).data('endDate', opt.endDate);
        if ( $(opt._target).data('beginDate') && $(opt._target).data('endDate') ) 
            reSelectDates(target, $(opt._target).data('beginDate'), $(opt._target).data('endDate'), opt);
    };
    /*渲染控制*/
    function drawCalControl (target, opt) {
        $(target).append(
            '<div class="jCal">' + 
                    '<div class="left" style="visibility:'+( (opt.ind == 0) ? 'visible' : 'hidden' ) + '" ></div>' + 
                    '<div class="month">' + 
                        '<span class="monthYear">' + opt.day.getFullYear() + '</span>' +
                        '<span class="monthName">' + opt.ml[opt.day.getMonth()] + '</span>' +
                    '</div>' +
                    '<div class="right" style="visibility:'+( (opt.ind == ( opt.showMonths - 1 )) ? 'visible' : 'hidden' ) + '" ></div>' + 
            '</div>');
        /*自定义日期事件绑定*/
        if ( opt.dateSelect )
            $(target).find('.jCal .monthName, .jCal .monthYear')
                .bind('mouseover', $.extend( {}, opt ),
                    function (e) { 
                        $(this).removeClass('monthYearHover').removeClass('monthNameHover');
                        if ( $('.jCalMask', e.data._target).length == 0 ) $(this).addClass( $(this).attr('class') + 'Hover' );
                    })
                .bind('mouseout', function () { $(this).removeClass('monthYearHover').removeClass('monthNameHover'); })
                .bind('click', $.extend( {}, opt ),
                    function (e) {
                        $('.jCalMo .monthSelector, .jCalMo .monthSelectorShadow').remove();
                        var monthName = $(this).hasClass('monthName'),
                            pad = Math.max( parseInt($(this).css('padding-left')), parseInt($(this).css('padding-left'))) || 2, 
                            calcTop = ( ($(this).position()).top - ( ( monthName ? e.data.day.getMonth() : 2 ) * ( $(this).height() + 0 ) ) );
                        calcTop = calcTop > 0 ? calcTop : 0;
                        var topDiff = ($(this).position()).top - calcTop;
                        $('<div class="monthSelectorShadow" style="' +
                            'top:' + 0 + 'px; ' +
                            'left:' + 0 + 'px; ' +
                            'width:' + ( $(e.data._target).width() + ( parseInt($(e.data._target).css('paddingLeft')) || 0 ) + ( parseInt($(e.data._target).css('paddingRight')) || 0 ) ) + 'px; ' +
                            'height:' + ( $(e.data._target).height() + ( parseInt($(e.data._target).css('paddingTop')) || 0 ) + ( parseInt($(e.data._target).css('paddingBottom')) || 0 ) ) + 'px;">' +
                        '</div>')
                            .css('opacity',0.01).appendTo( $(this).parent() );
                        $('<div class="monthSelector" style="' +
                            'top:' + calcTop + 'px; ' +
                            'left:' + ( ($(this).position()).left ) + 'px; ' +
                            'width:' + ( $(this).width() + ( pad * 2 ) ) + 'px;">' +
                        '</div>')
                            .css('opacity',0).appendTo( $(this).parent() );
                        for (var di = ( monthName ? 0 : -2 ), dd = ( monthName ? 12 : 3 ); di < dd; di++)
                            $(this).clone().removeClass('monthYearHover').removeClass('monthNameHover').addClass('monthSelect')
                                .attr( 'id', monthName ? (di + 1) + '_1_' + e.data.day.getFullYear() : (e.data.day.getMonth() + 1) + '_1_' + (e.data.day.getFullYear() + di) )
                                .html( monthName ? e.data.ml[di] : ( e.data.day.getFullYear() + di ) )
                                .css( 'top', ( $(this).height() * di ) ).appendTo( $(this).parent().find('.monthSelector') );
                        var moSel = $(this).parent().find('.monthSelector').get(0), diffOff = $(moSel).height() - ( $(moSel).height() - topDiff );
                        $(moSel)
                            .css('clip','rect(' + diffOff + 'px ' + ( $(this).width() + ( pad * 2 ) ) + 'px '+ diffOff + 'px 0px)')
                            .animate({'opacity':.92,'clip':'rect(0px ' + ( $(this).width() + ( pad * 2 ) ) + 'px ' + $(moSel).height() + 'px 0px)'}, 'fast', function () {
                                    $(this).parent().find('.monthSelectorShadow').bind('mouseover click', function () { $(this).parent().find('.monthSelector').remove(); $(this).remove(); });
                                })
                            .parent().find('.monthSelectorShadow').animate({'opacity':.1}, 'fast');
                        $('.jCalMo .monthSelect', e.data._target).bind('mouseover mouseout click', $.extend( {}, e.data ), 
                            function (e) {
                                if ( e.type == 'click' )
                                    $(e.data._target).jCal( $.extend(e.data, {status:"rebuild",day:new Date($(this).attr('id').replace(/_/g, '/'))}) );
                                else
                                    $(this).toggleClass('monthSelectHover');
                            });
                    });
        /*月全选事件绑定*/
        if(opt.monthSelect){
            $(target).find('.jCal .monthName, .jCal .monthYear').bind('click', $.extend( {}, opt ),function (e) {
                if($(target).find(".day:first").length){
                    $('div[id*=d_]', e.data._target).stop().removeClass('selectedDay').removeClass('overDay').css('backgroundColor', '');
                    /*获得本月1号*/
                    var sDate = new Date ($(target).find(".day:first").attr("id").replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, '$1/$2/$3'));
                    /*获得dom*/
                    currDay = $(e.data._target).find('#' + e.data.cID + 'd_' + ( sDate.getMonth() + 1 ) + '_' + sDate.getDate() + '_' + sDate.getFullYear());
                    if(!$(currDay).hasClass('invday')){
                        $(currDay).stop().removeClass('overDay').addClass('selectedDay');
                        /*缓存begin*/
                        e.data.beginDate = sDate;
                        $(e.data._target).data('beginDate', e.data.beginDate);
                        e.data.callback(sDate, "beginDate");
                    }
                    /*获取第一日*/
                    var sDate = new Date($(e.data._target).data('beginDate'));
                    /*获得最后一日*/
                    var osDate = new Date ($(target).find(".day:last").attr("id").replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, '$1/$2/$3'));
                    /*获得dom*/
                    while(osDate > sDate){
                        sDate.setDate( sDate.getDate() + 1 );
                        currDay = $(e.data._target).find('#' + e.data.cID + 'd_' + ( sDate.getMonth() + 1 ) + '_' + sDate.getDate() + '_' + sDate.getFullYear());
                        if($(currDay).hasClass('invday')){
                            break;
                        }
                        $(currDay).stop().removeClass('overDay').addClass('selectedDay');
                    }
                    /*缓存end*/
                    e.data.endDate = osDate;
                    $(e.data._target).data('endDate', e.data.endDate);
                    e.data.callback(osDate, "endDate");
                }
            });
        }
        /*左右控制事件绑定*/
        $(target).find('.jCal .left').bind('click', $.extend( {}, opt ),
            function (e) {
                if ($('.jCalMask', e.data._target).length > 0) return false;
                var mD = { w:0, h:0 };
                $('.jCalMo', e.data._target).each( function () { 
                        mD.w += $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right')); 
                        var cH = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom')) + 10; 
                        mD.h = ((cH > mD.h) ? cH : mD.h);
                    } );
                $(e.data._target).prepend('<div class="jCalMo"></div>');
                e.data.day = new Date( $('div[id*=' + e.data.cID + 'd_]:first', e.data._target).attr('id').replace(e.data.cID + 'd_', '').replace(/_/g, '/') );
                e.data.day.setDate(1);
                e.data.day.setMonth( e.data.day.getMonth() - 1 );
                e.data.ind = 0;
                drawCalControl($('.jCalMo:first', e.data._target), e.data);
                drawCal($('.jCalMo:first', e.data._target), e.data);
                if (e.data.showMonths > 1) {
                    $('.jCalMo:eq('+(e.data.showMonths-1)+') .right', e.data._target).css("visibility","visible");
                    $(e.target).css("visibility","hidden");
                }
                $(e.data._target).append('<div class="jCalSpace" style="width:'+mD.w+'px; height:'+mD.h+'px;"></div>');
                $('.jCalMo', e.data._target).wrapAll(
                    '<div class="jCalMask" style="clip:rect(0px '+mD.w+'px '+mD.h+'px 0px); width:'+ mD.w*((e.data.showMonths+1)/e.data.showMonths) +'px; height:'+mD.h+'px;">' + 
                        '<div class="jCalMove"></div>' +
                    '</div>');
                $('.jCalMove', e.data._target).css('margin-left', ( ( mD.w / e.data.showMonths ) * -1 ) + 'px').animate({ marginLeft:'0px' }, 'normal',
                    function () {
                        $(this).children('.jCalMo:not(:last)').appendTo( $(e.data._target) );
                        $('.jCalSpace, .jCalMask', e.data._target).empty().remove();
                        if ( $(e.data._target).data('beginDate') ) 
                            reSelectDates(e.data._target, $(e.data._target).data('beginDate'), $(e.data._target).data('endDate'), e.data);
                    });
            });
        $(target).find('.jCal .right').bind('click', $.extend( {}, opt ),
            function (e) {
                if ($('.jCalMask', e.data._target).length > 0) return false;
                var mD = { w:0, h:0 };
                $('.jCalMo', e.data._target).each( function () { 
                        mD.w += $(this).width() + parseInt($(this).css('padding-left')) + parseInt($(this).css('padding-right')); 
                        var cH = $(this).height() + parseInt($(this).css('padding-top')) + parseInt($(this).css('padding-bottom')) + 10; 
                        mD.h = ((cH > mD.h) ? cH : mD.h);
                    } );
                $(e.data._target).append('<div class="jCalMo"></div>');
                e.data.day = new Date( $('div[id^=' + e.data.cID + 'd_]:last', e.data._target).attr('id').replace(e.data.cID + 'd_', '').replace(/_/g, '/') );
                e.data.day.setDate(1);
                e.data.day.setMonth( e.data.day.getMonth() + 1 );
                e.data.ind = e.data.showMonths-1;
                drawCalControl($('.jCalMo:last', e.data._target), e.data);
                drawCal($('.jCalMo:last', e.data._target), e.data);
                if (e.data.showMonths > 1) {
                    $('.jCalMo:eq(1) .left', e.data._target).css("visibility","visible");
                    $(e.target).css("visibility","hidden");
                }
                $(e.data._target).append('<div class="jCalSpace" style="width:'+mD.w+'px; height:'+mD.h+'px;"></div>');
                $('.jCalMo', e.data._target).wrapAll(
                    '<div class="jCalMask" style="clip:rect(0px '+mD.w+'px '+mD.h+'px 0px); width:'+  mD.w*((e.data.showMonths+1)/e.data.showMonths) +'px; height:'+mD.h+'px;">' + 
                        '<div class="jCalMove"></div>' +
                    '</div>');
                $('.jCalMove', e.data._target).animate({ marginLeft:( ( mD.w / e.data.showMonths ) * -1 ) + 'px' }, 'normal',
                    function () {
                        $(this).children('.jCalMo:not(:first)').appendTo( $(e.data._target) );
                        $('.jCalSpace, .jCalMask', e.data._target).empty().remove();
                        if ( $(e.data._target).data('beginDate') ) 
                            reSelectDates(e.data._target, $(e.data._target).data('beginDate'), $(e.data._target).data('endDate'), e.data);
                        $(this).children('.jCalMo:not(:first)').removeClass('');
                    });
            });
        $('.jCal', target).each(
            function () {
                var width = $(this).parent().width() - ( $('.left', this).width() || 0 ) - ( $('.right', this).width() || 0 );
                $('.month', this).css('width', width).find('.monthName, .monthYear').css('width', ((width / 2) - 4 ));
            });
        $(window).load(
            function () {
                $('.jCal', target).each(
                    function () {
                        var width = $(this).parent().width() - ( $('.left', this).width() || 0 ) - ( $('.right', this).width() || 0 );
                        $('.month', this).css('width', width).find('.monthName, .monthYear').css('width', ((width / 2) - 4 ));
                    });
            });
    };
    /*切换月份后重新选择已选日期*/   
    function reSelectDates (target, beginDate, endDate, opt) {
        var fC = false;
        var sDate = new Date(beginDate.getTime());
        var dF = $(target).find('div[id*=d_' + (sDate.getMonth() + 1) + '_' + sDate.getDate() + '_' + sDate.getFullYear() + ']');
        if ( dF.length > 0 ) {
            dF.stop().addClass('selectedDay');
        }
        if(endDate){
            var osDate = new Date(endDate.getTime());
            while(osDate > sDate){
                sDate.setDate( sDate.getDate() + 1 );
                var dF = $(target).find('div[id*=d_' + (sDate.getMonth() + 1) + '_' + sDate.getDate() + '_' + sDate.getFullYear() + ']');
                if ( dF.length > 0 ) {
                    dF.stop().addClass('selectedDay');
                }
            }
            if ( fC && typeof opt.callback == 'function' ) opt.callback( beginDate, endDate );
        }
    };
    /*渲染日历*/
    function drawCal (target, opt) {
        /*渲染日期（日、一、二。。。）*/
        for (var ds=0, length=opt.dow.length; ds < length; ds++)
            $(target).append('<div class="dow">' + opt.dow[ds] + '</div>');
        /*获得当月1号*/
        var fd = new Date( new Date( opt.day.getTime() ).setDate(1) );
        /*获得上月最后一日*/
        var ldlm = new Date( new Date( fd.getTime() ).setDate(0) );
        /*获得当月最后一日*/
        var ld = new Date( new Date( new Date( fd.getTime() ).setMonth( fd.getMonth() + 1 ) ).setDate(0) );
        var copt = {fd:fd.getDay(), lld:ldlm.getDate(), ld:ld.getDate()};
        var offsetDayStart = ( ( copt.fd < opt.dayOffset ) ? ( opt.dayOffset - 7 ) : 1 );
        var offsetDayEnd = ( ( ld.getDay() < opt.dayOffset ) ? ( 7 - ld.getDay() ) : ld.getDay() );
        /*console.log("offsetDayStart:"+offsetDayStart);
        console.log("offsetDayEnd:"+offsetDayEnd);
        console.log("copt.fd - opt.dayOffset:"+(copt.fd - opt.dayOffset));
        console.log(" offsetDayStart - ( copt.fd - opt.dayOffset ):"+(offsetDayStart - ( copt.fd - opt.dayOffset )));*/
        for ( var d = offsetDayStart, dE = ( copt.fd + copt.ld + ( 7 - offsetDayEnd ) ); d < dE; d++)
            //console.log("d:"+d);
            $(target).append(
                (( d <= ( copt.fd - opt.dayOffset ) ) ? 
                    '<div id="' + opt.cID + 'd' + d + '" class="pday"></div>' 
                    : ( ( d > ( ( copt.fd - opt.dayOffset ) + copt.ld ) ) ?
                        '<div id="' + opt.cID + 'd' + d + '" class="aday"></div>' 
                        : '<div id="' + opt.cID + 'd_' + (fd.getMonth() + 1) + '_' + ( d - ( copt.fd - opt.dayOffset ) ) + '_' + fd.getFullYear() + '" class="' +
                            ( ( opt.dCheck( new Date( (new Date( fd.getTime() )).setDate( d - ( copt.fd - opt.dayOffset ) ) ) ) ) ? 'day' : 'invday' ) +
                            '">' + ( d - ( copt.fd - opt.dayOffset ) )  + '</div>'
                    ) 
                )
            );
        $(target).find('div[id^=' + opt.cID + 'd]:first, div[id^=' + opt.cID + 'd]:nth-child(7n+2)').before( '<br style="clear:both; font-size:0.1em;" />' );
        /*日期选择事件*/
        $(target).find('div[id^=' + opt.cID + 'd_]:not(.invday)').bind("mouseover mouseout click", $.extend( {}, opt ),
            function(e){
                    var currDay;
                    if ($('.jCalMask', e.data._target).length > 0) return false;
                    /*当前选择日期*/
                    var osDate = new Date ( $(this).attr('id').replace(/c[0-9]{1,}d_([0-9]{1,2})_([0-9]{1,2})_([0-9]{4})/, '$1/$2/$3') );
                    if (e.data.forceWeek) osDate.setDate( osDate.getDate() + (e.data.dayOffset - osDate.getDay()) );
                    /*如果是开始日期*/
                    if(!$(e.data._target).data('beginDate') || $(e.data._target).data('endDate')){
                        /*如果是点击，清除之前的状态*/
                        if (e.type == 'click')
                            $('div[id*=d_]', e.data._target).stop().removeClass('selectedDay').removeClass('overDay').css('backgroundColor', '');
                        /*当前选择的dom，添加状态*/
                        currDay = $(e.data._target).find('#' + e.data.cID + 'd_' + ( osDate.getMonth() + 1 ) + '_' + osDate.getDate() + '_' + osDate.getFullYear());
                        if(!$(currDay).hasClass('invday')){
                            if ( e.type == 'mouseover' )        $(currDay).addClass('overDay');
                            else if ( e.type == 'mouseout' )    $(currDay).stop().removeClass('overDay').css('backgroundColor', '');
                            else if ( e.type == 'click' )       $(currDay).stop().addClass('selectedDay');
                            /*缓存日期*/
                            if (e.type == 'click') {
                                e.data.beginDate = osDate;
                                $(e.data._target).data('beginDate', e.data.beginDate);
                                e.data.endDate = "";
                                $(e.data._target).data('endDate', "");
                                e.data.callback(osDate, "beginDate");
                            }
                        }
                    }else{
                        /*获取开始日期*/
                        var sDate = new Date($(e.data._target).data('beginDate'));
                        if(osDate >= sDate){
                            while(osDate > sDate){
                                sDate.setDate( sDate.getDate() + 1 );
                                currDay = $(e.data._target).find('#' + e.data.cID + 'd_' + ( sDate.getMonth() + 1 ) + '_' + sDate.getDate() + '_' + sDate.getFullYear());
                                if ( $(currDay).hasClass('invday') ) break;
                                if ( e.type == 'mouseover' )        $(currDay).addClass('overDay');
                                else if ( e.type == 'mouseout' )    $(currDay).stop().removeClass('overDay').css('backgroundColor', '');
                                else if ( e.type == 'click' )       $(currDay).stop().removeClass('overDay').addClass('selectedDay');
                            }
                            /*缓存日期*/
                            if (e.type == 'click') {
                                e.data.endDate = osDate;
                                $(e.data._target).data('endDate', e.data.endDate);
                                e.data.callback(osDate, "endDate");
                            }
                        }
                    }
            });
    };
});