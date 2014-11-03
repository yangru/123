
<h2 id="functionTitle">获取代码</h2>
<div id="showArea" class="theShowArea siteMane">
  <div class="node_form">
    <div class="node_steptwo node_step">
        <span id="stepone" class="step stepone act">添加网站</span> <span  class="step steptwo" id="steptwo">获取代码</span>
	</div>
	<p>请将下面的JavaScript代码插入你的网站代码的head标签里。</p>
    <p>
		  <textarea  class="xxlarge G-noReSize" id='copyCodeText' rows="5" readonly><script type="text/javascript">
(function() {
	var c = document.createElement('script'); c.type = 'text/javascript'; c.async = true;
	c.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + '<?php echo param('cookieDomain')?>/boot/<?php echo $site_id; ?>';
	var h = document.getElementsByTagName('script')[0]; h.parentNode.insertBefore(c, h);
})();
</script></textarea>
        <br />
		<div class="theClipboardCodeBar">
		    <div id="copied_tips" style='color:red;text-align:center;display:none;'></div>
		    <span class="fBntMar"><span id='clicki_js_clipboard'></span></span>
		</div>
    </p>
  </div>
</div>


 
