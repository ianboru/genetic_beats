import React, { Component } from "react"
import { observer } from "mobx-react"
import styled from "styled-components"

import familyStore from "./familyStore"
import { colors } from "./colors"

import Button from "./components/button"
import Header from "./styledComponents/header"
import MatingControls from "./components/matingControls"
import FamilyTree from "./components/familyTree"

import DevTools from "mobx-react-devtools"


const BackgroundText = styled.div`
  left: 10px;
  right: 10px;
  bottom: 40px;
  position: absolute;
`

const BigText = styled.div`
  display: ${props => props.inlineBlock ? "inline-block" : "block"};
  color: #555;
  font-family: "Hind Madurai";
  font-size: 50px;
  vertical-align: middle;
  text-align: center;
`

const Footer = styled.div`
  background: ${colors.gray.darkest};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  padding: 0px 3px;
  box-sizing: border-box;
`

const InfoRow = styled.div`
  text-align: center;
  color: gray;
  font-size: 16px;
  padding: 10px;
`

const PanelLabel = styled.div`
  font-size: 28px;
  font-family: "Hind Madurai";
  margin: 0 0 5px;

  &::after {
    content: "";
    clear: both;
    display: table;
  }
`


@observer
class FamilyTreeDisplay extends Component {
  render() {
    return (
      <div>
        <Header>
          <PanelLabel>
            <Button large color={[colors.green.base]} onClick={this.handleMate}>
              Mate {familyStore.selectPairMode ? "Selected Beats" : "Generation"}
            </Button>
            <br/>
            <Button
              active  = {familyStore.selectPairMode}
              onClick = {familyStore.toggleSelectPairMode}
            >
              Select beats to mate
            </Button>

            <MatingControls />
          </PanelLabel>
        </Header>

        <BackgroundText>
          <BigText>
            Family Tree
          </BigText>
        </BackgroundText>

        <FamilyTree
          height     = {this.props.familyTreeHeight}
          width      = {this.props.familyTreeWidth}
          familyTree = {familyStore.allGenerations}
        />

        <Footer>
          <InfoRow>
            scroll to zoom
          </InfoRow>
        </Footer>
        {typeof DevTools !== "undefined" ? <DevTools /> : null}
      </div>
    )
  }
}


export default FamilyTreeDisplay
