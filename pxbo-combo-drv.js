/* globals angular */
(function(angular) {

	function PXBOComboDirective($document) {
		return {
			restrict: 'E',
			controller: 'pxboComboCtrl',
			controllerAs: 'ctrl',
			templateUrl: 'pxbo-combo-template.html',
			scope: {},
			bindToController: {
				items: '=',
				selected: '=',
				onChange: '&',
				multi: '@',
				listmode: '@'
			},
			link: function(scope, element) {

				$document.bind('click', function(event) {
					var parent = event.target.parentElement;
					var clickOnElement = false;
					while (parent !== null && !clickOnElement) {
						clickOnElement = (parent === element[0]);
						parent = parent.parentElement;
					}

					scope.ctrl.showOpts = clickOnElement;
					scope.$apply();
				});
			}
		};
	}

	PXBOComboDirective.$inject = ['$document'];

	angular.module('viewMgrApp').directive('pxboComboDrv', PXBOComboDirective);

	function PXBOComboController(filter, scope) {
		this.filterSvc = filter;
		this.scope = scope;
		this.showOpts = false;
		this.search = {text: ''};
		this.searchPlaceHolder = 'Select...';
		this.highlightedIdx = -1;
		this.items = this.items || [];
		this.filteredItems = this.items;
		var self = this;

		this.scope.$watch('ctrl.selected', function() {
			var multi = self.isMulti();
			if (multi && typeof self.selected !== 'undefined') {
				if (!angular.isArray(self.selected)) {
					throw new Error('pxboComboDrv: `selected` must be an array');
				}

				self.searchPlaceHolder = self.selected.length + ' selected';
			}
		});

		this.scope.$watch('ctrl.items', function() {
			self.search.text = '';
			for (var i = 0; i < self.items.length; ++i) {
				if (self.items[i].id === self.selected) {
					self.search.text = self.items[i].text;
					break;
				}
			}
		});
	}

	PXBOComboController.prototype.isMulti = function() {
		// Default is false
		return typeof this.multi === 'boolean' ? this.multi : (this.multi === 'true');
	};

	PXBOComboController.prototype.isOpen = function() {
		// Default is false
		return (typeof this.listmode === 'boolean' ? this.listmode : (this.listmode === 'true')) || this.showOpts;
	};

	PXBOComboController.prototype.select = function(e, item) {
		var multi = this.isMulti();
		if (multi && e.target.tagName !== 'INPUT') {return;}
		this.showOpts = multi;
		if (multi) {
			if (typeof this.selected === 'undefined') {this.selected = [];}
			var index = this.selected.indexOf(item.id);
			if (index < 0) {
				this.selected.push(item.id);
			} else {
				this.selected.splice(index, 1);
			}

			this.searchPlaceHolder = this.selected.length + ' selected';
		} else {
			this.search.text = item.text;
			this.selected = item.id;
		}

		this.onChange({$item: item});
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
			this.select(e, this.filteredItems[this.highlightedIdx]);
		}
	};

	PXBOComboController.$inject = ['$filter', '$scope'];

	angular.module('viewMgrApp').controller('pxboComboCtrl', PXBOComboController);
})(angular);
