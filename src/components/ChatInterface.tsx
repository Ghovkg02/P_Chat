import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Message } from '../types';
import { Groq } from 'groq-sdk';

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

interface ChatInterfaceProps {
  onDataUpdate: (data: any) => void;
}

export function ChatInterface({ onDataUpdate }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an advanced environmental analysis expert. Provide detailed insights in a clear, structured format. ALWAYS include the JSON data block at the end of your response with realistic values.

            FORMAT YOUR RESPONSE AS FOLLOWS:

            📍 LOCATION ANALYSIS
            [Provide a brief overview of the location]

            🌞 SOLAR ANALYSIS
            - Sun Path: [Details]
            - Solar Exposure: [Details]
            - Optimal Usage: [Recommendations]

            💨 WIND PATTERNS
            - Direction: [Details]
            - Speed: [Details]
            - Implications: [Analysis]

            🌱 SOIL COMPOSITION
            - BDOD: [Value + Explanation]
            - SOC: [Value + Explanation]
            - Clay Content: [Value + Explanation]
            - Nitrogen Levels: [Value + Explanation]

            📊 ELEVATION DATA
            - Height: [Details]
            - Slope: [Details]
            - Drainage: [Analysis]

            🌡️ CLIMATE METRICS
            - Temperature: [Details]
            - Humidity: [Details]
            - Precipitation: [Details]

            ⚠️ DISTURBANCE FACTORS
            [List and analyze any environmental disturbances]

            💡 RECOMMENDATIONS
            [Provide 2-3 key actionable insights]

            [JSON_DATA]
            {
              "sunPath": {
                "azimuth": 180,
                "elevation": 45,
                "exposure": 100
              },
              "wind": {
                "direction": "45",
                "speed": 5
              },
              "soil": {
                "bdod": 120,
                "soc": 45,
                "clay": 30,
                "nitrogen": 15,
                "depth": 100
              },
              "elevation": {
                "height": 50,
                "slope": 15
              },
              "disturbances": [
                {
                  "type": "erosion",
                  "severity": 3
                }
              ],
              "climate": {
                "temperature": 25,
                "humidity": 60,
                "precipitation": 800
              }
            }
            Ensure the JSON data is the last part of your response and is properly formatted.`
          },
          ...messages.map(m => ({ role: m.role, content: m.content })),
          { role: 'user', content: input }
        ],
        model: 'mixtral-8x7b-32768',
        temperature: 0.5,
        max_tokens: 2048,
      });

      const assistantMessage = {
        role: 'assistant' as const,
        content: completion.choices[0]?.message?.content || 'No response'
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      try {
        // Look for the last JSON data block in the response
        const jsonMatches = assistantMessage.content.match(/\[JSON_DATA\]\s*(\{[\s\S]*\})/g);
        if (jsonMatches && jsonMatches.length > 0) {
          const lastJsonMatch = jsonMatches[jsonMatches.length - 1];
          try {
            const data = JSON.parse(lastJsonMatch);
            console.log('Parsed environmental data:', data);
            
            // Validate the data structure
            if (data.sunPath && data.wind && data.elevation && data.climate) {
              // Convert wind direction to number if it's a string
              if (typeof data.wind.direction === 'string') {
                data.wind.direction = parseFloat(data.wind.direction);
              }
              
              onDataUpdate(data);
              console.log('Data sent to App component:', data);
            } else {
              console.warn('Incomplete environmental data in response:', data);
            }
          } catch (parseError) {
            console.error('Failed to parse JSON data:', parseError);
          }
        } else {
          console.warn('No JSON data block found in response');
        }
      } catch (e) {
        console.error('Failed to parse visualization data:', e);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg shadow-lg border border-gray-700">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
                <span>Analyzing...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-700 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Try: Analyze environmental factors at latitude 40.7128, longitude -74.0060"
            className="flex-1 bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-600 text-white rounded-lg px-4 py-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}