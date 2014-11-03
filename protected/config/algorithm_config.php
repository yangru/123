<?php
/**
 * 算法平台相关配置
 */
return array (
		'scene' => array (
				1 => array (
						'scene_id' => 1,
						'name' => '视频推荐',
						'desc' => '根据用户观看视频的历史行为记录，为用户推荐可能感兴趣的视频',
						'object_type' => '1',
						'algorithm_id' => '1' 
				),
				2 => array (
						'scene_id' => 2,
						'name' => '微博用户推荐',
						'desc' => '根据用户的关注、转发、评论行为，为用户推荐可能感兴趣的微博用户',
						'object_type' => '2',
						'algorithm_id' => '4' 
				),
				3 => array (
						'scene_id' => 3,
						'name' => '微博内容推荐',
						'desc' => '根据用户的转发、评论行为，为用户推荐可能感兴趣的微博内容',
						'object_type' => '3',
						'algorithm_id' => '3' 
				) 
		),
		'object_type' => array (
				1 => '视频',
				2 => '微博用户',
				3 => '微博内容' 
		),
		'algorithm' => array (
				1 => array (
						'algorithm_id' => 1,
						'name' => 'UCF',
						'short' => 'ucf',
						'desc' => ' 基于用户的协同过滤算法，用于视频推荐',
						'type' => '1',
						'params' => array (
								1,
								2,
								3,
								4,
								5,
								6 
						) 
				),
				2 => array (
						'algorithm_id' => 2,
						'name' => 'ICF',
						'short' => 'icf',
						'desc' => '基于物品的协同过滤算法，用于视频推荐',
						'type' => '1',
						'params' => array (
								1,
								2,
								3,
								4,
								5 
						) 
				),
				3 => array (
						'algorithm_id' => 3,
						'name' => 'DWR',
						'short' => 'dwr',
						'desc' => '基于物品权重的不等权重随机选取算法，用于微博内容推荐',
						'type' => '3',
						'params' => array (
								3,
								7,
								8,
								5 
						) 
				),
				4 => array (
						'algorithm_id' => 4,
						'name' => 'CPR',
						'short' => 'cpr',
						'desc' => '基于二度人脉的剪枝算法，用于微博用户推荐',
						'type' => '2',
						'params' => array () 
				) 
		),
		'params' => array (
				1 => array (
						'param_id' => 1,
						'name' => 'K邻居范围',
						'short' => 'k',
						'default_value' => 80,
						'min' => 10,
						'max' => 200,
						'min_unit' => 1,
						'remark' => '表示算法搜寻相似用户或物品的范围，K值越大算法搜寻范围越广，即算法为目标用户推荐时考虑的候选结果范围越大，计算花费时间越长。' 
				),
				2 => array (
						'param_id' => 2,
						'name' => '热门惩罚权重',
						'short' => 'hot',
						'default_value' => 1,
						'min' => 1,
						'max' => 2,
						'min_unit' => 0.01,
						'remark' => '表示针对热门物品或活跃用户对推荐结果影响的惩罚权重，权重越大，热门物品/活跃用户对推荐结果的影响越小，即算法会更加倾向于推荐冷门物品。' 
				),
				3 => array (
						'param_id' => 3,
						'name' => '时间影响权重',
						'short' => 'time',
						'default_value' => 0.01,
						'min' => 0.0001,
						'max' => 1,
						'min_unit' => 0.0001,
						'remark' => '表示时间对推荐结果的影响，权重越大，系统中老物品对推荐结果的影响越小，即算法会更加倾向于向用户推荐最近最新的物品。' 
				),
				4 => array (
						'param_id' => 4,
						'name' => '显性反馈权重',
						'short' => 'like',
						'default_value' => 1,
						'min' => 1,
						'max' => 100,
						'min_unit' => 1,
						'remark' => '表示用户对物品的显性反馈行为（如点击Like按钮、分享按钮等行为）所产生的对推荐结果的影响。权重越大，算法越会推荐与这些显性反馈行为相似的物品，同样越会忽视用户平常对物品的隐形行为（如用户点击观看了某个视频）。' 
				),
				5 => array (
						'param_id' => 5,
						'name' => '推荐结果集大小',
						'short' => 'result',
						'default_value' => 10,
						'min' => 1,
						'max' => 50,
						'min_unit' => 1,
						'remark' => '推荐接口返回的推荐结果的数量。' 
				),
				6 => array (
						'param_id' => 6,
						'name' => '候选结果集大小',
						'short' => 'candidate',
						'default_value' => 25,
						'min' => 1,
						'max' => 50,
						'min_unit' => 1,
						'remark' => '推荐接口返回的候选结果的数量。' 
				),
				7 => array (
						'param_id' => 7,
						'name' => '转发权重',
						'short' => 'forward',
						'default_value' => 2,
						'min' => 1,
						'max' => 5,
						'min_unit' => 1,
						'remark' => '表示每次被转发对微博热度的影响， 在转发量一定的情况下，转发权重越大，该微博被推荐的可能性越大。' 
				),
				8 => array (
						'param_id' => 8,
						'name' => '评论权重',
						'short' => 'comment',
						'default_value' => 0.2,
						'min' => 0.1,
						'max' => 0.5,
						'min_unit' => 0.1,
						'remark' => '表示每次被评论对微博热度的影响，在评论量一定的情况下，评论权重越大，该微博被推荐的可能性越大。' 
				) 
		),
		'result_handle_type' => array (
				1 => '过滤',
				2 => '植入' 
		) 
);
