const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');  // 导入 path 模块


let win;

app.whenReady().then(() => {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true, // 允许渲染进程使用 require
        contextIsolation: false, // 关闭上下文隔离
      }
    });
  
    win.loadFile('index.html');
  
    ipcMain.on('add-record', (event, record) => {
      console.log('Received add-record event in main process:', record);
    });
  });

// 处理“添加记录”请求
// ipcMain.on('add-record', (event, record) => {
//     let wb;
//     console.log("Received add-record event:", record); 
//     const filePath = 'data.xlsx';
//     console.log("Checking if file exists:", filePath);

//   // 检查文件是否存在
//   if (fs.existsSync(filePath)) {
//     console.log("File exists, reading...");
//     // 文件存在，读取文件
//     const wb = xlsx.readFile(filePath);
//     let ws = wb.Sheets['records'];
//     const newRow = [record.category, record.date, record.amount, record.type, record.card];
//     xlsx.utils.sheet_add_aoa(ws, [newRow], { origin: -1 });
//     xlsx.writeFile(wb, filePath);
//   } else {
//     console.log("File does not exist, creating new one...");
//     // 文件不存在，创建新文件
//     const wb = xlsx.utils.book_new();
//     const ws = xlsx.utils.aoa_to_sheet([["项目类别", "日期", "金额", "类型", "银行卡"]]);
//     wb.Sheets['records'] = ws;
//     const newRow = [record.category, record.date, record.amount, record.type, record.card];
//     xlsx.utils.sheet_add_aoa(ws, [newRow], { origin: -1 });
//     xlsx.writeFile(wb, filePath);
//   }

//   // 读取所有记录并返回
//   const records = xlsx.utils.sheet_to_json(wb.Sheets['records'], { header: 1 });
//   records.shift(); // 删除表头
//   event.reply('update-records', records);
// });



// ipcMain.on('add-record', (event, record) => {
//   //const filePath = 'data.xlsx';
//   const filePath = path.join(__dirname, 'data.xlsx'); // 使用绝对路径

//   let wb;
  
//   // 检查文件是否存在
//   if (fs.existsSync(filePath)) {
//     // 文件存在，读取文件
//     wb = xlsx.readFile(filePath);
//   } else {
//     // 文件不存在，创建新文件
//     wb = xlsx.utils.book_new();
//     const ws = xlsx.utils.aoa_to_sheet([["项目类别", "日期", "金额", "类型", "银行卡"]]); // 表头
//     //wb.Sheets['records'] = ws;
//     xlsx.utils.book_append_sheet(wb, ws, 'records'); // 添加工作表到工作簿
//   }

//   // 获取工作表
//   let ws = wb.Sheets['records'];

//   // 如果工作表为空，确保至少有表头
//   if (!ws || Object.keys(ws).length === 0) {
//     ws = xlsx.utils.aoa_to_sheet([["项目类别", "日期", "金额", "类型", "银行卡"]]); // 确保表头
//     wb.Sheets['records'] = ws;
//   }

//   // 添加新记录
//   const newRow = [record.category, record.date, record.amount, record.type, record.card];
//   xlsx.utils.sheet_add_aoa(ws, [newRow], { origin: -1 });

//   // 保存文件
//   xlsx.writeFile(wb, filePath);

//   // 读取所有记录并返回
//   const records = xlsx.utils.sheet_to_json(ws, { header: 1 });
//   records.shift(); // 删除表头
//   event.reply('update-records', records);
// });



ipcMain.on('add-record', (event, record) => {
    //const filePath = path.join(__dirname, 'data.xlsx'); // 使用绝对路径
    //const filePath = path.join(app.getAppPath(), 'data.xlsx');  // 使用 app.getAppPath() 获取应用的根路径
    // 使用 process.resourcesPath 获取资源路径
    const filePath = path.join(process.resourcesPath, 'data.xlsx');
    console.log('File will be saved to:', filePath);
  
    let wb;
  
    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
      // 文件存在，读取文件
      wb = xlsx.readFile(filePath);
    } else {
      // 文件不存在，创建新文件
      wb = xlsx.utils.book_new();
      const ws = xlsx.utils.aoa_to_sheet([["项目类别", "日期", "类型", "用途", "金额", "银行卡"]]); // 表头
      xlsx.utils.book_append_sheet(wb, ws, 'records'); // 添加工作表到工作簿
    }
  
    // 获取工作表
    let ws = wb.Sheets['records'];
  
    // 如果工作表为空，确保至少有表头
    if (!ws || Object.keys(ws).length === 0) {
      ws = xlsx.utils.aoa_to_sheet([["项目类别", "日期", "类型", "用途", "金额", "银行卡"]]); // 确保表头
      xlsx.utils.book_append_sheet(wb, ws, 'records'); // 添加工作表到工作簿
    }
  
    // 添加新记录
    const newRow = [record.category, record.date, record.type, record.use, record.amount, record.card];
    xlsx.utils.sheet_add_aoa(ws, [newRow], { origin: -1 });
  
    // 保存文件
    xlsx.writeFile(wb, filePath);
  
    // 读取所有记录并返回
    const records = xlsx.utils.sheet_to_json(ws, { header: 1 });
    records.shift(); // 删除表头
    event.reply('update-records', records);
  });



  ipcMain.on('get-statistics', (event) => {
    //const filePath = path.join(__dirname, 'data.xlsx');
    //const filePath = path.join(app.getAppPath(), 'data.xlsx');  // 使用 app.getAppPath() 获取应用的根路径
    // 使用 process.resourcesPath 获取资源路径
    const filePath = path.join(process.resourcesPath, 'data.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = xlsx.readFile(filePath);
      const ws = wb.Sheets['records'];
      const records = xlsx.utils.sheet_to_json(ws, { header: 1 });
      records.shift(); // 删除表头

      const categoryStats = {};
      const cardStats = {};

      records.forEach(record => {
        const [category, ,type, , amount, card] = record;
        const amt = parseFloat(amount);

        if (!categoryStats[category]) {
          categoryStats[category] = { income: 0, expense: 0, total: 0 };
        }
        if (!cardStats[card]) {
          cardStats[card] = { income: 0, expense: 0, total: 0 };
        }

        if (type === '收入') {
          categoryStats[category].income += amt;
          cardStats[card].income += amt;
        } else {
          categoryStats[category].expense += amt;
          cardStats[card].expense += amt;
        }

        categoryStats[category].total = categoryStats[category].income - categoryStats[category].expense;
        cardStats[card].total = cardStats[card].income - cardStats[card].expense;
      });

      event.reply('statistics-data', { categoryStats, cardStats });
    } else {
      event.reply('statistics-failure', '文件不存在');
    }
  });
  
// 当所有窗口关闭时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


//按项目类别查询
ipcMain.on('get-categories', (event) => {
    //const filePath = path.join(__dirname, 'data.xlsx');
    //const filePath = path.join(app.getAppPath(), 'data.xlsx');  // 使用 app.getAppPath() 获取应用的根路径
    // 使用 process.resourcesPath 获取资源路径
    const filePath = path.join(process.resourcesPath, 'data.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = xlsx.readFile(filePath);
      const ws = wb.Sheets['records'];
      const records = xlsx.utils.sheet_to_json(ws, { header: 1 });
      records.shift(); // 删除表头

      const categories = [...new Set(records.map(record => record[0]))];
      event.reply('categories-data', categories);
    } else {
      event.reply('categories-failure', '文件不存在');
    }
  });



  ipcMain.on('search-records-by-category', (event, category) => {
    //const filePath = path.join(__dirname, 'data.xlsx');
    //const filePath = path.join(app.getAppPath(), 'data.xlsx');  // 使用 app.getAppPath() 获取应用的根路径
    // 使用 process.resourcesPath 获取资源路径
    const filePath = path.join(process.resourcesPath, 'data.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = xlsx.readFile(filePath);
      const ws = wb.Sheets['records'];
      const records = xlsx.utils.sheet_to_json(ws, { header: 1 });
      records.shift(); // 删除表头

      // 过滤出类别匹配的记录
      const filteredRecords = records.filter(record => record[0] === category);
    //   // 过滤出类别匹配的记录
    //   const filteredRecords = records.filter(record => record['项目类别'] === category);

      // 返回所有相关信息
      event.reply('search-results', filteredRecords);
      console.log('search-results', filteredRecords);
    } else {
      event.reply('search-failure', '文件不存在');
    }
  });

  //按日期范围查询
  ipcMain.on('search-records-by-date', (event, { startDate, endDate }) => {
    //const filePath = path.join(__dirname, 'data.xlsx');
    //const filePath = path.join(app.getAppPath(), 'data.xlsx');  // 使用 app.getAppPath() 获取应用的根路径
    // 使用 process.resourcesPath 获取资源路径
    const filePath = path.join(process.resourcesPath, 'data.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = xlsx.readFile(filePath);
      const ws = wb.Sheets['records'];
      const records = xlsx.utils.sheet_to_json(ws, { header: 1 });
      records.shift(); // 删除表头

      // 过滤出日期范围内的记录
      const filteredRecords = records.filter(record => {
        const recordDate = new Date(record[1]);
        return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });

      // 返回所有相关信息
      event.reply('search-results-date', filteredRecords);
      console.log('search-results-date', filteredRecords);
    } else {
      event.reply('search-failure', '文件不存在');
    }
  });

//具体查询


  ipcMain.on('search-records-by-category-and-date', (event, { category, startDate, endDate }) => {
    //const filePath = path.join(__dirname, 'data.xlsx');
    //const filePath = path.join(app.getAppPath(), 'data.xlsx');  // 使用 app.getAppPath() 获取应用的根路径
    // 使用 process.resourcesPath 获取资源路径
    const filePath = path.join(process.resourcesPath, 'data.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = xlsx.readFile(filePath);
      const ws = wb.Sheets['records'];
      const records = xlsx.utils.sheet_to_json(ws, { header: 1 });
      records.shift(); // 删除表头

      // 过滤出类别匹配且日期范围内的记录
      const filteredRecords = records.filter(record => {
        const recordDate = new Date(record[1]);
        return record[0] === category && recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });

      // 计算统计结果
      const stats = filteredRecords.reduce((acc, record) => {
        const amount = parseFloat(record[4]);
        if (record[2] === '收入') {
          acc.income += amount;
        } else {
          acc.expense += amount;
        }
        acc.total = acc.income - acc.expense;
        return acc;
      }, { income: 0, expense: 0, total: 0 });

      // 返回所有相关信息
      event.reply('detailed-search-results', { records: filteredRecords, stats });
      console.log('detailed-search-results', filteredRecords);
      console.log('stats', stats);
    } else {
      event.reply('search-failure', '文件不存在');
    }
  });

  //银行卡查询
  ipcMain.on('get-cards', (event) => {
    //const filePath = path.join(__dirname, 'data.xlsx');
    //const filePath = path.join(app.getAppPath(), 'data.xlsx');  // 使用 app.getAppPath() 获取应用的根路径
    // 使用 process.resourcesPath 获取资源路径
    const filePath = path.join(process.resourcesPath, 'data.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = xlsx.readFile(filePath);
      const ws = wb.Sheets['records'];
      const records = xlsx.utils.sheet_to_json(ws, { header: 1 });
      records.shift(); // 删除表头

      const cards = [...new Set(records.map(record => record[5]))];
      event.reply('cards-data', cards);
    } else {
      event.reply('cards-failure', '文件不存在');
    }
  });



  ipcMain.on('search-records-by-card', (event, { card, startDate, endDate }) => {
    //const filePath = path.join(__dirname, 'data.xlsx');
    //const filePath = path.join(app.getAppPath(), 'data.xlsx');  // 使用 app.getAppPath() 获取应用的根路径
    // 使用 process.resourcesPath 获取资源路径
    const filePath = path.join(process.resourcesPath, 'data.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = xlsx.readFile(filePath);
      const ws = wb.Sheets['records'];
      const records = xlsx.utils.sheet_to_json(ws, { header: 1 });
      records.shift(); // 删除表头

      // 过滤出银行卡匹配且日期范围内的记录
      const filteredRecords = records.filter(record => {
        const recordDate = new Date(record[1]);
        return record[5] === card && recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
      });

      // 计算统计结果
      const stats = filteredRecords.reduce((acc, record) => {
        const amount = parseFloat(record[4]);
        if (record[2] === '收入') {
          acc.income += amount;
        } else {
          acc.expense += amount;
        }
        acc.total = acc.income - acc.expense;
        return acc;
      }, { income: 0, expense: 0, total: 0 });

      // 返回所有相关信息
      event.reply('card-search-results', { records: filteredRecords, stats });
      console.log('card-search-results', filteredRecords);
      console.log('stats', stats);
    } else {
      event.reply('search-failure', '文件不存在');
    }
  });

  //导出Excel文件
  ipcMain.on('show-save-dialog', (event) => {
    dialog.showSaveDialog(win, {
      title: '导出Excel文件',
      defaultPath: '账目信息.xlsx',
      filters: [
        { name: 'Excel文件', extensions: ['xlsx'] }
      ]
    }).then(result => {
      if (!result.canceled) {
        const filePath = result.filePath;
        //const dataFilePath = path.join(__dirname, 'data.xlsx');
        //const dataFilePath = path.join(app.getAppPath(), 'data.xlsx');  // 确保获取正确的路径
        // 使用 process.resourcesPath 获取资源路径
        const dataFilePath = path.join(process.resourcesPath, 'data.xlsx');
        if (fs.existsSync(dataFilePath)) {
          const wb = xlsx.readFile(dataFilePath);
          const ws = wb.Sheets['records'];
          const records = xlsx.utils.sheet_to_json(ws, { header: 1 });

          const newWb = xlsx.utils.book_new();
          const newWs = xlsx.utils.aoa_to_sheet(records);
          xlsx.utils.book_append_sheet(newWb, newWs, 'records');

          xlsx.writeFile(newWb, filePath);
          event.reply('export-excel-success', filePath);
        } else {
          event.reply('export-excel-failure', '数据文件不存在');
        }
      }
    }).catch(err => {
      console.error('导出Excel文件时出错:', err);
      event.reply('export-excel-failure', '导出Excel文件时出错');
    });
  });

  //删除账目
  ipcMain.on('get-records', (event) => {
    //const filePath = path.join(__dirname, 'data.xlsx');
    //const filePath = path.join(app.getAppPath(), 'data.xlsx'); // 使用 app.getAppPath() 获取应用的根路径
    // 使用 process.resourcesPath 获取资源路径
    const filePath = path.join(process.resourcesPath, 'data.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = xlsx.readFile(filePath);
      const ws = wb.Sheets['records'];
      const records = xlsx.utils.sheet_to_json(ws, { header: 1 });
      records.shift(); // 删除表头

      event.reply('records-data', records);
    } else {
      event.reply('records-failure', '数据文件不存在');
    }
  });

  ipcMain.on('delete-record', (event, recordIndex) => {
    //const filePath = path.join(__dirname, 'data.xlsx');
    //const filePath = path.join(app.getAppPath(), 'data.xlsx'); // 使用 app.getAppPath() 获取应用的根路径
    // 使用 process.resourcesPath 获取资源路径
    const filePath = path.join(process.resourcesPath, 'data.xlsx');
    if (fs.existsSync(filePath)) {
      const wb = xlsx.readFile(filePath);
      const ws = wb.Sheets['records'];
      const records = xlsx.utils.sheet_to_json(ws, { header: 1 });
      records.shift(); // 删除表头

      if (recordIndex >= 0 && recordIndex < records.length) {
        records.splice(recordIndex, 1); // 删除指定索引的记录

        const newWs = xlsx.utils.aoa_to_sheet([["项目类别", "日期", "类型", "用途", "金额", "银行卡"], ...records]);
        wb.Sheets['records'] = newWs;
        xlsx.writeFile(wb, filePath);

        event.reply('delete-record-success');
      } else {
        event.reply('delete-record-failure', '无效的记录索引');
      }
    } else {
      event.reply('delete-record-failure', '数据文件不存在');
    }
  });

  ipcMain.on('exit-app', () => {
    app.quit();
  });


