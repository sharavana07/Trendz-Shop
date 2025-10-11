# backend/app/utils/cloudinary_helper.py
import cloudinary
import cloudinary.uploader
from app.core.config import settings

def configure_cloudinary():
    if settings.CLOUDINARY_CLOUD_NAME:
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
        )

def upload_to_cloudinary(file):
    configure_cloudinary()
    result = cloudinary.uploader.upload(file)
    return result.get("secure_url")
