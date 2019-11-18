 static checkTotalTable(DBRecords, maxRecordsPerPage, isAdmin = false) {
        const HtmlTableToJson = require('html-table-to-json');
        const numOfPages = Math.ceil(DBRecords.length / maxRecordsPerPage);
        var startId = 0;
        var endId = 0;
        let SliceTable = [];
        let jsonTables;
        if (DBRecords.length <= maxRecordsPerPage) {
            cy.get('table').then(tb => {
                const jsonTables = new HtmlTableToJson(tb[0].outerHTML)
                cy.log(jsonTables.results[0]);
                expect(DBRecords).to.deep.equals(jsonTables.results[0]);
            })
        } else {
            for (var i = 1; i <= numOfPages; i++) {
                startId = (i - 1) * maxRecordsPerPage;
                endId = (i * maxRecordsPerPage);
                SliceTable = DBRecords.slice(startId, endId);
                if (i == numOfPages) {
                    SliceTable = DBRecords.slice(startId);
                }
                this.goToNthPage(i, isAdmin);
                cy.wait(2000);
                let closureFun = (SliceTable) => {
                     cy.get('table').then(tb => {
                         console.log(SliceTable);
                        jsonTables = new HtmlTableToJson(tb[0].outerHTML)
                        resolve(jsonTables.results[0]);
                    });
                }
                closureFun(SliceTable);
                cy.get('table').then(tb => {
                        jsonTables = new HtmlTableToJson(tb[0].outerHTML)
                        resolve(jsonTables.results[0]);
                });                
                var promise1 = new Promise(function (resolve) {
                    cy.get('table').then(tb => {
                        jsonTables = new HtmlTableToJson(tb[0].outerHTML)
                        resolve(jsonTables.results[0]);
                    });
                })
                promise1.then(function (value) {
                    cy.log("This is paused at 1");
                    cy.log(SliceTable);
                    // expect(SliceTable).to.deep.equals(value);
                });
            }
        }
    }