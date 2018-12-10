import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import { colors } from "../colors"

import store from "../store"


const StyledFamilySelect = styled.span`
  color :  ${colors.gray.lightest};
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
    let familyNamesOptions = store.familyNames.map((name) => {
      return (
        <option key={name} value={name}>
          {name}
        </option>
      )
    })
    familyNamesOptions.push(store.familyName)
    return (
      <StyledFamilySelect>
        Current Beat Family: <select
          defaultValue = {store.familyName}
          onChange = {this.handleSelectFamily}
        >
          {familyNamesOptions}
        </select>
      </StyledFamilySelect>
    )
  }
}

export default FamilySelect
