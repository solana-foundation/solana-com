import * as fs from "fs";
import * as path from "path";
import type { ContentDifference } from "./extract-content";

/**
 * Report generation utilities for migration comparison tests.
 */

export interface PageResult {
  route: string;
  name: string;
  category: string;
  status: "pass" | "fail" | "error";
  contentDifferences: ContentDifference[];
  accessibilityIssues: string[];
  brokenLinks: string[];
  visualDiffPercentage?: number;
  errorMessage?: string;
  screenshotPaths?: {
    production?: string;
    local?: string;
    diff?: string;
  };
}

export interface ReportSummary {
  totalPages: number;
  passed: number;
  failed: number;
  errors: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
}

export interface MigrationReport {
  generatedAt: string;
  summary: ReportSummary;
  results: PageResult[];
}

/**
 * Generate a markdown report from test results.
 */
export function generateMarkdownReport(report: MigrationReport): string {
  const lines: string[] = [];

  lines.push("# Migration Discrepancy Report");
  lines.push("");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push("");

  // Summary section
  lines.push("## Summary");
  lines.push("");
  lines.push(`- **Pages Tested:** ${report.summary.totalPages}`);
  lines.push(`- **Passed:** ${report.summary.passed}`);
  lines.push(`- **Failed:** ${report.summary.failed}`);
  lines.push(`- **Errors:** ${report.summary.errors}`);
  lines.push(`- **Critical Issues:** ${report.summary.criticalIssues}`);
  lines.push(`- **Major Issues:** ${report.summary.majorIssues}`);
  lines.push(`- **Minor Issues:** ${report.summary.minorIssues}`);
  lines.push("");

  // Critical Issues section
  const criticalIssues = report.results.flatMap((r) =>
    r.contentDifferences
      .filter((d) => d.severity === "critical")
      .map((d) => ({ route: r.route, ...d })),
  );

  if (criticalIssues.length > 0) {
    lines.push("## Critical Issues (Must Fix)");
    lines.push("");
    criticalIssues.forEach((issue, index) => {
      lines.push(
        `${index + 1}. \`${issue.route}\` - ${issue.field}: Expected "${issue.expected}", got "${issue.actual}"`,
      );
    });
    lines.push("");
  }

  // Major Issues section
  const majorIssues = report.results.flatMap((r) =>
    r.contentDifferences
      .filter((d) => d.severity === "major")
      .map((d) => ({ route: r.route, ...d })),
  );

  if (majorIssues.length > 0) {
    lines.push("## Major Issues (Should Fix)");
    lines.push("");
    majorIssues.forEach((issue, index) => {
      lines.push(
        `${index + 1}. \`${issue.route}\` - ${issue.field}: Expected "${issue.expected}", got "${issue.actual}"`,
      );
    });
    lines.push("");
  }

  // Minor Issues section
  const minorIssues = report.results.flatMap((r) =>
    r.contentDifferences
      .filter((d) => d.severity === "minor")
      .map((d) => ({ route: r.route, ...d })),
  );

  if (minorIssues.length > 0) {
    lines.push("## Minor Issues (Nice to Fix)");
    lines.push("");
    minorIssues.forEach((issue, index) => {
      lines.push(
        `${index + 1}. \`${issue.route}\` - ${issue.field}: Expected "${issue.expected}", got "${issue.actual}"`,
      );
    });
    lines.push("");
  }

  // Broken Links section
  const brokenLinkPages = report.results.filter(
    (r) => r.brokenLinks.length > 0,
  );

  if (brokenLinkPages.length > 0) {
    lines.push("## Broken Links");
    lines.push("");
    brokenLinkPages.forEach((page) => {
      lines.push(`### \`${page.route}\``);
      page.brokenLinks.forEach((link) => {
        lines.push(`- ${link}`);
      });
      lines.push("");
    });
  }

  // Accessibility Issues section
  const a11yIssuePages = report.results.filter(
    (r) => r.accessibilityIssues.length > 0,
  );

  if (a11yIssuePages.length > 0) {
    lines.push("## Accessibility Issues");
    lines.push("");
    a11yIssuePages.forEach((page) => {
      lines.push(`### \`${page.route}\``);
      page.accessibilityIssues.forEach((issue) => {
        lines.push(`- ${issue}`);
      });
      lines.push("");
    });
  }

  // Detailed Results by Page
  lines.push("## Detailed Results by Page");
  lines.push("");

  // Group by category
  const categories = ["solutions", "developers", "other"];

  categories.forEach((category) => {
    const categoryResults = report.results.filter(
      (r) => r.category === category,
    );
    if (categoryResults.length === 0) return;

    lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    lines.push("");

    categoryResults.forEach((result) => {
      const statusEmoji =
        result.status === "pass"
          ? "PASS"
          : result.status === "fail"
            ? "FAIL"
            : "ERROR";

      lines.push(`#### \`${result.route}\``);
      lines.push("");
      lines.push(`**${result.name}**`);
      lines.push(`**Status:** ${statusEmoji}`);
      lines.push("");

      if (result.errorMessage) {
        lines.push(`**Error:** ${result.errorMessage}`);
        lines.push("");
      }

      if (result.contentDifferences.length > 0) {
        lines.push("| Issue | Expected | Actual | Severity |");
        lines.push("|-------|----------|--------|----------|");
        result.contentDifferences.forEach((diff) => {
          const expected = String(diff.expected).substring(0, 50);
          const actual = String(diff.actual).substring(0, 50);
          lines.push(
            `| ${diff.field} | ${expected} | ${actual} | ${diff.severity} |`,
          );
        });
        lines.push("");
      }

      if (result.visualDiffPercentage !== undefined) {
        lines.push(
          `**Visual Diff:** ${result.visualDiffPercentage.toFixed(2)}%`,
        );
        lines.push("");
      }

      if (result.accessibilityIssues.length > 0) {
        lines.push("**Accessibility Issues:**");
        result.accessibilityIssues.forEach((issue) => {
          lines.push(`- ${issue}`);
        });
        lines.push("");
      }

      if (result.brokenLinks.length > 0) {
        lines.push("**Broken Links:**");
        result.brokenLinks.forEach((link) => {
          lines.push(`- ${link}`);
        });
        lines.push("");
      }

      lines.push("---");
      lines.push("");
    });
  });

  return lines.join("\n");
}

/**
 * Calculate report summary from results.
 */
export function calculateSummary(results: PageResult[]): ReportSummary {
  const summary: ReportSummary = {
    totalPages: results.length,
    passed: results.filter((r) => r.status === "pass").length,
    failed: results.filter((r) => r.status === "fail").length,
    errors: results.filter((r) => r.status === "error").length,
    criticalIssues: 0,
    majorIssues: 0,
    minorIssues: 0,
  };

  results.forEach((result) => {
    result.contentDifferences.forEach((diff) => {
      switch (diff.severity) {
        case "critical":
          summary.criticalIssues++;
          break;
        case "major":
          summary.majorIssues++;
          break;
        case "minor":
          summary.minorIssues++;
          break;
      }
    });
  });

  return summary;
}

/**
 * Save the report to a file.
 */
export function saveReport(report: MigrationReport, outputPath: string): void {
  const markdown = generateMarkdownReport(report);
  const dir = path.dirname(outputPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, markdown, "utf-8");
}

/**
 * Load existing results from JSON file if it exists.
 */
export function loadExistingResults(jsonPath: string): PageResult[] {
  if (fs.existsSync(jsonPath)) {
    const content = fs.readFileSync(jsonPath, "utf-8");
    return JSON.parse(content) as PageResult[];
  }
  return [];
}

/**
 * Save results to JSON file for incremental updates.
 */
export function saveResultsJson(results: PageResult[], jsonPath: string): void {
  const dir = path.dirname(jsonPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2), "utf-8");
}

/**
 * Create the full migration report.
 */
export function createMigrationReport(results: PageResult[]): MigrationReport {
  return {
    generatedAt: new Date().toISOString(),
    summary: calculateSummary(results),
    results,
  };
}
