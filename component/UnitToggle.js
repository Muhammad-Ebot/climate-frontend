//component/UnitToggle.js
export default function UnitToggle({ unit, setUnit }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Units</label>
      <div className="flex border border-gray-300 rounded overflow-hidden">
        <button
          className={`flex-1 py-2 ${unit === 'metric' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          onClick={() => setUnit('metric')}
        >
          °C
        </button>
        <button
          className={`flex-1 py-2 ${unit === 'imperial' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          onClick={() => setUnit('imperial')}
        >
          °F
        </button>
      </div>
    </div>
  );
}