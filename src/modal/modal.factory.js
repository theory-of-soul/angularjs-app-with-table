import modalModule from './modal.module';
import './modal.styles.css';

modalModule.factory('testModal', ['btfModal', function(btfModal) {
  return btfModal({
    controller: 'TestModalCtrl',
    controllerAs: 'modal',
    templateUrl: './modal.template.html'
  });
}]).
controller('TestModalCtrl', ['testModal', TestModalCtrl]);

function TestModalCtrl(testModal) {
  this.closeMe = testModal.deactivate;
}