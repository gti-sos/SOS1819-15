describe("Check if a new contact can be created",function () {
    it("List should grow after the contact creation", function (){
        browser.get("http://localhost:8080/ui/v1/sports-centers/");
        element
            .all(by.repeater("sptc in sportscenters"))
            .then( function (initialsportsCenters) {
                
                element(by.model('sptc.id')).sendKeys('20');
                element(by.model('sptc.street')).sendKeys('Tarfia');
                element(by.model('sptc.name')).sendKeys('C.D. Tarfia');
                element(by.model('sptc.postalcode')).sendKeys('41012');
                element(by.model('sptc.startingyear')).sendKeys('1989');
                element(by.model('sptc.surface')).sendKeys('4000');
                element(by.model('sptc.activity')).sendKeys('Tenis');
                element(by.model('sptc.paviment')).sendKeys('Cesped Artifical');
                element(by.model('sptc.sportfields')).sendKeys('4');
                element(by.css('[value="env"]')).click();
                
                element
                    .all(by.repeater("sptc in sportscenters"))
                    .then( function (finalsportsCenters) {
                        expect(finalsportsCenters.length).toEqual(initialsportsCenters.length+1);
                    });
            });
    });
});
