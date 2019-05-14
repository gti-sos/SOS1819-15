describe("Automatization test from sportsCompetitions UI - D02 - ",function () {
    
    it("List shows more than 1 items", function (){
        browser.get("http://localhost:8080/#!/ui/v1/sports-competitions/");
        var competitions = element.all(by.repeater("comp in competitions"));
        expect(competitions.count()).toBeGreaterThan(1);
    });
    
    it("List should grow after the contact creation", function (){
        browser.get("http://localhost:8080/#!/ui/v1/sports-competitions/#!/");
        
                element(by.model('newCompetition.id')).sendKeys('14');
                element(by.model('newCompetition.year')).sendKeys('2019');
                element(by.model('newCompetition.day')).sendKeys('1');
                element(by.model('newCompetition.month')).sendKeys('11');
                element(by.model('newCompetition.name')).sendKeys('Maratón de la ONCE el 1/11');
                element(by.model('newCompetition.lengthactivity')).sendKeys('6');
                element(by.model('newCompetition.activity')).sendKeys('Maratón');
                element(by.model('newCompetition.totaldistance')).sendKeys('45');
                element(by.model('newCompetition.inscriptionprice')).sendKeys('5');
                element(by.model('newCompetition.sportcenter')).sendKeys('Sevilla Centro');
                //element(by.model('newCompetition.schoolcenter')).sendKeys('');
                element(by.css(".addCompetition")).click();
                
                var resultModal = element(by.css(".alert-msg"));
                expect(resultModal.getText()).toContain('Se ha añadido la nueva competición.');

            });
            
    it("delete one element ", function () {
        browser.get("http://localhost:8080/#!/ui/v1/sports-competitions/#!/");

        element.all(by.css(".btn-eliminar")).last().click();
        
        var competitions = element.all(by.repeater("comp in competitions"));
        expect(competitions.count()).toBeLessThan(14);
    });
});
    