$(function(){
	$('#ajax-note').ajaxStart(function(){
		$(this).html(LANG('开始载入...')).fadeIn('fast');
	});
	
	$('#ajax-note').ajaxError(function(){
		$(this).html(LANG('载入错误！'));
	});
	
	$('#ajax-note').ajaxSend(function(){
		$(this).addClass('ajax-loading').html(LANG('正在发送请求...'));
	});
	
	$('#ajax-note').ajaxComplete(function(){
		$(this).removeClass('ajax-loading');
	});
	
});

function deleteOneRecord()
{
	var a = confirm(LANG('您确定要删除此记录吗？'));
	if (!a) return false;
	var tthis = $(this);
	var ptr = tthis.parents('tr');
	// 删除评论的时候将评论内容一块remove
	var contentTr = $(this).parents('tr').next('tr.comment-content').remove();
	var subject = ptr.children('td.txt-name');
	var args = $('#' + CSRF_TOKEN).serialize();
	$.ajax({
		url: tthis.attr('href'),
		type: 'post',
		dataType: 'json',
		data: args,
		cache: false,
		success: function(data) {
			if (data.result == 2) 
				ptr.fadeOut(100, function(){
					$(this).remove();
					contentTr.remove();
				});
			$('#ajax-note').html(data.message);
		}
	});
	return false;
}


function deletePosts()
{
	var a = confirm(LANG('您确定要删除这些文章吗？'));
	if (!a) return false;
	var chk = $('#' + CSRF_TOKEN + ', :checkbox:checked');
	var chkdata = chk.serialize();
	
	$.ajax({
		url: $(this).attr('url'),
		type: 'post',
		dataType: 'json',
		cache: false,
		data: chkdata,
		success: function(data) {
			if (data.result == 1) {
				chk.parents('tr').fadeOut(2000);
			}
			$('#ajax-note').html(data.message);
		}
	});
	return false;
}


function trMouseOver()
{
	$(this).addClass('bg-dark');
}

function trMouseOut()
{
	$(this).removeClass('bg-dark');
}

function selectAll()
{
	$(':checkbox').attr('checked', 'checked');
}

function selectInverse()
{
	var chk = $(':checkbox');
	chk.each(function(){
		var tthis = $(this);
		var ischecked = tthis.attr('checked');
		if (ischecked)
			tthis.removeAttr('checked');
		else
			tthis.attr('checked', 'checked');
	});
}


function changeState()
{
	var tthis = $(this);
	var args = $('#' + CSRF_TOKEN).serialize();
	$.ajax({
		url: tthis.attr('href'),
		type: 'post',
		cache: false,
		dataType: 'json',
		data: args,
		success: function(data) {
			if (data.result == 1 || data.result == 0) {
				var img = RESBU + 'admin/images/state' + data.result + '.gif';
				tthis.children('img').attr('src', img);
			}
			$('#ajax-note').html(data.message)
		}
	});
	return false;
}

var summaryEditor, contentEditor;
function switchSummaryEditor()
{
	if (summaryEditor) {
		summaryEditor.destroy();
		summaryEditor = null;
		return false;
	};
	
	summaryEditor = CKEDITOR.replace('summary', {
		height: 150,
		width: 580,
		toolbar: 'betaBasic'
		
	});
	return false;
}

function switchContentEditor()
{
	if (contentEditor) {
		contentEditor.destroy();
		contentEditor = null;
		$('#uploads').hide();
		return false;
	}
	
	contentEditor = CKEDITOR.replace('content', {
		height: 350,
		width: 580,
		toolbar: 'betaAdvance'
	});
	$('#uploads').show();
	return false;
}
