function DndDemo($scope) {
  $scope.list1 = [{name:'one'}, {name:'two'}, {name: 'three', reject: true}, {name: 'four'}];
  $scope.list2 = [];

  $scope.dragStart = function(item, list){
    item.dragging = '(dragging)';
    return {src: list, item:item};
  };
  $scope.dragEnd = function(item){
    delete item.dragging;
  };
  
  $scope.acceptToken = function(to, token){
    return token.src != to && !token.item.reject;
  };
  $scope.commitToken = function(to, token){
    angular.Array.remove(token.src, token.item);
    to.push(token.item);
  };
}