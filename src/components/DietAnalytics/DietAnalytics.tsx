'use client'; // Required for ECharts component

import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// Register necessary ECharts components and renderers
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);

// AbstractSnippet: DIET001_DATA
// --- Generates Mock Diet Data ---
const generateMockData = () => {
  // Step 1: Define the number of days for mock data generation
  const days = 30;
  // Step 2: Create an array representing the last 'days' days
  return Array.from({ length: days }, (_, i) => {
    // Step 3: Calculate the date for each entry (going back from today)
    const date = new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    // Step 4: Generate random values for macronutrients
    const macros = {
      protein: Math.floor(Math.random() * 100) + 50, // Random protein between 50 and 149
      carbs: Math.floor(Math.random() * 150) + 100, // Random carbs between 100 and 249
      fats: Math.floor(Math.random() * 50) + 30,   // Random fats between 30 and 79
    };
    // Step 5: Generate random values for micronutrients
    const micros = {
      vitamins: Math.floor(Math.random() * 100), // Random vitamins between 0 and 99
      minerals: Math.floor(Math.random() * 100), // Random minerals between 0 and 99
      fiber: Math.floor(Math.random() * 30),    // Random fiber between 0 and 29
    };
    // Step 6: Return the structured data object for the day
    return { date, macros, micros };
  });
};

// AbstractSnippet: DIET001_ANALYSIS
// --- Generates ECharts Option Object from Raw Data ---
const getChartOption = (rawData: any[]) => {
  // Step 1: Define labels for the nutrients to be displayed
  const nutrientLabels = ['Protein', 'Carbs', 'Fats', 'Vitamins', 'Minerals', 'Fiber'];
  // Step 2: Define corresponding colors for each nutrient (using hex codes)
  const nutrientColors = [
    '#3b82f6', // blue-500
    '#22c55e', // green-500
    '#eab308', // yellow-500
    '#a855f7', // purple-500
    '#ec4899', // pink-500
    '#f97316'  // orange-500
  ];

  // Step 3: Extract dates from the raw data for the X-axis categories
  const dates = rawData.map(d => d.date);

  // Step 4: Map raw data to ECharts series format
  const seriesData = nutrientLabels.map((nutrient, index) => ({
    name: nutrient, // Name for the legend and tooltip
    type: 'bar',    // Chart type
    stack: 'total', // Stack bars with the same stack ID
    emphasis: {
      focus: 'series' // Highlight the series on hover
    },
    itemStyle: {
        color: nutrientColors[index] // Assign color to the series
    },
    // Step 4a: Extract data for the current nutrient for each date
    data: rawData.map(d => {
      switch (index) {
        case 0: return d.macros.protein;
        case 1: return d.macros.carbs;
        case 2: return d.macros.fats;
        case 3: return d.micros.vitamins;
        case 4: return d.micros.minerals;
        case 5: return d.micros.fiber;
        default: return 0;
      }
    })
  }));

  // Step 5: Construct the final ECharts option object
  return {
    // Tooltip configuration (shows data on hover)
    tooltip: {
      trigger: 'axis', // Trigger on axis hover
      axisPointer: { type: 'shadow' }, // Use shadow indicator
      // Dark theme styling
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#333',
      textStyle: { color: '#ccc' }
    },
    // Legend configuration (shows nutrient names and colors)
    legend: {
      data: nutrientLabels,
      bottom: 10, // Position at the bottom
      textStyle: { color: '#ccc' } // Dark theme text
    },
    // Grid configuration (chart area padding)
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%', // Space for legend
      containLabel: true // Prevent labels from being cut off
    },
    // X-axis configuration (dates)
    xAxis: [
      {
        type: 'category', // Category axis for dates
        data: dates,
        axisLabel: { color: '#ccc' }, // Dark theme labels
        axisLine: { lineStyle: { color: '#555' } } // Dark theme axis line
      }
    ],
    // Y-axis configuration (nutrient values)
    yAxis: [
      {
        type: 'value', // Value axis for nutrient amounts
        axisLabel: { color: '#ccc' }, // Dark theme labels
        axisLine: { show: true, lineStyle: { color: '#555' } }, // Dark theme axis line
        splitLine: { lineStyle: { color: '#444', type: 'dashed' } } // Dark theme grid lines
      }
    ],
    // Series data (the actual bars)
    series: seriesData
  };
};

// AbstractSnippet: DIET001_CHART
// --- Renders the Diet Chart using ReactECharts ---
const DietChart = ({ option }: { option: any }) => {
  // Step 1: Render a container div with dark theme styling
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
       {/* Step 2: Add a title for the chart */}
       <h3 className="text-xl font-semibold mb-4 text-center text-white">Daily Nutrient Intake</h3>
       {/* Step 3: Render the ReactECharts component */}
       <ReactECharts
         echarts={echarts} // Pass the ECharts instance
         option={option} // Pass the generated chart options
         style={{ height: '400px', width: '100%' }} // Define chart dimensions
         notMerge={true} // Avoid merging with previous options
         lazyUpdate={true} // Optimize updates
         theme={"dark"} // Apply ECharts built-in dark theme (optional, complements CSS)
       />
    </div>
  );
};

// AbstractSnippet: DIET001
// --- Main Diet Analytics Component ---
export default function DietAnalytics() {
  // Step 1: Generate mock data using the dedicated function
  const mockData = generateMockData();
  // Step 2: Generate the ECharts option object from the mock data
  const chartOption = getChartOption(mockData);

  // Step 3: Render the main container for the analytics section
  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Step 4: Display the main title for the section */}
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Your Diet Analysis</h2>
      {/* Step 5: Render the DietChart component, passing the generated options */}
      <DietChart option={chartOption} />
    </div>
  );
}
