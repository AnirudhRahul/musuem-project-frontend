'use client'
import Header from "@/components/ui/header"
import DataImport from "../data.json"
import '../chart.css'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Ticks,
} from 'chart.js';
import 'chartjs-plugin-zoom';
import { Scatter, getDatasetAtEvent, getElementsAtEvent } from 'react-chartjs-2';
import  React from 'react';
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);


type DataType = {
  points: number[][];
  displays: string[][];
  vector: number[][];
  years: number[];
};
const Data = DataImport as DataType;


const data ={
  datasets: [{
    label: 'Harvard Art Musuem',
    borderColor: '#36A2EB',
    pointRadius: 4,
    pointHoverRadius: 4,
    backgroundColor: '#9BD0F5',
    data: Data.points.map((point, i) => {
      return {
        x: point[0],
        y: point[1],
        desc: Data.displays[i][1],
        title: Data.displays[i][0],
        url: Data.displays[i][2],
        image: Data.displays[i][3],
      }
    })
  }
    
  ]
} 


const chartRef = React.createRef();
const plugin = {
  id: 'bgcolor',
  beforeDatasetsDraw: (chart: any, args: any, options: any) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

const options = {
  plugins: {
    title: {
      display: true,
      text: 'Scatter Plot',
    },
    tooltip: {
      callbacks: {
        label: (dpoint: any) => {
          const index = dpoint.dataIndex
          return dpoint.dataset.data[index].title
        },
      }
    },
    legend: {
      position: 'bottom',
      labels: {
        color: 'white',
        font: {
          size: 20
        }
      }
    },

    zoom: {
      pan: {
        enabled: true,
        mode: 'xy',
        
      },
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: true,
        },
        mode: 'xy',
      }
    }

  },


  scales: {
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.5)',
        tickLength: 0
      },
      ticks: {
        display: false,
      },

    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.5)',
        tickLength: 0
      },
      ticks: {
        display: false,
      },
    }
  },


}


const onClick = (event: any) => {
  if (!chartRef){
    return
  }
  if (getElementsAtEvent(chartRef.current, event).length == 0) {
    return
  }

  const ind = getElementsAtEvent(chartRef.current, event)[0].index
  const url = Data.displays[ind][2]
  window.open(url, '_blank');

}

export default function ContextMap() {
    const [index, setIndex] = React.useState(-1);

  React.useEffect(() => {
    if (typeof window !== "undefined")
      import("chartjs-plugin-zoom").then((plugin) => {
        ChartJS.register(plugin.default);
      });
    }, []);
  return (
    <section className="bg-gradient-to-b from-gray-100 to-white">
      <Header/>

      <main
        className={`flex min-h-screen flex-col items-center  p-24`}
      >     

          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h2 mb-4">Exhibit Inspiration</h1>
            <p className="text-xl text-gray-600">
                By selecting a point on the map, you can generate exhibits of similar artworks.
                This tool is intended to help curators parse through vast collection of artworks and find inspiration for new exhibits.

            </p>
            </div>
          
          
          <div className="floating-card">
            <Scatter
              ref={chartRef}
              options={options}
              data={data}
              onClick={onClick}
              plugins={[plugin]}
              />
          </div>
          <br/>
          <h4 className="h4 mb-4">
            Selected Display: 

          </h4>
                
        </main>
      
      </section>
    )
  }
