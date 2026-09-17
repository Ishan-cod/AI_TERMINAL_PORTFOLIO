import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const helperPath = path.join(process.cwd(), "src/app/api/helper");

const systemPrompt = fs.readFileSync(
  path.join(helperPath, "systemprompt.txt"),
  "utf-8",
);

const data = {
  about: JSON.parse(
    fs.readFileSync(path.join(helperPath, "data/about.json"), "utf-8"),
  ),

  contact: JSON.parse(
    fs.readFileSync(path.join(helperPath, "data/contact.json"), "utf-8"),
  ),
  contact: JSON.parse(
    fs.readFileSync(path.join(helperPath, "data/contact.json"), "utf-8"),
  ),
  dsa: JSON.parse(
    fs.readFileSync(path.join(helperPath, "data/dsa.json"), "utf-8"),
  ),
  education: JSON.parse(
    fs.readFileSync(path.join(helperPath, "data/education.json"), "utf-8"),
  ),
  experience: JSON.parse(
    fs.readFileSync(path.join(helperPath, "data/experience.json"), "utf-8"),
  ),
  projects: JSON.parse(
    fs.readFileSync(path.join(helperPath, "data/project.json"), "utf-8"),
  ),
  skills: JSON.parse(
    fs.readFileSync(path.join(helperPath, "data/skills.json"), "utf-8"),
  ),
};

const tools = [
  {
    type: "function",
    function: {
      name: "get_about",
      description:
        "Get an overall profile of Ishan, including his background, technical focus, major achievements, and general strengths.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_contact",
      description: "Get Ishan's public contact information.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_dsa",
      description: "Get Ishan's competitive programming and DSA achievements.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_education",
      description: "Get Ishan's educational information.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_experience",
      description: "Get Ishan's professional experience.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_projects",
      description: "Get Ishan's projects.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_skills",
      description: "Get Ishan's technical skills.",
      parameters: {
        type: "object",
        properties: {},
      },
    },
  },
];

const toolData = {
  get_about: data.about,
  get_contact: data.contact,
  get_dsa: data.dsa,
  get_education: data.education,
  get_experience: data.experience,
  get_projects: data.projects,
  get_skills: data.skills,
};

export async function POST(request) {
  try {
    const { message } = await request.json();

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: message,
      },
    ];

    let response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages,
      tools,
      tool_choice: "auto",
    });

    const assistantMessage = response.choices[0].message;

    messages.push(assistantMessage);

    if (assistantMessage.tool_calls) {
      for (const toolCall of assistantMessage.tool_calls) {
        const toolName = toolCall.function.name;

        const result = toolData[toolName];

        if (!result) {
          throw new Error(`Unknown tool: ${toolName}`);
        }

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      response = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages,
        tools,
      });
    }

    return NextResponse.json({
      success: true,
      response: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
