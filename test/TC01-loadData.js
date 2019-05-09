var fs = require('fs');
describe("Data is loaded", function(){
    it("should show a bunch of data", function (){
        var until = protractor.ExpectedConditions;
        browser.get("http://localhost:8080/ui/v1/educations-centers/#!/");
        browser.wait(until.urlIs("http://localhost:8080/ui/v1/educations-centers/#!/"), 5000);

        var centers = element.all(by.repeater("education in educations"));
        expect(centers.count()).toBeGreaterThan(0);
    });
});