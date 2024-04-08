import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './table.css';
import CanvasTable from './init.js';
function Table({}) {
  const [tableCanvasData, setTableCanvasData] = useState([]);
  useEffect(() => {
    const slideWrap = document.getElementById('slide-wrap');
    const slide = slideWrap.querySelector('.slide');
    const canvansDom = document.getElementById('canvas-table');
    const columns = [
      { label: '姓名', key: 'name' },
      { label: '年龄', key: 'age' },
      { label: '学校', key: 'school' },
      { label: '分数', key: 'source' },
      { label: '操作', key: 'options' },
    ];
    const mockData = [
      {
        name: '张三',
        id: 0,
        age: 0,
        school: 'Web技术学苑',
        source: 800,
      },
    ];
    const tableData = new Array(20).fill(mockData[0]).map((v, index) => {
      return {
        ...v,
        id: index,
        name: `${v.name}-${index + 1}`,
        age: v.age + index + 1,
        source: v.source + index + 1,
      };
    });
    const table = {
      rowHeight: 30,
      headerHight: 30,
      columns,
      tableData,
    };
    const getCanvansData = (tableData) => {
      setTableCanvasData(tableData);
    };
    const canvasTable = new CanvasTable(
      {
        el: canvansDom,
        slideWrap,
        slide,
        table,
        touchCanvans: true,
      },
      getCanvansData
    );
    const setColumnsStyle = (row, keyName) => {
      if (!row[`${keyName}_position`]) {
        return;
      }
      const [x, y] = row[`${keyName}_position`];
      return {
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
      };
    };
  }, []);

  return (
    <div>
      <div id="canvasContainer">
        <canvas id="canvas-table" width="800" height="400"></canvas>
        <div className="render-table">
          <div className="columns-options">
            {/* <a href="javascript:void(0)">编辑</a>
            <a href="javascript:void(0)">删除</a> */}
          </div>
        </div>

        {/* 自定义滚动条 */}
        <div id="slide-wrap">
          <div className="slide"></div>
        </div>
      </div>
    </div>
  );
}

export default Table;
