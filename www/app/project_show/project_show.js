/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('queryProjectShow', function ($scope, $rootScope, httpReq, $interval, modalBox, $location, myUserInfo, $state, showConfirm) {
    $scope.data = {};
    $scope.j_day = j_day; 
    $scope.l_m = l_e;
    $scope.start_date = s_day;
    $scope.end_date = e_day;
	$scope.tomorrow = tomorrow;
    httpReq("/nm2/query_home_info_v3").then(function (data) {
        $scope.data = data.result;
    })
//  $scope.data3 = {};
//  httpReq("/nm2/project/query_project_v2").then(function (data3) {
//      $scope.data3 = data3.result;
//  })
});


var d = new Date();
var weekday=new Array(7);
	weekday[0]="周一";
	weekday[1]="周二";
	weekday[2]="周三";
	weekday[3]="周四";
	weekday[4]="周五";
	weekday[5]="周六";
	weekday[6]="周日";
var x = document.getElementById("demo");	
var year = d.getFullYear();
var month = d.getMonth()+1;
var day = d.getDate();
var last_day = d.getDate()-1;
var s_l_day = d.getDate()-9;
var e_l_day = s_l_day+6;
var j_day = ('('+year+'.'+month+'.'+day+' '+weekday[d.getDay()-1]+')');
var tomorrow = ('('+year+'.'+month+'.'+last_day+' '+weekday[d.getDay()-2]+')');
var day2 = d.getDate()-1;
var s_day = year+'-'+month+'-'+day2;
var e_day = year+'-'+month+'-'+day;
//console.log(s_day);

function getCountDays() {
        var curDate = new Date();
        var curMonth = curDate.getMonth()-1;
       curDate.setMonth(curMonth + 1);
       curDate.setDate(0);
       return curDate.getDate();
}

var oD = new Date();
var Y = oD.getFullYear();
var M = oD.getMonth();
var D = oD.getDate();
var l_d = D-D+1;
var ld = Y+'.'+M+'.'+l_d; //上个月初
var e_d = getCountDays();  //上月天数
var ed = Y+'.'+M+'.'+e_d;
var l_month = '('+ld+'-'+')';
var l_e = '('+ld+'-'+ed+')'; //上月

//window.onload = function(){     
//	var cells = document.getElementById('monitor3').getElementsByTagName('span');
//	var clen = cells.length;
//	var currentFirstDate;
//	var formatDate = function(date){             
//	    var year = date.getFullYear()+'.';
//	    var month = (date.getMonth()+1)+'.';
//	    var day = date.getDate();
//	    return year+month+day;
//	};
//	var addDate= function(date,n){       
//	    date.setDate(date.getDate()+n);        
//	    return date;
//	};
//	var setDate = function(date){             
//	    var week = date.getDay()+7;
//	    date = addDate(date,week*-1);
//	    currentFirstDate = new Date(date);
//	    for(var i = 0;i<clen;i++){                 
//	        cells[i].innerHTML = formatDate(i==0 ? date : addDate(date,6));
//	    }    
//	                
//	};                
//	setDate(new Date());
//	
//	var cells = document.getElementById('monitor4').getElementsByTagName('span');
//	var clen = cells.length;
//	var currentFirstDate;
//	var formatDate = function(date){             
//	    var year = date.getFullYear()+'.';
//	    var month = (date.getMonth()+1)+'.';
//	    var day = date.getDate();
//	    return year+month+day;
//	};
//	var addDate= function(date,n){       
//	    date.setDate(date.getDate()+n);        
//	    return date;
//	};
//	var setDate = function(date){             
//	    var week = date.getDay()+7;
//	    date = addDate(date,week*-1);
//	    currentFirstDate = new Date(date);
//	    for(var i = 0;i<clen;i++){                 
//	        cells[i].innerHTML = formatDate(i==0 ? date : addDate(date,6));
//	    }    
//	                
//	};                
//	setDate(new Date());
//	
//}