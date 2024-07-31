# action-list-prcommit-messages
List commit messages on a pull request 
```
name: List PRs
on: [workflow_dispatch]

jobs:
  list-pr-commit-messages:
    runs-on: ubuntu-latest
    name: List the commit messages
    steps:
      - name: List commit messages
        id: list
        uses: ./ 
        with:
          pr-number: 1 # This should be supplied by the build workflow
          repo-token: ${{ secrets.TEST_ACTION_GH_PAT}}

