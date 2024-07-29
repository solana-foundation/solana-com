import Button from "../shared/Button";
import styled from "styled-components";

const StyledIndexBtn = styled(Button)`
  &.btn {
    background: linear-gradient(
      101.81deg,
      #f087ff -4.52%,
      #6e1fce 54.5%,
      rgba(110, 31, 206, 0.2) 101.41%
    );
    color: #fff;

    &:hover {
      background: #fff;
      color: #000;
    }
  }
`;

const IndexBtn = ({ children, ...props }) => {
  return <StyledIndexBtn {...props}>{children}</StyledIndexBtn>;
};

export default IndexBtn;
