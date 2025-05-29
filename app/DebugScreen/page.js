//app/DebugScreen/page.js(new page)
"use client";

import React, { useState } from "react";

const DebugScreen = () => {
  const [activeEvent, setActiveEvent] = useState("rainfall");

  const modelParameters = {
    rainfall: [
      "relative_humidity_2m",
      "dew_point_2m",
      "surface_pressure",
      "cloud_cover_low",
      "cloud_cover_mid",
      "cloud_cover_high",
      "wind_gusts_10m",
      "soil_moisture_0_to_7cm",
      "soil_moisture_28_to_100cm",
    ],
    heatwave: [
      "temperature_2m_max",
      "temperature_2m_min",
      "temperature_2m_mean",
      "precipitation_sum",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
      "wind_direction_10m_dominant",
      "shortwave_radiation_sum",
      "et0_fao_evapotranspiration",
    ],
    drought: [
      "temperature_2m_max",
      "temperature_2m_min",
      "temperature_2m_mean",
      "precipitation_sum",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
      "wind_direction_10m_dominant",
      "shortwave_radiation_sum",
      "et0_fao_evapotranspiration",
    ],
  };

  const classificationReports = {
    rainfall: [
      {
        name: "Balochistan",
        report: `
              precision    recall  f1-score   support
No rain            1.00      0.97      0.99     22005
Weak               0.58      0.81      0.68      1102
Moderate           0.65      0.72      0.69       549
Heavy              0.31      0.51      0.39        65
Severe             0.38      0.52      0.44        21

accuracy                               0.96     23742
macro avg          0.59      0.71      0.64
weighted avg       0.97      0.96      0.96
        `,
        data: {
          season: ["Winter", "Summer", "Spring", "Fall"],
          accuracy: [0.933556, 0.958333, 0.963888, 0.984618],
          rain_frequency: [0.126689, 0.067372, 0.059901, 0.033416]
        }
      },
      {
        name: "Sindh",
        report: `
              precision    recall  f1-score   support
No rain           1.00      0.96      0.98     199991
Weak              0.24      0.81      0.37       3397
Moderate          0.44      0.57      0.50       1245
Heavy             0.27      0.66      0.38        183
Severe            0.54      0.55      0.55         83

accuracy                              0.95     204899
macro avg         0.50      0.71      0.55
weighted avg      0.98      0.95      0.96

        `,
        data: {
          season: ["Summer", "Fall", "Winter", "Spring"],
          accuracy: [0.87, 0.96, 0.97, 0.99],
          rain_frequency: [0.069035, 0.015108, 0.006956, 0.002902]
        }
      },
      {
        name: "Punjab",
        report: `
              precision    recall  f1-score   support
No rain            1.00      0.95      0.97     21892
Weak               0.66      0.80      0.73      2551
Moderate           0.57      0.80      0.67       923
Heavy              0.42      0.76      0.54       114
Severe             0.61      0.61      0.61        49

accuracy                               0.93     25529
macro avg          0.65      0.79      0.70
weighted avg       0.94      0.93      0.93

        `,
        data: {
          season: ["Summer", "Fall", "Spring", "Winter"],
          accuracy: [0.848092, 0.954310, 0.967271, 0.971643],
          rain_frequency: [0.299704, 0.084376, 0.062405, 0.073625]
        }
      },
      {
        name: "Azad Kashmir",
        report: `
              precision    recall  f1-score   support
No rain            0.97      0.90      0.94     21341
Weak               0.80      0.83      0.82     11188
Moderate           0.39      0.73      0.51      1304
Heavy              0.34      0.35      0.35        34
Severe             1.00      0.50      0.67         2

accuracy                               0.87     33869
macro avg          0.70      0.66      0.66
weighted avg       0.89      0.87      0.88

        `,
        data: {
          season: ["Summer", "Fall", "Spring", "Winter"],
          accuracy: [0.775655, 0.915163, 0.916421, 0.994167],
          rain_frequency: [0.633216, 0.247604, 0.272739, 0.015379]
        }
      }
    ],
    heatwave: [],
        drought: [
      {
        name: "Pakistan National",
        report: `
                    precision    recall  f1-score   support

Extreme Drought         0.88      0.78      0.82        18
Severely Dry            0.86      0.83      0.85        36
Moderately Dry          0.85      0.84      0.84        92
Mild Drought            0.93      0.98      0.95       880
Moderately Wet          0.93      0.81      0.87       218
Very Wet                0.96      0.88      0.92        90
Extremely Wet           1.00      0.89      0.94        61

    accuracy                                0.93      1395
   macro avg            0.91      0.86      0.88      1395
weighted avg            0.93      0.93      0.92      1395
`,
data: {
          season: ["Summer", "Fall", "Winter", "Spring"],
          accuracy: [0.925, 0.937, 0.928, 0.931],
          drought_frequency: [0.245, 0.189, 0.156, 0.203]
      }
    }
    ]
  };

  const eventIcons = {
    rainfall: "💧",
    heatwave: "🌡️",
    drought: "🏜️"
  };

  const eventLabels = {
    rainfall: "Rainfall",
    heatwave: "Heatwave", 
    drought: "Drought"
  };

  return (
    <main className="p-6 space-y-8 max-w-6xl mx-auto">
      <section>
        <h1 className="text-3xl font-bold mb-4">Research Dashboard</h1>
        <p className="text-gray-700">
          This dashboard offers transparency into our model development pipeline:
          data sources, feature selection logic, and comparison with third-party
          forecasts.
        </p>
      </section>

      {/* Data Source Section */}
      <section className="bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Data Source</h2>
        <p className="text-gray-600 mb-2">
          Our entire model pipeline is built on weather and climate data sourced from{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Open-Meteo API
          </a>
          . This includes high-resolution ERA5 and ICON reanalysis datasets.
        </p>
      </section>

      {/* Key Model Parameters */}
      <section className="bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Key Parameters Per Model</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(modelParameters).map(([model, features]) => (
            <div key={model} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold capitalize mb-2 flex items-center">
                <span className="mr-2">{eventIcons[model]}</span>
                {model}
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {features.map((param, i) => (
                  <li key={i} className="text-sm">{param}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Selection Methods */}
      <section className="bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Feature Selection Methods</h2>
        <div className="space-y-4 text-gray-700">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-bold">Random Forest</h3>
            <p>
              Random Forest uses ensemble decision trees to rank features based on their ability
              to reduce impurity across all trees. This helps identify features that most
              strongly influence predictions.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Robust to overfitting, captures non-linear relations, and gives
              intuitive feature importance.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-bold">Mutual Information Analysis</h3>
            <p>
              Measures how much knowing a feature reduces uncertainty about the target.
              It captures both linear and non-linear dependencies without assuming a
              specific relationship.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Ideal for uncovering complex relationships beyond simple
              correlations.
            </p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-lg font-bold">Lagged Feature Analysis</h3>
            <p>
              Past weather conditions heavily influence current outcomes. By lagging features
              (1h, 3h, 6h), we expose the model to temporal dependencies and autocorrelations.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Weather is temporal. Lagging allows historical context in every prediction.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Importance Insights */}
      <section className="bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Key Feature Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p><strong>Soil Moisture (0–7cm):</strong> Highly predictive of rainfall.</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p><strong>Surface Pressure:</strong> Inversely related to rainfall.</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p><strong>Cloud Cover (Low, Mid):</strong> Captures atmospheric moisture and condensation potential.</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p><strong>Dew Point (2m):</strong> Indicates air saturation and rainfall probability.</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p><strong>Relative Humidity (2m):</strong>More humidity = higher rainfall likelihood.</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p><strong>Wind Gusts (10m):</strong> Linked to storm movement.</p>
          </div>
        </div>
      </section>

      {/* Model Choice Explanation */}
      <section className="bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4"> 
          Why We Chose XGBoost for All Weather Events
        </h2>
        <div className="text-gray-600 space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p><strong>Handles Imbalanced Data:</strong> Custom sample weighting let us boost rare classes like &ldquo;Heavy&rdquo; and &ldquo;Severe&rdquo; events.</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p><strong>Consistent Cross-Task Performance:</strong> Worked reliably across all three tasks: rainfall classification, heatwave detection, and drought prediction.</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <p><strong>Built-in Regularization:</strong> Prevented overfitting better than most ML and DL models, especially on smaller seasonal subsets.</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <p><strong>Feature Interpretability:</strong> Clear feature importance rankings helped us debug, tune, and explain model behavior.</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <p><strong>Flexible Objectives:</strong> Easily switched between multi-class and binary classification using the same core model.</p>
          </div>
        </div>
      </section>

      {/* Event Tabs */}
      <section className="bg-white p-5 rounded-xl shadow-md">
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {Object.keys(eventLabels).map((event) => (
            <button
              key={event}
              onClick={() => setActiveEvent(event)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                activeEvent === event
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{eventIcons[event]}</span>
              <span className="font-medium">{eventLabels[event]}</span>
              {activeEvent === event && (
                <span className="text-xs bg-blue-400 px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Active Event Classification Reports */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 capitalize">
            {eventLabels[activeEvent]} Model Development
          </h2>
          
          {activeEvent === 'rainfall' && (
            <div className="space-y-6">
              {classificationReports[activeEvent].map((province) => (
                <div key={province.name} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {province.name} - {eventLabels[activeEvent]} Model
                  </h3>
                  <pre className="bg-white p-3 rounded text-sm whitespace-pre-wrap mb-4 border shadow-sm">
                    {province.report}
                  </pre>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 border text-left">Season</th>
                          <th className="py-2 px-4 border text-left">Accuracy</th>
                          <th className="py-2 px-4 border text-left">Rain Frequency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {province.data.season.map((season, index) => (
                          <tr key={season} className="border-t hover:bg-gray-50">
                            <td className="py-2 px-4 border font-medium">{season}</td>
                            <td className="py-2 px-4 border">
                              {province.data.accuracy[index].toFixed(6)}
                            </td>
                            <td className="py-2 px-4 border">
                              {province.data.rain_frequency[index].toFixed(6)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeEvent === 'heatwave' && (
            <div className="space-y-6">
              {/* Heatwave Model Development Process */}
              <div className="border rounded-lg p-6 bg-gradient-to-r from-orange-50 to-red-50">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Heatwave Model Development Process</h3>
                
                {/* Time-based Features */}
                <div className="mb-6 p-4 bg-white rounded-lg border">
                  <h4 className="text-lg font-semibold mb-3 text-orange-600">Time-based Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><strong>Temporal Components:</strong> year, month, day, day_of_year, week_of_year, season</li>
                    <li><strong>Purpose:</strong> Help capture seasonal patterns in climate data</li>
                  </ul>
                </div>

                {/* Rolling Averages */}
                <div className="mb-6 p-4 bg-white rounded-lg border">
                  <h4 className="text-lg font-semibold mb-3 text-blue-600">Rolling Averages (Past Data Only)</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><strong>temp_7d_avg:</strong> 7-day moving average of temperature</li>
                    <li><strong>temp_14d_avg:</strong> 14-day moving average of temperature</li>
                    <li><strong>Purpose:</strong> Used to capture short-term trends leading up to a heatwave</li>
                  </ul>
                </div>

                {/* Heatwave-Related Features */}
                <div className="mb-6 p-4 bg-white rounded-lg border">
                  <h4 className="text-lg font-semibold mb-3 text-red-600">Heatwave-Related Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><strong>heatwave_threshold:</strong> Threshold temperature to classify heatwave days</li>
                    <li><strong>is_heatwave_day:</strong> Binary (0/1) label indicating if that day was classified as a heatwave before verification</li>
                    <li><strong>heatwave_final:</strong> Final confirmed heatwave label, possibly refined after verification</li>
                  </ul>
                </div>

                {/* Model Development Challenges */}
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="text-lg font-semibold mb-3 text-yellow-800">⚠️ Model Development Challenges</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Class Imbalance:</strong> 96.5% of the data is non-heatwave days, making basic models predict &ldquo;No Heatwave&rdquo; for ~96% accuracy</li>                    
                    <li><strong>Overfitting Issues:</strong> LR overfits on temperature and season; RF showed suspiciously high accuracy suggesting memorization</li>
                    <li><strong>Data Leakage:</strong> Perfect confusion matrices indicated potential feature leakage</li>
                  </ul>
                </div>

                {/* XGBoost Results */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-lg font-semibold mb-3 text-green-800">XGBoost Final Results</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-semibold text-red-600 mb-2">Initial Model (0.5 Threshold)</h5>
                      <ul className="text-sm space-y-1">
                        <li>Accuracy: 82%</li>
                        <li>Precision: 22% (very low)</li>
                        <li>Recall: 100% (all heatwaves detected)</li>
                        <li>F1-score: 0.36 (poor)</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <h5 className="font-semibold text-green-600 mb-2">Adjusted Model (0.9960 Threshold)</h5>
                      <ul className="text-sm space-y-1">
                        <li>Accuracy: 97%</li>
                        <li>Precision: 68% (huge improvement)</li>
                        <li>Recall: 78% (good balance)</li>
                        <li>F1-score: 0.73 (excellent)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border">
                    <h5 className="font-semibold text-purple-600 mb-2"> Feature Importance Analysis</h5>
                    <ul className="text-sm space-y-1">
                      <li><strong>temperature_2m_mean (42%):</strong> Most important, as expected for heatwave detection</li>
                      <li><strong>Month features (June, April):</strong> Seasonal patterns are crucial</li>
                      <li><strong>Heatwave threshold:</strong> Helps define heatwave conditions</li>
                      <li><strong>Wind speed & direction:</strong> Affects heat retention and cooling</li>
                      <li><strong>ET0 evapotranspiration:</strong> Related to water loss and heat buildup</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded border mt-4">
                    <h5 className="font-semibold text-blue-600 mb-2"> Model Validation</h5>
                    <ul className="text-sm space-y-1">
                      <li>✓ High AUC (0.98+): Excellent model performance</li>
                      <li>✓ Low False Positive Rate: Reliable predictions</li>
                      <li>✓ High True Positive Rate: Captures actual heatwave events</li>
                      <li>✓ Historical Validation: Accurately predicted heatwaves for June 18-24, 2015 and 2024</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeEvent === 'drought' && (
            <div className="space-y-6">
              {classificationReports[activeEvent].map((province) => (
                <div key={province.name} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {province.name} - {eventLabels[activeEvent]} Model
                  </h3>
                  <pre className="bg-white p-3 rounded text-sm whitespace-pre-wrap mb-4 border shadow-sm">
                    {province.report}
                  </pre>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-2 px-4 border text-left">Season</th>
                          <th className="py-2 px-4 border text-left">Accuracy</th>
                          <th className="py-2 px-4 border text-left">Drought Frequency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {province.data.season.map((season, index) => (
                          <tr key={season} className="border-t hover:bg-gray-50">
                            <td className="py-2 px-4 border font-medium">{season}</td>
                            <td className="py-2 px-4 border">
                              {province.data.accuracy[index].toFixed(6)}
                            </td>
                            <td className="py-2 px-4 border">
                              {province.data.drought_frequency[index].toFixed(6)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Comparative Forecasting */}
    </main>
  );
};

export default DebugScreen;