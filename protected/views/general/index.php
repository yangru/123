<h2 id="functionTitle">访问概况</h2>
<div id="showArea" class="theShowArea siteMane">
    
    <div  class="G-tableSet processTable" >
        <div id="pageView" class="theTableBox">

        </div>
    </div>

    <div class="G-outterBox">
        <div class="theChart"><div id="trendchart" ></div></div>
    </div>
    
    <div  class="G-tableSet processTable" >
        <div id="keywordTop" class="theTableBox"></div>
    </div>

    <div  class="G-tableSet processTable" style="float:left; width:49%;" >
        <div id="sourceTop" class="theTableBox"></div>
    </div>
    <div  class="G-tableSet processTable" style="float:right; width:49%;" >
        <div id="interviewTop" class="theTableBox"></div>
    </div>
    <div  class="G-tableSet processTable"  style="float:left; width:49%;" >
        <div id="visitTypeTop" class="theTableBox"></div>
    </div>
    <div  class="G-tableSet processTable" style="float:right; width:49%;" >
        <div id="visitQualityTop" class="theTableBox"></div>
    </div>
</div>
<script>
$(function(){
    Clicki.popList({id:"#siteList",url:"/resources/temp/poplist_data.json"});
    Clicki.createChart(
       {
           id:"trendchart",
           url:"/resources/temp/chart_data.json",
           settings:{
               "title":{"text":"最近24+3小时流量趋势"},
               "y":{"steps": 13},
               "x":{"labels":{"steps": 2,"labels":"24+3"}},
               "elements":[{"type": "area","text":"PV"},{"type": "line","text":"UV"},{"type": "line","text":"IP"},{"type": "tags"}]
           }
       }
    );

    var _o = {
        //require
        parent:$("#pageView"),
        url:"/resources/temp/visit_general_situation.json",
        //unrequire
        captions: [
            {text:"时间"},
            {text:"PV"},
            {text:"IP"},
            {text:"UV"},
            {text:"回头率"},
            {text:"平均浏览速度"},
            {text:"评价停留时间"},
            {text:"跳出率"},
            {text:"质量分"}
        ],
        title:"访问量概况"
    };
    var grid = Clicki.grider(_o);

    var _key = {
        //require
        parent:$("#keywordTop"),
        url:"/resources/temp/keywordTop.json",
        //unrequire
        captions: [
            {text:"关键词"},
            {text:"搜索次数"},
            {text:"IP"},
            {text:"独立访客"},
            {text:"回头率"},
            {text:"访问质量"}
        ],
        title:"关键词Top10"
    };
    var gridkey = Clicki.grider(_key);

    var _sourceTop = {
        //require
        parent:$("#sourceTop"),
        url:"/resources/temp/sourceTop.json",
        //unrequire
        captions: [
            {text:"域名"},
            {text:"PV|IP"}
        ],
        title:"来源页面Top10"
    };
    var gridsourceTop = Clicki.grider(_sourceTop);

    var _interviewTop = {
        //require
        parent:$("#interviewTop"),
        url:"/resources/temp/sourceTop.json",
        //unrequire
        captions: [
            {text:"域名"},
            {text:"PV|IP"}
        ],
        title:"受访页面Top10"
    };
    var gridinterviewTop = Clicki.grider(_interviewTop);


    var _visitTypeTop = {
        //require
        parent:$("#visitTypeTop"),
        url:"/resources/temp/visitTypeTop.json",
        //unrequire
        captions: [
            {text:""},
            {text:"今天"},
            {text:"昨天"}
        ],
        title:"访问类型Top10"
    };
    var gridvisitTypeTop = Clicki.grider(_visitTypeTop);

    var _visitQualityTypeTop = {
        //require
        parent:$("#visitQualityTop"),
        url:"/resources/temp/visitTypeTop.json",
        //unrequire
        captions: [
            {text:""},
            {text:"今天"},
            {text:"昨天"}
        ],
        title:"访问质量Top10"
    };
    var gridvisitQualityTypeTop = Clicki.grider(_visitQualityTypeTop);

})();
</script>