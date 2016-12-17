# node-red-contrib-classifier-bayes
NodeRed node to train and use bayes classifier

## Nodes:
 * **training** create and train a classifer
 * **classifier** classify input with a trained classifer
 * **evaluator** evaluate classifier accuracy

## Docker
You can test this node runing the following docker command:

```
docker run -it -p 1880:1880 -v /home/node-red:/data -u `id -u node-red` --name mynodered petitchevalroux/node-red-docker
```

This command run a [custom image] (https://hub.docker.com/r/petitchevalroux/node-red-docker/) containing the current node.

## Roadmap
 * Improve node status
 * Internationalize node
 * Extract client api code to a new package

## About
Author: [petitchevalroux](http://petitchevalroux.net)