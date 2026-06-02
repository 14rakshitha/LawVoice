import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, LockKeyhole, LogIn, Scale, ShieldCheck, UserRound } from 'lucide-react';
import { credentials, defaultLawyerProfile, practiceAreas, readStoredLawyerProfile } from './demoData';
import './styles.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('people');
  const [email, setEmail] = useState(credentials.people.email);
  const [password, setPassword] = useState(credentials.people.password);
  const [error, setError] = useState('');
  const [lawyer, setLawyer] = useState(readStoredLawyerProfile);

  const switchRole = (nextRole) => {
    setRole(nextRole);
    setEmail(credentials[nextRole].email);
    setPassword(credentials[nextRole].password);
    setError('');
  };

  const updateLawyer = (field, value) => {
    setLawyer((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const expected = credentials[role];

    if (email.trim().toLowerCase() !== expected.email || password !== expected.password) {
      setError(`${expected.label} இற்கு ${expected.email} / ${expected.password} பயன்படுத்தவும்.`);
      return;
    }

    localStorage.setItem('lawvoice-session', JSON.stringify({ role, email: expected.email, loggedInAt: new Date().toISOString() }));

    if (role === 'lawyer') {
      const required = ['name', 'barId', 'phone', 'category', 'city', 'experience'];
      const missing = required.some((field) => !String(lawyer[field] || '').trim());
      if (missing) {
        setError('வழக்கறிஞர் சுயவிவரத்தில் நுழைவதற்கு முன் தேவையான வழக்கறிஞர் விவரங்களை பூர்த்தி செய்யவும்.');
        return;
      }
      localStorage.setItem('lawvoice-lawyer-profile', JSON.stringify({ ...defaultLawyerProfile, ...lawyer }));
      navigate('/lawyer-profile');
      return;
    }

    navigate('/user-profile');
  };

  return (
    <div className="login-page">
      <section className="loginHero authHero">
        <div className="loginCopy">
          <span className="pill"><Scale size={16} /> LawVoice</span>
          <h1>மக்களுக்கான சட்ட உதவி. வழக்கறிஞர்களுக்கான தெளிவான பணிப்பகம்.</h1>
          <p>
            வழக்கறிஞர்களைக் கண்டுபிடிக்கவும் மற்றும் ஆலோசனை கோரிக்கைகளை அனுப்பவும் ஒரு நபராக உள்நுழையவும். உங்கள் தொழில்முறை விவரங்களை, வழக்குச் சரிதை மற்றும் மக்களிடம் இருந்து கோரிக்கைகளைக் கண்ட வழக்கறிஞராக வெளியிடவும்.
          </p>
          <div className="loginSignals">
            <span><ShieldCheck size={17} /> சரிபார்க்கப்பட்ட டெமோ அணுகல்</span>
            <span><UserRound size={17} /> மக்கள் ஆதரவு மேசை</span>
            <span><BriefcaseBusiness size={17} /> வழக்கறிஞர் சுயவிவர பணிப்பகம்</span>
          </div>
          <div className="credentialBox">
            <strong>டெமோ உள்நுழைவு சான்றுபत்திரங்கள்</strong>
            <span>மக்கள்: {credentials.people.email} / {credentials.people.password}</span>
            <span>வழக்கறிஞர்: {credentials.lawyer.email} / {credentials.lawyer.password}</span>
          </div>
        </div>

        <form className="rolePanel authPanel" onSubmit={handleSubmit}>
          <div className="roleSwitch" aria-label="உள்நுழைவு பாத்திரத்தைத் தேர்ந்தெடுக்கவும்">
            <button type="button" className={role === 'people' ? 'active' : ''} onClick={() => switchRole('people')}>
              <UserRound size={18} /> மக்கள்
            </button>
            <button type="button" className={role === 'lawyer' ? 'active' : ''} onClick={() => switchRole('lawyer')}>
              <BriefcaseBusiness size={18} /> வழக்கறிஞர்
            </button>
          </div>

          <div>
            <span className="pill"><LockKeyhole size={16} /> {credentials[role].label}</span>
            <h2>{role === 'people' ? 'மக்கள் உள்நுழைவு' : 'வழக்கறிஞர் உள்நுழைவு'}</h2>
          </div>

          <label>மின்னஞ்சல்
            <input value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
          </label>
          <label>கடவுச்சொல்
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" />
          </label>

          {role === 'lawyer' && (
            <div className="lawyerOnboarding">
              <h3>மக்களுக்குக் காட்டப்படும் தனிப்பட்ட விவரங்கள்</h3>
              <div className="formGrid compactFields">
                <label>பெயர்<input value={lawyer.name} onChange={(event) => updateLawyer('name', event.target.value)} /></label>
                <label>பார் பதிவு<input value={lawyer.barId} onChange={(event) => updateLawyer('barId', event.target.value)} /></label>
                <label>தொலைபேசி<input value={lawyer.phone} onChange={(event) => updateLawyer('phone', event.target.value)} /></label>
                <label>நகரம்<input value={lawyer.city} onChange={(event) => updateLawyer('city', event.target.value)} /></label>
                <label>நடைமுறை பகுதி
                  <select value={lawyer.category} onChange={(event) => updateLawyer('category', event.target.value)}>
                    {practiceAreas.map((area) => <option key={area}>{area}</option>)}
                  </select>
                </label>
                <label>அভিজ்ঞতை<input value={lawyer.experience} onChange={(event) => updateLawyer('experience', event.target.value)} /></label>
                <label className="wideField">மக்களுக்கு பார்க்கக்கூடிய வழக்கு வரலாறு
                  <textarea
                    value={(lawyer.caseHistory || []).join('\n')}
                    onChange={(event) => updateLawyer('caseHistory', event.target.value.split('\n').filter(Boolean))}
                  />
                </label>
              </div>
            </div>
          )}

          {error && <p className="notice errorNotice">{error}</p>}
          <button className="primaryBtn" type="submit"><LogIn size={17} /> உள்நுழைக</button>
        </form>
      </section>
    </div>
  );
};

export default LoginPage;
