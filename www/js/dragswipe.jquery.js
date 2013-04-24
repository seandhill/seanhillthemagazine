/*

	DragSwipe Plugin 1.0
	
	Copyright (c) 2012 XOXCO, Inc
	
	Documentation for this plugin lives here:
	http://xoxco.com/projects/code/dragswipe/
	
	Licensed under the MIT license:
	http://www.opensource.org/licenses/mit-license.php

	ben@xoxco.com

*/

(function($) {
	
// store config for multiple items in here.
var CONFIGS = [];
var drag_distance = 0;

// navigate to the previous page.
$.fn.prevPage = function() {
	var options = CONFIGS[$(this).data('dragswipe_id')];
	options.current_page--;
	CONFIGS[$(this).data('dragswipe_id')] = options;

	$(this).gotoPage(options.current_page,true);
}


// navigate to the next page
$.fn.nextPage = function() {
	var options = CONFIGS[$(this).data('dragswipe_id')];
	options.current_page++;
	CONFIGS[$(this).data('dragswipe_id')] = options;

	$(this).gotoPage(options.current_page,true);
}

$.fn.currentPage = function() {
	
	var options = CONFIGS[$(this).data('dragswipe_id')];
	return options.current_page;	
}


$.fn.totalPages = function() {
	
	var options = CONFIGS[$(this).data('dragswipe_id')];
	return options.page_count;	
}


// Update the offset of the sliding element to match the drag offset.
$.fn.updateOffset = function(offset,snap) {
	
	if (snap) {
		$(this).animate({
			left: offset
		},500, /*'swing'*/ 'easeOutExpo');
		
	} else {
		$(this).css('left',offset+'px');
	}
	
}


$.fn.gotoPage = function(page,snap) {

	var options = CONFIGS[$(this).data('dragswipe_id')];
	options.current_page = page;
	if (options.current_page < 0) {
		options.current_page = 0;
	}
	if (options.current_page >= options.page_count) {
		options.current_page = options.page_count-1;
	}

	newoffset =  -(options.current_page * options.width);
	options.offset=newoffset;
//	console.log('Going to page',options.current_page,'of',options.page_count,'offset',options.offset);
	if (options.current_page_element) {
		$(options.current_page_element).html(options.current_page+1);
	}

	$(this).updateOffset(options.offset,snap);
	
}

$.fn.removeDragswipe = function() {
	this.each(function() {
		
		$(this).unbind('dragstart');
		$(this).unbind('drag');
		$(this).unbind('dragend');
		$(this).data('hammer',null);
		$(this).data('dragswipe_id',null);
		
	});
	
}


$.fn.dragswipe = function(options) {

		options = $.extend({
			offset: 0,
			turn_threshold: 0.1,
			current_page: 0			
		},options)
		this.each(function() {
		
			$(this).hammer({
				drag_vertical: false,
				swipe_time: 20
			});
			options.page_count = $(this).children('li').length;
			if (options.total_pages_element) {
				$(options.total_pages_element).html(options.page_count);
			}
			if (options.current_page_element) {
				$(options.current_page_element).html(options.current_page+1);
			}
						
			// start a drag. 
			// if we're moving left or right, set our initial distance to 0.
			$(this).bind('dragstart',function(ev) {
				if (ev.gesture.direction=='left' || ev.gesture.direction=='right') {
					drag_distance = 0;
				}
			});			
			
			// while dragging, change the dragging distance based on how far a user has dragged.
			$(this).bind('drag',function(ev) {
				if (ev.gesture.direction=='left' || ev.gesture.direction=='right') {
					drag_distance = ev.gesture.deltaX;	
					var options = CONFIGS[$(this).data('dragswipe_id')];
					$(this).updateOffset(options.offset+drag_distance);

				}
			});		

			$(this).bind('dragend',function(ev) {
				if (ev.gesture.direction=='left' || ev.gesture.direction=='right') {
					var options = CONFIGS[$(this).data('dragswipe_id')];

					if (Math.abs(drag_distance / options.width) > options.turn_threshold) {
						if (ev.gesture.direction=='left') {
							options.current_page++;
						}
						if (ev.gesture.direction=='right') {
							options.current_page--;
						}
					}
				
					// store modified options
					CONFIGS[$(this).data('dragswipe_id')] = options;
					$(this).gotoPage(options.current_page,true);

				}
			});
			
			// set the dragswipe ID used to look up config options later.
			$(this).data('dragswipe_id',CONFIGS.length);
			
			// store config options.
			CONFIGS[$(this).data('dragswipe_id')] = options;
		});
		
	}

})(jQuery);