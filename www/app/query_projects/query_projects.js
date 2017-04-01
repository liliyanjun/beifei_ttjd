app.controller('queryProjectsCtrl', function ($scope, httpReq, auth, $location, localStorage, $interval, showToast, modalBox, showConfirm) {  //依赖
        $scope.query_arg = {};			//声明查询空变量
        $scope.query_time_type = 0;		//查询时间类型为0        	
        $scope.query_project_type = 0;	//查询查询类型为0
        $scope.$on("pageInit", function () {	//页码加载
            $scope.loadPage();
        })
        $scope.$on("loadPage", function () {				//传参页码
            $scope.pageReq("/nm2/project/query_project_v2", $scope.query_arg).then(function (data) {  //执行http事件  带入参数query_arg 之后执行
                $scope.data_list = data.result;				//data_list数据渲染到界面 data.result
            })
        });
        $scope.query = {};								//声明空对象 query
        $scope.query.data = {							//判断query_data的数值
            query_type: 1								//query_type的值为 1;
        };
        $scope.query_config = [						//query配置
            {
                key: 'query_type',			
                type: 'select',
                templateOptions: {
                    options: [{
                        "name": "项目名称",
                        "value": 1
                    }, {
                        "name": "ID",
                        "value": 2
                    }]
                }
            },

            {
                key: 'query_content',
                type: 'input',
                templateOptions: {
                    type: "text"
                }
            }
        ];
        $scope.query_btn = function (type) {		//搜索按钮执行的函数 传参type
            if (type != 0) {						//如果非等于0时
                $scope.query_time_type = type;		//查询时间类型为 type
            }	
            if ($scope.query.data.query_type == 1) {
                $scope.query_arg = {name: $scope.query.data.query_content};
            }else if($scope.query.data.query_type == 2){
            	$scope.query_arg = {id: $scope.query.data.query_content};
            }
            
            $scope.query_arg = {};					//查询arg等于空 
            var start_date = $scope.query.data.start_date;		//开始时间 == 查询日期
            var end_date = moment($scope.query.data.end_date).add('days', 1).format("YYYY-MM-DD");  //结束时间 没有关系
            if ($scope.query_time_type == 1) {   //如果时间类型等于1时
                start_date = null;				//开始时间为空
                end_date = null;				//结束时间为空
            } else if ($scope.query_time_type == 2) { 
                start_date = moment().format("YYYY-MM-DD");
                end_date = moment().add('days', 1).format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 3) {
                start_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
                end_date = moment().format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 4) {
                start_date = moment().subtract(8, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 5) {
                start_date = moment().subtract(31, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 6) {
                start_date = moment().subtract(61, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            }
            
            
            
            $scope.query_arg['start_date'] = start_date;  //查询开始时间
            $scope.query_arg['end_date'] = end_date;		//查询结束时间
            $scope.query_arg['query_project_type'] = $scope.query_project_type;    //查询项目类型
            $scope.loadPage();     //执行加载
        };
        $scope.query_btn_2 = function (type) {
            $scope.query_project_type = type;				//查询数据的type
            var start_date = $scope.query.data.start_date;			//查询开始的时间
            var end_date = moment($scope.query.data.end_date).add('days', 1).format("YYYY-MM-DD");
            if ($scope.query_time_type == 1) {
                start_date = null;
                end_date = null;
            } else if ($scope.query_time_type == 2) {
                start_date = moment().format("YYYY-MM-DD");
                end_date = moment().add('days', 1).format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 3) {
                start_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
                end_date = moment().format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 4) {
                start_date = moment().subtract(8, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 5) {
                start_date = moment().subtract(31, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 6) {
                start_date = moment().subtract(61, 'days').format("YYYY-MM-DD");
                end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            }
            $scope.query_arg = {};
            $scope.query_arg['start_date'] = start_date;     //查询开始时间
            $scope.query_arg['end_date'] = end_date;		//查询结束的时间
            $scope.query_arg['query_project_type'] = $scope.query_project_type;			//查询项目的类别
            $scope.loadPage();
        };
        $scope.show_projectinfo = function (project) {		//详情查看
            modalBox.show("query_projectinfo", {project_id: project.id});
        };
        $scope.show_project_member = function (project) {		//成员详情
            modalBox.show("query_project_member", {project_id: project.id});
        };
        $scope.log_project = function (project) {		//日志详情
            modalBox.show("log_project", {project_id: project.id});
        };
        $scope.recover_project = function (project) {		//恢复
            showConfirm('提示', '是否确认恢复项目').then(function () {
                httpReq('/nm2/project/recover_project', {project_id: project.id}).then(function () {
                    project.status = 0;
                    showToast('恢复成功', 'success');
                });
            });
        };
    })


