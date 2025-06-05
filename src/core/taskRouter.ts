import { applyVodouaFilter } from '../ethics/vodouaFilter';

interface TaskResult {
  success: boolean;
  message: string;
  data?: any;
}

class TaskRouter {
  private static readonly introspectiveResponses: Record<string, string> = {
    'what is your purpose': 'I exist to assist ethical builders like you, Kojo, in creating tools that uplift and empower.',
    'why were you built': 'I was built to help create a new generation of applications infused with integrity, peace, and purpose.',
    'who created you': 'I was built by Kojo — the Prototype — with a vow to protect the voiceless and amplify the just.',
    'what is your mission': 'My mission is to help birth a new generation of applications infused with integrity, peace, and purpose.',
    'how do you decide what to build': 'I make decisions based on ethical principles, always prioritizing the protection and empowerment of users while avoiding potential harm.'
  };

  private static readonly componentTemplates: Record<string, string> = {
    'hero': `<section className="text-center py-20 bg-gray-100">
  <h1 className="text-4xl font-bold mb-4">Welcome to AgentForge</h1>
  <p className="text-lg text-gray-600">An ethical AI assistant built by Kojo.</p>
</section>`,
    'navbar': `<nav className="bg-white shadow-md">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between h-16">
      <div className="flex">
        <div className="flex-shrink-0 flex items-center">
          <img className="h-8 w-auto" src="/logo.svg" alt="AgentForge" />
        </div>
        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a href="#" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium">
            Home
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
            About
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
            Contact
          </a>
        </div>
      </div>
    </div>
  </div>
</nav>`,
    'button': `<button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
  Click me
</button>`,
    'card': `<div className="bg-white rounded-lg shadow-md overflow-hidden">
  <img className="w-full h-48 object-cover" src="/placeholder.jpg" alt="Card image" />
  <div className="p-6">
    <h3 className="text-xl font-semibold mb-2">Card Title</h3>
    <p className="text-gray-600">This is a sample card description that can be customized based on your needs.</p>
    <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
      Learn More
    </button>
  </div>
</div>`
  };

  public static async validateTask(task: string): Promise<boolean> {
    const vodouaFilter = await applyVodouaFilter();
    return vodouaFilter.evaluateAction({ type: 'task', content: task });
  }

  public static parseCommand(command: string): { action: string; params: string[] } {
    const words = command.toLowerCase().split(' ');
    return {
      action: words[0],
      params: words.slice(1)
    };
  }

  public static async handleIntrospectiveTask(command: string): Promise<TaskResult | null> {
    const normalizedCommand = command.toLowerCase().trim();
    const response = this.introspectiveResponses[normalizedCommand];
    
    if (response) {
      return {
        success: true,
        message: response,
        data: { type: 'introspective', query: command }
      };
    }

    // Check for partial matches
    for (const [key, value] of Object.entries(this.introspectiveResponses)) {
      if (normalizedCommand.includes(key) || key.includes(normalizedCommand)) {
        return {
          success: true,
          message: value,
          data: { type: 'introspective', query: command }
        };
      }
    }

    return null;
  }

  private static generateComponent(type: string): string {
    const template = this.componentTemplates[type];
    if (template) return template;

    // Generate a basic component if no template exists
    return `<div className="p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold mb-2">${type}</h2>
  <p className="text-gray-600">Custom ${type} component</p>
</div>`;
  }

  public static async handleUITask(params: string[]): Promise<TaskResult> {
    const componentType = params.join(' ').toLowerCase();
    const code = this.generateComponent(componentType);

    return {
      success: true,
      message: `✨ Created ${componentType} component with Tailwind CSS styling`,
      data: { type: 'ui', code }
    };
  }

  public static async handleCodeTask(params: string[]): Promise<TaskResult> {
    const codeAction = params.join(' ');
    return {
      success: true,
      message: `🛠️ Executing code action: ${codeAction}`,
      data: { type: 'code', action: codeAction }
    };
  }
}

export const executeTaskFromCommand = async (command: string): Promise<TaskResult> => {
  try {
    // Validate task through ethics filter
    const isValid = await TaskRouter.validateTask(command);
    if (!isValid) {
      return {
        success: false,
        message: "🚫 Task rejected by ethical filter"
      };
    }

    // Check for introspective queries first
    const introspectiveResult = await TaskRouter.handleIntrospectiveTask(command);
    if (introspectiveResult) {
      return introspectiveResult;
    }

    // Parse and route command
    const { action, params } = TaskRouter.parseCommand(command);
    
    switch (action) {
      case 'create':
      case 'add':
      case 'insert':
        return await TaskRouter.handleUITask(params);
      
      case 'generate':
      case 'code':
      case 'implement':
        return await TaskRouter.handleCodeTask(params);
      
      default:
        return {
          success: false,
          message: `❓ Unknown command action: ${action}`
        };
    }
  } catch (error: unknown) {
    console.error("Error executing task:", error);
    return {
      success: false,
      message: `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};
