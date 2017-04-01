/**
 * Created by fanjunwei on 15/12/19.
 */
var app = angular.module('desktop', ["ngAnimate", "ngTouch", 'ui.select', 'highcharts-ng', 'ui.tree', 'perfect_scrollbar', 'ngFileUpload', 'ui.router', "ui.bootstrap", 'desktop.services', 'directive', "infinite-scroll", "formly", "formlyBootstrap"]);
app.run(function ($rootScope, httpReq, localStorage, modalBox) {
    $rootScope.base_config = base_config;
    httpReq("/desktop/sys/sync_cookie").then(function (data) {
        localStorage.set("sessionid", data.result.sessionid);
    })

});
app.config(function ($stateProvider, $urlRouterProvider, modalBoxProvider, formlyConfigProvider, highchartsNGProvider) {

    highchartsNGProvider.lazyLoad();// will load hightcharts (and standalone framework if jquery is not present) from code.hightcharts.com

    //highchartsNGProvider.lazyLoad([highchartsNGProvider.HIGHCHART]);// you may add any additional modules and they will be loaded in the same sequence

    highchartsNGProvider.basePath("lib/highcharts/"); // change base path for scripts, default is http(s)://code.highcharts.com/

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: "app/login/login.html",
            controller: "loginCtrl"
        })
        .state('main', {
            url: '/main',
            abstract: true,
            templateUrl: "app/main/main.html",
            controller: "mainCtrl"
        })
        .state('main.home', {
            url: '/home',
            templateUrl: "app/home/home.html",
            controller: "homeCtrl"
        })
        .state('main.query_users', {
            url: '/query_users',
            templateUrl: "app/query_users/query_users.html",
            controller: "queryUsersCtrl"
        })
        .state('main.active_users', {
            url: '/active_users',
            templateUrl: "app/active_users/active_users.html",
            controller: "activeUsersCtrl"
        })
        .state('main.active_projects', {
            url: '/active_projects',
            templateUrl: "app/active_projects/active_projects.html",
            controller: "activeProjectsCtrl"
        })
        .state('main.query_projects', {
            url: '/query_projects',
            templateUrl: "app/query_projects/query_projects.html",
            controller: "queryProjectsCtrl"
        })
        .state('main.test', {
            url: '/test',
            templateUrl: "app/test/test.html",
            controller: "testCtrl"
        })
        .state('main.tongji_user', {
            url: '/tongji_user',
            templateUrl: "app/tongji_user/tongji_user.html",
            controller: "tongjiUserCtrl"
        })
        .state('main.tongji_project', {
            url: '/tongji_project',
            templateUrl: "app/tongji_project/tongji_project.html",
            controller: "tongjiProjectCtrl"
        })
        .state('main.distribution_user', {
            url: '/distribution_user',
            templateUrl: "app/distribution_user/distribution_user.html",
            controller: "DistributionUserCtrl"
        })
        .state('main.distribution_project', {
            url: '/distribution_project',
            templateUrl: "app/distribution_project/distribution_project.html",
            controller: "DistributionProjectCtrl"
        })
        .state('main.manage_user', {
            url: '/manage_user',
            templateUrl: "app/manage_user/manage_user.html",
            controller: "ManageUserCtrl"
        })
        .state('main.manage_project', {
            url: '/manage_project',
            templateUrl: "app/manage_project/manage_project.html",
            controller: "ManageProjectCtrl"
        })  
        //2016-11-13  add new orders
        .state('main.query_orders', {            
            url: '/query_orders',
            templateUrl: "app/query_orders/query_orders.html",
            controller: "queryOrdersCtrl"
        })
		//2017-03-28 add 
		.state('main.project_show', {            
            url: '/project_show',
            templateUrl: "app/project_show/project_show.html",
            controller: "queryProjectShow"
       })
		.state('main.not_active', {            
            url: '/not_active',
            templateUrl: "app/not_active/not_active.html",
            controller: "userNotActive"
        })
		.state('main.dissolution_project', {            
            url: '/dissolution_project',
            templateUrl: "app/dissolution_project/dissolution_project.html",
            controller: "jieDissolutionProject"
        })
//		.state('main.functional_module', {            
//          url: '/functional_module',
//          templateUrl: "app/functional_module/functional_module.html",
//          controller: "gongFunctionalModule"
//      })
		
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var auth = $injector.get("auth");
        var loading = $injector.get('loading');
        var showMessage = $injector.get('showMessage');
        loading.delayShow();
        auth.hasLogin().then(function (has_login) {
            loading.hide();
            if (has_login) {
                $location.replace().path("/main/home");
            }
            else {
                $location.replace().path("/login");
            }

        }, function () {
            loading.hide();
            showMessage("提示", '网路异常,请稍后再试');
        })

    });

    modalBoxProvider
        .set('test', {
            templateUrl: "app/test/test_right_box.html",
            controller: "testRigthBoxCtrl",
            type: "rightBox"
        })
        .set("change_password", {
            templateUrl: "app/main/change_password_modal.html",
            controller: "changePasswordModalCtrl"
        })
        .set("query_userinfo", {
            templateUrl: "app/query_users/query_userinfo_modal.html",
            controller: "queryUserInfoModalCtrl",
            windowClass: "normal-modal-window"
        })
        .set("query_orderinfo", {
            templateUrl: "app/query_orders/query_orderinfo_modal.html",
            controller: "queryOrderInfoModalCtrl",
            windowClass: "normal-modal-window"
        })
        .set("query_projectinfo", {
            templateUrl: "app/query_projects/query_projectinfo_modal.html",
            controller: "queryProjectInfoModalCtrl",
            windowClass: "normal-modal-window"
        })
        .set("query_project_member", {
            templateUrl: "app/query_projects/query_projectmember_modal.html",
            controller: "queryProjectMemberModalCtrl",
            windowClass: "normal-modal-window"
        })
        .set("renzheng_project", {
            templateUrl: "app/manage_project/renzheng_project_modal.html",
            controller: "renzhengProjectModalCtrl"
        })
        .set("log_project", {
            templateUrl: "app/manage_project/log_project_modal.html",
            controller: "logProjectModalCtrl",
            windowClass: "large-modal-window"
        })


    formlyConfigProvider.setType({
        name: 'combox',
        templateUrl: 'form/combox.html',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        controller: "formlyComboxCtrl"
    });
    formlyConfigProvider.setType({
        name: 'datepicker',
        templateUrl: 'form/datepicker.html',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        controller: "formlyDatepickerCtrl"
    })

    formlyConfigProvider.setType({
        name: 'monthselect',
        templateUrl: 'form/month_select.html',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        controller: "monthSelectCtrl"
    })

    formlyConfigProvider.setType({
        name: 'citypicker',
        templateUrl: 'form/city_picker.html',
        wrapper: ['bootstrapLabel', 'bootstrapHasError'],
        controller: "cityPickerCtrl"
    })
});