/// <reference types="cypress" />

describe('download documents', () => {
  it('downloads all documents', () => {
    // fails at 3969 because it's not in the overview list
    var minDocument = 3900
    var maxDocument = 3982
    for (var i = minDocument; i < maxDocument + 1; i++) {
      cy.visit(`https://www.dekamer.be/kvvcr/showpage.cfm?section=/flwb&language=nl&cfm=/site/wwwcfm/flwb/flwbn.cfm?lang=N&legislat=55&dossierID=${i}`)
      var found = true
      cy.get('#Story').then(story => {
        if (story[0].textContent.includes('not found')) {
          console.log('not found', i)
        } else {
          cy.contains('b', 'Document Kamer').parent().parent()
            .then(documentElement => {
              const unavailable = (documentElement[0].textContent.includes('niet beschikbaar'));
              if (unavailable) {
                console.log('document not available', i);
              } else {
                downloadDocument();
              }
            })
        }
      });
    }
  })

  function downloadDocument() {
    cy.contains('b', 'Document Kamer').parent().parent()
      .find('a img.picto').parent()
      .should('have.attr', 'href')
      .then((href) => {
        const url = 'https://www.dekamer.be' + href
        const filename=href.substring(href.lastIndexOf('/') + 1, href.length)
        cy.downloadFile(url, 'Downloads',filename)
      })
  }

})
