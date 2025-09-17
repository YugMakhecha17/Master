import { GoogleGenAI, Type } from "@google/genai";
import { type SuggestedTask, DepartmentName, Department } from '../types';

// Create a function to get the initialized client.
// This defers the API key check until the function is actually called,
// preventing the app from crashing on load if the key is missing.
const getAiClient = () => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API_KEY environment variable not set. Please configure it in your deployment environment.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

const getTaskGenerationPrompt = (description: string, currentDepartments: Department[]) => {
    const departmentNames = currentDepartments.map(dept => dept.name);

    const departmentsAndMembers = JSON.stringify(
        currentDepartments.map(dept => ({
        name: dept.name,
        members: dept.members.map(member => ({ 
            id: member.id, 
            name: member.name,
            role: member.role,
        }))
        })),
        null,
        2
    );

    const roleDescriptions = currentDepartments.map(dept => 
        `Department '${dept.name}':\n` +
        dept.members.map(member => `- ${member.name} (ID: ${member.id}): Specialist for ${member.role}.`).join('\n')
    ).join('\n\n');

    return `
        You are an expert Scrum Master and IT Project Manager. Your task is to analyze a high-level project description and break it down into smaller, actionable user stories/tickets for a Scrum board. You must delegate these tasks to the rightful person in charge based on their specific specialty within their department.

        Here are the available departments and their specialist members:
        """
        ${departmentsAndMembers}
        """

        Here is a detailed breakdown of each specialist's role:
        """
        ${roleDescriptions}
        """

        Based on the following project description, generate a list of tasks. For each task, you must provide:
        1. A clear 'title'.
        2. A detailed 'description' of the work required.
        3. The most appropriate 'suggestedDepartment' based on the specialty required (e.g., 'Software' for UI work, 'Marketing' for SEO).
        4. The ID of the person in charge ('suggestedAssigneeId'). This ID MUST match the person responsible for that specialty (e.g., 'sophia-kim' for Frontend tasks).
        5. A reasonable 'suggestedDueDate' in 'YYYY-MM-DD' format, based on today's date: ${new Date().toISOString().split('T')[0]}.
        6. A 'priority' level ('Low', 'Medium', or 'High') based on the task's perceived urgency and importance to the overall project.
        7. An estimate for 'storyPoints'. This should be an integer from the Fibonacci sequence (1, 2, 3, 5, 8, 13) representing the complexity and effort.

        Project Description:
        """
        ${description}
        """

        Rigorously follow the specialties when assigning tasks. For example, any UI/UX work MUST go to Zoe Martinez in the Design department. Any task related to AWS or Kubernetes MUST go to Priya Nair in the Software department. Provide your output as a JSON array of objects, strictly following the defined schema.
    `;
};


export const initiateProjectAnalysis = async (description: string, currentDepartments: Department[]): Promise<Omit<SuggestedTask, 'id'>[]> => {
  try {
    const ai = getAiClient(); // The check for API_KEY happens here.
    const prompt = getTaskGenerationPrompt(description, currentDepartments);
    const departmentNames = currentDepartments.map(d => d.name);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        suggestedDepartment: { type: Type.STRING },
                        suggestedAssigneeId: { type: Type.STRING },
                        suggestedDueDate: { type: Type.STRING },
                        priority: { type: Type.STRING },
                        storyPoints: { type: Type.INTEGER }
                    },
                    required: ['title', 'description', 'suggestedDepartment', 'suggestedAssigneeId', 'suggestedDueDate', 'priority', 'storyPoints']
                },
            },
        },
    });

    const jsonText = response.text;
    const parsedData = JSON.parse(jsonText);
    
    if (!Array.isArray(parsedData)) {
      console.error("Gemini response is not an array:", parsedData);
      throw new Error("AI response was not in the expected format.");
    }

    // --- Data Validation ---
    const employeeDepartmentMap = new Map<string, DepartmentName>();
    currentDepartments.forEach(dept => {
      dept.members.forEach(member => {
        employeeDepartmentMap.set(member.id, dept.name);
      });
    });

    const validatedTasks = parsedData.filter(task => {
        const isValidDepartment = departmentNames.includes(task.suggestedDepartment as DepartmentName);
        const isValidAssignee = employeeDepartmentMap.has(task.suggestedAssigneeId);
        const isAssigneeInDept = employeeDepartmentMap.get(task.suggestedAssigneeId) === task.suggestedDepartment;
        const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(task.suggestedDueDate);
        const isValidPriority = ['Low', 'Medium', 'High'].includes(task.priority);
        const isValidStoryPoints = typeof task.storyPoints === 'number' && task.storyPoints > 0;
      
        if (!isValidDepartment || !isValidAssignee || !isAssigneeInDept || !isValidDate || !isValidPriority || !isValidStoryPoints) {
          console.warn('Filtering out invalid task from AI:', task);
          return false;
        }
        return true;
    });

    return validatedTasks;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Propagate the specific error message (e.g., API key missing) to be displayed in the UI.
    throw error instanceof Error ? error : new Error("Failed to get a valid response from the AI model.");
  }
};