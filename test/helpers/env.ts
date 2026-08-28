const CHILD_CONTEXT_ENV_VARS = [
  "PI_DENY_TOOLS",
  "PI_SUBAGENT_NAME",
  "PI_SUBAGENT_AGENT",
  "PI_SUBAGENT_AUTO_EXIT",
  "PI_SUBAGENT_SESSION",
  "PI_SUBAGENT_ID",
  "PI_SUBAGENT_ACTIVITY_FILE",
  "PI_SUBAGENT_SURFACE",
] as const;

/** Remove child-only state inherited when the test runner itself is a subagent. */
export function sanitizeSubagentEnv(): void {
  for (const name of CHILD_CONTEXT_ENV_VARS) {
    delete process.env[name];
  }
}

/** Temporarily set one environment variable and restore it after the callback. */
export async function withEnvVar<T>(
  name: string,
  value: string | undefined,
  run: () => T | Promise<T>,
): Promise<T> {
  const previous = process.env[name];
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;

  try {
    return await run();
  } finally {
    if (previous === undefined) delete process.env[name];
    else process.env[name] = previous;
  }
}
