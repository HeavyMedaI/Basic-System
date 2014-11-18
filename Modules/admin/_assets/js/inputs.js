// ADMAX INPUT SCRIPTS & PLUGINS

// HOVER INTENT

(function(e){e.fn.hoverIntent=function(t,n,r){var i={interval:100,sensitivity:7,timeout:0};if(typeof t==="object"){i=e.extend(i,t)}else if(e.isFunction(n)){i=e.extend(i,{over:t,out:n,selector:r})}else{i=e.extend(i,{over:t,out:t,selector:n})}var s,o,u,a;var f=function(e){s=e.pageX;o=e.pageY};var l=function(t,n){n.hoverIntent_t=clearTimeout(n.hoverIntent_t);if(Math.abs(u-s)+Math.abs(a-o)<i.sensitivity){e(n).off("mousemove.hoverIntent",f);n.hoverIntent_s=1;return i.over.apply(n,[t])}else{u=s;a=o;n.hoverIntent_t=setTimeout(function(){l(t,n)},i.interval)}};var c=function(e,t){t.hoverIntent_t=clearTimeout(t.hoverIntent_t);t.hoverIntent_s=0;return i.out.apply(t,[e])};var h=function(t){var n=jQuery.extend({},t);var r=this;if(r.hoverIntent_t){r.hoverIntent_t=clearTimeout(r.hoverIntent_t)}if(t.type=="mouseenter"){u=n.pageX;a=n.pageY;e(r).on("mousemove.hoverIntent",f);if(r.hoverIntent_s!=1){r.hoverIntent_t=setTimeout(function(){l(n,r)},i.interval)}}else{e(r).off("mousemove.hoverIntent",f);if(r.hoverIntent_s==1){r.hoverIntent_t=setTimeout(function(){c(n,r)},i.timeout)}}};return this.on({"mouseenter.hoverIntent":h,"mouseleave.hoverIntent":h},i.selector)}})(jQuery);

// NANOSCROLLER

(function(c,f,g){var j,h,k,l,m;l={paneClass:"pane",sliderClass:"slider",contentClass:"scroll-cont",iOSNativeScrolling:!1,preventPageScrolling:!1,disableResize:!1,alwaysVisible:!1,flashDelay:1500,sliderMinHeight:20,sliderMaxHeight:null};j="Microsoft Internet Explorer"===f.navigator.appName&&/msie 7./i.test(f.navigator.appVersion)&&f.ActiveXObject;h=null;m=function(){var b,a;b=g.createElement("div");a=b.style;a.position="absolute";a.width="100px";a.height="100px";a.overflow="scroll";a.top="-9999px";g.body.appendChild(b);
a=b.offsetWidth-b.clientWidth;g.body.removeChild(b);return a};k=function(){function b(a,b){this.el=a;this.options=b;h||(h=m());this.$el=c(this.el);this.doc=c(g);this.win=c(f);this.generate();this.createEvents();this.addEvents();this.reset()}b.prototype.preventScrolling=function(a,b){this.isActive&&("DOMMouseScroll"===a.type?("down"===b&&0<a.originalEvent.detail||"up"===b&&0>a.originalEvent.detail)&&a.preventDefault():"mousewheel"===a.type&&a.originalEvent&&a.originalEvent.wheelDelta&&("down"===b&&
0>a.originalEvent.wheelDelta||"up"===b&&0<a.originalEvent.wheelDelta)&&a.preventDefault())};b.prototype.updateScrollValues=function(){var a;a=this.content[0];this.maxScrollTop=a.scrollHeight-a.clientHeight;this.contentScrollTop=a.scrollTop;this.maxSliderTop=this.paneHeight-this.sliderHeight;this.sliderTop=this.contentScrollTop*this.maxSliderTop/this.maxScrollTop};b.prototype.createEvents=function(){var a=this;this.events={down:function(b){a.isBeingDragged=!0;a.offsetY=b.pageY-a.slider.offset().top;
a.pane.addClass("active");a.doc.bind("mousemove",a.events.drag).bind("mouseup",a.events.up);return!1},drag:function(b){a.sliderY=b.pageY-a.$el.offset().top-a.offsetY;a.scroll();a.updateScrollValues();a.contentScrollTop>=a.maxScrollTop?a.$el.trigger("scrollend"):0===a.contentScrollTop&&a.$el.trigger("scrolltop");return!1},up:function(){a.isBeingDragged=!1;a.pane.removeClass("active");a.doc.unbind("mousemove",a.events.drag).unbind("mouseup",a.events.up);return!1},resize:function(){a.reset()},panedown:function(b){a.sliderY=
(b.offsetY||b.originalEvent.layerY)-0.5*a.sliderHeight;a.scroll();a.events.down(b);return!1},scroll:function(b){a.isBeingDragged||(a.updateScrollValues(),a.sliderY=a.sliderTop,a.slider.css({top:a.sliderTop}),null!=b&&(a.contentScrollTop>=a.maxScrollTop?(a.options.preventPageScrolling&&a.preventScrolling(b,"down"),a.$el.trigger("scrollend")):0===a.contentScrollTop&&(a.options.preventPageScrolling&&a.preventScrolling(b,"up"),a.$el.trigger("scrolltop"))))},wheel:function(b){if(null!=b)return a.sliderY+=
-b.wheelDeltaY||-b.delta,a.scroll(),!1}}};b.prototype.addEvents=function(){var a;this.removeEvents();a=this.events;this.options.disableResize||this.win.bind("resize",a.resize);this.slider.bind("mousedown",a.down);this.pane.bind("mousedown",a.panedown).bind("mousewheel DOMMouseScroll",a.wheel);this.content.bind("scroll mousewheel DOMMouseScroll touchmove",a.scroll)};b.prototype.removeEvents=function(){var a;a=this.events;this.win.unbind("resize",a.resize);this.slider.unbind();this.pane.unbind();this.content.unbind("scroll mousewheel DOMMouseScroll touchmove",
a.scroll).unbind("keydown",a.keydown).unbind("keyup",a.keyup)};b.prototype.generate=function(){var a,b,i,c,d;i=this.options;c=i.paneClass;d=i.sliderClass;a=i.contentClass;!this.$el.find(""+c).length&&!this.$el.find(""+d).length&&this.$el.append('<div class="'+c+'"><div class="'+d+'" /></div>');this.content=this.$el.children("."+a);this.content.attr("tabindex",0);this.slider=this.$el.find("."+d);this.pane=this.$el.find("."+c);h&&(b={right:-h},this.$el.addClass("has-scrollbar"));i.iOSNativeScrolling&&
(null==b&&(b={}),b.WebkitOverflowScrolling="touch");null!=b&&this.content.css(b);i.alwaysVisible&&this.pane.css({opacity:1,visibility:"visible"});return this};b.prototype.restore=function(){this.stopped=!1;this.pane.show();return this.addEvents()};b.prototype.reset=function(){var a,b,c,f,d,g,e;this.$el.find("."+this.options.paneClass).length||this.generate().stop();this.stopped&&this.restore();a=this.content[0];c=a.style;f=c.overflowY;j&&this.content.css({height:this.content.height()});b=a.scrollHeight+
h;g=this.pane.outerHeight();e=parseInt(this.pane.css("top"),10);d=parseInt(this.pane.css("bottom"),10);d=g+e+d;e=Math.round(d/b*d);e<this.options.sliderMinHeight?e=this.options.sliderMinHeight:null!=this.options.sliderMaxHeight&&e>this.options.sliderMaxHeight&&(e=this.options.sliderMaxHeight);"scroll"===f&&"scroll"!==c.overflowX&&(e+=h);this.maxSliderTop=d-e;this.contentHeight=b;this.paneHeight=g;this.paneOuterHeight=d;this.sliderHeight=e;this.slider.height(e);this.events.scroll();this.pane.show();
this.isActive=!0;this.pane.outerHeight(!0)>=a.scrollHeight&&"scroll"!==f?(this.pane.hide(),this.isActive=!1):this.el.clientHeight===a.scrollHeight&&"scroll"===f?this.slider.hide():this.slider.show();return this};b.prototype.scroll=function(){this.sliderY=Math.max(0,this.sliderY);this.sliderY=Math.min(this.maxSliderTop,this.sliderY);this.content.scrollTop(-1*((this.paneHeight-this.contentHeight+h)*this.sliderY/this.maxSliderTop));this.slider.css({top:this.sliderY});return this};b.prototype.scrollBottom=
function(a){this.reset();this.content.scrollTop(this.contentHeight-this.content.height()-a).trigger("mousewheel");return this};b.prototype.scrollTop=function(a){this.reset();this.content.scrollTop(+a).trigger("mousewheel");return this};b.prototype.scrollTo=function(a){this.reset();a=c(a).offset().top;a>this.maxSliderTop&&(a/=this.contentHeight,this.sliderY=a*=this.maxSliderTop,this.scroll());return this};b.prototype.stop=function(){this.stopped=!0;this.removeEvents();this.pane.hide();return this};
b.prototype.flash=function(){var a=this;this.pane.addClass("flashed");setTimeout(function(){a.pane.removeClass("flashed")},this.options.flashDelay);return this};return b}();c.fn.nanoScroller=function(b){return this.each(function(){var a;if(!(a=this.nanoscroller))a=c.extend({},l),b&&"object"===typeof b&&(a=c.extend(a,b)),this.nanoscroller=a=new k(this,a);if(b&&"object"===typeof b){c.extend(a.options,b);if(b.scrollBottom)return a.scrollBottom(b.scrollBottom);if(b.scrollTop)return a.scrollTop(b.scrollTop);
if(b.scrollTo)return a.scrollTo(b.scrollTo);if("bottom"===b.scroll)return a.scrollBottom(0);if("top"===b.scroll)return a.scrollTop(0);if(b.scroll&&b.scroll instanceof c)return a.scrollTo(b.scroll);if(b.stop)return a.stop();if(b.flash)return a.flash()}return a.reset()})}})(jQuery,window,document);

// MINICOLORS COLORPICKER

jQuery&&function(e){function t(t,n){var r=e('<div class="minicolors" />'),i=e.minicolors.defaults;if(t.data("minicolors-initialized"))return;n=e.extend(!0,{},i,n);r.addClass("minicolors-theme-"+n.theme).toggleClass("minicolors-with-opacity",n.opacity);n.position!==undefined&&e.each(n.position.split(" "),function(){r.addClass("minicolors-position-"+this)});t.addClass("minicolors-input").data("minicolors-initialized",!1).data("minicolors-settings",n).prop("size",7).wrap(r).after('<div class="minicolors-panel minicolors-slider-'+n.control+'">'+'<div class="minicolors-slider">'+'<div class="minicolors-picker"></div>'+"</div>"+'<div class="minicolors-opacity-slider">'+'<div class="minicolors-picker"></div>'+"</div>"+'<div class="minicolors-grid">'+'<div class="minicolors-grid-inner"></div>'+'<div class="minicolors-picker"><div></div></div>'+"</div>"+"</div>");if(!n.inline){t.after('<span class="minicolors-swatch"><span class="minicolors-swatch-color"></span></span>');t.next(".minicolors-swatch").on("click",function(e){e.preventDefault();t.focus()})}t.parent().find(".minicolors-panel").on("selectstart",function(){return!1}).end();n.inline&&t.parent().addClass("minicolors-inline");u(t,!1);t.data("minicolors-initialized",!0)}function n(e){var t=e.parent();e.removeData("minicolors-initialized").removeData("minicolors-settings").removeProp("size").removeClass("minicolors-input");t.before(e).remove()}function r(e){var t=e.parent(),n=t.find(".minicolors-panel"),r=e.data("minicolors-settings");if(!e.data("minicolors-initialized")||e.prop("disabled")||t.hasClass("minicolors-inline")||t.hasClass("minicolors-focus"))return;i();t.addClass("minicolors-focus");n.stop(!0,!0).fadeIn(r.showSpeed,function(){r.show&&r.show.call(e.get(0))})}function i(){e(".minicolors-input").each(function(){var t=e(this),n=t.data("minicolors-settings"),r=t.parent();if(n.inline)return;r.find(".minicolors-panel").fadeOut(n.hideSpeed,function(){r.hasClass("minicolors-focus")&&n.hide&&n.hide.call(t.get(0));r.removeClass("minicolors-focus")})})}function s(e,t,n){var r=e.parents(".minicolors").find(".minicolors-input"),i=r.data("minicolors-settings"),s=e.find("[class$=-picker]"),u=e.offset().left,a=e.offset().top,f=Math.round(t.pageX-u),l=Math.round(t.pageY-a),c=n?i.animationSpeed:0,h,p,d,v;if(t.originalEvent.changedTouches){f=t.originalEvent.changedTouches[0].pageX-u;l=t.originalEvent.changedTouches[0].pageY-a}f<0&&(f=0);l<0&&(l=0);f>e.width()&&(f=e.width());l>e.height()&&(l=e.height());if(e.parent().is(".minicolors-slider-wheel")&&s.parent().is(".minicolors-grid")){h=75-f;p=75-l;d=Math.sqrt(h*h+p*p);v=Math.atan2(p,h);v<0&&(v+=Math.PI*2);if(d>75){d=75;f=75-75*Math.cos(v);l=75-75*Math.sin(v)}f=Math.round(f);l=Math.round(l)}e.is(".minicolors-grid")?s.stop(!0).animate({top:l+"px",left:f+"px"},c,i.animationEasing,function(){o(r,e)}):s.stop(!0).animate({top:l+"px"},c,i.animationEasing,function(){o(r,e)})}function o(e,t){function n(e,t){var n,r;if(!e.length||!t)return null;n=e.offset().left;r=e.offset().top;return{x:n-t.offset().left+e.outerWidth()/2,y:r-t.offset().top+e.outerHeight()/2}}var r,i,s,o,u,f,l,h=e.val(),d=e.attr("data-opacity"),v=e.parent(),g=e.data("minicolors-settings"),y=v.find(".minicolors-swatch"),b=v.find(".minicolors-grid"),w=v.find(".minicolors-slider"),E=v.find(".minicolors-opacity-slider"),S=b.find("[class$=-picker]"),x=w.find("[class$=-picker]"),T=E.find("[class$=-picker]"),N=n(S,b),C=n(x,w),k=n(T,E);if(t.is(".minicolors-grid, .minicolors-slider")){switch(g.control){case"wheel":o=b.width()/2-N.x;u=b.height()/2-N.y;f=Math.sqrt(o*o+u*u);l=Math.atan2(u,o);l<0&&(l+=Math.PI*2);if(f>75){f=75;N.x=69-75*Math.cos(l);N.y=69-75*Math.sin(l)}i=p(f/.75,0,100);r=p(l*180/Math.PI,0,360);s=p(100-Math.floor(C.y*(100/w.height())),0,100);h=m({h:r,s:i,b:s});w.css("backgroundColor",m({h:r,s:i,b:100}));break;case"saturation":r=p(parseInt(N.x*(360/b.width()),10),0,360);i=p(100-Math.floor(C.y*(100/w.height())),0,100);s=p(100-Math.floor(N.y*(100/b.height())),0,100);h=m({h:r,s:i,b:s});w.css("backgroundColor",m({h:r,s:100,b:s}));v.find(".minicolors-grid-inner").css("opacity",i/100);break;case"brightness":r=p(parseInt(N.x*(360/b.width()),10),0,360);i=p(100-Math.floor(N.y*(100/b.height())),0,100);s=p(100-Math.floor(C.y*(100/w.height())),0,100);h=m({h:r,s:i,b:s});w.css("backgroundColor",m({h:r,s:i,b:100}));v.find(".minicolors-grid-inner").css("opacity",1-s/100);break;default:r=p(360-parseInt(C.y*(360/w.height()),10),0,360);i=p(Math.floor(N.x*(100/b.width())),0,100);s=p(100-Math.floor(N.y*(100/b.height())),0,100);h=m({h:r,s:i,b:s});b.css("backgroundColor",m({h:r,s:100,b:100}))}e.val(c(h,g.letterCase))}if(t.is(".minicolors-opacity-slider")){g.opacity?d=parseFloat(1-k.y/E.height()).toFixed(2):d=1;g.opacity&&e.attr("data-opacity",d)}y.find("SPAN").css({backgroundColor:h,opacity:d});a(e,h,d)}function u(e,t){var n,r,i,s,o,u,f,l=e.parent(),d=e.data("minicolors-settings"),v=l.find(".minicolors-swatch"),y=l.find(".minicolors-grid"),b=l.find(".minicolors-slider"),w=l.find(".minicolors-opacity-slider"),E=y.find("[class$=-picker]"),S=b.find("[class$=-picker]"),x=w.find("[class$=-picker]");n=c(h(e.val(),!0),d.letterCase);n||(n=c(h(d.defaultValue,!0),d.letterCase));r=g(n);t||e.val(n);if(d.opacity){i=e.attr("data-opacity")===""?1:p(parseFloat(e.attr("data-opacity")).toFixed(2),0,1);isNaN(i)&&(i=1);e.attr("data-opacity",i);v.find("SPAN").css("opacity",i);o=p(w.height()-w.height()*i,0,w.height());x.css("top",o+"px")}v.find("SPAN").css("backgroundColor",n);switch(d.control){case"wheel":u=p(Math.ceil(r.s*.75),0,y.height()/2);f=r.h*Math.PI/180;s=p(75-Math.cos(f)*u,0,y.width());o=p(75-Math.sin(f)*u,0,y.height());E.css({top:o+"px",left:s+"px"});o=150-r.b/(100/y.height());n===""&&(o=0);S.css("top",o+"px");b.css("backgroundColor",m({h:r.h,s:r.s,b:100}));break;case"saturation":s=p(5*r.h/12,0,150);o=p(y.height()-Math.ceil(r.b/(100/y.height())),0,y.height());E.css({top:o+"px",left:s+"px"});o=p(b.height()-r.s*(b.height()/100),0,b.height());S.css("top",o+"px");b.css("backgroundColor",m({h:r.h,s:100,b:r.b}));l.find(".minicolors-grid-inner").css("opacity",r.s/100);break;case"brightness":s=p(5*r.h/12,0,150);o=p(y.height()-Math.ceil(r.s/(100/y.height())),0,y.height());E.css({top:o+"px",left:s+"px"});o=p(b.height()-r.b*(b.height()/100),0,b.height());S.css("top",o+"px");b.css("backgroundColor",m({h:r.h,s:r.s,b:100}));l.find(".minicolors-grid-inner").css("opacity",1-r.b/100);break;default:s=p(Math.ceil(r.s/(100/y.width())),0,y.width());o=p(y.height()-Math.ceil(r.b/(100/y.height())),0,y.height());E.css({top:o+"px",left:s+"px"});o=p(b.height()-r.h/(360/b.height()),0,b.height());S.css("top",o+"px");y.css("backgroundColor",m({h:r.h,s:100,b:100}))}e.data("minicolors-initialized")&&a(e,n,i)}function a(e,t,n){var r=e.data("minicolors-settings"),i=e.data("minicolors-lastChange");if(!i||i.hex!==t||i.opacity!==n){e.data("minicolors-lastChange",{hex:t,opacity:n});if(r.change)if(r.changeDelay){clearTimeout(e.data("minicolors-changeTimeout"));e.data("minicolors-changeTimeout",setTimeout(function(){r.change.call(e.get(0),t,n)},r.changeDelay))}else r.change.call(e.get(0),t,n);e.trigger("change").trigger("input")}}function f(t){var n=h(e(t).val(),!0),r=b(n),i=e(t).attr("data-opacity");if(!r)return null;i!==undefined&&e.extend(r,{a:parseFloat(i)});return r}function l(t,n){var r=h(e(t).val(),!0),i=b(r),s=e(t).attr("data-opacity");if(!i)return null;s===undefined&&(s=1);return n?"rgba("+i.r+", "+i.g+", "+i.b+", "+parseFloat(s)+")":"rgb("+i.r+", "+i.g+", "+i.b+")"}function c(e,t){return t==="uppercase"?e.toUpperCase():e.toLowerCase()}function h(e,t){e=e.replace(/[^A-F0-9]/ig,"");if(e.length!==3&&e.length!==6)return"";e.length===3&&t&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]);return"#"+e}function p(e,t,n){e<t&&(e=t);e>n&&(e=n);return e}function d(e){var t={},n=Math.round(e.h),r=Math.round(e.s*255/100),i=Math.round(e.b*255/100);if(r===0)t.r=t.g=t.b=i;else{var s=i,o=(255-r)*i/255,u=(s-o)*(n%60)/60;n===360&&(n=0);if(n<60){t.r=s;t.b=o;t.g=o+u}else if(n<120){t.g=s;t.b=o;t.r=s-u}else if(n<180){t.g=s;t.r=o;t.b=o+u}else if(n<240){t.b=s;t.r=o;t.g=s-u}else if(n<300){t.b=s;t.g=o;t.r=o+u}else if(n<360){t.r=s;t.g=o;t.b=s-u}else{t.r=0;t.g=0;t.b=0}}return{r:Math.round(t.r),g:Math.round(t.g),b:Math.round(t.b)}}function v(t){var n=[t.r.toString(16),t.g.toString(16),t.b.toString(16)];e.each(n,function(e,t){t.length===1&&(n[e]="0"+t)});return"#"+n.join("")}function m(e){return v(d(e))}function g(e){var t=y(b(e));t.s===0&&(t.h=360);return t}function y(e){var t={h:0,s:0,b:0},n=Math.min(e.r,e.g,e.b),r=Math.max(e.r,e.g,e.b),i=r-n;t.b=r;t.s=r!==0?255*i/r:0;t.s!==0?e.r===r?t.h=(e.g-e.b)/i:e.g===r?t.h=2+(e.b-e.r)/i:t.h=4+(e.r-e.g)/i:t.h=-1;t.h*=60;t.h<0&&(t.h+=360);t.s*=100/255;t.b*=100/255;return t}function b(e){e=parseInt(e.indexOf("#")>-1?e.substring(1):e,16);return{r:e>>16,g:(e&65280)>>8,b:e&255}}e.minicolors={defaults:{animationSpeed:50,animationEasing:"swing",change:null,changeDelay:0,control:"hue",defaultValue:"",hide:null,hideSpeed:100,inline:!1,letterCase:"lowercase",opacity:!1,position:"bottom right",show:null,showSpeed:100,theme:"default"}};e.extend(e.fn,{minicolors:function(s,o){switch(s){case"destroy":e(this).each(function(){n(e(this))});return e(this);case"hide":i();return e(this);case"opacity":if(o===undefined)return e(this).attr("data-opacity");e(this).each(function(){u(e(this).attr("data-opacity",o))});return e(this);case"rgbObject":return f(e(this),s==="rgbaObject");case"rgbString":case"rgbaString":return l(e(this),s==="rgbaString");case"settings":if(o===undefined)return e(this).data("minicolors-settings");e(this).each(function(){var t=e(this).data("minicolors-settings")||{};n(e(this));e(this).minicolors(e.extend(!0,t,o))});return e(this);case"show":r(e(this).eq(0));return e(this);case"value":if(o===undefined)return e(this).val();e(this).each(function(){u(e(this).val(o))});return e(this);default:s!=="create"&&(o=s);e(this).each(function(){t(e(this),o)});return e(this)}}});e(document).on("mousedown.minicolors touchstart.minicolors",function(t){e(t.target).parents().add(t.target).hasClass("minicolors")||i()}).on("mousedown.minicolors touchstart.minicolors",".minicolors-grid, .minicolors-slider, .minicolors-opacity-slider",function(t){var n=e(this);t.preventDefault();e(document).data("minicolors-target",n);s(n,t,!0)}).on("mousemove.minicolors touchmove.minicolors",function(t){var n=e(document).data("minicolors-target");n&&s(n,t)}).on("mouseup.minicolors touchend.minicolors",function(){e(this).removeData("minicolors-target")}).on("mousedown.minicolors touchstart.minicolors",".minicolors-swatch",function(t){var n=e(this).parent().find(".minicolors-input");t.preventDefault();r(n)}).on("focus.minicolors",".minicolors-input",function(){var t=e(this);if(!t.data("minicolors-initialized"))return;r(t)}).on("blur.minicolors",".minicolors-input",function(){var t=e(this),n=t.data("minicolors-settings");if(!t.data("minicolors-initialized"))return;t.val(h(t.val(),!0));t.val()===""&&t.val(h(n.defaultValue,!0));t.val(c(t.val(),n.letterCase))}).on("keydown.minicolors",".minicolors-input",function(t){var n=e(this);if(!n.data("minicolors-initialized"))return;switch(t.keyCode){case 9:i();break;case 13:case 27:i();n.blur()}}).on("keyup.minicolors",".minicolors-input",function(){var t=e(this);if(!t.data("minicolors-initialized"))return;u(t,!0)}).on("paste.minicolors",".minicolors-input",function(){var t=e(this);if(!t.data("minicolors-initialized"))return;setTimeout(function(){u(t,!0)},1)})}(jQuery);

// LIGHT OR DARK COLOR DETECT

(function(d){d.fn.lightOrDark=function(){var b,c,a;a=this.css("background-color");a.match(/^rgb/)?(a=a.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/),b=a[1],c=a[2],a=a[3]):(a=+("0x"+a.slice(1).replace(5>a.length&&/./g,"$&$&")),b=a>>16,c=a>>8&255,a&=255);127.5<Math.sqrt(0.299*b*b+0.587*a*a+0.114*c*c)?this.addClass("light").removeClass("dark"):this.addClass("dark").removeClass("light")}})(jQuery);

// CHECKBOXES & RADIOS

$.fn.checkfn = function() {
	$(this).each( function() {
		var elem = $(this),
			elemId = elem.attr('id'),
		    elemCls = elem.attr('class'),
		    elemCont = elem.offsetParent();
		if (elem.is(':checkbox') || elem.hasClass('checkbox')) { elem.hide().wrap('<div class="checkbox-cont"></div>'); elemCont = elem.parents('.checkbox-cont'); }
		if (elem.is(':radio') || elem.hasClass('radio')) { elem.hide().wrap('<div class="radio-cont"></div>'); elemCont = elem.parents('.radio-cont'); }
		if (!elem.attr('checked')) { elemCont.addClass('unchecked'); };
		if (elem.attr('disabled')) { elemCont.addClass('disabled'); };

		elemCont.addClass(elemId).addClass(elemCls);
		elemCont.append('<div class="on grad2"><span class="icon-ok"></span></div>');
	});
	$('.checkbox-cont:not(.disabled), .radio-cont:not(.disabled)').click( function() {
		var elemCont = $(this),
			elem = $(this).children('input'),
		    elemattr = elem.attr('checked');
		if (elemattr) {
		  elem.removeAttr('checked');
		  elemCont.addClass('unchecked');
		} else {
		  elem.attr('checked', 'checked');
		  elemCont.removeClass('unchecked');
		};
	});
	$('.radios .radio:not(.disabled)').click( function() {
		$(this).parents('.radios').find('.radio-cont').not(this).addClass('unchecked').children('.radio').removeAttr('checked');
	});
};

// NOTIFICATIONS

$.fn.notif = function () {
	$('.notif').click( function() {
		var notif = $(this);
		notif.removeClass('pulse glow floating');
		if (notif.children('.nt-det').length > 0 && !notif.hasClass('expanded')) {
			var detH = notif.children('.nt-det').outerHeight();
			notif.addClass('expanded').css('height', detH + 42);
		} else if (!notif.hasClass('no-coll')) {
			$(notif).addClass('hide');
			setTimeout(function() {
				notif.remove();
			}, 300);
		}
		notif.not('.no-coll').click( function() { notif.addClass('hide').removeClass('expanded').removeAttr('style'); });
	})
};

// SCROLLSPY

$.fn.scrollspy = function() {
	var lastId,
	    topMenu = $(this),
	    topMenuHeight = topMenu.outerHeight()+40,
	    menuItems = topMenu.find("a"),
	    scrollItems = menuItems.map( function() {
	      var item = $($(this).attr("href"));
	      if (item.length) { return item; }
	    });
	    if (topMenu.hasClass('vt')) topMenuHeight = 32;

	menuItems.click( function(e) {
	  var href = $(this).attr("href"),
		  contentOffset = $('#content').offset().top,
	      offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight - contentOffset + 3;
	  $('html, body').stop().animate({ scrollTop: offsetTop }, 300);
	  e.preventDefault();
	});

	$(window).scroll( function() {
		var contentOffset = $('#content').offset().top,
		    fromTop = $(this).scrollTop() + topMenuHeight + contentOffset,
		    curr = scrollItems.map(function(){ if ($(this).offset().top < fromTop) return this; }),
		    curr = curr[curr.length-1],
		    id = curr && curr.length ? curr[0].id : "";
		if (lastId !== id) {
		    lastId = id;
		    menuItems.parents('li').removeClass("active").end().filter("[href=#"+id+"]").parents('li').addClass("active");
		}                   
	})
};

// TOOLTIPS

$.fn.tooltip = function () {
	$.fn.showTooltip = function() {
		var trigger = $(this),
		    ttopt = trigger.data('ttip-opt'),
		    ttext = trigger.data('ttip');

		$('body').append('<div class="tooltip">'+ttext+'</div>');
		
		if (typeof ttopt == 'undefined') ttopt = 'top';
		if (ttopt == 'dark') ttopt = 'top dark';

    	$('body .tooltip').addClass(ttopt);
    	$('body .tooltip.left').position({ of: trigger, at: 'left-2 center', my: 'right center' }).addClass('show');

		$('body .tooltip.right').position({ of: trigger, at: 'right center', my: 'left+2 center' }).addClass('show');

		$('body .tooltip.bottom').position({ of: trigger, at: 'center bottom+2', my: 'center top' }).addClass('show');

		$('body .tooltip.top').position({ of: trigger, at: 'center top-2', my: 'center bottom' }).addClass('show');
	};
	$.fn.destroyTooltip = function() {
		$('body .tooltip').removeClass('show').remove();
	};
	$('.ttip').mouseover( function() {
		var tooltip = $(this);
		if (tooltip.attr('title') && !tooltip.data('ttip')) { tooltip.attr('data-ttip', tooltip.attr('title')); tooltip.removeAttr('title'); };
	});
	var tooltipDelay;
	$('.ttip').hoverIntent( function() {
		var tooltipTg = $(this);
		tooltipDelay = setTimeout( function() { tooltipTg.showTooltip(); }, 600);
	}, function() {
		clearTimeout(tooltipDelay);
		$(this).destroyTooltip()
	});

	$('.ttip-tg').click( function() {
		var trigger = $(this);
		trigger.toggleClass('pressed');
		if (trigger.hasClass('pressed')) {
			trigger.showTooltip();
		} else {
			trigger.destroyTooltip();
		}
	});
};

// DROPS & SELECTS

$.fn.btnDrop = function() {
	$('.drop.single button, .drop:not(.disabled) .arrow').click( function() {
		$('body').find('.drop.active').removeClass('active');
		$(this).parents('.drop').toggleClass('active').closeOnBlur();
	});
	$('.drop:not(.multiple) li').click( function() {
		$(this).addClass('sel').siblings('li').removeClass('sel');
	});
	$('.drop li:not(.disabled)').click( function() {
		$(this).parents('.drop').removeClass('active');
	});
};

$.fn.selectfn = function() {
	$('.select').each( function() {
		if (!$(this).has('.arrow')) { $(this).addClass('no-arrow') };
	});
	$('.select *').click( function(e) {
		if ($(e.target).is('.disabled, .delete, .delete *') || $(e.target).parents('.select').is('.disabled')) return;
		$('body').find('.select.active').removeClass('active');
		$(this).parents('.select').addClass('active').closeOnBlur();
	});
	$('.select:not(.multiple) li:not(.disabled)').click( function() {
		var opt = $(this),
		    optVal = opt.text(),
		    parent = opt.parents('.select'),
		    option = parent.find('.opt-sel'),
		    defVal = option.data('default-val');
		if (parent.has('.delete') && typeof defVal == 'undefined') {
			var defVal = option.html();
			option.attr('data-default-val', defVal);
		};
		$(option).html(optVal);
		$(this).addClass('sel').siblings('li').removeClass('sel');

		if (parent.has('select')) {
			var selectedIndex = opt.index(),
			    select = parent.children('select');
			    selOpt = select.find('option').eq(selectedIndex - 1);
			if (parent.hasClass('no-sel-opt')) selOpt = select.find('option').eq(selectedIndex);
			selOpt.attr('selected','selected').siblings('option').removeAttr('selected');
			select.trigger('change');
		}
	});
	$('.select.multiple li:not(.disabled)').click( function() {
		var opt = $(this),
			optVal = opt.text(),
		    optNum = opt.index(),
		    parent = opt.parents('.select'),
		    option = parent.find('.opt-sel');
		if (parent.not('.has-tags')) { parent.addClass('has-tags') };

		if (!opt.is('.used')) {
			opt.addClass('used sel');
			$(parent).append('<div class="sel-tag grad2" data-sel-trigger="'+optNum+'">'+optVal+'<span class="icon icon-remove delete"></span></div>');
		};

		if (parent.has('select')) {
			var selectedIndex = opt.index(),
			    selectedGrp = opt.data('optgroup'),
			    select = parent.children('select');
			if (selectedGrp) {
				selectedIndex = opt.data('optindex');
				select.find('optgroup').eq(selectedGrp - 1).find('option').eq(selectedIndex).attr('selected','selected');
			} else {
				select.find('option').eq(selectedIndex).attr('selected','selected');
			};
			select.trigger('change');
		};

		$('.sel-tag .delete').click( function() {
			var tag = $(this).parents('.sel-tag'),
			    trigger = tag.data('sel-trigger'),
			    triggerEl = parent.children('ul').find('li:eq('+trigger+')');
			$(tag).remove();
			triggerEl.removeClass('used sel');
			if (parent.children('.sel-tag').length < 1) { parent.removeClass('has-tags'); };
			if (parent.has('select')) {
				var optGrp = triggerEl.data('optgroup'),
				    optIndex = triggerEl.data('optindex');
				$('select', parent).find('optgroup').eq(optGrp - 1).children('option').eq(optIndex).removeAttr('selected');
			};
		});
	});
	$('.select ul').click( function(e) {
		if ($(e.target).is('.disabled, .sel-search, .sel-search *')) { return; }
		else { $(this).parents('.select').removeClass('active'); }
	});

	$('.select.multiple .delete').click( function() {
		var parent = $(this).parents('.select'),
		    option = parent.children('.opt-sel');
		parent.children('.sel-tag').remove();
		parent.removeClass('has-tags');
	    option.show();
	    parent.children('ul').find('li.used').removeClass('used sel');
	});
	$('.select:not(.multiple) .delete').click( function() {
		var defVal = $(this).siblings('.opt-sel').data('default-val'),
		    parent = $(this).parents('.select'),
		    option = parent.children('.opt-sel');
		option.html(defVal);
		parent.find('li.sel').removeClass('sel');
	});
	$('.select .delete').click( function() {
		$(this).parents('.select').find('option').removeAttr('selected');
	});
};

// SELECT TRANSFORM

$.fn.makeSelect = function() {
	$('body').find('select').not('.transformed').each( function() {
		var select = $(this),
			selectCls = select.attr('class'),
		    selectOpts = select.children('optgroup, option'),
		    selectedOpt = select.find('option:selected');

		select.wrap('<div class="drop select"></div>').hide().addClass('transformed');
		var selectPar = select.parent('.select');

		if (typeof selectCls != 'undefined') selectPar.addClass(selectCls);
		if (typeof selectedOpt != 'undefined') {
			selectedVal = selectedOpt.html();
			selectedIndex = selectedOpt.index();
			if (!selectedOpt.is(':disabled')) selectPar.addClass('no-sel-opt');
		} else {
			selectedVal = selectOpts[0].html();
			selectedIndex = 0;
		};
		selectPar.append('<ul />')
				 .append('<span class="opt-sel">'+selectedVal+'</span>');

		if (select.hasClass('has-search')) selectPar.find('ul').append('<div class="sel-search"><input type="text" class="inset" placeholder="Enter your search terms"></div>');

        $.fn.appendOption = function() {
        	var option = $(this),
	        	disabled = option.attr('disabled'),
        	    opttext = option.html();
        	if (option.is('optgroup')) opttext = $(this).attr('label');
        	var opthtml = $('<li>'+opttext+'</li>');
        	if (disabled) opthtml.addClass('disabled');
        	if (option.val() == 0 && option.is('option')) opthtml.addClass('default-val');
        	if (option.is('optgroup option')) {
        		var grpOption = $(this),
        		    optIndex = grpOption.index(),
        		    grpIndex = grpOption.parent('optgroup').index();
        		opthtml.attr('data-optgroup',grpIndex).attr('data-optindex',optIndex);
        	};
        	if (option.is('optgroup')) {
        		opthtml.addClass('sel-group disabled');
        		selectPar.children('ul').append(opthtml);
        		option.children().each( function() { $(this).appendOption(); });
	        } else { selectPar.children('ul').append(opthtml); }
        };

		selectOpts.each( function() { $(this).appendOption(); });
		selectPar.find('li').eq(selectedIndex).addClass('sel');

		if (!select.hasClass('no-arrow')) { selectPar.append('<span class="arrow">&amp;</span>'); }
		if (select.attr('disabled')) { selectPar.addClass('disabled'); }
		if (select.attr('multiple')) { selectPar.addClass('multiple'); }
		if (select.hasClass('has-delete')) selectPar.append('<button class="gray delete"><span class="icon icon-remove"></span></button>');

		selectPar.find('.delete').click( function() {
			select.find('.default-val').attr('selected','selected').siblings('option').removeAttr('selected');
		})
	})
	$.fn.selectfn();
};

$.fn.closeOnBlur = function() {
	$('body').click( function() {
		$('.drop.active').removeClass('active');
	});
	$('.drop, .sel-tag, .sel-tag *, .delete, .no-sel, .no-sel *').bind('click', function(event) {
		event.stopPropagation();
	});
};

// FORM VALIDATION

$.fn.validate = function(options) {
	var defaultOptions = {
      errorClass: 'error',
      validClass: 'valid',
      errorTip: 'input-error'
    }, errorMsg = 'This field is required';
    options = $.extend(true, defaultOptions, options);

    $.fn.hasError = function() {
    	var trigger = $(this),
    	    triggerNum = trigger.index(),
    	    position = trigger.position(),
    	    posTop = position.top + parseInt(trigger.css('marginTop')),
    	    posLeft = position.left + trigger.outerWidth(true) - 5,
    	    offPar = trigger.offsetParent();
    	if (trigger.is('.select')) { offPar = trigger; }
    	else if (trigger.is('.spinner')) { offPar = trigger.parents('.spinner-body'); triggerNum = offPar.parent('div').index(); };
    	var posRight = offPar.outerWidth() - posLeft;
    	var msgwidth = Math.round(errorMsg.length * 5.8 + 8) + 'px';
    	if (offPar.children('.'+options.errorTip+'[data-trigger="'+triggerNum+'"]').length == 0) {
    		offPar.append('<div class="'+options.errorTip+' icon-remove" style="top: '+posTop+'px; right: '+posRight+'px; width: '+msgwidth+'; display: none;" data-trigger="'+triggerNum+'"><p>'+errorMsg+'</p></div>'); $(offPar).children('.'+options.errorTip+'').fadeIn(300).tooltip();
    		$('.input-error').on('touchstart', function () { $(this).trigger('hover'); });
    	};
    	trigger.addClass(options.errorClass).removeClass(options.validClass);
    };
    $.fn.isValid = function() {
    	var trigger = $(this),
    	    triggerNum = trigger.index(),
    	    offPar = trigger.offsetParent();
    	    if (trigger.is('.select')) { offPar = trigger; }
    	    else if (trigger.is('.spinner')) { offPar = trigger.parents('.spinner-body'); triggerNum = offPar.parent('div').index(); };
    	offPar.find('.'+options.errorTip+'').each( function() {
    		if ($(this).data('trigger') == triggerNum) $(this).fadeOut(200, function() { $(this).remove() });
    	});
    	trigger.addClass(options.validClass).removeClass(options.errorClass);
    };

	$.fn.validateInput = function() {
		var input = $(this),
			inputVal = input.val(),
			valLength = inputVal.length;

        $.fn.resetInput = function() { input.isValid(); input.removeClass(options.validClass) };

		$.fn.validateRequired = function() {
			if (input.data('min')) { var minLength = input.data('min') } else { var minLength = 1 };
			if (valLength < minLength) {
				if (minLength > 1) errorMsg = 'Enter at least '+minLength+' characters';
				input.hasError();
			} else {
				input.isValid();
			};
		};
		$.fn.validateEmail = function() {
			var email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	        if (valLength > 0 && inputVal.match(email)) {
	        	input.isValid();
	        } else if (valLength == 0 && !input.hasClass('required')) {
	        	input.resetInput();
	        } else {
	        	if (valLength > 0) errorMsg = 'Not a valid e-mail address';
        		input.hasError();
	        }
		};
		$.fn.validateMatch = function() {
			var match = input.data('match');
	        input.siblings('.match').each( function() {
	        	if ($(this).data('match') == match) {
	        		var matchTarget = $(this);
	        		if (inputVal == matchTarget.val() && valLength > 0) {
	        			input.isValid(); matchTarget.isValid();
	        		} else if (valLength > 0) {
	        			errorMsg = 'These fields must match';
	        			input.hasError();
	        		} else { input.hasError(); }
	        	}
	        });
		};

        if (input.hasClass('required') && !input.hasClass('email') && !input.hasClass('match')) input.validateRequired();
		if (input.hasClass('email')) input.validateEmail();
		if (input.hasClass('match')) input.validateMatch();
	};

	$.fn.validateSelect = function() {
		var select = $(this);
		if (select.find('.sel:not(.disabled)').length > 0) {
			select.isValid();
			select.children('.arrow').show();
		} else {
			errorMsg = 'Please select an option';
			select.hasError();
			select.children('.arrow').hide();
		}
	};

	$.fn.validateCheckbox = function() {
		var chbox = $(this);
		    chboxCont = chbox.parents('.checkbox-cont');
		if (!chbox.attr('checked')) {
			chboxCont.addClass(options.errorClass).removeClass(options.validClass);
			chboxCont.addClass('ttip').attr('data-ttip','Checking this is required').attr('data-ttip-opt','dark right').tooltip();
		} else {
			chboxCont.addClass(options.validClass).removeClass(options.errorClass);
		}
	};

    $(this).each( function() {
    	var form = $(this);

    	form.find('input:not(:disabled)').each( function() {
    		var input = $(this);
    		input.keyup( function() { input.validateInput() });
    	});

    	form.find('select.required').on('change', function() {
    		var select = $(this).parents('.select');
    		select.validateSelect();
    	});

    	form.find('.spinner.required').change( function() { $(this).validateInput() });
    	form.find('.spinner.required').keyup( function() { $(this).trigger('change') });
    	form.find('.spinner-body .ui-spinner-button').click( function(event) { $(this).siblings('input.spinner.required').trigger('change'); event.preventDefault(); });

    	form.find('.checkbox-cont.required').click( function() { $(this).children('input.checkbox').validateCheckbox() });

        form.submit( function(e) {
        	var form = $(this),
	        	textInputs = 'input.required:not(:checkbox):not(:radio):not(:disabled)';
        	form.find(textInputs).each( function() { $(this).validateInput() });
        	form.find('.select.required:not(.disabled)').each( function() { $(this).validateSelect() });
        	form.find('input.checkbox.required').each( function() { $(this).validateCheckbox() });
        	var invalids = form.find('.error');
        	if (invalids.length > 0) {
        		invalids.not('.select').eq(0).focus();
        		e.preventDefault();
        		return false;
        	};
        });
    });
};

// OTHER INPUTS

$.fn.numberInp = function() {
	$('input.spinner').spinner();

	$('.number').keyup( function() {
		this.value = this.value.replace(/[^0-9]/g,'');
	});
};

$.fn.fileSel = function() {
	$('.file-sel').each( function() {
		$('input.file', this).after('<input type="text" class="file-text" value="Select a file...">');
	});
	$('input.file').change(function(e){
	  var input = $(this);
	      filename = input.val().split(/\\/).pop()
	  input.next('.file-text').val(filename);
	});
};

$.fn.gradeslider = function() {
	$(this).each( function() {
		var handle = $(this).children('.ui-slider-handle'),
		    value = $(this).slider('option','value');
		handle.append('<span class="grade">'+value+'</span>');

		var gradeEl = handle.children('.grade');
    	$(this).slider().bind('slide', function(event, ui) {
    		gradeEl.html(ui.value);
    	})
    })
};

// GENERAL INPUTS CALL

$.fn.inputs = function() {
	$.fn.notif();
	$.fn.btnDrop();
	$.fn.fileSel();
	$.fn.selectfn();
    $.fn.numberInp();
    $('select').makeSelect();
    $('.colorpicker').minicolors();
    $('.checkbox, .radio').checkfn();

    $('.inp-cont .delete, .inp-grp .delete').click( function() {
    	$(this).siblings('input').val('').focus();
    });
    $('button.toggle, .button.toggle').click( function() {
    	$(this).toggleClass('pressed');
    });
    $.fn.toggleBtn = function() { $(this).addClass('pressed').siblings('.pressed').removeClass('pressed') };
    $('.btn-radio > button, .btn-radio > .button').not('.no-tg').click( function() { $(this).toggleBtn() });
};