import { AnimatePresence, motion } from 'framer-motion';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { SidebarContent, SidebarHeader } from './ui/sidebar';
import { Button } from './ui/button';

interface ChartSidebarProps<T> {
  items: T[];
  selectedItems: T[];
  onSelectionChange: (item: T) => void;
  onClearSelection: () => void;
  displayKey?: keyof T; // The field to display (e.g., "x" in Point)
  isChecked: (item: T) => boolean; // Function to determine if an item is checked
  chartid: string;
}

/**
 * A chart sidebar component
 *
 * @param {T[]} ChartSidebarProps.items - The list of items, it is not the list of items that will be passed to the chart, but it's a copy of the original list and contains all data
 * @param {T[]} ChartSidebarProps.selectedItems - The list of selected items, at start it contains the default items selected
 * @param {(item: T) => void} ChartSidebarProps.onSelectionChange - Function to manage items selection, it updates the list of items that will be passed to the chart
 * @param {() => void} ChartSidebarProps.onClearSelection - Function for the 'clear' button, it empty the list of items that will be passed to the chart
 * @param {keyof T} ChartSidebarProps.displayKey - The field to display
 * @param {(item: T) => boolean} ChartSidebarProps.isChecked - Function to determine if an item is checked, usefull to determine default items selected for the 'items' list
 * @param {string} ChartSidebarProps.chartid - A unique id for the chart, used to create unique Checkbox id
 */
export const ChartSidebar = <T,>({
  items,
  selectedItems,
  onSelectionChange,
  onClearSelection,
  displayKey,
  isChecked,
  chartid
}: ChartSidebarProps<T>) => {
  return (
    <SidebarContent>
      {/* Sidebar Header */}
      <SidebarHeader className="flex justify-between items-center p-4 border-b">
        <h2 className="ml-6 text-lg font-semibold">
          ADD/REMOVE COUNTRIES AND REGIONS
        </h2>
      </SidebarHeader>

      {/* Sidebar Main Content */}
      <div className="p-4 pt-3">
        {/* Selected Items */}
        <div>
          <div className="flex justify-between items-center py-3 w-full font-semibold border-b border-gray-300">
            <h3 className="text-base text-gray-500">
              Selection ({selectedItems.length})
            </h3>
            <Button variant="link" onClick={onClearSelection}>
              Clear
            </Button>
          </div>
          <div>
            <AnimatePresence>
              {selectedItems.map((item, index) => (
                <motion.div
                  key={String((displayKey && item[displayKey]) || item)}
                  className="flex py-3 border-b border-gray-300"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center ml-2 space-x-2">
                    <Checkbox
                      id={`${chartid}-selected-${index}`}
                      checked
                      onClick={() => onSelectionChange(item)}
                    />
                    <Label
                      htmlFor={`selected-${index}`}
                      className="text-base text-gray-800"
                    >
                      {String((displayKey && item[displayKey]) || item)}
                    </Label>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* All Items */}
        <div>
          <h3 className="py-3 text-base font-semibold text-gray-500 border-b border-gray-300">
            All countries and regions
          </h3>
          <div>
            {items.map((item, index) => (
              <div key={index} className="flex py-3 border-b border-gray-300">
                <div className="flex items-center ml-2 space-x-2">
                  <Checkbox
                    id={`${chartid}-all-${index}`}
                    checked={isChecked(item)}
                    onClick={() => onSelectionChange(item)}
                  />
                  <Label
                    htmlFor={`all-${index}`}
                    className="text-base text-gray-800"
                  >
                    {String((displayKey && item[displayKey]) || item)}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SidebarContent>
  );
};
