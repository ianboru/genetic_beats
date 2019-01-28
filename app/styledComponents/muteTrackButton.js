import chroma from "chroma-js"
import styled from "styled-components"


const MuteTrackButton = styled.span`
  background-color: ${props => props.active ? "darkorange" : "gray" };
  border-radius: 2px;
  border: 1px solid black;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  margin-left: 10px;
  height: 24px;
  width: 24px;
  vertical-align: middle;

  &:hover {
    background-color: ${props => props.active ? "darkorange" : chroma("darkorange").brighten() };
  }
`


export default MuteTrackButton
