import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  LockKeyhole,
  LogIn,
  Mic,
  Phone,
  Scale,
  ShieldCheck,
  UserPlus,
  UserRound
} from 'lucide-react';
import { authLogin, authRegister, saveSession } from './api';
import { defaultLawyerProfile, practiceAreas } from './demoData';
import './styles.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('people');
  const [mode, setMode] = useState('register');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    identifier: '',
    district: '',
    barId: '',
    category: practiceAreas[0],
    city: '',
    experience: ''
  });

  // Detect if the login identifier is a phone number (digits only) or a name
  const isPhoneIdentifier = (val) => /^[0-9]+$/.test(val.trim());

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const switchRole = (nextRole) => {
    setRole(nextRole);
    setError('');
  };

  const completeLogin = (authResponse) => {
    saveSession(authResponse);
    if (authResponse.user.role === 'lawyer') {
      const profile = authResponse.user.lawyerProfile || {};
      localStorage.setItem('lawvoice-lawyer-profile', JSON.stringify({
        name: authResponse.user.name,
        email: authResponse.user.email,
        phone: authResponse.user.phone,
        district: authResponse.user.district,
        city: profile.city || '',
        barId: profile.barId || '',
        category: profile.category || '',
        experience: profile.experience || '',
        office: profile.office || '',
        state: profile.state || 'தமிழ் நாடு',
        languages: profile.languages || '',
        consultationMode: profile.consultationMode || '',
        availability: profile.availability || '',
        bio: profile.bio || '',
        education: profile.education || '',
        courtPractice: profile.courtPractice || '',
        consultationFee: profile.consultationFee || '',
        caseHistory: profile.caseHistory || []
      }));
      navigate('/lawyer-profile');
      return;
    }
    navigate('/user-profile');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (mode === 'register') {
        const pwd = form.password;
        if (pwd.length < 8) {
          throw new Error('கடவுச்சொல் குறைந்தது 8 எழுத்துக்களைக் கொண்டிருக்க வேண்டும்.');
        }
        if (!/[a-zA-Z]/.test(pwd)) {
          throw new Error('கடவுச்சொல் குறைந்தது ஒரு ஆங்கில எழுத்தைக் கொண்டிருக்க வேண்டும்.');
        }
        if (!/[0-9]/.test(pwd)) {
          throw new Error('கடவுச்சொல் குறைந்தது ஒரு எண்ணைக் கொண்டிருக்க வேண்டும்.');
        }
        if (!/[!@#$%^&*(),.?\":{}|<>]/.test(pwd)) {
          throw new Error('கடவுச்சொல் குறைந்தது ஒரு சிறப்பு குறியீட்டைக் கொண்டிருக்க வேண்டும் (எ.கா: @, #, $, %).');
        }

        const payload = {
          role,
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim(),
          district: form.district.trim()
        };
        if (role === 'lawyer') {
          payload.lawyerProfile = {
            barId: form.barId.trim(),
            category: form.category,
            city: form.city.trim(),
            experience: form.experience.trim()
          };
        }
        const response = await authRegister(payload);
        completeLogin(response);
        return;
      }

      const id = form.identifier.trim();
      const loginPayload = { role, password: form.password };
      if (isPhoneIdentifier(id)) {
        loginPayload.phone = id;
      } else {
        loginPayload.name = id;
      }
      const response = await authLogin(loginPayload);
      completeLogin(response);
    } catch (err) {
      setError(err.message || 'சேவை இணைப்பு தோல்வி. Backend ஓடுகிறதா என்பதை சரிபார்க்கவும்.');
    } finally {
      setBusy(false);
    }
  };

  const roleLabel = role === 'people' ? 'மக்கள்' : 'வழக்கறிஞர்';
  const isRegister = mode === 'register';

  return (
    <div className="login-page">
      <section className="loginHero authHero">
        <div className="loginCopy">
          <span className="pill"><Scale size={16} /> சட்டக்குரல்</span>
          <h1>இந்திய அரசியலமைப்பு அடிப்படையில் தமிழ் சட்ட உதவி.</h1>
          <p>
            முதலில் உங்கள் வகையைத் தேர்ந்தெடுத்து, பிறகு பழைய பயனர் உள்நுழைவு அல்லது புதிய பயனர் பதிவு செய்யுங்கள்.
            மக்களுக்கு குரல் சட்ட உதவி, அரசியலமைப்பு ஆதாரம், வழக்கறிஞர் பரிந்துரை; வழக்கறிஞர்களுக்கு சுயவிவரம், கோரிக்கைகள், பயனர் தொடர்பு.
          </p>
          <div className="loginSignals">
            <span><Mic size={17} /> குரல் வழிகாட்டல்</span>
            <span><ShieldCheck size={17} /> அரசியலமைப்பு ஆதாரம்</span>
            <span><BriefcaseBusiness size={17} /> வழக்கறிஞர் பணிமுறை</span>
          </div>
        </div>

        <form className="rolePanel authPanel" onSubmit={handleSubmit} autoComplete="off">
          <div className="roleSwitch" aria-label="பயனர் வகை">
            <button type="button" className={role === 'people' ? 'active' : ''} onClick={() => switchRole('people')}>
              <UserRound size={18} /> மக்கள்
            </button>
            <button type="button" className={role === 'lawyer' ? 'active' : ''} onClick={() => switchRole('lawyer')}>
              <BriefcaseBusiness size={18} /> வழக்கறிஞர்
            </button>
          </div>

          <div className="roleSwitch authModeSwitch" aria-label="உள்நுழைவு அல்லது பதிவு">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setError(''); }}>
              <LogIn size={18} /> பழைய பயனர்
            </button>
            <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setError(''); }}>
              <UserPlus size={18} /> புதிய பயனர்
            </button>
          </div>

          <div>
            <span className="pill"><LockKeyhole size={16} /> {roleLabel}</span>
            <h2>{isRegister ? `${roleLabel} பதிவு` : `${roleLabel} உள்நுழைவு`}</h2>
            <p className="authHint">
              {isRegister
                ? 'புதிய கணக்கை உருவாக்கி உடனே தொடங்குங்கள்.'
                : 'உங்கள் பெயர் அல்லது கைபேசி எண் மற்றும் கடவுச்சொல்லை உள்ளிடுங்கள்.'}
            </p>
          </div>

          {isRegister && (
            <>
              <label>பெயர்
                <input value={form.name} onChange={(e) => update('name', e.target.value)} required autoComplete="name" />
              </label>
              <label>கைபேசி எண்
                <input
                  type="tel"
                  placeholder="10 இலக்க கைபேசி எண்"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  required
                  pattern="[0-9]{10}"
                  title="10 இலக்க கைபேசி எண் உள்ளிடவும்"
                  autoComplete="tel"
                />
              </label>
            </>
          )}

          {!isRegister && (
            <label>பெயர் அல்லது கைபேசி எண்
              <input
                type="text"
                placeholder="உங்கள் பெயர் அல்லது 10 இலக்க கைபேசி எண்"
                value={form.identifier}
                onChange={(e) => update('identifier', e.target.value)}
                required
                autoComplete="username"
              />
            </label>
          )}
          <label>கடவுச்சொல்
            <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required minLength={8} autoComplete={isRegister ? 'new-password' : 'current-password'} />
            {isRegister && (
              <span style={{ fontSize: '12px', marginTop: '4px', color: 'var(--muted)', fontWeight: 'normal' }}>
                * கடவுச்சொல் குறைந்தது 8 எழுத்துக்கள், 1 ஆங்கில எழுத்து, 1 எண் மற்றும் 1 சிறப்பு குறியீடு (@, #, $, % போன்றவை) கொண்டிருக்க வேண்டும்.
              </span>
            )}
          </label>

          {isRegister && (
            <>
              <label>மாவட்டம்
                <input value={form.district} onChange={(e) => update('district', e.target.value)} required />
              </label>
            </>
          )}

          {isRegister && role === 'lawyer' && (
            <div className="lawyerOnboarding">
              <h3>வழக்கறிஞர் தொழில்முறை விவரங்கள்</h3>
              <div className="formGrid compactFields">
                <label>பார் பதிவு<input value={form.barId} onChange={(e) => update('barId', e.target.value)} required /></label>
                <label>நகரம்<input value={form.city} onChange={(e) => update('city', e.target.value)} required /></label>
                <label>நடைமுறை பகுதி
                  <select value={form.category} onChange={(e) => update('category', e.target.value)}>
                    {practiceAreas.map((area) => <option key={area}>{area}</option>)}
                  </select>
                </label>
                <label>அனுபவம்<input value={form.experience} onChange={(e) => update('experience', e.target.value)} required /></label>
              </div>
            </div>
          )}

          {error && <p className="notice errorNotice">{error}</p>}

          <button className="primaryBtn" type="submit" disabled={busy}>
            {busy ? 'செயலாக்குகிறது...' : (
              <>
                {isRegister ? 'பதிவு செய்து தொடங்கு' : 'உள்நுழைக'}
                <ArrowRight size={17} />
              </>
            )}
          </button>


        </form>
      </section>
    </div>
  );
};

export default LoginPage;
