const { useState, useEffect, useRef, useMemo, useCallback } = React;

function App() {
  const [lang, setLang] = useState('ko');
  const t = i18n[lang];

  const [stage, setStage] = useState('onboarding');
  const [context, setContext] = useState({ year: '', state: '', mood: 3, signals: [] });
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [twinPersona, setTwinPersona] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const scrollRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [newSignal, setNewSignal] = useState("");
  const hasAnimatedOnboardingRef = useRef(false);
  const hasAnimatedNotebookRef = useRef(false);

  // Track animation state - only animate once per stage
  useEffect(() => {
    if (stage === 'onboarding') {
      hasAnimatedOnboardingRef.current = true;
    }
  }, [stage]);

  // --- 1. ONBOARDING ---
  const Onboarding = () => {
    // Only animate on first render when stage is onboarding
    const shouldAnimate = stage === 'onboarding' && !hasAnimatedOnboardingRef.current;
    if (shouldAnimate) {
      hasAnimatedOnboardingRef.current = true;
    }
    return (
    <div className={`flex flex-col gap-8 max-w-md mx-auto ${shouldAnimate ? 'animate-in fade-in slide-in-from-bottom-4 duration-700' : ''}`}>
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t.onboarding_welcome}</h1>
        <p className="text-slate-500 font-medium">{t.onboarding_sub}</p>
      </div>
      <div className={STYLES.card}>
        <div className="space-y-8">
          <section>
            <label className="block text-xs font-black text-indigo-400 mb-4 uppercase tracking-[0.2em]">{t.year_label}</label>
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3'].map(y => (
                <button 
                  key={y} 
                  onClick={() => setContext({...context, year: y})} 
                  className={`${STYLES.pill} h-12 flex items-center justify-center ${context.year === y ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500'}`}
                >
                  {lang === 'ko' ? y+'학년' : 'G'+y}
                </button>
              ))}
            </div>
          </section>
          <section>
            <label className="block text-xs font-black text-indigo-400 mb-4 uppercase tracking-[0.2em]">{t.state_label}</label>
            <div className="flex flex-col gap-3">
              {[
                {id:'pre', label: lang === 'ko' ? '📚 선택을 앞두고 있어' : '📚 Before Decision'}, 
                {id:'doubt', label: lang === 'ko' ? '🤔 이게 맞나 싶어' : '🤔 Doubting Path'}
              ].map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setContext({...context, state: s.id})} 
                  className={`text-left p-5 rounded-2xl border-2 transition-all font-semibold ${context.state === s.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 bg-slate-50'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </section>
          <button 
            disabled={!context.year} 
            onClick={() => setStage('notebook')} 
            className={`${STYLES.button} ${STYLES.primaryBtn} w-full flex items-center justify-center gap-2 group`}
          >
            {t.start_btn} 
            <Icon name="arrow-right" size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
    );
  };

  // Track notebook animation state - only animate once per stage
  useEffect(() => {
    if (stage === 'notebook') {
      hasAnimatedNotebookRef.current = true;
    }
  }, [stage]);

  // --- 2. NOTEBOOK ---
  const NotebookView = () => {
    // Only animate on first render when stage is notebook
    const shouldAnimate = stage === 'notebook' && !hasAnimatedNotebookRef.current;
    if (shouldAnimate) {
      hasAnimatedNotebookRef.current = true;
    }
    
    // Memoize signals rendering to prevent re-render on input change
    const signalsList = useMemo(() => {
      return context.signals.map((s, i) => (
        <span 
          key={`signal-${i}-${s}`} 
          className="bg-white border border-slate-100 shadow-sm text-indigo-600 px-4 py-2 rounded-xl flex items-center gap-2 font-bold animate-in zoom-in-95"
        >
          {s} 
          <button 
            onClick={() => setContext(p => ({...p, signals: p.signals.filter((_, idx) => idx !== i)}))} 
            className="text-slate-300 hover:text-red-400"
          >
            <Icon name="x" size={14} />
          </button>
        </span>
      ));
    }, [context.signals]);
    
    // Memoize form submit handler
    const handleSubmit = useCallback((e) => {
      e.preventDefault();
      if(newSignal.trim()) {
        setContext(prev => ({...prev, signals:[...prev.signals, newSignal.trim()]}));
        setNewSignal("");
      }
    }, [newSignal]);
    
    // Optimize input handler - use direct DOM manipulation for better performance
    const inputRef = useRef(null);
    const handleInputChange = useCallback((e) => {
      setNewSignal(e.target.value);
    }, []);
    
    return (
    <div className={`flex flex-col gap-8 max-w-md mx-auto ${shouldAnimate ? 'animate-in fade-in slide-in-from-right-8 duration-500' : ''}`}>
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner">
          <Icon name="book-open" size={28} />
        </div>
        <h2 className="text-3xl font-black text-slate-900">{t.notebook_title}</h2>
        <p className="text-slate-500 font-medium text-center">{t.notebook_sub}</p>
      </div>
      <div className={STYLES.card}>
        <form 
          onSubmit={handleSubmit} 
          className="flex gap-3 mb-8"
        >
          <input 
            ref={inputRef}
            value={newSignal} 
            onChange={handleInputChange} 
            placeholder={t.notebook_placeholder} 
            className={STYLES.input} 
          />
          <button type="submit" className="bg-indigo-600 text-white p-4 rounded-2xl">
            <Icon name="plus" size={24} />
          </button>
        </form>
        <div className="flex flex-wrap gap-2 min-h-[140px] items-start content-start bg-slate-50/50 p-4 rounded-3xl border border-dashed border-slate-200">
          {signalsList}
        </div>
        <button 
          onClick={() => setStage('chat')} 
          className={`${STYLES.button} ${STYLES.primaryBtn} w-full mt-8`}
        >
          {t.start_btn}
        </button>
      </div>
    </div>
    );
  };

  // --- 3. CHAT ---
  useEffect(() => {
    const initChat = async () => {
      if (stage === 'chat' && chatMessages.length === 0) {
        setIsTyping(true);
        const res = await simulateResponse(context, [], "", lang);
        setChatMessages([{ role: 'ai', text: res }]);
        setIsTyping(false);
      }
    };
    initChat();
  }, [stage]);

  // Auto-scroll to bottom when messages change (but not during typing)
  useEffect(() => {
    if (stage === 'chat' && messagesContainerRef.current && scrollRef.current) {
      // Only scroll if user is near the bottom (within 100px)
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      if (isNearBottom || chatMessages.length === 0) {
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        });
      }
    }
  }, [chatMessages, isTyping, stage]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = e.target.msg.value;
    if (!text || isTyping) return;
    const newMsgs = [...chatMessages, { role: 'user', text }];
    setChatMessages(newMsgs);
    e.target.reset();
    setIsTyping(true);
    const res = await simulateResponse(context, chatMessages, text, lang);
    setChatMessages(prev => [...prev, { role: 'ai', text: res }]);
    setIsTyping(false);
  };

  const ChatView = () => (
    <div className="flex flex-col h-[78vh] max-w-xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
      <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Icon name="sparkles" size={24} />
          </div>
          <div>
            <h3 className="font-black text-slate-900">{t.title}</h3>
            <span className="text-[10px] uppercase font-black text-indigo-500 tracking-widest">{t.chat_header}</span>
          </div>
        </div>
        <button 
          onClick={generateTwin} 
          className="text-sm font-black text-indigo-600 px-5 py-2.5 hover:bg-indigo-50 rounded-2xl transition-all"
        >
          {t.twin_btn}
        </button>
      </div>
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-8 space-y-6 chat-messages-container">
        {chatMessages.map((m, i) => (
          <div 
            key={i} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
          >
            <div className={`max-w-[85%] p-5 rounded-[2rem] font-medium leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-slate-400 text-xs font-bold italic animate-pulse flex items-center gap-2">
            <Icon name="sparkles" size={12} /> {t.ai_typing}
          </div>
        )}
        <div ref={scrollRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-6 bg-slate-50 border-t flex gap-3 chat-input-container">
        <input 
          name="msg" 
          placeholder={t.notebook_placeholder} 
          className={STYLES.input} 
          autoComplete="off"
          onFocus={(e) => {
            // Prevent browser from auto-scrolling when input is focused
            const container = messagesContainerRef.current;
            if (container) {
              const currentScroll = container.scrollTop;
              // Reset scroll position immediately to prevent jump
              requestAnimationFrame(() => {
                if (container) {
                  container.scrollTop = currentScroll;
                }
              });
            }
          }}
        />
        <button type="submit" className="bg-indigo-600 text-white p-5 rounded-2xl shadow-xl">
          <Icon name="arrow-right" size={24} />
        </button>
      </form>
    </div>
  );

  // --- 4. TWIN VIEW ---
  const generateTwin = async () => {
    setStage('twin');
    setIsSynthesizing(true);
    const res = await simulateTwin(context, chatMessages, lang);
   
    try {
      const parsed = JSON.parse(res);
      setTwinPersona(parsed);
    } catch(e) {
      console.error("Parse Fail:", e);
      // Fallback data in case of malformed response
      const isKorean = lang === 'ko';
      setTwinPersona({
        profile: { 
          archetype: isKorean ? "탐구하는 별" : "Thinking Star", 
          operatingManual: isKorean ? "성장을 위한 성찰적 접근." : "Reflective approach to growth.", 
          fearRadar: isKorean ? "미래 경로에 대한 불안." : "Anxiety about future path.", 
          innerCompass: isKorean ? "개인적 정렬을 찾는 중." : "Seeking personal alignment.", 
          twinResponse: isKorean ? "계속 안으로 들어가봐." : "Keep looking inward." 
        },
        growth: { 
          coreValues: isKorean ? "진정성과 탐구" : "Integrity & Exploration", 
          decisionGuide: [] 
        }
      });
    }
    setIsSynthesizing(false);
  };

  const TwinView = () => (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl animate-pulse">
          <Icon name="fingerprint" size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900">
          {t.twin_title} : {twinPersona?.profile.archetype || "..."}
        </h2>
        <div className="flex gap-2 justify-center">
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
          >
            {t.profile_tab}
          </button>
          <button 
            onClick={() => setActiveTab('compass')} 
            className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${activeTab === 'compass' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
          >
            {t.compass_tab}
          </button>
        </div>
      </div>

      {isSynthesizing ? (
        <div className={`${STYLES.card} flex flex-col items-center justify-center py-20 gap-4`}>
          <Icon name="loader-2" size={40} className="animate-spin text-indigo-600" />
          <p className="font-bold text-slate-500">{t.loading_twin}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'profile' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
              <div className={STYLES.card}>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <Icon name="anchor" size={24} className="text-indigo-500" />
                  <h4 className="font-black text-slate-800">{t.operating_manual}</h4>
                </div>
                <p className="text-slate-600 font-medium italic">"{twinPersona?.profile.operatingManual}"</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`${STYLES.card} p-6`}>
                  <h4 className="text-[10px] font-black uppercase text-red-500 mb-2">{t.fear_radar}</h4>
                  <p className="text-sm font-bold text-slate-700">{twinPersona?.profile.fearRadar}</p>
                </div>
                <div className={`${STYLES.card} p-6`}>
                  <h4 className="text-[10px] font-black uppercase text-indigo-500 mb-2">{t.inner_compass}</h4>
                  <p className="text-sm font-bold text-slate-700">{twinPersona?.profile.innerCompass}</p>
                </div>
              </div>
              <div className="bg-slate-900 text-white rounded-[3rem] p-8 shadow-2xl space-y-4">
                <div className="flex items-center gap-3 opacity-60">
                  <Icon name="message-circle" size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Twin's Whisper</span>
                </div>
                <p className="text-xl font-bold leading-relaxed italic">"{twinPersona?.profile.twinResponse}"</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className={STYLES.card}>
                <h4 className="font-black text-amber-500 mb-4">{t.growth_title}</h4>
                <p className="text-indigo-900 font-bold text-xl">{twinPersona?.growth.coreValues}</p>
              </div>
              {twinPersona?.growth.decisionGuide?.map((item, i) => (
                <div key={i} className={`${STYLES.card} p-6 hover:border-indigo-200`}>
                  <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black mb-2 block w-fit">
                    {item.scenario}
                  </span>
                  <p className="text-sm text-slate-600 font-medium">{item.advice}</p>
                </div>
              ))}
              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 items-start">
                <Icon name="lightbulb" size={20} className="text-amber-500 mt-1" />
                <p className="text-xs text-amber-800 leading-relaxed italic">
                  <strong>Growth Tip:</strong> Use these criteria to guide your next decision. Being a "better person" starts with choosing what you truly love.
                </p>
              </div>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()} 
            className={`${STYLES.button} ${STYLES.secondaryBtn} w-full mt-4`}
          >
            {t.back_to_start}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans p-6 selection:bg-indigo-100">
      <header className="max-w-xl mx-auto flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Icon name="sparkles" size={20} />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-900">{t.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'ko' ? 'en' : 'ko')} 
            className="bg-white border px-4 py-2 rounded-2xl text-[10px] font-black text-indigo-600 shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <Icon name="globe" size={12} /> {lang === 'ko' ? 'English' : '한국어'}
          </button>
          <div className="text-[10px] font-black text-slate-400">
            <Icon name="eye-off" size={12} className="inline mr-1 text-indigo-400" /> {t.private_badge}
          </div>
        </div>
      </header>
      <main className="pb-12">
        {stage === 'onboarding' && <Onboarding />}
        {stage === 'notebook' && <NotebookView />}
        {stage === 'chat' && <ChatView />}
        {stage === 'twin' && <TwinView />}
      </main>
      
      {/* Aesthetic Blurs */}
      <div className="fixed -bottom-48 -left-48 w-96 h-96 bg-indigo-200 rounded-full blur-[100px] opacity-20 -z-10 animate-pulse"></div>
      <div className="fixed -top-48 -right-48 w-96 h-96 bg-purple-200 rounded-full blur-[100px] opacity-20 -z-10"></div>
    </div>
  );
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root'));
