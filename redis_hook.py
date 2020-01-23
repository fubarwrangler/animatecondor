#!/usr/bin/python

import classad
import syslog
import random
import redis
import time
import sys

connection_params = {
    'host': 'graphite01.sdcc.bnl.local',
    'port': 6379,
    'socket_connect_timeout': 2,
    'socket_timeout': 2,
}
epoch_ms = int(time.time() * 1000)  # Epoch time (in ms) as a score in set
purge_delay = 3 * (3600 * 1000)     # Age in ms of entries to cleanup (3 hr)

key = 'exits' if len(sys.argv) > 1 else 'starts'


def read_classad():
    required = set(['RemoteSlotID', 'RemoteHost'])
    adstr = sys.stdin.read()
    ad = classad.parseOne(adstr, classad.Parser.Old)
    if not all(x in ad for x in required):
        raise Exception('Required keys not present in ad: %s' % ad)
    if 'RealExperiment' not in ad:
        ad['RealExperiment'] = 'other'
    return ad


def cleanup_old(rc):
    return rc.zremrangebyscore(key, 0, epoch_ms - purge_delay)


def nodename(fqdn):
    return fqdn.split('.')[0]


def construct_name(ad):
    n = '{0}:{1}:{2}'.format(ad['RealExperiment'], ad['RemoteSlotId'], nodename(ad['RemoteHost'].split('@')[1]))
    if key == 'exits':
        n += ':' + sys.argv[1]
    return n


def main():
    # Parse using condor classad parser
    classad = read_classad()

    # Connect to redis and update with current time
    rdb = redis.StrictRedis(**connection_params)
    rdb.zadd(key, epoch_ms, construct_name(classad))

    # 0.02% of the time run a cleanup pass on the redis db
    if random.random() < 0.0002:
        syslog.syslog('Cleaned up: %d entries' % cleanup_old(rdb))


if __name__ == '__main__':
    try:
        main()
    except Exception as e:
        syslog.syslog('Error: %s' % e)

    # Always success so we don't block the job
    sys.exit(0)
