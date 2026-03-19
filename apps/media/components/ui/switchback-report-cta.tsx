"use client";

import { ReportFormModal } from "@/components/report/report-form-modal";

interface SwitchbackReportCtaProps {
  buttonLabel: string;
  portalId: string;
  formId: string;
  title: string;
}

export function SwitchbackReportCta({
  buttonLabel,
  portalId,
  formId,
  title,
}: SwitchbackReportCtaProps) {
  return (
    <ReportFormModal
      buttonLabel={buttonLabel}
      portalId={portalId}
      formId={formId}
      title={title}
    />
  );
}
