import { SimpleComponentProps } from "@/types";
import styled from "styled-components";

type StyledDivProps = SimpleComponentProps<{
  color?: any;
  bgColor?: any;
  borderRadius?: any;
  shadow?: any;
}>;

const StyledDiv: React.FC<StyledDivProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

const StyledRoundedCard = styled(StyledDiv)`
  position: relative;
  z-index: 1;
  color: ${(props) => props.color ?? `#000`};
  background: ${(props) => props.bgColor ?? `#14f195`};
  border-radius: ${(props) => props.borderRadius ?? "1rem"};
`;

export default StyledRoundedCard;
