describe("Data is loaded", function(){
    it("should show a bunch of data", function (){
        browser.get("http://localhost:8080/ui/v1/educations-centers/#!/edit/1");
        //browser.driver.sleep(2000);
        var elm = element(by.model("name_edit"));
        elm.getAttribute('value').then(function (value) {
            console.log("test");
            console.log(value);
        });
        expect(browser.getTitle()).toEqual('Title');
    });
});