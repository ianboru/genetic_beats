import styled from "styled-components"


const MuteTrackButton = styled.span`
  background-color: ${props => props.active ? "orange" : "gray" };
  border-radius: 2px;
  border: 1px solid black;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  height: 24px;
  margin-left: 10px;
  width: 24px;
  vertical-align: middle;
  

  &:hover {
    background-color: orange;
  }
`


export default MuteTrackButton
