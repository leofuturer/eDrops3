## Using Git
To copy this repository:  
`$ git clone https://github.com/leofuturer/Edrop-v2.0.0.git`  

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
