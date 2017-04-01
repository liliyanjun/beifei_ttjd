app.controller('queryOrdersCtrl', function ($scope, httpReq, auth, $location, localStorage, $interval, showToast, modalBox) {
        $scope.query_arg = {
            'start_date' : "",
            'end_date' : "",
            'query_type' : -1
        };
        $scope.$on("pageInit", function () {
            $scope.loadPage();
        });

        $scope.$on("loadPage", function () {
            $scope.pageReq("/nm2/payorderinfo/query_payorderinfo_list", $scope.query_arg).then(function (data) {
                $scope.data_list = data.result;
            })
        });

        $scope.query = {};
        $scope.query_time_type = 0;
        $scope.query.data = {"query_type": -1};
        $scope.query_config = [
            {
                key: 'query_type',
                type: 'select',
                templateOptions: {
                    options: [{
                        "name": "项目名称",
                        "value": -1
                    },{
                        "name": "ID",
                        "value": 0
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
            $scope.query_arg = {};
            var start_date = $scope.query.data.start_date;
            var end_date = moment($scope.query.data.end_date).add('days', 1).format("YYYY-MM-DD");
            if ($scope.query_time_type == 1) {
                start_date = '';
                end_date = '';
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
            $scope.query_arg['start_date'] = start_date;
            $scope.query_arg['end_date'] = end_date;
            $scope.query_arg['query_type'] = $scope.query.data.query_type;
            $scope.query_arg['query_content'] = $scope.query.data.query_content;

            $scope.loadPage();
        };
        $scope.show_orderinfo = function (order) {
            modalBox.show("query_orderinfo", {poi_id: order.id});
        };

    })
    .controller('queryOrderInfoModalCtrl', function ($scope, httpReq, args, $rootScope, modalBox, $uibModalInstance, showToast, $location) {
        httpReq('/nm2/payorderinfo/query_payorderinfo_info', {"poi_id": args.poi_id}).then(function (data) {
            $scope.orderinfo = data.result;
        });
        $scope.close = function () {
            $uibModalInstance.dismiss();
        };
    });