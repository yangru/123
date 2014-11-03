define(function(){

    var credits = {
        "enabled":false,
        "position":{
            "align": 'left',
            "x": 10
        }
    },
    colors = ["#00a4bc","#ff005f","#0ec900"];
    return {
        "line":{
            "chart": {
                "defaultSeriesType": 'line',
                "backgroundColor":null,
                "borderColor":null,
                "height": 300
            },
            "credits":credits,
            "title": {
                "text":""
            },
            "subtitle": {},
            "colors":colors,
            "xAxis": {
                "labels": {
                    "rotation": -45,
                    "align": 'right',
                    "step":1
                }
            },
            "yAxis":[
                {
                    "title": {
                        "text": ""
                    },
                    "min":0,
                    "gridLineColor":"#f8f8f8",
                    "plotLines": [{
                        "value": 0,
                        "width": 1,
                        "color": '#808080'
                    }]
                },
                {
                    "opposite": true,
                    "title": {
                        "text": ""
                    },
                    "min":0,
                    "max":1,
                    "gridLineColor":"#f8f8f8",
                    "plotLines": [{
                        "value": 0,
                        "width": 1,
                        "color": '#808080'
                    }]
                }
            ],
            "tooltip": {
                "shared": true
            },
            "legend": {
                "borderWidth":0
            }
        },
        "column":{
            "chart": {
                defaultSeriesType: 'column',
                backgroundColor:null,
                borderColor:null,
                "height": 300
            },
            "credits":credits,
            "tooltip": {
                formatter: function() {
                    ///////////////////////////////翻译-----柱状图的tooltip////////////////////////////////////
                    return '<b>'+ LANG(this.series.name) +'</b><br/>'+LANG(this.x) +': '+ this.y;
                }
            },
            "colors":colors,
            title: {
                text:null,
            },
            "subtitle":{},
            "plotOptions": {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                },
                series: {
                    shadow: false
                }
            },
            legend: {
                borderWidth:0
            },
            yAxis:[{
                title: {
                    text: ""
                },
                gridLineColor:"#f8f8f8",
                min:0
            },{
                opposite: true,
                title: {
                    text: ""
                },
                min:0,
                max:1,
                gridLineColor:"#f8f8f8",
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            }],
            xAxis:{
                labels: {
                    rotation: -45,
                    align: 'right',
                    step:1,
                    ///////////////////////翻译----格式化x轴的category函数////////////////////////
                    formatter: function() {
	                	return  LANG(this.value);
	                }
                }
            }
        },
        "pie":{
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                backgroundColor:null,
                borderColor:null,
                defaultSeriesType: 'pie',
                "height": 300
            },
            legend:{
                enabled:false
            },
            title:{
                text:"",
            },
            "credits":credits,
            tooltip: {
                ///////////////////////////////翻译-----饼图的tooltip////////////////////////////////////
                formatter: function() {
                    return '<b>'+ LANG(this.point.name) +'</b>: '+ this.y +' %';
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        //enabled: false
                        ///////////////////////翻译----格式化pie的dataLabels函数////////////////////////
                        formatter: function() {
                            return LANG(this.point.name);
                        }
                    }
                }
            }
        },
        "area":{
            "chart": {
                "defaultSeriesType": 'area',
                "backgroundColor":null,
                "borderColor":null,
                "height": 300
            },
            "credits":credits,
            "title": {
                "text":""
            },
            "subtitle": {},
            "colors":colors,
            "xAxis": {
                "labels": {
                    "rotation": -45,
                    "align": 'right',
                    "step":1
                }
            },
            "yAxis":[
                {
                    "title": {
                        "text": ""
                    },
                    "min":0,
                    "gridLineColor":"#f8f8f8",
                    "plotLines": [{
                        "value": 0,
                        "width": 1,
                        "color": '#808080'
                    }]
                },
                {
                    "opposite": true,
                    "title": {
                        "text": ""
                    },
                    "min":0,
                    "max":1,
                    "gridLineColor":"#f8f8f8",
                    "plotLines": [{
                        "value": 0,
                        "width": 1,
                        "color": '#808080'
                    }]
                }
            ],
            "plotOptions": {
                area: {
                    /*
                    lineColor: '#666666',
                    lineWidth: 1,
                    marker: {
                        lineWidth: 1,
                        lineColor: '#666666'
                    },
                    */
                    lineWidth: 1,
                    fillOpacity: 0.1,
                    shadow:false
                },
                series:{
                    lineWidth: 1,
                    /*data:(function(){
                    	alert(this)
                    })()*/
                    marker: {
                        lineWidth: 1,
                        symbol: "circle"
                    }
                }
            },
            "tooltip": {
                "shared": true
            },
            "legend": {
                "borderWidth":0
            }
        },
        "spline":{
            chart: {
                defaultSeriesType: 'spline',
                backgroundColor:null,
                borderColor:null,
                "height": 300
            },
            "credits":credits,
            "title": {
                "text":""
            },
            "subtitle": {},
            "colors":colors,
            xAxis: {
                labels: {
                    rotation: -45,
                    align: 'right',
                    step:1
                }
            },
            yAxis:[
                {
                    title: {
                        text: ""
                    },
                    min:0,
                    gridLineColor:"#f8f8f8",
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                {
                    opposite: true,
                    title: {
                        text: ""
                    },
                    min:0,
                    max:1,
                    gridLineColor:"#f8f8f8",
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                }
            ],
            tooltip: {
                formatter: function() {
                    return '<b>'+ LANG(this.series.name) +'</b><br/>'+this.x +': '+ this.y;
                }
            },
            legend: {
                borderWidth:0
            }
        }   
    }
});