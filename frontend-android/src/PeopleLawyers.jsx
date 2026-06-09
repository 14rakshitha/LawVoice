import React, { useEffect, useState } from 'react';
import { MapPin, Phone, Search, Send, Star } from 'lucide-react';
import { API } from './api';
import { demoLawyers, readStoredLawyerProfile } from './demoData';
import './styles.css';

const PeopleLawyers = () => {
  const [locationMessage, setLocationMessage] = useState('');
  const [expanded, setExpanded] = useState('saved-lawyer');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestForm, setRequestForm] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem('lawvoice-session')) || {};
      return {
        name: session.name || 'டெமோ பயனர்',
        phone: session.phone || '+91 98765 43210',
        issue: ''
      };
    } catch {
      return { name: 'டெமோ பயனர்', phone: '+91 98765 43210', issue: '' };
    }
  });
  const [backendLawyers, setBackendLawyers] = useState([]);
  const [backendError, setBackendError] = useState('');
  const savedLawyer = readStoredLawyerProfile();
 
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`${API}/lawyers`);
        if (!res.ok) throw new Error('failed');
        const data = await res.json();
        if (!cancelled) {
          setBackendLawyers(Array.isArray(data) ? data : []);
          setBackendError('');
        }
      } catch {
        if (!cancelled) setBackendError('Backend வழக்கறிஞர் பட்டியல் இப்போது கிடைக்கவில்லை. டெமோ பட்டியல் காட்டப்படுகிறது.');
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);
 
  const lawyers = [
    {
      id: 'saved-lawyer',
      name: savedLawyer.name,
      category: savedLawyer.category,
      city: savedLawyer.city,
      phone: savedLawyer.phone,
      rating: '4.9',
      experience: savedLawyer.experience,
      barId: savedLawyer.barId,
      availability: savedLawyer.availability,
      short: savedLawyer.bio,
      bio: savedLawyer.bio,
      pastCases: savedLawyer.caseHistory || []
    },
    ...(backendLawyers.length
      ? backendLawyers.map((lawyer) => ({
        id: lawyer.id,
        name: lawyer.name,
        category: lawyer.category,
        city: lawyer.city,
        phone: lawyer.phone,
        rating: `${lawyer.rating ?? '4.8'}`,
        experience: lawyer.experience || 'சேவை அனுபவம்',
        barId: lawyer.barId || 'சரிபார்க்கப்பட்டது',
        availability: 'அழைப்பிற்கு கிடைக்கும்',
        short: lawyer.bio ? (lawyer.bio.length > 50 ? lawyer.bio.substring(0, 50) + '...' : lawyer.bio) : 'இந்த வகை வழக்குகளுக்கு நடைமுறை வழிகாட்டல்.',
        bio: lawyer.bio || 'உங்கள் வழக்கின் ஆவணங்கள் மற்றும் உண்மை விவரங்களை வைத்து, சரியான அடுத்த படிகளை திட்டமிட்டு வழிகாட்ட முடியும்.',
        pastCases: []
      }))
      : demoLawyers.filter((lawyer) => lawyer.name !== savedLawyer.name))
  ].filter((lawyer, index, all) => all.findIndex((item) => item.id === lawyer.id || item.name === lawyer.name) === index);

  const searchLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage('இந்த ப்ரவுசரில் இடம் தேடல் கிடைக்கவில்லை.');
      return;
    }
    setLocationMessage('உங்கள் இருப்பிடத்தை சரிபார்க்கிறது...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        window.open(`https://www.google.com/maps/search/lawyers/@${latitude},${longitude},13z`, '_blank', 'noopener,noreferrer');
        setLocationMessage('நகர வழக்கறிஞர் தேடல் வரைபடங்களில் திறக்கப்பட்டது।');
      },
      () => setLocationMessage('இருப்பிட அனுமதி மறுக்கப்பட்டது. நீங்கள் இன்னும் பட்டியலிடப்பட்ட வழக்கறிஞர்களைப் பயன்படுத்தலாம்.')
    );
  };

  const sendRequest = (lawyer) => {
    if (!requestForm.name.trim() || !requestForm.phone.trim() || !requestForm.issue.trim()) {
      setRequestMessage('உங்கள் பெயர், தொலைபேசி எண் மற்றும் வழக்கு சரிக்குறிப்பை உள்ளிடவும்.');
      return;
    }

    const request = {
      id: `REQ-${Date.now().toString().slice(-5)}`,
      lawyerId: lawyer.id,
      name: requestForm.name.trim(),
      phone: requestForm.phone.trim(),
      issue: requestForm.issue.trim(),
      category: lawyer.category,
      city: lawyer.city,
      urgency: 'New',
      status: 'New request',
      time: new Date().toLocaleString()
    };
    const previous = JSON.parse(localStorage.getItem('lawvoice-requests') || '[]');
    localStorage.setItem('lawvoice-requests', JSON.stringify([request, ...previous]));
    setRequestMessage(`${lawyer.name} க்கு கோரிக்கை அனுப்பப்பட்டது. இது வழக்கறிஞர் சுயவிவரத்தில் தோன்றும்.`);
    setRequestForm((current) => ({ ...current, issue: '' }));
  };

  return (
    <section className="screen">
      <div className="sectionHead">
        <div>
          <span className="pill"><MapPin size={16} /> சட்ட உதவி</span>
          <h2>சரிபார்க்கப்பட்ட வழக்கறிஞர்கள்</h2>
        </div>
        <button className="secondaryBtn" onClick={searchLocation}><Search size={17} /> கண்டுபிடிக்க அருகில்</button>
      </div>

      {locationMessage && <p className="notice">{locationMessage}</p>}
      {backendError && <p className="notice">{backendError}</p>}
      {requestMessage && <p className="notice">{requestMessage}</p>}

      <div className="lawyerDirectory">
        {lawyers.map((lawyer) => {
          const isOpen = expanded === lawyer.id;
          return (
            <article className={isOpen ? 'lawyerCard expanded' : 'lawyerCard'} key={lawyer.id}>
              <div className="lawyerCardTop">
                <div>
                  <h3>{lawyer.name}</h3>
                  <p>{lawyer.short}</p>
                  <div className="lawyerMiniMeta">
                    <span>{lawyer.category}</span>
                    <span>{lawyer.city}</span>
                    <span>{lawyer.experience}</span>
                    <span><Star size={15} /> {lawyer.rating}</span>
                  </div>
                </div>
                <button className="secondaryBtn" onClick={() => setExpanded(isOpen ? '' : lawyer.id)}>
                  {isOpen ? 'விவரங்களை மறை' : 'விவரங்களை காட்டவும்'}
                </button>
              </div>

              {isOpen && (
                <div className="lawyerFullDetails">
                  <div className="caseMeta">
                    <span>பார் ID <strong>{lawyer.barId}</strong></span>
                    <span>கிடைக்கும் <strong>{lawyer.availability}</strong></span>
                    <span>தொலைபேசி <strong>{lawyer.phone}</strong></span>
                  </div>
                  <p>{lawyer.bio}</p>
                  <div className="miniList">
                    <h4>கடந்த வழக்குகள் மற்றும் அபிஜ்ஞதை</h4>
                    {(lawyer.pastCases.length ? lawyer.pastCases : ['வழக்கறிஞர் சுயவிவரத்தை புதுப்பித்த பிறகு வழக்கு வரலாறு தோன்றும்.']).map((item) => (
                      <div key={item}><span>{item}</span></div>
                    ))}
                  </div>
                  <div className="requestBox">
                    <h4>இந்த வழக்கறிஞரை கேட்டுக்கொள்ளவும்</h4>
                    <div className="formGrid compactFields">
                      <label>உங்கள் பெயர்<input value={requestForm.name} onChange={(event) => setRequestForm((current) => ({ ...current, name: event.target.value }))} /></label>
                      <label>தொலைபேசி<input value={requestForm.phone} onChange={(event) => setRequestForm((current) => ({ ...current, phone: event.target.value }))} /></label>
                      <label className="wideField">வழக்கு சரிக்குறிப்பு<textarea value={requestForm.issue} onChange={(event) => setRequestForm((current) => ({ ...current, issue: event.target.value }))} placeholder="உங்கள் பிரச்சினையை சுருக்கமாக விளக்கவும் மற்றும் என்ன உதவி தேவை என்பதை விளக்கவும்." /></label>
                    </div>
                    <div className="toolbar">
                      <button className="primaryBtn" onClick={() => sendRequest(lawyer)}><Send size={16} /> கோரிக்கை அனுப்பு</button>
                      <a className="secondaryBtn" href={`tel:${lawyer.phone}`}><Phone size={16} /> அழை</a>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default PeopleLawyers;
