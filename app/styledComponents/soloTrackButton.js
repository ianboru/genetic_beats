import styled from "styled-components"


const SoloTrackButton = styled.span`
  background-color: ${props => props.active ? "green" : "gray" };
  border-radius: 2px;
  border: 1px solid black;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  margin-right: 10px;
  height: 24px;
  width: 24px;
  vertical-align: middle;

  &:hover {
    background-color: ${props => props.active ? "green" : "lightgreen" };
  }
`


export default SoloTrackButton
