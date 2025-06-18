import {
  FC,
  CSSProperties,
  ReactNode,
  useEffect,
  useState,
  useRef,
} from "react";
import type { JSX } from "react";
import classNames from "classnames";
import { MotionSlideIn } from "@/components/shared/Motions";

import styles from "./Text.module.scss";

interface TextProps {
  element: keyof JSX.IntrinsicElements;
  as?: "heading" | "paragraph";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;

  /**
   * The `as` prop determines the styling of the text:
   * - "heading" applies text-wrap balanced
   * - "paragraph" applies text-wrap pretty
   */
}

interface AnimatedTextProps extends TextProps {
  delayIndex?: number;
}

/**
 * A simple text component that can be styled as a heading or paragraph.
 */
const Text: FC<TextProps> = ({
  element: Element,
  as,
  className,
  style = {},
  children,
}) => (
  <Element
    className={classNames(className, as ? styles[as] : "")}
    style={style}
  >
    {children}
  </Element>
);

/**
 * A text component that animates when it comes into the viewport.
 *
 * @param element - The HTML element to render.
 * @param as - Determines the styling of the text ("heading" or "paragraph").
 * @param className - Optional additional class names to apply.
 * @param delayIndex - Optional delay index for the animation.
 * @param children - The content to be animated.
 */
export const AnimatedText: FC<AnimatedTextProps> = ({
  element,
  as,
  className,
  delayIndex = 0,
  children,
}) => (
  <MotionSlideIn
    element={element}
    delayIndex={delayIndex}
    className={classNames(className, as ? styles[as] : "")}
  >
    {children}
  </MotionSlideIn>
);

/**
 * Wrapper for gradient text.
 * The children component should contain a <strong> element,
 * which is what will be styled with the gradient.
 *
 * The `gradient` prop should be a linear gradient string.
 *
 * Example usage:
 *
 * <GradientText gradient="linear-gradient(to right, red, yellow)">
 *   <strong>Your Text Here</strong>
 * </GradientText>
 *
 * Note: If it doesn't work with the gradient prop
 * (maybe b/c of dynamically importing the component),
 * set the --gradient CSS variable for the element in the
 * component CSS file.
 */
export const GradientText: FC<{
  gradient?: string;
  fallbackColor?: string;
  children?: ReactNode;
}> = ({ gradient, fallbackColor = "white", children }) => {
  const container = useRef(null);

  useEffect(() => {
    if (gradient && container.current) {
      container.current.style.setProperty("--gradient", gradient);
    }
  }, [container, gradient]);

  return (
    <span
      className={styles.GradientText}
      style={
        {
          ...(gradient ? { "--gradient": gradient } : {}),
          color: gradient ? fallbackColor : undefined,
        } as CSSProperties
      }
      ref={container}
    >
      {children}
    </span>
  );
};

/**
 * A vanilla CSS text component that fades in when it comes into the viewport.
 * Better performance than using a motion component. Use for hero text.
 */
export const OpacityInText: FC<AnimatedTextProps> = ({
  element,
  as,
  className,
  children,
  delayIndex = 0,
}) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setTimeout(() => setActive(true), 100);
  }, []);

  return (
    <Text
      element={element}
      as={as}
      className={classNames(
        styles.OpacityInText,
        className,
        as ? styles[as] : "",
        active ? styles.Active : "",
      )}
      style={{ "--delay": `${delayIndex * 0.175}s` } as CSSProperties}
    >
      {children}
    </Text>
  );
};

export default Text;
