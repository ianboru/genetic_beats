import styled from "styled-components"
import chroma from "chroma-js"
import {colors, newColors} from "../colors"

const buttonColor = newColors.purple.base
const altColor = newColors.blue.lighter

const Button = styled.button.attrs({
  color: (props) => (props.color && props.color[0]) || buttonColor,
  altcolor: (props) =>
    (props.color && props.color[1]) ||
    (props.color && props.color[0] && chroma(props.color[0]).brighten(0.5)) ||
    altColor,
})`
  background: ${(props) => props.color};
  border-radius: 3px;
  border: 0;
  color: ${(props) => (props.textColor ? props.textColor : "white")};
  font-family: "Ubuntu";
  cursor: pointer;
  font-size: 15px;
  margin: 6px 3px;
  padding: 8px 12px;
  transition: all 0.2s;
  min-width: ${(props) => props.width || 100}px;

  &:hover {
    background: linear-gradient(0deg, ${chroma(newColors.purple.base).darken(0.2)} 0%, ${chroma(newColors.blue.light).darken(0.2)} 100%);
  }

  &:active {
    background: linear-gradient(0deg, ${chroma(newColors.purple.base).brighten(0.2)} 0%, ${chroma(newColors.blue.light).brighten(0.2)} 100%);
  }
`

export default Button
