import React, { useState } from "react";

export default function KeepAliveTabs({ tabs, activeTab, setActiveTab }) {
  const [mountedTabs, setMountedTabs] = useState([activeTab]);

  // Add tab to mountedTabs when activated
  React.useEffect(() => {
    if (!mountedTabs.includes(activeTab)) {
      setMountedTabs((prev) => [...prev, activeTab]);
    }
    console.log(mountedTabs);
  }, [activeTab, mountedTabs]);

  return (
    <div>
      <div>
        {tabs.map((tab, index) =>
          mountedTabs.includes(index) ? (
            <div
              key={index}
              style={{
                display: index === activeTab ? "block" : "none",
              }}
            >
              {React.createElement(tab.content)}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
