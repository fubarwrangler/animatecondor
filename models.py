from sqlalchemy import Column, Integer, Float, UniqueConstraint, String

from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import scoped_session, sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base

from application import app

engine = create_engine('sqlite:///racks_test.db', convert_unicode=True,
                        echo=app.config['SQLALCHEMY_ECHO'])

db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.metadata = MetaData(bind=engine)
Base.query = db_session.query_property()


def init_db():
    Base.metadata.create_all(bind=engine)


class Rack(Base):
    __tablename__ = 'racks'

    id = Column(Integer, primary_key=True)
    row = Column(Integer)
    rack = Column(Integer)
    x = Column(Float)
    y = Column(Float)

    __table_args__ = (UniqueConstraint('row', 'rack'),
                      {'mysql_engine': 'InnoDB', 'mysql_charset': 'utf8'})

    def __repr__(self):
        return '<Rack %d-%d @ %x>' % (self.row, self.rack, id(self))


class Machine(Base):
    __tablename__ = 'machines'

    node = Column(String, primary_key=True)
    row = Column(Integer)
    rack = Column(Integer)
    robj = relationship("Rack", primaryjoin='and_(Machine.rack==Rack.rack, Machine.row==Rack.row)', foreign_keys='[Rack.rack, Rack.row]', lazy='joined', uselist=False)

    __table_args__ = ({'mysql_engine': 'InnoDB', 'mysql_charset': 'utf8'})

    def __repr__(self):
        return '<Machine %s (%d-%d) @ %x>' % (self.node, self.row, self.rack, id(self))

    @property
    def rstr(self):
        return '%d-%d' % (self.row, self.rack)


if __name__ == "__main__":
    init_db()