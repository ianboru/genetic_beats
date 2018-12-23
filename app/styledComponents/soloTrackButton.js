import styled from "styled-components"


const SoloTrackButton = styled.span`
  background-color: ${props => props.active ? "green" : "gray" };
  border-radius: 2px;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-size: 15px;
  height: 20px;
  margin: 3px;
  width: 20px;

  &:hover {
    background-color: green;
  }
`


export default SoloTrackButton
