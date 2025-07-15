import React, { useState, useEffect } from 'react';

export interface Tab {
  id: string;
  component?: React.ReactNode;
  disabled?: boolean;
  isActive?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTabId?: string;
  showTabsOnBottom?: boolean;
  setActiveTab?: (tabId: string) => void;
  onTabChange?: (tabId: string) => void;
  styleProps?: React.CSSProperties;
  tabHeight?: string;
  tabStyle?: React.CSSProperties;
}

export const TabsPanel: React.FC<TabsProps> = ({
  tabs,
  activeTabId,
  showTabsOnBottom,
  setActiveTab,
  onTabChange,
  styleProps,
  tabHeight,
  tabStyle,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>(activeTabId || tabs[0]?.id || '');

  useEffect(() => {
    if (selectedTab !== activeTabId) {
      setActiveTab?.(selectedTab);
      onTabChange?.(selectedTab);
    }
  }, [selectedTab, activeTabId, setActiveTab, onTabChange]);

  const handleTabClick = (tabId: string) => {
    setSelectedTab(tabId);
  };

  const commonTabClasses = 'w-full flex items-center justify-center px-3 py-1.5 h-8 text-base cursor-pointer relative';

  return (
    <div className="cursor-pointer text-base w-[300px] text-white" style={styleProps}>
      {!showTabsOnBottom && (
        <div
          className="text-base font-normal h-[38px] p-0.5 rounded-xl flex justify-between items-center my-4"
          style={tabStyle}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={`${commonTabClasses} ${
                tab.id === selectedTab
                  ? 'bg-indigo-600 text-white rounded-[10px]'
                  : 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-black rounded-xl'
              } disabled:cursor-not-allowed disabled:opacity-80`}
            >
              {tab.id}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          height: tabHeight || undefined,
          overflowY: tabHeight ? 'scroll' : undefined,
        }}
      >
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={tab.id === selectedTab ? 'block' : 'hidden'}
            style={{
              marginBottom: showTabsOnBottom ? '20px' : '0px',
            }}
          >
            {tab.component}
          </div>
        ))}
      </div>

      {showTabsOnBottom && (
        <div className="text-base font-normal h-[38px] p-0.5 rounded-xl flex justify-between items-center my-4">
          {tabs.map((tab) => (
            <div key={tab.id} className="w-full">
              <button
                onClick={() => handleTabClick(tab.id)}
                disabled={tab.disabled}
                className={`${commonTabClasses} ${
                  tab.id === selectedTab
                    ? 'bg-white text-[#000D3D] rounded-[12px]'
                    : 'bg-transparent text-white hover:bg-gray-100 hover:text-black rounded-xl'
                } disabled:cursor-not-allowed disabled:opacity-80`}
              >
                {tab.id}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
