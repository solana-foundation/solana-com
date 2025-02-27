import { createContext, useContext } from "react";
import cx from "classnames";

import styles from "./tabs.module.scss";

const TabContext = createContext({});
const Tabs = ({ children, onChange, activeKey }) => {
  const tabs = children.map((child) => (
    <button
      key={child.props.tab}
      onClick={() => onChange(child.props.tab)}
      className={cx(styles.tabBtn, {
        [styles.tabBtnSelected]: activeKey == child.props.tab,
      })}
    >
      {child.props.title}
    </button>
  ));

  return (
    <TabContext.Provider value={{ activeKey, onChange }}>
      <div>
        <div className={styles.tabsContainer}>{tabs?.length > 1 && tabs}</div>
        {children}
      </div>
    </TabContext.Provider>
  );
};

const TabPane = ({ children, tab }) => {
  const { activeKey } = useContext(TabContext);
  return activeKey === tab && <div>{children}</div>;
};

Tabs.TabPane = TabPane;

export default Tabs;
