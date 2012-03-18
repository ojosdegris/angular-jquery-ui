/* http://docs.angularjs.org/#!angular.widget */

(function(){
  function applyFn(element, scope, exp, property){
    property = property || '$token';
    return function(token){
      var old = scope.hasOwnProperty(property) ? scope[property] : undefined;
      scope[property] = token;
      var retVal = scope.$tryEval(exp, element);
      scope[property] = old;
      return retVal;
    };
  };

  angular.module("jquery-ui", []).directive('jqui-drag-start', function ($compile) {
    return {
      scope:{
//        var dragStartExp = item.attr('jqui-drag-start') || '';
//        var dragEndExp = item.attr('jqui-drag-end') || '';
//        var handle = item.attr('jqui-handle') || false;
//        var axisExp = item.attr('jqui-axis');
      },
      link:function (scope, item, attrs) {
        item.addClass('jqui-dnd-item');

        var $updateView = scope.$root.$eval;
        var dragStart = applyFn(item, scope, dragStartExp);
        var dragEnd = applyFn(item, scope, dragEndExp);
        var token;

        item.draggable({
          addClass:false,
          handle:handle,
          start:function (event, ui) {
            item.draggable('option', 'revertDuration', 200);
            item.addClass('jqui-dnd-item-dragging');
            item.data('jqui-dnd-item-token', token = dragStart());
            $updateView();
          },
          stop:function () {
            item.removeClass('jqui-dnd-item-dragging');
            item.removeClass('jqui-dnd-item-over');
            item.removeData('jqui-dnd-item-token');
            dragEnd(token);
            token = null;
            $updateView();
          },
          revert:true
        });

        if (axisExp) {
          scope.$watch(axisExp, function (newValue) {
            item.draggable('option', 'axis', newValue);
          });
        }
      }
    }
  })

    .directive('jqui-drop-commit', function ($compile) {
      return {
        scope:{
//        var acceptExp = target.attr('jqui-drop-accept') || '';
//        var commitExp = target.attr('jqui-drop-commit') || '';
        },
        link:function (scope, target, attrs) {
          target.addClass('jqui-dnd-target');
          var $updateView = scope.$root.$eval;
          var accept = applyFn(target, scope, acceptExp);
          var commit = applyFn(target, scope, commitExp);

          target.droppable({
            addClass:false,
            activate:function (event, ui) {
              var token = ui.draggable.data('jqui-dnd-item-token');
              if (accept(token)) {
                target.addClass('jqui-dnd-target-active');
              } else {
                target.addClass('jqui-dnd-target-disable');
              }
              $updateView();
            },
            deactivate:function () {
              target.removeClass('jqui-dnd-target-active');
              target.removeClass('jqui-dnd-target-disable');
              target.removeClass('jqui-dnd-target-over');
            },
            over:function (event, ui) {
              if (target.hasClass('jqui-dnd-target-active')) {
                target.addClass('jqui-dnd-target-over');
                ui.draggable.addClass('jqui-dnd-item-over');
              }
            },
            out:function (event, ui) {
              target.removeClass('jqui-dnd-target-over');
              ui.draggable.removeClass('jqui-dnd-item-over');
            },
            drop:function (event, ui) {
              if (target.hasClass('jqui-dnd-target-active')) {
                commit(ui.draggable.data('jqui-dnd-item-token'));
                ui.draggable.draggable('option', 'revertDuration', 0);
                ui.draggable.css({top:'', left:''});
                ui.draggable.draggable('option', 'stop')();
              }
              target.removeClass('jqui-dnd-target-active');
              target.removeClass('jqui-dnd-target-disable');
              target.removeClass('jqui-dnd-target-over');
              $updateView();
            }
          });
        }
      }
    });

})();

