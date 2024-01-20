import json
import sys
from datetime import datetime

import github

access_key = sys.argv[-1]

git = github.Github(access_key)

mathsteroids = git.get_repo("mscroggs/mathsteroids")
branch = mathsteroids.get_branch("main")
ref = mathsteroids.get_git_ref("heads/main")
base_tree = mathsteroids.get_git_tree(branch.commit.sha)

vfile1 = mathsteroids.get_contents("VERSION", branch.commit.sha)
version = vfile1.decoded_content.decode("utf8").strip()

for release in mathsteroids.get_releases():
    if release.tag_name == f"v{version}":
        break
else:
    changelog_file = mathsteroids.get_contents("CHANGELOG_SINCE_LAST_VERSION.md", branch.commit.sha)
    changes = changelog_file.decoded_content.decode("utf8").strip()

    if changes == "":
        raise RuntimeError("CHANGELOG_SINCE_LAST_VERSION.md should not be empty")

    mathsteroids.create_git_tag_and_release(
        f"v{version}", f"Version {version}", f"Version {version}", changes,
        branch.commit.sha, "commit")

    old_changelog_file = mathsteroids.get_contents("CHANGELOG.md", branch.commit.sha)
    old_changes = old_changelog_file.decoded_content.decode("utf8").strip()

    new_changelog = (f"# Version {version} ({datetime.now().strftime('%d %B %Y')})\n\n"
                     f"{changes}\n\n{old_changes}\n")

    mathsteroids.update_file(
        "CHANGELOG.md", "Update CHANGELOG.md", new_changelog, sha=old_changelog_file.sha,
        branch="main"
    )
    mathsteroids.update_file(
        "CHANGELOG_SINCE_LAST_VERSION.md", "Reset CHANGELOG_SINCE_LAST_VERSION.md", "",
        sha=changelog_file.sha, branch="main"
    )
