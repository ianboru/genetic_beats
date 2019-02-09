import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"
import { colors } from "../colors"

import familyStore from "../stores/familyStore"

import Button from "./button"
import Tooltip from "./tooltip"

import DevTools from "mobx-react-devtools"


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

        <Tooltip
          position = "bottom"
          text     = "Start new family (current family will be accessible)"
          minWidth = {170}
        >
          <Button
            style   = {{background : colors.gray.darkest, marginLeft : "20px"}}
            onClick = {this.newFamilyTree}
          >
            New Family
          </Button>
        </Tooltip>

        <Tooltip 
          position = "bottom"
          text     = "Clear all family data"
          minWidth = {150}
        >
          <Button 
            style   = {{background : colors.gray.darkest, marginLeft : "20px"}}
            onClick = {this.clearSavedFamilies}
          >
            Clear All
          </Button>
        </Tooltip>

        {typeof DevTools !== "undefined" ? <DevTools highlightTimeout={500000} /> : null}
      </div>
    )
  }
}

export default FamilySelect
