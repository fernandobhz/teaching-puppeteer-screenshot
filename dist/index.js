"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const promises_1 = __importDefault(require("fs/promises"));
function takeScreenshot(element) {
    return __awaiter(this, void 0, void 0, function* () {
        const buffer = yield element.screenshot({
            type: "png",
            encoding: "binary",
        });
        let result;
        if (Buffer.isBuffer(buffer)) {
            result = buffer;
        }
        else {
            result = new Buffer(buffer);
        }
        return result;
    });
}
function captureElementScreenshot() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        yield page.goto("https://google.com", { waitUntil: "networkidle0" });
        const element = yield page.$("body");
        if (!element) {
            throw new Error("Element not found");
        }
        let areBuffersEqual = false;
        let previousBuffer = yield takeScreenshot(element);
        let counter = 0;
        while (areBuffersEqual === false) {
            if (counter++ > 10) {
                throw new Error(`Couldn't generate a screenshot after 10 tries`);
            }
            yield page.waitForTimeout(100);
            const currentBuffer = yield takeScreenshot(element);
            areBuffersEqual = Buffer.compare(previousBuffer, currentBuffer) === 0;
            previousBuffer = currentBuffer;
        }
        yield promises_1.default.writeFile('./screenshot.png', previousBuffer);
        yield browser.close();
    });
}
captureElementScreenshot();
//# sourceMappingURL=index.js.map