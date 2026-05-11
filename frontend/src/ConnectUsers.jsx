import React, { useMemo, useState } from 'react';
import { MessageCircle, Phone, Send, UserPlus } from 'lucide-react';
import './styles.css';

const defaultClients = [
  { name: 'ரவி குமார்', issue: 'முதல் தகவல் அறிக்கை மறுப்பு', city: 'சென்னை', urgency: 'அதிகம்', category: 'குற்றவியல் சட்டம்' },
  { name: 'அனன்யா', issue: 'குடும்ப பாதுகாப்பு', city: 'மதுரை', urgency: 'அதிகம்', category: 'குடும்ப சட்டம்' },
  { name: 'சுரேஷ்', issue: 'வாடகை முன்பணம்', city: 'கோயம்புத்தூர்', urgency: 'நடுத்தரம்', category: 'சொத்து சட்டம்' }
];

const ConnectUsers = ({ clients = defaultClients, activeClient }) => {
  const selected = activeClient || clients[0] || defaultClients[0];
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: selected.name, text: `${selected.issue} குறித்து உதவி தேவை. எந்த ஆவணங்களை தயார் வைத்திருக்க வேண்டும்?` },
    { sender: 'நீங்கள்', text: 'அடையாளச் சான்று, நிகழ்வு காலவரிசை, படங்கள் அல்லது ஆவணங்கள், காவல் நிலையம் அல்லது அலுவலக குறிப்பு எண்கள் ஆகியவற்றை தயார் வைத்திருக்கவும்.' }
  ]);

  const network = useMemo(() => clients.slice(0, 5), [clients]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { sender: 'நீங்கள்', text: message.trim() }]);
      setMessage('');
    }
  };

  return (
    <section className="connect-users">
      <div className="sectionHead">
        <div>
          <span className="pill"><MessageCircle size={16} /> சேவை பெறுபவர் தொடர்பு</span>
          <h2>பயனர் விசாரணை தொடர்பு மையம்</h2>
        </div>
        <button className="secondaryBtn"><UserPlus size={17} /> நேரடி வருகை சேர்</button>
      </div>

      <div className="connectionGrid">
        <div className="networkList">
          {network.map((client) => (
            <button className={client.name === selected.name ? 'networkUser active' : 'networkUser'} key={client.name}>
              <span>
                <strong>{client.name}</strong>
                <small>{client.category || 'சட்ட உதவி'} | {client.city}</small>
              </span>
              <em>{client.urgency}</em>
            </button>
          ))}
        </div>

        <div className="chatPanel">
          <div className="chatHeader">
            <div>
              <strong>{selected.name}</strong>
              <span>{selected.issue} | {selected.category || 'சட்ட உதவி'} | {selected.city}</span>
            </div>
            <a className="iconBtn" href="tel:+919000010001" aria-label="பயனரை அழை"><Phone size={18} /></a>
          </div>
          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={`${msg.sender}-${index}`} className={`chat-message ${msg.sender === 'நீங்கள்' ? 'user-message' : 'lawyer-message'}`}>
                <strong>{msg.sender}</strong>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div className="message-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleSendMessage()}
              placeholder="தொழில்முறை பதில் அல்லது ஆவண வழிகாட்டலை எழுதவும்"
            />
            <button className="primaryBtn" onClick={handleSendMessage}><Send size={17} /> அனுப்பு</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConnectUsers;
