var fs = require('fs');
describe("Data is loaded", function(){

    var until = protractor.ExpectedConditions;

    it("should show a bunch of data", function (){
        browser.get("http://localhost:8080/ui/v1/educations-centers/#!/");
        var centers = element.all(by.repeater("education in educations"));
        expect(centers.count()).toBeGreaterThan(0);
    });

    it("Should create an item with event test", function () {
        browser.get("http://localhost:8080/ui/v1/educations-centers/#!/");
        //browser.wait(until.urlIs("http://localhost:8080/ui/v1/educations-centers/#!/"), 5000);
        element(by.model('id')).sendKeys("0");
        element(by.model('country')).sendKeys('1999');
        element(by.model('center')).sendKeys('99');
        element(by.model('name')).sendKeys('199');
        element(by.model('ownership')).sendKeys('99');
        element(by.model('domicile')).sendKeys('testType1');
        element(by.model('locality')).sendKeys('testType1');
        element(by.model('phone')).sendKeys('5676567');
        element(by.model('lat')).sendKeys('3423');
        element(by.model('lon')).sendKeys('423');
        element(by.tagName("select#sports_education")).click();
        browser.sleep(1000);
        element(by.css("#sports_education [value='1']")).click();
        element(by.tagName("select#monthStart")).click();
        browser.sleep(1000);
        element(by.css("#monthStart [value='1']")).click();
        //element(by.buttonText('Guardar')).click();
        element(by.css(".boton-guardar")).click();


        var resultModal = element(by.id('alert-success'));
        browser.wait(until.visibilityOf(resultModal), 5000, "Result Modal took to long to appear");
        expect(resultModal.getText()).toContain('Creado correctamente');
        //element(by.css('[ng-click="closeThisDialog(0)"]')).click();

    });
    it("delete", function () {
        browser.get("http://localhost:8080/ui/v1/educations-centers/#!/");
        //browser.wait(until.urlIs("http://localhost:8080/ui/v1/educations-centers/#!/"), 5000);

        element(by.css(".borrar0")).click();

        var resultModal = element(by.id('alert-success'));
        browser.wait(until.visibilityOf(resultModal), 5000, "Result Modal took to long to appear");
        expect(resultModal.getText()).toContain('Borrado Correctamente');
        //element(by.css('[ng-click="closeThisDialog(0)"]')).click();

    });
});