"use strict";
//yes, we want to do this before the page loads
if(!!document.createElement("canvas").getContext)
    $("html").css("background-image","none");
$(document).ready(function(){
$(".nav_top").on("mouseenter", function(e){
    $(this).find(".underline").stop(true, true);
    var width = $(this).find(".underline").width();
				$(this).find(".underline").width(0);
				$(this).find(".underline").animate({
					width: '+=132%'
				}, width*3);
			});
                //$("#background").css("z-index","100");
		});