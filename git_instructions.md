# Github and Git Workflow
The purpose of this document is to describe our workflow for the eDrops website. We use `git` for version control and Github for hosting the remote version of our respository.

## Workflow and Guidelines
Before starting to code, plan out what you are going to do. It may be tempting to immediately start coding, but for more involved tasks, the amount of required changes can quickly grow to an unmanageable amount. It is better to write down: (1) what you hope to achieve; (2) how you will achieve this from a high level view; and then (3) what changes at the individual file level will be required. See issue #2 for an example.  

However, if you can't fully describe what file level changes you'll need to make because you're not sure yet, that's fine! The point is to get you to think and make a plan before jumping into coding.  

Open an issue ("Issues" tab at the top -> "New Issue") describing what you plan to fix or what feature you plan to add. In the description, include your plan. Add an assignee (usually yourself) and give it the appropriate label.  

On your local machine, check out master branch, pull the remote master branch so that you have the latest version, and then create a specific branch on your local development environment just for this issue. See git instructions below for how to create a new branch (and use git in general).  

For this project, we use the branch naming convention `iss_<xx>_short_description`. For example, issue #22, time formatting issue on file upload times, would have its branch named as `iss_22_time_formatting`  

The aim of one branch per issue is to keep pull requests (PRs) small so that they can easily be compared against the code from master branch.  

Once you've finished coding, create a commit. The title should be short (less than 72 characters) and descriptive, and start with `Fix issue #<xx>: <title_here>`. Then, start the body text of the commit with `This fixes #<xx>`.  

The phrase "fixes #xx" will automatically link the created PR for this branch to the open issue #xx so that when the PR is approved, it will automatically close the issue. Then, use the body of the text to describe what you did and the use the body of the text to describe what you did. Manually wrap each line of the body text so that no line exceeds 72 characters.  

Push your commit(s) to Github and then open a pull request to merge this branch into master. Add Danning and/or Qining as reviewers, and add yourself as an assignee. The reviewers will confirm that the changes work as expected to resolve the issue and then merge it into master.

## Using Git
To copy this repository:  
`$ git clone https://github.com/danningyu/Edrop-v2.0.0.git`  

To start work on a feature, switch to your local master branch:  
`$ git checkout master`  
Sync with the repository to get the latest version:  
`$ git pull origin master`  
Create a branch for your new feature:  
`$ git checkout -b new_feature_name`  

Then make changes, add them, and commit them, as many times as you want:  
`$ git add file_1 file_2 etc...`  
`$ git commit`  

To push your changes onto a new branch on the repository, which can be multiple times whenever you want to publish your changes:  
`$ git push origin new_feature_name`  

Once you're done with the feature, go on Github and open a pull request to merge into master. If the Github says that you cannot automatically merge the branches, you need to resolve the conflicts manually (see section below). If the branches can be merged automatically, skip this section. Then, wait for someone to approve the pull request.  

Once your merge request is approved, you need to 91) squash it down to 1 commit; and then (2) rebase onto lastest `master`. To do (1), first find the commit from `master` that your branch starts from:  
`$ git log --merges -n 1`  

Let's call this commit `merge_commit`. Then, do a manual "squash" of all your commits:  
`$ git rebase -i merge_commit`  

This will open your text editor and list all your commits for this branch. Change all the "picks" to "squash" (or "s" for short) except for the topmost one. Then, close your text editor and the commits will automatically be squashed. A new text editor window with the commit message to write for this new squashed commit. Please create a descriptive commit message.  

Example:  
```
pick 4b6f25c AWS and Continuous Deployment - Frontend and Backend
pick 2036991 Cleanup 
pick f25gaf5 Make some more changes 
```  
To squash into a single commit, change "pick" in lines 2 and 3 above to "squash" (or "s").  

Next, we need do step (2). To rebase onto the latest `master` commit. To do this, run `git rebase` again, but slightly differently:  
`$ git rebase master`  

If there are any conflicts, resolve them at this time, and follow the instructions to continue the rebasing process:  
`$ git add .`  
`$ git rebase --continue`  

Finally, push your updates to Github. Use the `-f` option (for force push) since you've changed the history of your local development branch.  
`$ git push origin branch_name`  

#### -----Resolving merge conflicts-----
Switch to master branch and get the latest version:  
`$ git checkout master`  
`$ git pull origin master`  

Merge it manually (on your local machine):  
`$ git merge new_feature_name`  
Git should tell you that there was a merge conflict and prompt you to fix it. Resolve the merge conflict in your text editor, and then save the files you fixed merge conflicts in:  
`$ git add merge_conflict_file_1 merge_conflict_file_2 etc...`  
Tell git to continue the merge process. It should resolve at this point and you should be prompted to type in a commit message:  
`$ git merge --continue`  

Push your changes to your Github branch. However, since we're pushing from master this, the syntax is a bit different. The branch in front of the color is the local branch you are pushing from, while the branch after the colon is the one you are pushing to (the remote one):  
`$ git push origin master:new_feature_name`  
#### -----End section on resolving merge conflicts-----

Once any merge conflicts have been resolved, or if there are none, approving the pull request: this will create a merge commit (or not, if there was a merge conflict) that has two commits as parents (one from master and one from new_feature_name branch). After approving the pull request, delete the branch on Github.  

Once your change has been approved, to start work on the next feature, repeat from the top of this set of instructions:  
`$ git checkout master`  
`$ git pull origin master`  
`$ git checkout -b new_feature_2`  
...and so on.  

Optional: on your local machine, if you want to delete the branch and the associated remote branch (which has already been deleted on Github):  
`$ git branch -d new_feature_name`  
`$ git remote prune origin`  
