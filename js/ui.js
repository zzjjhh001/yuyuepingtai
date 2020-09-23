$.fn.UiSearch = function(){
    var ui = $(this);
    $(".ui-search-selected",ui).on("click",function(){
        $(".ui-search-select-list").show();
        return false;
    });
    $(".ui-search-select-list a",ui).on("click",function(){
        $(".ui-search-selected").text($(this).text());
        $(".ui-search-select-list").hide();
        return false;
    });
    $("body").on("click",function(){
        $(".ui-search-select-list").hide();
    });
}
//UI-backTop
$.fn.UiBackTop =function(){
    var ui=$(this);
    var el=$('<a class="ui-backTop" href="#0"></a>');
    ui.append(el);
    var windowHeight=$(window).height();
    $(window).on("scroll",function(){
        var top = $(document).scrollTop()*2;
        if(top>windowHeight){
            el.show();
        }else{
            el.hide();
        }
    });
    el.on("click",function(){
        $(window).scrollTop(0);
    });
};
//幻灯片
$.fn.UiSlider = function(){
    var ui = $(this);
    var wrap =$(".ui-slider-wrap");
    var btn_prev = $(".ui-slider-arrow .left",ui);
    var btn_next = $(".ui-slider-arrow .right",ui);
    var items = $(".ui-slider-wrap .item",ui);
    var tips=$(".ui-slider-process .item",ui);
    var current = 0;
    var width = items.eq(1).width();
    var mouse=true;
    //具体操作
    //左箭头
    wrap.on("move_prev",function(){
        tips.eq(current).removeClass("item_focus");
        current=current==0?3:current;
        current-=1;
        wrap.css("left",width*current*-1);
        tips.eq(current).addClass("item_focus");
    });
    //右箭头
    wrap.on("move_next",function(){
        tips.eq(current).removeClass("item_focus");
        current=current==2?-1:current;
        current+=1;
        wrap.css("left",width*current*-1);
        tips.eq(current).addClass("item_focus");
    });
    //点
    wrap.on("move_to",function(evt,index){
        tips.eq(current).removeClass("item_focus");
        wrap.css("left",width*index*-1);
        tips.eq(index).addClass("item_focus");
        current=index;
    });
    //自动滚动
    wrap.on("auto_move",function(){
        setInterval(function(){
            mouse&&wrap.triggerHandler("move_next");
        },2000);
    });
    wrap.triggerHandler("auto_move");
    //事件逻辑
    btn_prev.on("click",function(){
        wrap.triggerHandler("move_prev");
    });
    btn_next.on("click",function(){
        wrap.triggerHandler("move_next");
    });
    tips.on("click",function(){
        var index = $(this).index();
        wrap.triggerHandler("move_to",index);
    });
    ui.on("mouseover",function(){

        mouse=false;
    });
    ui.on("mouseout",function(){
        mouse=true;
    });

}
//快速查询
$.fn.UiCascading =function(){
    var ui = $(this);
    var selects = $("select",ui);
    selects
    .on("change",function(){
        var val=$(this).val();
        console.log(val);
        var index=selects.index(this);
        var where = $(this).attr("data-where");
        console.log(where);
        where =where ? where.split(',') : [];
        where.push($(this).val());
        console.log(where);
        selects.eq(index+1)
            .attr("data-where",where)
            .triggerHandler("reloadOptions");
        ui.find("select:gt("+(index+1)+")").each(function(){
            $(this)
            .attr("data-where","")
            .triggerHandler("reloadOptions");
        });
    })
    .on("reloadOptions",function(){
        var method = $(this).attr("data-search");
        var www=$(this).attr("data-where").split(",");
        var data = AjaxRemoteGetData[method].apply(this,www);
        var select = $(this);
        select.find("option").remove();
        $.each(data,function(i,item){
            var el = $("<option value="+item+">"+item+"</option>");
            select.append(el);
        });
    });
    selects.eq(0).triggerHandler("reloadOptions"); 
}
//content的点击
$.fn.UiClicker=function(){
    var ui=$(this);
    var btn = $(".content-tab .caption a");
    var yy = $(".content-tab .caption a:nth-child(1)");
    var ks = $(".content-tab .caption a:nth-child(2)");
    var caption = $(".content-tab .caption");
    var block=$(".content-tab .block");
    var keshi=$(".content-tab .keshi");
    btn.on("click",function(){
        var num=$(".content-tab .caption a").index(this);
        if(num==0){
            block.show();
            yy.addClass("item_focus");
            console.log(ks);
            keshi.hide();
            ks.removeClass("item_focus");
            return false;
        }
        block.hide();
        keshi.show();
        ks.addClass("item_focus");
        yy.removeClass("item_focus");
    });
}
$.fn.UiClicked = function(){
    var jishu = 0;
    var ui =$(this);
    var button=$(".content-tab .block .item .block-caption .block-caption-item");
    var sss=$(".content-tab .block .item .block-content");
    button.on("click",function(){
        sss.eq(jishu).hide();
        button.eq(jishu).removeClass("block-caption-item_foucs");
        sss.eq(button.index(this)).show();
        $(this).addClass("block-caption-item_foucs");
        jishu=button.index(this);
    })
}
/*脚本逻辑 */
$(function(){
    $(".ui-search").UiSearch();
    $("body").UiSearch();
    $("body").UiBackTop();
    $(".ui-slider").UiSlider();
    $(".ui-cascading").UiCascading();
    $(".content-tab").UiClicker();
    $(".content-tab .block").UiClicked();
});
