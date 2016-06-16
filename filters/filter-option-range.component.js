/* globals angular */
(function(angular) {

	function FilterOptionRangeController() {
		this.dirtyFilters = false;
	}

	angular.module('viewMgrApp').component('pxboFilterOptionRange', {
		bindings: {
			filterOption: '<'
		},
		controller: FilterOptionRangeController,
		templateUrl: 'filters/filter-'
	});

})(angular);
