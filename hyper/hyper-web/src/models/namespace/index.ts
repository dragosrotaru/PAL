export type NameSpace = {
  name: string;
  children?: NameSpace[];
};

export const NAMESPACE: NameSpace[] = [
  {
    name: "dragos.wild.cards",
    children: [
      {
        name: "ram",
      },
      {
        name: "events",
      },
      {
        name: "inventory",
      },
      {
        name: "people",
        children: [
          {
            name: "viv crowe",
          },
          {
            name: "peggy",
          },
        ],
      },
    ],
  },
  {
    name: "docs.wild.cards",
    children: [
      {
        name: "design",
      },
      {
        name: "users",
      },
    ],
  },
];
