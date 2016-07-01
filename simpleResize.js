function simpleResize(parentTag, prop) {


  var resizeProp = {
    "cursor": prop.cursor || "e-resize",
    "minwidth": prop.minWidth || "50px",
    "maxwidth": prop.maxWidth
  };
  /**
  * code for assigning the minimum width for the table
  */
  $(parentTag).find("td").css("min-width", resizeProp.minwidth);
  console.log(resizeProp.cursor)
  var over = false;
  var iEdgeThreshold = 10;
  var pressed = false;
  var start = undefined;
  var startX, startWidth, startTablewidth;
  var rowNum = null;
  /**
   * code to find the position of the cursor on td
   */
  function findPos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
      curleft = obj.offsetLeft;
      curtop = obj.offsetTop;
      while (obj = obj.offsetParent) {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      }
    }

    return [curleft, curtop];
  }

  /**
   * code to find whether the cursor is on the border line of the td
   */
  function isOnBorderRight(objTable, objTh, event) {
    var width = objTh.offsetWidth;
    var left = objTh.offsetLeft;
    var pos = findPos(objTable);
    var absRight = pos[0] + left + width;
    var widths = event.pageX - $(parentTag).position().left;
    var limit = absRight - iEdgeThreshold;
    if (widths > limit) {
      return true;
    }

    return false;
  }

  function doResize(objTh, event, col) {
    if (!event)
      event = window.event;

    if (isOnBorderRight('TABLE', objTh, event)) {
      over = true;
      rowNum = col;
      objTh.style.cursor = resizeProp.cursor;
    } else {
      over = false;
      objTh.style.cursor = '';
    }

    return over;
  }

  function mouseDown(event) {
    if (over) {
      pressed = true;
      startX = event.pageX;
      startWidth = $(parentTag).find('tr').eq(0).find('td').eq(rowNum).width();
      startTablewidth = $(parentTag).width();
    }
  }

  function mouseMove(event) {
    event.preventDefault();
    if (pressed) {
      var newWidth = startWidth + (event.pageX - startX);
      var newTablewidth = startTablewidth + (event.pageX - startX);

      if(resizeProp.maxwidth != undefined){
        if(newWidth <= parseInt(resizeProp.maxwidth, 10)){
          $(parentTag).find('tr').eq(0).find('td').eq(rowNum).css('width', newWidth+"px");
          $(parentTag).css("width", newTablewidth+"px");
        }
      }else{
        $(parentTag).find('tr').eq(0).find('td').eq(rowNum).css('width', newWidth+"px");
        $(parentTag).css("width", newTablewidth+"px");
      }
    }
  }

  function MU(event) {
    if (pressed) {
      rowNum = -1;
      pressed = false;
    }
  }

  $(parentTag).on('mousedown', mouseDown);
  $(parentTag).on('mousemove', mouseMove);
  window.addEventListener('mouseup', MU);

  $(parentTag).find("td").bind('mouseover mouseout mousemove',  function(event) {
    var col = $(this).parent().children().index($(this));
    var row = $(this).parent().parent().children().index($(this).parent());
    doResize(this, event, col);
  });

}
