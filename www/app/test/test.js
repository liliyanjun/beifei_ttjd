/**
 * Created by fanjunwei on 16/4/18.
 */
app.controller('testCtrl', function ($scope, httpReq, auth, $location, localStorage, $interval, showToast) {

    $scope.chartConfig = {
        series: [
            {
                type: 'column', //类型：纵向柱状图
                name: '活跃度',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            },
            {
                name: '活跃度',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }
        ],
        chart: {
            type: 'bar'
        },
        title: {
            text: '活跃度'
        },
        yAxis: {
            allowDecimals: false,
            title: {
                text: ''
            }
        }, xAxis: {
            allowDecimals: false

        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    this.point.y + ' ' + this.point.name.toLowerCase();
            }
        }
    };

});