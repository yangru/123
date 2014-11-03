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
        <div id="IDList" class="theTableBox">

        </div>
    </div>


</div>
<script>
(function(){

    var _o = {
        //require
        parent:$("#IDList"),
        url:"/resources/temp/visit_ID.json",
        //unrequire
        captions: [
            {text:"ID"},
            {text:"访问深度"},
            {text:"访问次数"},
            {text:"停留时间"},
            {text:"访问明细"}
        ],
        title:"访问深度"
    };
    var grid = Clicki.grider(_o);

    



})();
</script>