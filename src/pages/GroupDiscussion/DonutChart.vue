<template>
  <canvas ref="canvas"></canvas>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from 'vue';
import { Chart, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

export default defineComponent({
  name: 'DonutChart',
  props: {
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const canvas = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      if (canvas.value) {
        chartInstance = new Chart(canvas.value, {
          type: 'doughnut',
          data: props.data,
          options: props.options
        });
      }
    };

    watch(() => props.data, renderChart, { deep: true });
    watch(() => props.options, renderChart, { deep: true });

    onMounted(() => {
      renderChart();
    });

    return { canvas };
  }
});
</script>
