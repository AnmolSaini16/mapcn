export const mapInstallCommand = "npx shadcn@latest add @mapcn/map";

export const skillInstallCommand = "npx skills add AnmolSaini16/mapcn";

// Raw skill folder, for agents that can't install skills.
export const skillRawUrl =
  "https://raw.githubusercontent.com/AnmolSaini16/mapcn/main/skills/mapcn";

// -y skips the CLI's prompts, which an agent's shell can't answer.
const skillInstallAgentCommand = `${skillInstallCommand} -y`;

export const mapInstallAgentPrompt = `Install the mapcn agent skill with ${skillInstallAgentCommand} and read its SKILL.md. If you can't install skills, read ${skillRawUrl}/SKILL.md instead, and fetch the files it references from that same folder. Then install mapcn in this project with ${mapInstallCommand} and add a basic map example, following the skill's rules. When you're done, offer to look through the project and suggest where other maps or blocks would fit, but don't build them unless I ask.`;
