import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"

import store from "../store"


const StyledFamilySelect = styled.span`
  select {
    font-size: 16px;
  }
`

@observer
class FamilySelect extends Component {
  handleSelectFamily = (e) => {
    store.selectFamily(e.target.value)
  }

  render() {
    const familyNamesOptions = store.familyNames.map((name) => {
      return (
        <option key={name} value={name}>
          {name}
        </option>
      )
    })

    return (
      <StyledFamilySelect>
        <select
          defaultValue = {store.familyName}
          onChange     = {this.handleSelectFamily}
        >
          {familyNamesOptions}
        </select>
      </StyledFamilySelect>
    )
  }
}

export default FamilySelect
