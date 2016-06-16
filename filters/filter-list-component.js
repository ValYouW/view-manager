/* globals angular */
(function(angular) {

	function FilterModel(id, text, multi, options, selectionState) {
		this.id = id || '';
		this.text = text || '';
		this.multi = typeof multi === 'boolean' ? multi : true;
		this.selectionState = selectionState || 'None';
		this.options = options || [];
	}

	function FilterListController() {
		this.dirtyFilters = false;
	}

	/**
	 * Raised by angular when bindings has changed
	 * @param {object.<string, object>} changes - The changes object
	 */
	FilterListController.prototype.$onChanges = function(changes) {
		// Check if the 'filters' binding has changed
		if (typeof changes.filters !== 'undefined' && this.filters) {
			// Clone the filters array, we don't want to hold reference to the original object
			var tmp = [];
			for (var i = 0; i < this.filters.length; ++i) {
				var currFilter = this.filters[i];
				var f = new FilterModel(currFilter.id, currFilter.text, !!currFilter.multi, null, currFilter.selectionState);
				if (angular.isArray(currFilter.options) && currFilter.options.length > 1) {
					angular.merge(f.options, currFilter.options);
				}

				tmp.push(f);
			}

			this.filters = tmp;
		}
	};

	/**
	 * Raised whenever a filter selection has changed
	 * @param {string} id - The filter id
	 * @param {[]} selection - Array of selected valued
	 */
	FilterListController.prototype.onFilterChange = function(id, selection) {
		this.dirtyFilters = true;
	};

	/**
	 * Handler for the "apply" filters button
	 */
	FilterListController.prototype.applyFilters = function() {
		// Once apply button has been clicked we can hide it
		this.dirtyFilters = false;

		// If no subscribers to our change event we can stop
		if (typeof this.onChange !== 'function') {
			return;
		}

		// Create a list of active filters and raise event
		var filters = [];
		for (var i = 0; i < this.filters.length; ++i) {
			var currFilter = this.filters[i];
			var selection = currFilter.options.map(function(o) {return o.selected && o.id;}).filter(Boolean);
			if (selection.length > 0) {
				filters.push({id: currFilter.id, selection: selection});
			}
		}

		this.onChange({filters: filters});
	};

	angular.module('viewMgrApp').component('pxboFilterList', {
		bindings: {
			filters: '<',
			onChange: '&'
		},
		controller: FilterListController,
		templateUrl: 'filters/filter-list-template.html'
	});

})(angular);