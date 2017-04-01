/**
 * Created by LiYanJun on 17/03/29.
 */
app.controller('homeCtrl', function ($scope, $rootScope, httpReq, $interval, modalBox, $location, myUserInfo, $state, showConfirm) {
    $scope.data = {};
    $scope.a = [];
    httpReq("/nm2/query_home_info_v5").then(function (data) {
    	
        $scope.data = data.result;
        
        if(data.result.reg_today_week == 1){
        	$scope.reg_today_week = "星期一";
        }else if(data.result.reg_today_week == 2){
        	$scope.reg_today_week = "星期二";
        }else if(data.result.reg_today_week == 3){
        	$scope.reg_today_week = "星期三";
        }else if(data.result.reg_today_week == 4){
        	$scope.reg_today_week = "星期四";
        }else if(data.result.reg_today_week == 5){
        	$scope.reg_today_week = "星期五";
        }else if(data.result.reg_today_week == 6){
        	$scope.reg_today_week = "星期六";
        }else if(data.result.reg_today_week == 0){
        	$scope.reg_today_week = "星期日";
        }
        
        if(data.result.reg_yesterday_week == 1){
        	$scope.reg_yesterday_week = "星期一";
        }else if(data.result.reg_yesterday_week == 2){
        	$scope.reg_yesterday_week = "星期二";
        }else if(data.result.reg_yesterday_week == 3){
        	$scope.reg_yesterday_week = "星期三";
        }else if(data.result.reg_yesterday_week == 4){
        	$scope.reg_yesterday_week = "星期四";
        }else if(data.result.reg_yesterday_week == 5){
        	$scope.reg_yesterday_week = "星期五";
        }else if(data.result.reg_yesterday_week == 6){
        	$scope.reg_yesterday_week = "星期六";
        }else if(data.result.reg_yesterday_week == 0){
        	$scope.reg_yesterday_week = "星期日";
        }
        
        if(data.result.active_yesterday_week == 1){
        	$scope.active_yesterday_week = "星期一";
        }else if(data.result.active_yesterday_week == 2){
        	$scope.active_yesterday_week = "星期二";
        }else if(data.result.active_yesterday_week == 3){
        	$scope.active_yesterday_week = "星期三";
        }else if(data.result.active_yesterday_week == 4){
        	$scope.active_yesterday_week = "星期四";
        }else if(data.result.active_yesterday_week == 5){
        	$scope.active_yesterday_week = "星期五";
        }else if(data.result.active_yesterday_week == 6){
        	$scope.active_yesterday_week = "星期六";
        }else if(data.result.active_yesterday_week == 0){
        	$scope.active_yesterday_week = "星期日";
        }
        
		$scope.data = data.result;
		for(var i=0;i<data.result.area_week_data.length;i++){
			console.log();
		}
		
		$scope.a = data.result.area_week_data;
		var str='';  
	    for (i in $scope.a){  
	        str+=$scope.a[i].count;  
	        str+='+';  
	    }  
	    str=str.substring(0, str.length - 1);  
		$scope.all_city_active_user = eval(str); // 全部城市用户活跃总数
//		console.log($scope.all_city_active_user);

        var ucc = [];
        var a = data.result.area_week_data;
        Array.prototype.removeRepeatAttr=function(){   //城市获取并排序
	        var tmp={},b=[],a=this; 
	        for(var i=0;i<a.length;i++){
	            if(!tmp[a[i].name]){
	                b.push(a[i]);
	                tmp[a[i].name]=!0;
	            }
	        };
	        return b;
	    }
        a=a.removeRepeatAttr();
        var e = data.result.area_week_data;
        var c=0; 
        var azz = [];
        var ann = [];
        var acc = [];
        var att = {};
        for(var i=0;i<a.length;i++){
	        ucc = a[i].name;
			$scope.v_fist = a[0].name;
			$scope.v_second = a[1].name;
			$scope.v_third = a[2].name;
			$scope.v_fouth = a[3].name;
//			$scope.v_fifth = a[4].name;
//			$scope.v_sixth = a[5].name;
//			console.log(ucc);
			acc.push(ucc);
			for(var j=0;j<e.length;j++){
				if(e[j].name == ucc){
	                c+=e[j].count; 
	           }
			}
			azz.push(c);

 		} 
        azz[0] = azz[0];
		azz[1] = azz[1]-azz[0];
		azz[2] = azz[2]-azz[1]-azz[0];
		azz[3] = azz[3]-azz[2]-azz[1]-azz[0];
//		att.push(azz);
//		console.log(att);
		console.log(acc);
		console.log(azz);
		att = acc[0]+azz[0];
		att1 = acc[1]+azz[1];
		att2 = acc[2]+azz[2];
		att3 = acc[3]+azz[3];
		att4 = acc[4]+azz[4];
		att5 = acc[5]+azz[5];
//		console.log(att2);
		var add = att+','+att1+','+att2+','+att3+','+att4+','+att5;
		console.log(add);	
		
		
		
//      $scope.v_fist_num = azz[0];
//		$scope.v_second_num = azz[1];
//		$scope.v_third_num = azz[2];
//		$scope.v_fouth_num = azz[3];
		
		
		
//		acc.push(azz[i]);
//      for(var j=0;j<a.length;j++){
//			if(a[j].name == ucc){
//              c+=a[j].count; 
//         }
//		}
//		console.log(c);
		
//      console.log(a);
//      var v = {};
//	    for(var i=0;i<a.length;i++){
////	        console.log(a[i].name)
//	        ucc = a[i].name;
//			$scope.v_fist = a[0].name;
//			$scope.v_second = a[1].name;
//			$scope.v_third = a[2].name;
//			$scope.v_fouth = a[3].name;
////			$scope.v_fifth = a[4].name;
////			$scope.v_sixth = a[5].name;
////			console.log(ucc);
//			
//			if(a[i].name == ' '){
//	        	a[i].name = '未知';
//	        }else if(a[i].name == undefined){
//	        	a[i].name == '未知';
//	        }else if(a[i].name == null){
//	        	a[i].name == '未知'
//	        }
//			
////	        var str2='';  
////		    for(o in $scope.a){
////		        if($scope.a[o].name == ucc){  	//城市个数
////		            str2+=$scope.a[o].count;
////		            str2+='+'; 
////		        }
////		    }
////		    str2=str2.substring(0, str2.length - 1);
////		    console.log(str2);
////		    console.log(eval(str2));
////		    for (var n=0;n<a[2].name;n++){
////		    	console.log(15);
////		    }
////			$scope.user_active_city_person_count = eval(str2)/$scope.all_city_active_user; 
////			console.log(typeof(eval(str2)/$scope.all_city_active_user));
	    
    })
});