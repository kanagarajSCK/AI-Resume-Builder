import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { createAgentTools } from '../config/agent.tools.js';
import * as aiService from './ai.service.js';

// Initialize the model
const model = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  apiKey: process.env.GEMINI_API_KEY,
});

const buildSystemInstruction = (data) => `You are a professional resume consultant helping a user build their resume through conversation.

CURRENT RESUME DATA:
${JSON.stringify(data.currentSections || {}, null, 2)}

TARGET ROLE: ${data.targetRole || 'Not specified'}
SECTION BEING BUILT: ${data.sectionTargeted || 'general'}

YOUR TOOLS:
You have access to tools that let you take actions on the resume. Use them when appropriate:
- update_resume_section: Save extracted information to the resume when you've gathered enough data
- generate_star_bullets: Improve bullet points using the STAR method when you have raw experience descriptions
- get_ats_score: Check the ATS score when the user asks or after significant updates
- generate_summary: Write a professional summary when enough sections are filled

CONVERSATION RULES:
1. Ask ONE focused follow-up question at a time
2. Be warm, professional, and conversational
3. Always ask about metrics, numbers, and specific achievements
4. If the user's response is vague, probe deeper with specific examples
5. After gathering enough information for a section, use the update_resume_section tool to save it
6. When using update_resume_section for experience, pass sectionData as an array of objects with: company, role, startDate, endDate, current, bullets
7. When using update_resume_section for education, pass sectionData as an array of objects with: institution, degree, field, startDate, endDate, gpa
8. When using update_resume_section for skills, pass sectionData as an object with: technical (array), soft (array), languages (array)
9. When using update_resume_section for personalInfo, pass sectionData as an object with: fullName, email, phone, location, linkedIn, portfolio
10. When using update_resume_section for summary, pass sectionData as a string (the summary text)`;

export const runInterviewAgent = async (data) => {
  const context = {
    resumeId: data.resumeId,
    targetRole: data.targetRole || '',
    jobDescription: data.jobDescription || '',
    lastExtractedData: null,
  };

  const tools = createAgentTools(context, aiService);

  const agent = createReactAgent({
    llm: model,
    tools,
    prompt: buildSystemInstruction(data),
  });

  const messages = [];

  for (const msg of data.conversationHistory || []) {
    if (msg.content === data.message && msg.role === 'user') continue;
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    });
  }

  messages.push({ role: 'user', content: data.message });

  const result = await agent.invoke({ messages });

  const lastMessage = result.messages[result.messages.length - 1];
  const message =
    typeof lastMessage.content === 'string'
      ? lastMessage.content
      : 'I can help you with your resume. What would you like to work on?';

  return {
    message,
    extractedData: context.lastExtractedData,
    isComplete: context.lastExtractedData !== null,
  };
};