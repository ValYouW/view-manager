/* globals angular */
(function(angular) {

	function FilterController($element, $scope) {
		this.showingAll = true;
		this.optionsLimit = Infinity;
		this.collapsed = false;
		this.inputType = 'checkbox';

		var self = this;
		$element.bind('change', function(e) {
			$scope.$apply(function() {self.selectionChanged(e);});
		});
	}

	FilterController.$inject = ['$element', '$scope'];

	FilterController.prototype.$onChanges = function(changes) {
		// Check if the filter has changed
		if (typeof changes.filter !== 'undefined' && this.filter) {
			this.filter.multi = !!this.filter.multi;
			this.inputType = this.filter.multi ? 'checkbox' : 'radio';
			this.filter.dataType = this.filter.dataType || 'String';

			// Make sure we have options array
			if (!angular.isArray(this.filter.options)) {
				this.filter.options = [];
			}

			// Normalize options
			for (var i = 0; i < this.filter.options.length; ++i) {
				var opt = this.filter.options[i];

				// Use the id as text if it's missing
				opt.text = opt.text || opt.id;

				// Add a "pathId" to the option which includes the filter id and option id (to create a unique id for the input element)
				opt.pathId = this.filter.id + '_' + opt.id;
				opt.selected = opt.selected || false;
				opt.count = typeof opt.count === 'number' ? opt.count : -1;

				// If this is "radio" we need to set the Filter's selected value to the specific selected option
				if (!this.filter.multi && opt.selected) {
					this.filter.selected = opt.id;
				}
			}

			// If this is "radio" and there is no item selected we need to selected the "_ALL_" radio
			if (!this.filter.multi && !this.filter.selected) {
				this.filter.selected = '_ALL_';
			}
		}
	};

	FilterController.prototype.toggleShowAll = function() {
		this.showingAll = !this.showingAll;
		this.optionsLimit = this.showingAll ? Infinity : 1;
	};

	FilterController.prototype.toggleCollapse = function() {
		this.collapsed = !this.collapsed;
	};

	FilterController.prototype.selectionChanged = function(e) {
		var selection = [];
		var optId;

		// Checkboxes
		if (this.filter.multi) {
			// Check if this is the "ALL" checkbox
			if (e.target && e.target.value === '_ALL_') {
				// Set each option state to the "ALL" checkbox state and put it in the `selection` array if it is selected.
				selection = this.filter.options.map(function(opt) {
					opt.selected = e.target.checked;
					return opt.selected && opt.id; // If it is selected return its id, otherwise "false" which will get filtered
				}).filter(Boolean);

			// A regular option checkbox
			} else {
				// Loop over all options and put the selected ones in the `selection` array (also count how many total options we have)
				selection = this.filter.options.map(function(opt) {
					// If it is selected return its id, otherwise "false" which will get filtered
					return opt.selected && opt.id;
				}).filter(Boolean);

				// Set the "header" checkbox to true if all possible options are selected
				this.filter.selected = (selection.length === this.filter.options.length);
			}

		// Radios
		} else {
			// Need to update the selected option properties according to the radio selection (which is saved on this.filter.selected)
			var self = this;
			selection = this.filter.options.map(function(opt) {
				opt.selected = (self.filter.selected === opt.id);
				return opt.selected && opt.id; // If it is selected return its id, otherwise "false" which will get filtered
			}).filter(Boolean);
		}

		if (typeof this.onChange === 'function') {
			this.onChange({id: this.filter.id, selection: selection});
		}
	};

	FilterController.prototype.isIndeterminate = function() {
		// Check whether all options "selected" property is the same, so we compare all option's selected state to the first item
		for (var i = 1; i < this.filter.options.length; ++i) {
			if (this.filter.options[i].selected !== this.filter.options[0].selected) {
				return true;
			}
		}

		return false;
	};

	angular.module('viewMgrApp').component('pxboFilter', {
		bindings: {
			filter: '<',
			onChange: '&'
		},
		controller: FilterController,
		templateUrl: 'filters/filter.html'
	});

	angular.module('viewMgrApp').directive('ngIndeterminate', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attributes) {
				scope.$watch(attributes['ngIndeterminate'], function (value) {
					element.prop('indeterminate', !!value);
				});
			}
		};
	});

	//angular.module('viewMgrApp').filter('filterOptsToArr', function() {
	//	return function(obj, limit) {
	//		limit = (typeof limit != 'number') ? Infinity : limit;
	//		var keys = Object.keys(obj);
	//		if (keys.length < 1) {
	//			return [];
	//		}
	//
	//		var ret = [];
	//		keys.sort();
	//		for (var i = 0; i < keys.length && i < limit; ++i) {
	//			ret.push(obj[keys[i]]);
	//		}
	//
	//		return ret;
	//	};
	//});

})(angular);
