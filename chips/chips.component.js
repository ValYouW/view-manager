/* globals angular */
(function(angular) {

	function ChipsController() {
	}

	ChipsController.prototype.$onChanges = function(changes) {
		// Check if the filter has changed
		if (typeof changes.chips !== 'undefined' && this.chips) {
			for (var i = 0; i < this.chips.length; ++i) {
				var currChip = this.chips[0];

				// Use the id as text if it's missing
				currChip.text = currChip.text || currChip.id;
			}
		}
	};

	angular.module('viewMgrApp').component('pxboChips', {
		bindings: {
			chips: '<',
			onChange: '&'
		},
		controller: ChipsController,
		templateUrl: 'chips/chips.html'
	});

})(angular);