---
date: 2026-02-28
tags: [claude-code, hooks, agent, orchestration, ioc, system-control, lifecycle]
summary: Complete reference list of Claude Code hook event types — from SessionStart through SessionEnd, including PreToolUse, PostToolUse, SubagentStart/Stop, PreCompact, and worktree lifecycle events. Hooks are the inversion-of-control mechanism for the agent loop: the environment intercepts and can block significant agent lifecycle events rather than the agent driving everything itself. This is the structural primitive that separates "environment in control" from "agent in control" — a core distinction in the first-principles agent guidance taxonomy. Directly relevant to building observability pipelines, policy enforcement, and orchestration infrastructure in swm.
---

# Claude Hooks

SessionStart When a session begins or resumes
UserPromptSubmit When you submit a prompt, before Claude processes it
PreToolUse Before a tool call executes. Can block it
PermissionRequest When a permission dialog appears
PostToolUse After a tool call succeeds
PostToolUseFailure After a tool call fails
Notification When Claude Code sends a notification
SubagentStart When a subagent is spawned
SubagentStop When a subagent finishes
Stop When Claude finishes responding
TeammateIdle When an agent team teammate is about to go idle
TaskCompleted When a task is being marked as completed
ConfigChange When a configuration file changes during a session
WorktreeCreate When a worktree is being created via --worktree or isolation: "worktree". Replaces default git behavior
WorktreeRemove When a worktree is being removed, either at session exit or when a subagent finishes
PreCompact Before context compaction
SessionEnd When a session terminates