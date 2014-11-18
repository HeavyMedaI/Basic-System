/**
 * Created by musaatalay on 29.10.2014.
 */
var RezervasyonListener = function() {
    $(".rezervasyon-approval").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var _this = $(this);
        var Parent = $(this).parent().parent();
        var dataJSON = eval("("+Parent.data("rel")+")");
        $.post("active", {id: dataJSON.id}, function (e) {
            var responseJSON = eval(e);
            if(responseJSON.response){
                Parent.find(".durum").html('<span class="tag green">Onaylandı</span>');
                _this.css("display","none");
                $(_this).parent().find(".rezervasyon-cancel").css("display","inline-block");
            }
        });
    });
    $(".rezervasyon-cancel").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var _this = $(this);
        var Parent = $(this).parent().parent();
        var dataJSON = eval("("+Parent.data("rel")+")");
        $.post("deactive", {id: dataJSON.id}, function (e) {
            var responseJSON = eval(e);
            if(responseJSON.response){
                Parent.find(".durum").html('<span class="tag red">Onaylanmadı</span>');
                _this.css("display","none");
                $(_this).parent().find(".rezervasyon-approval").css("display","inline-block");
            }
        });
    });
    $(".rezervasyon-sil").click(function () {
        var Parent = $(this).parent().parent();
        var Data = eval("(" + Parent.data("rel") + ")");
        $(".modal-ov > .confirm-sil .text-msg").html("<strong>" + Data.name + "</strong>" + " bu kaydı silmek istediğinizden emin misiniz?");
        $(".modal-ov, .modal-ov > .confirm-sil").addClass("show");
        $(".modal-ov > .confirm-sil .yes").click(function () {
            $.post("sil", {id: Data.id}, function (e) {
                Parent.remove();
            });
        });
    });
};
var VillaListener = function(){
    $(".villa-sil").click(function(){
        var Parent = $(this).parent().parent();
        var Data = eval("(" + Parent.data("rel") + ")");
        $(".modal-ov > .confirm-sil .text-msg").html("<strong>" + Data.name + "</strong>" + " isimli villayı silmek istediğinizden emin misiniz?");
        $(".modal-ov, .modal-ov > .confirm-sil").addClass("show");
        $(".modal-ov > .confirm-sil .yes").click(function(){
            $.post("sil", {id: Data.id}, function(e){
                Parent.remove();
            });
        });
    });
    $(".villa-active").click(function(e){
        var This = $(this);
        var Parent = $(this).parent().parent();
        Parent.find(".durum").html('<span class="icon-circleselection spinning"></span>');
        var Data = eval("(" + Parent.data("rel") + ")");
        $.post("active", {id: Data.id}, function(e){
            Parent.find(".durum").html('<span class="tag green">Aktif</span>');
            This.css("display","none");
            This.parent().find(".villa-deactive").css("display","inline-block");
        });
    });
    $(".villa-deactive").click(function(){
        var This = $(this);
        var Parent = $(this).parent().parent();
        Parent.find(".durum").html('<span class="icon-circleselection spinning"></span>');
        var Data = eval("(" + Parent.data("rel") + ")");
        $.post("deactive", {id: Data.id}, function(e){
            Parent.find(".durum").html('<span class="tag red">Deaktif</span>');
            This.css("display","none");
            This.parent().find(".villa-active").css("display","inline-block");
        });
    });
}
var VillaKaydet = function(o, f){
    var Object = o || {};
    var Functions = f || {};
    var Caller = false;
    var CallerIconClasses = false;
    if(Object.Caller){
        Caller = Object.Caller
        CallerIconClasses = Caller.find(".icon").attr("class");
        Caller.attr("disabled","disabled").find(".icon").removeAttr("class").attr("class","icon icon-circleselection spinning icon-s no-mg");
    }
    var Data = $("input[type='text'], input[type='hidden'], input[type='checkbox']:checked, select, textarea").serialize() + "&active=" + $("button[name='active'].pressed").attr("value");
    console.info(Data);
    $.post("set", Data, function(e){
        var dataJSON = eval(e);
        if(dataJSON.response){
            App(".ust-kutu .bildirim-alani").notif({
                "message": {
                    "header": "Kayıt işlemi başarılı.",
                    "subtext": "Kaydedildi."
                },
                "icon": {
                    "icon": "ok-sign",
                    "color": "green",
                    "size": null
                },
                "caller": {"Caller": Caller, "iconClass": CallerIconClasses},
                "callback": function(caller){
                    var VillaID = dataJSON.insert_id;
                    $("input[type='hidden'][name='id'].villaId").val(VillaID);
                    if(caller.Caller!=false){
                        caller.Caller.removeAttr("disabled").find(".icon").removeAttr("class").attr("class", caller.iconClass);
                    }
                    //callBy.removeAttr("disabled").find(".icon").removeClass("icon-circleselection spinning").addClass("icon-ok");
                    if(Object.succes){Object.succes(VillaID, Functions);}
                }
            });
        }else{
            App(".ust-kutu .bildirim-alani").notif({
                "message": {
                    "header": "Hata: Kayıt işlemi gerçekleştirilemedi.",
                    "subtext": dataJSON.message
                },
                "icon": {
                    "icon": "lightningalt glow",
                    "color": "red",
                    "size": null
                },
                "caller": {"Caller": Caller, "iconClass": CallerIconClasses},
                "callback": function(caller){
                    if(caller.Caller!=false){
                        caller.Caller.removeAttr("disabled").find(".icon").removeAttr("class").attr("class", caller.iconClass);
                    }
                    //callBy.removeAttr("disabled").find(".icon").removeClass("icon-circleselection spinning").addClass("icon-ok");
                }
            });
        }
    });
};
var SelectThumbnail = function(f){
    var CallBack = f || function(){};
    var Element = $(".select-thumb-list").find(".scroll-cont");
    Element.empty();
    var VillaID = $("input[type='hidden'][name='id']").val();
    if(VillaID!=null&&VillaID!=false&&VillaID.length>=1){
        $.post("VillaGallery", {villa_id: VillaID}, function(e){
            if(e.length>=1){
                $(e).each(function(i,v){
                    var Child = $("<div/>",{class: "select-thumb"})
                        .data("content","{'src':'"+v.src+"','id':'"+ v.id+"'}")
                        .append('<img src="../../villa/'+v.src+'">')
                        .appendTo(Element)
                        .click(function(){
                            var _selected = $(this);
                            var Data = eval("("+$(this).data("content")+")");
                            $.post("addThumbnail", {villa_id: VillaID, thumbnail: Data.src, id: Data.id}, function(e){
                                var dataJSON = eval(e);
                                if(dataJSON.response){
                                    if($(".select-thumb").hasClass("selected")){
                                        $(".select-thumb.selected").removeClass("selected", function(){
                                            _selected.addClass("selected");
                                        });
                                    }
                                    _selected.addClass("selected");
                                }
                            });
                        });
                    if(v.selected=='true'){
                        Child.addClass("selected");
                    }
                });
            }else{
                $("<span/>")
                    .attr("style","text-align: center; font-wight: 700;")
                    .text("Hiç resim bulunamadı!")
                    .appendTo(Element);
            }
        });
    }else{
        $("<span/>")
            .attr("style","position: absolute; top: 45%; left: 21%;text-align: center; font-wight: bold; font-size: 1.4em;")
            .text("Önce villayı kaydediniz!")
            .appendTo(Element);
    }
    CallBack();
}
var DropZone = function(){
        Dropzone.options.GalleryUploader = {
            paramName: "file", // The name that will be used to transfer the file
            maxFilesize: 4, // MB
            clickable: true,
            init: function() {
                //var mockFile = { name: "Filename", size: 12345 };
                //this.emit("addedfile", { name: "Filename", size: 12345 });
                //this.emit("addedfile", { name: "Filename2", size: 12345 });
                this.on("complete", function(file) {
                    //console.info(file);
                    //console.log(this);
                    //this.fileByte = eval("("+this.files[0].xhr.responseText+")");
                    //this.fileByte = this.files;
                    // Capture the Dropzone instance as closure.
                    var _this = this;
                    // The Villa checking registered
                    VillaKaydet({
                        succes: function(VillaID, Objects){
                            // Image will be registered to database with the Villa ID after check the Villa has been registered to database.
                            /*$(Objects._this.fileByte).each(function(i,v){
                             var $_FILE = eval("("+v.xhr.responseText+")");
                             });*/
                            var $_FILE = eval("("+Objects.file.xhr.responseText+")");
                            console.info($_FILE);

                            $.post("addGallery", {villa_id: VillaID, file_name: $_FILE.fileName/*Objects.file.name*/}, function(e){
                                var dataJSON = eval(e);
                                // if the Villa has been registered
                                if(dataJSON.response){
                                    console.info("addedGallery");
                                    App(".select-thumb-list").loader(function(e){
                                        SelectThumbnail(function(){
                                            e.out();
                                        });
                                    });
                                    // Create the remove button
                                    var removeButton = Dropzone.createElement("<button class='red'><span class='icon icon-s icon-trash'></span> Resmi Sil</button>");
                                    removeButton.setAttribute("data-content","{'villa_id':'"+VillaID+"','id':'"+dataJSON.insert_id+"','name':'"+$_FILE.fileName+"'}");
                                    // Listen to the click event
                                    removeButton.addEventListener("click", function(e) {
                                        // Make sure the button click doesn't submit the form:
                                        var Caller = $(this);
                                        var iconClass = $(this).attr("class");
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // Getting the Villa ID in data attr of delete button
                                        var deleteDATA = eval("("+this.getAttribute("data-content")+")");
                                        // Remove the file preview.
                                        Objects._this.removeFile(file);
                                        // If you want to the delete the file on the server as well,
                                        // you can do the AJAX request here.
                                        // Deleting image from database.
                                        $.post("removeGallery", {villa_id: deleteDATA.villa_id, gallery_id: deleteDATA.id, file_name: $_FILE.fileName}, function(e){
                                            var dataJSON = eval(e);
                                            // if image has been deleted from database
                                            if(dataJSON.response){
                                                App(".select-thumb-list").loader(function(e){
                                                    SelectThumbnail(function(){
                                                        e.out();
                                                    });
                                                });
                                                App(".ust-kutu .bildirim-alani").notif({
                                                    "message": {
                                                        "header": "Silme işlemi başarılı.",
                                                        "subtext": "Resim silindi."
                                                    },
                                                    "icon": {
                                                        "icon": "ok-sign",
                                                        "color": "green",
                                                        "size": null
                                                    },
                                                    "caller": {"Caller": Caller, "iconClass": iconClass},
                                                    "callback": function(caller){
                                                        if(caller){
                                                            caller.Caller.removeAttr("disabled").find(".icon").removeAttr("class").attr("class", caller.iconClass);
                                                        }
                                                    }
                                                });
                                            }else{
                                                App(".ust-kutu .bildirim-alani").notif({
                                                    "message": {
                                                        "header": "Hata: Silme işlemi başarısız.",
                                                        "subtext": dataJSON.message
                                                    },
                                                    "icon": {
                                                        "icon": "lightningalt glow",
                                                        "color": "red",
                                                        "size": null
                                                    },
                                                    "caller": {"Caller": Caller, "iconClass": iconClass},
                                                    "callback": function(caller){
                                                        if(caller){
                                                            caller.Caller.removeAttr("disabled").find(".icon").removeAttr("class").attr("class", caller.iconClass);
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    });
                                    // Add the button to the file preview element.
                                    Objects.file.previewElement.appendChild(removeButton);
                                }
                            });
                        }
                    },{"_this": _this, "file": file});
                });
            }
        };
        $(".resim-sil").click(function(e){
            e.preventDefault();
            e.stopPropagation();
            var Object = $(this).parent();
            var FileName = Object.find(".dz-details").find(".dz-filename").find("span").text();
            var Caller = $(this);
            var iconClass = $(this).attr("class");
            var deleteDATA = eval("("+$(this).data("content")+")");
            $(Object).remove();
            $.post("removeGallery", {villa_id: deleteDATA.villa_id, gallery_id: deleteDATA.id, file_name: FileName}, function(e){
                var dataJSON = eval(e);
                // if image has been deleted from database
                if(dataJSON.response){
                    App(".select-thumb-list").loader(function(e){
                        SelectThumbnail(function(){
                            e.out();
                        });
                    });
                    App(".ust-kutu .bildirim-alani").notif({
                        "message": {
                            "header": "Silme işlemi başarılı.",
                            "subtext": "Resim silindi."
                        },
                        "icon": {
                            "icon": "ok-sign",
                            "color": "green",
                            "size": null
                        }
                    });
                }else{
                    App(".ust-kutu .bildirim-alani").notif({
                        "message": {
                            "header": "Hata: Silme işlemi başarısız.",
                            "subtext": dataJSON.message
                        },
                        "icon": {
                            "icon": "lightningalt glow",
                            "color": "red",
                            "size": null
                        }
                    });
                }
            });

        });
}
var CloseSelectOptions = function(o){
    var Element = $(o) || $(".drop.select.inset.no-sel-opt > ul > li");
    Element = $(".drop.select.inset.no-sel-opt > ul > li");
    Element.click(function(e){
        e.preventDefault();
        e.stopPropagation();
        if($(this).parent().parent().find("select > option:selected")){
            $(this).parent().parent().find("select > option:selected").removeAttr("selected");
            $(this).parent().parent().find("select > option").eq($(this).index()).attr("selected","selected");
        }
        $(this).parent().parent().removeClass("active");
        $(this).parent().parent().find("span").eq(0).text($(this).text());
    });
}
var OpenSelectOptions = function(o){
    var Element = $(o) || $(".drop.select.inset.no-sel-opt > span");
    Element = $(".drop.select.inset.no-sel-opt > .opt-sel");
    Element.click(function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).parent().addClass("active");
        CloseSelectOptions();
    });
}
var RezervasyonApproval = function(){



}
$(function(){
    $(".sezon-fiyat .sezon-ekle").click(function(e){
        e.preventDefault();
        e.stopPropagation();
        var SezonFiyatHTML = '<div class="row inp-cont"><label><div class="drop select required inset no-sel-opt"><select style="display: none;" name="sezon_ay[]" class="required inset transformed"><option value="1">Ocak</option><option value="2">Şubat</option><option value="3">Mart</option><option value="4">Nisan</option> <option value="5">Mayıs</option><option value="6">Haziran</option><option value="7">Temmuz</option> <option value="8">Ağustos</option><option value="9">Eylül</option><option value="10">Ekim</option><option value="11">Kasım</option><option value="12">Aralık</option></select><ul><li class="sel">Ocak</li><li>Şubat</li><li>Mart</li><li>Nisan</li><li>Mayıs</li><li>Haziran</li><li>Temmuz</li><li>Ağustos</li><li>Eylül</li><li>Ekim</li><li>Kasım</li><li>Aralık</li></ul><span class="opt-sel">Ocak</span><span class="arrow">&amp;</span></div></label> <div class="ui-spinner spinner-body"><input name="sezon_fiyat[]" value="100.00" type="text" class="required g5 spinner number ui-spinner-input" placeholder="0.00" aria-valuenow="100" autocomplete="off" role="spinbutton"><button class="ui-spinner-button ui-spinner-up up ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="icon icon-chevron-up"></span></span></button><button class="ui-spinner-button ui-spinner-down down ui-button ui-widget ui-state-default ui-button-text-only" tabindex="-1" role="button" aria-disabled="false"><span class="ui-button-text"><span class="icon icon-chevron-down"></span></span></button></div> </div>';
        $(".sezon-fiyat-list").append(SezonFiyatHTML);
        //$.fn.loadfns(function(){});
        CloseSelectOptions();
        OpenSelectOptions();
    });
    OpenSelectOptions();
});
/*App(".ust-kutu .bildirim-alani").notif();*/