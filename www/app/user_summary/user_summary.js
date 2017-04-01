/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('queryUsersCtrl', function ($scope, httpReq, auth, $location, localStorage, $interval, showToast, modalBox) {
        $scope.query_arg = {};
        $scope.$on("pageInit", function () {
            $scope.loadPage();
        });

        $scope.$on("loadPage", function () {
            $scope.pageReq("/nm2/user/query_user", $scope.query_arg).then(function (data) {
                $scope.data_list = data.result;
            })
        });
        $scope.query = {};
        $scope.query_time_type = 1;
        $scope.query.data = {"query_type": 1};
        $scope.query_config = [
            //{
            //
            //    key: 'query_time_type',
            //    type: 'select',
            //    templateOptions: {
            //        label: '注册时间',
            //        options: [{
            //            "name": "全部",
            //            "value": 1
            //        }, {
            //            "name": "今日",
            //            "value": 2
            //        }, {
            //            "name": "昨日",
            //            "value": 3
            //        }, {
            //            "name": "过去7天",
            //            "value": 4
            //        }, {
            //            "name": "过去30天",
            //            "value": 5
            //        }, {
            //            "name": "任选时间",
            //            "value": 6
            //        }]
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
            {
                key: 'query_type',
                type: 'select',
                templateOptions: {
                    options: [{
                        "name": "手机号",
                        "value": 1
                    }, {
                        "name": "名字",
                        "value": 2
                    }, {
                        "name": "ID",
                        "value": 3
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
        $scope.query_btn = function (type) {
            if (type != 0) {
                $scope.query_time_type = type;
            }
            if ($scope.query.data.query_type == 1) {
                $scope.query_arg = {tel: $scope.query.data.query_content};
            } else if ($scope.query.data.query_type == 2) {
                $scope.query_arg = {realname: $scope.query.data.query_content};
            } else if ($scope.query.data.query_type == 3) {
                $scope.query_arg = {id: $scope.query.data.query_content};
            }
            if ($scope.query_time_type == 1) {
                $scope.query_arg['start_date'] = '';
                $scope.query_arg['end_date'] = '';
            } else if ($scope.query_time_type == 2) {
                $scope.query_arg['start_date'] = moment().format("YYYY-MM-DD");
                $scope.query_arg['end_date'] = moment().add(1, 'days').format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 3) {
                $scope.query_arg['start_date'] = moment().subtract(1, 'days').format("YYYY-MM-DD");
                $scope.query_arg['end_date'] = moment().format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 4) {
                $scope.query_arg['start_date'] = moment().subtract(8, 'days').format("YYYY-MM-DD");
                $scope.query_arg['end_date'] = moment().subtract(1, 'days').format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 5) {
                $scope.query_arg['start_date'] = moment().subtract(31, 'days').format("YYYY-MM-DD");
                $scope.query_arg['end_date'] = moment().subtract(1, 'days').format("YYYY-MM-DD");
            } else if ($scope.query_time_type == 6) {
                $scope.query_arg['start_date'] = moment().subtract(61, 'days').format("YYYY-MM-DD");
                $scope.query_arg['end_date'] = moment().subtract(1, 'days').format("YYYY-MM-DD");
            }


            $scope.loadPage();
        };

        $scope.show_userinfo = function (user) {
            modalBox.show("query_userinfo", {user_id: user.id});
        };

    })
    .controller('queryUserInfoModalCtrl', function ($scope, httpReq, args, $rootScope, modalBox, $uibModalInstance, showToast, $location) {
        httpReq('/nm2/user/query_userinfo', {"user_id": args.user_id}).then(function (data) {
            $scope.userinfo = data.result;
        });
        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
    });