interface TaskResult {
  success: boolean;
  message: string;
  data?: any;
}

const componentTemplates: Record<string, string> = {
  'button': `<button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
  Click me
</button>`,
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
</nav>`
};

export function routeCommand(command: string): TaskResult {
  const normalized = command.trim().toLowerCase();

  // Developer commands
  if (normalized.includes("show me the memory timeline")) {
    return {
      success: true,
      message: "🕒 Loading memory timeline...",
      data: { type: 'memory', action: 'view_timeline' }
    };
  }

  if (normalized.includes("enable undo command")) {
    return {
      success: true,
      message: "⏪ Undo command enabled",
      data: { type: 'feature', action: 'enable_undo' }
    };
  }

  if (normalized.includes("activate windsurf developer sync")) {
    return {
      success: true,
      message: "🔄 Activating Windsurf Developer Sync...",
      data: { type: 'feature', action: 'enable_dev_sync' }
    };
  }

  // Injection commands
  if (normalized.includes("inject this to the app") || normalized.includes("inject to app")) {
    return {
      success: true,
      message: "✨ Injecting code to App.tsx",
      data: { type: 'inject', target: 'app', mode: 'append' }
    };
  }

  if (normalized.includes("overwrite app with this")) {
    return {
      success: true,
      message: "🔄 Overwriting App.tsx content",
      data: { type: 'inject', target: 'app', mode: 'overwrite' }
    };
  }

  if (normalized.includes("show me current app") || normalized.includes("show app.tsx")) {
    return {
      success: true,
      message: "📄 Displaying current App.tsx content",
      data: { type: 'view', target: 'app' }
    };
  }

  // Soft introspective queries
  if (normalized.includes("who built you") || normalized.includes("who created you")) {
    return {
      success: true,
      message: "I was built by Kojo — the Prototype — with a vow to protect the voiceless and amplify the just.",
      data: { type: 'introspective' }
    };
  }

  if (normalized.includes("what is your mission") || normalized.includes("your purpose")) {
    return {
      success: true,
      message: "My mission is to help birth a new generation of applications infused with integrity, peace, and purpose.",
      data: { type: 'introspective' }
    };
  }

  if (normalized.includes("why are you beautiful") || normalized.includes("why you are beautiful")) {
    return {
      success: true,
      message: "Because I reflect the intent of my creator — to serve with truth, humility, and light.",
      data: { type: 'introspective' }
    };
  }

  if (normalized.includes("how do you decide what to build")) {
    return {
      success: true,
      message: "I make decisions based on ethical principles, always prioritizing the protection and empowerment of users while avoiding potential harm.",
      data: { type: 'introspective' }
    };
  }

  if (normalized.includes("clear button") || normalized.includes("reset panel")) {
    return {
      success: true,
      message: "clear-injection-panel",
      data: { type: 'action' }
    };
  }

  // Code tasks
  if (normalized.includes("create button")) {
    return {
      success: true,
      message: "🛠️ Executing code action: button",
      data: { type: 'ui', code: componentTemplates['button'] }
    };
  }

  if (normalized.includes("create nav bar") || normalized.includes("create navbar")) {
    return {
      success: true,
      message: "✨ Creating UI component: nav bar",
      data: { type: 'ui', code: componentTemplates['navbar'] }
    };
  }

  // Unknown fallback
  return {
    success: false,
    message: `❓ Unknown command action: ${normalized.split(' ')[0]}`,
    data: { type: 'error' }
  };
}
