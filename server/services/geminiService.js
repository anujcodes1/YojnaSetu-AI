const { getModel } = require('../config/gemini');

/**
 * Generate AI explanations for recommended schemes
 */
const generateSchemeExplanations = async (user, schemes) => {
  try {
    const model = getModel();

    const userProfile = `
Age: ${user.age || 'Not specified'}, Gender: ${user.gender || 'Not specified'},
State: ${user.state || 'Not specified'}, Annual Income: ₹${(user.income || 0).toLocaleString('en-IN')},
Occupation: ${user.occupation || 'Not specified'}, Category: ${(user.category || 'general').toUpperCase()},
Education: ${user.education || 'Not specified'}, Disability: ${user.isDisabled ? 'Yes' : 'No'}`;

    const schemeList = schemes.slice(0, 5).map((s, i) =>
      `${i + 1}. "${s.title}" (Match: ${s.matchScore}%) - ${s.shortDescription}`
    ).join('\n');

    const prompt = `You are a helpful Indian government scheme advisor. Based on the user profile below, explain in 1-2 simple sentences why each scheme is relevant to them. Be warm, encouraging, and specific.

User Profile: ${userProfile}

Top Schemes:
${schemeList}

Respond ONLY with a valid JSON array in this exact format (no markdown, no extra text):
[{"index": 1, "explanation": "..."},{"index": 2, "explanation": "..."},...]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Parse JSON safely
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return parsed;
  } catch (error) {
    console.error('Gemini explanation error:', error.message);
    return [];
  }
};

/**
 * Chat with AI assistant
 */
const chatWithAssistant = async (userMessage, userProfile, chatHistory = []) => {
  try {
    const model = getModel();

    const systemContext = `You are YojnaSetu AI, a helpful assistant that guides Indian citizens about government schemes. 
User Profile: Age ${userProfile.age || 'unknown'}, ${userProfile.occupation || 'unknown'} from ${userProfile.state || 'India'}, income ₹${(userProfile.income || 0).toLocaleString('en-IN')}/year.
Always respond in clear, simple English. Be concise. If asking about eligibility, mention key criteria.
If user writes in Hindi, respond in Hinglish (mix of Hindi and English). Always be helpful and encouraging.`;

    const historyForAPI = chatHistory.slice(-10).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: systemContext }] },
        { role: 'model', parts: [{ text: 'I understand. I will help users find the right government schemes.' }] },
        ...historyForAPI
      ]
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error('Gemini chat error:', error.message);
    return "I'm having trouble connecting right now. Please try again in a moment. For urgent help, visit myscheme.gov.in";
  }
};

/**
 * Generate eligibility analysis using AI
 */
const analyzeEligibility = async (user, scheme, matchedCriteria, missedCriteria, score) => {
  try {
    const model = getModel();

    const prompt = `Analyze this government scheme eligibility result and give a helpful 2-3 sentence summary in simple English.

Scheme: ${scheme.title}
User match score: ${score}%
Matched criteria: ${matchedCriteria.join(', ') || 'None'}
Missed criteria: ${missedCriteria.join(', ') || 'None'}
${score >= 80 ? 'Result: Fully eligible' : score >= 50 ? 'Result: Partially eligible' : 'Result: Not currently eligible'}

Give practical advice. If not eligible, suggest what they could do. Keep it under 60 words.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    return `Based on your profile, you match ${score}% of the eligibility criteria for this scheme.`;
  }
};

module.exports = { generateSchemeExplanations, chatWithAssistant, analyzeEligibility };
