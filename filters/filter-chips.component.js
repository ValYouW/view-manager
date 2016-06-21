/* globals angular */
(function(angular) {

	function FilterChipsController() {
		this.chips = [];
	}

	FilterChipsController.prototype.$onChanges = function(changes) {
		// Check if the filter has changed
		if (typeof changes.filters !== 'undefined' && this.filters) {
			for (var filterId in this.filters) {
				if (!angular.isArray(this.filters[filterId].options)) {continue;}

				var self = this;
				this.filters[filterId].options.forEach(function(opt) {
					if (opt.selected) {
						self.chips.push(self.getChipModel(self.filters[filterId], opt));
					}
				});
			}
		}
	};

	FilterChipsController.prototype.getChipModel = function(filter, filterOption) {
		var id = filter.id + '_' + filterOption.id;
		var text = (filter.text || filter.id) + ':' + (filterOption.text || filterOption.id);
		return {id: id, text: text};
	};

	angular.module('viewMgrApp').component('pxboFilterChips', {
		bindings: {
			filters: '<',
			onChange: '&'
		},
		controller: FilterChipsController,
		templateUrl: 'filters/filter-chips.html'
	});

})(angular);