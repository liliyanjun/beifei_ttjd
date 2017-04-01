/**
 * Created by fanjunwei on 16/4/18.
 */
app
    .controller('mainCtrl', function ($scope, $rootScope, auth, $interval, modalBox, $location, myUserInfo, $state, showConfirm) {
        $scope.menus = [
            {
                title: '应用概况', icon: "glyphicon-home", sub_menus: [
                	{title: '用户概况', icon: "glyphicon-flag", state: "main.home"},
                	{title: '项目概况', icon: "glyphicon-flag", state: "main.project_show"}
                ]
            },
            {
                title: '用户中心', icon: "glyphicon-user", sub_menus: [
                {title: '注册用户', icon: "glyphicon-flag", state: "main.query_users"},
                {title: '未激活用户', icon: "glyphicon-flag", state: "main.not_active"},
                {title: '活跃用户', icon: "glyphicon-flag", state: "main.active_users"},
                {title: '用户分析', icon: "glyphicon-flag", state: "main.distribution_user"},
                {title: '留存分析', icon: "glyphicon-flag", state: "main.manage_user"},
                {title: '地域分布', icon: "glyphicon-flag", state: "main.distribution_user"},
                {title: '终端分布', icon: "glyphicon-flag", state: "main.manage_user"},
                {title: '版本分布', icon: "glyphicon-flag", state: "main.distribution_user"}

            ]
            },
            {
                title: '项目中心', icon: "glyphicon-hdd", sub_menus: [
                {title: '注册项目', icon: "glyphicon-flag", state: "main.query_projects"},
                {title: '订阅项目', icon: "glyphicon-flag", state: "main.active_projects"},
                {title: '解散项目', icon: "glyphicon-flag", state: "main.dissolution_project"},
                {title: '活跃项目', icon: "glyphicon-flag", state: "main.distribution_project"},
                {title: '项目分析', icon: "glyphicon-flag", state: "main.manage_project"},
                {title: '项目分布', icon: "glyphicon-flag", state: "main.manage_project"}

            ]
            },
            {
                title: '功能应用', icon: "glyphicon-home", sub_menus: [
                	{title: '应用模块', icon: "glyphicon-flag", state: "main.manage_user"},
                	{title: '上传数据', icon: "glyphicon-flag", state: "main.query_users"}
                ]
            },
            {
                title: '订单中心', icon: "glyphicon-euro", sub_menus: [
                {title: '订阅列表', icon: "glyphicon-flag", state: "main.query_orders"}
//              {title: '成立订单', icon: "glyphicon-flag", state: "main.query_orders"},
//              {title: '订阅明细', icon: "glyphicon-flag", state: "main.query_orders"},
//              {title: '发票开据', icon: "glyphicon-flag", state: "main.query_orders"},
//              {title: 'MRR统计', icon: "glyphicon-flag", state: "main.query_orders"},
//              {title: '客户名录', icon: "glyphicon-flag", state: "main.query_orders"}
            ]
            },
            {
                title: '管理中心', icon: "glyphicon-home", state: "main.manage_project"              
//              sub_menus: [
//              	{title: '应用模块', icon: "glyphicon-flag", state: "main.query_users"},
//              	{title: '上传数据', icon: "glyphicon-flag", state: "main.query_users"}
//              ]
            },
            {
                title: '功能应用', icon: "glyphicon-home", state: "main.manage_project"
//              sub_menus: [
//              	{title: '应用模块', icon: "glyphicon-flag", state: "main.query_users"},
//              	{title: '上传数据', icon: "glyphicon-flag", state: "main.query_users"}
//              ]
            },
            {
                title: '功能应用', icon: "glyphicon-home", state: "main.manage_project"
//              sub_menus: [
//              	{title: '应用模块', icon: "glyphicon-flag", state: "main.query_users"},
//              	{title: '上传数据', icon: "glyphicon-flag", state: "main.query_users"}
//              ]
            },
        ];
        $scope.logout = function () {
            $location.replace().path("/login");
        };
        $scope.reset_userinfo = function () {

        };
        $scope.enter_application = function () {
            $state.go("main.application");
        }

        $scope.change_password = function () {
            modalBox.show("change_password");
        }

        $scope.change_icon = function () {
            modalBox.show("change_icon");
        }

        myUserInfo.getUserInfo().then(function (data) {
            $scope.my_user_info = data;
        })


    })
    .controller('changePasswordModalCtrl', function ($scope, httpReq, args, $rootScope, modalBox, $uibModalInstance, showToast, $location) {
        $scope.init_data = {};
        $scope.model = {};
        $scope.model.data = {};
        $scope.model_config = [
            {
                key: 'oldpassword',
                type: 'input',
                templateOptions: {
                    required: true,
                    type: 'password',
                    label: '原密码',
                    placeholder: '请输入原密码'
                }
            },
            {
                key: 'newpassword',
                type: 'input',
                templateOptions: {
                    required: true,
                    type: 'password',
                    label: '新密码',
                    placeholder: '请输入新密码'
                }
            },
            {
                key: 're_password',
                type: 'input',
                templateOptions: {
                    required: true,
                    type: 'password',
                    label: '确认新密码',
                    placeholder: '请再次输入新密码'
                }
            }
        ];


        $scope.close = function () {
            $uibModalInstance.close();
        };

        $scope.save = function () {
            if ($scope.model.data.newpassword != $scope.model.data.re_password) {
                showToast('"确认新密码"与"新密码"输入不同');
            }
            var newpassword = $scope.model.data.newpassword;
            var oldpassword = $scope.model.data.oldpassword;
            httpReq("/nm2/user/change_password", {
                new_password: newpassword,
                old_password: oldpassword
            }).then(function () {
                showToast('修改成功', "success");
                $uibModalInstance.close();
                $location.replace().path("/login");
            })
        };
    })