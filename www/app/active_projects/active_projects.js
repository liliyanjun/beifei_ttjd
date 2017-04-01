app.controller('activeProjectsCtrl', function ($scope, httpReq, auth, $location, showConfirm,localStorage, $interval,loading, showToast, modalBox) {
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
    $scope.query_btn(1);

});