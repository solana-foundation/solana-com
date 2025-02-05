export type AnchorCounter = {
  version: "0.1.0";
  name: "anchor_counter";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "counter";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "counter";
              },
            ];
          };
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [];
    },
    {
      name: "increment";
      accounts: [
        {
          name: "counter";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "counter";
              },
            ];
          };
        },
        {
          name: "user";
          isMut: false;
          isSigner: true;
        },
      ];
      args: [];
    },
    {
      name: "decrement";
      accounts: [
        {
          name: "counter";
          isMut: true;
          isSigner: false;
          pda: {
            seeds: [
              {
                kind: "const";
                type: "string";
                value: "counter";
              },
            ];
          };
        },
        {
          name: "user";
          isMut: false;
          isSigner: true;
        },
      ];
      args: [];
    },
  ];
  accounts: [
    {
      name: "counter";
      type: {
        kind: "struct";
        fields: [
          {
            name: "count";
            type: "u64";
          },
        ];
      };
    },
  ];
};

export const IDL: AnchorCounter = {
  version: "0.1.0",
  name: "anchor_counter",
  instructions: [
    {
      name: "initialize",
      accounts: [
        {
          name: "counter",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "counter",
              },
            ],
          },
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "increment",
      accounts: [
        {
          name: "counter",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "counter",
              },
            ],
          },
        },
        {
          name: "user",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
    {
      name: "decrement",
      accounts: [
        {
          name: "counter",
          isMut: true,
          isSigner: false,
          pda: {
            seeds: [
              {
                kind: "const",
                type: "string",
                value: "counter",
              },
            ],
          },
        },
        {
          name: "user",
          isMut: false,
          isSigner: true,
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "counter",
      type: {
        kind: "struct",
        fields: [
          {
            name: "count",
            type: "u64",
          },
        ],
      },
    },
  ],
};
