import Image from 'next/image'
import { Inter } from 'next/font/google'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter, getDatasetAtEvent, getElementsAtEvent } from 'react-chartjs-2';
import  React from 'react';
import Typewriter from 'typewriter-effect';
import Data from "./data.json"

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const inter = Inter({ subsets: ['latin'] })
export const data ={
  datasets: [{
    label: 'Harvard Art Musuem',
    borderColor: '#36A2EB',
    backgroundColor: '#9BD0F5',
    data: Data['points'].map((point, i) => {
      return {
        x: point[0],
        y: point[1],
        desc: Data['displays'][i][1],
        title: Data['displays'][i][0],
        url: Data['displays'][i][2],
        image: Data['displays'][i][3],
      }
    })
  }
    
  ]
} 
function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}
const chartRef = React.createRef();
const plugin = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

const options = {
  plugins: {
    customCanvasBackgroundColor: {
      color: 'white',
    },
    tooltip: {
      callbacks: {
        label: (dpoint) => {
          const index = dpoint.dataIndex
          return dpoint.dataset.data[index].title
        },
      }
    }
  },
  backgroundColor: 'rgba(52, 52, 52, 0.8)',

  pointRadius: 5,
  pointHoverRadius: 4
}
const onClick = (event) => {
  if (getElementsAtEvent(chartRef.current, event).length == 0) {
    return
  }

  const ind = getElementsAtEvent(chartRef.current, event)[0].index
  const url = Data['displays'][ind][2]
  window.open(url, '_blank').focus();

}

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center  p-24`}
    >

    
        <Typewriter
          onInit={(typewriter) => {
            typewriter.typeString('Musuem Displays ')
              .pauseFor(500)
              .typeString('Contextual Map')
              .start();
          }}
        />


    <Scatter
    ref={chartRef}
    options={options}
    plugins={[plugin]}
    data={data}
    onClick={onClick}
    />
        
    </main>
  )
}
