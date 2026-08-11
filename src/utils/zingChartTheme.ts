export const zingChartTheme = {
  palette: {
    line: [
      ['#FBFCFE', '#00BAF2', '#00BAF2', '#00a7d9'],
      ['#FBFCFE', '#E80C60', '#E80C60', '#d00a56'],
      ['#FBFCFE', '#9B26AF', '#9B26AF', '#8b229d'],
      ['#FBFCFE', '#E2D51A', '#E2D51A', '#E2D51A'],
      ['#FBFCFE', '#FB301E', '#FB301E', '#e12b1b'],
      ['#FBFCFE', '#00AE4D', '#00AE4D', '#00AE4D'],
    ],
  },
  graph: {
    backgroundColor: '#FBFCFE',
    title: {
      fontFamily: 'SVN-Gilroy',
      fontSize: 20,
      padding: '15',
      fontColor: '#1E5D9E',
      adjustLayout: true,
    },
    plot: {
      backgroundColor: '#FBFCFE',
      marker: {
        size: 4,
      },
    },
    tooltip: {
      visible: true,
      backgroundColor: 'white',
      borderColor: '#e3e3e3',
      borderRadius: '5px',
      fontSize: '12px',
      fontColor: '#2f2f2f',
      padding: '15px',
    },
    plotarea: {
      backgroundColor: 'transparent',
      margin: 'dynamic',
    },
    scaleX: {
      zooming: true,
      lineWidth: 0,
      item: {
        fontColor: '#1E5D9E',
        fontFamily: 'SVN-Gilroy',
        fontSize: '14px',
      },
    },
    scaleY: {
      zooming: true,
      lineWidth: 0,
      item: {
        fontColor: '#1E5D9E',
        fontFamily: 'SVN-Gilroy',
        fontSize: '14px',
      },
    },
  },
}
