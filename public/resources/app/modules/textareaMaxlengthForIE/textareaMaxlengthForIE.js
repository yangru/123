define(function() { return function($) {

    $.fn.textarealimit = function(settings) {
    
        settings = jQuery.extend({
            length:1000
        }, settings);

        maxLength =settings.length;
        if($.browser.msie){
            $(this).attr("maxlength",maxLength).bind("keydown",doKeydown).bind("keypress",doKeypress).bind("beforepaste",doBeforePaste).bind("paste",doPaste);
        }
    
        function doKeypress(){
            var oTR = document.selection.createRange();
            if(oTR.text.length >= 1){
                event.returnValue = true;
            }else if(this.value.length > maxLength-1){
                event.returnValue = false;
            }
        }
    
        function doKeydown(){
            var _obj=this;
            setTimeout(function(){
                if(_obj.value.length > maxLength-1){
                    var oTR = window.document.selection.createRange()
                    oTR.moveStart("character", -1*(_obj.value.length-maxLength))
                    oTR.text = ""
                }
            },1);
        }
    
        function doBeforePaste(){
            event.returnValue = false
        }
    
        function doPaste(){
            var oTR = document.selection.createRange();
            var iInsertLength = maxLength - this.value.length + oTR.text.length;
            var sData = window.clipboardData.getData("Text").substr(0, iInsertLength);
            oTR.text = sData;
            event.returnValue = false;
         }
      }

}});
