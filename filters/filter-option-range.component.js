/* globals angular */
(function(angular) {

	function FilterOptionRangeController() {
		this.dirtyFilters = false;
	}

	FilterOptionRangeController.prototype.$onChanges = function(changes) {
		if (typeof changes.filterOption !== 'undefined' && this.filterOption) {
			// Make sure we have "value" object
			if (typeof this.filterOption.value !== 'object' || !this.filterOption.value) {
				this.filterOption.value = {};
			}

			this.type = this.type || 'Number';
			if (this.type !== 'Date' && this.type !== 'Number') {
				throw new Error('filter-option-range can accept only `Date` and `Number` types, got: ' + this.type);
			}

			this.inputType = this.type === 'Number' ? 'number' : 'text';
		}
	};

	angular.module('viewMgrApp').component('pxboFilterOptionRange', {
		bindings: {
			type: '@',
			filterOption: '<'
		},
		controller: FilterOptionRangeController,
		templateUrl: 'filters/filter-option-range.html'
	});

})(angular);
