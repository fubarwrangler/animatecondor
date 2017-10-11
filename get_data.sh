#!/bin/bash

mysql linux_farm -N -B -e 'select concat(nodename,".",domain),rack from machines where rack regexp "[0-9]+-[0-9]+"'| sed 's/\(.*\)\t\([0-9]\+\)-\([0-9]\+\)/\1,\2,\3/g'| ./sync_db.py
