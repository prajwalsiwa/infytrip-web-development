import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

interface TabData {
  value: string;
  label?: string;
  imgSrc: string;
  content?: React.ReactNode;
}

interface PaymentTabsProps {
  tabs: TabData[];
  defaultValue: string;
}

const PaymentTabs: React.FC<PaymentTabsProps> = ({ tabs, defaultValue }) => {
  const [selectedTab, setSelectedTab] = useState<string>(defaultValue);
  return (
    <Tabs defaultValue={defaultValue} className="w-full overflow-auto">
      <TabsList className="flex gap-2 w-full overflow-auto">
        {tabs.map((tab) => (
          <div
            className={`${
              selectedTab === tab.value ? "border-b-2 border-b-grey-700 " : ""
            }`}
          >
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => setSelectedTab(tab.value)}
              className={`flex items-center gap-2 hover:!bg-sky-100  !text-gray-dark ${
                selectedTab === tab.value ? "!bg-sky-100" : ""
              } !px-2 sm:!px-4 py-2`}
            >
              <img
                src={tab.imgSrc}
                alt={`${tab.label || tab.value} Logo`}
                className="h-4 sm:h-6 object-contain flex-shrink-0"
              />
              {tab.label && (
                <span className="hidden sm:inline text-sm sm:text-base">
                  {tab.label}
                </span>
              )}
            </TabsTrigger>
          </div>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent value={tab.value} key={tab.value}>
          <div className="mt-4">{tab.content}</div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PaymentTabs;
