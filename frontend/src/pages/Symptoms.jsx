import { useState } from 'react';
import { Search, Heart, Brain, ShieldCheck, X, AlertTriangle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const symptomsData = [
  {
    id: 'headache',
    title: 'Headache',
    shortDesc: 'Pain or discomfort in the head, scalp, or neck region. Can range from mild to severe and may be throbbing, sharp, or dull.',
    feelsLike: 'A dull ache, tightness across the forehead (tension headache), or intense throbbing on one side of the head often accompanied by sensitivity to light and sound (migraine). Some headaches may feel like sharp, piercing pain behind one eye (cluster headache).',
    causes: [
      'Stress and muscle tension in the neck and shoulders',
      'Dehydration or skipping meals',
      'Lack of sleep or sudden changes in sleep patterns',
      'Caffeine withdrawal or excessive alcohol use',
      'Sinus congestion or eye strain'
    ],
    selfCare: [
      'Rest in a quiet, dark room.',
      'Apply a cold compress to your forehead or the back of your neck.',
      'Stay hydrated by drinking plenty of water throughout the day.',
      'Practice relaxation techniques such as deep breathing or gentle stretching.',
      'Over-the-counter pain relievers (like ibuprofen or acetaminophen) as directed.'
    ],
    warningSigns: [
      'Sudden, severe headache that peaks within seconds ("thunderclap" headache)',
      'Headache accompanied by fever, stiff neck, confusion, or seizures',
      'Headache following a head injury',
      'New headache accompanied by weakness, numbness, or difficulty speaking'
    ]
  },
  {
    id: 'chest-pain',
    title: 'Chest Pain',
    shortDesc: 'Discomfort or pain felt in the chest area. Can vary from sharp stabbing pain to a dull ache, pressure, or burning sensation.',
    feelsLike: 'A crushing pressure, squeezing, or fullness in the center of the chest. It can also feel like a sharp, stabbing sensation when taking deep breaths, or a burning discomfort similar to heartburn that radiates to the neck, jaw, or arms.',
    causes: [
      'Cardiovascular issues (angina, heart attack, pericarditis)',
      'Gastrointestinal problems (acid reflux/GERD, esophageal spasms)',
      'Musculoskeletal strain (costochondritis, strained chest muscles)',
      'Respiratory conditions (pneumonia, pleurisy, asthma)',
      'Anxiety or panic attacks'
    ],
    selfCare: [
      'If diagnosed with acid reflux, sit upright and avoid lying down immediately after eating.',
      'Practice slow, controlled breathing if the chest tightness is due to anxiety.',
      'Avoid strenuous physical exertion until evaluated by a professional.'
    ],
    warningSigns: [
      'Chest pain that radiates to your arm, shoulder, neck, jaw, or back',
      'Pain accompanied by shortness of breath, sweating, dizziness, or nausea',
      'Pressure or squeezing sensation that lasts more than a few minutes or goes away and returns',
      'Difficulty swallowing or coughing up blood'
    ]
  },
  {
    id: 'stomach-pain',
    title: 'Stomach Pain',
    shortDesc: 'Abdominal discomfort or cramping in the stomach region. May be accompanied by bloating, gas, or changes in digestion.',
    feelsLike: 'Sharp cramps, dull aches, generalized burning, or localized tenderness in any quadrant of the abdomen. It may range from mild, temporary gas pain to severe, persistent cramping.',
    causes: [
      'Indigestion, gas, or constipation',
      'Gastroenteritis (stomach flu) or food poisoning',
      'Irritable Bowel Syndrome (IBS) or food intolerances',
      'Gastritis or stomach ulcers',
      'More serious conditions like appendicitis or gallstones'
    ],
    selfCare: [
      'Sip clear fluids like water, broth, or diluted juices.',
      'Avoid solid foods for the first few hours if experiencing vomiting.',
      'Eat small, bland meals (rice, toast, applesauce) once you feel ready.',
      'Apply a warm heating pad to your abdomen to soothe muscle cramps.',
      'Avoid dairy, caffeine, alcohol, and carbonated beverages.'
    ],
    warningSigns: [
      'Severe, sudden abdominal pain, especially localized to the lower right side (potential appendicitis)',
      'Abdominal pain accompanied by high fever, persistent vomiting, or inability to keep fluids down',
      'Stool containing blood or appearing black and tarry',
      'Abdomen that is hard, rigid, or extremely tender to the touch'
    ]
  },
  {
    id: 'fatigue',
    title: 'Fatigue',
    shortDesc: 'Persistent tiredness, lack of energy, or exhaustion that doesn\'t improve with rest. Can affect physical and mental capabilities.',
    feelsLike: 'An overwhelming sense of exhaustion, feeling physically heavy, brain fog, difficulty concentrating, and lacking the motivation or energy to perform basic daily activities.',
    causes: [
      'Chronic sleep deprivation or poor sleep quality (sleep apnea)',
      'High levels of stress, anxiety, or depression',
      'Nutritional deficiencies (e.g., iron-deficiency anemia, Vitamin D or B12)',
      'Endocrine disorders (hypothyroidism, diabetes)',
      'Chronic infections or autoimmune conditions'
    ],
    selfCare: [
      'Establish a regular sleep schedule, aiming for 7-9 hours of quality sleep.',
      'Incorporate light physical activity, like a daily walk, to boost energy levels.',
      'Eat a balanced diet rich in whole foods, lean proteins, and complex carbohydrates.',
      'Stay hydrated and limit intake of caffeine and alcohol, especially in the evening.',
      'Delegate tasks and practice stress management techniques.'
    ],
    warningSigns: [
      'Fatigue accompanied by unexplained weight loss or night sweats',
      'Severe shortness of breath or chest discomfort alongside fatigue',
      'Sudden onset of fatigue with weakness on one side of the body',
      'Fatigue accompanied by a high fever or swollen lymph nodes'
    ]
  },
  {
    id: 'fever',
    title: 'Fever',
    shortDesc: 'Elevated body temperature above 100.4°F (38°C). Often accompanies infections and indicates the body is fighting off illness.',
    feelsLike: 'Feeling hot to the touch, experiencing chills and shivering, sweating, generalized muscle and body aches, headache, and loss of appetite.',
    causes: [
      'Viral infections (cold, flu, COVID-19)',
      'Bacterial infections (urinary tract infection, strep throat, pneumonia)',
      'Inflammatory conditions or autoimmune flare-ups',
      'Heat exhaustion or severe sunburn',
      'Side effect of certain medications or vaccinations'
    ],
    selfCare: [
      'Drink plenty of fluids (water, herbal tea, clear broths) to prevent dehydration.',
      'Get ample rest to help your immune system recover.',
      'Dress in lightweight clothing and use a light blanket.',
      'Take a lukewarm bath (avoid cold water as it can cause shivering, which raises core temp).',
      'Use over-the-counter fever reducers (like acetaminophen or ibuprofen) if the fever is causing discomfort.'
    ],
    warningSigns: [
      'Temperature exceeding 103°F (39.4°C) that doesn\'t respond to medication',
      'Fever accompanied by a stiff neck, severe headache, confusion, or light sensitivity',
      'Difficulty breathing or chest pain',
      'Fever lasting more than three consecutive days'
    ]
  },
  {
    id: 'cough',
    title: 'Cough',
    shortDesc: 'Reflex action that clears the throat and airways. Can be dry or productive (with mucus) and acute or chronic.',
    feelsLike: 'A tickle or irritation in the throat prompting a sudden expulsion of air. It may feel dry, scratchy, and painful, or wet and heavy with phlegm or mucus in the chest.',
    causes: [
      'Viral respiratory tract infections (common cold, bronchitis)',
      'Allergies (hay fever) or asthma triggers',
      'Post-nasal drip from sinus inflammation',
      'Gastroesophageal reflux disease (GERD) irritating the throat',
      'Exposure to environmental irritants (smoke, dust, pollution)'
    ],
    selfCare: [
      'Stay well-hydrated to help thin mucus in your throat and airways.',
      'Use a cool-mist humidifier or take a steamy shower to soothe airways.',
      'Use throat lozenges or honey (for adults and children over 1 year) to calm a tickling throat.',
      'Avoid exposure to tobacco smoke and other chemical irritants.',
      'Elevate your head with extra pillows while sleeping.'
    ],
    warningSigns: [
      'Coughing up blood or pink-tinged mucus',
      'Cough accompanied by shortness of breath, wheezing, or high-pitched breathing sounds',
      'Unexplained weight loss, night sweats, or a high fever along with a chronic cough',
      'A cough that persists for more than 3-4 weeks without improvement'
    ]
  },
  {
    id: 'dizziness',
    title: 'Dizziness',
    shortDesc: 'Feeling of lightheadedness, unsteadiness, or vertigo (spinning sensation). May affect balance.',
    feelsLike: 'A sensation that the room is spinning around you (vertigo), feeling faint, lightheaded, off-balance, or floaty, which worsens when standing up or moving your head.',
    causes: [
      'Inner ear issues (benign paroxysmal positional vertigo, labyrinthitis)',
      'Dehydration, low blood sugar, or sudden drops in blood pressure (orthostatic hypotension)',
      'Anemia or poor blood circulation',
      'Anxiety or hyperventilation',
      'Side effects of certain prescription medications'
    ],
    selfCare: [
      'Sit or lie down immediately when you feel dizzy to avoid falling.',
      'Move slowly when changing positions, especially when standing up from lying down.',
      'Drink water and consume a small snack if you suspect low blood sugar or dehydration.',
      'Avoid driving, operating machinery, or climbing stairs while dizzy.',
      'Limit caffeine, alcohol, tobacco, and high-salt foods.'
    ],
    warningSigns: [
      'Dizziness accompanied by sudden numbness, weakness, or paralysis in your face, arm, or leg',
      'Dizziness with double vision, difficulty speaking, or confusion',
      'Dizziness following a head injury',
      'Dizziness accompanied by chest pain or a rapid/irregular heartbeat'
    ]
  },
  {
    id: 'nausea',
    title: 'Nausea',
    shortDesc: 'Uncomfortable sensation in the stomach often accompanied by the urge to vomit.',
    feelsLike: 'An uneasy, wave-like discomfort in the back of the throat or stomach, often accompanied by cold sweats, salivation, lightheadedness, and an aversion to food smells.',
    causes: [
      'Viral gastroenteritis (stomach flu) or food poisoning',
      'Pregnancy (morning sickness)',
      'Motion sickness or inner ear disturbances',
      'Indigestion, gastritis, or gallbladder issues',
      'Stress, anxiety, or intense pain'
    ],
    selfCare: [
      'Rest quietly in a comfortable position, keeping your head elevated.',
      'Sip cold, clear beverages (water, ginger ale, peppermint tea) slowly.',
      'Eat bland, dry foods (crackers, toast, pretzels) rather than sweet, greasy, or spicy foods.',
      'Avoid strong smells, perfume, and cooking odors.',
      'Avoid lying flat immediately after eating.'
    ],
    warningSigns: [
      'Nausea and vomiting accompanied by severe chest pain or stiffness in the neck',
      'Inability to keep any liquids down for more than 24 hours (risk of severe dehydration)',
      'Vomiting blood or material that looks like coffee grounds',
      'Nausea accompanied by a severe headache or confusion'
    ]
  },
  {
    id: 'back-pain',
    title: 'Back Pain',
    shortDesc: 'Pain or discomfort in the upper, middle, or lower back. Can be acute or chronic.',
    feelsLike: 'A dull, aching pain, sharp or stabbing sensations, stiffness that limits range of motion, or pain that radiates down one leg (sciatica). It can be constant or worsen with movement, lifting, or standing.',
    causes: [
      'Muscle strain or ligament sprain from improper lifting or sudden movements',
      'Poor posture or prolonged sitting at a desk',
      'Herniated or bulging discs pressing on nerves',
      'Spinal arthritis or osteoporosis',
      'Stress causing muscle tension'
    ],
    selfCare: [
      'Stay active with light movement; avoid prolonged bed rest (which can worsen stiffness).',
      'Apply ice packs for the first 48 hours to reduce inflammation, then switch to heat pads.',
      'Maintain good posture and support your lower back when sitting.',
      'Perform gentle stretching and core-strengthening exercises.',
      'Sleep on your side with a pillow between your knees, or on your back with a pillow under your knees.'
    ],
    warningSigns: [
      'Back pain accompanied by new bowel or bladder incontinence (potential Cauda Equina Syndrome)',
      'Back pain with numbness, tingling, or weakness in the groin or both legs',
      'Severe pain accompanied by unexplained fever or weight loss',
      'Pain that is constant, intense, and worsens when lying down'
    ]
  },
  {
    id: 'joint-pain',
    title: 'Joint Pain',
    shortDesc: 'Discomfort, pain, or inflammation in any of the body\'s joints, such as knees, shoulders, or hands.',
    feelsLike: 'Stiffness, swelling, warmth, tenderness, or a dull ache in one or more joints that worsens with physical activity or damp weather, restricting ease of movement.',
    causes: [
      'Osteoarthritis (wear and tear of joint cartilage)',
      'Rheumatoid arthritis or other autoimmune joint diseases',
      'Acute injury, sprain, or strain',
      'Tendinitis or bursitis (tendon or fluid-sac inflammation)',
      'Gout (uric acid crystal buildup in joints)'
    ],
    selfCare: [
      'Follow the PRICE protocol: Protect, Rest, Ice, Compress, Elevate for acute injuries.',
      'Incorporate low-impact exercises like swimming or cycling to keep joints mobile.',
      'Maintain a healthy weight to reduce load on weight-bearing joints (knees, hips).',
      'Apply warm compresses or soak in a warm bath to relieve stiff joints.',
      'Use supportive braces or wraps to stabilize weak joints if recommended.'
    ],
    warningSigns: [
      'Joint pain accompanied by fever, chills, and red, hot, swollen joint (signs of joint infection)',
      'Inability to bear weight on the joint or use the affected limb',
      'Sudden, severe joint swelling or visible joint deformity',
      'Pain that persists for several weeks despite self-care and rest'
    ]
  },
  {
    id: 'shortness-of-breath',
    title: 'Shortness of Breath',
    shortDesc: 'Difficulty breathing or feeling like you cannot get enough air. Can range from mild to severe.',
    feelsLike: 'An uncomfortable tightening in the chest, feeling like you are breathing harder or faster than normal, gasping for air, or feeling unable to take a deep, satisfying breath.',
    causes: [
      'Asthma flare-ups or allergic bronchospasm',
      'Pneumonia, bronchitis, or other lung infections',
      'Cardiovascular issues (congestive heart failure, arrhythmia)',
      'Anxiety, panic attacks, or hyperventilation',
      'Poor physical conditioning or high altitudes'
    ],
    selfCare: [
      'Sit down, lean forward slightly, and rest your elbows on a table to relax muscles.',
      'Practice pursed-lip breathing (inhale through nose, exhale slowly through pursed lips).',
      'Stay calm; panicking worsens breathing distress.',
      'If you have diagnosed asthma, use your rescue inhaler as prescribed.'
    ],
    warningSigns: [
      'Sudden onset of severe shortness of breath, especially at rest',
      'Breathing difficulty accompanied by chest pain, pressure, or arm pain',
      'Blue or gray color in your lips, tongue, or fingernails (cyanosis)',
      'Shortness of breath accompanied by swelling in your ankles or feet'
    ]
  },
  {
    id: 'insomnia',
    title: 'Insomnia / Sleep Problems',
    shortDesc: 'Difficulty falling asleep, staying asleep, or getting restful sleep. Can lead to daytime fatigue.',
    feelsLike: 'Lying awake in bed for hours unable to fall asleep, waking up frequently during the night, waking up too early and being unable to return to sleep, or feeling unrefreshed after waking.',
    causes: [
      'Stress, anxiety, or racing thoughts at bedtime',
      'Poor sleep hygiene (screen time, caffeine, irregular sleep schedules)',
      'Side effects of certain medications, caffeine, or alcohol',
      'Chronic pain or other medical conditions disrupting rest',
      'Sleep disorders like sleep apnea or restless legs syndrome'
    ],
    selfCare: [
      'Go to bed and wake up at the exact same times daily, even on weekends.',
      'Keep your bedroom dark, quiet, and cool (60-67°F or 15-19°C).',
      'Avoid screens (phones, tablets, TV) for at least 1 hour before sleeping.',
      'Avoid large meals, caffeine, and alcohol close to bedtime.',
      'If you can\'t fall asleep after 20 minutes, get out of bed and do a quiet, non-screen activity until sleepy.'
    ],
    warningSigns: [
      'Sleep issues accompanied by loud, disruptive snoring or gasping for air during sleep (possible sleep apnea)',
      'Severe daytime sleepiness that causes you to fall asleep while driving or working',
      'Sleep problems accompanied by severe anxiety, depression, or mood disturbances',
      'Chronic insomnia lasting more than a month that impairs your daily functioning'
    ]
  }
];

function Symptoms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  const filteredSymptoms = symptomsData.filter(symptom =>
    symptom.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    symptom.shortDesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: '#f8fafc', minHeight: '100vh', padding: '0 0 80px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .symptom-card {
          background: white;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          box-sizing: border-box;
        }
        .symptom-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
          border-color: #cbd5e1;
        }
        .search-box {
          position: relative;
          max-width: 580px;
          margin: 0 auto 56px;
        }
        .search-input {
          width: 100%;
          padding: 16px 20px 16px 54px;
          border-radius: 50px;
          border: 1px solid #cbd5e1;
          background: white;
          font-size: 16px;
          font-family: 'DM Sans', sans-serif;
          color: #0f172a;
          outline: none;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          box-sizing: border-box;
        }
        .search-input:focus {
          border-color: #0ea5e9;
          box-shadow: 0 4px 24px rgba(14,165,233,0.15);
        }
        .search-icon {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }
        .read-guide-btn {
          color: #0ea5e9;
          font-weight: 600;
          font-size: 15px;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
          margin-top: 20px;
          text-align: left;
        }
        .read-guide-btn:hover {
          color: #0284c7;
          gap: 10px;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
          animation: fadeIn 0.3s ease-out;
        }
        .modal-content {
          background: white;
          border-radius: 28px;
          padding: 40px;
          width: 100%;
          max-width: 680px;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 30px 80px rgba(15,23,42,0.18);
          border: 1px solid rgba(226, 232, 240, 0.8);
          position: relative;
          box-sizing: border-box;
          animation: slideUp 0.3s ease-out;
        }
        .modal-close-btn {
          position: absolute;
          top: 28px;
          right: 28px;
          background: #f1f5f9;
          border: none;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
        }
        .modal-close-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
          transform: scale(1.05);
        }
        .section-tag-symptoms {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EFF9FF;
          color: #0284c7;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 50px;
          border: 1px solid #BAE6FD;
          margin-bottom: 20px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .modal-section-title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          color: #0f172a;
          margin: 28px 0 12px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .disclaimer-box {
          background: #f8fafc;
          border-left: 4px solid #0ea5e9;
          border-radius: 12px;
          padding: 20px;
          margin-top: 36px;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <section style={{ padding: '80px 24px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="section-tag-symptoms">Symptoms Library</div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(36px, 6vw, 54px)', fontWeight: 700, color: '#0f172a', letterSpacing: '-1.5px', marginBottom: 24 }}>
            Understand your symptoms
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2.2vw, 17px)', color: '#475569', maxWidth: 660, margin: '0 auto 40px', lineHeight: 1.8 }}>
            Plain-language guides to the symptoms people most commonly look up.
            Each page covers what the symptom typically feels like, common causes,
            self-care that actually helps, and the warning signs that mean it's time to see
            a clinician. Educational only — not a substitute for medical advice.
          </p>
        </div>
      </section>

      {/* ─── SEARCH ─── */}
      <div style={{ padding: '0 24px' }}>
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Search symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ─── SYMPTOMS GRID ─── */}
      <section style={{ padding: '0 24px', maxWidth: 1100, margin: '0 auto' }}>
        {filteredSymptoms.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {filteredSymptoms.map((symptom) => (
              <div key={symptom.id} className="symptom-card">
                <div>
                  <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontStyle: 'italic', fontWeight: 'normal', color: '#0f172a', margin: '0 0 16px 0', letterSpacing: '-0.5px' }}>
                    {symptom.title}
                  </h2>
                  <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                    {symptom.shortDesc}
                  </p>
                </div>
                <div>
                  <button className="read-guide-btn" onClick={() => setSelectedSymptom(symptom)}>
                    Read guide <span style={{ transition: 'transform 0.2s' }}>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
            <AlertTriangle size={48} style={{ strokeWidth: 1.5, marginBottom: 16, color: '#94a3b8' }} />
            <h3>No symptoms found matching your search</h3>
            <p style={{ fontSize: 15 }}>Try adjusting your search terms or view our complete list.</p>
          </div>
        )}
      </section>

      {/* ─── PAGE FOOTER DISCLAIMER ─── */}
      <section style={{ maxWidth: 1100, margin: '64px auto 0', padding: '0 24px' }}>
        <div style={{ background: '#ffffff', borderRadius: 20, padding: 32, border: '1px solid #e2e8f0', display: 'flex', gap: 20, alignItems: 'start' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EFF9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={22} color="#0ea5e9" />
          </div>
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Medical Disclaimer</h4>
            <p style={{ margin: 0, fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>
              The information in this library is for general educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. In an emergency, call your local emergency number.
            </p>
          </div>
        </div>
      </section>

      {/* ─── DETAIL MODAL ─── */}
      {selectedSymptom && (
        <div className="modal-overlay" onClick={() => setSelectedSymptom(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedSymptom(null)} aria-label="Close modal">
              <X size={18} />
            </button>

            <div className="section-tag-symptoms">Clinical Guide</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 4vw, 36px)', color: '#0f172a', margin: '0 0 16px', letterSpacing: '-1px' }}>
              {selectedSymptom.title}
            </h2>
            <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.8, marginBottom: 0 }}>
              {selectedSymptom.shortDesc}
            </p>

            {/* Feels Like Section */}
            <h3 className="modal-section-title">
              <BookOpen size={18} color="#0ea5e9" /> What It Typically Feels Like
            </h3>
            <p style={{ color: '#475569', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              {selectedSymptom.feelsLike}
            </p>

            {/* Common Causes */}
            <h3 className="modal-section-title">
              <Brain size={18} color="#0ea5e9" /> Common Causes
            </h3>
            <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedSymptom.causes.map((cause, idx) => (
                <li key={idx} style={{ color: '#475569', fontSize: 15, lineHeight: 1.6 }}>{cause}</li>
              ))}
            </ul>

            {/* Self-Care */}
            <h3 className="modal-section-title">
              <Heart size={18} color="#0ea5e9" /> Self-Care That Actually Helps
            </h3>
            <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedSymptom.selfCare.map((tip, idx) => (
                <li key={idx} style={{ color: '#475569', fontSize: 15, lineHeight: 1.6 }}>{tip}</li>
              ))}
            </ul>

            {/* Warning Signs */}
            <h3 className="modal-section-title" style={{ color: '#ef4444' }}>
              <AlertTriangle size={18} color="#ef4444" /> Warning Signs (Seek Medical Attention)
            </h3>
            <ul style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedSymptom.warningSigns.map((sign, idx) => (
                <li key={idx} style={{ color: '#991b1b', fontSize: 15, lineHeight: 1.6, fontWeight: 500 }}>{sign}</li>
              ))}
            </ul>

            {/* Disclaimer inside modal */}
            <div className="disclaimer-box">
              <div style={{ display: 'flex', gap: 12, alignItems: 'start' }}>
                <ShieldCheck size={20} color="#0ea5e9" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0, fontSize: 13.5, color: '#475569', lineHeight: 1.6 }}>
                  <strong>Important Notice:</strong> The information in this library is for general educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. In an emergency, call your local emergency number.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Symptoms;
