"use client";

import { useId, useState } from "react";

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
};

export default function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const baseId = useId();

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      setActiveTab(nextIndex);

      const nextTab = document.getElementById(
        `${baseId}-tab-${nextIndex}`
      );

      nextTab?.focus();
    }
  }

  if (tabs.length === 0) {
    return null;
  }

  const active = tabs[activeTab];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Example tabs"
      >
        {tabs.map((tab, index) => {
          const tabId = `${baseId}-tab-${index}`;
          const panelId = `${baseId}-panel-${index}`;

          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={activeTab === index}
              aria-controls={panelId}
              tabIndex={activeTab === index ? 0 : -1}
              onClick={() => setActiveTab(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeTab}`}
        tabIndex={0}
      >
        {active.content}
      </div>
    </div>
  );
}