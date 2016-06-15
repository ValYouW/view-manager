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
		// Check if the data has changed
		if (typeof changes.filter !== 'undefined' && this.filter) {
			this.inputType = this.filter && this.filter.multi ? 'checkbox' : 'radio';

			// Make sure we have valid options
			if (!angular.isArray(this.filter.options)) {
				this.filter.options = [];
			}

			// Add a "pathId" to the option which includes the filter id and option id
			for (var i = 0; i < this.filter.options.length; ++i) {
				var opt = this.filter.options[i];
				opt.pathId = this.filter.id + '_' + opt.id;
				opt.selected = opt.selected || false;
				opt.count = typeof opt.count === 'number' ? opt.count : -1;
			}

			this.filter.selected = this.filter.selected || '';
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
		if (this.filter.multi) {
			if (e.target && e.target.value === '_ALL_') {
				selection = this.filter.options.map(function(o) { o.selected = e.target.checked; return o.selected && o.id;}).filter(Boolean);
			} else {
				this.filter.indeterminate = this.isIndeterminate();
				if (!this.filter.indeterminate) {
					this.filter.selected = this.filter.options[0] && this.filter.options[0].selected;
				} else {
					this.filter.selected = false;
				}

				selection = this.filter.options.map(function(o) { return o.selected && o.id;}).filter(Boolean);
			}
		} else {
			if (this.filter.selected !== '_ALL_') {
				selection.push(this.filter.selected);
			}
		}

		if (typeof this.onChange === 'function') {
			this.onChange({id: this.filter.id, selection: selection});
		}
	};

	FilterController.prototype.isIndeterminate = function() {
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
		templateUrl: 'filters/filter-template.html'
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
