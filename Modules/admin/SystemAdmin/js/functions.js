// ADMAX GLOBAL FUNCTIONS AND PLUGINS

// TOASTR NOTIFICATIONS

(function(n){n(["jquery"],function(n){var t=function(){var u={tapToDismiss:!0,toastClass:"toast",containerId:"toast-container",debug:!1,fadeIn:400,fadeOut:400,extendedTimeOut:1e3,iconClasses:{error:"toast-error red",info:"toast-info blue",success:"toast-success green",warning:"toast-warning orange"},iconClass:"toast-info",positionClass:"toast-top-right",timeOut:5e3,titleClass:"toast-title",messageClass:"toast-message"},f=function(n,t,u){return r({iconClass:i().iconClasses.error,message:n,optionsOverride:u,title:t})},e=function(t){var i=n("#"+t.containerId);return i.length?i:(i=n("<div/>").attr("id",t.containerId).addClass(t.positionClass),i.appendTo(n("body")),i)},i=function(){return n.extend({},u,t.options)},
o=function(n,t,u){return r({iconClass:i().iconClasses.info,message:n,optionsOverride:u,title:t})},r=function(t){var r=i(),o=t.iconClass||r.iconClass;typeof t.optionsOverride!="undefined"&&(r=n.extend(r,t.optionsOverride),o=t.optionsOverride.iconClass||o);var s=null,h=e(r),u=n("<div/>"),c=n("<div/>"),l=n("<div/>"),a={options:r,map:t};t.iconClass&&u.addClass(r.toastClass).addClass(o),t.title&&(c.append(t.title).addClass(r.titleClass),u.append(c)),t.message&&(l.append(t.message).addClass(r.messageClass),u.append(l));var f=function(){if(!(n(":focus",u).length>0)){var t=function(n){return u.fadeOut(r.fadeOut,n)},i=function(){u.is(":visible")||(u.remove(),h.children().length===0&&h.remove())};t(i)}},
v=function(){(r.timeOut>0||r.extendedTimeOut>0)&&(s=setTimeout(f,r.extendedTimeOut))},y=function(){clearTimeout(s),u.stop(!0,!0).fadeIn(r.fadeIn)};return u.hide(),h.prepend(u),u.fadeIn(r.fadeIn),r.timeOut>0&&(s=setTimeout(f,r.timeOut)),u.hover(y,v),!r.onclick&&r.tapToDismiss&&u.click(f),r.onclick&&u.click(function(){r.onclick()&&f()}),r.debug&&console&&console.log(a),u},s=function(n,t,u){return r({iconClass:i().iconClasses.success,message:n,optionsOverride:u,title:t})},h=function(n,t,u){return r({iconClass:i().iconClasses.warning,message:n,optionsOverride:u,title:t})},c=function(t){var u=i(),r=n("#"+u.containerId),f;if(t&&n(":focus",t).length===0){f=function(){t.is(":visible")||(t.remove(),
r.children().length===0&&r.remove())},t.fadeOut(u.fadeOut,f);return}r.length&&r.fadeOut(u.fadeOut,function(){r.remove()})};return{clear:c,error:f,info:o,options:{},success:s,version:"1.1.4.2",warning:h}}();return t})})(typeof define=="function"&&define.amd?define:function(n,t){typeof module!="undefined"&&module.exports?module.exports=t(require(n[0])):window.toastr=t(window.jQuery)});

// COOKIES

jQuery.cookie=function(a,b,c){if(arguments.length==0){var d=(new Date).getTime();document.cookie="__cookieprobe="+d+";path=/";return document.cookie.indexOf(d)!==-1}else if(arguments.length>1&&String(b)!=="[object Object]"){c=jQuery.extend({},c);if(b===null||b===undefined){c.expires=-1}if(typeof c.expires==="number"){var e=c.expires,f=c.expires=new Date;f.setDate(f.getDate()+e)}b=String(b);return document.cookie=[encodeURIComponent(a),"=",c.raw?b:encodeURIComponent(b),c.expires?"; expires="+c.expires.toUTCString():"",c.path?"; path="+c.path:"",c.domain?"; domain="+c.domain:"",c.secure?"; secure":""].join("")}else{c=b||{};var g,h=c.raw?function(a){return a}:decodeURIComponent;return(g=(new RegExp("(?:^|; )"+encodeURIComponent(a)+"=([^;]*)")).exec(document.cookie))?h(g[1]):null}};jQuery.storage=function(a,b){if(arguments.length==0){try{return"localStorage"in window&&window["localStorage"]!==null}catch(c){return false}}else if(arguments.length==1){return localStorage.getItem(a)}else{if(b===null){return localStorage.removeItem(a)}else{return localStorage.setItem(a,b)}}};jQuery.clearStorage=function(){localStorage.clear()};jQuery.storageKey=function(a){return localStorage.key(a)};

// BASIC FUNCTIONS

$(function() {

    // SIDEBAR COLLAPSE

    $('#coll-sidebar').click( function() {
        if ($('#wrapper').hasClass('mini')) { $('#wrapper').removeClass('mini');
        } else { $('#wrapper').addClass('mini'); };
    });

    // TOP BAR FUNCTIONS

    $('#tb-handle').click( function() {
        var topBar = $(this).parent('.top-bar');
        if (topBar.hasClass('hide')) {
            topBar.removeClass('hide');
        } else { topBar.addClass('hide'); };
    });

    $('.expand-tg').click( function() {
        var trigger = $(this);
            target = trigger.data('expand');
            par = trigger.parents('.item');
            expCont = par.find('.expand-content');
            targetEl = expCont.children(target);
        targetEl.addClass('show').siblings('.show').removeClass('show');
        par.addClass('expand');
        par.find('.coll-handle').fadeIn(300);
    });

    $.fn.collapseBarItem = function() {
    	var par = $('.top-bar').find('.item.expand');
            cont = par.find('.show');
        cont.removeClass('show');
        par.removeClass('expand');
        par.find('.coll-handle').fadeOut(300);
    };

    $('.coll-handle, #tb-handle').click( function() { $.fn.collapseBarItem(); });

    var collTime = null;
    $('.top-bar').children('.item').mouseleave( function() {
            if ($(this).hasClass('expand')) collTime = setTimeout( function() { $.fn.collapseBarItem(); }, 800);
        }).mouseenter( function() { clearTimeout(collTime); collTime = null;
    });

    // BOX COLLAPSE

    $('.box .header').click( function(e) {
        if ($(e.target).is('.header *')) { return; }
        var tgbox = $(this).parent('.box');
            tgcont = tgbox.children('.content');
        if (!tgbox.hasClass('coll-only')) {
            if (tgbox.hasClass('coll')) { tgbox.removeClass('coll'); tgcont.slideDown(500, function() { tgbox.removeClass('coll-ov'); tgcont.removeAttr('style') }); }
            else { tgbox.addClass('coll-ov'); tgcont.slideUp(300, function() { tgbox.addClass('coll') }); }
        };
    });

});

// CHAT CONVERSATION

$.fn.chat = function() {
	$('.chat-form').submit( function(e) {
    	e.preventDefault();
    	var chatBox = $(this).parents('.chat-box');
            chatCont = chatBox.find('.chat-cont');
            chatInp = $(this).children('.chat-inp');
            chatInpVal = chatInp.val();
            msgHeight = 0;
        if (chatCont.hasClass('nav-cont')) chatCont = chatCont.find('.chat-msg.show');
        var contHeight = chatCont.outerHeight();
        if (chatInpVal.length > 0) {
            var scrollTriggered = 0;
            if (chatCont.hasClass('scroll')) { chatCont = chatCont.find('.scroll-cont'); scrollTriggered = 1; };
            $(chatCont).append('<p class="sent">'+chatInpVal+'<span class="msg-info">Sent just now</span></p>').children('p').each( function() {
                msgHeight += $(this).outerHeight(true);
                if (contHeight < msgHeight && scrollTriggered == 0) { chatCont.addClass('scroll').wrapInner('<div class="scroll-cont"></div>').nanoScroller({ scroll: 'bottom' }); scrollTriggered = 1; }
                if (scrollTriggered == 1) chatCont.parent('.scroll').nanoScroller({ scroll: 'bottom' });
            });
            chatInp.val('');
	    }
	})
};

// MODAL WINDOWS

$.fn.modal = function() {
	$(this).click( function() {
		var trigger = $(this).data('modal'),
		      modId = trigger.split(' ')[0],
		      tabId = trigger.split(' ')[1],
		     target = $(modId);
		$(target).addClass('show').parents('.modal-ov').addClass('show');
        var winHeight = $(window).height(),
            modHeight = target.outerHeight() + 20;
        if (modHeight > winHeight) {
            var docHeight = $(document).height();
            $('html,body').animate({scrollTop:0},100);
            target.parents('.modal-ov').addClass('has-overflow');
            $('#wrapper > .modal-ov').css('height', docHeight);
        } else {
            target.parents('.modal-ov').removeClass('has-overflow');
        };
		$.fn.modNav = function() {
			var items = $(this).children('.mod-act').find('.mod-nav');
			$(items).children('li').click( function() {
				var navTarget = $(this).data('nav');
				$(this).addClass('sel').siblings('li').removeClass('sel');
				if ($(this).has('.unread-ind')) { $(this).children('.unread-ind').fadeOut(200); };
				$(this).parents('.mod-act').siblings('.mod-body').children(navTarget).addClass('show').siblings('.show').removeClass('show');
			});
			if ( trigger.split(' ').length > 1) {
				var navBtn = $(items).children('li[data-nav="'+tabId+'"]');
				$(navBtn).addClass('sel').siblings('li').removeClass('sel');
				$(navBtn).parents('.mod-act').siblings('.mod-body').children(tabId).addClass('show').siblings('.show').removeClass('show');
			};
		};
		if ($(target).has('.mod-nav')) { $(target).modNav() };
	});
	$('#wrapper > .modal-ov, .modal .close, .modal .close *').click( function(e) {
		if ($(e.target).is('.modal.show, .modal.show *:not(.close):not(.close *)')) return;
		$('.modal').removeClass('show').parents('.modal-ov').removeClass('show');
	});
};

// CONTENT FUNCTIONS

$.fn.tgclass = function() {
	$(this).click( function() {
		var trigger = $(this);
		triggerdata = $(trigger).data('tgcls');
		$.fn.togglefn = function () {
			var target = triggerdata.split(' ')[0];
		    targetclass = triggerdata.split(' ')[1];
			$('body').find(target).toggleClass(targetclass);
		};
		if (typeof triggerdata == 'undefined') {
			var triggerdata = $(this).find('*[data-tgcls]').data('tgcls');
			if (typeof triggerdata == 'undefined') { return false } else { $.fn.togglefn(); }; 
		} else {
			$.fn.togglefn();
		}
	})
};

$(function() {
	$('.nav-box').each( function() {
		var box = $(this);
		    menu = box.children('.nav');
            body = box.children('.nav-cont');
            actbtn = box.find('.nav-act')

		$('.nav li').click( function() {
			var parent = $(this).parents('.nav');
				trigger = $(this).data('nav');
			    target = $('#wrapper').find(trigger);
            if (!$(this).hasClass('no-sel') && !$(this).parent().hasClass('no-sel')) {
                parent.find('li.sel').removeClass('sel');
                $(this).addClass('sel');
            };
			$(target).addClass('show').siblings('.show').removeClass('show');
		});

        $('.nav-act .next').click( function() {
            var currSel = body.children('.nav-item.show');
                menuSel = menu.children('.sel');
            $(currSel).removeClass('show').next('.nav-item').addClass('show');
            $(menuSel).removeClass('sel').next('li').addClass('sel');
        });
        $('.nav-act .prev').click( function() {
            var currSel = body.children('.nav-item.show');
                menuSel = menu.children('.sel');
            $(currSel).removeClass('show').prev('.nav-item').addClass('show');
            $(menuSel).removeClass('sel').prev('li').addClass('sel');
        });

        if (actbtn.length > 0) {
            $.fn.wizardSteps = function() {
                steps = body.children('.nav-item');
                if ($(steps).first().hasClass('show')) { actbtn.find('.prev').attr('disabled','disabled') } else { actbtn.find('.prev').attr('disabled', false) };
                if ($(steps).last().hasClass('show')) { actbtn.find('.next').attr('disabled','disabled') } else { actbtn.find('.next').attr('disabled', false) };
            };
            $.fn.wizardSteps();
            $('.nav li, .nav-act .next, .nav-act .prev').click( function() {
                $.fn.wizardSteps();
                menu.find('li.complete').removeClass('complete');
                menu.find('li.sel').prevAll().addClass('complete');
            });
        }
	})
});

$.fn.accordion = function() {
	$(this).each( function() {
		var cont = $(this);
			contHeight = cont.innerHeight();
		    sections = cont.children('.section');
		    sectionHeight = sections.eq(0).outerHeight()
		    sectionsHeight = sectionHeight * sections.length;

		$.fn.expand = function() {
			var height = $(this).data('height');
			$(this).addClass('expand').css('height', height);
		}
		$.fn.collapse = function() {
			$(this).removeClass('expand').removeAttr('style');
		}

		sections.each( function() {
			var content = $(this).children('.section-content');
			if (contHeight == sectionsHeight) {
				var height = $(this).children('.section-content').outerHeight() + sectionHeight;
			} else {
				var height = contHeight - sectionsHeight + sectionHeight;
			}
			$(this).attr('data-height', height);

			if (content.outerHeight() < height - sectionHeight) {
				content.css('height', height - sectionHeight);
			} else {
				content.wrap('<div class="scroll"></div>').wrap('<div class="scroll-cont"></div>');
				content.parents('.scroll').css('height', height - sectionHeight).nanoScroller();
			}
		})
		
		sections.eq(0).expand();

		sections.click( function() {
			$(this).expand();
		    $(this).siblings('.expand').collapse();
		})
	})
};

// GLOBAL FUNCTION CALLS

$.fn.loadfns = function(specificfns) {

    // LOCALLY STORED SETTINGS

    if ($.storage() == true) {

        $('#coll-sidebar').click( function() {
            if ($('#wrapper').hasClass('mini')) { localStorage.removeItem('sidebar-mini'); } else { localStorage.setItem('sidebar-mini','1'); };
        });

        $('#tb-handle').click( function() {
            if ($(this).parent('.top-bar').hasClass('hide')) { localStorage.removeItem('topbar-hidden'); } else { localStorage.setItem('topbar-hidden','1'); };
        });

        var sidebarSize = localStorage.getItem('sidebar-mini');
            sidebarPosition = localStorage.getItem('sidebar-pos');
            topBarState = localStorage.getItem('topbar-hidden');
            userAvatar = localStorage.getItem('user-avatar');
            
        if (sidebarSize) { $('#wrapper').addClass('mini') };
        if (sidebarPosition) {
            if (sidebarPosition == 'top' || sidebarPosition == 'bottom') { $('#wrapper').addClass('sidebar-hz'); }
            $('#wrapper').addClass('sidebar-'+sidebarPosition+'');
            $('#sidebar-pos .'+sidebarPosition+'').addClass('pressed').siblings('.pressed').removeClass('pressed');
        };
        $('#sidebar-pos .left').click( function() { localStorage.removeItem('sidebar-pos'); });
        $('#sidebar-pos .top').click( function() { localStorage.setItem('sidebar-pos','top'); });
        $('#sidebar-pos .right').click( function() { localStorage.setItem('sidebar-pos','right');});
        $('#sidebar-pos .bottom').click( function() { localStorage.setItem('sidebar-pos','bottom'); });

        if (topBarState) $('.top-bar').addClass('hide');

        if (userAvatar) { $('#avatar img, #profile-av img').attr('src',userAvatar); $('#profile-av strong').text(userAvatar); };

        // COLOR SCHEME SETTINGS

        var colorScheme = localStorage.getItem('color-scheme');
            sidebarColor = localStorage.getItem('sidebar-color');
            sidebarLight = localStorage.getItem('sidebar-light');
            headerColor = localStorage.getItem('header-color');
            headerDark = localStorage.getItem('header-dark');

        if (colorScheme) $('body').addClass('dark');

        if (sidebarColor) $('#sidebar').css('background-color',sidebarColor);
        if (sidebarLight) $('#sidebar').addClass('light');

        if (headerColor) $('.box .header').css('background-color',headerColor);
        if (headerDark) $('.box:not(.mini) .header').addClass('dark');
    };

    // SAFARI VISIBILITY BUG FIX

    var browserSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor); 
    if (browserSafari) { $('#wrapper').addClass('safari-fix'); };

    /* PAGE LOAD */

    $(window).bind("load", function() {
        $('#load').fadeOut(1000);
	    // PAGE SPECIFIC FUNCTIONS TO RUN ON LOAD
        if (specificfns) { specificfns(); }
	});

    // GLOBAL FUNCTION CALLS

	$.fn.inputs();
    $('.mod-tg').modal();
    $('.chat-box').chat();
    $('.ttip').tooltip();

    // RESPONSIVE FUNCTIONS

    $.fn.resFn = function() {
        var docWidth = $(document).width(),
            docHeight = $(window).height();
        if (docWidth < 726) {
            $('#sidebar-pos button').each( function() { $(this).removeClass('pressed').attr('disabled','disabled') });
            $('#sidebar-pos-row').hide();
        } else {
            $('#sidebar-pos-row').show();
            $('#sidebar-pos button').each( function() { $(this).removeAttr('disabled') });
        }
        if (docHeight < 570) {
            if  (!$('#wrapper').hasClass('sidebar-hz')) $('#wrapper').addClass('mini');
            if (docHeight < 388) {
                $('#wrapper').removeClass('sidebar-hz sidebar-top sidebar-bottom');
            }
        } else {
            $('#wrapper').removeClass('mini');
        }
    };

    $.fn.checkTopBarHeight = function() {
        var tb = $('.top-bar');
            tbHeight = tb.outerHeight();
        if (tbHeight > 60 && !tb.is('.hide')) { tb.css('max-height',tbHeight); }
    };

    $.fn.resFn();
    $.fn.checkTopBarHeight();

    $(window).bind('resizeEnd', function() {
        $.fn.resFn();
        $.fn.checkTopBarHeight();
    });

    $(window).resize(function() {
        $('.top-bar').css('max-height','');
        if (this.resizeTO) clearTimeout(this.resizeTO);
        this.resizeTO = setTimeout(function() { $(this).trigger('resizeEnd'); }, 500);
    });
    
};