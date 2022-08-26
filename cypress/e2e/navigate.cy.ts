/// <reference types="Cypress" />
describe('empty spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
    cy.get('[name="nav-about"]').click()
    cy.wait(1000)
    cy.get('[name="nav-settings"]').click()
    cy.wait(1000)
    cy.get('[name="nav-play"]').click()
    cy.wait(1000)
    cy.get('[x-note="A3"]').trigger('mousedown')
    cy.wait(1000)
    cy.get('[x-note="A3"]').trigger('mouseup')
  })
})