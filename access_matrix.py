"""
Helper script that lists who has permission to access what API endpoints.
"""
import json

model_config = "./server/server/model-config.json"
model_prefix = "./server/common/models/"

with open(model_config, 'r') as f:
    info = json.load(f)

allowed_access = {}

for k in info.keys():
    if info[k].get('public'):
        allowed_access[k] = {}
        remote_methods = info[k]['options']['remoting']['sharedMethods']
        for rm in remote_methods:
            if rm != "*":
                if 'prototype' in rm: # strip prototype. from methods
                    rm = rm[len("prototype."):]
                allowed_access[k][rm] = []
        model_file_name = model_prefix + k + ".json"
        with open(model_file_name) as mf:
            mf_config = json.load(mf)
        for acl_set in mf_config['acls']:
            if acl_set.get('property'):
                prop = acl_set.get('property')
                allowed_access[k][prop].append(acl_set['principalId'])

out_file = "permission_matrix.json"
with open(out_file, 'w') as of:
    json.dump(allowed_access, of, indent=2)
print("Finished!")
