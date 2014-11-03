<h2 id="functionTitle">自定义跟踪管理</h2>
<div id="showArea" class="theShowArea siteMane">
        <div class="G-tabBox">
            <div class="tabBox">
                <div class="innerTabBox">
                    <div class="G-tableSet processTable thePhotosManage">
                        <div class="theTableBox">
                            <table class="widgetTable">
                                <tbody class="gridHeadContent">
                                    <tr>
										<th class="nameCol">事件ID</th>
										<th class="nameCol">事件名称</th>
										<th class="nameCol">事件级别</th>
										<th class="nameCol">统计项</th>
										<th class="nameCol">统计值</th>
										<th class="nameCol">操作</th>
									</tr>
                                </tbody>
                                 <tbody id="theListBody">
                                    <? foreach ($customs as $custom): ?>
                                    <tr>
										<td><?=$custom->id?></td>
										<td><?=$custom->title?></td>
                                        <td><?=$custom->level?></td>
                                        <td><?=$custom->label0 . "," . $custom->label1 . "," . $custom->label2?></td>
                                        <td><?=$custom->value0 . "," . $custom->value1 . "," . $custom->value2?></td>
                                        <td><a href="/setting/customdelete?wid=<?=$custom->id?>">删除</a></td>
                                    </tr>
                                    <? endforeach ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
</div>
<h3><a href="/setting/customcreate">添加自定义跟踪</a></h3>
