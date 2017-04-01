/**
 * Created by fanjunwei on 16/4/18.
 */
app
    .controller('formlyComboxCtrl', function ($scope) {

        function run_refresh() {
            var refresh = $scope.$eval("options.templateOptions.refresh");
            if (angular.isFunction(refresh)) {
                var templateOptions = $scope.$eval("options.templateOptions");
                refresh("", templateOptions);
            }
        }

        //
        // function setTextValue() {
        //     var options = $scope.$eval("options.templateOptions.options");
        //     var value = $scope.$eval("model[options.key]");
        //     if (angular.isArray(options) && options.length > 0) {
        //         var find = _(options).find(function (item) {
        //             return item.id === value;
        //         });
        //         if (find) {
        //             $scope.textValue = find.name;
        //         }
        //         else {
        //             $scope.textValue = "";
        //         }
        //     }
        // }
        //
        // $scope.$watch("options.templateOptions.readonly", function (newValue) {
        //     if (newValue === true) {
        //         run_refresh();
        //     }
        // });
        // $scope.$watch("options.templateOptions.options", function (newValue) {
        //     setTextValue();
        // }, true);
        // $scope.$watch("model[options.key]", function (newValue) {
        //     setTextValue();
        // });
        var readonly = $scope.$eval("options.templateOptions.readonly");
        if (readonly) {
            run_refresh();
        }
        $scope.getTextValue = function (value) {
            var options = $scope.$eval("options.templateOptions.options");
            if (angular.isArray(options) && options.length > 0) {
                var find = _(options).find(function (item) {
                    return item.id === value;
                });
                if (find) {
                    return find.name;
                }
                else {
                    return "";
                }
            }
        }
    })
    .controller('formlyDatepickerCtrl', function ($scope) {
        function get_datetime(str) {
            /**
             * 获取完整时间格式
             * @type {RegExp}
             */
            if (!str || str == "") {
                return "";
            }
            var timereg = /^\d{1,2}:\d{1,2}:\d{1,2}$/;
            var datetime;
            if (timereg.test(str)) {
                datetime = moment("1970-01-01 " + str);
            }
            else {
                datetime = moment(str);
            }

            return datetime.toDate();
        }

        $scope.options.templateOptions.options = $scope.options.templateOptions.options || [];
        $scope.dateModel = {};
        $scope.dateModel.dateValue = null;
        $scope.$watch("model[options.key]", function (newValue, oldValue) {
            if (newValue != oldValue) {
                $scope.dateModel.dateValue = get_datetime(newValue);
            }
        });
        $scope.$watch("dateModel.dateValue", function (newValue, oldValue) {
            if (newValue != oldValue) {
                if (newValue) {
                    $scope.model[$scope.options.key] = moment(newValue).format("YYYY-MM-DD");
                }
                else {
                    $scope.model[$scope.options.key] = "";
                }

            }
        });
        $scope.dateModel.dateValue = get_datetime($scope.$eval("model[options.key]"));
    })
    .controller('monthSelectCtrl', function ($scope) {
        var i;
        $scope.month_select_year = [];
        $scope.month_select_year.push("");
        for (i = 2014; i < 2030; i++) {
            $scope.month_select_year.push(i);
        }
        $scope.month_select_month = [];
        for (i = 1; i <= 12; i++) {
            $scope.month_select_month.push(i);
        }

        function get_datetime(str) {
            /**
             * 获取完整时间格式
             * @type {RegExp}
             */
            if (!str || str == "") {
                return "";
            }
            var timereg = /^\d{1,2}:\d{1,2}:\d{1,2}$/;
            var datetime;
            if (timereg.test(str)) {
                datetime = moment("1970-01-01 " + str);
            }
            else {
                datetime = moment(str);
            }

            return datetime;
        }

        function format_int(value) {
            value = parseInt(value);
            if (value < 10) {
                return "0" + value;
            }
            else {
                return "" + value;
            }
        }

        $scope.options.templateOptions.options = $scope.options.templateOptions.options || [];
        $scope.monthModel = {};
        $scope.monthModel.year = null;
        $scope.monthModel.month = 1;
        $scope.$watch("model[options.key]", function (newValue, oldValue) {
            if (newValue != oldValue) {
                var date = get_datetime(newValue);

                if (date) {
                    $scope.monthModel.year = date.year();
                    $scope.monthModel.month = date.month() + 1;
                }
                else {
                    $scope.monthModel.year = "";
                }

            }
        });
        $scope.$watch("monthModel.year", function (newValue, oldValue) {
            if (newValue != oldValue) {
                var year = newValue;
                var month = $scope.monthModel.month;
                if (year && month) {
                    $scope.model[$scope.options.key] = year + "-" + format_int(month) + "-01";
                }
                else {
                    $scope.model[$scope.options.key] = "";
                }

            }
        });

        $scope.$watch("monthModel.month", function (newValue, oldValue) {
            if (newValue != oldValue) {
                var month = newValue;
                var year = $scope.monthModel.year;
                if (month && year) {
                    $scope.model[$scope.options.key] = year + "-" + format_int(month) + "-01";
                }
                else {
                    $scope.model[$scope.options.key] = "";
                }

            }
        });

        var date = get_datetime($scope.$eval("model[options.key]"));
        if (date) {
            $scope.monthModel.year = date.year();
            $scope.monthModel.month = date.month() + 1;
        }
        else {
            $scope.monthModel.year = "";
        }

    })
    .controller('cityPickerCtrl', function ($scope) {
        var i;
        $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || {};
        $scope.city_select_province = [];
        _(city_data.province_list).each(function (item) {
            // $scope.city_select_province.push({name: item.province_name, value: item.province_id});
            $scope.city_select_province.push(item);
        });

        $scope.city_select_city = [];

        $scope.options.templateOptions.options = $scope.options.templateOptions.options || [];
        $scope.cityModel = {};
        $scope.cityModel.province = 0;
        $scope.cityModel.city = null;
 
        $scope.provinceChange = function () {
            var province = $scope.$eval("model[options.key]").province;
            $scope.city_select_city = [];
            if (province) {
                var city_list = city_data.city_list;
                _(city_list).each(function (item) {
                    if (item.province_id == province.id) {
                        $scope.city_select_city.push(item);
                    }
                });
                $scope.model[$scope.options.key].city = null;
            }
            else {
                $scope.model[$scope.options.key].city = null;
            }

        };

    })
    .directive('selectOnBlur', function () {
        return {
            require: 'uiSelect',
            link: function ($scope, $element, attrs, $select) {
                var searchInput = $element.querySelectorAll('input.ui-select-search');
                if (searchInput.length !== 1) throw Error("bla");

                searchInput.on('blur', function () {
                    $scope.$apply(function () {
                        var item = $select.items[$select.activeIndex];
                        $select.select(item);
                    });
                });
                $scope.$on('$destroy', function () {
                    searchInput.off("blur");
                });
            }
        }
    });