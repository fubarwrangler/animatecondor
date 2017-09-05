#!/bin/bash

if [[ ! -d env ]]; then
    mkdir env
    virtualenv env/
fi
