
/**
 * @ngdoc function
 * @name timesheetApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the timesheetApp
 */
angular.module('timesheetApp')
  .controller('MainCtrl', function ($scope, $timeout) {
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

    function createTimesheet() {
    	new window.Timesheet('timesheet', 2009, 2015, [
		  ['2014', '12/2015', 'A freaking awesome time', 'lorem'],
		]);
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
		addMetacardsColor();
		createTimesheet();

		$('.datepick').each(function(){
		    $(this).datepicker();
		});
	}, 300);

  });