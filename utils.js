// --- SIMULATION SYSTEM ---
// Simulates AI responses based on user context and selections

const simulateResponse = async (context, chatHistory, userMessage, lang) => {
  // Add a small delay to simulate thinking
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  const isKorean = lang === 'ko';
  const signals = context.signals || [];
  const state = context.state;
  const year = context.year;
  
  // Initial greeting based on context
  if (chatHistory.length === 0) {
    const greetings = isKorean ? [
      `안녕! ${year}학년이구나. 네가 적어준 시그널들을 보니까 ${signals.length > 0 ? signals.slice(0, 2).join('와 ') + ' 같은 것들이' : '많은 것들이'} 네게 의미가 있구나.`,
      `${year}학년이네! ${signals.length > 0 ? signals[0] : '네가 선택한 것들'}을 보면 네가 무엇을 소중히 여기는지 알 수 있을 것 같아.`,
      `반가워! ${state === 'pre' ? '선택을 앞두고 있다니' : '이게 맞나 싶은 마음이 있다니'} 지금 이 순간이 네게 중요한 시간이겠구나.`
    ] : [
      `Hi! You're in Grade ${year}. Looking at your signals like ${signals.length > 0 ? signals.slice(0, 2).join(' and ') : 'the things you chose'}, I can see what matters to you.`,
      `Grade ${year}! From ${signals.length > 0 ? signals[0] : 'your selections'}, I sense what you value deeply.`,
      `Welcome! ${state === 'pre' ? 'Facing a decision' : 'Feeling uncertain'} - this moment is important for you.`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Response based on user message keywords and context
  const lowerMsg = userMessage.toLowerCase();
  const responses = [];
  
  // Context-aware responses
  if (signals.length > 0) {
    const signalMention = signals.find(s => lowerMsg.includes(s.toLowerCase()));
    if (signalMention) {
      responses.push(isKorean 
        ? `${signalMention}에 대해 말해줘서 고마워. 그게 네게 어떤 의미인지 더 자세히 들려줄 수 있을까?`
        : `Thanks for sharing about ${signalMention}. Can you tell me more about what it means to you?`
      );
    }
  }
  
  // State-based responses
  if (state === 'pre' && (lowerMsg.includes('선택') || lowerMsg.includes('decision') || lowerMsg.includes('choose'))) {
    responses.push(isKorean
      ? `선택을 앞두고 있을 때, 무엇을 '해야' 하는지보다 네가 '누구'인지가 더 중요해. 네가 이미 보여준 시그널들이 답의 실마리일 거야.`
      : `When facing a choice, who you are matters more than what you should do. The signals you've shown are clues to your answer.`
    );
  }
  
  if (state === 'doubt' && (lowerMsg.includes('맞') || lowerMsg.includes('right') || lowerMsg.includes('doubt'))) {
    responses.push(isKorean
      ? `의심은 네가 진심으로 고민하고 있다는 증거야. 완벽한 답을 찾으려 하기보다, 지금 이 순간 네 마음이 어디로 향하는지 느껴봐.`
      : `Doubt shows you're thinking deeply. Instead of finding the perfect answer, feel where your heart is pointing right now.`
    );
  }
  
  // General reflective responses
  const generalResponses = isKorean ? [
    `그런 마음이 들 수 있겠어. 그 경험이 네게 어떤 감정을 불러일으켰어?`,
    `흥미롭네. 그게 네게 어떤 의미였는지 더 자세히 들려줄 수 있을까?`,
    `그런 이야기를 들려줘서 고마워. 그 순간에 네가 어떤 사람이었는지 생각해볼 수 있을까?`,
    `네가 그렇게 느꼈다는 게 중요해. 그 경험이 네게 무엇을 알려줬을까?`,
    `그런 고민을 하고 있다니 네가 진심으로 자신을 탐구하고 있다는 뜻이야. 계속해서 네 안의 목소리를 들어봐.`
  ] : [
    `I can understand that feeling. What emotions did that experience bring up for you?`,
    `That's interesting. Can you tell me more about what it meant to you?`,
    `Thanks for sharing that. Can you think about who you were in that moment?`,
    `It's important that you felt that way. What did that experience teach you?`,
    `Having those thoughts shows you're truly exploring yourself. Keep listening to the voice inside you.`
  ];
  
  responses.push(...generalResponses);
  
  // Return a random response from the pool
  return responses[Math.floor(Math.random() * responses.length)];
};

const simulateTwin = async (context, chatHistory, lang) => {
  // Add a delay to simulate processing
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
  
  const isKorean = lang === 'ko';
  const signals = context.signals || [];
  const state = context.state;
  const year = context.year;
  
  // Generate archetype based on signals and state
  const archetypes = isKorean ? [
    "탐구하는 별", "성장하는 나무", "깊이 생각하는 별", "자기 발견자", "내면의 나침반"
  ] : [
    "Exploring Star", "Growing Tree", "Deep Thinker", "Self Discoverer", "Inner Compass"
  ];
  
  const archetype = archetypes[Math.floor(Math.random() * archetypes.length)];
  
  // Generate persona based on context
  const operatingManuals = isKorean ? [
    `네가 ${signals.length > 0 ? signals.slice(0, 2).join('와 ') : '선택한 것들'}을 통해 자신을 발견하는 여정을 가고 있어.`,
    `네 안의 가치를 찾아가는 과정에서 ${state === 'pre' ? '선택의 순간' : '의심의 순간'}을 겪고 있구나.`,
    `네가 보여준 시그널들이 네 진짜 모습의 단서들이야. 그것들을 믿고 따라가봐.`
  ] : [
    `You're on a journey of self-discovery through ${signals.length > 0 ? signals.slice(0, 2).join(' and ') : 'your selections'}.`,
    `You're experiencing ${state === 'pre' ? 'a moment of choice' : 'a moment of doubt'} while finding your values.`,
    `The signals you've shown are clues to your true self. Trust them and follow them.`
  ];
  
  const fearRadars = isKorean ? [
    `미래에 대한 불안, 잘못된 선택에 대한 두려움`,
    `다른 사람의 기대와 자신의 마음 사이의 갈등`,
    `완벽한 답을 찾지 못할 것에 대한 걱정`
  ] : [
    `Anxiety about the future, fear of making the wrong choice`,
    `Conflict between others' expectations and your own heart`,
    `Worry about not finding the perfect answer`
  ];
  
  const innerCompasses = isKorean ? [
    `네가 진심으로 좋아하는 것들, 그것들이 네 방향이야`,
    `네가 '나답다'고 느끼는 순간들, 그 감각을 신뢰해`,
    `네 안의 목소리, 그것이 가장 정확한 나침반이야`
  ] : [
    `The things you truly love - they are your direction`,
    `The moments you feel 'like yourself' - trust that feeling`,
    `The voice inside you - it's your most accurate compass`
  ];
  
  const twinResponses = isKorean ? [
    `네가 이미 알고 있는 답을 찾고 있어. 조금만 더 안으로 들어가봐.`,
    `완벽한 선택은 없어. 네 마음이 가는 곳이 답이야.`,
    `네가 보여준 시그널들이 이미 답을 말하고 있어. 그것들을 믿어봐.`
  ] : [
    `You're finding the answer you already know. Go a little deeper inside.`,
    `There's no perfect choice. Where your heart goes is the answer.`,
    `The signals you've shown already speak the answer. Trust them.`
  ];
  
  const coreValues = isKorean ? [
    `진정성과 자기 탐구`,
    `성장과 자기 발견`,
    `내면의 가치와 자유`
  ] : [
    `Authenticity and Self-Exploration`,
    `Growth and Self-Discovery`,
    `Inner Values and Freedom`
  ];
  
  const decisionGuides = isKorean ? [
    {
      scenario: "선택의 순간이 왔을 때",
      advice: "네가 좋아하는 것, 네가 '나답다'고 느끼는 것을 선택해. 다른 사람의 기대보다 네 마음의 목소리를 들어봐."
    },
    {
      scenario: "의심이 들 때",
      advice: "완벽한 답을 찾으려 하지 마. 네가 지금 이 순간에 진심으로 원하는 것이 무엇인지 물어봐."
    },
    {
      scenario: "압박을 느낄 때",
      advice: "네가 보여준 시그널들을 기억해. 그것들이 네 진짜 가치야. 그것들을 지키는 선택을 해."
    }
  ] : [
    {
      scenario: "When a moment of choice arrives",
      advice: "Choose what you love, what makes you feel 'like yourself'. Listen to your heart's voice over others' expectations."
    },
    {
      scenario: "When doubt arises",
      advice: "Don't try to find the perfect answer. Ask what you truly want in this moment."
    },
    {
      scenario: "When feeling pressure",
      advice: "Remember the signals you've shown. They are your true values. Make choices that honor them."
    }
  ];
  
  return JSON.stringify({
    profile: {
      archetype: archetype,
      operatingManual: operatingManuals[Math.floor(Math.random() * operatingManuals.length)],
      fearRadar: fearRadars[Math.floor(Math.random() * fearRadars.length)],
      innerCompass: innerCompasses[Math.floor(Math.random() * innerCompasses.length)],
      twinResponse: twinResponses[Math.floor(Math.random() * twinResponses.length)]
    },
    growth: {
      coreValues: coreValues[Math.floor(Math.random() * coreValues.length)],
      decisionGuide: decisionGuides
    }
  });
};

