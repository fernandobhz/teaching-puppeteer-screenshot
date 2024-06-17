import puppeteer, { Browser, Page, ElementHandle } from "puppeteer";
import fs from 'fs/promises';

async function takeScreenshot(element: ElementHandle): Promise<Buffer> {
  const buffer: string | Buffer = await element.screenshot({
    type: "png",
    encoding: "binary",
  });

  let result: Buffer;

  if (Buffer.isBuffer(buffer)) {
    result = buffer;
  } else {
    result = new Buffer(buffer);
  }

  return result;
}

async function captureElementScreenshot(): Promise<void> {
  const browser: Browser = await puppeteer.launch();
  const page: Page = await browser.newPage();

  await page.goto("https://google.com", { waitUntil: "networkidle0" });

  const element: ElementHandle | null = await page.$("body");

  if (!element) {
    throw new Error("Element not found");
  }

  let areBuffersEqual: boolean = false;
  let previousBuffer = await takeScreenshot(element);
  let counter = 0;

  while (areBuffersEqual === false) {
    if (counter++ > 10) {
        throw new Error(`Couldn't generate a screenshot after 10 tries`);
    }

    await page.waitForTimeout(100);
    const currentBuffer = await takeScreenshot(element);
    areBuffersEqual = Buffer.compare(previousBuffer, currentBuffer) === 0;

    previousBuffer = currentBuffer;
  }

  await fs.writeFile('./screenshot.png', previousBuffer);
  await browser.close();
}

captureElementScreenshot();
