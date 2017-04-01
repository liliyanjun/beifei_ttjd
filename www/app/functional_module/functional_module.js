/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('gongFunctionalModule', function ($scope, $rootScope, httpReq, $interval, modalBox, $location, myUserInfo, $state, showConfirm) {
    $scope.data = {};
    httpReq("/nm2/project/query_app_pre_day").then(function (data) {
        $scope.data = data.result;
    })
});
