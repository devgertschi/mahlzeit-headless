import * as puppeteer from "puppeteer-core";




(async () => {
  /**
   * Start the browser and save a handle to it.
   *
   * (change executablePath to where chrome is - depending on your OS or env.)
   */
  const options = {
    headless: true,
    executablePath: "/usr/bin/google-chrome-stable",
    devtools: true,
    args: ["--window-position=0,0", "--window-size=1600,950",  "--no-sandbox", "--disable-dev-shm-usage"],
  };
  const browser: puppeteer.Browser = await puppeteer.launch(options);



  try {
    /**
     * Open a new window in the browser.
     */
    const page = await browser.newPage();
    await page.setViewport({
      width: 1025,
      height: 800,
      deviceScaleFactor: 1,
    });



    /**
     * Navigate to the page.
     */
    console.log('navigate to the page');
    await page.goto("https://www.mahlzeit.online");
    await page.bringToFront();



    /**
     * Log in.
     */
    console.log('log in');
    await page.click('.home-login-js');

    await Promise.all([
      page.waitForNetworkIdle(),
      page.waitForSelector('#LoginForm')
    ]);

    await page.type('#login_email', process.env.SECRET_FOOD_EMAIL ?? 'gerhard.kocher@hokify.com');
    await page.type('#login_password', process.env.SECRET_FOOD_PASSWORD ?? 'simon123');
    if(!options.headless) await page.waitForTimeout(500);
    await page.click('#login_submit');

    await Promise.all([
      page.waitForNetworkIdle(),
      page.waitForSelector('#speisekarten')
    ]);



    /**
     * Open all the menu-rows.
     */
    console.log('open all the menu-rows');
    await page.$$eval(
      '.tageskarte-wochentag-liste-aufklappbar',
        elHandles => elHandles.forEach(el => (<HTMLElement> el).click())
    );



    /**
     * Remove all food from selection.
     */
    console.log('remove all food from selection');
    const selections = await page.$$('.qtyEinzelbesteller')

    await Promise.all(selections.map(async item => {
      const quantityElement = await item.$('.qtyDisplay');
      let quantity = await quantityElement?.evaluate(i => i.textContent) ?? 0;
      while (quantity > '0') {
        try {
          const minusElement = await item.$('.qtyButtonMinus');
          await minusElement?.click();
          quantity = await quantityElement?.evaluate(i => i.textContent) ?? 0;
        } catch (_e) {
          break;
        }
      }
    }));



    /**
     * Get the new selection (example: from process-arguments)
     */
    console.log('get the new selection');
    const iWantThis = process.argv[2] ?? 'Eiernockerl';
    if(iWantThis) {
      console.log('order food:', iWantThis);

      const [ foundMeal ] = await page.$x(
        `//div[@style=""]//li[contains(@class, 'speisekarte-liste-bestellsystem')]//li[contains(., '${iWantThis}')]`
      );



      /**
       * Error if no meal is found.
       */
      if(!foundMeal) {
        throw new Error('no food for you!');
      }



      /**
       * Meal found: highlight it (just for you to see) and order it, of course.
       */
      if(!options.headless) {
        await foundMeal.evaluate(meal => {(<HTMLElement> meal).style.color = 'red'});
        await page.waitForTimeout(500);
      }

      const [ mealRow ] = await foundMeal.$x('..');
      const addButton = await mealRow?.$('.qtyButtonPlus');
      await addButton?.click();
    }



    /**
     * Confirm the order.
     */
    await page.click('#openBestellkontrolle');
    await page.waitForNetworkIdle();



    console.log('end');
  } catch (e) {
    console.log('ERROR caught:', (<Error>e).message);
  } finally {
    /**
     * Close the browser at the end (if it's headless, otherwise let it open for us to see something.)
     */
    if (options.headless) {
      await browser.close();
    }
  }
})();
