"use client";

// 1. Force the page to render on the client side to avoid build-time pre-rendering errors
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import axios from 'axios';
import QuizCard from '../components/QuizCard';

// 2. Use the environment variable for production, default to localhost for local testing
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
axios.defaults.withCredentials = true;

export default function Home() {
  const [step, setStep] = useState('loading');
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/auth/user`)
      .then(res => {
        if (!res.data) setStep('login');
        else if (res.data.hasRole) setStep('already_wl');
        else { setUser(res.data); setStep('start'); }
      })
      .catch(() => setStep('login'));
  }, []);

  const startQuiz = async () => {
    try {
      const res = await axios.get(`${API_BASE}/questions`);
      setQuestions(res.data);
      setAnswers([]);
      setStep('quiz');
    } catch (e) { 
      setMsg(e.response?.data?.error || "Error loading exam."); 
    }
  };

  const handleSelect = async (choice) => {
    const newAnswers = [...answers, { id: questions[answers.length].id, choice }];
    
    if (newAnswers.length < questions.length) {
      setAnswers(newAnswers);
    } else {
      setStep('loading');
      try {
        const res = await axios.post(`${API_BASE}/submit`, { userAnswers: newAnswers });
        setStep('result'); 
        setMsg(res.data.message);
      } catch (e) { 
        setStep('start'); 
        setMsg("Submission failed."); 
      }
    }
  };

  // Rendering screens
  if (step === 'loading') return <div className="screen"><h1>INITIALIZING...</h1></div>;
  
  if (step === 'login') return (
    <div className="screen">
      <div className="card">
        <h1>PRODIGY AUTH</h1>
        <button className="btn-primary" onClick={async () => { 
          const r = await axios.get(`${API_BASE}/auth/login`); 
          window.location.href = r.data.url; 
        }}>
          LOGIN WITH DISCORD
        </button>
      </div>
    </div>
  );

  if (step === 'start') return (
    <div className="screen">
      <div className="card">
        <h2>WELCOME, {user?.username?.toUpperCase()}</h2>
        {msg && <p className="msg">{msg}</p>}
        <button className="btn-primary" onClick={startQuiz}>START EXAM</button>
      </div>
    </div>
  );

  if (step === 'quiz') return (
    <div className="screen">
      <QuizCard 
        question={questions[answers.length]} 
        onSelect={handleSelect} 
        current={answers.length + 1} 
        total={questions.length} 
      />
    </div>
  );

  if (step === 'result') return (
    <div className="screen">
      <div className="card">
        <h1>RESULT</h1>
        <p>{msg}</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>HOME</button>
      </div>
    </div>
  );
  
  return null;
}
