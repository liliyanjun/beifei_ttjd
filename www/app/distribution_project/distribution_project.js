app.controller('DistributionProjectCtrl', function ($scope, httpReq, auth, $location, showConfirm,localStorage, $interval,loading, showToast, modalBox) {
    $scope.query = {};
    $scope.query.data = {
        "query_show_delete": true
    };
    $scope.query_config = [
        {
            key: 'query_show_delete',
            type: 'checkbox',
            templateOptions: {
                label: '是否显示解散项目'
            }
        }
    ];
    $scope.query_time_type = 1;
    $scope.query_btn = function (type) {
        loading.show();
        $scope.query_time_type = type;
        if ($scope.query_time_type == 1) {
            $scope.start_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            $scope.end_date = moment().format("YYYY-MM-DD");
        } else if ($scope.query_time_type == 2) {
            $scope.start_date = moment().subtract(8, 'days').format("YYYY-MM-DD");
            $scope.end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
        } else if ($scope.query_time_type == 3) {
            $scope.start_date = moment().subtract(31, 'days').format("YYYY-MM-DD");
            $scope.end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
        } else if ($scope.query_time_type == 4) {
            $scope.start_date = moment().subtract(61, 'days').format("YYYY-MM-DD");
            $scope.end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
        }
        httpReq("/nm2/project/query_active_project", {
            start_date: $scope.start_date,
            end_date: $scope.end_date
        }).then(function (data) {
            if($scope.query.data.query_show_delete){
                $scope.data = data.result;
            }else{
                $scope.data = _(data.result).filter(function(p){
                    return p.status==0
                });
            }
            loading.hide();
        });
    };
    $scope.query_config2 = [
            //{
            //    key: 'query_time_type',
            //    type: 'select',
            //    templateOptions: {
            //        label: '时间',
            //        options: [
            //            {
            //                "name": "全部",
            //                "value": 0
            //            },
            //            {
            //                "name": "今日",
            //                "value": 1
            //            }, {
            //                "name": "昨日",
            //                "value": 2
            //            }, {
            //                "name": "过去7天",
            //                "value": 3
            //            }, {
            //                "name": "过去30天",
            //                "value": 4
            //            }, {
            //                "name": "过去60天",
            //                "value": 5
            //            }, {
            //                "name": "任选时间",
            //                "value": 6
            //            }
            //        ]
            //    }
            //},
            //{
            //    key: 'start_date',
            //    type: 'datepicker',
            //
            //    templateOptions: {
            //        label: '起始时间'
            //    },
            //    "hideExpression": "model.query_time_type!=6"
            //},
            //{
            //    key: 'end_date',
            //    type: 'datepicker',
            //    templateOptions: {
            //        label: '结束时间'
            //    },
            //    "hideExpression": "model.query_time_type!=6"
            //},
            //{
            //    key: 'query_renzheng_type',
            //    type: 'select',
            //    templateOptions: {
            //        label: '订阅状态',
            //        options: [
            //            {
            //                "name": "全部",
            //                "value": 0
            //            }, {
            //                "name": "订阅",
            //                "value": 1
            //            }, {
            //                "name": "试用",
            //                "value": 2
            //            }, {
            //                "name": "订阅到期",
            //                "value": 3
            //            }, {
            //                "name": "试用到期",
            //                "value": 4
            //            }]
            //    }
            //
            //},
            //{
            //    key: 'query_project_type',
            //    type: 'select',
            //    templateOptions: {
            //        label: '项目状态',
            //        options: [{
            //            "name": "全部",
            //            "value": -1
            //        }, {
            //            "name": "正常",
            //            "value": 0
            //        }, {
            //            "name": "解散",
            //            "value": 3
            //        }]
            //    },
            //},
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
    $scope.show_project_member = function (project) {
        modalBox.show("query_project_member", {project_id: project.id});
    };
    $scope.show_projectinfo = function (project) {
        modalBox.show("query_projectinfo", {project_id: project.id});
    };
    $scope.log_project = function (project) {
        modalBox.show("log_project", {project_id: project.id});
    };
    $scope.renzheng_project = function (project) {
        modalBox.show("renzheng_project", {project_id: project.id}).then(function (result) {
            angular.extend(project, result);
        });
    };
    $scope.recover_project = function (project) {
        showConfirm('提示', '是否确认恢复项目').then(function () {
            httpReq('/nm2/project/recover_project', {project_id: project.id}).then(function () {
                project.status = 0;
                showToast('恢复成功', 'success');
            });
        });
    };
    $scope.delete_project = function (project) {
        showConfirm('提示', '是否确认解散项目').then(function () {
            httpReq('/nm2/project/delete_project', {project_id: project.id}).then(function () {
                project.status = 3;
                showToast('解散成功', 'success');
            });
        });
    };
    $scope.query_btn(1);

});