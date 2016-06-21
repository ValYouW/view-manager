/* globals angular */
(function(angular) {

	function FilterChipsController() {
		this.chips = [];
	}

	FilterChipsController.prototype.$onChanges = function(changes) {
		// Check if the filter has changed
		if (typeof changes.filters !== 'undefined' && this.filters) {
			this.chips = [];
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
		var id = filter.id + '#' + filterOption.id;
		var text = (filter.text || filter.id) + ':' + (filterOption.text || filterOption.id);
		return {id: id, text: text};
	};

	FilterChipsController.prototype.chipRemoved = function(chip) {
		if (!chip || typeof chip.id !== 'string') {
			console.error('Got a chip removed event with no chip or no string `id`, got:', chip);
			return;
		}

		var idx = chip.id.indexOf('#');
		if (idx < 0) {
			console.error('Got invalid chip id, expecting it to have underscore, got:', chip);
			return;
		}

		var filterId = chip.id.substring(0, idx);
		var optId = chip.id.substring(idx + 1);
		if (!this.filters[filterId]) {
			console.error('Got a filter id that is not in my model, got `%s`, existing filters:', filterId, this.filters);
			return;
		}

		if (typeof this.onRemove === 'function') {
			this.onRemove({filterId: filterId, optionId: optId});
		}
	};

	angular.module('viewMgrApp').component('pxboFilterChips', {
		bindings: {
			filters: '<',
			onRemove: '&'
		},
		controller: FilterChipsController,
		templateUrl: 'filters/filter-chips.html'
	});

})(angular);