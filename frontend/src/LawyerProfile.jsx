import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck,
  FileCheck2,
  MapPin,
  MessageSquareText,
  Phone,
  Save,
  Scale,
  Search,
  ShieldCheck,
  Star,
  UsersRound,
  Plus,
  Trash2
} from 'lucide-react';
import { practiceAreas, readStoredLawyerProfile, readStoredRequests } from './demoData';
import { updateLawyerProfile, API } from './api';
import './styles.css';

const schedule = [
  ['10:00 AM', 'ரவி குமார்', 'FIR மறுப்பு ஆலோசனை'],
  ['12:30 PM', 'அனன்யா', 'பாதுகாப்பு உத்தரவு வழிகாட்டல்'],
  ['04:00 PM', 'ஆவண மதிப்பாய்வு', 'வாடகை முன்பணம் அறிவிப்பு']
];

const LawyerProfile = () => {
  const [lawyer, setLawyer] = useState(readStoredLawyerProfile);
  const [requests, setRequests] = useState(() => {
    const allReqs = readStoredRequests();
    try {
      const session = JSON.parse(localStorage.getItem('lawvoice-session') || '{}');
      const currentName = session.name || '';
      const isPriya = currentName.includes('ப்ரியா') || currentName.includes('Priya');
      const isMeena = currentName.includes('மீனா') || currentName.includes('Meena');
      
      return allReqs.filter(req => {
        if (req.lawyerId === ('u' + session.id)) return true;
        if (isPriya && req.lawyerId === 'priya') return true;
        if (isMeena && req.lawyerId === 'meena') return true;
        return false;
      });
    } catch {
      return [];
    }
  });
  const [otherLawyers, setOtherLawyers] = useState([]);
  const [newCaseText, setNewCaseText] = useState('');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeRequest, setActiveRequest] = useState(null);
  const [saved, setSaved] = useState('');
  const [reply, setReply] = useState('');

  // Set active request if requests are loaded
  useEffect(() => {
    if (requests.length > 0 && !activeRequest) {
      setActiveRequest(requests[0]);
    }
  }, [requests, activeRequest]);

  // Load other lawyers from backend
  useEffect(() => {
    const loadLawyers = async () => {
      try {
        const session = JSON.parse(localStorage.getItem('lawvoice-session') || '{}');
        const res = await fetch(`${API}/lawyers`);
        if (res.ok) {
          const data = await res.json();
          // Filter out the logged-in lawyer from other lawyers list
          if (Array.isArray(data)) {
            setOtherLawyers(data.filter(l => l.name !== session.name));
          }
        }
      } catch (err) {
        console.error("Failed to load other lawyers:", err);
      }
    };
    loadLawyers();
  }, []);

  const filteredRequests = useMemo(() => {
    const term = query.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesCategory = categoryFilter === 'All' || request.category === categoryFilter;
      const matchesSearch = !term || `${request.name} ${request.issue} ${request.city} ${request.status}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, query, requests]);

  const updateLawyer = (field, value) => {
    setLawyer((current) => ({ ...current, [field]: value }));
    setSaved('');
  };

  const saveLawyer = async () => {
    try {
      setSaved('சேமிக்கிறது...');
      localStorage.setItem('lawvoice-lawyer-profile', JSON.stringify(lawyer));
      
      const session = JSON.parse(localStorage.getItem('lawvoice-session') || '{}');
      const payload = {
        name: lawyer.name,
        phone: lawyer.phone,
        district: lawyer.district,
        city: lawyer.city,
        barId: lawyer.barId,
        category: lawyer.category,
        experience: lawyer.experience,
        office: lawyer.office,
        state: lawyer.state,
        languages: lawyer.languages,
        consultationMode: lawyer.consultationMode,
        availability: lawyer.availability,
        bio: lawyer.bio,
        education: lawyer.education,
        courtPractice: lawyer.courtPractice,
        consultationFee: lawyer.consultationFee,
        caseHistory: lawyer.caseHistory
      };
      
      await updateLawyerProfile(payload);
      
      // Update local session info
      session.name = lawyer.name;
      session.phone = lawyer.phone;
      session.district = lawyer.district;
      localStorage.setItem('lawvoice-session', JSON.stringify(session));

      setSaved('சுயவிவரம் சேமிக்கப்பட்டது. மக்கள் இப்போது உங்கள் புதுப்பிக்கப்பட்ட பொது விவரங்கள் மற்றும் வழக்கு வரலாறைக் காணலாம்.');
    } catch (err) {
      setSaved('சேமிப்பு தோல்வியடைந்தது: ' + err.message);
    }
  };

  const updateRequestStatus = async (status) => {
    if (!activeRequest) return;
    const updated = requests.map((request) => request.id === activeRequest.id ? { ...request, status } : request);
    setRequests(updated);
    setActiveRequest({ ...activeRequest, status });
    localStorage.setItem('lawvoice-requests', JSON.stringify(updated));

    // If marked as "முடிந்தது" (Solved), append to case history automatically
    if (status === 'முடிந்தது') {
      const newCase = `செயலி மூலம் தீர்க்கப்பட்ட வழக்கு: ${activeRequest.name} - ${activeRequest.issue}`;
      if (!lawyer.caseHistory.includes(newCase)) {
        const updatedHistory = [...(lawyer.caseHistory || []), newCase];
        const updatedLawyer = { ...lawyer, caseHistory: updatedHistory };
        setLawyer(updatedLawyer);
        localStorage.setItem('lawvoice-lawyer-profile', JSON.stringify(updatedLawyer));
        
        try {
          await updateLawyerProfile({
            ...lawyer,
            caseHistory: updatedHistory
          });
        } catch (e) {
          console.error("Failed to sync solved case to backend:", e);
        }
      }
    }
  };

  const addManualCase = async () => {
    if (!newCaseText.trim()) return;
    const updatedHistory = [...(lawyer.caseHistory || []), newCaseText.trim()];
    const updatedLawyer = { ...lawyer, caseHistory: updatedHistory };
    setLawyer(updatedLawyer);
    setNewCaseText('');
    localStorage.setItem('lawvoice-lawyer-profile', JSON.stringify(updatedLawyer));
    
    try {
      await updateLawyerProfile({
        ...lawyer,
        caseHistory: updatedHistory
      });
      setSaved('வழக்கு வரலாறு வெற்றிகரமாக சேர்க்கப்பட்டது.');
    } catch (e) {
      console.error("Failed to save manual case in backend:", e);
    }
  };

  const deleteCase = async (indexToDelete) => {
    const updatedHistory = lawyer.caseHistory.filter((_, idx) => idx !== indexToDelete);
    const updatedLawyer = { ...lawyer, caseHistory: updatedHistory };
    setLawyer(updatedLawyer);
    localStorage.setItem('lawvoice-lawyer-profile', JSON.stringify(updatedLawyer));
    
    try {
      await updateLawyerProfile({
        ...lawyer,
        caseHistory: updatedHistory
      });
      setSaved('வழக்கு வரலாறு நீக்கப்பட்டது.');
    } catch (e) {
      console.error("Failed to sync case deletion to backend:", e);
    }
  };

  return (
    <div className="lawyerShell">
      <header className="lawyerTopbar">
        <Link className="brand compactBrand" to="/">
          <div className="brandMark">LV</div>
          <div>
            <strong>LawVoice வழக்கறிஞர்</strong>
            <span>சுயவிவரம் மற்றும் கோரிக்கை பணிப்பகம்</span>
          </div>
        </Link>
        <div className="topbarActions">
          <Link className="secondaryBtn" to="/">வெளியேறு</Link>
          <a className="quickCall" href={`tel:${lawyer.phone}`}><Phone size={17} /> அலுவலக அழைப்பு</a>
        </div>
      </header>

      <main className="lawyerMain">
        <section className="lawyerHero">
          <div>
            <span className="pill"><Scale size={16} /> வழக்கறிஞர் சுயவிவரம்</span>
            <div className="lawyerHeaderRow">
              <div className="lawyerAvatar" aria-hidden="true">{(lawyer.name || 'LV').slice(0, 2).toUpperCase()}</div>
              <div>
                <h1>{lawyer.name}</h1>
                <p className="lawyerHeadline">
                  <span><BadgeCheck size={16} /> {lawyer.barId}</span>
                  <span><MapPin size={16} /> {lawyer.city}, {lawyer.state}</span>
                  <span><Star size={16} /> 4.9</span>
                </p>
              </div>
            </div>
            <p>
              {lawyer.city}, {lawyer.state} இல் அடிப்படையாக {lawyer.category} வழக்கறிஞர். உங்கள் பொது சுயவிவரம், தனிப்பட்ட
              விவரங்கள், வழக்கு வரலாறு மற்றும் ஆலோசனை கோரிக்கைகளை ஒரே இடத்தில் வைத்திருக்கவும்.
            </p>
            <div className="lawyerBadges">
              <span><MapPin size={17} /> {lawyer.district}</span>
              <span><BriefcaseBusiness size={17} /> {lawyer.experience}</span>
              <span><ShieldCheck size={17} /> சரிபார்க்கப்பட்ட டெமோ பட்டியல்</span>
            </div>
          </div>
          <div className="lawyerScore">
            <strong>{filteredRequests.length}</strong>
            <span>பார்க்க கூடிய கோரிக்கைகள்</span>
            <p>மக்கள் பக்கத்தில் உள்ள வழக்கறிஞர் பிரிவிலிருந்து அனுப்பப்பட்ட கோரிக்கைகள் மதிப்பாய்வு, மீண்டும் அழைப்பு மற்றும் பின்தொடர்ச்சிக்கு இங்கே தோன்றும்.</p>
          </div>
        </section>

        <section className="lawyerStats">
          <div className="stat"><strong>{requests.length}</strong><span>மொத்த கோரிக்கைகள்</span></div>
          <div className="stat"><strong>{requests.filter((item) => item.urgency === 'High').length}</strong><span>அதிக முன்னுரிமை</span></div>
          <div className="stat"><strong>{lawyer.category}</strong><span>முக்கிய நடைமுறை</span></div>
          <div className="stat"><strong>{lawyer.city}</strong><span>சேவை நகரம்</span></div>
        </section>

        <section className="lawyerSection">
          <div className="lawyerPanel">
            <div className="sectionHead">
              <div>
                <span className="pill"><BriefcaseBusiness size={16} /> தனிப்பட்ட விவரங்கள்</span>
                <h2>சுயவிவரத் தகவல்</h2>
              </div>
              <button className="primaryBtn" onClick={saveLawyer}><Save size={17} /> சுயவிவரம் சேமிக்கவும்</button>
            </div>
            <div className="formGrid">
              <label>வழக்கறிஞர் பெயர்<input value={lawyer.name} onChange={(event) => updateLawyer('name', event.target.value)} /></label>
              <label>பார் பதிவு<input value={lawyer.barId} onChange={(event) => updateLawyer('barId', event.target.value)} /></label>
              <label>தொலைபேசி<input value={lawyer.phone} onChange={(event) => updateLawyer('phone', event.target.value)} /></label>
              <label>மின்னஞ்சல்<input value={lawyer.email} onChange={(event) => updateLawyer('email', event.target.value)} /></label>
              <label>நடைமுறை பகுதி<select value={lawyer.category} onChange={(event) => updateLawyer('category', event.target.value)}>{practiceAreas.map((area) => <option key={area}>{area}</option>)}</select></label>
              <label>அபிஜ்ஞதை<input value={lawyer.experience} onChange={(event) => updateLawyer('experience', event.target.value)} /></label>
              <label className="wideField">அலுவலக முகவரி<input value={lawyer.office} onChange={(event) => updateLawyer('office', event.target.value)} /></label>
              <label>நகரம்<input value={lawyer.city} onChange={(event) => updateLawyer('city', event.target.value)} /></label>
              <label>மாவட்டம்<input value={lawyer.district} onChange={(event) => updateLawyer('district', event.target.value)} /></label>
              <label>மாநிலம்<input value={lawyer.state} onChange={(event) => updateLawyer('state', event.target.value)} /></label>
              <label>மொழிகள்<input value={lawyer.languages} onChange={(event) => updateLawyer('languages', event.target.value)} /></label>
              <label>ஆலோசனை முறை<input value={lawyer.consultationMode} onChange={(event) => updateLawyer('consultationMode', event.target.value)} /></label>
              <label>கிடைக்கும் தன்மை<input value={lawyer.availability} onChange={(event) => updateLawyer('availability', event.target.value)} /></label>
              <label className="wideField">பொது வாழ்க்கைக்குறிப்பு<textarea value={lawyer.bio} onChange={(event) => updateLawyer('bio', event.target.value)} /></label>
            </div>
            {saved && <p className="notice">{saved}</p>}
          </div>

        </section>

        <section className="lawyerSection">
          <div className="lawyerPanel">
            <span className="pill"><FileCheck2 size={16} /> பொது வழக்கு வரலாறு</span>
            <h2>கல்வி மற்றும் வழக்கு வரலாறு</h2>
            <div className="formGrid">
              <label>கல்வி<input value={lawyer.education} onChange={(event) => updateLawyer('education', event.target.value)} /></label>
              <label>நீதிமன்ற நடைமுறை<input value={lawyer.courtPractice} onChange={(event) => updateLawyer('courtPractice', event.target.value)} /></label>
              <label className="wideField">ஆலோசனை கட்டணம்<input value={lawyer.consultationFee} onChange={(event) => updateLawyer('consultationFee', event.target.value)} /></label>
            </div>

            <div className="caseHistorySection" style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#2d3748' }}>வழக்கு வரலாறு</h3>
              <div className="caseHistoryList" style={{ marginBottom: '15px' }}>
                {(lawyer.caseHistory || []).map((caseItem, index) => (
                  <div key={index} className="caseHistoryItem" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#f5f7fb', borderRadius: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#333' }}>{caseItem}</span>
                    <button className="deleteBtn" onClick={() => deleteCase(index)} style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(!lawyer.caseHistory || lawyer.caseHistory.length === 0) && (
                  <p style={{ color: '#718096', fontStyle: 'italic', fontSize: '14px' }}>இன்னும் வழக்குகள் எதுவும் சேர்க்கப்படவில்லை.</p>
                )}
              </div>
              <div className="addCaseBox" style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  value={newCaseText} 
                  onChange={(e) => setNewCaseText(e.target.value)} 
                  placeholder="புதிய தீர்க்கப்பட்ட வழக்கு விவரங்களை உள்ளிடவும் (எ.கா: ரவி குமார் - நிலத் தகராறு)" 
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '14px' }} 
                />
                <button className="primaryBtn" onClick={addManualCase} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Plus size={16} /> சேர்க்க
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="lawyerSection">
          <div className="lawyerPanel">
            <span className="pill"><UsersRound size={16} /> பிற வழக்கறிஞர்கள்</span>
            <h2>பதிவுசெய்யப்பட்ட பிற வழக்கறிஞர்கள்</h2>
            <p className="sectionDesc" style={{ color: '#718096', fontSize: '14px', marginBottom: '15px' }}>
              கணினியில் பதிவுசெய்யப்பட்ட பிற வழக்கறிஞர்களின் பட்டியல் மற்றும் விவரங்கள்:
            </p>
            <div className="otherLawyersGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
              {otherLawyers.map((other) => (
                <div key={other.id || other.name} className="otherLawyerCard" style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: '#2d3748' }}>{other.name}</h3>
                  <div style={{ fontSize: '13px', color: '#4a5568', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span>வகை: <strong>{other.category}</strong></span>
                    <span>நகரம்: <strong>{other.city}</strong></span>
                    <span>அனுபவம்: <strong>{other.experience}</strong></span>
                    <span>பார் ID: <strong>{other.barId}</strong></span>
                  </div>
                </div>
              ))}
              {otherLawyers.length === 0 && (
                <p style={{ color: '#718096', fontStyle: 'italic', fontSize: '14px' }}>பிற வழக்கறிஞர்கள் யாரும் இன்னும் பதிவு செய்யப்படவில்லை.</p>
              )}
            </div>
          </div>
        </section>

        <section className="lawyerSection">
          <div className="sectionHead sectionTitle">
            <div>
              <span className="pill"><UsersRound size={16} /> கோரிக்கைகள்</span>
              <h2>மக்களின் கோரிக்கைகள் மற்றும் பின்தொடர்ச்சி</h2>
            </div>
          </div>
          <div className="requestWorkspace">
            <div className="lawyerPanel enquiryPanel">
              <div className="sectionHead">
                <div>
                  <span className="pill"><UsersRound size={16} /> மக்களின் கோரிக்கைகள்</span>
                  <h2>உள்வரும் ஆலோசனை கோரிக்கைகள்</h2>
                </div>
              </div>
              <div className="filterRow">
                <label className="searchField">
                  <Search size={18} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="பெயர், சிக்கல், நகரம், நிலை தேடவும்" />
                </label>
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                  <option>அனைத்தும்</option>
                  {practiceAreas.map((area) => <option key={area}>{area}</option>)}
                </select>
              </div>
              <div className="clientList">
                {filteredRequests.map((request) => (
                  <button
                    className={activeRequest?.id === request.id ? 'clientRow active' : 'clientRow'}
                    key={request.id}
                    onClick={() => setActiveRequest(request)}
                  >
                    <span>
                      <strong>{request.name}</strong>
                      <small>{request.category} | {request.city} | {request.status}</small>
                    </span>
                    <em>{request.urgency}</em>
                  </button>
                ))}
                {filteredRequests.length === 0 && (
                  <p style={{ color: '#718096', fontStyle: 'italic', fontSize: '14px', padding: '15px' }}>வழக்கு கோரிக்கைகள் எதுவும் இல்லை.</p>
                )}
              </div>
            </div>

            <div className="lawyerPanel">
              <span className="pill"><FileCheck2 size={16} /> கோரிக்கை விவரங்கள்</span>
              {activeRequest ? (
                <>
                  <h2>{activeRequest.name}</h2>
                  <div className="caseMeta">
                    <span>சிக்கல் <strong>{activeRequest.issue}</strong></span>
                    <span>வகை <strong>{activeRequest.category}</strong></span>
                    <span>தொலைபேசி <strong>{activeRequest.phone}</strong></span>
                  </div>
                  <p className="enquirySummary">பெறப்பட்டது {activeRequest.time}. தற்போதைய நிலை: {activeRequest.status}.</p>
                  <label>பதிலளிப்பு குறிப்பு<textarea value={reply} onChange={(event) => setReply(event.target.value)} placeholder="தொழில்முறை பதிலளிப்பு அல்லது ஆவண சரிபாரணை எழுதவும்." /></label>
                  <div className="toolbar" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                    <button className="primaryBtn" onClick={() => updateRequestStatus('Replied')}><MessageSquareText size={17} /> பதிலளிக்கப்பட்டது</button>
                    <button className="secondaryBtn" onClick={() => updateRequestStatus('Consultation scheduled')}><CalendarCheck size={17} /> அட்டவணை</button>
                    <button className="primaryBtn" style={{ backgroundColor: '#2b6cb0' }} onClick={() => updateRequestStatus('முடிந்தது')}><FileCheck2 size={17} /> முடிந்தது (Solved)</button>
                  </div>
                </>
              ) : (
                <p>கோரிக்கை தேர்ந்தெடுக்கப்படவில்லை.</p>
              )}
            </div>
          </div>
        </section>

        <section className="lawyerSection">
          <div className="lawyerPanel">
            <span className="pill"><CalendarCheck size={16} /> இன்று</span>
            <h2>ஆலோசனைகள்</h2>
            <div className="timeline">
              {schedule.map(([time, name, note]) => (
                <div key={`${time}-${name}`}>
                  <strong>{time}</strong>
                  <span>{name}</span>
                  <small>{note}</small>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LawyerProfile;
