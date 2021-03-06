/**
 * Created by fanjunwei on 16/1/24.
 */
app.filter('trust', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    }
})
    .filter('first_item', function () {
        return function (array, count) {
            if (count < array.length) {
                return array.slice(0, count)
            }
            else {
                return array;
            }
        }
    })
    .filter('filter_key', function () {
        return function (array, key, keyword) {
            if (keyword) {
                return _(array).filter(function (item) {
                    return item[key].indexOf(keyword) >= 0;
                });
            }
            else {
                return array;
            }
        }
    })
    .filter('line_br', function () {
        return function (text) {
            if (text) {
                return text.replace(/\n/g, "<br>");
            }
            else {
                return "";
            }
        }
    })
    .filter('timestamp_to_time', function (format_datetime) {
        return function (str) {

            /**
             * 时间戳转时间
             */
            return format_datetime(str);
        }
    })
    .filter('format_datetime', function (format_datetime) {
        return function (str) {

            /**
             * 格式化列表时间
             */
            return format_datetime(str);
        }
    })
    .filter('icon_default', function () {
        return function (str, id, name) {
            /**
             * 返回默认头像
             */
            if (str) {
                return str;
            }
            if (!str && id && name) {
                return base_config.base_url + "/sys/user_icon?id=" + id + "&realname=" + name;
            }

        }
    })
    .filter('file_type_icon', function (getFileTypeIcon) {
        return function (file) {
            /**
             * 返回非图片的文件类型图片
             */
            var filename = file.name;
            var filetype = "unknown";
            if (filename) {
                var index = filename.lastIndexOf(".");
                if (index !== -1) {
                    filetype = filename.substring(index, filename.length);
                }
            }
            filetype = filetype.toLowerCase().replace(/\./, '');
            if (filetype === 'png' || filetype === 'jpg' || filetype === 'gif' || filetype === 'bmp' || filetype === 'jpeg') {

                return file;
            }
            else {
                return getFileTypeIcon(filename);
            }
        }
    })
    .filter('org_manager_checker', function () {
        return function (person, org, parent_group, group) {
            /**
             * 根据person 校验用户的身份是否管理员
             */
            if (!person) {
                return false;
            }
            if (person.org_id != org.id) {
                return false;
            }
            if (person.manage_type == 1 || person.manage_type == 2) {
                return true;
            }
            if (parent_group && (person.id == parent_group.charge_id || person.id == parent_group.aide_id)) {
                return true;
            }
            if (group && (person.id == group.charge_id || person.id == group.aide_id)) {
                return true;
            }
            return false;
        }
    })
    .filter('double_time', function () {
        return function (number) {
            /**
             * 根据person 校验用户的身份是否管理员
             */
            if(number>=10){
                return number;
            }else{
                return '0'+number;
            }
        }
    })
    .filter('format_price', function () {
        return function (number, places, symbol, thousand, decimal) {
            places = !isNaN(places = Math.abs(places)) ? places : 2;
            symbol = symbol !== undefined ? symbol : "￥";
            thousand = thousand || ",";
            decimal = decimal || ".";
            var negative = number < 0 ? "-" : "",
                i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
        }
    })
    .filter('split_time', function () {
        return function (time) {
            /**
             * 时间格式 年/月/日
             */
            time =  time.split(" ")[0];
            return time;
        }
    })
    .filter('pay_type', function () {
        return function (pay_function) {
            /**
             * 支付方式
             */
            var pay_function_map;
            pay_function_map = {
                0 : " ",
                1 : "支付宝",
                2 : "他人扫码支付-微信"
            }
            pay_function = pay_function_map[pay_function];
            return pay_function;
        }
    })
    .filter('is_pay', function () {
        return function (pay) {
            /**
             * 是否支付
             */
            var pay_function_map;
            pay_function_map = {
                0 : "未支付",
                1 : "成功",
            }
            pay = pay_function_map[pay];
            return pay;
        }
    })
    .filter('pay_price', function () {
        return function (price) {
            /**
             * 分转换元
             */
             price = price/100
            return price;
        }
    })
    .filter('pay_month', function () {
        return function (month) {
            /**
             * 几个月
             */
             month = month + "个月"
            return month;
        }
    })