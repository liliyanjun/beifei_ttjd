/**
 * Created by Administrator on 2016/6/22.
 */
app.controller('jieDissolutionProject', function ($scope, httpReq, auth, $location, localStorage, $interval, showToast, modalBox, showConfirm) {
        $scope.query_arg = {};
        $scope.arr =[];
//      $scope.query_time_type = 0;
//      $scope.query_project_type = 0;
        $scope.$on("pageInit", function () {
            $scope.loadPage();
        });
	
		
        $scope.$on("loadPage", function () {
        	
            $scope.pageReq("/nm2/project/query_project_v2").then(function (data) {
//              $scope.data_list = data.result;
//	            for(var i=0;i<data.result.length;i++){
//	            	console.log(i.status);
//	            }
				for(var i=0;i<data.result.length;i++){
					if(data.result[i].status == 3){
						$scope.arr.push(data.result[i]);
						console.log($scope.arr[i]);
					}
				}
            })
            
            
            
        });
        $scope.query = {};
        $scope.query.data = {
            //query_time_type: 0,
            query_type: 1
            //query_renzheng_type: 0,
            //query_project_type: -1
        };
        $scope.query_config = [
            {
                key: 'query_type',
                type: 'select',
                templateOptions: {
                    options: [{
                        "name": "项目名称",
                        "value": 1
                    }, {
                        "name": "ID",
                        "value": 2
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
        
        $scope.show_projectinfo = function (project) {
            modalBox.show("query_projectinfo", {project_id: project.id});
        };
        $scope.show_project_member = function (project) {
            modalBox.show("query_project_member", {project_id: project.id});
        };
        $scope.renzheng_project = function (project) {
            modalBox.show("renzheng_project", {project_id: project.id}).then(function (result) {
                angular.extend(project, result);
            });
        };
        $scope.log_project = function (project) {
            modalBox.show("log_project", {project_id: project.id});
        };
        $scope.recover_project = function (project) {
            showConfirm('提示', '是否确认恢复项目').then(function () {
                httpReq('/nm2/project/recover_project', {project_id: project.id}).then(function () {
                    project.status = 0;
                    showToast('恢复成功', 'success');
                });
            });
        };
    })

    .controller('queryProjectInfoModalCtrl', function ($scope, httpReq, args, $rootScope, modalBox, $uibModalInstance, showToast, $location) {
        httpReq('/nm2/project/query_projectinfo', {"project_id": args.project_id}).then(function (data) {
            $scope.projectinfo = data.result;
        });
        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

    })
    .controller('queryProjectMemberModalCtrl', function ($scope, httpReq, args, $rootScope, modalBox, $uibModalInstance, showToast, $location) {
        httpReq('/nm2/project/query_projectinfo', {"project_id": args.project_id}).then(function (data) {
            $scope.projectinfo = data.result;
        });
        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

    })

