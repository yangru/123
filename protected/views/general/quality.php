<h2 id="functionTitle">今日统计</h2>
<div id="showArea" class="theShowArea siteMane">

    <div>
        <input type="button" value="今天" />
        <input type="button" value="昨天" />
        <input type="button" value="最近7天" />
        <input type="button" value="最近30天" />
        <input type="button" value="本月" />
        <input type="button" value="前一天" />
        <input type="button" value="后一天" />
        <span>
            从
            <input type="text" />
            至
            <input type="text" />
            <input type="button" value="查询" />
        </span>
    </div>

    <div>
        <input type="button" class="G-gotoBnt" value="导出列表" />
    </div>
    

    <div  class="G-tableSet processTable" >
        <div id="visitDeep" class="theTableBox">

        </div>
    </div>
    
    <div  class="G-tableSet processTable" >
        <div id="visitBack" class="theTableBox">
           访问次数。。。。。。
        </div>
    </div>

    <div  class="G-tableSet processTable" >
        <div id="visitStay" class="theTableBox">
            停留时间。。。。。。
        </div>
    </div>

    <div  class="G-tableSet processTable" >
        <div id="visitSpeed" class="theTableBox">
            访问速度。。。。。。
        </div>
    </div>


</div>
<script>
(function(){

    var _o = {
        //require
        parent:$("#visitDeep"),
        url:"/resources/temp/visit_quality.json",
        //unrequire
        captions: [
            {text:"访问深度"},
            {text:"PV"},
            {text:"IP"},
            {text:"UV"},
            {text:"回头率"},
            {text:"人均停留时间（秒）"},
            {text:"质量分"},
            {text:"操作"}
        ],
        title:"访问深度"
    };
    var grid = Clicki.grider(_o);

    
    var _oo = {
        //require
        parent:$("#distribution"),
        url:"/resources/temp/hour_statistics.json",
        //unrequire
        captions: [
            {text:"小时段"},
            {text:"PV"},
            {text:"IP"},
            {text:"UV"},
            {text:"回头率"},
            {text:"平均浏览速度"},
            {text:"评价停留时间"},
            {text:"跳出率"},
            {text:"质量分"}
        ],
        title:"小时段分布"
    };
    var grido = Clicki.grider(_oo);



})();
</script>