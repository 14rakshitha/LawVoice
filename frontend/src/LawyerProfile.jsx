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
import './styles.css';
import ConnectUsers from './ConnectUsers';

const categories = ['குற்றவியல் சட்டம்', 'குடும்ப சட்டம்', 'நுகர்வோர் சட்டம்', 'சொத்து சட்டம்', 'இணைய குற்றம்', 'தொழிலாளர் சட்டம்'];

const initialLawyer = {
  name: 'வழ. பிரியா ராமன்',
  barId: '2145/2016',
  phone: '+91 90000 10001',
  email: '',
  category: 'குற்றவியல் சட்டம்',
  experience: '9 ஆண்டுகள்',
  office: 'எண் 18, உயர்நீதிமன்ற சாலை',
  city: 'சென்னை',
  district: 'சென்னை',
  state: 'தமிழ்நாடு',
  languages: 'தமிழ், இந்தி',
  consultationMode: 'தொலைபேசி, அலுவலகம், காணொலி',
  availability: 'திங்கள் முதல் சனி வரை, காலை 10 மணி முதல் மாலை 6 மணி வரை',
  bio: 'முதல் தகவல் அறிக்கை மறுப்பு, கைது உரிமைகள், குடும்ப பாதுகாப்பு, நுகர்வோர் புகார்கள், காவல் நிலைய அவசர ஆதரவு ஆகியவற்றை கவனிக்கிறார்.'
};

const enquiries = [
  {
    id: '1007',
    name: 'ரவி குமார்',
    issue: 'காவல்துறை முதல் தகவல் அறிக்கை பதிவு செய்ய மறுத்தது',
    category: 'குற்றவியல் சட்டம்',
    city: 'சென்னை',
    district: 'சென்னை',
    urgency: 'அதிகம்',
    status: 'புதிய விசாரணை',
    time: 'இன்று, காலை 09:40',
    summary: 'மேல் அதிகாரியிடம் எழுத்துப் புகார் தயாரிக்கவும், அடுத்த கட்ட நடவடிக்கைகளை அறியவும் உதவி தேவை.',
    documents: ['நிகழ்வு காலவரிசை', 'காவல் நிலையப் பெயர்', 'சாட்சி விவரங்கள்']
  },
  {
    id: '1008',
    name: 'அனன்யா',
    issue: 'குடும்ப பாதுகாப்பு மற்றும் பாதுகாப்பு உத்தரவு',
    category: 'குடும்ப சட்டம்',
    city: 'மதுரை',
    district: 'மதுரை',
    urgency: 'அதிகம்',
    status: 'திரும்ப அழைக்க வேண்டும்',
    time: 'இன்று, காலை 10:15',
    summary: 'பாதுகாப்பான சட்ட நடவடிக்கைகள், அவசர தொடர்புகள், ஆதாரங்களை பாதுகாப்பது குறித்து வழிகாட்டல் கேட்டுள்ளார்.',
    documents: ['செய்திகள்', 'இருந்தால் மருத்துவ பதிவு', 'நம்பகமான தொடர்பு']
  },
  {
    id: '1009',
    name: 'சுரேஷ்',
    issue: 'வாடகை முன்பணம் திருப்பிக் கொடுக்கப்படவில்லை',
    category: 'சொத்து சட்டம்',
    city: 'கோயம்புத்தூர்',
    district: 'கோயம்புத்தூர்',
    urgency: 'நடுத்தரம்',
    status: 'ஆவண ஆய்வு',
    time: 'நேற்று, மாலை 05:20',
    summary: 'வீட்டு உரிமையாளர் முன்பணத்தை திருப்பிக் கொடுக்க மறுத்ததால் அறிவிப்பு வரைவு தேவை.',
    documents: ['வாடகை ஒப்பந்தம்', 'பணம் செலுத்திய ஆதாரம்', 'வீடு காலி செய்த புகைப்படங்கள்']
  },
  {
    id: '1010',
    name: 'பரீதா',
    issue: 'குறைபாடுள்ள பொருளுக்கான பணத்திருப்பு',
    category: 'நுகர்வோர் சட்டம்',
    city: 'திருச்சி',
    district: 'திருச்சிராப்பள்ளி',
    urgency: 'நடுத்தரம்',
    status: 'பதில் அளிக்கத் தயார்',
    time: 'நேற்று, மதியம் 02:10',
    summary: 'நுகர்வோர் புகார் படிகள் மற்றும் பணத்திருப்பு கோரிக்கை தயாரிப்புக்கு உதவி தேவை.',
    documents: ['விலைப்பட்டியல்', 'உத்தரவாத அட்டை', 'விற்பனையாளர் செய்திகள்']
  },
  {
    id: '1011',
    name: 'மோகன்',
    issue: 'நிறுவனத்தால் சம்பளம் தாமதம்',
    category: 'தொழிலாளர் சட்டம்',
    city: 'சேலம்',
    district: 'சேலம்',
    urgency: 'குறைவு',
    status: 'தொடக்க ஆலோசனை',
    time: 'மே 8, மாலை 04:50',
    summary: 'கிடைக்காத சம்பளம், எழுத்துப் புகார், வேலை ஆதாரம் குறித்து வழிகாட்டல் தேவை.',
    documents: ['வேலை நியமனக் கடிதம்', 'சம்பளச் சீட்டுகள்', 'வங்கி அறிக்கை']
  }
];

const schedule = [
  ['காலை 10:00', 'ரவி குமார்', 'முதல் தகவல் அறிக்கை மறுப்பு விசாரணை'],
  ['மதியம் 12:30', 'அனன்யா', 'பாதுகாப்பு திட்டமிடல்'],
  ['மாலை 04:00', 'சுரேஷ்', 'வாடகை அறிவிப்பு ஆய்வு']
];

const readSavedLawyer = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('lawvoice-lawyer-profile') || '{}');
    const hasEnglishText = Object.values(saved).some((value) => typeof value === 'string' && /[A-Za-z]{2,}/.test(value));
    return hasEnglishText ? initialLawyer : { ...initialLawyer, ...saved };
  } catch {
    localStorage.removeItem('lawvoice-lawyer-profile');
    return initialLawyer;
  }
};

const LawyerProfile = () => {
  const [lawyer, setLawyer] = useState(readSavedLawyer);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('அனைத்தும்');
  const [activeEnquiry, setActiveEnquiry] = useState(enquiries[0]);
  const [saved, setSaved] = useState('');

  const filteredEnquiries = useMemo(() => {
    const term = query.trim().toLowerCase();
    return enquiries.filter((enquiry) => {
      const matchesCategory = categoryFilter === 'அனைத்தும்' || enquiry.category === categoryFilter;
      const matchesSearch = !term || `${enquiry.name} ${enquiry.issue} ${enquiry.city} ${enquiry.status}`.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, query]);

  const handleLawyerChange = (field, value) => {
    setLawyer((current) => ({ ...current, [field]: value }));
    setSaved('');
  };

  const saveLawyer = () => {
    localStorage.setItem('lawvoice-lawyer-profile', JSON.stringify(lawyer));
    setSaved('வழக்கறிஞர் சேவை வழங்குநர் விவரங்கள் இங்கே சேமிக்கப்பட்டன.');
  };

  return (
    <div className="lawyerShell">
      <header className="lawyerTopbar">
        <Link className="brand compactBrand" to="/">
          <div className="brandMark">சகு</div>
          <div>
            <strong>சட்டக்குரல் ஆலோசனை</strong>
            <span>சேவை வழங்குநர் பணிமனை</span>
          </div>
        </Link>
        <div className="topbarActions">
          <Link className="secondaryBtn" to="/">சுயவிவரம் மாற்று</Link>
          <a className="quickCall" href={`tel:${lawyer.phone}`}><Phone size={17} /> அலுவலக அழைப்பு</a>
        </div>
      </header>

      <main className="lawyerMain">
        <section className="lawyerHero">
          <div>
            <span className="pill"><Scale size={16} /> வழக்கறிஞர் சேவை வழங்குநர்</span>
            <h1>{lawyer.name}</h1>
            <p>
              {lawyer.city}, {lawyer.state} பகுதியில் {lawyer.category} சேவை வழங்குநர்.
              சரிபார்க்கப்பட்ட வழக்கறிஞர் விவரங்கள், இடம், பயிற்சி வகை, கிடைக்கும் நேரம்,
              சட்ட சேவை தேடும் பயனர்களிடமிருந்து வரும் விசாரணைகள் ஆகியவற்றை பராமரிக்கவும்.
            </p>
            <div className="lawyerBadges">
              <span><BadgeCheck size={17} /> {lawyer.barId}</span>
              <span><MapPin size={17} /> {lawyer.district}</span>
              <span><Star size={17} /> 4.9 மதிப்பீடு</span>
              <span><ShieldCheck size={17} /> சரிபார்க்கப்பட்ட பட்டியல்</span>
            </div>
          </div>
          <div className="lawyerScore">
            <strong>{filteredEnquiries.length}</strong>
            <span>தெரியும் விசாரணைகள்</span>
            <p>பயனர்கள் சேவை பெறுபவர்கள். அவர்கள் அனுப்பும் விசாரணைகள் வழக்கறிஞர் ஆய்வு செய்ய, தொடர்பு கொள்ள, ஆலோசனையாக மாற்ற இங்கே தெரியும்.</p>
          </div>
        </section>

        <section className="lawyerStats">
          <div className="stat"><strong>{enquiries.length}</strong><span>மொத்த விசாரணைகள்</span></div>
          <div className="stat"><strong>{enquiries.filter((item) => item.urgency === 'அதிகம்').length}</strong><span>உயர் முன்னுரிமை</span></div>
          <div className="stat"><strong>{lawyer.category}</strong><span>முதன்மை வகை</span></div>
          <div className="stat"><strong>{lawyer.city}</strong><span>சேவை இடம்</span></div>
        </section>

        <section className="lawyerGrid providerGrid">
          <div className="lawyerPanel providerFormPanel">
            <div className="sectionHead">
              <div>
                <span className="pill"><BriefcaseBusiness size={16} /> வழங்குநர் விவரங்கள்</span>
                <h2>வழக்கறிஞர் பட்டியல் விவரங்கள்</h2>
              </div>
              <button className="primaryBtn" onClick={saveLawyer}><Save size={17} /> விவரங்கள் சேமி</button>
            </div>
            <div className="formGrid">
              <label>வழக்கறிஞர் பெயர்<input value={lawyer.name} onChange={(event) => handleLawyerChange('name', event.target.value)} /></label>
              <label>பதிவு எண்<input value={lawyer.barId} onChange={(event) => handleLawyerChange('barId', event.target.value)} /></label>
              <label>தொலைபேசி<input value={lawyer.phone} onChange={(event) => handleLawyerChange('phone', event.target.value)} /></label>
              <label>மின்னஞ்சல்<input value={lawyer.email} onChange={(event) => handleLawyerChange('email', event.target.value)} /></label>
              <label>பயிற்சி வகை<select value={lawyer.category} onChange={(event) => handleLawyerChange('category', event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
              <label>அனுபவம்<input value={lawyer.experience} onChange={(event) => handleLawyerChange('experience', event.target.value)} /></label>
              <label className="wideField">அலுவலக முகவரி<input value={lawyer.office} onChange={(event) => handleLawyerChange('office', event.target.value)} /></label>
              <label>நகரம்<input value={lawyer.city} onChange={(event) => handleLawyerChange('city', event.target.value)} /></label>
              <label>மாவட்டம்<input value={lawyer.district} onChange={(event) => handleLawyerChange('district', event.target.value)} /></label>
              <label>மாநிலம்<input value={lawyer.state} onChange={(event) => handleLawyerChange('state', event.target.value)} /></label>
              <label>மொழிகள்<input value={lawyer.languages} onChange={(event) => handleLawyerChange('languages', event.target.value)} /></label>
              <label>ஆலோசனை முறை<input value={lawyer.consultationMode} onChange={(event) => handleLawyerChange('consultationMode', event.target.value)} /></label>
              <label>கிடைக்கும் நேரம்<input value={lawyer.availability} onChange={(event) => handleLawyerChange('availability', event.target.value)} /></label>
              <label className="wideField">சுயவிவர சுருக்கம்<textarea value={lawyer.bio} onChange={(event) => handleLawyerChange('bio', event.target.value)} /></label>
            </div>
            {saved && <p className="notice">{saved}</p>}
          </div>

          <div className="lawyerPanel enquiryPanel">
            <div className="sectionHead">
              <div>
                <span className="pill"><UsersRound size={16} /> பயனர் விசாரணைகள்</span>
                <h2>சேவை பெறுபவர் கோரிக்கைகள்</h2>
              </div>
            </div>
            <div className="filterRow">
              <label className="searchField">
                <Search size={18} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="பயனர், பிரச்சினை, நகரம், நிலை தேடு" />
              </label>
              <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                <option>அனைத்தும்</option>
                {categories.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>
            <div className="clientList">
              {filteredEnquiries.map((enquiry) => (
                <button
                  className={activeEnquiry.id === enquiry.id ? 'clientRow active' : 'clientRow'}
                  key={enquiry.id}
                  onClick={() => setActiveEnquiry(enquiry)}
                >
                  <span>
                    <strong>{enquiry.name}</strong>
                    <small>{enquiry.category} | {enquiry.city} | {enquiry.status}</small>
                  </span>
                  <em>{enquiry.urgency}</em>
                </button>
              ))}
            </div>
          </div>

          <div className="lawyerPanel">
            <span className="pill"><FileCheck2 size={16} /> விசாரணை சுருக்கம்</span>
            <h2>{activeEnquiry.name}</h2>
            <div className="caseMeta">
              <span>பிரச்சினை <strong>{activeEnquiry.issue}</strong></span>
              <span>வகை <strong>{activeEnquiry.category}</strong></span>
              <span>இடம் <strong>{activeEnquiry.city}</strong></span>
            </div>
            <p className="enquirySummary">{activeEnquiry.summary}</p>
            <div className="miniList">
              <h4>தேவையான ஆவணங்கள்</h4>
              {activeEnquiry.documents.map((document) => <div key={document}><FileCheck2 size={15} /><span>{document}</span></div>)}
            </div>
            <div className="toolbar">
              <button className="primaryBtn"><MessageSquareText size={17} /> பயனருக்கு பதில் அளி</button>
              <button className="secondaryBtn"><CalendarCheck size={17} /> ஆலோசனை பதிவு செய்</button>
            </div>
          </div>

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

        <ConnectUsers clients={enquiries} activeClient={activeEnquiry} />
      </main>
    </div>
  );
};

export default LawyerProfile;
