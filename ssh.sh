#!/bin/zsh

ssh -i "~/awskey.pem" ubuntu@ec2-18-193-222-65.eu-central-1.compute.amazonaws.com  

scp -i "~/awskey.pem" ./setupt_node.sh ubuntu@ec2-18-185-132-96.eu-central-1.compute.amazonaws.com:/home/ubuntu
