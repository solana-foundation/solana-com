import { Children, createElement } from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import Button from "../shared/Button";

const StyledMarkdown = styled.div`
  color: #e6e6e6;
  word-break: break-word;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #fff;
  }

  h1,
  h2,
  h3 {
    margin-top: 3rem;
    margin-bottom: 2rem;

    @media (min-width: 992px) {
      margin-top: 4rem;
    }
  }

  h4,
  h5,
  h6 {
    margin-top: 2.5rem;
    margin-bottom: 1.5rem;

    @media (min-width: 992px) {
      margin-top: 3.5rem;
    }
  }

  hr {
    margin: 1.5rem 0;
  }

  ul {
    margin-bottom: 1rem;

    li {
      margin-bottom: 0.25rem;
    }
  }

  p {
    margin-bottom: 1rem;
  }

  img {
    max-width: 100%;
  }
`;

/**
 * Displays a React Markdown section.
 * @param children
 * @returns {JSX.Element}
 * @constructor
 */
const CommonMarkdown = ({ children, ...props }) => {
  const flatten = (text, child) => {
    return typeof child === "string"
      ? text + child
      : Children.toArray(child.props.children).reduce(flatten, text);
  };

  const HeadingRenderer = (props) => {
    var children = Children.toArray(props.children);
    var text = children.reduce(flatten, "");
    var slug = text.toLowerCase().replace(/\W/g, "-");
    return createElement(
      "h" + props.level,
      { id: slug, className: `h${props.level + 2}` },
      props.children,
    );
  };

  const ImageRenderer = (props) => <img src={props.src} alt={props.alt} />;

  const ButtonRender = (props) => (
    <Button
      {...props}
      newTab={props.newtab}
      arrowRight={props.arrowright}
      noBorder={props.noborder}
      className={props.classname}
    />
  );

  return (
    <StyledMarkdown>
      <ReactMarkdown
        components={{
          h1: HeadingRenderer,
          h2: HeadingRenderer,
          h3: HeadingRenderer,
          h4: HeadingRenderer,
          img: ImageRenderer,
          button: ButtonRender,
        }}
        {...props}
        rehypePlugins={[rehypeRaw]}
      >
        {children}
      </ReactMarkdown>
    </StyledMarkdown>
  );
};

export default CommonMarkdown;
