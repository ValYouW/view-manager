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

	FilterListController.prototype.$onChanges = function(changes) {
		// Check if the data has changed
		if (typeof changes.filters !== 'undefined' && this.filters) {
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

	FilterListController.prototype.onFilterChange = function(id, selection) {
		console.log(id, selection);
		this.dirtyFilters = true;
	};

	FilterListController.prototype.applyFilters = function(id, selection) {
		if (typeof this.onChange === 'function') {
			this.onChange();
		}

		this.dirtyFilters = false;
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