"use client";

import { ReportFormModal } from "@/components/report/report-form-modal";

interface SwitchbackReportCtaProps {
  buttonLabel: string;
  portalId?: string;
  formId?: string;
  formUrl: string;
  title: string;
}

export function SwitchbackReportCta({
  buttonLabel,
  portalId,
  formId,
  formUrl,
  title,
}: SwitchbackReportCtaProps) {
  return (
    <ReportFormModal
      buttonLabel={buttonLabel}
      portalId={portalId}
      formId={formId}
      formUrl={formUrl}
      title={title}
    />
  );
}
