from application import app

from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base


engine = create_engine('sqlite:///racks_test.db', convert_unicode=True, echo=True)

db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.metadata = MetaData(bind=engine)
Base.query = db_session.query_property()


def init_db():
    import racks  # flake8: noqa -- to register models
    Base.metadata.create_all(bind=engine)
