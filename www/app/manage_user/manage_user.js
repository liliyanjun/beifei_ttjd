app.controller('ManageUserCtrl', function ($scope, httpReq, auth, $location, localStorage, $interval, showToast, modalBox, $q) {
    $scope.query = {};
    $scope.query.data = {
        "query_type": 1,
        "query_time_type": 1
    };

    $scope.query_config = [
        {
            key: 'query_type',
            type: 'select',
            templateOptions: {
                options: [
                    {
                        "name": "启动次数级别统计",
                        "value": 1
                    }, {
                        "name": "启动次数时间段统计",
                        "value": 2
                    }, {
                        "name": "功能使用次数统计",
                        "value": 3
                    }
                ]
            }
        },
        {
            key: 'query_time_type',
            type: 'select',
            templateOptions: {
                label: '时间',
                options: [
                    {
                        "name": "过去7天",
                        "value": 1
                    }, {
                        "name": "过去30天",
                        "value": 2
                    }, {
                        "name": "过去60天",
                        "value": 3
                    }, {
                        "name": "任选时间",
                        "value": 4
                    }
                ]
            }
        },
        {
            key: 'start_date',
            type: 'datepicker',

            templateOptions: {
                label: '起始时间'
            },
            "hideExpression": "model.query_time_type!=4"
        },
        {
            key: 'end_date',
            type: 'datepicker',
            templateOptions: {
                label: '结束时间'
            },
            "hideExpression": "model.query_time_type!=4"
        }

    ];
    $scope.query_btn=function(){
        $scope.level_table = null;
        $scope.time_table = null;
        $scope.app_create_table = null;
        $scope.app_query_table = null;
        var start_date = $scope.query.data.start_date;
        var end_date = $scope.query.data.end_date;
        if($scope.query.data.query_time_type==1){
            start_date=moment().subtract(7, 'days').format("YYYY-MM-DD");
            end_date=moment().format("YYYY-MM-DD");
        }else if($scope.query.data.query_time_type==2){
            start_date=moment().subtract(30, 'days').format("YYYY-MM-DD");
            end_date=moment().format("YYYY-MM-DD");
        }else if($scope.query.data.query_time_type==3){
            start_date=moment().subtract(60, 'days').format("YYYY-MM-DD");
            end_date=moment().format("YYYY-MM-DD");
        }
        if($scope.query.data.query_type==1){
            httpReq("/nm2/user/query_start_user_level_pre_day", {
                start_time: start_date,
                end_time: end_date
            }).then(function (data) {
                var level_table = [];
                _(data.result).each(function (item, index) {
                    var date = item.date;
                    var count1 = item['1_3'] || 0;
                    var count2 = item['4_5'] || 0;
                    var count3 = item['6_10'] || 0;
                    var count4 = item['11_'] || 0;
                    var total = count1 + count2 + count3 + count4;
                    var date_item = {};
                    date_item.date = date;
                    date_item.count1 = count1;
                    date_item.count2 = count2;
                    date_item.count3 = count3;
                    date_item.count4 = count4;
                    date_item.total = total;
                    level_table.push(date_item);
                });
                $scope.level_table = level_table;
            });
        }else if($scope.query.data.query_type==2){
            httpReq("/nm2/user/query_start_user_hour_pre_day", {
                start_time: start_date,
                end_time: end_date
            }).then(function (data) {
                var count_data = [];
                _(data.result).each(function (item, index) {
                    var date = item.date;
                    var count1 = item['h0_8'] || 0;
                    var count2 = item['h8_12'] || 0;
                    var count3 = item['h12_18'] || 0;
                    var count4 = item['h18_24'] || 0;
                    var total = count1 + count2 + count3 + count4;
                    var date_item = {};
                    date_item.date = date;
                    date_item.count1 = count1;
                    date_item.count2 = count2;
                    date_item.count3 = count3;
                    date_item.count4 = count4;
                    date_item.total = total;
                    count_data.push(date_item);
                });
                $scope.time_table = count_data;
            });
        }else if($scope.query.data.query_type==3){
            httpReq("/nm2/project/query_app_pre_day", {
                start_time: start_date,
                end_time: end_date
            }).then(function (data) {
                $scope.app_create_table = data.result.create_result;
                $scope.app_query_table = data.result.query_result;
            });
        }

    }
});