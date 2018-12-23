import styled from "styled-components"


const MuteTrackButton = styled.span`
  background-color: ${props => props.active ? "orange" : "gray" };
  border-radius: 2px;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-size: 15px;
  height: 20px;
  margin: 3px;
  margin-left: 10px;
  width: 20px;

  &:hover {
    background-color: orange;
  }
`


export default MuteTrackButton
