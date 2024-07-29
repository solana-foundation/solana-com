import InstagramHeader from "../InstagramHeader/InstagramHeader";
import styled from "styled-components";

const LayoutWrapper = styled.div`
  --color-black: #020202;
  --color-ebony: #0a050c;
  --color-shark: #1d1f21;
  --color-mamba: #848285;
  --color-parchment: #f2ead4;
  --color-concrete: #f3f3f3;
  --color-white: #ffffff;
  --color-candlelight: #ffd512;
  --color-spring-green: #19fb9b;
  --color-blue-chalk: #e7e2fe;
  --color-heliotrope: #f087ff;
  --color-electric-violet: #9945ff;
  --color-heliotrope-100: #f087ff;
  --color-medium-spring-green: #14f195;
  --color-gray: #bfbeba;
  --color-orange: #ff623a;
  --color-blue: #1fcff1;
  --color-green: #1ffdc6;
  --color-glow-yellow: #fdc169;
  --color-glow-red: #dc3075;
  --color-glow-purple: #9c48fd;
  --color-glow-green: #20f0a8;

  overflow: hidden;
`;

const InstagramLayout = ({ children }) => {
  return (
    <LayoutWrapper>
      <InstagramHeader />
      <main>{children}</main>
    </LayoutWrapper>
  );
};

export default InstagramLayout;
