
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MainContent } from "@/components/MainContent";

const Index = () => {
  const [activeSection, setActiveSection] = useState<'scraping' | 'data' | 'call-logs'>('scraping');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <AppSidebar 
          onSectionChange={setActiveSection}
          activeSection={activeSection}
        />
        <MainContent activeSection={activeSection} />
      </div>
    </SidebarProvider>
  );
};

export default Index;
