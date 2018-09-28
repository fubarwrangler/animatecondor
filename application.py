from flask import Flask, render_template, request, jsonify, Response
import re
import redis
import time

app = Flask(__name__)
app.config.from_object(__name__)
app.config['JSON_SORT_KEYS'] = False
app.config['REDIS'] = 'redis://localhost:6379'

import views                    # noqa
from models import db_session   # noqa
from models import Rack, Machine         # noqa

R = redis.from_url(app.config['REDIS'])
ts = 0


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
def front_page():
    return render_template('front_page.html')


@app.route('/api/revents')
def get_random_events():
    data = {}
    racks = Rack.query.all()
    t = 0
    for rack in racks:
        data[t] = ('start', rack.x, rack.y)
        t += 10
    return jsonify(data)


def machine_location(node):
    m = Machine.query.filter_by(node=node).first()
    if m:
        r = Rack.query.filter_by(rack=m.rack, row=m.row).first()
        if r:
            return r
        else:
            app.logger.warning("Rack for machine %s not found!", m)
    else:
        app.logger.info('Machine %s not found!', node)
    return None


@app.route('/api/events/<int:ago>')
def get_events(ago):
    global ts
    ago *= 1000.
    relativetime = request.args.get('adj') == 'd'
    if relativetime:
        if ts == 0:
            ts = R.zrange('starts', 0, 0, withscores=True)[0][1] + ago
        else:
            ts += ago
    else:
        ts = time.time()*1000.

    data = []
    for loc, uxt in R.zrangebyscore('starts', (ts - ago), ts, withscores=True):
        slot, node = loc.split(':')
        tm = uxt - ts + ago
        r = machine_location(node)
        data.append(['start', tm, node, r.x, r.y])
    # for loc, uxt in R.zrangebyscore('exits', (ts - ago), ts, withscores=True):
    #     slot, node, event = loc.split(':')
    #     tm = uxt - ts + ago
    #     r = machine_location(node)
    #     data[tm] = (event, node, r.x, r.y)

    return jsonify(data)


@app.route('/api/test/single')
def test_event():
    return jsonify([['start', 0, 'rcas6000', 0.8, 0.4]])


@app.route('/racks')
def show_racks():
    return render_template('racks.html', racks=Rack.query.order_by(Rack.row, Rack.rack).all())


@app.route('/api/racks')
def map_rack_data():
    data = dict([('%d-%d' % (x.row, x.rack), (x.x, x.y)) for x in Rack.query.all()])
    return jsonify(data)


# Create racks by clicking on the map and sending %x, %y locations in the image
@app.route('/racks/update', methods=['POST'])
def update_racks():

    # Forbidden for production
    return Response(status=403)

    data = request.get_json()
    m = re.match('^(\d+)-(\d+)+$', data['rack'])
    if not m:
        return Response(status=520)
    n_row, n_rack = map(int, m.groups())
    x, y = data['x'], data['y']

    rack = Rack.query.filter_by(row=n_row, rack=n_rack).first()
    if not rack:
        app.logger.info("Creating new rack %d-%d: %s", n_row, n_rack, data)
        rack = Rack(row=n_row, rack=n_rack)
    else:
        app.logger.info("Found rack, updating")
    rack.x = x
    rack.y = y
    db_session.add(rack)
    db_session.commit()

    return Response(status=201)
