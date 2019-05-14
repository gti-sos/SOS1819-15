describe("Comprobar si se cumple las pruebas automatizadas e2e - D02 - ",function () {
    
    it("List shows more than 1 items", function (){
        browser.get("http://localhost:8080/ui/v1/sports-centers/");
        var contacts = element.all(by.repeater("sptc in sportscenters"));
        expect(contacts.count()).toBeGreaterThan(1);
    });
    
     it("List should grow after the contact creation", function (){
        browser.get("http://localhost:8080/ui/v1/sports-centers/#!/");
        
                element(by.model('id')).sendKeys('21');
                element(by.model('street')).sendKeys('Tarfia');
                element(by.model('name')).sendKeys('C.D. Tarfia');
                element(by.model('postalcode')).sendKeys('41012');
                element(by.model('startingyear')).sendKeys('1989');
                element(by.model('surface')).sendKeys('4000');
                element(by.model('activity')).sendKeys('Tenis');
                element(by.model('paviment')).sendKeys('Cesped Artifical');
                element(by.model('sportfields')).sendKeys('4');
                element(by.css(".boton-crear")).click();
                
                var resultModal = element(by.css(".alert-success"));
                expect(resultModal.getText()).toContain('Creado correctamente');

            });
    
      it("delete one element ", function () {
        browser.get("http://localhost:8080/ui/v1/sports-centers/#!/edit");

        element(by.css(".paginacion")).click();
        element.all(by.css(".boton-eliminar")).last().click();

        var resultModal = element(by.css(".alert-success"));
        expect(resultModal.getText()).toContain('Borrado Correctamente');

    });
});
    