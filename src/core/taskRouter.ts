interface TaskResult {
  success: boolean;
  message: string;
  data?: {
    type?: string;
    code?: string;
    action?: string;
    status?: string;
    target?: string;
  };
}

interface ComponentTemplate {
  name: string;
  code: string;
  description: string;
}

const componentTemplates: Record<string, ComponentTemplate> = {
  button: {
    name: 'Button',
    code: `<button 
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
  onClick={() => console.log('Button clicked!')}
>
  Click Me
</button>`,
    description: 'A styled button component with hover effects'
  },
  navbar: {
    name: 'Navbar',
    code: `<nav className="bg-gray-800 p-4">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    <div className="text-white font-bold text-xl">Logo</div>
    <div className="flex space-x-4">
      <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">Home</a>
      <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">About</a>
      <a href="#" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">Contact</a>
    </div>
  </div>
</nav>`,
    description: 'A responsive navigation bar with links'
  },
  card: {
    name: 'Card',
    code: `<div className="bg-white rounded-lg shadow-md overflow-hidden">
  <img 
    src="https://via.placeholder.com/400x200" 
    alt="Card image" 
    className="w-full h-48 object-cover"
  />
  <div className="p-4">
    <h3 className="text-xl font-semibold mb-2">Card Title</h3>
    <p className="text-gray-600">This is a sample card description. Replace this content.</p>
    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Learn More
    </button>
  </div>
</div>`,
    description: 'A card component with image, title, description and button'
  },
  form: {
    name: 'Form',
    code: `<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
  <div>
    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
    <input
      type="email"
      id="email"
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
      placeholder="you@example.com"
    />
  </div>
  <div>
    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
    <input
      type="password"
      id="password"
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
    />
  </div>
  <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Submit
  </button>
</form>`,
    description: 'A form component with email and password fields'
  }
};

export function routeCommand(command: string): TaskResult {
  const normalized = command.trim().toLowerCase();

  // Create component command
  if (normalized.startsWith('create ')) {
    const item = normalized.replace('create ', '').replace('a ', '').trim();
    
    // Find matching component
    const template = componentTemplates[item];
    if (!template) {
      const availableComponents = Object.keys(componentTemplates).join(', ');
      return {
        success: false,
        message: `🧱 I don't know how to create a "${item}" yet. Available components: ${availableComponents}`
      };
    }

    return {
      success: true,
      message: `✨ Created ${template.name} component: ${template.description}`,
      data: {
        type: 'code',
        code: template.code,
        target: 'App.tsx'
      }
    };
  }

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
      message: "💉 Injecting code to App.tsx",
      data: {
        type: 'code',
        action: 'append',
        target: 'App.tsx'
      }
    };
  }

  if (normalized.includes("overwrite app with this")) {
    return {
      success: true,
      message: "🔄 Overwriting App.tsx",
      data: {
        type: 'code',
        action: 'overwrite',
        target: 'App.tsx'
      }
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
