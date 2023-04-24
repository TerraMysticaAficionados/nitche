import React from 'react'
import { CopyButton } from './index'

describe('<CopyButton />', () => {
  it('renders', () => {
    const copyValue = "Copy Me!"
    cy.mount(<CopyButton copyValue={copyValue}/>)
    cy.window().focus();
    cy.get('[data-cy=copy-button-animated]').should("not.have.class", 'animate-copyConfirm')
    cy.get('[data-cy=copy-button-container]').click()
    cy.get('[data-cy=copy-button-animated]').should("have.class", 'animate-copyConfirm')
    cy.window().then(async (win) => {
      return win.navigator.clipboard.readText()
    }).then(clipboardText => {
      expect(clipboardText).to.eq(copyValue)
    })
  })
})