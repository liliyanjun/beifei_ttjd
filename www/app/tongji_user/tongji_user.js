app.controller('tongjiUserCtrl', function ($scope, httpReq, auth, $location, localStorage, $interval, showToast, modalBox, makeChartConfigForXY, $q) {
    var now = moment();
    var start_date = now.subtract(8, 'days').format("YYYY-MM-DD");
    now = moment();
    var end_date = now.subtract(1, 'days').format("YYYY-MM-DD");
    now = moment();
    var start_month = now.subtract(4, 'months').format("YYYY-MM-DD");
    now = moment();
    var end_month = now.subtract(1, 'months').format("YYYY-MM-DD");
    $scope.query = {};
    $scope.query_type = 1;
    $scope.query.data = {
        "query_type": 1,
        "query_time_type": 1,
        start_date: start_date,
        end_date: end_date
        //start_month: start_month,
        //end_month: end_month
    };
    $scope.query_config = [

        //{
        //    key: 'query_type',
        //    type: 'select',
        //    templateOptions: {
        //        options: [
        //            {
        //                "name": "用户总量",
        //                "value": 1
        //            },
        //            {
        //                "name": "新增用户",
        //                "value": 2
        //            },
        //            {
        //                "name": "日活",
        //                "value": 3
        //            },
        //            {
        //                "name": "月活",
        //                "value": 4
        //            },
        //            // {
        //            //     "name": "启动次数及时间段",
        //            //     "value": 5
        //            // },
        //            {
        //                "name": "启动次数级别统计",
        //                "value": 6
        //            },
        //            // {
        //            //     "name": "功能使用次数统计",
        //            //     "value": 7
        //            // },
        //        ]
        //    }
        //},
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
                }]
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
        //{
        //    key: 'start_month',
        //    type: 'monthselect',
        //
        //    templateOptions: {
        //        label: '起始时间'
        //    },
        //    "hideExpression": "model.query_type!=4"
        //},
        {
            key: 'end_date',
            type: 'datepicker',
            templateOptions: {
                label: '结束时间'
            },
            "hideExpression": "model.query_time_type!=4"
        },
        //{
        //    key: 'end_month',
        //    type: 'monthselect',
        //    templateOptions: {
        //        label: '结束时间'
        //    },
        //    "hideExpression": "model.query_type!=4"
        //},
        {
            key: 'address',
            type: 'citypicker',
            templateOptions: {
                label: '地区'
            }
        }
    ];
    $scope.query_type_btn=function(type){
        $scope.query_type=type;
        if($scope.query_type == 1){
            $scope.chartConfig = makeChartConfigForXY("用户总量", $scope.total_user_result);
        }else if($scope.query_type == 2){
            $scope.chartConfig = makeChartConfigForXY("新增用户", $scope.new_user_result);
        }else if($scope.query_type == 3){
            $scope.chartConfig = makeChartConfigForXY("日活", $scope.day_start_result);
        }else if($scope.query_type == 4){
            $scope.chartConfig = makeChartConfigForXY("月活", $scope.month_start_result);
        }else if($scope.query_type == 6){
            $scope.chartConfig = makeChartConfigForXY("启动次数", $scope.start_num_result);
        }

    };
    $scope.run_query = function () {
        $scope.total_user_result=null;
        $scope.new_user_result=null;
        $scope.day_start_result=null;
        $scope.month_start_result=null;
        $scope.start_num_result=null;
        $scope.table_result=null;

        //$scope.rihuo_table = null;
        //$scope.level_table = null;
        //$scope.table5 = null;
        //$scope.show_chart = true;

        var province, city;
        if ($scope.query.data.address && $scope.query.data.address.province) {
            province = $scope.query.data.address.province.name;
        }
        else {
            province = "";
        }
        if ($scope.query.data.address && $scope.query.data.address.city) {
            city = $scope.query.data.address.city.name;
        }
        else {
            city = "";
        }
        var start_date = $scope.query.data.start_date;
        var end_date = $scope.query.data.end_date;
        if($scope.query.data.query_time_type==1){
            start_date=moment().subtract(6, 'days').format("YYYY-MM-DD");
            end_date=moment().format("YYYY-MM-DD");
        }else if($scope.query.data.query_time_type==2){
            start_date=moment().subtract(29, 'days').format("YYYY-MM-DD");
            end_date=moment().format("YYYY-MM-DD");
        }else if($scope.query.data.query_time_type==3){
            start_date=moment().subtract(59, 'days').format("YYYY-MM-DD");
            end_date=moment().format("YYYY-MM-DD");
        }
        httpReq("/nm2/user/query_user_pre", {
            start_time: start_date,
            end_time: end_date,
            province: province,
            city: city
        }).then(function (data) {
            $scope.total_user_result=data.result.total_user_result;
            $scope.new_user_result=data.result.new_user_result;
            $scope.day_start_result=data.result.day_start_result;
            $scope.month_start_result=data.result.month_start_result;
            $scope.start_num_result=data.result.start_num_result;
            $scope.table_result = data.result.table_result;
            $scope.query_type_btn($scope.query_type);
        });


        //if (query_type == 1) {
        //    httpReq("/nm2/user/query_total_user_pre_day", {
        //        start_time: start_date,
        //        end_time: end_date,
        //        province: province,
        //        city: city
        //    }).then(function (data) {
        //        $scope.chartConfig = makeChartConfigForXY("用户总量", data.result);
        //    })
        //}
        //else if (query_type == 2) {
        //    httpReq("/nm2/user/query_new_user_pre_day", {
        //        start_time: start_date,
        //        end_time: end_date,
        //        province: province,
        //        city: city
        //    }).then(function (data) {
        //        $scope.chartConfig = makeChartConfigForXY("新增用户", data.result);
        //    })
        //}
        //else if (query_type == 3) {
        //    var p_array = [];
        //    p_array.push(httpReq("/nm2/user/query_start_user_pre_day", {
        //        start_time: start_date,
        //        end_time: end_date,
        //        province: province,
        //        city: city
        //    }).then(function (data) {
        //        $scope.chartConfig = makeChartConfigForXY("日活", data.result);
        //        return data;
        //    }));
        //    p_array.push(httpReq("/nm2/user/query_total_user_pre_day", {
        //        start_time: $scope.query.data.start_date,
        //        end_time: $scope.query.data.end_date,
        //        province: province,
        //        city: city
        //    }));
        //    $q.all(p_array).then(function (data) {
        //        var data1 = data[0];
        //        var data2 = data[1];
        //        var rihuo_table = [];
        //        _(data1.result).each(function (item1, index) {
        //            var item2 = data2.result[index];
        //            var p;
        //            if (item2.y > 0) {
        //                p = item1.y * 100.0 / item2.y;
        //            }
        //            else {
        //                p = "";
        //            }
        //            rihuo_table.push({x: item1.x, y1: item1.y, y2: item2.y, p: p})
        //        })
        //        $scope.rihuo_table = rihuo_table;
        //    })
        //}
        //else if (query_type == 4) {
        //    httpReq("/nm2/user/query_start_user_pre_month", {
        //        start_time: start_date,
        //        end_time: end_date,
        //        province: province,
        //        city: city
        //    }).then(function (data) {
        //        $scope.chartConfig = makeChartConfigForXY("月活", data.result);
        //    })
        //}
        ////else if (query_type == 5) {
        ////    $scope.show_chart = false;
        ////    httpReq("/nm2/user/query_start_user_hour_pre_day", {
        ////        start_time: start_date,
        ////        end_time: end_date,
        ////        province: province,
        ////        city: city
        ////    }).then(function (data) {
        ////
        ////        var count_data = [];
        ////        _(data.result).each(function (item, index) {
        ////            var date = item.date;
        ////            var count1 = item['h0_8'] || 0;
        ////            var count2 = item['h8_12'] || 0;
        ////            var count3 = item['h12_18'] || 0;
        ////            var count4 = item['h18_24'] || 0;
        ////            var total = count1 + count2 + count3 + count4;
        ////            var date_item = {};
        ////            date_item.date = date;
        ////            date_item.count1 = count1;
        ////            date_item.count2 = count2;
        ////            date_item.count3 = count3;
        ////            date_item.count4 = count4;
        ////            date_item.total = total;
        ////            count_data.push(date_item);
        ////        })
        ////        console.log(count_data);
        ////        $scope.table5 = count_data;
        ////        // $scope.chartConfig = makeChartConfigForXY("用户总量", data.result);
        ////    })
        ////}
        //else if (query_type == 6) {
        //    $scope.show_chart = false;
        //    httpReq("/nm2/user/query_start_user_level_pre_day", {
        //        start_time: start_date,
        //        end_time: end_date,
        //        province: province,
        //        city: city
        //    }).then(function (data) {
        //
        //        var level_table = [];
        //        _(data.result).each(function (item, index) {
        //            var date = item.date;
        //            var count1 = item['1_3'] || 0;
        //            var count2 = item['4_5'] || 0;
        //            var count3 = item['6_10'] || 0;
        //            var count4 = item['11_'] || 0;
        //            var total = count1 + count2 + count3 + count4;
        //            var date_item = {};
        //            date_item.date = date;
        //            date_item.count1 = count1;
        //            date_item.count2 = count2;
        //            date_item.count3 = count3;
        //            date_item.count4 = count4;
        //            date_item.total = total;
        //            level_table.push(date_item);
        //        })
        //        console.log(level_table);
        //        $scope.level_table = level_table;
        //        // $scope.chartConfig = makeChartConfigForXY("用户总量", data.result);
        //    })
        //}
    }
    $scope.run_query();

});