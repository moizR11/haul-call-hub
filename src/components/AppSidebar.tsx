
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Truck, Database, Phone } from "lucide-react";
import { ScrapingSection } from "./ScrapingSection";
import { DataSection } from "./DataSection";

export function AppSidebar() {
  return (
    <Sidebar className="w-80 border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CarrierConnect</h1>
            <p className="text-sm text-gray-600">Trucking Business Platform</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-6 space-y-8">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
            <Database className="w-4 h-4" />
            Scraping Section
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrapingSection />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
            <Phone className="w-4 h-4" />
            Data Section
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <DataSection />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
