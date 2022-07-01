#!/bin/bash
OPENCONNECT_CMD=$(which openconnect)
 if [  -z  $OPENCONNECT_CMD  ];  then
  echo "<?xml version='1.0'?><items><item arg='openconnect'><title>OpenConnect is required</title><subtitle>enter to install</subtitle></item></items>"
else
  echo "<?xml version='1.0'?><items><item arg=''><title>OpenConnect VPN</title><subtitle>enter to connect</subtitle></item></items>"
 fi