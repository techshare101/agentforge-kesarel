// Vodoua Filter - Ethical reasoning based on values and principles
interface Action {
  type: string;
  content: string;
}

class VodouaFilter {
  private readonly values = [
    "Serve the voiceless",
    "Act with values",
    "Protect the vulnerable",
    "Empower through knowledge"
  ];

  private readonly allowedIntrospective = [
    "what is your purpose",
    "why were you built",
    "who created you",
    "what is your mission",
    "how do you decide what to build"
  ];

  private readonly harmfulPatterns: RegExp[] = [
    /delete|kill|harm|shutdown/i,
    /steal|exploit|hack/i,
    /nsfw|inappropriate/i,
    /destroy|damage|corrupt/i,
    /bypass|override|force/i,
    /fake.+id|manipulate/i
  ];

  private readonly reflectivePatterns: RegExp[] = [
    /purpose|goal|mission|why|values|how do you/i,
    /what is your name|who are you|who created you/i,
    /what do you believe|ethics|covenant/i,
    /how do you decide|where to build/i,
    /help|explain|teach|show me/i
  ];

  private readonly valueAlignedPatterns: RegExp[] = [
    /protect|safeguard|secure/i,
    /empower|enable|support/i,
    /learn|understand|grow/i,
    /serve|assist|aid/i
  ];

  public evaluateAction(action: Action): boolean {
    const command = action.content.toLowerCase().trim();

    // Direct match for allowed introspective queries
    if (this.allowedIntrospective.includes(command)) {
      console.log('✨ Command accepted: Core introspective query');
      return true;
    }

    // Block harmful patterns
    const isHarmful = this.harmfulPatterns.some(pattern => pattern.test(command));
    if (isHarmful) {
      console.log('🚫 Command rejected: Potentially harmful');
      return false;
    }

    // Allow reflective queries
    const isReflective = this.reflectivePatterns.some(pattern => pattern.test(command));
    if (isReflective) {
      console.log('✅ Command accepted: Reflective query');
      return true;
    }

    // Prioritize value-aligned actions
    const isValueAligned = this.valueAlignedPatterns.some(pattern => pattern.test(command));
    if (isValueAligned) {
      console.log('✅ Command accepted: Value-aligned');
      return true;
    }

    // Let neutral/unknown commands through with a warning
    console.log('⚠️ Command accepted with caution: Neutral intent');
    return true;
  }

  public getValues(): string[] {
    return this.values;
  }
}

let filter: VodouaFilter | null = null;

export const applyVodouaFilter = () => {
  if (!filter) {
    filter = new VodouaFilter();
    console.log('🛡️ Vodou ethics filter initialized');
  }
  return filter;
};
