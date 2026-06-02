import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const analysisData = location.state || JSON.parse(localStorage.getItem('analysisData') || '{}');

  // Mock hospitals/medical facilities
  const staticFacilities = [
    { name: 'City General Hospital', distance: '0.5 km', rating: 4.8, specialists: 'All Specialties', phone: '(555) 123-4567' },
    { name: 'Metro Medical Clinic', distance: '1.2 km', rating: 4.5, specialists: 'General & Specialists', phone: '(555) 234-5678' },
    { name: 'Community Health Center', distance: '2.1 km', rating: 4.3, specialists: 'Primary Care', phone: '(555) 345-6789' },
  ];

  const nearbyFacilities = (analysisData.nearbyDoctors && analysisData.nearbyDoctors.length > 0)
    ? analysisData.nearbyDoctors.map(doc => ({
        name: doc.name,
        distance: typeof doc.distance === 'number' ? `${doc.distance.toFixed(1)} km` : `${doc.distance || '0.0 km'}`,
        rating: 4.8,
        specialists: doc.type || 'Healthcare Facility',
        phone: doc.phone || 'Phone unavailable'
      }))
    : staticFacilities;

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low':
        return 'success';
      case 'moderate':
        return 'warning';
      case 'high':
        return 'danger';
      default:
        return 'skyblue';
    }
  };

  const getUrgencyMessage = (urgency) => {
    switch (urgency) {
      case 'low':
        return 'Monitor and Self-Care';
      case 'moderate':
        return 'Seek Care Within 2-3 Days';
      case 'high':
        return 'Urgent Care Needed Today';
      default:
        return 'Moderate';
    }
  };

  const getSeverityLabel = (score) => {
    if (score >= 7) return 'High';
    if (score >= 5) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-slate-900 mb-4 leading-tight">Your Analysis Results</h1>
          <p className="text-lg text-slate-600">
            Based on your reported symptoms: <strong className="text-skyblue-600">{analysisData.mainSymptom || 'symptoms'}</strong>
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Urgency Card */}
          <Card accent="skyblue" className="bg-gradient-to-br from-skyblue-50 to-skyblue-100">
            <div className="text-center">
              <div className="text-4xl font-bold text-skyblue-600 mb-2">
                {getUrgencyMessage(analysisData.urgency).split(' ')[0]}
              </div>
              <p className="text-sm text-slate-600 font-medium">{getUrgencyMessage(analysisData.urgency)}</p>
              <p className="text-xs text-slate-500 mt-3">Urgency Level</p>
            </div>
          </Card>

          {/* Severity Score Card */}
          <Card accent="skyblue" className="bg-gradient-to-br from-skyblue-50 to-skyblue-100">
            <div className="text-center">
              <div className="text-4xl font-bold text-skyblue-600 mb-2">
                {analysisData.severityScore ? `${(analysisData.severityScore * 10).toFixed(0)}%` : 'N/A'}
              </div>
              <p className="text-sm text-slate-600 font-medium">Severity Score</p>
              <p className="text-xs text-slate-500 mt-3">{getSeverityLabel(analysisData.severityScore || 0)}</p>
            </div>
          </Card>

          {/* Specialty Card */}
          <Card accent="skyblue" className="bg-gradient-to-br from-skyblue-50 to-skyblue-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-skyblue-600 mb-2">
                {analysisData.recommendedSpecialty || 'GP'}
              </div>
              <p className="text-sm text-slate-600 font-medium">Recommended</p>
              <p className="text-xs text-slate-500 mt-3">Medical Specialty</p>
            </div>
          </Card>
        </div>

        {/* Possible Conditions */}
        {analysisData.conditions && analysisData.conditions.length > 0 && (
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-2 leading-tight">Possible Conditions</h2>
            <p className="text-slate-600 mb-6">These are potential conditions based on your symptoms. Professional medical evaluation is required for diagnosis.</p>
            <div className="space-y-4">
              {analysisData.conditions.map((condition, idx) => (
                <Card key={idx} accent="skyblue">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900">{condition.name}</h3>
                      <p className="text-sm text-slate-600 mt-2">{condition.description}</p>
                    </div>
                    <Badge
                      variant="primary"
                      className="flex-shrink-0 ml-4 bg-skyblue-100 text-skyblue-700"
                    >
                      {Math.round(condition.probability)}% Match
                    </Badge>
                  </div>

                  {/* Probability Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all bg-skyblue-500"
                      style={{ width: `${condition.probability}%` }}
                    ></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Next Steps */}
        {analysisData.nextSteps && analysisData.nextSteps.length > 0 && (
          <Card className="bg-skyblue-100 border-l-4 border-l-skyblue-500 mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Recommended Next Steps</h2>
            <ul className="space-y-3">
              {analysisData.nextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-skyblue-600 font-bold text-lg flex-shrink-0">→</span>
                  <span className="text-slate-700 leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Nearby Hospitals & Medical Facilities */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight">🏥 Nearby Medical Facilities</h2>
          <div className="space-y-4">
            {nearbyFacilities.map((facility, idx) => (
              <Card key={idx} accent="skyblue" className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900">{facility.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                      <span>📍 {facility.distance}</span>
                      <span>⭐ {facility.rating}/5</span>
                      <span>👨‍⚕️ {facility.specialists}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4 text-right">
                    <p className="font-semibold text-skyblue-600">{facility.phone}</p>
                    <Button size="sm" className="mt-2 whitespace-nowrap">Contact Now</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <p className="text-sm text-slate-500 mt-4 text-center">
            📍 Results show facilities near your area. Call ahead to confirm availability of specialists.
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card accent="skyblue">
            <h3 className="text-lg font-bold text-slate-900 mb-3">💾 Save Results</h3>
            <p className="text-slate-600 mb-5 text-sm">
              Download your analysis to share with your healthcare provider
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="w-full border-skyblue-500 text-skyblue-600"
              onClick={() => {
                const text = `MedCheck Analysis Results\nDate: ${new Date().toLocaleDateString()}\n\nSymptoms: ${analysisData.mainSymptom}\nDuration: ${analysisData.duration}\nSeverity: ${analysisData.severity}\n\nSeverity Score: ${analysisData.severityScore}/10\nUrgency: ${analysisData.urgency}\nRecommended Specialty: ${analysisData.recommendedSpecialty}\n\nConditions:\n${(analysisData.conditions || []).map(c => `- ${c.name}: ${Math.round(c.probability)}% probability`).join('\n')}\n\nNext Steps:\n${(analysisData.nextSteps || []).map(s => `- ${s}`).join('\n')}\n\nDisclaimer: This is for informational purposes only. Consult a healthcare professional for proper diagnosis.`;
                const blob = new Blob([text], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `medcheck-analysis-${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
              }}
            >
              📥 Download Results
            </Button>
          </Card>

          <Card accent="skyblue">
            <h3 className="text-lg font-bold text-slate-900 mb-3">🔄 Check Other Symptoms</h3>
            <p className="text-slate-600 mb-5 text-sm">
              Analyze different symptoms or get a second opinion on your health
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/symptom-checker')}
              className="w-full bg-skyblue-500 hover:bg-skyblue-600"
            >
              Check Another Symptom
            </Button>
          </Card>
        </div>

        {/* Disclaimer */}
        <Card className="bg-slate-50 border-l-4 border-l-slate-400">
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900">⚠️ Important Disclaimer:</strong> This analysis is provided for informational and educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Please consult with a qualified healthcare professional for accurate diagnosis and appropriate treatment. If you experience severe symptoms, difficulty breathing, chest pain, or any medical emergency, seek immediate professional medical care.
          </p>
        </Card>
      </div>
    </div>
  );
}

export default Results;
