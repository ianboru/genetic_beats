import styled from "styled-components"

const SoloTrackButton = styled.span`
  background-color: ${(props) => (props.active ? "green" : "gray")};
  border-radius: 2px;
  border: 1px solid #202020;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-size: 16px;
  margin-right: 10px;
  padding-top: 2px;
  height: 22px;
  width: 24px;
  vertical-align: middle;
  text-align: center;

  &:hover {
    background-color: ${(props) => (props.active ? "green" : "lightgreen")};
  }
`

export default SoloTrackButton
