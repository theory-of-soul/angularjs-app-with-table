import modalModule from './modal.module';
import './modal.styles.css';

modalModule.factory('testModal', function (btfModal) {
  return btfModal({
    controller: 'TestModalCtrl',
    controllerAs: 'modal',
    templateUrl: './modal.template.html'
  });
}).
controller('TestModalCtrl', TestModalCtrl);

function TestModalCtrl(testModal) {
  this.closeMe = testModal.deactivate;
}