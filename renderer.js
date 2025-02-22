console.log('Renderer process initialized');  // 确认渲染进程已启动

const { ipcRenderer } = require('electron');


function showPage(...pageIds) {
    document.querySelectorAll('div').forEach(div => {
      div.classList.add('hidden');
    });
    pageIds.forEach(pageId => {
      document.getElementById(pageId).classList.remove('hidden');
    });
  
    if (pageIds.includes('query-statistics-page')) {
      ipcRenderer.send('get-statistics');
    }
  
    if (pageIds.includes('query-by-category-page')) {
      ipcRenderer.send('get-categories');
    }

    if (pageIds.includes('detailed-query-page')) {
        ipcRenderer.send('get-categories');
      }

    if (pageIds.includes('query-by-card-page')) {
        ipcRenderer.send('get-cards');
      }

    if (pageIds.includes('delete-record-page')) {
        ipcRenderer.send('get-records');
      }

  }
  

// 获取表单和表格元素
const form = document.getElementById('record-form');
const table = document.getElementById('records-table').getElementsByTagName('tbody')[0];

// 监听表单提交事件
form.addEventListener('submit', (e) => {
  e.preventDefault(); // 阻止默认表单提交行为

  // 获取表单数据
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;
  const type = document.getElementById('type').value;
  const use = document.getElementById('use').value;
  const amount = document.getElementById('amount').value;
  const card = document.getElementById('card').value;

  // 发送数据到主进程
  ipcRenderer.send('add-record', { category, date, type, use, amount, card });
  console.log("Sent add-record event:", { category, date, type, use, amount, card });

  // 清空表单
  form.reset();
});



// document.getElementById('record-form').addEventListener('submit', (event) => {
//     event.preventDefault();
  
//     const record = {
//       category: document.getElementById('category').value,
//       date: document.getElementById('date').value,
//       type: document.getElementById('type').value,
//       use: document.getElementById('use').value,
//       amount: document.getElementById('amount').value,
//       card: document.getElementById('card').value
//     };
  
//     ipcRenderer.send('add-record', record);
//   });
  
  ipcRenderer.on('update-records', (event, records) => {
    const table = document.getElementById('records-table').getElementsByTagName('tbody')[0];
  
    // 清空表格
    table.innerHTML = '';
  
    // 渲染每条记录
    records.forEach((record) => {
      const row = table.insertRow();
      row.insertCell(0).textContent = record[0]; // 项目类别
      row.insertCell(1).textContent = record[1]; // 日期
      row.insertCell(2).textContent = record[2] === '收入' ? '收入' : '支出'; // 类型
      row.insertCell(3).textContent = record[3]; // 用途
      row.insertCell(4).textContent = record[4]; // 金额
      row.insertCell(5).textContent = record[5]; // 银行卡
    });
  });

// // 接收主进程返回的账单记录并显示在表格中
// ipcRenderer.on('update-records', (event, records) => {
//     const table = document.getElementById('records-table').getElementsByTagName('tbody')[0];
  
//     // 确认表格和 tbody 元素存在
//     if (!table) {
//       console.error('Table or tbody element not found');
//       return;
//     }
  
//     // 清空表格
//     table.innerHTML = '';
  
//     // 确认 records 包含数据
//     if (!records || records.length === 0) {
//       console.log('No records to display');
//       return;
//     }
  
//     records.forEach((record) => {
//         const row = table.insertRow();
//         row.insertCell(0).textContent = record[0]; // 项目类别
//         row.insertCell(1).textContent = record[1]; // 日期
//         row.insertCell(2).textContent = record[2] === 'income' ? '收入' : '支出'; // 类型
//         row.insertCell(3).textContent = record[3]; // 用途
//         row.insertCell(4).textContent = record[4]; // 金额
//         row.insertCell(5).textContent = record[5]; // 银行卡
//       });
//   });


  //查询统计数据
  ipcRenderer.on('statistics-data', (event, { categoryStats, cardStats }) => {
    const categoryTable = document.querySelector('#category-stats tbody');
    const cardTable = document.querySelector('#card-stats tbody');
  
    // 清空表格
    categoryTable.innerHTML = '';
    cardTable.innerHTML = '';
  
    // 渲染按项目类别统计数据
    for (const category in categoryStats) {
      const row = categoryTable.insertRow();
      row.insertCell(0).textContent = category;
      row.insertCell(1).textContent = categoryStats[category].income.toFixed(2);
      row.insertCell(2).textContent = categoryStats[category].expense.toFixed(2);
      row.insertCell(3).textContent = categoryStats[category].total.toFixed(2);
    }
  
    // 渲染按银行卡统计数据
    for (const card in cardStats) {
      const row = cardTable.insertRow();
      row.insertCell(0).textContent = card;
      row.insertCell(1).textContent = cardStats[card].income.toFixed(2);
      row.insertCell(2).textContent = cardStats[card].expense.toFixed(2);
      row.insertCell(3).textContent = cardStats[card].total.toFixed(2);
    }
  });

//   //按照类别查询
//   ipcRenderer.on('categories-data', (event, categories) => {
//     const categorySelect = document.getElementById('category-select');
//     categorySelect.innerHTML = '';
  
//     categories.forEach(category => {
//       const option = document.createElement('option');
//       option.value = category;
//       option.textContent = category;
//       categorySelect.appendChild(option);
//     });
//   });

//   ipcRenderer.on('search-results', (event, records) => {
//     //const resultsTable = document.getElementById('search-results');
//     const resultsTable = document.getElementById('search-results').getElementsByTagName('tbody')[0];
  
//     // 清空表格
//     resultsTable.innerHTML = '';
  
//     // 渲染每条记录
//     records.forEach((record) => {
//       const row = resultsTable.insertRow();
//       row.insertCell(0).textContent = record[0]; // 项目类别
//       row.insertCell(1).textContent = record[1]; // 日期
//       row.insertCell(2).textContent = record[2]; // 用途
//       row.insertCell(3).textContent = record[3]; // 金额
//       row.insertCell(4).textContent = record[4] === 'income' ? '收入' : '支出'; // 类型
//       row.insertCell(5).textContent = record[5]; // 银行卡
//     });
//   });

//   function updateSearchOptions() {
//     const searchType = document.getElementById('search-type').value;
//     document.getElementById('search-category').classList.add('hidden');
//     document.getElementById('search-date').classList.add('hidden');
  
//     if (searchType === 'category') {
//       document.getElementById('search-category').classList.remove('hidden');
//     } else if (searchType === 'date') {
//       document.getElementById('search-date').classList.remove('hidden');
//     }
//   }
  
//   function searchByCategory() {
//     const category = document.getElementById('category-select').value;
//     ipcRenderer.send('search-by-category', category);
//   }
  
//   function searchByDate() {
//     const date = document.getElementById('date-select').value;
//     ipcRenderer.send('search-by-date', date);
//   }

//按项目类别查询
document.getElementById('query-form').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const category = document.getElementById('category-select').value;
    ipcRenderer.send('search-records-by-category', category);
  });
  
  ipcRenderer.on('categories-data', (event, categories) => {
    const categorySelect = document.getElementById('category-select');
    categorySelect.innerHTML = '';
  
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  });
  
  ipcRenderer.on('search-results', (event, records) => {
    const resultsTable = document.getElementById('query-results').getElementsByTagName('tbody')[0];
  
    // 清空表格
    resultsTable.innerHTML = '';
  
    // 渲染每条记录

      records.forEach((record) => {
        const row = resultsTable.insertRow();
        row.insertCell(0).textContent = record[0]; // 项目类别
        row.insertCell(1).textContent = record[1]; // 日期
        row.insertCell(2).textContent = record[2] === '收入' ? '收入' : '支出'; // 类型
        row.insertCell(3).textContent = record[3]; // 用途
        row.insertCell(4).textContent = record[4]; // 金额
        row.insertCell(5).textContent = record[5]; // 银行卡
      });
  
    console.log('search-results', records);
  });

 //按日期范围查询
 document.getElementById('query-form-date').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    ipcRenderer.send('search-records-by-date', { startDate, endDate });
  });
  
  ipcRenderer.on('search-results-date', (event, records) => {
    const resultsTableDate = document.getElementById('query-results-date').getElementsByTagName('tbody')[0];
  
    // 清空表格
    resultsTableDate.innerHTML = '';
  
    // 渲染每条记录
    records.forEach((record) => {
      const row = resultsTableDate.insertRow();
      row.insertCell(0).textContent = record[0]; // 项目类别
      row.insertCell(1).textContent = record[1]; // 日期
      row.insertCell(2).textContent = record[2] === '收入' ? '收入' : '支出'; // 类型
      row.insertCell(3).textContent = record[3]; // 用途
      row.insertCell(4).textContent = record[4]; // 金额
      row.insertCell(5).textContent = record[5]; // 银行卡
    });
  
    console.log('search-results-date', records);
  });

  //具体查询

  document.getElementById('detailed-query-form').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const category = document.getElementById('category-select01').value;
    const startDate = document.getElementById('start-date01').value;
    const endDate = document.getElementById('end-date01').value;
    ipcRenderer.send('search-records-by-category-and-date', { category, startDate, endDate });
  });

  ipcRenderer.on('categories-data', (event, categories) => {
    const categorySelect = document.getElementById('category-select01');
    categorySelect.innerHTML = '';
  
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });
  });

//   ipcRenderer.on('detailed-search-results', (event, records) => {
//     const resultsTableDetailed = document.getElementById('detailed-query-results').getElementsByTagName('tbody')[0];
  
//     // 清空表格
//     resultsTableDetailed.innerHTML = '';
  
//     // 渲染每条记录
//     records.forEach((record) => {
//       const row = resultsTableDetailed.insertRow();
//       row.insertCell(0).textContent = record[0]; // 项目类别
//       row.insertCell(1).textContent = record[1]; // 日期
//       row.insertCell(2).textContent = record[2] === 'income' ? '收入' : '支出'; // 类型
//       row.insertCell(3).textContent = record[3]; // 用途
//       row.insertCell(4).textContent = record[4]; // 金额
//       row.insertCell(5).textContent = record[5]; // 银行卡
//     });
  
//     console.log('detailed-search-results', records);
//   });

  ipcRenderer.on('detailed-search-results', (event, { records, stats }) => {
    const resultsTableDetailed = document.getElementById('detailed-query-results').getElementsByTagName('tbody')[0];
    const statsTableDetailed = document.getElementById('detailed-query-stats').getElementsByTagName('tbody')[0];
  
    // 清空表格
    resultsTableDetailed.innerHTML = '';
    statsTableDetailed.innerHTML = '';
  
    // 渲染每条记录
    records.forEach((record) => {
        const row = resultsTableDetailed.insertRow();
        row.insertCell(0).textContent = record[0]; // 项目类别
        row.insertCell(1).textContent = record[1]; // 日期
        row.insertCell(2).textContent = record[2] === '收入' ? '收入' : '支出'; // 类型
        row.insertCell(3).textContent = record[3]; // 用途
        row.insertCell(4).textContent = record[4]; // 金额
        row.insertCell(5).textContent = record[5]; // 银行卡
      });
  
    // 渲染统计结果
    const statsRow = statsTableDetailed.insertRow();
    statsRow.insertCell(0).textContent = stats.income.toFixed(2); // 收入
    statsRow.insertCell(1).textContent = stats.expense.toFixed(2); // 支出
    statsRow.insertCell(2).textContent = stats.total.toFixed(2); // 合计
  
    console.log('detialed-search-results', records);
    console.log('stats', stats);
  });

//   document.getElementById('query-form-card').addEventListener('submit', (event) => {
//     event.preventDefault();
  
//     const card = document.getElementById('card-select').value;
//     ipcRenderer.send('search-records-by-card', card);
//   });

  document.getElementById('query-form-card').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const card = document.getElementById('card-select').value;
    const startDate = document.getElementById('start-date02').value;
    const endDate = document.getElementById('end-date02').value;
    ipcRenderer.send('search-records-by-card', { card, startDate, endDate });
  });
  
  ipcRenderer.on('cards-data', (event, cards) => {
    const cardSelect = document.getElementById('card-select');
    cardSelect.innerHTML = '';
  
    cards.forEach(card => {
      const option = document.createElement('option');
      option.value = card;
      option.textContent = card;
      cardSelect.appendChild(option);
    });
  });

  ipcRenderer.on('card-search-results', (event, { records, stats }) => {
    const resultsTableCard = document.getElementById('query-results-card').getElementsByTagName('tbody')[0];
    const statsTableCard = document.getElementById('query-stats-card').getElementsByTagName('tbody')[0];
  
    // 清空表格
    resultsTableCard.innerHTML = '';
    statsTableCard.innerHTML = '';
  
    // 渲染每条记录
    records.forEach((record) => {
      const row = resultsTableCard.insertRow();
      row.insertCell(0).textContent = record[0]; // 项目类别
      row.insertCell(1).textContent = record[1]; // 日期
      row.insertCell(2).textContent = record[2] === '收入' ? '收入' : '支出'; // 类型
      row.insertCell(3).textContent = record[3]; // 用途
      row.insertCell(4).textContent = record[4]; // 金额
      row.insertCell(5).textContent = record[5]; // 银行卡
    });
  
    // 渲染统计结果
    const statsRow = statsTableCard.insertRow();
    statsRow.insertCell(0).textContent = stats.income.toFixed(2); // 收入
    statsRow.insertCell(1).textContent = stats.expense.toFixed(2); // 支出
    statsRow.insertCell(2).textContent = stats.total.toFixed(2); // 合计
  
    console.log('card-search-results', records);
    console.log('stats', stats);
  });

  //导出为excel文件
  function exportExcel() {
    ipcRenderer.send('show-save-dialog');
  }
  
  ipcRenderer.on('export-excel-success', (event, filePath) => {
    alert(`Excel文件已成功导出到: ${filePath}`);
  });
  
  ipcRenderer.on('export-excel-failure', (event, message) => {
    alert(`导出Excel文件失败: ${message}`);
  });

  
  // 删除账目
document.getElementById('delete-form').addEventListener('submit', (event) => {
    event.preventDefault();
  
    const recordIndex = document.getElementById('record-select').value;
    ipcRenderer.send('delete-record', recordIndex);
  });
  
  ipcRenderer.on('records-data', (event, records) => {
    const recordSelect = document.getElementById('record-select');
    recordSelect.innerHTML = '';
  
    records.forEach((record, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = `${record[0]} - ${record[1]} - ${record[2]} - ${record[3]} - ${record[4]} - ${record[5]}`;
      recordSelect.appendChild(option);
    });
  });
  
  ipcRenderer.on('delete-record-success', (event) => {
    alert('账目已成功删除');
    ipcRenderer.send('get-records'); // 更新记录列表
  });
  
  ipcRenderer.on('delete-record-failure', (event, message) => {
    alert(`删除账目失败: ${message}`);
  });

  //退出程序
  // 退出应用
function exitApp() {
    ipcRenderer.send('exit-app'); // 发送退出信号给主进程
}
document.getElementById('exitAppButton').addEventListener('click', exitApp); // 绑定退出按钮事件