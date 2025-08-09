"use client";
import GithubIcon from "@@/public/src/img/footer/github.inline.svg";
import { useI18n } from "fumadocs-ui/provider";

export function EditOnGithub({ href }: { href: string }) {
  const { text } = useI18n();
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="pt-2 flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-accent-foreground/80"
    >
      <GithubIcon width="18" height="18" />
      <span>{text?.editOnGithub}</span>
    </a>
  );
}

export function TocLabel() {
  const { text } = useI18n();
  return text?.toc;
}
