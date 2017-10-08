from flask import Flask, render_template, request, jsonify, Response

import random
import re

app = Flask(__name__)

app.config.from_object(__name__)

import views  # noqa
from models import db_session   # noqa
from models.racks import Rack   # noqa


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
    times = [random.randint(0, 1000) for x in range(random.randint(3, 8))]
    for t in times:
        data[t] = ('start', random.randint(100, 800), random.randint(100, 800))
    return jsonify(data)


@app.route('/racks')
def show_racks():
    return render_template('racks.html', racks=Rack.query.all())


@app.route('/racks/update', methods=['POST'])
def update_racks():
    data = request.get_json()
    m = re.match('^(\d+)-(\d)+$', data['rack'])
    if not m:
        return Response(status=520)
    row, rack = map(int, m.groups())
    x, y = data['x'], data['y']
    

    return Response(status=201)


def map_rack_location(node):
    pass
