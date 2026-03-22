import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Linkedin, Send, Download } from 'lucide-react';
import { cvData } from './data';
import heroPhoto from './assets/hero-photo.jpg';
import './index.css';

// Custom Hook for Typing Effect
const useTypewriter = (words) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout2 = setInterval(() => setBlink((prev) => !prev), 500);
    return () => clearInterval(timeout2);
  }, []);

  useEffect(() => {
    if (index === words.length) { setIndex(0); return; }
    
    if (subIndex === words[index].length + 1 && !isDeleting) {
      setTimeout(() => setIsDeleting(true), 2000); // Wait at end of word
      return;
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, Math.max(isDeleting ? 30 : 70, parseInt(Math.random() * 50)));

    return () => clearTimeout(timeout);
  }, [subIndex, index, isDeleting, words]);

  return { text: words[index]?.substring(0, subIndex) || '', blink };
};

// Circular Progress Component
const CircularProgress = ({ percent, title }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="circle-progress">
      <div style={{ position: 'relative', width: '55px', height: '55px', margin: '0 auto' }}>
        <svg viewBox="0 0 55 55">
          <circle className="circle-bg" cx="27.5" cy="27.5" r={radius} />
          <motion.circle 
            className="circle-fill" 
            cx="27.5" cy="27.5" r={radius} 
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--text-light)' }}>
          {percent}%
        </div>
      </div>
      <div className="circle-progress-text">{title}</div>
    </div>
  );
};

// Linear Progress Component
const LinearProgress = ({ percent, title }) => {
  return (
    <div className="skill-item">
      <div className="skill-item-header">
        <span>{title}</span>
        <span>{percent}%</span>
      </div>
      <div className="progress-bar-bg">
        <motion.div 
          className="progress-bar-fill" 
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

function App() {
  const { text: typingText, blink } = useTypewriter(cvData.roles);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="arter-layout">
      
      {/* SIDEBAR */}
      <div className="arter-sidebar">
        <div className="sidebar-header">
          <img src="/IMG_6318.JPG" alt={cvData.name} className="profile-img" />
          <h2 className="name">{cvData.name}</h2>
          <div className="typing-text">
            <span className="code">&lt;</span>
            <span className="text">{typingText}</span>
            <span className="cursor" style={{ opacity: blink ? 1 : 0 }}>|</span>
            <span className="code">/&gt;</span>
          </div>
        </div>
        
        <div className="sidebar-scrollable">
          <div className="info-list">
            <div className="info-item">
              <span className="label">Residence:</span>
              <span className="value">{cvData.residence}</span>
            </div>
            {/* Omitted Age and Freelance intentionally */}
          </div>
          
          <div className="divider" />
          
          <div className="languages">
            {cvData.languages.map((lang, idx) => (
              <CircularProgress key={idx} percent={lang.percent} title={lang.title} />
            ))}
          </div>

          <div className="divider" />
          
          <div className="hard-skills">
            {cvData.hardSkills.map((skill, idx) => (
              <LinearProgress key={idx} percent={skill.percent} title={skill.title} />
            ))}
          </div>
          
          <div className="divider" />
          
          {/* Download button optional in Arter style */}
          <a href="/Vitali_Nikulenka_CV_ru.pdf" download="Vitali_Nikulenka_CV_ru.pdf" target="_blank" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', transition: 'color 0.3s' }}>
             DOWNLOAD CV <Download size={14} />
          </a>
        </div>
        
        <div className="sidebar-footer">
          <a href={cvData.contacts.linkedin} target="_blank" rel="noreferrer" className="social-link"><Linkedin size={16} /></a>
          <a href={cvData.contacts.telegram} target="_blank" rel="noreferrer" className="social-link"><Send size={16} /></a>
          <a href={`mailto:${cvData.contacts.email}`} className="social-link"><Mail size={16} /></a>
          <a href={`tel:${cvData.contacts.phone}`} className="social-link"><Phone size={16} /></a>
        </div>
      </div>

      {/* CONTENT */}
      <div className="arter-content">
        <div className="arter-content-inner">
          
          {/* HERO BANNER */}
          <motion.div className="hero-banner" initial="hidden" animate="visible" variants={itemVariants}>
            <div className="hero-content-wrapper">
              <div className="hero-text">
                <h1>Discover my <br/><span>Awesome Space!</span></h1>
                <p>
                  &lt;code&gt; {cvData.summary} &lt;/code&gt;
                </p>
                <a href="mailto:nikulenka@gmail.com" className="btn-primary">
                  Написать мне
                </a>
              </div>
              <div className="hero-image-container">
                <img src={heroPhoto} alt="Hero Profile" className="hero-image" />
              </div>
            </div>
          </motion.div>

          {/* EXPERIENCE */}
          <div className="section">
            <h2 className="section-title">Опыт работы</h2>
            <div className="timeline-container">
              <div className="timeline-list">
                <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                  {cvData.experience.map((exp, idx) => (
                    <motion.div className="timeline-item" key={idx} variants={itemVariants} viewport={{ once: true }}>
                      <div className="timeline-marker"></div>
                      <h3 className="timeline-item-title">{exp.role}</h3>
                      <div className="timeline-item-company">{exp.company}</div>
                      <div className="timeline-item-period">{exp.period}</div>
                      <ul className="timeline-item-desc">
                        {exp.highlights.map((highlight, hIdx) => (
                          <li key={hIdx}>{highlight}</li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* EDUCATION */}
          <div className="section">
            <h2 className="section-title">Образование</h2>
            <div className="timeline-container">
              <div className="timeline-list">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
                  {cvData.education.map((edu, idx) => (
                    <motion.div className="timeline-item" key={idx} variants={itemVariants}>
                      <div className="timeline-marker"></div>
                      <h3 className="timeline-item-title">{edu.title}</h3>
                      <div className="timeline-item-company">{edu.place}</div>
                      <div className="timeline-item-desc" style={{ color: 'var(--text-muted)' }}>{edu.desc}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>

          {/* COACH SECTION */}
          <div className="section">
            <h2 className="section-title">Professional Coach</h2>
            <motion.div className="coach-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}>
              <h3>{cvData.coachSection.title}</h3>
              <div style={{ color: 'var(--text-main)', fontSize: '15px', marginTop: '10px' }}>
                Ко мне приходят начинающие руководители в IT, когда:
              </div>
              <ul>
                <li>чувствуют, что превратились в «старшего помощника» для своей команды вместо того, чтобы быть её лидером</li>
                <li>внутри живет страх делегировать, и вы ловите себя на том, что снова доделываете задачи за другими</li>
                <li>синдром самозванца и боязнь конфликтов забирают энергию, а вместо драйва остается выгорание</li>
              </ul>
              <p style={{ marginBottom: '15px' }}>
                В работе я всегда за простой язык, конкретные бизнес-инструменты и психологическую поддержку. Я сам прошел этот путь и точно знаю, как помочь вам обрести уверенность, стать авторитетным лидером и сделать так, чтобы ваша команда наконец начала брать на себя ответственность.
              </p>
              <a href={cvData.coachSection.link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ marginTop: '10px' }}>
                Записаться на сессию
              </a>
            </motion.div>
          </div>

        </div>
      </div>
      
    </div>
  );
}

export default App;
