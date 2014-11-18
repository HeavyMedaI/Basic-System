/**
 * Created by musaatalay on 29.10.2014.
 */

var Application = function(e){

    var This = this;

    this.e = $(e) || {};

    this.notif = function(o){

        var Settings = o || {};

        var CallBack = Settings.callback || function(){};

        var Subtext = Settings.message.subtext || null;

        var Icon = "icon-" + Settings.icon.icon || "icon-ok-sign";

        var IconSize = "icon-" + Settings.icon.size || null;

        var IconColor =  Settings.icon.color || "green";

        var Bildirim = '<div class="notif hide"><span class="'+IconColor+' icon '+Icon+' '+IconSize+'"></span><p><strong>'+Settings.message.header+'</strong>'+Subtext+'</p></div>';

        var BildirimAlani = this.e;

        BildirimAlani.html('<div class="notif"><span style="border: none !important;" class="mini icon icon-circleselection spinning"></span><p><strong>İşleminiz yürütülüyor ...</strong>Lütfen Bekleyiniz</p></div>');

        setTimeout(function(){

            BildirimAlani.find(".notif").addClass("hide", function(){

                setTimeout(function(){

                    BildirimAlani.html(Bildirim).find("notif");

                    BildirimAlani.find(".notif").removeClass("hide");

                    return CallBack(Settings.caller);

                }, 700);

            });

        }, 1500);

    },

    this.loader = function(f){
        var _this = this;
        //var Settings = o || {};
        var CallBack = f || function(){}
        var elZindex = $(this.e).css("z-index");
        var elPosition = $(this.e).css("position");
        $(this.e).attr("data-loader", "{'type':'text/css;','z_index':'"+elZindex+"','position':'"+elPosition+"'}");
        var width = $(this.e).innerWidth();
        var height = $(this.e).innerHeight();
        var Position = "absolute";
        var icon_top = ((height-25)/2);
        var icon_left = ((width-15)/2);
        if($(this.e).prop("tagName")=="BODY"){
            Position = "fixed";
            icon_top = ((height-20/*Icon.outerHeight()*/)/2);
            icon_left = ($(this.e).offset().left+((width-20/*Icon.outerWidth()*/)/2));
        }
        $(this.e).css("overflow","hidden").css("position","relative !important");
        var Loader = $("<div/>", {
            class: "basic-loader",
            style: "position: "+Position+"; width: "+width+"px; height: "+height+"px; z-index: 999999; background-color: #eeeeee; opacity: 1; text-align: center"
        }).offset({top: 0, left: 0});
        var Icon = $("<span/>").addClass("icon icon-l icon-circleselection spinning");
        this.e.append(Loader);
        Icon.offset({top: icon_top, left: icon_left}).css("position",Position).appendTo(Loader);
        $(_this.e||window).resize(function(){
            App($(_this.e)).loader();
        });
        /*if(Settings.callback && typeof Settings.callback == "function"){
            Settings.callback(o, _this);
        } */
        if(CallBack && typeof CallBack == "function"){
            CallBack(_this);
        }
        return this;
    };

    this.out = function(x){
        var _this = this;
        _this.e.find(".basic-loader").fadeOut(2000, function(){
            data = eval("("+_this.e.data("loader")+")");
            console.info(data);
            _this.e.find(".basic-loader").remove();
            _this.e.css("position", data.position).css("z-index", data.z_index);
            $(_this.e||window).unbind("resize");
        });
    }


}

function App(p) {
    return new Application(p);
}