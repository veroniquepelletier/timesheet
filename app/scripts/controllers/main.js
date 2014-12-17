
/**
 * @ngdoc function
 * @name timesheetApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the timesheetApp
 */
angular.module('timesheetApp')
  .controller('MainCtrl', function ($scope, $timeout, $window) {
  	var now = new Date(),
  		$calendar = $('#calendar');
  		$scope.renderingType = 0;

  		$scope.showModal = false;

	  	$scope.metacards = [{
		  		id: 'thumbnail_' + getRandomId(),
		  		title: 'quiz',
		  		start: now,
		  		end: addDays(now, 60),
		  		editable: true,
		  		color: getRandomColor(),
		  		visible: true
		  	}, {
		  		id: 'thumbnail_' + getRandomId(),
		  		title: 'scheduleEvent 1',
		  		start: now,
		  		end: addDays(now, 7),
		  		editable: true,
		  		color: getRandomColor(),
		  		visible: true
		  	}, {
		  		id: 'thumbnail_' + getRandomId(),
		  		title: 'scheduleEvent 2',
		  		start: now,
		  		end: addDays(now, 14),
		  		editable: true,
		  		color: getRandomColor(),
		  		visible: true
		  	}, {
		  		id: 'thumbnail_' + getRandomId(),
		  		title: 'scheduleEvent 3',
		  		start: addDays(now, 2),
		  		end: addDays(now, 17),
		  		editable: true,
		  		color: getRandomColor(),
		  		visible: true
		  	}];

		  	
    function initTimesheet() {
    	var events = [
			{dates: [new Date(2011, 2, 31)],
				title: "2011 Season Opener",
				section: 0, //optional
				attrs: {} // optional
			},
			{dates: [new Date(2012, 1, 29)], title: "Spring Training Begins", section: 2},
			{dates: [new Date(2012, 3, 9), new Date(2012, 3, 11)], title: "Atlanta Braves @ Houston Astros", section: 1}
			];
		// sections are represented by a background color over part of the timeline. They are optional
		var sections = [
			{dates: [new Date(2011, 2, 31), new Date(2011, 9, 28)],
			 title: "2011 MLB Season",
			 section: 0,
			 attrs: {fill: "#d4e3fd"}
			},
			{dates: [new Date(2012, 2, 28), new Date(2012, 9, 3)],
			 title: "2012 MLB Regular Season",
			 section: 1,
			 attrs: {fill: "#d4e3fd"}
			},
			{dates: [new Date(2012, 1, 29), new Date(2012, 3, 4)],
			 title: "Spring Training",
			 section: 2,
			 attrs: {fill: "#eaf0fa"}
			},
			{dates: [new Date(2012, 9, 4), new Date(2012, 9, 31)],
			 title: "2012 MLB Playoffs",
			 section: 3,
			 attrs: {fill: "#eaf0fa"}
			}
		];

		// actually creating the timeline. Also nessary
		new $window.Chronoline(document.getElementById("timesheet"), events,
    		{animated: true, sections: sections});
    	}
    

	function getRandomId() {
		return Math.floor((Math.random() * 1000) + 1);
	}

	function getRandomColor() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}

  	function addDays(date, days) {
		var newDate = new Date();
		newDate.setDate(date.getDate() + days);
    	return newDate;
	}

	function addMetacardsColor() {
		for (var i = 0; i < $scope.metacards.length; i += 1) {
			$('#' + $scope.metacards[i].id).css('color', $scope.metacards[i].color);
  		}
	}

	function initFullcalendar() {
		$calendar.fullCalendar({
		    header: {
		        left: 'prev,next today',
		        center: 'title',
		        right: 'resourceMonth'
		    },
		    
		    eventSources:  getEventSources(),

		    viewDisplay: function (/*view*/) {
		        $calendar.fullCalendar('removeEvents');
		        $calendar.fullCalendar('addEventSource', getEventSources());
		        $calendar.fullCalendar('rerenderEvents');
		    },
		    eventDragStop: function(/*event*/) {
		   	 	window.console.log('EVENT DRAG DROP');		
				if (!$scope.$$phase) {
	                $scope.$digest();
	            }
			},
			eventResize: function(event) {
				window.console.log('EVENT RESIZE');
				$scope.showModal = true;
				$scope.metacardResized = event;
				if (!$scope.$$phase) {
	                $scope.$digest();
	            }
			}
		});
	}


	function getEventSources() {
		var eventSources = [];
		for (var i = 0; i < $scope.metacards.length; i += 1) {
			if ($scope.metacards[i].visible) {
				eventSources.push($scope.metacards[i]);
			}
		}
		return eventSources;
	}

	$scope.goto = function (date) {
		$calendar.fullCalendar('gotoDate', date);
	};

	$scope.remove = function(card) {
		for (var i = 0; i < $scope.metacards.length; i += 1) {
			if (card.id === $scope.metacards[i].id) {
				$calendar.fullCalendar('removeEvents', card._id); // remove Event to fullCalendar
				$scope.metacards.splice(i, 1);
				return;	
			}
		}
	};

	$scope.toggleVisibility = function(metacard) {
		metacard.visible = !metacard.visible;
		$calendar.fullCalendar('removeEvents');
		$calendar.fullCalendar('addEventSource', getEventSources());
		$calendar.fullCalendar('rerenderEvents');
	};

	$scope.changeRendering = function (type) {
		if (type === 0) {
			// calendar
			$scope.renderingType = 0;
		} else {
			// dates
			$scope.renderingType = 1;
		}
	};

	$scope.onCloseModal = function(obj) {
		if (obj) {
			var fromValue = $('#fromValue').val(),
				untilValue = $('#untilValue').val();
			updateTime($scope.metacardResized.id, fromValue, untilValue);
		}
		$scope.showModal = false;
	};

	function updateTime(id, start, end) {
		// find the metacard with id
		var index,
			i = 0,
			newStart = start.split(":"),
			newEnd = end.split(":");

		for (i; i < $scope.metacards.length; i += 1) {
			if ($scope.metacards[i].id === id) {
				index = i;
				break;
			}
		}

		if (index) {
			// change the start time
			$scope.metacards[index].start.setHours(newStart[0]);
			$scope.metacards[index].start.setMinutes(newStart[1]);
			$scope.metacards[index].start.setSeconds(newStart[2]);
			$scope.metacards[index].end.setHours(newEnd[0]);
			$scope.metacards[index].end.setMinutes(newEnd[1]);
			$scope.metacards[index].end.setSeconds(newEnd[2]);
		}
	}

	$timeout(function () {
		initFullcalendar();
		
		initTimesheet();

		addMetacardsColor();

		$('.datepick').each(function(){
		    $(this).datepicker();
		});
	}, 300);

  });