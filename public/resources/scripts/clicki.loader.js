(function(){
    Clicki.sideNav();
    Clicki.Balance();
//    Clicki.popList({id:"#siteList",url:"/site/ajaxgetsites?ajax=1"});
//    Clicki.popList({id:"#siteList",url:"/resources/temp/poplist_data.json"});
    var balanceSetting = ["#imNav","#imOutterArea"],bNow = false,nowH = 0,timer,selector;
    $(window).bind("resize",function(){
        if(!bNow){
            bNow = true;
            nowH = $(document).height();
            timer = setInterval(function(){
               nowH = nowH === $(document).height()?false:$(document).height();
                if(!nowH){
                    clearInterval(timer);
                    if(!selector){
                        selector ="" + balanceSetting;
                        selector = $(selector);
                    }
                    nowH = 0;
                    Clicki.Queue(function(){},100);
                    bNow = false;
                }
            },50);
        }
     });
    
})();