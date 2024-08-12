import React, { useState, useEffect } from 'react';
import { BarChart } from '../components/Chart';
import { useToastContext } from '../providers/toast/toast';

const fetchChartData = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/data/chart-data');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    if (result.status === 'error') {
      throw new Error(result.message);
    }
    return result.data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

interface ChartDataType {
  datasetOne: number[];
  datasetTwo: number[];
}

export function ChartBlock() {
  const [chartData, setChartData] = useState<ChartDataType>({ datasetOne: [], datasetTwo: [] });
  const [filteredData, setFilteredData] = useState<ChartDataType>({ datasetOne: [], datasetTwo: [] });
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const { renderToast } = useToastContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChartData();
        setChartData(data);
        setFilteredData(data);
        renderToast('success', 'Chart data loaded successfully');
      } catch (error) {
        console.error('Error fetching data:', error);
        renderToast('error', 'Failed to load chart data');
      }
    };

    fetchData();
  }, [renderToast]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinValue(value);
    filterData(value, maxValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxValue(value);
    filterData(minValue, value);
  };

  const handleReset = () => {
    setMinValue('');
    setMaxValue('');
    setFilteredData(chartData);
  };

  const filterData = (min: string, max: string) => {
    const minNum = min === '' ? -Infinity : Number(min);
    const maxNum = max === '' ? Infinity : Number(max);
    
    const filtered: ChartDataType = {
      datasetOne: chartData.datasetOne.filter(value => value >= minNum && value <= maxNum),
      datasetTwo: chartData.datasetTwo.filter(value => value >= minNum && value <= maxNum)
    };
    setFilteredData(filtered);
  };

  const isDataEmpty = filteredData.datasetOne.length === 0 && filteredData.datasetTwo.length === 0;

  return (
    <div>
      <div className='mb-12 flex items-center'>
        <div className='flex flex-col mx-4'>
          <span className='text-sm'>Min Value (Filter Lower Bound)</span>
          <input 
            type='number' 
            className='w-24 h-8 text-sm' 
            value={minValue}
            onChange={handleMinChange}
            placeholder="e.g., 20"
          />
        </div>
        <div className='flex flex-col mx-4'>
          <span className='text-sm'>Max Value (Filter Upper Bound)</span>
          <input 
            type='number' 
            className='w-24 h-8 text-sm' 
            value={maxValue}
            onChange={handleMaxChange}
            placeholder="e.g., 50"
          />
        </div>
        <div className='flex flex-col mx-4 pt-4 w-100'>
          <button 
            className='bg-blue-600 flex justify-center items-center h-10 text-center text-white border focus:outline-none focus:ring-4 font-sm rounded-lg text-sm px-5 py-1.9'
            onClick={handleReset}
          >
            Reset Filters
          </button>
        </div>
      </div>
      <div>
        {isDataEmpty ? (
          <div className="flex justify-center items-center h-[300px] bg-gray-100 rounded-lg">
            <p className="text-xl text-gray-500">No data available for the selected range. Please adjust your filters.</p>
          </div>
        ) : (
          <BarChart
            width={600}
            height={300}
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June'],
              datasets: [
                {
                  label: 'Dataset 1',
                  data: filteredData.datasetOne,
                  backgroundColor: 'rgb(255, 99, 132)',
                },
                {
                  label: 'Dataset 2',
                  data: filteredData.datasetTwo,
                  backgroundColor: 'rgb(54, 162, 235)',
                },
              ],
            }}
          />
        )}
      </div>
    </div>
  );
}