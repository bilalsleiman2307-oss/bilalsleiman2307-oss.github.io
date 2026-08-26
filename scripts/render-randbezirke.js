const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const samples = [
    ['heiligensee','schlüsseldienst-heiligensee/index.html',1440,1000],
    ['buch-mobile','schlüsseldienst-buch/index.html',390,844],
    ['franzoesisch-mobile','schlüsseldienst-franzoesisch-buchholz/index.html',390,844]
  ];
  for (const [name,file,width,height] of samples) {
    const page = await browser.newPage({viewport:{width,height}});
    const url = `file:///${path.resolve(file).replaceAll('\\','/')}`;
    await page.goto(url);
    await page.addStyleTag({path:'assets/css/styles.css'});
    await page.screenshot({path:`../${name}.png`,fullPage:true});
    const result = await page.evaluate(() => ({
      h1Count: document.querySelectorAll('h1').length,
      h1Width: Math.round(document.querySelector('h1').getBoundingClientRect().width),
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      schemaCount: document.querySelectorAll('script[type="application/ld+json"]').length
    }));
    console.log(name, result);
    await page.close();
  }
  await browser.close();
})();
