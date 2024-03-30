interface ListPageProps {
  [pathName: string]: MatchingRule;
}

interface ListPageWithSameRulesProps {
  alias: string[];
  matchingRule: MatchingRule;
}

type MatchingRule =
  | {
      operator: 'AND';
      rules: Rule[];
    }
  | {
      operator: 'OR';
      rules: Rule;
    };

interface Rule {
  group_id: number[];
  position_job: number[];
  username?: string[];
}

export const ListPageWithSameRules: ListPageWithSameRulesProps[] = [
  {
    alias: [],
    matchingRule: {
      rules: [],
      operator: 'AND',
    },
  },
];

export const ListPage: ListPageProps = {
  '/commitment-service': {
    rules: [
      {
        group_id: [],
        position_job: [],
      },
    ],
    operator: 'AND',
  },
};
