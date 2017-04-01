app.controller('activeUsersCtrl', function ($scope, httpReq, auth,loading, $location, localStorage, $interval, showToast, modalBox) {
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
        httpReq("/nm2/user/query_active_user", {
            start_date: $scope.start_date,
            end_date: $scope.end_date
        }).then(function (data) {
            $scope.data = data.result;
            loading.hide();
        });
    };
    $scope.query_btn(1);
});