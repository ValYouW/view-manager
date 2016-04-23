/* globals angular */
(function(angular) {

	function PXBOComboDirective() {
		return {
			restrict: 'E',
			controller: 'pxboComboCtrl',
			controllerAs: 'ctrl',
			templateUrl: 'pxbo-combo-template.html',
			scope: {},
			bindToController: {
				items: '=',
				selected: '=',
				onChange: '&'
			}
		};
	}

	PXBOComboDirective.$inject = [];

	angular.module('viewMgrApp').directive('pxboComboDrv', PXBOComboDirective);

	function PXBOComboController(filter, scope) {
		this.filterSvc = filter;
		this.scope = scope;
		this.showOpts = false;
		this.search = {text: ''};
		this.highlightedIdx = -1;
		this.items = this.items || [];
		this.filteredItems = this.items.length;

		var self = this;
		this.scope.$watch('ctrl.items', function() {
			self.search.text = '';
			for (var i = 0; i < self.items.length; ++i) {
				if (self.items[i].id === self.selected) {
					self.search.text = self.items[i].text;
					break;
				}
			}
		});

		//if (this.selected && this.items) {
		//	for (var i = 0; i < this.items.length; ++i) {
		//		if (this.items[i].id === this.selected) {
		//			this.search.text = this.items[i].text;
		//		}
		//	}
		//}
	}

	PXBOComboController.prototype.select = function(item) {
		this.showOpts = false;
		this.search.text = item.text;
		this.selected = item.id;
		this.onChange({$filter: item});
	};

	PXBOComboController.prototype.searchChange = function() {
		this.showOpts = true;
		this.filteredItems = this.filterSvc('filter')(this.items, this.search) || [];
		this.highlightedIdx = 0;
	};

	PXBOComboController.prototype.searchKeyUp = function(e) {
		// Escape
		if (e.keyCode == 27) {
			this.showOpts = false;
			// Keydown
		} else if (e.keyCode === 40) {
			this.showOpts = true;
			this.filteredItems = this.filterSvc('filter')(this.items, this.search) || [];
			this.highlightedIdx = (this.highlightedIdx + 1) % this.filteredItems.length;
			// Keyup
		} else if (e.keyCode === 38) {
			this.highlightedIdx = Math.max(0, this.highlightedIdx - 1);
			// Enter
		} else if (e.keyCode === 13) {
			this.select(this.filteredItems[this.highlightedIdx]);
		}
	};

	PXBOComboController.$inject = ['$filter', '$scope'];

	angular.module('viewMgrApp').controller('pxboComboCtrl', PXBOComboController);
})(angular);