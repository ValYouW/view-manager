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

	ChipsController.prototype.handleClick = function(ev) {
		if (!ev || !ev.target || !ev.target.matches('.chips-remove')) {
			return;
		}

		var chipIdAttr = ev.target.attributes.getNamedItem('data-chip-id');
		if (!chipIdAttr || !chipIdAttr.value) {
			console.error('Got a click event on chips-remove but no data-chip-id attribute found');
			return;
		}

		var chipId = chipIdAttr.value;
		for (var i = 0; i < this.chips.length; ++i) {
			if (this.chips[i].id === chipId) {
				var removed = this.chips.splice(i, 1);
				if (typeof this.onRemove === 'function') {
					this.onRemove({chip: removed[0]});
				}

				return;
			}
		}
	};

	angular.module('viewMgrApp').component('pxboChips', {
		bindings: {
			chips: '<',
			onRemove: '&'
		},
		controller: ChipsController,
		templateUrl: 'chips/chips.html'
	});

})(angular);