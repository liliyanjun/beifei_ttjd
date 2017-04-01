app.controller('ManageProjectCtrl', function ($scope, httpReq, auth, $location, localStorage, $interval, showToast, showConfirm, modalBox, $q) {
        $scope.result = null;
        $scope.query = {};
        $scope.query.data = {};
        $scope.query_config = [
            {
                key: 'query_content',
                type: 'input',
                templateOptions: {
                    label: "项目ID",
                    type: "text"
                }
            }
        ];
        $scope.run_query = function () {
            $scope.result = null;
            httpReq("/nm2/project/query_manage_projectinfo", {
                project_id: $scope.query.data.query_content
            }).then(function (data) {
                $scope.result = data.result;
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
        $scope.log_project = function (project) {
            modalBox.show("log_project", {project_id: project.id});
        };
        $scope.renzheng_project = function (project) {
            modalBox.show("renzheng_project", {project_id: project.id}).then(function (result) {
                angular.extend(project, result);
            });
        };
    })
    .controller('renzhengProjectModalCtrl', function ($scope, httpReq, args, $rootScope, modalBox, $uibModalInstance, showConfirm, showToast, $location) {
        //var now = moment();
        //$scope.start_date = now.format("YYYY-MM-DD");
        //$scope.end_date = null;
        //httpReq('/nm2/project/query_projectinfo', {"project_id": args.project_id}).then(function (data) {
        //    $scope.projectinfo = data.result;
        //    var is_renzheng = '';
        //    if ($scope.projectinfo.is_renzheng) {
        //        is_renzheng = "已认证";
        //        $scope.start_date = moment($scope.projectinfo.renzheng_starttime).format('YYYY-MM-DD');
        //        $scope.end_date = moment($scope.projectinfo.renzheng_endtime).format('YYYY-MM-DD');
        //    } else {
        //        is_renzheng = "试用";
        //    }
        //    var enable_days_status = "";
        //    if ($scope.projectinfo.enable_days_status == 1) {
        //        enable_days_status = "即将过期";
        //    } else if ($scope.projectinfo.enable_days_status == 2) {
        //        enable_days_status = "已过期";
        //    }
        //    $scope.renzheng.data.renzheng_status = is_renzheng + " " + enable_days_status;
        //    $scope.renzheng.data.start_date = $scope.start_date;
        //    $scope.renzheng.data.end_date = $scope.end_date;
        //});
        $scope.result = null;
        httpReq('/nm2/project/query_renzheng_projectinfo', {"project_id": args.project_id}).then(function (data) {
            $scope.result = data.result;
        });
        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        $scope.renzheng = {};
        $scope.renzheng.data = {
            "renzheng_space": 50,
            "renzheng_capacity": 500
        };
        $scope.renzheng_config = [
            {
                key: 'renzheng_space',
                type: 'select',
                templateOptions: {
                    label: '账户空间',
                    options: [{
                        "name": "50",
                        "value": 50
                    }, {
                        "name": "100",
                        "value": 100
                    }, {
                        "name": "200",
                        "value": 200
                    }, {
                        "name": "500",
                        "value": 500
                    }]
                }
            },
            {
                key: 'renzheng_capacity',
                type: 'select',
                templateOptions: {
                    label: '账户容量',
                    options: [{
                        "name": "500G",
                        "value": 500
                    }, {
                        "name": "1000G",
                        "value": 1000
                    }]
                }
            },
            {
                key: 'start_date',
                type: 'datepicker',
                templateOptions: {
                    label: '起始时间'
                }
            },
            {
                key: 'end_date',
                type: 'datepicker',
                templateOptions: {
                    label: '截止时间'
                }
            },
            {
                key: 'remark',
                type: 'input',
                templateOptions: {
                    label: '备注信息'
                }
            }
        ];
        $scope.ren_zheng = function () {
            showConfirm('提示', '是否确认认证项目').then(function () {
                httpReq('/nm2/project/renzheng_project', {
                    project_id: args.project_id,
                    start_date: $scope.renzheng.data.start_date,
                    end_date: $scope.renzheng.data.end_date,
                    renzheng_space: $scope.renzheng.data.renzheng_space,
                    renzheng_capacity: $scope.renzheng.data.renzheng_capacity,
                    renzheng_remark: $scope.renzheng.data.remark
                }).then(function (data) {
                    showToast('认证成功', 'success');
                    $uibModalInstance.close(data.result);
                });
            });
        };
    })
    .controller('logProjectModalCtrl', function ($scope, httpReq, args, $rootScope, modalBox, $uibModalInstance, showConfirm, showToast, $location) {
        $scope.$on("pageInit", function () {
            $scope.loadPage();
        });
        $scope.$on("loadPage", function () {
            $scope.pageReq("/nm2/project/query_project_log", {"project_id": args.project_id}).then(function (data) {
                $scope.loglist = data.result;
            })
        });
        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
    });