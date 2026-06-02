import React, { useMemo, useState } from 'react';
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
  UsersRound
} from 'lucide-react';
import { practiceAreas, readStoredLawyerProfile, readStoredRequests } from './demoData';
import './styles.css';

const schedule = [
  ['10:00 AM', 'ரவி குமார்', 'FIR மறுப்பு ஆலோசனை'],
  ['12:30 PM', 'அனன்யா', 'பாதுகாப்பு உத்தரவு வழிகாட்டல்'],
  ['04:00 PM', 'ஆவண மதிப்பாய்வு', 'வாடகை முன்பணம் அறிவிப்பு']
];

const LawyerProfile = () => {
  const [lawyer, setLawyer] = useState(readStoredLawyerProfile);
  const [requests, setRequests] = useState(readStoredRequests);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeRequest, setActiveRequest] = useState(requests[0]);
  const [saved, setSaved] = useState('');
  const [reply, setReply] = useState('');

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

  const saveLawyer = () => {
    localStorage.setItem('lawvoice-lawyer-profile', JSON.stringify(lawyer));
    setSaved('சுயவிவரம் சேமிக்கப்பட்டது. மக்கள் இப்போது உங்கள் புதுப்பிக்கப்பட்ட பொது விவரங்கள் மற்றும் வழக்கு வரலாறைக் காணலாம்.');
  };

  const updateRequestStatus = (status) => {
    if (!activeRequest) return;
    const updated = requests.map((request) => request.id === activeRequest.id ? { ...request, status } : request);
    setRequests(updated);
    setActiveRequest({ ...activeRequest, status });
    localStorage.setItem('lawvoice-requests', JSON.stringify(updated.filter((request) => !request.id.startsWith('REQ-100'))));
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
            <h1>{lawyer.name}</h1>
            <p>
              {lawyer.city}, {lawyer.state} இல் அடிப்படையாக {lawyer.category} வழக்கறிஞர். உங்கள் பொது சுயவிவரம், தனிப்பட்ட
              விவரங்கள், வழக்கு வரலாறு மற்றும் ஆலோசனை கோரிக்கைகளை ஒரே இடத்தில் வைத்திருக்கவும்.
            </p>
            <div className="lawyerBadges">
              <span><BadgeCheck size={17} /> {lawyer.barId}</span>
              <span><MapPin size={17} /> {lawyer.district}</span>
              <span><Star size={17} /> 4.9 மதிப்பீடு</span>
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
            <h2>மக்களுக்குத் தெரியும்</h2>
            <div className="formGrid">
              <label>கல்வி<input value={lawyer.education} onChange={(event) => updateLawyer('education', event.target.value)} /></label>
              <label>நீதிமன்ற நடைமுறை<input value={lawyer.courtPractice} onChange={(event) => updateLawyer('courtPractice', event.target.value)} /></label>
              <label className="wideField">ஆலோசனை கட்டணம்<input value={lawyer.consultationFee} onChange={(event) => updateLawyer('consultationFee', event.target.value)} /></label>
              <label className="wideField">வழக்கு வரலாறு<textarea value={(lawyer.caseHistory || []).join('\n')} onChange={(event) => updateLawyer('caseHistory', event.target.value.split('\n').filter(Boolean))} /></label>
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
                <div className="toolbar">
                  <button className="primaryBtn" onClick={() => updateRequestStatus('Replied')}><MessageSquareText size={17} /> பதிலளிப்பு குறிப்பிட்ட</button>
                  <button className="secondaryBtn" onClick={() => updateRequestStatus('Consultation scheduled')}><CalendarCheck size={17} /> அட்டவணை</button>
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
