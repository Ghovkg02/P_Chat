import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { Visualization } from './components/Visualization';
import { EnvironmentalData } from './types';
import { Sun, Wind, Mountain, Thermometer } from 'lucide-react';

function App() {
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | undefined>();

  useEffect(() => {
    console.log('Environmental data updated in App:', environmentalData);
  }, [environmentalData]);

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Environmental Analysis Assistant</h1>
          <p className="text-gray-400">
            Analyze environmental factors with AI-powered insights and 3D visualization
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[600px]">
            <Visualization data={environmentalData} />
          </div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Sun className="text-yellow-500" />
                  <h3 className="font-semibold text-gray-100">Sun Path</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Azimuth: {environmentalData?.sunPath?.azimuth || 'N/A'}°
                  <br />
                  Elevation: {environmentalData?.sunPath?.elevation || 'N/A'}°
                </p>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Wind className="text-blue-400" />
                  <h3 className="font-semibold text-gray-100">Wind</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Direction: {environmentalData?.wind?.direction || 'N/A'}
                  <br />
                  Speed: {environmentalData?.wind?.speed || 'N/A'} m/s
                </p>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Mountain className="text-emerald-400" />
                  <h3 className="font-semibold text-gray-100">Elevation</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Height: {environmentalData?.elevation?.height || 'N/A'}m
                  <br />
                  Slope: {environmentalData?.elevation?.slope || 'N/A'}°
                </p>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-800">
                <div className="flex items-center space-x-2 mb-2">
                  <Thermometer className="text-red-400" />
                  <h3 className="font-semibold text-gray-100">Climate</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Temperature: {environmentalData?.climate?.temperature || 'N/A'}°C
                  <br />
                  Humidity: {environmentalData?.climate?.humidity || 'N/A'}%
                </p>
              </div>
            </div>

            <div className="h-[400px]">
              <ChatInterface onDataUpdate={setEnvironmentalData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;