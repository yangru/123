function ratingMouseOver()
{
	var ma = $(this).parents('ul').find('li a');
	var i = ma.index(this);
	ma.removeClass('mover');
	if (i > 5 && i <=10) {
		for (var m=6; m<=i; m++) ma.eq(m).addClass('mover');
	} else if (i <= 5 && i >= 0) {
		for (var m=5; m>=i; m--) ma.eq(m).addClass('mover');
	}
}

function ratingClick()
{
	var tthis = $(this);
	var mark = tthis.attr('score');
	var pid = $('#postid').val();
	var ul = tthis.parents('ul');
	var field = ul.attr('field');
	var url = ul.attr('url');
	var elSpan = $('#' + field + '-note');
	var args = $('#' + CSRF_TOKEN).serialize();
	$.ajax({
		type: 'post',
		cache: false,
		dataType: 'json',
		data: args + '&aid=' + pid + '&mark=' + mark + '&field=' + field,
		url: url,
		success: function(d){
			elSpan.html(d.note).removeClass('mark-note-loading');
			var ma = tthis.parents('ul').find('li a');
			ma.unbind();
		},
		beforeSend: function(){
			var marking = '正在打分...';
			elSpan.html(marking).addClass('mark-note-loading');
		},
		error: function(){}
	});
}

function loadComments(pid)
{
	if (pid < 0) return false;
	var elCommentList = $('#comment-list');
	var elHotCommentList = $('#hot-comment-list');
	$.ajax({
		type: 'get',
		dataType: 'json',
		data: 'postid=' + pid + '&comment_nums=' + elCommentList.attr('comment_nums'),
		url: elCommentList.attr('url'),
		beforeSend: function(){
			$('#comment-list, #hot-comment-list').html('<span class="color-red">正在载入评论...</span>');
		},
		success: function(d){
			$('#comment-list').html(d.comments);
			elHotCommentList.html(d.hotComments);
			getMaxCommentIndex();
		},
		error: function(){
			$('#comment-list, #hot-comment-list').html('<span class="color-red">载入评论请求失败...</span>');
		}
	});
}

function commentReply()
{
	var tthis = $(this);
	var state = tthis.attr('state');
	var commentAction = tthis.parents('.comment-action');
	if (state == undefined) {
		form = $('.comment-form:first').clone();
		var commentList = tthis.parents('.comment-list');
		form.addClass('border').attr('action', tthis.attr('href'));
		commentList.find('.comment-form').remove();
		commentList.find('.reply').removeAttr('state');
		commentAction.after(form);
		tthis.attr('state', 'show');
		form.find('.comment-content').attr('tabindex', 10).focus();
		form.find('.post-comment').attr('tabindex', 11);
	} else {
		commentAction.next('.comment-form').hide();
		tthis.removeAttr('state');
	}
	commentAction.nextAll('.prompt').remove();
	
	return false;
}

function commentAction()
{
	var tthis = $(this);
	var elAction = tthis.parents('.comment-action');
	
	if (tthis.attr('operated') != undefined) {
		elAction.next('.prompt').remove();
		elAction.after('<div class="failed-note prompt" title="点击关闭">您已经投过票！</div>');
		elAction.next('.prompt').attr('closable', 'closable');
		return false;
	}
	
	var url = tthis.attr('href');
	if (!url) return false;
	
	var args = $('#' + CSRF_TOKEN).serialize();
	$.ajax({
		type: 'post',
		dataType: 'json',
		data: args,
		url: url,
		beforeSend: function() {
			elAction.next('.prompt').remove();
			var html = '<div class="failed-note prompt"><img src="' + TBU + '/images/loading.gif" />正在建立连接...</div>';
			elAction.after(html);
		},
		success: function(d) {
			elAction.next('.prompt').remove();
			elAction.after(d.note);
			elAction.next('.prompt').attr('closable', 'closable');
			if (d.errno == 0) {
				var span = tthis.next('span');
				var nums = parseInt(span.text()) + 1;
				tthis.next('span').text(nums);
			}
			if (d.errno != -1) tthis.attr('operated', 'operated');
		},
		error: function(){
			elAction.next('.prompt').remove();
			var html = '<div class="failed-note prompt">评论请求失败</div>';
			elAction.after(html);
			elAction.next('.prompt').attr('closable', 'closable');
		}
	});
	return false;
}

function removePrompt()
{
	if ($(this).attr('closable') != undefined)
		$(this).remove();
}

function postComment()
{
	var tthis = $(this);
	var form = tthis.parents('.comment-form');
	var formContent = form.find('.comment-content');
	var content = formContent.val();
	
	if ($.trim(content) == '') {
		form.next('.prompt').remove();
		form.after('<div class="failed-note prompt">评论内容不能为空</div>');
		form.next('.prompt').attr('closable', 'closable');
		formContent.focus();
		return false;
	}
	
	var btnPost = $('.post-comment');
	
	var form = $(this).parents('.comment-form');
	var args = form.serialize();
	$.ajax({
		type: 'post',
		dataType: 'json',
		data: args,
		url: form.attr('action'),
		beforeSend: function(){
			form.next('.prompt').remove();
			var html = '<div class="failed-note prompt"><img src="' + TBU + '/images/loading.gif" />正在建立连接...</div>';
			form.after(html);
			btnPost.attr('disabled', 'disabled').die('click');
		},
		success: function(d){
			form.next('.prompt').remove();
			form.after(d.note);
			form.next('.prompt').attr('closable', 'closable');
			$('#no-comment').remove();
			var currentCommentIndex = getMaxCommentIndex();
			$('#comment-list .comment-list').append(d.html);
			$('.comment-index:last').text(currentCommentIndex);
			var allnums = $('#comment-list .all-nums');
			var shownums = $('#comment-list .show-nums');
			allnums.text(parseInt(allnums.text()) + 1);
			shownums.text(parseInt(shownums.text()) + 1);
			if (d.errno == 0) formContent.val('');
			formContent.focus();
			form.prevAll('.comment-action').children('.reply').removeAttr('state');
			$('.comment-list form.comment-form').remove();
			
			expire = 10;
			showDisabledTime();
		},
		error: function(){
			form.next('.prompt').remove();
			var html = '<div class="failed-note prompt">评论请求失败</div>';
			form.after(html);
			form.next('.prompt').attr('closable', 'closable');
			btnPost.removeAttr('disabled').live('click', postComment);
		}
	});
	
}

function getMaxCommentIndex()
{
	var maxCommentIndex = $('span').data('maxCommentIndex');
	if (maxCommentIndex == undefined) {
		var commentIndex = parseInt($('.comment-index:last').text());
		if (isNaN(commentIndex)) commentIndex = 0;
	} else {
		var commentIndex = parseInt(maxCommentIndex);
	}
	$('span').data('maxCommentIndex', commentIndex + 1);
	return commentIndex;
}

function showDisabledTime()
{
	$('.post-comment').val('发表(' + expire + ')');
	if (expire > 0) {
		setTimeout(showDisabledTime, 1000);
	} else {
		$('.post-comment').val('发表');
		$('.post-comment').removeAttr('disabled').live('click', postComment);
	}
	expire -= 1;
}

function postArticle()
{
	var error = new Array();
	var objSubject = $('#subject');
	if ($.trim(objSubject.val()) == '') {
		error.push('文章标题不能为空');
	}
	var source = $.trim($('#source').val());
	if (source != '' && source.length > 250) {
		error.push('文章来源不能超过250个字符');
	}
	var contributor = $.trim($('#contributor').val());
	if (contributor != '' && contributor.length > 250) {
		error.push('投稿人名字不能超过250个字节');
	}
	var homepage = $.trim($('#homepage').val());
	if (homepage != '' && homepage.length > 250) {
		error.push('投稿人主页不能超过250个字节');
	}
	var email = $.trim($('#email').val());
	if (email != '' && email.length > 250) {
		error.push('投稿人邮箱不能超过250个字节');
	}
	if (email != '' && !/^[a-zA-Z0-9][a-zA-Z0-9_\-]+@[a-zA-Z0-9\-]+(\.[a-zA-Z0-9]{2,4})+$/.test(email)) {
		error.push('投稿人邮箱格式不正确');
	}
	var objCategory = $('#category');
	if ($.trim(objCategory.val()) == '') {
		error.push('请选择文章分类');
	}
	var objTopic = $('#topic');
	if ($.trim(objTopic.val()) == '') {
		error.push('请选择文章主题');
	}
	if (CKEDITOR.instances.summary)
		var summary = $.trim(CKEDITOR.instances.summary.getData());
	else 
		var summary = $.trim($('#summary').val());
	if (summary.length < 50) {
		error.push('文章概述不能小于50字节');
	} else if (summary.length > 1000) {
		error.push('文章概述不能超过1000字节');
	}
	if (CKEDITOR.instances.content)
		var content = $.trim(CKEDITOR.instances.content.getData());
	else 
		var content = $.trim($('#content').val());
	if (content.length < 100) {
		error.push('文章内容不能小于100字节');
	} else if (content.length > 65535) {
		error.push('文章内容不能超过65535字节');
	}
	var objCode = $('#validateCode');
	var elCaptcha = $('#el-captcha');
	if (objCode.length > 0) {
		if ($.trim(objCode.val()) == '') {
			error.push('请输入4位验证码');
			$('#el-captcha img:not(.pic-validate)').remove();
			elCaptcha.append('<img src="' + TBU + 'images/state0.gif" />');
		} else {
			$.ajax({
				type: 'post',
				data: 'clientCode=' + objCode.val(),
				dataType: 'json',
				cache: false,
				async: false,
				url: $('#jsvar').attr('verifyCodeUrl'),
				beforeSend: function(){
					elCaptcha.append('<img src="' + TBU + 'images/loading.gif" />');
				},
				success: function(d){
					$('#el-captcha img:not(.pic-validate)').remove();
					if (d.error) {
						elCaptcha.append('<img src="' + TBU + 'images/state0.gif" />');
						error.push(d.message);
					} else {
						elCaptcha.append('<img src="' + TBU + 'images/state1.gif" />');
					}
				},
				error: function(){
					error.push('提交验证码请求失败');
				}
			});
		}
	}
	var note = $('#post-form').next('#note-list');
	if (error.length > 0) {
		var html = '<div class="errorSummary"><p>请更正以下错误：</p><ul><li>' + error.join('</li><li>') + '</li></li></div>';
		note.html(html);
	} else {
		note.empty();
		$('#post-form').submit();
	}
}

function diggPost()
{
	var tthis = $(this);
	var url = tthis.attr('href');
	var diggAction = tthis.parent();
	var pnum = tthis.parent().prev('.digg-num').children('span');
	var newDiggNums = parseInt(pnum.text()) + 1;
	var args = $('#' + CSRF_TOKEN).serialize();
	$.ajax({
		type: 'post',
		cache: false,
		dataType: 'json',
		data: args,
		url: url,
		success: function(d){
			if (d.code == 1) {
				pnum.html(newDiggNums);
				diggAction.text('谢谢参与');
			} else if (d.code == 2) {
				diggAction.text('已经顶过');
			}
			tthis.unbind();
			pnum.removeClass('btn-digg-bg');
		},
		beforeSend: function(){
			pnum.addClass('btn-digg-bg');
		},
		error: function(){
			pnum.removeClass('btn-digg-bg');
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
		toolbar: 'betaAdvance'
	});
	$('#uploads').show();
	return false;
}

function toggleDiggMode()
{
	$(this).toggleClass('beta-title-current');
	$('.beta-post-list .beta-digg').toggle();
}

function ajaxLoadPosts()
{
	var tthis = $(this);
	var cacheToken = 'cache' +  $('.load-posts').index(this);
	var data = tthis.data(cacheToken);
	if (data) {
		tthis.addClass('beta-title-current').siblings('.beta-title-current').removeClass('beta-title-current');
		$('#post-list').html(data);
		return false;
	}
	var loading = $('#post-list').prev('.beta-sub-title');
	// 去掉#body-text ie和opera下不支持带锚点的url使用ajax方式请求
	var url = tthis.attr('href');
	$.ajax({
		url: url,
		type: 'get',
		cache: false,
		dataType: 'html',
		beforeSend: function(){
			loading.html('<img src="' + TBU + '/images/ajax-loader.gif" />');
		},
		success: function(d){
			tthis.addClass('beta-title-current').siblings('.beta-title-current').removeClass('beta-title-current');
			loading.html('&nbsp;');
			$('#post-list').html(d);
			tthis.data(cacheToken, d);
			setTimeout("clearPostListCache()", 300000);
		},
		error: function(){
			loading.html('文章列表载入错误，请重试!').addClass('cred');
		}
	});
	return false;
}

function clearPostListCache()
{
	$('.load-posts').each(function(i){
		var cacheToken = 'cache' +  i;
		$(this).removeData(cacheToken);
	});
	
}

function collectArticle()
{
	var url = $(':text[name=collecturl]').val();
	if (url.length == 0) return false;
	var site = $('select[name=collectsite]').val();
	$.ajax({
		url: '/site/ajaxCollect?url=' + url + '&site=' + site,
		type: 'post',
		cache: false,
		dataType: 'json',
		data: $('#' + CSRF_TOKEN).serialize(),
		beforeSend: function(){
			//loading.html('<img src="' + TBU + '/images/ajax-loader.gif" />');
		},
		success: function(d){
			$('#subject').val(d.subject);
			$('#content').val(d.content);
			CKEDITOR.instances.content.insertHtml(d.content);
		},
		error: function(){
			//loading.html('文章列表载入错误，请重试!').addClass('cred');
		}
	});
}



