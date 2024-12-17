import InvoiceDB from "../models/Invoice.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import hbs from "handlebars";
import puppeteer from 'puppeteer';
import fs from "fs-extra"
import path from "path"
import xlsx from "xlsx"
import { zip } from 'zip-a-folder';

export const generateZIP = asyncHandler(async (req, res) => {
    try {
        // const filePathDir = path.join("D:/UtilitySoftwares/invoiceGenerator/AllGeneratedPdf");
        const filePathDir = path.join("./AllGeneratedPdf");
        // const filePathEnd = path.join("D:/UtilitySoftwares/invoiceGenerator/FileShare.zip");
        const filePathEnd = path.join("./AllGeneratedPdf/../FileShare.zip");
        let data = await zip(filePathDir, filePathEnd)
        // res.status(200).json({ message: "success", data: data })
        const downlaodpath = path.join("./AllGeneratedPdf/../FileShare.zip")
        res.setHeader('Content-Type', 'application/zip')
        res.setHeader('Content-disposition', 'attachment; filename=InvoiceZip.zip');
        res.download(downlaodpath, "InvoiceZip.zip")
    } catch (error) {
        res.status(400).json({ message: "Faild", data: error })
    }
})

export const test = asyncHandler(async (req, res) => {
    try {
        let data = {}
        console.log("lunch the putter")
        const browser = await puppeteer.launch({
            headless: true, ignoreDefaultArgs: ["--disable-extensions"],
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--hide-scrollbars",
                "--disable-gpu",
                "--mute-audio",
                "--disable-dev-shm-usage"
            ],
        });
        const page = await browser.newPage();
        let content = await compileTemplete("index3", data)
        console.log("its run here content")
        // let content = await compileTemplete("mediterrance", data)
        await page.setContent(content);
        await page.setViewport({ width: 1080, height: 1024 });
        console.log("its run here")
        // genrate pdf
        await page.pdf({
            path: `./AllGeneratedPdf/${Date.now()}.pdf`,
            printBackgound: true,
            format: "A4",
        })
        await browser.close();
        res.status(200).json({ message: "Success", data: "generate done" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Faild", data: error })
    }
})

export const storeData = asyncHandler(async (req, res) => {
    try {
        let fileName = req.file.filename;
        const excelFilePath = `./public/uploads/${fileName}`;
        // Load the Excel file
        const workbook = xlsx.readFile(excelFilePath);
        // Convert the first sheet to CSV
        const sheetName = workbook.SheetNames[0];
        const csvData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        // store Data
        await InvoiceDB.deleteMany({});
        let data1 = await InvoiceDB.insertMany(csvData);
        const path = `./public/uploads/${fileName}`
        fs.remove(path).then(() => {
            console.log("Delete the Save file for Excel");
        }).catch((err) => {
            console.log(err)
        })
        res.status(200).json({ message: "Success", TotalStoreDocoment: data1.length, data: data1 })
    } catch (error) {
        res.status(400).json({ message: "Faild", data: error })
    }
})

export const generatePdf = asyncHandler(async (req, res) => {

    try {
        // Remove all the file in AllGeneratedPdf folder and regeneration
        // const filePathDir = path.join("D:/UtilitySoftwares/invoiceGenerator/AllGeneratedPdf");
        const filePathDir = path.join("./AllGeneratedPdf");
        fs.emptyDir(filePathDir)
            .then(() => console.log('All files deleted Successfully'))
            .catch(e => console.log(e))
        console.log("before the putter.lunch")
        const browser = await puppeteer.launch({
            headless: true, ignoreDefaultArgs: ["--disable-extensions"],
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--hide-scrollbars",
                "--disable-gpu",
                "--mute-audio",
                "--disable-dev-shm-usage"
            ],
        });
        console.log("after the putter.lunch")
        const db = await InvoiceDB.find();
        console.log("before the loop")
        for (let i = 0; i < db.length; i++) {
            let data = { RRN: db[i].rrn, MerchantName: db[i].customer_name, Txndate: db[i].Date, Description: db[i].description, RefId: db[i].reference_id, Txnamount: db[i].amount, MobileNumber: db[i].customer_mobile };
            console.log("Inside the loop")
            const page = await browser.newPage();
            let content = await compileTemplete("index3", data)
            console.log("its run here content")
            // let content = await compileTemplete("mediterrance", data)
            await page.setContent(content);
            await page.setViewport({ width: 1080, height: 1024 });
            console.log("its run here")
            // genrate pdf
            await page.pdf({
                path: `./AllGeneratedPdf/${db[i].rrn}.pdf`,
                printBackgound: true,
                format: "A4",
            })
        }
        await browser.close();
        // process.exit();

        res.status(200).json({ message: "Success", data: "Generated Successfully" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Faild", data: error })
    }
})

/*

!!!!!! generate file 

export const generatePdf = asyncHandler(async (req, res) => {
    let data = { Title: "hello this is title", Information: { amount: 500, description: "dfd", BillMobileNumber: "fdf", BillTo: "hell", GSTNumber: "helo", BillingCompanyAdd: "ddf", BillingCompanyName: "df", RefId: "ff", InvoiceDate: "rtr", RRN: "rtr", InvoiceNumber: "4354f" } };

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        let content = await compileTemplete("index", data)
        // set the content in pdf 
        await page.setContent(content);
        await page.emulateMedia('screen');

        // create the pdf docoment
        await page.pdf({
            path: "AllGeneratedPdf/mypdf.pdf",
            format: "A4",
            printBackgound: true
        })

        console.log("done")
        await browser.close();
        // process.exit();

        res.status(200).json({ message: "Success" })
    } catch (error) {
        res.status(400).json({ message: "Faild", data: error })
    }
})

*/


// temeplete generation function
const compileTemplete = async (templeteName, data) => {
    // const filePath = path.join("D:/UtilitySoftwares/invoiceGenerator/src/controllers/templetes", `${templeteName}.hbs`);
    const filePath = path.join("./src/controllers/templetes", `${templeteName}.hbs`);
    // get the html
    const html = await fs.readFile(filePath, "utf-8");
    return hbs.compile(html)(data)
}
