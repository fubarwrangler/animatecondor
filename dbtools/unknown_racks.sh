#!/bin/bash

sqlite3 racks_test.db <<EOF
SELECT DISTINCT row,rack FROM machines WHERE NOT EXISTS
    (SELECT * FROM racks WHERE racks.row=machines.row AND racks.rack=machines.rack) \
    ORDER BY row, rack;
EOF
