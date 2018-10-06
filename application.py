from flask import Flask, render_template, request, jsonify, Response
from sqlalchemy import or_
import re
import time
import redis
import random


from jobgen import JobGen

app = Flask(__name__)

app.config.from_pyfile('test.cfg')
app.config.from_envvar('FLASK_CFG', silent=True)
app.config['JSON_SORT_KEYS'] = False

import views                    # noqa
from models import db_session   # noqa
from models import Rack, Machine         # noqa

R = redis.from_url(app.config['REDIS_URL'])
ts = 0
rack_data = {}


@app.before_first_request
def refresh_dbdata():
    global rack_data

    racks = {}
    for r in Rack.query.all():
        key = (r.row, r.rack)
        racks[key] = (r.x, r.y)

    for m in Machine.query.all():
        coords = racks.get((m.row, m.rack), (-1, -1))
        rack_data[m.node] = (coords, (m.row, m.rack))


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
def front_page():
    return render_template('front_page.html', debug=app.config['DEBUG'])


def machine_location(node):
    coords = rack_data.get(node, None)
    if coords:
        x, y = coords[0]
        if x >= 0:
            return x, y
        else:
            app.logger.warning("Rack %s not found for %s", coords[1], node)
    else:
        app.logger.warning('Machine %s not found!', node)
    return None, None


@app.route('/api/events/<int:ago>')
def get_events(ago):
    global ts

    # Too large
    if ago > 1000:
        return Response(status=413)

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
        x, y = machine_location(node)
        if x:
            data.append(['start', tm, node, x, y])

    for loc, uxt in R.zrangebyscore('exits', (ts - ago), ts, withscores=True):
        slot, node, event = loc.split(':')
        tm = uxt - ts + ago
        x, y = machine_location(node)
        if x:
            data.append([event, tm, node, x, y])

    return jsonify(data)


@app.route('/api/events/fake/<int:ago>')
def fake_events(ago):
    gen = JobGen([0.03, 0.8])
    likes = ('rcas%', 'rcrs%', 'spool%', 'spar%', 'acas%')
    m = Machine.query.filter(or_(Machine.node.like(x) for x in likes)).all()

    data = []
    for tm in gen.make_list([(0.05, 0.02), (2, 1)], ago):
        n = random.choice(m)
        x, y = machine_location(n.node)
        mode = ['start', 'exit'][random.randint(0, 1)]
        if x > 0:
            data.append([mode, tm*1000., n.node, x, y])

    return jsonify(data)


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
    if app.config['DEBUG'] != 'edit':
        return Response(status=403)

    data = request.get_json()
    m = re.match(r'^(\d+)-(\d+)+$', data['rack'])
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
