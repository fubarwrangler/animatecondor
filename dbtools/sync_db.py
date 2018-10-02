#!/usr/bin/python
import sys
import sqlite3 as sql


con = sql.connect('racks_test.db')
data = [tuple(y) for y in (map(str.strip, x.split(',')) for x in sys.stdin)]
c = con.cursor()
c.executemany('INSERT OR REPLACE INTO machines VALUES (?,?,?)', data)
con.commit()
