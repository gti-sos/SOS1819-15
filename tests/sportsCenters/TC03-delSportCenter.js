describe("Check if a new contact can be created",function () {
       it("delete", function () {
        browser.get("http://localhost:8080/ui/v1/sports-centers/#!/edit");

        element(by.css(".boton-eliminar")).click();

        var resultModal = element(by.css(".alert-success"));
        expect(resultModal.getText()).toContain('Borrado Correctamente');

    });
});