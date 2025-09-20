'use server';

/**
 * @fileOverview Genkit flow for generating individual pages from natural language prompts
 * for the Flutter app builder dashboard.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define widget structure to match dashboard types
const WidgetSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string().describe('Unique identifier for the widget'),
  type: z.enum(['container', 'text', 'button', 'image', 'column', 'row']).describe('Type of widget'),
  properties: z.record(z.any()).describe('Widget properties like color, text, size, etc.'),
  children: z.array(WidgetSchema).optional().describe('Child widgets if applicable'),
}));

const AppPageSchema = z.object({
  id: z.string().describe('Unique page identifier'),
  name: z.string().describe('Page name in PascalCase (e.g., LoginPage)'),
  type: z.literal('screen').describe('Always screen for pages'),
  route: z.string().describe('Page route path starting with /'),
  createdAt: z.string().describe('Creation date in YYYY-MM-DD format'),
  widgets: z.array(WidgetSchema).describe('Array of widgets that make up the page'),
});

// Input schema
const GeneratePageFromPromptInputSchema = z.object({
  pageName: z.string().describe('The name of the page to create'),
  prompt: z.string().describe('Natural language description of the page features and design'),
});

export type GeneratePageFromPromptInput = z.infer<typeof GeneratePageFromPromptInputSchema>;

// Output schema  
const GeneratePageFromPromptOutputSchema = z.object({
  page: AppPageSchema.describe('The generated page with complete widget structure'),
});

export type GeneratePageFromPromptOutput = z.infer<typeof GeneratePageFromPromptOutputSchema>;

// Define the prompt for generating pages
const generatePagePrompt = ai.definePrompt({
  name: 'generatePagePrompt',
  input: {schema: GeneratePageFromPromptInputSchema},
  output: {schema: GeneratePageFromPromptOutputSchema},
  prompt: `You are an expert Flutter UI designer. Generate a complete page structure based on the user's description.

**User Input:**
Page Name: "{{{pageName}}}"
Description: "{{{prompt}}}"

**CRITICAL INSTRUCTIONS:**

1. **ANALYZE THE PROMPT:**
   - Understand what type of page is being requested (login, profile, settings, dashboard, etc.)
   - Identify key UI elements mentioned (forms, buttons, images, lists, etc.)
   - Note any colors, styling, or layout preferences
   - Support both Arabic and English descriptions

2. **WIDGET STRUCTURE:**
   Generate widgets using these types only:
   - **column**: Vertical layout container with children
   - **row**: Horizontal layout container with children  
   - **text**: Text display with properties: text, fontSize, fontWeight, color
   - **button**: Interactive button with properties: text, backgroundColor, textColor, padding
   - **container**: Generic container with properties: height, width, backgroundColor, borderRadius
   - **image**: Image placeholder with properties: height, width, borderRadius

3. **PROPERTY GUIDELINES:**
   - **Colors**: Use hex format (#RRGGBB) - common colors: #2563eb (blue), #059669 (green), #dc2626 (red), #7c3aed (purple)
   - **Sizes**: fontSize (14-32), padding (8-24), height/width (50-400), borderRadius (0-50)
   - **Text**: Use clear, descriptive text based on the page purpose
   - **Layout**: Start with a main column container, add appropriate spacing

4. **COMMON PAGE PATTERNS:**
   
   **Login Page**: Title, email field (container), password field (container), login button
   **Profile Page**: Avatar (container), name (text), info sections (containers), edit button
   **Settings Page**: Title, setting options (containers with text), toggle buttons
   **Dashboard**: Title, cards/containers for different sections, action buttons
   **List Page**: Title, multiple item containers with text and buttons

5. **ARABIC SUPPORT:**
   - If prompt is in Arabic, use Arabic text in widgets
   - Common Arabic terms: دخول (login), الملف الشخصي (profile), الإعدادات (settings), الرئيسية (home)

6. **ID GENERATION:**
   - Generate unique IDs using pattern: "w_{pageNumber}_{widgetNumber}"
   - Use sequential numbering for consistency

7. **EXAMPLE STRUCTURE:**
   For a login page, create:
   - Main column container with center alignment
   - Title text widget
   - Email input container (placeholder for text field)
   - Password input container (placeholder for text field) 
   - Login button
   - Optional additional elements based on prompt

**OUTPUT REQUIREMENTS:**
- Return only valid JSON matching the schema
- Include complete widget hierarchy with proper nesting
- Use realistic properties and values
- Ensure all required fields are present
- Create functional, well-designed layouts

Generate a complete, functional page structure now:`,
});

// Define the flow
const generatePageFromPromptFlow = ai.defineFlow(
  {
    name: 'generatePageFromPromptFlow',
    inputSchema: GeneratePageFromPromptInputSchema,
    outputSchema: GeneratePageFromPromptOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await generatePagePrompt(input);
      
      if (!output || !output.page) {
        // Fallback to a basic page structure
        const fallbackPage = createFallbackPage(input.pageName, input.prompt);
        return { page: fallbackPage };
      }

      return output;
    } catch (error) {
      console.error('Error generating page with AI:', error);
      // Return fallback page on error
      const fallbackPage = createFallbackPage(input.pageName, input.prompt);
      return { page: fallbackPage };
    }
  }
);

// Fallback page generator for when AI fails
function createFallbackPage(pageName: string, prompt: string) {
  const isArabic = /[\u0600-\u06FF]/.test(prompt);
  const lowerPrompt = prompt.toLowerCase();
  
  // Determine page type
  const isLogin = lowerPrompt.includes('login') || lowerPrompt.includes('دخول') || lowerPrompt.includes('تسجيل');
  const isProfile = lowerPrompt.includes('profile') || lowerPrompt.includes('ملف') || lowerPrompt.includes('شخصي');
  const isSettings = lowerPrompt.includes('settings') || lowerPrompt.includes('إعدادات');
  
  let widgets;
  
  if (isLogin) {
    widgets = [
      {
        id: "w_fallback_1",
        type: "column" as const,
        properties: { padding: 24, alignment: "center" },
        children: [
          {
            id: "w_fallback_2",
            type: "text" as const,
            properties: {
              text: isArabic ? "تسجيل الدخول" : "Login",
              fontSize: 28,
              fontWeight: "bold",
              color: "#2563eb"
            }
          },
          {
            id: "w_fallback_3",
            type: "container" as const,
            properties: {
              height: 50,
              backgroundColor: "#f8fafc",
              borderRadius: 8
            }
          },
          {
            id: "w_fallback_4",
            type: "container" as const,
            properties: {
              height: 50,
              backgroundColor: "#f8fafc",
              borderRadius: 8
            }
          },
          {
            id: "w_fallback_5",
            type: "button" as const,
            properties: {
              text: isArabic ? "دخول" : "Login",
              backgroundColor: "#2563eb",
              textColor: "#ffffff",
              padding: 16
            }
          }
        ]
      }
    ];
  } else if (isProfile) {
    widgets = [
      {
        id: "w_fallback_1",
        type: "column" as const,
        properties: { padding: 20, alignment: "center" },
        children: [
          {
            id: "w_fallback_2",
            type: "container" as const,
            properties: {
              height: 100,
              width: 100,
              backgroundColor: "#e2e8f0",
              borderRadius: 50
            }
          },
          {
            id: "w_fallback_3",
            type: "text" as const,
            properties: {
              text: isArabic ? "الملف الشخصي" : "Profile",
              fontSize: 24,
              fontWeight: "bold",
              color: "#1e293b"
            }
          },
          {
            id: "w_fallback_4",
            type: "button" as const,
            properties: {
              text: isArabic ? "تعديل الملف" : "Edit Profile",
              backgroundColor: "#059669",
              textColor: "#ffffff",
              padding: 12
            }
          }
        ]
      }
    ];
  } else {
    // Generic page
    widgets = [
      {
        id: "w_fallback_1",
        type: "column" as const,
        properties: { padding: 20, alignment: "center" },
        children: [
          {
            id: "w_fallback_2",
            type: "text" as const,
            properties: {
              text: pageName,
              fontSize: 26,
              fontWeight: "bold",
              color: "#2563eb"
            }
          },
          {
            id: "w_fallback_3",
            type: "text" as const,
            properties: {
              text: isArabic ? "تم إنشاء هذه الصفحة بواسطة الذكاء الاصطناعي" : "Page generated by AI",
              fontSize: 16,
              color: "#64748b"
            }
          },
          {
            id: "w_fallback_4",
            type: "button" as const,
            properties: {
              text: isArabic ? "ابدأ الآن" : "Get Started",
              backgroundColor: "#7c3aed",
              textColor: "#ffffff",
              padding: 14
            }
          }
        ]
      }
    ];
  }

  return {
    id: `ai_page_${Date.now()}`,
    name: pageName,
    type: "screen" as const,
    route: `/${pageName.toLowerCase().replace(/\s+/g, '')}`,
    createdAt: new Date().toISOString().split('T')[0],
    widgets
  };
}

// Export the main function
export async function generatePageFromPrompt(input: GeneratePageFromPromptInput): Promise<GeneratePageFromPromptOutput> {
  return generatePageFromPromptFlow(input);
}