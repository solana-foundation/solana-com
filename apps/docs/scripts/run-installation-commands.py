#!/usr/bin/env python3

"""Extract and run Ubuntu-compatible commands from installation guide MDX."""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path


TERMINAL_FENCE = re.compile(r"^```terminal(?:\s.*)?$")
FENCE = re.compile(r"^```")
TAG = re.compile(r"<(/?)(Accordion|Tab)\b([^>]*)>")
ATTRIBUTE = re.compile(r'\b(?:title|value)="([^"]+)"')
PROMPT = re.compile(r"^\s*\$ (.*)$")


@dataclass(frozen=True)
class Command:
    line: int
    text: str


def is_ubuntu_incompatible(tag: str, label: str) -> bool:
    normalized = label.strip().casefold()
    if tag == "Accordion":
        return normalized == "windows"
    return normalized in {".rpm", "mac", "windows"}


def commands_from_block(path: Path, start_line: int, lines: list[str]) -> list[Command]:
    commands: list[Command] = []
    command_line: int | None = None
    command_lines: list[str] = []

    for offset, line in enumerate(lines):
        prompt = PROMPT.match(line)
        if prompt:
            if command_line is not None:
                commands.append(Command(command_line, "\n".join(command_lines)))
            command_line = start_line + offset
            command_lines = [prompt.group(1)]
        elif command_line is not None:
            command_lines.append(line)
        elif line.strip():
            raise ValueError(
                f"{path}:{start_line + offset}: terminal content must start with '$ '"
            )

    if command_line is not None:
        commands.append(Command(command_line, "\n".join(command_lines).rstrip()))
    if not commands:
        raise ValueError(f"{path}:{start_line}: terminal block contains no commands")
    return commands


def extract_commands(path: Path) -> list[Command]:
    lines = path.read_text(encoding="utf-8").splitlines()
    contexts: list[tuple[str, bool]] = []
    commands: list[Command] = []
    block: list[str] | None = None
    block_line = 0
    fence_line = 0
    in_fence = False

    for line_number, line in enumerate(lines, start=1):
        if in_fence:
            if line == "```":
                if block is not None:
                    commands.extend(commands_from_block(path, block_line, block))
                block = None
                in_fence = False
            elif block is not None:
                block.append(line)
            continue

        if FENCE.match(line):
            in_fence = True
            fence_line = line_number
            if TERMINAL_FENCE.match(line) and not any(
                excluded for _, excluded in contexts
            ):
                block = []
                block_line = line_number + 1
            continue

        for match in TAG.finditer(line):
            closing, tag, attributes = match.groups()
            if closing:
                for index in range(len(contexts) - 1, -1, -1):
                    if contexts[index][0] == tag:
                        contexts.pop(index)
                        break
                continue

            label_match = ATTRIBUTE.search(attributes)
            label = label_match.group(1) if label_match else ""
            contexts.append((tag, is_ubuntu_incompatible(tag, label)))

    if in_fence:
        raise ValueError(f"{path}:{fence_line}: unclosed code fence")
    if not commands:
        raise ValueError(f"{path}: no Ubuntu-compatible terminal commands found")
    return commands


def annotation_value(value: str) -> str:
    return value.replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")


def execute(path: Path, commands: list[Command], timeout: int) -> None:
    for index, command in enumerate(commands, start=1):
        # A shared docs block shows mutually exclusive Bash and Zsh commands.
        if re.search(r"#\s*If using Zsh\s*$", command.text, re.IGNORECASE):
            continue

        title = f"Command {index}/{len(commands)} from {path}:{command.line}"
        print(f"::group::{title}", flush=True)
        print(f"$ {command.text}", flush=True)
        try:
            result = subprocess.run(
                ["bash", "-ic", f"set -o pipefail\n{command.text}"],
                cwd=Path.cwd(),
                timeout=timeout,
                check=False,
            )
        except subprocess.TimeoutExpired:
            print("::endgroup::", flush=True)
            message = f"Command timed out after {timeout} seconds: {command.text}"
            print(
                f"::error file={path},line={command.line}::{annotation_value(message)}"
            )
            raise SystemExit(124) from None

        print("::endgroup::", flush=True)
        if result.returncode:
            message = f"Command failed with exit code {result.returncode}: {command.text}"
            print(
                f"::error file={path},line={command.line}::{annotation_value(message)}"
            )
            raise SystemExit(result.returncode)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("page", type=Path, help="MDX page to extract commands from")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--execute", action="store_true", help="run extracted commands")
    mode.add_argument(
        "--dry-run", action="store_true", help="print extracted commands without running"
    )
    parser.add_argument(
        "--timeout",
        type=int,
        default=1800,
        help="timeout for each command in seconds (default: 1800)",
    )
    args = parser.parse_args()

    try:
        commands = extract_commands(args.page)
    except (OSError, ValueError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 2

    print(f"Extracted {len(commands)} commands from {args.page}", flush=True)
    if args.execute:
        execute(args.page, commands, args.timeout)
    else:
        for command in commands:
            print(f"{args.page}:{command.line}: $ {command.text}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
