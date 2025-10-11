# backend/app/services/serial_generator.py
def generate_serial(category_prefix: str, count: int) -> str:
    prefix = category_prefix[:4].upper()
    return f"{prefix}-{count:03d}"
