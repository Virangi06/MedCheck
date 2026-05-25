import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import Checkbox from '../components/Checkbox';
import Select from '../components/Select';
import { analyzeSymptoms } from '../services/symptomAnalysis';

function SymptomChecker() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [otherSymptoms, setOtherSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);

  const commonSymptoms = [
    { id: 1, name: 'Fever' },
    { id: 2, name: 'Headache' },
    { id: 3, name: 'Cough' },
    { id: 4, name: 'Fatigue' },
    { id: 5, name: 'Body Aches' },
    { id: 6, name: 'Sore Throat' },
    { id: 7, name: 'Runny Nose' },
    { id: 8, name: 'Nausea' },
  ];

  const handleSymptomToggle = (symptom) => {
    if (otherSymptoms.includes(symptom)) {
      setOtherSymptoms(otherSymptoms.filter((s) => s !== symptom));
    } else {
      setOtherSymptoms([...otherSymptoms, symptom]);
    }
  };

  const handleAnalyze = async () => {
    if (!symptoms && otherSymptoms.length === 0) {
      alert('Please enter or select at least one symptom');
      return;
    }

    if (!duration || !severity) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const analysis = analyzeSymptoms(symptoms, otherSymptoms, duration, severity);
      const analysisData = {
        mainSymptom: symptoms,
        selectedSymptoms: otherSymptoms,
        duration,
        severity,
        ...analysis,
      };

      localStorage.setItem('analysisData', JSON.stringify(analysisData));
      navigate('/results', { state: analysisData });
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Error analyzing symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-slate-900 mb-4 leading-tight">Smart Symptom Checker</h1>
          <p className="text-lg text-slate-600">
            Describe your health concerns and our AI will provide detailed analysis with specialist recommendations
          </p>

          {/* Progress */}
          <div className="flex justify-center gap-2 mt-8">
            <div
              className={`w-3 h-3 rounded-full ${
                step >= 1 ? 'bg-skyblue-500' : 'bg-slate-200'
              }`}
            ></div>
            <div
              className={`w-3 h-3 rounded-full ${
                step >= 2 ? 'bg-skyblue-500' : 'bg-slate-200'
              }`}
            ></div>
          </div>
        </div>

        {/* Step 1: Enter Symptoms */}
        {step === 1 && (
          <Card className="bg-white">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Step 1: Describe Your Symptoms</h2>

            <div className="mb-8">
              <Input
                label="Primary Symptom or Concern"
                placeholder="e.g., fever, persistent headache, chest discomfort..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                icon={<span>🤒</span>}
              />
              <p className="text-xs text-slate-500 mt-2">Be as specific as possible to get accurate results</p>
            </div>

            <div className="mb-8">
              <label className="text-sm font-medium text-slate-700 mb-3 block">
                Associated Symptoms (optional)
              </label>
              <p className="text-xs text-slate-600 mb-4">Select any additional symptoms you're experiencing</p>
              <div className="grid grid-cols-2 gap-3">
                {commonSymptoms.map((symptom) => (
                  <Checkbox
                    key={symptom.id}
                    id={`symptom-${symptom.id}`}
                    label={symptom.name}
                    checked={otherSymptoms.includes(symptom.name)}
                    onChange={() => handleSymptomToggle(symptom.name)}
                  />
                ))}
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setStep(2)}
              disabled={!symptoms && otherSymptoms.length === 0}
              className="w-full"
            >
              Next: Additional Information →
            </Button>
          </Card>
        )}

        {/* Step 2: Additional Information */}
        {step === 2 && (
          <Card className="bg-white">
            <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Step 2: Provide Context</h2>

            <div className="space-y-6">
              <Select
                label="How long have you had these symptoms?"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                options={[
                  { value: 'less-than-24h', label: 'Less than 24 hours' },
                  { value: '1-3-days', label: '1-3 days' },
                  { value: '3-7-days', label: '3-7 days' },
                  { value: '1-2-weeks', label: '1-2 weeks' },
                  { value: 'more-than-2-weeks', label: 'More than 2 weeks' },
                ]}
              />

              <Select
                label="How severe are your symptoms?"
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                options={[
                  { value: 'mild', label: 'Mild - Slightly uncomfortable but manageable' },
                  { value: 'moderate', label: 'Moderate - Interferes with normal daily activities' },
                  { value: 'severe', label: 'Severe - Significantly impacting daily life' },
                ]}
              />

              <div className="bg-skyblue-100 border-l-4 border-l-skyblue-500 p-4 rounded">
                <p className="text-sm font-medium text-skyblue-900 mb-2">Your Summary</p>
                <p className="text-sm text-slate-700">
                  <strong>Symptoms:</strong> {symptoms} {otherSymptoms.length > 0 && `+ ${otherSymptoms.join(', ')}`}
                </p>
                <p className="text-sm text-slate-700 mt-1">
                  <strong>Duration:</strong> {duration && duration.replace(/-/g, ' ')} | <strong>Severity:</strong> {severity && severity.charAt(0).toUpperCase() + severity.slice(1)}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                ← Back
              </Button>
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Analyzing Your Symptoms...' : 'Get AI Analysis →'}
              </Button>
            </div>
          </Card>
        )}

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card accent="skyblue">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-slate-900 mb-2">Comprehensive Analysis</h3>
            <p className="text-sm text-slate-600">
              Advanced AI analyzes your symptoms against thousands of medical conditions
            </p>
          </Card>

          <Card accent="skyblue">
            <div className="text-3xl mb-3">👨‍⚕️</div>
            <h3 className="font-bold text-slate-900 mb-2">Specialist Guidance</h3>
            <p className="text-sm text-slate-600">
              Receive recommendations for appropriate healthcare professionals
            </p>
          </Card>

          <Card accent="skyblue">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-slate-900 mb-2">Instant Results</h3>
            <p className="text-sm text-slate-600">
              Get detailed insights and urgency assessment in seconds
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default SymptomChecker;
