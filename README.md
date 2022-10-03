# Inline GitHub Action

[dummy change]

Shows how to use inline Python or e.g. JavaScript code in GitHub actions.

Here, the example task is to derive a Docker tag from GitHub branch name,
supporting forks, internal pull requests and pushes.

The Docker tag is a slug from the PR source branch according to Docker rules.

TL;DR / the secret sauce:

```yaml
- name: Compute Docker tag using Python
  id: python
  run: |
    cat << EOF | python -
    import json, re, os
    event = json.load(open(os.getenv("GITHUB_EVENT_PATH")))
    tag = ...
    print(f"::set-output name=tag::{ tag }")
    EOF
```
