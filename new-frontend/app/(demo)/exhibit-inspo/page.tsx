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
import { Scatter, getDatasetAtEvent, getElementsAtEvent } from 'react-chartjs-2';
import  React from 'react';
ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);
import Slider from 'react-input-slider';

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

function dist(a: number[], b: number[]){
    let dist = 0
    for (let i=0; i<a.length; i++){
        dist += Math.pow(a[i] - b[i], 2)
    }
    return dist
}

function getRandom(arr: number[], n: number) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function getNeighborIndices(index: number, radius: number, size: number){
    const cur = Data.vector[index]
    let arr = []
    for(let i=0; i<Data.vector.length; i++){
        if(i==index){
            continue
        }
        arr.push({
            index: i,
            dist: dist(cur, Data.vector[i])
        })
    }

    arr.sort((a, b) => a.dist - b.dist)

    arr = arr.slice(0, radius).map((a) => a.index)

    return getRandom(arr, size)
}

export default function ContextMap() {
  const [index, setIndex] = React.useState(-1);
  const [radius, setRadius] = React.useState(10);
  const [size, setSize] = React.useState(4);


    const onClick = (event: any) => {
        if (!chartRef){
        return
        }
        if (getElementsAtEvent(chartRef.current, event).length == 0) {
        return
        }

        const ind = getElementsAtEvent(chartRef.current, event)[0].index
        setIndex(ind)
        // const url = Data.displays[ind][2]
        // window.open(url, '_blank');

    }

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
          <div className="max-w-3xl mx-auto text-center pt-12 ">
            <h4 className="h4 mb-4">
                Selected Display:  {index>0 && Data.displays[index][0]}
                {index>0 && <img className="mx-auto mt-8" src={Data.displays[index][3] + "/full/256,/0/default.png"}></img>}
                {index>0 &&
                <React.Fragment>
                <div className="flex flex-col mt-6">
                    <div>{'Neighbor Radius: ' + radius}</div>
                        <Slider
                        className="mx-auto"
                        axis="x"
                        xstep={1}
                        xmin={3}
                        xmax={20}
                        x={radius}
                        onChange={({ x }) => setRadius(x)} 
                        />
                  
                    <div className="mt-3">{'Exhibit Size: ' + size}</div>
                        <Slider
                        className="mx-auto"
                        axis="x"
                        xstep={1}
                        xmin={2}
                        xmax={radius}
                        x={size}
                        onChange={({ x }) => setSize(x)} 
                        />
                    </div>
                </React.Fragment>
                }

                {   index > 0 &&
                <div className="grid grid-cols-3 gap-10 mt-10">
                    {getNeighborIndices(index, radius, size).map((ind) => <div>
                        <a href={Data.displays[ind][2]} className="titl" target="_blank">{Data.displays[ind][0]}</a>
                        <img className="mx-auto mt-2" src={Data.displays[ind][3] + "/full/256,/0/default.png"}></img>
                    </div>

                    )}
                </div>
                }
               
                


            </h4>
          </div>

                
        </main>
      
      </section>
    )
  }
