# Reusable Components Documentation

This document explains how to use the reusable components created for the dashboard application.

## Sidebar Component

A reusable sidebar navigation component for consistent navigation across pages.

### Props:
- `tabs` (array, required) - Array of tab objects with `id`, `name`, and `icon`
- `activeTab` (string, required) - The currently active tab ID
- `onTabChange` (function, required) - Function to handle tab changes
- `className` (string, optional) - Additional CSS classes
- `width` (string, default: "w-64") - Width of the sidebar

### Tab Object Structure:
- `id` (string) - Unique identifier for the tab
- `name` (string) - Display name for the tab
- `icon` (JSX) - Icon component for the tab

### Usage:
```jsx
import { Sidebar } from "../components/common";
import { BarChart3, Bot, DollarSign } from "lucide-react";

const sidebarTabs = [
  {
    id: "dashboard",
    name: "Dashboard", 
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    id: "chatbot",
    name: "Chatbot",
    icon: <Bot className="w-5 h-5" />
  },
  {
    id: "profit", 
    name: "Profit",
    icon: <DollarSign className="w-5 h-5" />
  }
];

const [activeTab, setActiveTab] = useState("dashboard");

<Sidebar 
  tabs={sidebarTabs}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

## NavigationBar Component

A reusable navigation bar component for consistent header across pages.

### Props:
- `title` (string, default: "Dashboard") - The title to display in the navigation
- `currentUser` (object) - The current user object with photoURL and displayName
- `onLogout` (function) - Function to handle logout
- `rightContent` (JSX, optional) - Custom content for the right side of the nav

### Usage:
```jsx
import { NavigationBar } from "../components/common";

<NavigationBar 
  title="Dashboard"
  currentUser={currentUser}
  onLogout={handleLogout}
/>

// With custom right content
<NavigationBar 
  title="Upload Page"
  currentUser={currentUser}
  onLogout={handleLogout}
  rightContent={<CustomRightComponent />}
/>
```

## PieChart Component

A configurable pie chart component using Recharts.

### Props:
- `data` (array, required) - Array of objects with `name`, `value`, and optionally `color`
- `title` (string, default: "Chart") - Chart title
- `colors` (array, default: ["#3B82F6", "#10B981", "#EF4444"]) - Array of colors for chart segments
- `width` (string, default: "100%") - Chart width
- `height` (number, default: 350) - Chart height
- `outerRadius` (number, default: 100) - Outer radius of the pie
- `showPercentage` (boolean, default: true) - Whether to show percentages in labels

### Usage:
```jsx
import { PieChart } from "../components/common";

const pieData = [
  { name: "Profit", value: 1000, color: "#10B981" },
  { name: "Expenses", value: 500, color: "#EF4444" },
  { name: "Other", value: 300, color: "#F59E0B" },
];

<PieChart
  data={pieData}
  title="Financial Overview"
  colors={["#10B981", "#EF4444", "#F59E0B"]}
  height={350}
/>
```

## AreaChart Component

A configurable area chart component using Recharts.

### Props:
- `data` (array, required) - Array of data objects
- `title` (string, default: "Chart") - Chart title
- `width` (string, default: "100%") - Chart width
- `height` (number, default: 350) - Chart height
- `areas` (array, required) - Array of area configurations with `dataKey` and `color`
- `showGrid` (boolean, default: true) - Whether to show grid lines
- `rotateXAxisLabels` (boolean, default: true) - Whether to rotate X-axis labels
- `xAxisKey` (string, default: "name") - Key for X-axis data
- `yAxisFormatter` (function) - Function to format Y-axis values

### Usage:
```jsx
import { AreaChart } from "../components/common";

const areaData = [
  { name: "Product 1", Sales: 1000, Profit: 300, Expenses: 200 },
  { name: "Product 2", Sales: 1500, Profit: 450, Expenses: 300 },
];

const areaConfig = [
  { dataKey: "Sales", color: "#3B82F6" },
  { dataKey: "Profit", color: "#10B981" },
  { dataKey: "Expenses", color: "#EF4444" }
];

<AreaChart
  data={areaData}
  title="Product Performance"
  areas={areaConfig}
  height={350}
/>
```

## SummaryCards Component

A component for displaying summary statistics in card format.

### Props:
- `cards` (array, required) - Array of card objects

### Card Object Structure:
- `title` (string) - Card title
- `value` (string) - Card value to display
- `icon` (JSX) - Icon component
- `borderColor` (string) - Tailwind border color class
- `iconBgColor` (string) - Tailwind background color class for icon
- `valueColor` (string) - Tailwind text color class for value

### Usage:
```jsx
import { SummaryCards } from "../components/common";
import { BarChart3, DollarSign, Package } from "lucide-react";

const summaryData = [
  {
    title: "Total Sales",
    value: "$10,000",
    icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
    borderColor: "border-blue-500",
    iconBgColor: "bg-blue-100",
    valueColor: "text-blue-600"
  },
  {
    title: "Total Profit", 
    value: "$3,000",
    icon: <DollarSign className="w-6 h-6 text-green-600" />,
    borderColor: "border-green-500",
    iconBgColor: "bg-green-100", 
    valueColor: "text-green-600"
  },
  {
    title: "Total Expenses",
    value: "$2,000",
    icon: <Package className="w-6 h-6 text-red-600" />,
    borderColor: "border-red-500",
    iconBgColor: "bg-red-100",
    valueColor: "text-red-600"
  }
];

<SummaryCards cards={summaryData} />
```

## Complete Example - Product Details Page

See `ProductDetailsPage.jsx` for a complete example of how all these components work together to create a product details page with:
- Navigation bar
- Summary cards
- Pie chart for product breakdown
- Area chart for comparison
- Detailed product information

## Import All Components

You can import all components at once:

```jsx
import { 
  NavigationBar, 
  PieChart, 
  AreaChart, 
  SummaryCards,
  Sidebar 
} from "../components/common";
```

Or import individually:

```jsx
import NavigationBar from "../components/common/NavigationBar";
import Sidebar from "../components/common/Sidebar";
// etc.
```
