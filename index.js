"use strict";
const { app, BrowserWindow/*, ipcMain*/ } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

let win;

// ipcMain.on("quit", (event, code) => {
//     win = null;
//     app.quit();
// });

let httpStream;

const DEBUG = process.env["RHELPER_DEBUG"] === "true";

/*
ipcMain.on("update", (event, url) => {
    httpStream = request({
        method: 'GET',
        url: url
    });
    let tmpobj = tmp.dirSync();
    let tmpDir = tmpobj.name;
    let tmpPath = path.join(tmpDir, "unpdf_setup.exe");
    let writeStream = fs.createWriteStream(tmpPath);
    httpStream.pipe(writeStream);
    let totalLength = 0, fileLength = 0;
    
    // 当获取到第一个HTTP请求的响应获取
    httpStream.on('response', (response) => {
        console.log('response headers is: ', response.headers);
        fileLength = Number(response.headers['content-length']);
    });
    
    httpStream.on('data', (chunk) => {
        totalLength += chunk.length;
        event.sender.send("download", String(totalLength), String(fileLength));
    });
    
    // 下载完成
    httpStream.on('end', () => {
        console.log('download finished');
        event.sender.send("finish");
    });
    writeStream.on("close", () => {
        console.log("writeStream Closed");
        require("child_process").exec(tmpPath, err => {
            if(err !== null) {
                fs.writeFileSync(path.join(__dirname, "log.txt"), err.stack);
            }
            console.log("install finished");
            fs.unlinkSync(tmpPath);
            tmpobj.removeCallback();
            win = null;
            app.quit();
        });
    });
});
*/
function createWindow () {
    win = new BrowserWindow({
        width: 1200,
        height: 840,
        icon: path.join(__dirname, '/src/image/logo.png'),
        background: "#ffffff",
        show: false,
        resizable: true,
    });
    
    if(!DEBUG) {
        win.setMenu(null); //TODO DIY a menu
    } else {
        win.webContents.openDevTools();
    }
    
    win.on("ready-to-show", () => {
        win.show();
        win.focus();
    });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, "/src/index.html"),
            protocol: "file:",
            slashes: true
        })
    );
    win.on("closed", () => {
        // if(httpStream) {
        //     httpStream.abort();
        // }
        win = null;
    });
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        // if(httpStream) {
        //     httpStream.abort();
        // }
        app.quit();
    }
});
app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});

process.on("uncaughtException", (err) => console.error(err));
