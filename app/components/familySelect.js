import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import { colors } from "../colors"

import familyStore from "../stores/familyStore"


const StyledFamilySelect = styled.span`
  color :  ${colors.gray.lightest};
  select {
    font-size: 16px;
  }
`

@observer
class FamilySelect extends Component {
  handleSelectFamily = (e) => {
    familyStore.selectFamily(e.target.value)
  }

  render() {
    let familyNamesOptions = familyStore.familyNames.map((name) => {
      return (
        <option key={name} value={name}>
          {name}
        </option>
      )
    })
    familyNamesOptions.push(familyStore.familyName)
    return (
      <StyledFamilySelect>
        Current Beat Family: <select
          defaultValue = {familyStore.familyName}
          onChange = {this.handleSelectFamily}
        >
          {familyNamesOptions}
        </select>
      </StyledFamilySelect>
    )
  }
}

export default FamilySelect
