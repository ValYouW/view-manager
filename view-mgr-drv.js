/* globals angular */
(function(angular) {

	// <editor-fold desc="// Directive {...}">

	function ViewMgrDirective() {
		return {
			restrict: 'E',
			controller: 'pxboViewMgrCtrl',
			controllerAs: 'ctrl',
			templateUrl: 'view-mgr-template.html',
			scope: {},
			bindToController: {api: '='},
			link: function(scope, element, attrs) {
				var root = element[0].querySelector('.viewMgrWrapper');
				if (!root) {
					return;
				}

				if (typeof attrs.height !== 'undefined') {
					root.style.height = attrs.height;
				}

				if (typeof attrs.width !== 'undefined') {
					root.style.width = attrs.width;
				}
			}
		};
	}

	ViewMgrDirective.$inject = [];

	angular.module('viewMgrApp').directive('pxboViewMgrDrv', ViewMgrDirective);

	// </editor-fold>



	// <editor-fold desc="// Controller {...}">

	function ViewMgrController(scope) {
		this.viewName = '';
		this.selectedTab = 0;
		var self = this;

		this.api.loadData = this.loadData.bind(this);
	}

	ViewMgrController.$inject = ['$scope'];

	ViewMgrController.prototype.loadData = function(model) {
		if (!model || !model.availableFilters) {
			throw new Error('model is missing availableFilters');
		}

		this.model = model;
		this.model.filters = this.model.filters || [];
		this.model.filters.push({id: '', value: ''});
	};

	ViewMgrController.prototype.selectTab = function(index) {
		this.selectedTab = index;
	};

	ViewMgrController.prototype.onFilterChanged = function(filter) {
		filter.value = '';
	};

	ViewMgrController.prototype.onFilterOptionChanged = function(filter, index) {
		if (index !== this.model.filters.length - 1 || !filter.value || !filter.id) {return;}
		this.model.filters.push({id: '', value: ''});
	};

	ViewMgrController.prototype.save = function() {
		if (typeof this.api.onSave !== 'function') {return;}

		var results = {};
		results.filters = this.model.filters.filter(function(f) { return f.id && f.value;});

		this.api.onSave(results);
	};

	angular.module('viewMgrApp').controller('pxboViewMgrCtrl', ViewMgrController);


	// </editor-fold>



})(angular);
