from flask import Flask, render_template, redirect, url_for, request, jsonify
from collections import defaultdict

import logging
import datetime
import json
import random

app = Flask(__name__)

app.config.from_object(__name__)

import views  # noqa


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
def front_page():
    return render_template('front_page.html')


@app.route('/api/revents')
def get_random_events():
    data = {}
    times = [random.randint(0, 1000) for x in range(10)]
    for t in times:
        data[t] = ('start', random.randint(100, 800), random.randint(100, 800))
    return jsonify(data)


def map_rack_location(node):
    pass
