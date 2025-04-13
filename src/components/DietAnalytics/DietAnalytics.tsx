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

// Register necessary ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  CanvasRenderer
]);


// AbstractSnippet: DIET001_DATA
const generateMockData = () => {
  const days = 30;
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    macros: {
      protein: Math.floor(Math.random() * 100) + 50,
      carbs: Math.floor(Math.random() * 150) + 100,
      fats: Math.floor(Math.random() * 50) + 30,
    },
    micros: {
      vitamins: Math.floor(Math.random() * 100),
      minerals: Math.floor(Math.random() * 100),
      fiber: Math.floor(Math.random() * 30),
    }
  }));
};

// AbstractSnippet: DIET001_ANALYSIS
const getChartOption = (rawData: any[]) => {
  const nutrientLabels = ['Protein', 'Carbs', 'Fats', 'Vitamins', 'Minerals', 'Fiber'];
  // Map Tailwind colors to hex for ECharts
  const nutrientColors = [
    '#3b82f6', // bg-blue-500
    '#22c55e', // bg-green-500
    '#eab308', // bg-yellow-500
    '#a855f7', // bg-purple-500
    '#ec4899', // bg-pink-500
    '#f97316'  // bg-orange-500
  ];

  const dates = rawData.map(d => d.date);

  const seriesData = nutrientLabels.map((nutrient, index) => ({
    name: nutrient,
    type: 'bar',
    stack: 'total', // Key for stacking bars
    emphasis: {
      focus: 'series'
    },
    itemStyle: {
        color: nutrientColors[index]
    },
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

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow' // Use shadow to emphasize the axis value
      },
      // Dark theme tooltip style
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#333',
      textStyle: {
          color: '#ccc'
      }
    },
    legend: {
      data: nutrientLabels,
      bottom: 10, // Position legend at the bottom
      textStyle: {
          color: '#ccc' // Legend text color for dark theme
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%', // Adjust bottom padding for legend
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: dates,
        axisLabel: {
            color: '#ccc' // X-axis label color
        },
        axisLine: {
            lineStyle: {
                color: '#555' // X-axis line color
            }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
            color: '#ccc' // Y-axis label color
        },
        axisLine: {
            show: true, // Show Y-axis line
            lineStyle: {
                color: '#555' // Y-axis line color
            }
        },
        splitLine: { // Style grid lines
            lineStyle: {
                color: '#444', // Grid line color
                type: 'dashed'
            }
        }
      }
    ],
    series: seriesData
  };
};

// AbstractSnippet: DIET001_CHART
const DietChart = ({ option }: { option: any }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
       <h3 className="text-xl font-semibold mb-4 text-center text-white">Daily Nutrient Intake</h3>
       <ReactECharts
         echarts={echarts}
         option={option}
         style={{ height: '400px', width: '100%' }} // Set height for the chart
         notMerge={true}
         lazyUpdate={true}
         theme={"dark"} // Optional: use ECharts built-in dark theme
       />
    </div>
  );
};


// AbstractSnippet: DIET001
export default function DietAnalytics() {
  const mockData = generateMockData();
  // Rename function to reflect it now generates the ECharts option object
  const chartOption = getChartOption(mockData);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Your Diet Analysis</h2>
      {/* Pass the generated option object to the chart component */}
      <DietChart option={chartOption} />
    </div>
  );
}
