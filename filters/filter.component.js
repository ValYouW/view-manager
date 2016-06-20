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

			// Make sure we have options object
			if (typeof this.filter.options !== 'object' || !this.filter.options) {
				this.filter.options = {};
			}

			// Normalize options
			for (var optId in this.filter.options) {
				var opt = this.filter.options[optId];

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
				for (optId in this.filter.options) {
					this.filter.options[optId].selected = e.target.checked;
					if (this.filter.options[optId].selected) { selection.push(optId); }
				}

			// A regular option checkbox
			} else {
				// If not all checkboxes are the same it is necessarily mean that the "ALL" checkbox is not selected
				if (this.isIndeterminate()) {
					this.filter.selected = false;

				// All checkboxes are the same, set the "ALL" checkbox to be like them
				} else {
					this.filter.selected = this.filter.options[0] && this.filter.options[0].selected;
				}

				for (optId in this.filter.options) {
					if (this.filter.options[optId].selected) { selection.push(optId); }
				}
			}

		// Radios
		} else {
			// Need to update the selected option properties according to the radio selection (which is saved on this.filter.selected)
			for (optId in this.filter.options) {
				this.filter.options[optId].selected = (this.filter.selected === this.filter.options[optId].id);
				if (this.filter.options[optId].selected) { selection.push(optId); }
			}
		}

		if (typeof this.onChange === 'function') {
			this.onChange({id: this.filter.id, selection: selection});
		}
	};

	FilterController.prototype.isIndeterminate = function() {
		var firstSelected;
		var i = 0;
		for (var optId in this.filter.options) {
			if (i === 0) {
				firstSelected = this.filter.options[optId].selected;
				++i;
				continue;
			}

			if (this.filter.options[optId].selected !== firstSelected) {
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

	angular.module('viewMgrApp').directive('ngIndeterminate', function($compile) {
		return {
			restrict: 'A',
			link: function(scope, element, attributes) {
				scope.$watch(attributes['ngIndeterminate'], function (value) {
					element.prop('indeterminate', !!value);
				});
			}
		};
	});

})(angular);
