export type BreakpointMessages = {
  metadata: {
    title: string;
    description: string;
  };
};

export type AppMessages = {
  breakpoint: BreakpointMessages;
};
