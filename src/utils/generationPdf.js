import puppeteer from 'puppeteer';
import fs from "fs-extra"

export const generationPdf = async() =>{
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent("<h1>hello</h1>");
        await page.emulateMedia('screen');

        await page.pdf({
            path:"mypdf.pdf",
            format:"A4",
            printBackgound:true
        })

        console.log("done")
        await browser.close();
        process.exit();
    } catch (error) {
        return error
    }
}