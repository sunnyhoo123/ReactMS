import { dpr } from './config.js';

class CanvasTable {
  constructor(options = {}) {
    this.options = options;
    const {
      el,
      slideWrap,
      slide,
      table: { rowHeight, columns, headerHight },
    } = options;
    this.el = el; // canvans dom
    this.ctx = el.getContext('2d'); // canvans画布环境
    this.rowHeight = rowHeight; // 表col的高度
    this.headerHight = headerHight; // 表头高度
    this.slideWrap = slideWrap; // 自定义滑块容器
    this.slide = slide; // 自定义滑块
    this.columns = columns; // 表列
    this.tableData = []; // canvans渲染的数据
    this.startIndex = 0; // 数据起始位
    this.endIndex = 0; // 数据末尾索引
    this.top = 0;
    this.left = 0;
    this.WIDTH = 5000;
    this.HEIGHT = 5000;
    this.width = window.innerWidth - 2;
    this.height = window.innerHeight - 2;
    this.scrollbars = {};
    this.init();
  }
  init() {
    // 初始化数据
    this.setDataByPage();

    this.setScrollbars();

    this.addEvent();

    // 纵向滚动条Y
    // this.setScrollY();
  }

  setDataByPage() {
    const {
      el,
      rowHeight,
      options: {
        table: { tableData: sourceData = [] },
      },
    } = this;
    // const limit = Math.floor((el.height - rowHeight) / rowHeight); // 最大限度展示可是区域条数
    // const endIndex = Math.min(this.startIndex + limit, sourceData.length);
    // this.endIndex = endIndex;
    // this.tableData = sourceData.slice(this.startIndex, this.endIndex);

    this.tableData = sourceData;

    // if (this.tableData.length === 0 || this.startIndex + limit > sourceData.length) {
    //   console.log('到底了');
    //   return;
    // }
    console.log(this.tableData, '--tableData', sourceData);

    // 清除画布
    this.clearCanvans();

    this.scaleCanvas();

    // 绘制表头
    this.drawHeader();
    // 绘制body
    this.drawBody();
  }

  scaleCanvas() {
    let { width: cssWidth, height: cssHeight } = this.el.getBoundingClientRect();
    this.el.style.width = this.el.width + 'px';
    this.el.style.height = this.el.height + 'px';

    this.el.width = dpr * cssWidth;
    this.el.height = dpr * cssHeight;

    this.ctx.scale(dpr, dpr); // 解决高清屏canvas绘制模糊的问题
  }

  draw() {
    const { ctx, el: canvansDom, rowHeight, columns } = this;

    // reset everything (clears the canvas + transform + fillStyle + any other property of the context)
    canvas.width = canvas.width;

    // move our context by the inverse of our scrollbars' left and top property
    ctx.setTransform(1, 0, 0, 1, -this.scrollbars.left, -this.scrollbars.top);

    // ctx.textAlign = 'center';
    // draw only the visible area
    var visibleLeft = this.scrollbars.left;
    var visibleWidth = visibleLeft + canvas.width;
    var visibleTop = this.scrollbars.top;
    var visibleHeight = visibleTop + canvas.height;

    // you probably will have to make other calculations than these ones to get your drawings
    // to draw only where required
    // for (var w = visibleLeft; w < visibleWidth + 50; w += 100) {
    //   for (var h = visibleTop; h < visibleHeight + 50; h += 100) {
    //     var x = Math.round(w / 100) * 100;
    //     var y = Math.round(h / 100) * 100;
    //     ctx.fillText(x + ',' + y, x, y);
    //   }
    // }
    this.init();
    // draw our scrollbars on top if needed
    this.scrollbars.draw();
  }

  drawHeader() {
    const { ctx, el: canvansDom, rowHeight, columns } = this;
    const dprWidth = canvansDom.width / dpr;

    // 第一条横线
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(dprWidth, 0);
    ctx.lineWidth = 1;
    ctx.closePath();
    ctx.stroke();
    // 第二条横线
    ctx.beginPath();
    ctx.moveTo(0, rowHeight);
    ctx.lineTo(dprWidth, rowHeight);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
    const colWidth = Math.ceil(dprWidth / columns.length);
    // 绘制表头文字内容
    for (let index = 0; index < columns.length + 1; index++) {
      if (columns[index]) {
        ctx.fillText(columns[index].label, index * colWidth + 10, 18);
      }
    }
  }
  clearCanvans() {
    // 当宽高重新设置时，就会重新绘制
    const { el } = this;
    el.width = el.width;
    el.height = el.height;
  }
  drawBody() {
    const { ctx, el: canvansDom, rowHeight, tableData, columns } = this;
    const dprWidth = canvansDom.width / dpr;
    const row = Math.ceil(canvansDom.height / rowHeight);
    const tableDataLen = tableData.length;
    const colWidth = Math.ceil(dprWidth / columns.length);
    // 画横线
    for (let i = 2; i < row + 2; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * rowHeight);
      ctx.lineTo(dprWidth, i * rowHeight);
      ctx.stroke();
      ctx.closePath();
    }
    console.log(this.tableData, 'tableDataLen');
    // 绘制竖线
    for (let index = 0; index < columns.length + 1; index++) {
      ctx.beginPath();
      ctx.moveTo(index * colWidth, 0);
      ctx.lineTo(index * colWidth, (tableDataLen + 1) * rowHeight);
      ctx.stroke();
      ctx.closePath();
    }
    // 填充内容
    const columnsKeys = columns.map((v) => v.key || v.solt);
    //   ctx.fillText(tableData[0].name, 10, 48);
    for (let i = 0; i < tableData.length; i++) {
      columnsKeys.forEach((keyName, j) => {
        const x = 10 + colWidth * j;
        const y = 18 + rowHeight * (i + 1);
        if (tableData[i][keyName]) {
          ctx.fillText(tableData[i][keyName], x, y);
        }
      });
    }
  }
  throttle(callback, wait) {
    let timer = null;
    return function () {
      if (timer) return;
      timer = setTimeout(() => {
        callback.apply(this, arguments);
        timer = null;
      }, wait);
    };
  }
  setScrollbars() {
    const { ctx, el: canvas, rowHeight, columns, WIDTH, HEIGHT } = this;
    console.log(canvas, 8080);
    var scrollbars = {};
    // initial position
    scrollbars.left = 0;
    scrollbars.top = 0;
    // a single constructor for both horizontal and vertical
    var ScrollBar = function (vertical) {
      var that = {
        vertical: vertical,
      };

      that.left = vertical ? canvas.width - 10 : 0;
      that.top = vertical ? 0 : canvas.height - 10;
      that.height = vertical ? canvas.height - 10 : 5;
      that.width = vertical ? 5 : canvas.width - 10;
      that.fill = '#dedede';

      that.cursor = {
        radius: 5,
        fill: '#bababa',
      };
      that.cursor.top = vertical ? that.cursor.radius : that.top + that.cursor.radius / 2;
      that.cursor.left = vertical ? that.left + that.cursor.radius / 2 : that.cursor.radius;

      that.draw = function () {
        if (!that.visible) {
          return;
        }
        // remember to reset the matrix
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        // you can give it any shape you like, all canvas drawings operations are possible
        ctx.fillStyle = that.fill;
        ctx.fillRect(that.left, that.top, that.width, that.height);
        ctx.beginPath();
        ctx.arc(that.cursor.left, that.cursor.top, that.cursor.radius, 0, Math.PI * 2);
        ctx.fillStyle = that.cursor.fill;
        ctx.fill();
      };
      // check if we're hovered
      that.isHover = function (x, y) {
        if (
          x >= that.left - that.cursor.radius &&
          x <= that.left + that.width + that.cursor.radius &&
          y >= that.top - that.cursor.radius &&
          y <= that.top + that.height + that.cursor.radius
        ) {
          // we are so record the position of the mouse and set ourself as the one hovered
          scrollbars.mousePos = vertical ? y : x;
          scrollbars.hovered = that;
          that.visible = true;
          return true;
        }
        // we were visible last call and no wheel event is happening
        else if (that.visible && !scrollbars.willHide) {
          that.visible = false;
          // the this should be redrawn
          return true;
        }
      };

      return that;
    };

    scrollbars.horizontal = ScrollBar(0);
    scrollbars.vertical = ScrollBar(1);

    scrollbars.hovered = null;
    scrollbars.dragged = null;
    scrollbars.mousePos = null;
    // check both of our scrollbars
    scrollbars.isHover = function (x, y) {
      return this.horizontal.isHover(x, y) || this.vertical.isHover(x, y);
    };
    // draw both of our scrollbars
    scrollbars.draw = function () {
      this.horizontal.draw();
      this.vertical.draw();
    };
    // check if one of our scrollbars is visible
    scrollbars.visible = function () {
      return this.horizontal.visible || this.vertical.visible;
    };
    // hide it...
    scrollbars.hide = function () {
      // only if we're not using the mousewheel or dragging the cursor
      if (this.willHide || this.dragged) {
        return;
      }
      this.horizontal.visible = false;
      this.vertical.visible = false;
    };

    // get the area's coord relative to our scrollbar
    var toAreaCoord = function (pos, scrollBar) {
      var sbBase = scrollBar.vertical ? scrollBar.top : scrollBar.left;
      var sbMax = scrollBar.vertical ? scrollBar.height : scrollBar.width;
      var areaMax = scrollBar.vertical ? HEIGHT - canvas.height : WIDTH - canvas.width;

      var ratio = (pos - sbBase) / (sbMax - sbBase);

      return areaMax * ratio;
    };

    // get the scrollbar's coord relative to our total area
    var toScrollCoords = function (pos, scrollBar) {
      var sbBase = scrollBar.vertical ? scrollBar.top : scrollBar.left;
      var sbMax = scrollBar.vertical ? scrollBar.height : scrollBar.width;
      var areaMax = scrollBar.vertical ? HEIGHT - canvas.height : WIDTH - canvas.width;

      var ratio = pos / areaMax;

      return (sbMax - sbBase) * ratio + sbBase;
    };

    scrollbars.scroll = function () {
      // check which one of the scrollbars is active
      var vertical = this.hovered.vertical;
      // until where our cursor can go
      var maxCursorPos = this.hovered[vertical ? 'height' : 'width'];
      var pos = vertical ? 'top' : 'left';
      // check that we're not out of the bounds
      this.hovered.cursor[pos] = this.mousePos < 0 ? 0 : this.mousePos > maxCursorPos ? maxCursorPos : this.mousePos;

      // seems ok so tell the this we scrolled
      this[pos] = toAreaCoord(this.hovered.cursor[pos], this.hovered);
      // redraw everything
      this.draw();
    };
    // because we will hide it after a small time
    // scrollbars.willHide;
    // called by the wheel event
    scrollbars.scrollBy = function (deltaX, deltaY) {
      // it's not coming from our scrollbars
      this.hovered = null;
      // we're moving horizontally
      if (deltaX) {
        var newLeft = this.left + deltaX;
        // make sure we're in the bounds
        this.left = newLeft > WIDTH - canvas.width ? WIDTH - canvas.width : newLeft < 0 ? 0 : newLeft;
        // update the horizontal cursor
        this.horizontal.cursor.left = toScrollCoords(this.left, this.horizontal);
        // show our scrollbar
        this.horizontal.visible = true;
      }
      if (deltaY) {
        var newTop = this.top + deltaY;
        this.top = newTop > HEIGHT - canvas.height ? HEIGHT - canvas.height : newTop < 0 ? 0 : newTop;
        this.vertical.cursor.top = toScrollCoords(this.top, this.vertical);
        this.vertical.visible = true;
      }
      // if we were called less than the required timeout
      clearTimeout(this.willHide);
      this.willHide = setTimeout(function () {
        scrollbars.willHide = null;
        scrollbars.hide();
        // this.draw();
      }, 500);
      console.log(this, this.draw(), 9999);
      // redraw everything
      this.draw();
    };
    console.log(scrollbars, 'scrollbars');
    this.scrollbars = scrollbars;
  }

  addEvent() {
    const { ctx, el: canvas, rowHeight, scrollbars: appScrollbars } = this;
    console.log(appScrollbars, 999);

    var mousedown = function (e) {
      // tell the browser we handle this
      e.preventDefault();
      // we're over one the scrollbars
      if (appScrollbars.hovered) {
        // new promotion ! it becomes the dragged one
        appScrollbars.dragged = appScrollbars.hovered;
        appScrollbars.scroll();
      }
    };
    var mousemove = function (e) {
      // check the coordinates of our canvas in the document
      var rect = canvas.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      // we're dragging something
      if (appScrollbars?.dragged) {
        // update the mouse position
        appScrollbars.mousePos = appScrollbars.dragged.vertical ? y : x;
        appScrollbars.scroll();
      } else if (appScrollbars.isHover(x, y)) {
        // something has changed, redraw to show or hide the scrollbar
        appScrollbars.draw();
      }
      e.preventDefault();
    };
    var mouseup = function (e) {
      // we dropped it
      appScrollbars.dragged = null;
    };

    var mouseout = function (e) {
      // we're out
      if (appScrollbars.visible()) {
        appScrollbars.hide();
        appScrollbars.dragged = false;
        appScrollbars.draw();
      }
    };

    var mouseWheel = function (e) {
      ctx.setTransform(1, 0, 0, 1, -50, -50);
      e.preventDefault();
      appScrollbars.scrollBy(e.deltaX, e.deltaY);
    };
    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mouseup', mouseup);
    canvas.addEventListener('mouseout', mouseout);
    canvas.addEventListener('wheel', mouseWheel);
  }

  // 自定义Y轴纵向滚动条
  setScrollY() {
    const { slideWrap, slide, throttle, rowHeight, el, options } = this;
    const dom = options.touchCanvans ? el : slide;
    if (!options.touchCanvans) {
      slideWrap.style.opacity = 1;
    }
    let startY = 0; // 起始点
    let scrollEndIndex = -1; // 当滚动条滑到底部时，数据未完全加载完毕时
    const getSlideWrapStyleValue = () => {
      return slideWrap.style.transform ? slideWrap.style.transform.match(/\d/g).join('') * 1 : 0;
    };
    const move = (event) => {
      // console.log(event.clientY, 'event.clientY')
      let scrollY = event.clientY - startY;
      let transformY = getSlideWrapStyleValue();
      // console.log(transformY, 'transformY')
      if (scrollY < 0) {
        console.log('到顶了，不能继续上滑动了...');
        scrollY = 0;
        transformY = scrollY;
        scrollEndIndex = 0;
      } else {
        transformY = scrollY;
      }
      const limit = Math.floor((el.height - rowHeight) / rowHeight); // 最大限度展示可是区域条数
      // 如果拉到最低部了
      if (transformY >= rowHeight * limit - rowHeight * 2) {
        scrollEndIndex++;
        transformY = rowHeight * limit - rowHeight * 2;
      }
      slideWrap.style.transform = `translateY(${transformY}px)`;
      // scrollEndIndex 滑到底部，数据还没有加载完毕
      this.startIndex = Math.floor(scrollY / rowHeight) + scrollEndIndex;
      throttle(() => {
        this.setDataByPage();
      }, 500)();
    };
    const stop = (event) => {
      dom.onmousemove = null;
      dom.onmouseup = null;
      if (options.touchCanvans) {
        slideWrap.style.opacity = 0;
      }
    };
    dom.addEventListener('mousedown', (e) => {
      if (options.touchCanvans) {
        slideWrap.style.opacity = 1;
      }
      const transformY = getSlideWrapStyleValue();
      startY = e.clientY - transformY;
      dom.onmousemove = throttle(move, 200);
      dom.onmouseup = stop;
    });
  }
}

export default CanvasTable;
