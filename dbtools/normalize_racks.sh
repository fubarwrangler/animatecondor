#!/bin/bash
rows=$(echo 'SELECT row FROM racks GROUP BY row HAVING COUNT(rack) > 2
ORDER BY row' | sqlite3 racks_test.db)

# Determine which rows are horizontal or vertical on the diagram by seeing
# whose RANGE(x) or RANGE(y) is larger and set all the smaller range to the mean
for row in $rows; do
    q="SELECT MAX(x)-MIN(x), MAX(y)-MIN(y) FROM racks WHERE row=$row"
    IFS=\| read -r xrange yrange <<< $(echo $q | sqlite3 racks_test.db)

    if [ "$(awk -v "x=$xrange" -v "y=$yrange" 'BEGIN { print x<y }')" -eq 1 ]; then
        echo "UPDATE racks SET x=(SELECT AVG(x) FROM racks where row=$row) WHERE row=$row;"| sqlite3 racks_test.db
    else
        echo "UPDATE racks SET y=(SELECT AVG(y) FROM racks where row=$row) WHERE row=$row;"| sqlite3 racks_test.db
    fi
done