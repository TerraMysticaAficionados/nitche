import React from 'react'
import { BroadcastButton } from './index'

describe('<BroadcastButton />', () => {
  it('renders', () => {
    const copyValue = "Copy Me!"
    const onEndBroadcastConfirm = cy.stub();
    const onStartBroadcastConfirm = cy.stub();
    cy.mount(<BroadcastButton 
      initialBroadcastingState={false}
      onEndBroadcastConfirm={onEndBroadcastConfirm}
      onStartBroadcastConfirm={onStartBroadcastConfirm}
    />)

    expect(onEndBroadcastConfirm).to.not.be.called
    expect(onStartBroadcastConfirm).to.not.be.called
    cy.get('[data-cy=broadcasting-button]').should("have.text", "OFFLINE").click().then(() => {
      expect(onStartBroadcastConfirm).to.be.calledOnce
      expect(onEndBroadcastConfirm).to.not.be.called
    }).should("have.text", "BROADCASTING").click().then(() => {
      expect(onEndBroadcastConfirm).to.be.calledOnce
      expect(onStartBroadcastConfirm).to.be.calledOnce
    }).should("have.text","OFFLINE")
  })
})