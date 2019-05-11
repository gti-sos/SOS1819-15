describe("Check if data is loaded: ",function () {
    it("List shows more than 3 items", function (){
        browser.get("http://localhost:8080/ui/v1/sports-centers/");
        var contacts = element.all(by.repeater("sptc in sportscenters"));
        expect(contacts.count()).toBeGreaterThan(0);
    });
});