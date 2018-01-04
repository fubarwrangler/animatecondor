#!/usr/bin/env python
from application import app
import pprint
import sys

URL_PREFIX = '/pub/livemap'


class LoggingMiddleware(object):
    def __init__(self, app):
        self._app = app

    def __call__(self, environ, resp):
        errorlog = environ['wsgi.errors']
        pprint.pprint(('REQUEST', environ), stream=errorlog)

        def log_response(status, headers, *args):
            pprint.pprint(('RESPONSE', status, headers), stream=errorlog)
            return resp(status, headers, *args)

        return self._app(environ, log_response)


class ScriptNameEdit(object):

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        url = environ['SCRIPT_NAME']
        environ['wsgi.url_scheme'] = 'https'
        environ['SCRIPT_NAME'] = URL_PREFIX + url
        return self.app(environ, start_response)


if __name__ == "__main__":

    if '-l' not in sys.argv:
        app.wsgi_app = LoggingMiddleware(app.wsgi_app)
        app.wsgi_app = ScriptNameEdit(app.wsgi_app)
    app.run()
