import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';



// List of supported models in priority order
const MODEL_CANDIDATES = [
  'gemini-3.6-flash', // Current default workhorse
  'gemini-3.5-flash', // Stable agentic & coding alternative
  // 'gemini-2.5-flash', // High-availability fallback
];

export async function POST(request: Request) {
  try {
    const { path, rawThoughts } = await request.json();

    if (!rawThoughts || !path) {
      return NextResponse.json({ error: 'Missing path or raw thoughts' }, { status: 400 });
    }

    const userKey = request.headers.get('x-gemini-api-key');
    if (!userKey) {
      return NextResponse.json({ error: 'API key missing. Please configure your key.' }, { status: 401 });
    }
// Initialize GoogleGenerativeAI dynamically with the user's key instead of process.env
    const genAI = new GoogleGenerativeAI(userKey);
    const prompt = `You are a learning synthesis assistant for the "${path}" path.
Analyze the following freewritten thoughts and synthesize them into structured insights:

"${rawThoughts}"`;

    let lastError = null;

    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: SchemaType.OBJECT,
              properties: {
                core_learning: { type: SchemaType.STRING },
                understanding: { type: SchemaType.STRING },
                friction: { type: SchemaType.STRING },
                articulation_drill: { type: SchemaType.STRING },
                next_step: { type: SchemaType.STRING },
              },
              required: [
                'core_learning',
                'understanding',
                'friction',
                'articulation_drill',
                'next_step',
              ],
            },
          },
        });

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        return NextResponse.json(JSON.parse(responseText));
      } catch (err: any) {
        console.warn(`Model ${modelName} failed or busy (${err.message}). Trying next candidate...`);
        lastError = err;
      }
    }

    throw lastError || new Error('All model endpoints failed.');
  } catch (error: any) {
    console.error('AI Synthesis Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// import { NextResponse } from 'next/server';
// import { AI_SYSTEM_PROMPT } from '@/services/ai/prompt';

// export async function POST(request: Request) {
//   try {
//     const { path, rawThoughts } = await request.json();

//     if (!rawThoughts || !path) {
//       return NextResponse.json({ error: 'Missing path or raw thoughts' }, { status: 400 });
//     }

//     const apiKey = process.env.AI_API_KEY;
//     const modelName = process.env.AI_MODEL || 'gemini-2.5-flash';

//     // Local simulation fallback if no API key is provided
//     if (!apiKey) {
//       await new Promise((resolve) => setTimeout(resolve, 1200));

//       let core = `Explored key principles within ${path}, focusing on practical mechanics and structural behavior.`;
//       let understanding = `Solid grasp on high-level goals and basic syntax/flow described in the thoughts.`;
//       let friction = `Edge cases, underlying performance tradeoffs, or failure modes remain ambiguous.`;
//       let drill = `Explain the core mechanism of what you just studied without using jargon, as if teaching a beginner.`;
//       let next = `Build a small isolated experiment or diagram out the end-to-end data flow to test your assumptions.`;

//       if (path === 'System Design') {
//         core = `Examined architectural tradeoffs, scaling bottlenecks, and component interactions.`;
//         understanding = `Clear understanding of the primary workflow and reading/writing paths.`;
//         friction = `Uncertainty regarding consistency models under high network partitioning or heavy write concurrency.`;
//         drill = `Explain why a bottleneck occurs at scale in this architecture and how you would mitigate it without adding undue complexity.`;
//         next = `Sketch out a failure recovery sequence diagram for the primary component discussed.`;
//       } else if (path === 'AI') {
//         core = `Investigated model behavior, prompt framing, or algorithmic training mechanics.`;
//         understanding = `Understands the directional relationship between inputs and output variations.`;
//         friction = `Gaps in understanding token limits, loss landscapes, or evaluation metrics.`;
//         drill = `Explain the exact bottleneck or failure mode you encountered and why the model reacted that way.`;
//         next = `Run a comparative test with 3 distinct prompt variations or parameter adjustments to isolate the variable.`;
//       } else if (path === 'Full Stack') {
//         core = `Focused on state flow, rendering lifecycle, or database integration across the stack.`;
//         understanding = `Component hierarchy and state binding appear coherent in your mental model.`;
//         friction = `Asynchrony handling, error state propagation, or re-render triggers need sharper definition.`;
//         drill = `Walk through the lifecycle of data from user click in the UI down to the database storage and back.`;
//         next = `Implement error boundary handling or a loading skeleton for this specific asynchronous path.`;
//       }

//       return NextResponse.json({
//         core_learning: core,
//         understanding: understanding,
//         friction: friction,
//         articulation_drill: drill,
//         next_step: next,
//       });
//     }

//     const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent`;
//     const prompt = `${AI_SYSTEM_PROMPT}\n\nLearning Path: ${path}\n\nUser's Raw Thoughts:\n${rawThoughts}`;

//     const res = await fetch(geminiUrl, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json','X-goog-api-key': `${apiKey}` },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }],
//         generationConfig: { responseMimeType: 'application/json' },
//       }),
//     });

//     if (!res.ok) {
//         const errorData = await res.json();
// throw new Error(`AI Service error with status: ${JSON.stringify(errorData)}`);

//     //   throw new Error(`AI Service error with status ${await res.json()}`);
//     }

//     const data = await res.json();
//     const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

//     if (!textResponse) {
//       throw new Error('Received empty response from AI model');
//     }

//     return NextResponse.json(JSON.parse(textResponse));
//   } catch (error: any) {
//     console.error('AI Synthesis Error:', error);
//     return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
//   }
// }

/*
Today i have built the FocusLog AI, a system to improve my reflection of learning and keep track of the sessions i have been studying.
I have built using gemini and learnt the Next Js and npx execution and creation of next js.
The system logs the session and helps to synthesize the details i provided with AI and save the session. All the sessions can be viewed at Archieved page and new session can be created.

also learnt few basic concepts of react and concepts like usestate, nextjs strict routing folder structure etc,
used the AI integration to synthesize the session details with google studio free API key

but still i yet to explore the react indepth to ready for building production application and 
improve the FocusLog AI application after using for few days as its now a prototype.


*/