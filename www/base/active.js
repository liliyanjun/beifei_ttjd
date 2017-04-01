//  2016.9.19修改背景色
$(".btnbox>.btn").mousedown(function () {
    index=$(this).index();
    $(".btnbox>.btn").css({background:"#337ab7"}).eq(index-1).css({background:"#122b40"})
})
$(".btnbox2>.btn").mousedown(function () {
    index=$(this).index();
    $(".btnbox2>.btn").css({background:"#337ab7"}).eq(index-1).css({background:"#122b40"})
})
$(".btn_first").mousedown(function () {
    $(".btn_first").css({background:"#122b40"});
    $(".one_btn>.btn").css({background:"#337ab7"});
    $(".two_btn>.btn").css({background:"#337ab7"});
    $(".three_btn").css({background:"#337ab7"})
})
$(".one_btn>.btn") .mousedown(function () {
    index=$(this).index();
    $(".btn_first").css({background:"#337ab7"})
    $(".two_btn>.btn").css({background:"#337ab7"});
    $(".three_btn").css({background:"#337ab7"})
    $(".one_btn>.btn").css({background:"#337ab7"}).eq(index).css({background:"#122b40"})
})
$(".two_btn>.btn") .mousedown(function () {
    index=$(this).index();
    $(".btn_first").css({background:"#337ab7"})
    $(".one_btn>.btn").css({background:"#337ab7"});
    $(".three_btn").css({background:"#337ab7"})
    $(".two_btn>.btn").css({background:"#337ab7"}).eq(index).css({background:"#122b40"})
})
$(".three_btn").mousedown(function () {
    $(".three_btn").css({background:"#122b40"});
    $(".one_btn>.btn").css({background:"#337ab7"});
    $(".two_btn>.btn").css({background:"#337ab7"});
    $(".btn_first").css({background:"#337ab7"})
})