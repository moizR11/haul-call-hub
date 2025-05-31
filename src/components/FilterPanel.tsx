
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { CarrierData } from "./MainContent";

interface FilterPanelProps {
  data: CarrierData[];
  onFilter: (filteredData: CarrierData[]) => void;
}

interface NumericFilter {
  operator: string;
  value: string;
}

export function FilterPanel({ data, onFilter }: FilterPanelProps) {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [driversFilter, setDriversFilter] = useState<NumericFilter>({ operator: "=", value: "" });
  const [mcAgeFilter, setMcAgeFilter] = useState<NumericFilter>({ operator: "=", value: "" });
  const [powerUnitsFilter, setPowerUnitsFilter] = useState<NumericFilter>({ operator: "=", value: "" });

  const uniqueStates = [...new Set(data.map(item => item.State).filter(Boolean))].sort();

  const applyFilters = () => {
    let filtered = data;

    // State filter
    if (selectedStates.length > 0) {
      filtered = filtered.filter(item => selectedStates.includes(item.State));
    }

    // Numeric filters
    const applyNumericFilter = (items: CarrierData[], field: keyof CarrierData, filter: NumericFilter) => {
      if (!filter.value) return items;
      
      const filterValue = parseInt(filter.value);
      if (isNaN(filterValue)) return items;

      return items.filter(item => {
        const itemValue = parseInt(item[field] as string);
        if (isNaN(itemValue)) return false;

        switch (filter.operator) {
          case "<": return itemValue < filterValue;
          case ">": return itemValue > filterValue;
          case "<=": return itemValue <= filterValue;
          case ">=": return itemValue >= filterValue;
          case "=": return itemValue === filterValue;
          default: return true;
        }
      });
    };

    filtered = applyNumericFilter(filtered, "Drivers", driversFilter);
    filtered = applyNumericFilter(filtered, "MC Age", mcAgeFilter);
    filtered = applyNumericFilter(filtered, "Power Units", powerUnitsFilter);

    onFilter(filtered);
  };

  const clearFilters = () => {
    setSelectedStates([]);
    setDriversFilter({ operator: "=", value: "" });
    setMcAgeFilter({ operator: "=", value: "" });
    setPowerUnitsFilter({ operator: "=", value: "" });
    onFilter(data);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedStates, driversFilter, mcAgeFilter, powerUnitsFilter, data]);

  const addState = (state: string) => {
    if (!selectedStates.includes(state)) {
      setSelectedStates([...selectedStates, state]);
    }
  };

  const removeState = (state: string) => {
    setSelectedStates(selectedStates.filter(s => s !== state));
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filter Carriers</h3>
        <Button variant="outline" onClick={clearFilters} className="text-gray-600">
          Clear All Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* State Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">State</Label>
          <Select onValueChange={addState}>
            <SelectTrigger>
              <SelectValue placeholder="Select states..." />
            </SelectTrigger>
            <SelectContent>
              {uniqueStates.map(state => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedStates.map(state => (
              <Badge key={state} variant="secondary" className="flex items-center gap-1">
                {state}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeState(state)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Drivers Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Drivers</Label>
          <div className="flex gap-2">
            <Select 
              value={driversFilter.operator} 
              onValueChange={(value) => setDriversFilter(prev => ({ ...prev, operator: value }))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="=">=</SelectItem>
                <SelectItem value="<">&lt;</SelectItem>
                <SelectItem value=">">&gt;</SelectItem>
                <SelectItem value="<=">&lt;=</SelectItem>
                <SelectItem value=">=">&gt;=</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Value"
              value={driversFilter.value}
              onChange={(e) => setDriversFilter(prev => ({ ...prev, value: e.target.value }))}
              className="flex-1"
            />
          </div>
        </div>

        {/* MC Age Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">MC Age</Label>
          <div className="flex gap-2">
            <Select 
              value={mcAgeFilter.operator} 
              onValueChange={(value) => setMcAgeFilter(prev => ({ ...prev, operator: value }))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="=">=</SelectItem>
                <SelectItem value="<">&lt;</SelectItem>
                <SelectItem value=">">&gt;</SelectItem>
                <SelectItem value="<=">&lt;=</SelectItem>
                <SelectItem value=">=">&gt;=</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Value"
              value={mcAgeFilter.value}
              onChange={(e) => setMcAgeFilter(prev => ({ ...prev, value: e.target.value }))}
              className="flex-1"
            />
          </div>
        </div>

        {/* Power Units Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Power Units</Label>
          <div className="flex gap-2">
            <Select 
              value={powerUnitsFilter.operator} 
              onValueChange={(value) => setPowerUnitsFilter(prev => ({ ...prev, operator: value }))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="=">=</SelectItem>
                <SelectItem value="<">&lt;</SelectItem>
                <SelectItem value=">">&gt;</SelectItem>
                <SelectItem value="<=">&lt;=</SelectItem>
                <SelectItem value=">=">&gt;=</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Value"
              value={powerUnitsFilter.value}
              onChange={(e) => setPowerUnitsFilter(prev => ({ ...prev, value: e.target.value }))}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
