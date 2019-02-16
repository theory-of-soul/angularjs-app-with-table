import statisticListModule from './statistic-list.module';
import './statistic-list.styles.css';
import '../ordering/ordering';

statisticListModule.
component('statisticListCmp', {
  templateUrl: `./statistic-list.template.html`
}).controller('StatisticListCtrl', [
  '$scope',
  '$http',
  '$q',
  '$compile',
  'DTOptionsBuilder',
  'DTColumnBuilder',
  'testModal',
  StatisticListCtrl]
);

function StatisticListCtrl($scope, $http, $q, $compile, DTOptionsBuilder, DTColumnBuilder, testModal) {
  let vm = this;
  vm.modal = testModal;
  vm.delete = deleteRow;
  vm.checkAll = checkAll;
  vm.checkCheckboxColumn = checkCheckboxColumn;
  vm.checkAllCheckbox = false;
  vm.dtInstance = {};
  vm.statistic = {};

  let statistics;
  vm.checkedCheckboxes = {};

  vm.dtOptions = DTOptionsBuilder.fromFnPromise(() => {
    let defer = $q.defer();
    $http.get('./data.json').then((result) => {
      if (result.data.result !== 'ok') {
        alert('Check data from your statistic-list/data.json');
        throw new Error('Check data from your statistic-list/data.json');
      } else {
        statistics = result.data.data;
        defer.resolve(statistics);
      }
    });
    return defer.promise;
  }).withOption('createdRow', bindRowWithScope)
    .withOption('headerCallback', bindHeaderWithScope)
    .withOption('order', []);

  vm.dtColumns = [
    DTColumnBuilder.newColumn(null)
      .withTitle('<input type="checkbox" ng-change="showCase.checkAll()" ng-model="showCase.checkAllCheckbox"/>')
      .notSortable().renderWith(checkboxColumn),
    DTColumnBuilder.newColumn('keyword').withTitle('Keyword'),
    DTColumnBuilder.newColumn(null).renderWith(exploreButton).notSortable(),
    DTColumnBuilder.newColumn('suggestions_count').renderWith(showSuggestionCountButton).notSortable(),
    DTColumnBuilder.newColumn('users_per_day').withTitle('Traffic score'),
    DTColumnBuilder.newColumn('position_info').withTitle('Rank').withOption('type', 'num-html').renderWith(rankColumn),
    DTColumnBuilder.newColumn('total_apps').withTitle('Total apps'),
    DTColumnBuilder.newColumn('color').withTitle('Color').notSortable().renderWith(colorColumn),
    DTColumnBuilder.newColumn(null).withTitle('').notSortable().renderWith(deleteButtonColumn)
  ];

  function bindRowWithScope(nRow) {
    $compile(angular.element(nRow).contents())($scope);
  }

  function bindHeaderWithScope(header) {
    if (!vm.headerCompiled) {
      vm.headerCompiled = true;
      $compile(angular.element(header).contents())($scope);
    }
  }

  function deleteRow(row) {
    const indexRow = statistics.findIndex((el) => {
      return el.id === row.id;
    });
    statistics.splice(indexRow, 1);
    vm.dtInstance.changeData(() => {
        return new Promise((resolve) => resolve(statistics))
    });
  }

  function deleteButtonColumn(data) {
    vm.statistic[data.id] = data;
    return '' +
      '<button class="btn btn--danger" ng-click="showCase.delete(showCase.statistic[' + data.id + '])">' +
      '   <i class="fa fa-trash-o"></i>' +
      '</button>';
  }

  function checkboxColumn(data) {
    return '<input type="checkbox" ' +
      'ng-change="showCase.checkCheckboxColumn(' + data.id + ')" ' +
      'ng-model="showCase.checkedCheckboxes[' + data.id + ']" ' +
      'ng-checked="showCase.checkedCheckboxes[' + data.id + ']"/>';
  }

  function checkCheckboxColumn(id) {
    if (Object.values(vm.checkedCheckboxes).indexOf(true) === -1) {
      alert('Any checkbox should be chosen');
      vm.checkedCheckboxes[id] = true;
    }
  }

  function checkAll() {
    if (vm.checkAllCheckbox) {
      statistics.forEach((el) => {
        vm.checkedCheckboxes[el.id] = true;
      })
    } else {
      statistics.forEach((el) => {
        vm.checkedCheckboxes[el.id] = false;
      });
      vm.checkedCheckboxes[statistics[0].id] = true;
    }

  }

  const COLORS = ['green', 'gray', 'red', 'yellow', 'purple'];

  function colorColumn(data) {
    return '<div class="color color--' + COLORS[data] + '"></div>'
  }

  function exploreButton() {
    return '<a class="btn btn--info" ng-href="explore">Explore</a>'
  }

  function showSuggestionCountButton(suggestionsCount) {
    return typeof suggestionsCount === 'number' ?
      '<a class="btn btn--info" href ng-click="showCase.modal.activate()">Show (' + suggestionsCount + ') </a>' : '';
  }

  function rankColumn(positionInfo) {
    let changeInfo = '';

    if (positionInfo.change) {
      const positionChange = parseFloat(positionInfo.change);
      const isPositive = positionChange > 0;
      const color = isPositive ? 'change--positive' : 'change--negative';
      changeInfo = `<span class="change ${color}">
                        (${isPositive ? '+' : ''}${positionChange})
                    </span>`
    }
    return positionInfo.position + changeInfo;
  }
}