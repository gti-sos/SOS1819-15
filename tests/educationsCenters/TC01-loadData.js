describe("Data is loaded", function(){
    var until = protractor.ExpectedConditions;

    it("Should show 10 centers", function (){
        browser.get("http://localhost:8080/ui/v1/educations-centers/#!/");
        var centers = element.all(by.repeater("education in educations"));
        expect(centers.count()).toBeGreaterThan(9);
    });

    it("List should show new center", function () {
        browser.get("http://localhost:8080/ui/v1/educations-centers/#!/");
        element(by.model('id')).sendKeys("0");
        element(by.model('country')).sendKeys('spain');
        element(by.model('center')).sendKeys('test center');
        element(by.model('name')).sendKeys('test name');
        element(by.model('ownership')).sendKeys('test ownership');
        element(by.model('domicile')).sendKeys('test domicile');
        element(by.model('locality')).sendKeys('test locality');
        element(by.model('phone')).sendKeys('954535353');
        element(by.model('lat')).sendKeys('12');
        element(by.model('lon')).sendKeys('21');
        element(by.tagName("select#sports_education")).click();
        browser.sleep(1000);
        element(by.css("#sports_education [value='1']")).click();
        element(by.tagName("select#monthStart")).click();
        browser.sleep(1000);
        element(by.css("#monthStart [value='1']")).click();
        element(by.css(".boton-guardar")).click();

        var resultModal = element(by.id('alert-success'));
        browser.wait(until.visibilityOf(resultModal), 5000, "Message should appear within 5 seconds");
        expect(resultModal.getText()).toContain('Creado correctamente');
    });
    it("delete", function () {
        browser.get("http://localhost:8080/ui/v1/educations-centers/#!/");
        element(by.css(".borrar0")).click();
        var resultModal = element(by.id('alert-success'));
        browser.wait(until.visibilityOf(resultModal), 5000, "Message should appear within 5 seconds");
        expect(resultModal.getText()).toContain('Borrado Correctamente');
    });
});