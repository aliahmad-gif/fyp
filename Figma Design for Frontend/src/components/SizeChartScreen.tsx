import { ArrowLeft } from 'lucide-react';

interface SizeChartScreenProps {
  onBack: () => void;
}

export default function SizeChartScreen({ onBack }: SizeChartScreenProps) {
  return (
    <div className="size-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-[#1a1a1a] text-white px-4 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="size-[24px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="size-[20px]" />
        </button>
        <h1 className="text-xl font-['Roboto'] font-medium">Size Chart</h1>
      </div>

      {/* Size Chart Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-['Roboto'] font-bold mb-6 text-[#080707]">Men's Clothing Size Chart</h2>
          
          {/* Size Chart Table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left font-['Roboto'] font-medium">Size</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-['Roboto'] font-medium">Chest (inches)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-['Roboto'] font-medium">Waist (inches)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-['Roboto'] font-medium">Shoulder (inches)</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-['Roboto'] font-medium">Length (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto'] font-medium">XS</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">34-36</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">28-30</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">16-16.5</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">27-28</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto'] font-medium">S</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">36-38</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">30-32</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">16.5-17</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">28-29</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto'] font-medium">M</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">38-40</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">32-34</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">17-17.5</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">29-30</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto'] font-medium">L</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">40-42</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">34-36</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">17.5-18</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">30-31</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto'] font-medium">XL</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">42-44</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">36-38</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">18-18.5</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">31-32</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto'] font-medium">XXL</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">44-46</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">38-40</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">18.5-19</td>
                  <td className="border border-gray-300 px-4 py-3 font-['Roboto']">32-33</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Measurement Instructions */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h3 className="text-xl font-['Roboto'] font-bold mb-4 text-[#080707]">How to Measure</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="font-['Roboto'] font-bold text-[#1a1a1a]">Chest:</span>
                <span className="font-['Roboto'] text-[#747881]">Measure around the fullest part of your chest, keeping the tape horizontal.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-['Roboto'] font-bold text-[#1a1a1a]">Waist:</span>
                <span className="font-['Roboto'] text-[#747881]">Measure around your natural waistline, keeping the tape comfortably loose.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-['Roboto'] font-bold text-[#1a1a1a]">Shoulder:</span>
                <span className="font-['Roboto'] text-[#747881]">Measure from one shoulder point to the other across the back.</span>
              </div>
              <div className="flex gap-3">
                <span className="font-['Roboto'] font-bold text-[#1a1a1a]">Length:</span>
                <span className="font-['Roboto'] text-[#747881]">Measure from the highest point of the shoulder to the desired length.</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p className="font-['Roboto'] text-[#1a1a1a]">
              <span className="font-bold">Note:</span> For custom tailoring, we recommend getting measured by a professional tailor for the most accurate fit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
