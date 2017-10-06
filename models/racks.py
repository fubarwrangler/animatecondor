from sqlalchemy import Column, Integer, Float, UniqueConstraint
from . import Base


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
        return '<Rack %d-%d>' % (self.row, self.rack)
