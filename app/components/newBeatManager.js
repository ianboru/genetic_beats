import React, { Component } from "react"
import { Redirect } from "react-router"
import { observer } from "mobx-react"
import styled from "styled-components"
import chroma from "chroma-js"

import beatTemplates from "../beatTemplates"
import { colors } from "../colors"

import store from "../stores/store"
import familyStore from "../stores/familyStore"

import Button from "./button"
import TemplateBeats from "./templateBeats"



const NewBeatHeader = styled.div`
  font-size: 32px;
  font-family: "Hind Madurai";
`

const StyledNewBeatPanel = styled.div`
  background-color: ${colors.gray.darkest};
  border-top: 1px solid ${colors.gray.light};
  font-family: "Hind Madurai";
  padding: 10px;
  text-align: center;
`


@observer
class NewBeatManager extends Component {
  state = {
    redirectToTemplateBeats : false,
  }

  addEmptyBeat = () => {
    familyStore.addEmptyBeatToCurrentGeneration()
  }

  render() {
    if (this.state.redirectToTemplateBeats) {
      return <Redirect to="/templates/" />
    }
    return (
      <StyledNewBeatPanel>
        <NewBeatHeader style={{fontSize : "25pt"}}>
          Genetic Beats
        </NewBeatHeader>
        <NewBeatHeader style={{fontSize : "20pt"}}>
          start your beat family 
        </NewBeatHeader>
        <div>
          <Button
            large
            color={[colors.green.base, chroma("green").brighten(1.2)]}
            onClick={this.addEmptyBeat}
          >
              Add Empty Beat
          </Button>
          &nbsp; or &nbsp;
          <Button
            large
            color={[colors.green.base, chroma("green").brighten(1.2)]}
            onClick={()=>{
              this.setState({ redirectToTemplateBeats : true })
            }}
          >
            Add Preset Beat
          </Button>
        </div>
      </StyledNewBeatPanel>
    )
  }
}


export default NewBeatManager
