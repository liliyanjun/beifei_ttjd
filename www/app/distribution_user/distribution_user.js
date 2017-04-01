app.controller('DistributionUserCtrl', function ($scope, httpReq, makeChartConfigForXY,auth, $location, localStorage, $interval, showToast, modalBox, $q) {
    $scope.result = [];
    $scope.query = {};
    $scope.query.data = {
        //"query_time_type": 1,
        //"start_date": moment().format("YYYY-MM-DD"),
        "query_area_type": false
    };
    $scope.city_list = city_data.city_list;
    $scope.province_list = city_data.province_list;
    $scope.query_time_type = 1;
    $scope.query_top_type = 1;

    $scope.query_config = [
        //{
        //    key: 'query_time_type',
        //    type: 'select',
        //    templateOptions: {
        //        label: '时间',
        //        options: [
        //            {
        //                "name": "单日",
        //                "value": 1
        //            }, {
        //                "name": "过去7天",
        //                "value": 2
        //            }, {
        //                "name": "过去30天",
        //                "value": 3
        //            }
        //        ]
        //    }
        //},
        //{
        //    key: 'start_date',
        //    type: 'datepicker',
        //    templateOptions: {
        //        label: '选择日期'
        //    }
        //},
        {
            key: 'query_area_type',
            type: 'checkbox',
            templateOptions: {
                label: '是否显示市级'
            }
        }


    ];
    $scope.query_btn_top = function (type) {
        $scope.query_top_type=type;
        if($scope.query_top_type==1){
            $scope.chartConfig = makeChartConfigForXY("累计注册用户", $scope.total_user_top10_result);
        }else if($scope.query_top_type==2){
            $scope.chartConfig = makeChartConfigForXY("新注册用户", $scope.new_user_top10_result);
        }else if($scope.query_top_type==3){
            $scope.chartConfig = makeChartConfigForXY("活跃用户", $scope.start_user_top10_result);
        }else if($scope.query_top_type==4){
            $scope.chartConfig = makeChartConfigForXY("启动次数", $scope.start_num_top10_result);
        }
    };
    $scope.query_btn = function (type) {
        $scope.query_time_type = type;
        if($scope.query_time_type==1){
            $scope.start_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            $scope.end_date = moment().format("YYYY-MM-DD");
        }else if ($scope.query_time_type == 2) {
            $scope.end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            $scope.start_date = moment($scope.end_date).subtract(7, 'days').format("YYYY-MM-DD");
        } else if ($scope.query_time_type == 3) {
            $scope.end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            $scope.start_date = moment($scope.end_date).subtract(30, 'days').format("YYYY-MM-DD");
        }else if ($scope.query_time_type == 4) {
            $scope.end_date = moment().subtract(1, 'days').format("YYYY-MM-DD");
            $scope.start_date = moment($scope.end_date).subtract(60, 'days').format("YYYY-MM-DD");
        }
        $scope.show_start_date = moment($scope.start_date).add(1, 'days').format("YYYY-MM-DD");
        $scope.show_end_date = moment($scope.end_date).format("YYYY-MM-DD");
        httpReq("/nm2/user/query_user_distribution", {
            start_date: $scope.start_date,
            end_date: $scope.end_date,
            type: $scope.query.data.query_area_type
        }).then(function (data) {

            $scope.total_user_result = data.result.total_user_result;
            $scope.new_user_result = data.result.new_user_result;
            $scope.start_user_result = data.result.start_user_result;
            //console.log(JSON.stringify($scope.start_user_result))
            $scope.start_num_result = data.result.start_num_result;



            $scope.total_user_count = 0;
            _($scope.total_user_result).each(function (i) {
                if(i.name!='未知') {
                    $scope.total_user_count += i.count;
                }
            });
            $scope.new_user_count = 0;
            _($scope.new_user_result).each(function (i) {
                if(i.name!='未知') {
                    $scope.new_user_count += i.count;
                }
            });
            $scope.start_user_count = 0;
            _($scope.start_user_result).each(function (i) {
                if(i.name!='未知') {
                    $scope.start_user_count += 1;
                }
            });
            $scope.start_num_count = 0;
            _($scope.start_num_result).each(function (i) {
                if(i.name!='未知'){
                    $scope.start_num_count += i.count;
                }
            });
            $scope.result = [];
            if($scope.query.data.query_area_type){
                _($scope.city_list).each(function (p) {
                    var item = {};
                    item['name'] = p.province_name+' '+p.city_name;
                    var have_total_user = false;
                    _($scope.total_user_result).each(function (i) {
                        if (i.name == p.city_name) {
                            item['total_user_count'] = i.count;
                            have_total_user = true;
                        }
                    });
                    if (!have_total_user) {
                        item['total_user_count'] = 0;
                    }
                    var have_new_user = false;
                    _($scope.new_user_result).each(function (i) {
                        if (i.name == p.city_name) {
                            item['new_user_count'] = i.count;
                            have_new_user = true;
                        }
                    });
                    if (!have_new_user) {
                        item['new_user_count'] = 0;
                    }
                    var have_start_user = false;
                    _($scope.start_user_result).each(function (i) {
                        if (i.name == p.city_name) {
                            if(item.start_user_count>=0){
                                item['start_user_count'] =  item.start_user_count + 1;
                            }else{
                                item['start_user_count'] = 1;
                            }
                            have_start_user = true;
                        }
                    });
                    if (!have_start_user) {
                        item['start_user_count'] = 0;
                    }
                    var have_start_num = false;
                    _($scope.start_num_result).each(function (i) {
                        if (i.name == p.city_name) {
                            item['start_num_count'] = i.count;
                            have_start_num = true;
                        }
                    });
                    if (!have_start_num) {
                        item['start_num_count'] = 0;
                    }
                    $scope.result.push(item);
                });
                $scope.dataresult = angular.copy($scope.result);
                $scope.total_user_top10 = $scope.result.sort(function(a,b){
                    return b.total_user_count- a.total_user_count;
                });
                $scope.total_user_top10 = $scope.total_user_top10.slice(0,10);
                $scope.total_user_top10_result = [];
                _($scope.total_user_top10).each(function(i){
                    var item={};
                    item['y'] = i.total_user_count;
                    item['x'] = i.name;
                    $scope.total_user_top10_result.push(item);
                });
                $scope.new_user_top10 = $scope.result.sort(function(a,b){
                    return b.new_user_count- a.new_user_count;
                });
                $scope.new_user_top10 = $scope.new_user_top10.slice(0,10);
                $scope.new_user_top10_result = [];
                _($scope.new_user_top10).each(function(i){
                    var item={};
                    item['y'] = i.new_user_count;
                    item['x'] = i.name;
                    $scope.new_user_top10_result.push(item);
                });
                $scope.start_user_top10 = $scope.result.sort(function(a,b){
                    return b.start_user_count- a.start_user_count;
                });
                $scope.start_user_top10 = $scope.start_user_top10.slice(0,10);
                $scope.start_user_top10_result = [];
                _($scope.start_user_top10).each(function(i){
                    var item={};
                    item['y'] = i.start_user_count;
                    item['x'] = i.name;
                    $scope.start_user_top10_result.push(item);
                });
                $scope.start_num_top10 = $scope.result.sort(function(a,b){
                    return b.start_num_count- a.start_num_count;
                });
                $scope.start_num_top10 = $scope.start_num_top10.slice(0,10);
                $scope.start_num_top10_result = [];
                _($scope.start_num_top10).each(function(i){
                    var item={};
                    item['y'] = i.start_num_count;
                    item['x'] = i.name;
                    $scope.start_num_top10_result.push(item);
                });
                $scope.query_btn_top($scope.query_top_type);
            }else{
                _($scope.province_list).each(function (p) {
                    var item = {};
                    item['name'] = p.province_name;
                    var have_total_user = false;
                    _($scope.total_user_result).each(function (i) {
                        if (i.name == p.province_name) {
                            item['total_user_count'] = i.count;
                            have_total_user = true;
                        }
                    });
                    if (!have_total_user) {
                        item['total_user_count'] = 0;
                    }
                    var have_new_user = false;
                    _($scope.new_user_result).each(function (i) {
                        if (i.name == p.province_name) {
                            item['new_user_count'] = i.count;
                            have_new_user = true;
                        }
                    });
                    if (!have_new_user) {
                        item['new_user_count'] = 0;
                    }
                    var have_start_user = false;
                    _($scope.start_user_result).each(function (i) {
                        if (i.name == p.province_name) {
                            if(item.start_user_count>=0){
                                item['start_user_count'] =  item.start_user_count + 1;
                            }else{
                                item['start_user_count'] = 1;
                            }

                            have_start_user = true;
                        }
                    });
                    if (!have_start_user) {
                        item['start_user_count'] = 0;
                    }
                    var have_start_num = false;
                    _($scope.start_num_result).each(function (i) {
                        if (i.name == p.province_name) {
                            item['start_num_count'] = i.count;
                            have_start_num = true;
                        }
                    });
                    if (!have_start_num) {
                        item['start_num_count'] = 0;
                    }
                    $scope.result.push(item);
                });
                $scope.dataresult = angular.copy($scope.result);
                $scope.total_user_top10 = $scope.result.sort(function(a,b){
                    return b.total_user_count- a.total_user_count;
                });
                $scope.total_user_top10 = $scope.total_user_top10.slice(0,10);
                $scope.total_user_top10_result = [];
                _($scope.total_user_top10).each(function(i){
                    var item={};
                    item['y'] = i.total_user_count;
                    item['x'] = i.name;
                    $scope.total_user_top10_result.push(item);
                });
                $scope.new_user_top10 = $scope.result.sort(function(a,b){
                    return b.new_user_count- a.new_user_count;
                });
                $scope.new_user_top10 = $scope.new_user_top10.slice(0,10);
                $scope.new_user_top10_result = [];
                _($scope.new_user_top10).each(function(i){
                    var item={};
                    item['y'] = i.new_user_count;
                    item['x'] = i.name;
                    $scope.new_user_top10_result.push(item);
                });
                $scope.start_user_top10 = $scope.result.sort(function(a,b){
                    return b.start_user_count- a.start_user_count;
                });
                $scope.start_user_top10 = $scope.start_user_top10.slice(0,10);
                $scope.start_user_top10_result = [];
                _($scope.start_user_top10).each(function(i){
                    var item={};
                    item['y'] = i.start_user_count;
                    item['x'] = i.name;
                    $scope.start_user_top10_result.push(item);
                });
                $scope.start_num_top10 = $scope.result.sort(function(a,b){
                    return b.start_num_count- a.start_num_count;
                });
                $scope.start_num_top10 = $scope.start_num_top10.slice(0,10);
                $scope.start_num_top10_result = [];
                _($scope.start_num_top10).each(function(i){
                    var item={};
                    item['y'] = i.start_num_count;
                    item['x'] = i.name;
                    $scope.start_num_top10_result.push(item);
                });
                $scope.query_btn_top($scope.query_top_type);
            }

        });
    };
    $scope.query_btn(1);
});