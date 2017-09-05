from flask import Flask, render_template, flash, redirect, url_for, request, session
from collections import defaultdict

import logging
import datetime

app = Flask(__name__)

app.config.from_object(__name__)


import views



@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/')
def front_page():
    return render_template('front_page.html')
