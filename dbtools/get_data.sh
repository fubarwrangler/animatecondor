#!/bin/bash

mysql -h rcfdb2 -u db_query linux_farm -N -B -e 'select nodename,rack from machines where rack regexp "[0-9]+-[0-9]+"'| sed 's/\(.*\)\t\([0-9]\+\)-\([0-9]\+\)/\1,\2,\3/g'| ./sync_db.py
