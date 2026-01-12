#!/bin/bash
# Ralph Wiggum: Single Iteration (Human-in-the-Loop)
#
# Runs exactly ONE iteration of the Ralph loop, then stops.
# Useful for testing your task definition before going AFK.
#
# Usage:
#   ./ralph-once.sh                    # Run single iteration
#   ./ralph-once.sh /path/to/project   # Run in specific project
#   ./ralph-once.sh -m gpt-5.2-high    # Use specific model
#
# After running:
#   - Review the changes made
#   - Check git log for commits
#   - If satisfied, run ralph-setup.sh or ralph-loop.sh for full loop
#
# Requirements:
#   - RALPH_TASK.md in the project root
#   - Git repository
#   - cursor-agent CLI installed

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source common functions
source "$SCRIPT_DIR/ralph-common.sh"

# =============================================================================
# FLAG PARSING
# =============================================================================

show_help() {
  cat << 'EOF'
Ralph Wiggum: Single Iteration (Human-in-the-Loop)

Runs exactly ONE iteration, then stops for review.
This is the recommended way to test your task definition.

Usage:
  ./ralph-once.sh [options] [workspace]

Options:
  -m, --model MODEL      Model to use (default: opus-4.5-thinking)
  -h, --help             Show this help

Examples:
  ./ralph-once.sh                        # Run one iteration
  ./ralph-once.sh -m sonnet-4.5-thinking # Use Sonnet model
  
After reviewing the results:
  - If satisfied: run ./ralph-setup.sh for full loop
  - If issues: fix them, update RALPH_TASK.md or guardrails, run again
EOF
}

# Parse command line arguments
WORKSPACE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    -m|--model)
      MODEL="$2"
      shift 2
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    -*)
      echo "Unknown option: $1"
      echo "Use -h for help."
      exit 1
      ;;
    *)
      # Positional argument = workspace
      WORKSPACE="$1"
      shift
      ;;
  esac
done

# =============================================================================
# MAIN
# =============================================================================

main() {
  # Resolve workspace
  if [[ -z "$WORKSPACE" ]]; then
    WORKSPACE="$(pwd)"
  elif [[ "$WORKSPACE" == "." ]]; then
    WORKSPACE="$(pwd)"
  else
    WORKSPACE="$(cd "$WORKSPACE" && pwd)"
  fi
  
  local task_file="$WORKSPACE/RALPH_TASK.md"
  
  # Show banner
  echo "═══════════════════════════════════════════════════════════════════"
  echo "🐛 Ralph Wiggum: Single Iteration (Human-in-the-Loop)"
  echo "═══════════════════════════════════════════════════════════════════"
  echo ""
  echo "  This runs ONE iteration, then stops for your review."
  echo "  Use this to test your task before going AFK."
  echo ""
  echo "═══════════════════════════════════════════════════════════════════"
  echo ""
  
  # Check prerequisites
  if ! check_prerequisites "$WORKSPACE"; then
    exit 1
  fi
  
  # Initialize .ralph directory
  init_ralph_dir "$WORKSPACE"
  
  echo "Workspace: $WORKSPACE"
  echo "Model:     $MODEL"
  echo ""
  
  # Show task summary
  echo "📋 Task Summary:"
  echo "─────────────────────────────────────────────────────────────────"
  head -30 "$task_file"
  echo "─────────────────────────────────────────────────────────────────"
  echo ""
  
  # Count criteria
  local total_criteria done_criteria remaining
  # Only count actual checkbox list items (- [ ], * [x], 1. [ ], etc.)
  total_criteria=$(grep -cE '^[[:space:]]*([-*]|[0-9]+\.)[[:space:]]+\[(x| )\]' "$task_file" 2>/dev/null) || total_criteria=0
  done_criteria=$(grep -cE '^[[:space:]]*([-*]|[0-9]+\.)[[:space:]]+\[x\]' "$task_file" 2>/dev/null) || done_criteria=0
  remaining=$((total_criteria - done_criteria))
  
  echo "Progress: $done_criteria / $total_criteria criteria complete ($remaining remaining)"
  echo ""
  
  if [[ "$remaining" -eq 0 ]] && [[ "$total_criteria" -gt 0 ]]; then
    echo "🎉 Task already complete! All criteria are checked."
    exit 0
  fi
  
  # Confirm
  read -p "Run single iteration? [Y/n] " -n 1 -r
  echo ""
  
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "Aborted."
    exit 0
  fi
  
  # Commit any uncommitted work first
  cd "$WORKSPACE"
  if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
    echo "📦 Committing uncommitted changes..."
    git add -A
    git commit -m "ralph: checkpoint before single iteration" || true
  fi
  
  echo ""
  echo "🚀 Running single iteration..."
  echo ""
  
  # Run exactly one iteration
  local signal
  signal=$(run_iteration "$WORKSPACE" "1" "" "$SCRIPT_DIR")
  
  # Check result
  local task_status
  task_status=$(check_task_complete "$WORKSPACE")
  
  echo ""
  echo "═══════════════════════════════════════════════════════════════════"
  echo "📋 Single Iteration Complete"
  echo "═══════════════════════════════════════════════════════════════════"
  echo ""
  
  case "$signal" in
    "COMPLETE")
      if [[ "$task_status" == "COMPLETE" ]]; then
        echo "🎉 Task completed in single iteration!"
        echo ""
        echo "All criteria are checked. You're done!"
      else
        echo "⚠️  Agent signaled complete but some criteria remain unchecked."
        echo "   Review the results and run again if needed."
      fi
      ;;
    "GUTTER")
      echo "🚨 Gutter detected - agent got stuck."
      echo ""
      echo "Review .ralph/errors.log and consider:"
      echo "  1. Adding a guardrail to .ralph/guardrails.md"
      echo "  2. Simplifying the task"
      echo "  3. Fixing the blocking issue manually"
      ;;
    "ROTATE")
      echo "🔄 Context rotation was triggered."
      echo ""
      echo "The agent used a lot of context. This is normal for complex tasks."
      echo "Review the progress and run again or proceed to full loop."
      ;;
    *)
      if [[ "$task_status" == "COMPLETE" ]]; then
        echo "🎉 Task completed in single iteration!"
      else
        local remaining_count=${task_status#INCOMPLETE:}
        echo "Agent finished with $remaining_count criteria remaining."
      fi
      ;;
  esac
  
  echo ""
  echo "Review the changes:"
  echo "  • git log --oneline -5     # See recent commits"
  echo "  • git diff HEAD~1          # See changes"
  echo "  • cat .ralph/progress.md   # See progress log"
  echo ""
  echo "Next steps:"
  echo "  • If satisfied: ./ralph-setup.sh  # Run full loop"
  echo "  • If issues: fix, update task/guardrails, ./ralph-once.sh again"
  echo ""
}

main
