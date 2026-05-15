"""
ImportEquipment model — managed by Admin, linked to Supplier.
"""
from sqlalchemy import Column, Integer, String, Enum, DateTime, Date, Text, ForeignKey, func
from app.database import Base


class ImportEquipment(Base):
    __tablename__ = "import_equipment"

    imp_id = Column(Integer, primary_key=True, autoincrement=True)
    sup_id = Column(Integer, ForeignKey("suppliers.sup_id"), nullable=False)
    equipment_name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    quantity = Column(Integer, nullable=False, default=0)
    import_date = Column(Date, nullable=True)
    import_status = Column(
        Enum("pending", "received", "inspected", "stored", name="import_status"),
        default="pending",
        server_default="pending",
    )
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
