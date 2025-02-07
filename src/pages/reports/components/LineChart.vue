<template>
  <LineChartGenerator :chartOptions="chartOptions" :chartData="chartDataToPass" :data="chartDataToPass" id="chartId"
    v-if="chartDataToPass.labels.length && chartDataToPass.datasets.length" />
  <span style=" visibility: hidden;" class="float-left">{{ chartDataToPass.datasets.length }}</span>
</template>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs';

import ColorHash from 'color-hash'
var colorHash = new ColorHash();

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement, Filler
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement, Filler
);

export default {
  name: 'LineChart',
  components: {
    LineChartGenerator
  },


  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        options: {
          plugins: {
            filler: {
              propagate: this.filler
            }
          }
        }
      },
      // Hardcoded data here for the chart
      labels: ['Sep', 'Oct', 'Nov', 'Dec'],
      data: [
        {
          label: 'Completed',
          data: [30, 50, 80, 40],
        },
        {
          label: 'Started',
          data: [20, 30, 60, 70],
        },
        {
          label: 'Passed',
          data: [10, 40, 70, 90],
        }
      ]
    }
  },
  computed: {
    chartDataToPass() {
      return {
        labels: this.labels, // X-axis labels
        datasets: this.data.map(item => ({
          ...item, // Copy the item properties
          borderColor: colorHash.hex(item.label), // Color for the line
          backgroundColor: colorHash.hex(item.label), // Color for the fill
          fill: false, // Disable the fill under the line
        }))
      };
    }
  }
};
</script>