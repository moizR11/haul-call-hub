
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Truck, Database, Phone, Wrench } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface AppSidebarProps {
  onSectionChange: (section: 'scraping' | 'data' | 'call-logs') => void;
  activeSection: string;
}

export function AppSidebar({ onSectionChange, activeSection }: AppSidebarProps) {
  const menuItems = [
    {
      id: 'scraping' as const,
      title: "Scrape",
      icon: Wrench,
    },
    {
      id: 'data' as const,
      title: "Data",
      icon: Database,
    },
    {
      id: 'call-logs' as const,
      title: "Call Logs",
      icon: Phone,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">SwiftNRoute</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Trucking Business Platform</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton 
                isActive={activeSection === item.id}
                onClick={() => onSectionChange(item.id)}
                className="w-full justify-start gap-3 p-4 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-900/40 data-[active=true]:text-blue-900 dark:data-[active=true]:text-blue-100"
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200 dark:border-gray-700">
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
