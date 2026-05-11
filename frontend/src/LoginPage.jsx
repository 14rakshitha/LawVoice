import React from 'react';
import './styles.css';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, ChevronRight, Mic, Scale, ShieldCheck, UserRound } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLawyerLogin = () => {
    navigate('/lawyer-profile');
  };

  const handleUserLogin = () => {
    navigate('/user-profile');
  };

  return (
    <div className="login-page">
      <section className="loginHero">
        <div className="loginCopy">
          <span className="pill"><Scale size={16} /> சட்டக்குரல்</span>
          <h1>சரியான சுயவிவரத்தில் தொடங்கும் சட்ட உதவி.</h1>
          <p>
            குரல் வழி சட்ட வழிகாட்டல், முதல் தகவல் அறிக்கை உதவி, வரலாறு, அவசர ஆதரவு,
            அருகிலுள்ள வழக்கறிஞர்கள் ஆகியவற்றுக்குப் பயனர் முறையைத் தேர்ந்தெடுக்கவும்.
            வாடிக்கையாளர் விசாரணைகள், ஆலோசனை தயாரிப்பு, தொடர்பு மேலாண்மை ஆகியவற்றுக்குப்
            வழக்கறிஞர் முறையைத் தேர்ந்தெடுக்கவும்.
          </p>
          <div className="loginSignals">
            <span><Mic size={17} /> குரல் வழிகாட்டல்</span>
            <span><ShieldCheck size={17} /> சரிபார்க்கப்பட்ட ஆதரவு</span>
            <span><BriefcaseBusiness size={17} /> வழக்கறிஞர் பணிமுறை</span>
          </div>
        </div>

        <div className="rolePanel">
          <button className="roleCard lawyer" onClick={handleLawyerLogin}>
            <span className="roleIcon"><BriefcaseBusiness size={28} /></span>
            <span>
              <strong>வழக்கறிஞர் சுயவிவரம்</strong>
              <small>விசாரணைகள், பயனர்கள், ஆலோசனைகள், வழக்கு முன்னுரிமைகள், சட்ட வளங்கள் ஆகியவற்றை நிர்வகிக்கவும்.</small>
            </span>
            <ChevronRight size={22} />
          </button>
          <button className="roleCard user" onClick={handleUserLogin}>
            <span className="roleIcon"><UserRound size={28} /></span>
            <span>
              <strong>பயனர் சுயவிவரம்</strong>
              <small>ஏற்கனவே உள்ள எந்த அம்சத்தையும் இழக்காமல் முழு குடிமக்கள் சட்ட உதவியாளரைத் திறக்கவும்.</small>
            </span>
            <ChevronRight size={22} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
