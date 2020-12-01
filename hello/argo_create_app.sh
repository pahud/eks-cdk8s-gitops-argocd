#!/bin/bash

APP_NAME='cdk8s-demo'
REPO_URI='https://github.com/pahud/eks-cdk8s-gitops-argocd.git'
DIST_PATH='hello/dist'

argocd app create $APP_NAME \
--repo $REPO_URI \
--path $DIST_PATH \
--dest-server https://kubernetes.default.svc \
--dest-namespace default \
--sync-policy=auto