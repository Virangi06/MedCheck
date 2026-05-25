import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';

function PatientDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [appointments, setAppointments] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(location.state?.showConfirmation);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load appointments
    const saved = JSON.parse(localStorage.getItem('appointments') || '[]');
    setAppointments(saved);

    // Auto-hide confirmation
    if (showConfirmation) {
      setTimeout(() => setShowConfirmation(false), 5000);
    }
  }, [user, navigate, showConfirmation]);

  if (!user) return null;

  const getAppointmentStatus = (date, time) => {
    const appointmentDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    if (appointmentDateTime < now) return 'completed';
    if (appointmentDateTime.getTime() - now.getTime() < 24 * 60 * 60 * 1000) return 'upcoming';
    return 'scheduled';
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-slate-900 mb-2 leading-tight">Welcome back, {user.name}!</h1>
          <p className="text-lg text-slate-600">Manage your appointments and health records</p>
        </div>

        {/* Success Notification */}
        {showConfirmation && (
          <Card className="bg-green-50 border-l-green-500 mb-6">
            <p className="text-green-700 font-medium">✓ Appointment booked successfully! Check your email for confirmation.</p>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {['appointments', 'history', 'health'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === tab
                  ? 'text-teal-600 border-b-2 border-b-teal-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'appointments' && '📅 Appointments'}
              {tab === 'history' && '📋 History'}
              {tab === 'health' && '❤️ Health Records'}
            </button>
          ))}
        </div>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            {appointments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {appointments.map((apt) => (
                  <Card key={apt.id} accent="teal">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{apt.doctor.name}</h3>
                        <p className="text-sm text-teal-600">{apt.doctor.specialty}</p>
                      </div>
                      <Badge variant="teal">
                        {getAppointmentStatus(apt.date, apt.time)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-slate-600">
                      <p>📅 {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                      <p>🕐 {apt.time}</p>
                      <p>💻 {apt.type === 'video' ? 'Video Consultation' : apt.type === 'phone' ? 'Phone Call' : 'In-Person'}</p>
                    </div>

                    {apt.notes && (
                      <div className="bg-slate-50 p-3 rounded mb-4 text-sm">
                        <p className="text-slate-600"><strong>Notes:</strong> {apt.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {getAppointmentStatus(apt.date, apt.time) === 'upcoming' && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1"
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {getAppointmentStatus(apt.date, apt.time) === 'completed' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-50 text-center py-12 border-l-slate-400">
                <p className="text-slate-600 mb-4 text-lg">No appointments scheduled yet</p>
                <Button onClick={() => navigate('/doctors')}>
                  Find a Doctor →
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <Card className="bg-slate-50 border-l-slate-400">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Symptom History</h2>
            <div className="space-y-4">
              {[
                { date: '2 weeks ago', symptoms: 'Fever, Headache', result: 'Common Cold', specialist: 'General Practitioner' },
                { date: '1 month ago', symptoms: 'Cough', result: 'Mild Bronchitis', specialist: 'General Practitioner' },
              ].map((item, idx) => (
                <Card key={idx} accent="primary">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-slate-900">{item.symptoms}</h3>
                      <p className="text-sm text-slate-600 mt-1">Result: {item.result}</p>
                      <p className="text-sm text-slate-600">Recommended: {item.specialist}</p>
                    </div>
                    <span className="text-sm text-slate-500">{item.date}</span>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <Card className="bg-slate-50 border-l-slate-400">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Health Records</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card accent="primary">
                <h3 className="font-bold text-slate-900 mb-2">Blood Type</h3>
                <p className="text-2xl font-bold text-primary-600">O+</p>
              </Card>
              <Card accent="teal">
                <h3 className="font-bold text-slate-900 mb-2">Last Check-up</h3>
                <p className="text-sm text-slate-600">3 months ago</p>
              </Card>
              <Card accent="blue">
                <h3 className="font-bold text-slate-900 mb-2">Allergies</h3>
                <p className="text-sm text-slate-600">Penicillin</p>
              </Card>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;
