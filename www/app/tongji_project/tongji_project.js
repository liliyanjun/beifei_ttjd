app.controller('tongjiProjectCtrl', function ($scope, httpReq, auth, $location, localStorage, $interval, showToast, modalBox, makeChartConfigForXY, $q) {
    $scope.query_type = 1;
    $scope.query = {};
    $scope.query.data = {
        query_time_type: 1
    };
    $scope.query_config = [
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
        },
        {
            key: 'address',
            type: 'citypicker',
            templateOptions: {
                label: '地区'
            }
        }
    ];
    $scope.query_type_btn = function (type) {
        $scope.query_type = type;
        if ($scope.query_type == 1) {
            $scope.chartConfig = makeChartConfigForXY("累计项目数", $scope.total_project_result);
        } else if ($scope.query_type == 2) {
            $scope.chartConfig = makeChartConfigForXY("新创建项目数", $scope.new_project_result);
        } else if ($scope.query_type == 3) {
            $scope.chartConfig = makeChartConfigForXY("订阅项目数", $scope.renzheng_project_result);
        } else if ($scope.query_type == 4) {
            $scope.chartConfig = makeChartConfigForXY("活跃项目数", $scope.start_project_result);
        } else if ($scope.query_type == 5) {
            $scope.chartConfig = makeChartConfigForXY("订阅数", $scope.renzheng_result);
        }
    };
    $scope.run_query = function () {
        $scope.table_data = null;
        $scope.total_project_result = null;
        $scope.new_project_result = null;
        $scope.renzheng_project_result = null;
        $scope.start_project_result = null;
        $scope.table_result = null;
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
        if ($scope.query.data.query_time_type == 1) {
            start_date = moment().subtract(6, 'days').format("YYYY-MM-DD");
            end_date = moment().format("YYYY-MM-DD");
        } else if ($scope.query.data.query_time_type == 2) {
            start_date = moment().subtract(29, 'days').format("YYYY-MM-DD");
            end_date = moment().format("YYYY-MM-DD");
        } else if ($scope.query.data.query_time_type == 3) {
            start_date = moment().subtract(59, 'days').format("YYYY-MM-DD");
            end_date = moment().format("YYYY-MM-DD");
        }
        httpReq("/nm2/project/query_project_pre", {
            start_time: start_date,
            end_time: end_date,
            province: province,
            city: city
        }).then(function (data) {
            $scope.total_project_result = data.result.total_project_result;
            $scope.new_project_result = data.result.new_project_result;
            $scope.renzheng_project_result = data.result.renzheng_project_result;
            $scope.start_project_result = data.result.start_project_result;
            $scope.renzheng_result = data.result.renzheng_result;
            $scope.table_result = data.result.table_result;
            $scope.query_type_btn($scope.query_type);
        });
        //if (query_type == 1) {
        //    httpReq("/nm2/project/query_total_project_pre_day", {
        //        start_time: $scope.query.data.start_date,
        //        end_time: $scope.query.data.end_date,
        //        province: province,
        //        city: city
        //    }).then(function (data) {
        //        $scope.chartConfig = makeChartConfigForXY("项目总量", data.result);
        //    })
        //}
        //else if (query_type == 2) {
        //    httpReq("/nm2/project/query_new_project_pre_day", {
        //        start_time: $scope.query.data.start_date,
        //        end_time: $scope.query.data.end_date,
        //        province: province,
        //        city: city
        //    }).then(function (data) {
        //        $scope.chartConfig = makeChartConfigForXY("新增项目数量", data.result);
        //    })
        //}
        //else if (query_type == 3) {
        //    var p_array = [];
        //    p_array.push(httpReq("/nm2/project/query_start_project_pre_day", {
        //        start_time: $scope.query.data.start_date,
        //        end_time: $scope.query.data.end_date,
        //        province: province,
        //        city: city
        //    }).then(function (data) {
        //        $scope.chartConfig = makeChartConfigForXY("活跃项目统计", data.result);
        //        return data;
        //    }));
        //    p_array.push(httpReq("/nm2/project/query_total_project_pre_day", {
        //        start_time: $scope.query.data.start_date,
        //        end_time: $scope.query.data.end_date,
        //        province: province,
        //        city: city
        //    }));
        //    $q.all(p_array).then(function (data) {
        //        var data1 = data[0];
        //        var data2 = data[1];
        //        var table_data = [];
        //        _(data1.result).each(function (item1, index) {
        //            var item2 = data2.result[index];
        //            var p;
        //            if (item2.y > 0) {
        //                p = item1.y * 100.0 / item2.y;
        //            }
        //            else {
        //                p = "";
        //            }
        //            table_data.push({x: item1.x, y1: item1.y, y2: item2.y, p: p})
        //        })
        //        $scope.table_data = table_data;
        //    })
        //}
    };
    $scope.run_query();
});