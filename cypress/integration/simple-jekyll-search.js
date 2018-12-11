describe('Simple Jekyll Search', function () {
  it('Searching a Post', function () {
    cy.visit('http://localhost:4000')

    cy.get('#search-input')
      .type('This')

    cy.get('#results-container')
      .contains('This is just a test')
  })

  it('Searching a Post follows link with query', function () {
    cy.visit('http://localhost:4000')

    cy.get('#search-input')
      .type('This')

    cy.get('#results-container')
      .contains('This is just a test')
      .click()

    cy.url().should('include', '?query=This')
  })

  it('No results found', function () {
    cy.visit('http://localhost:4000')

    cy.get('#search-input')
      .type('404')

    cy.contains('No results found')
  })
})
