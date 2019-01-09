import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import { colors } from "../colors"

import familyStore from "../stores/familyStore"

import Button from "./button"

//import DevTools from "mobx-react-devtools"


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

  newFamilyTree = () => {
    if (confirm("Are you sure you want to start a new family tree?")) {
      window.location.reload()
    }
  }

  clearSavedFamilies = () => {
    if (confirm("Are you sure you want to clear all families?")) {
      familyStore.clearSavedFamilies()
      window.location.reload()
    }
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
      <div style={{marginLeft: "15px", marginBottom: "25px"}} >
        <StyledFamilySelect>
          Current Beat Family: <select
            defaultValue = {familyStore.familyName}
            onChange = {this.handleSelectFamily}
          >
            {familyNamesOptions}
          </select>
        </StyledFamilySelect>

        <Button style={{background : colors.gray.darkest, marginLeft : "20px"}} title="Start new family" onClick={this.newFamilyTree}>
          New Family
        </Button>

        <Button style={{background : colors.gray.darkest, marginLeft : "20px"}} title="Clear all saved families" onClick={this.clearSavedFamilies}>
          Clear All
        </Button>

        {typeof DevTools !== "undefined" ? <DevTools highlightTimeout={500000} /> : null}
      </div>
    )
  }
}

export default FamilySelect
