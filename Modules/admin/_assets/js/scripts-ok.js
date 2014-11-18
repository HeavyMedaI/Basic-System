/**
 * Created by musaatalay on 29.10.2014.
 */

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
}

$(function(){
    Dropzone.options.GalleryUploader = {
        paramName: "file", // The name that will be used to transfer the file
        maxFilesize: 4, // MB
        init: function() {
            //var mockFile = { name: "Filename", size: 12345 };
            //this.emit("addedfile", { name: "Filename", size: 12345 });
            //this.emit("addedfile", { name: "Filename2", size: 12345 });
            this.on("complete", function(file) {
                //console.log(file);
                //console.log(this);
                this.fileByte = eval("("+this.files[0].xhr.responseText+")");
                //console.log(this.files);
                // Capture the Dropzone instance as closure.
                var _this = this;
                // The Villa checking registered
                VillaKaydet({
                    succes: function(VillaID, Objects){
                        // Image will be registered to database with the Villa ID after check the Villa has been registered to database.
                        console.log(v.xhr.responseText);
                        $.post("addGallery", {villa_id: VillaID, file_name: _this.fileByte.fileName/*Objects.file.name*/}, function(e){
                            var dataJSON = eval(e);
                            // if the Villa has been registered
                            if(dataJSON.response){
                                // Create the remove button
                                var removeButton = Dropzone.createElement("<button class='red'>Resmi Sil</button>");
                                removeButton.setAttribute("data-content","{'villa_id':'"+VillaID+"','id':'"+dataJSON.insert_id+"'}");
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
                                    $.post("removeGallery", {villa_id: deleteDATA.villa_id, gallery_id: deleteDATA.id, file_name: Objects._this.fileByte.fileName}, function(e){
                                        var dataJSON = eval("("+e+")");
                                        // if image has been deleted from database
                                        if(dataJSON.response){
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
    /*App(".ust-kutu .bildirim-alani").notif();*/
});
