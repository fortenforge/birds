#!/usr/bin/env python3
"""
Generate video poster frames and low-quality image placeholders (LQIP).
"""
import os
import glob
import cv2
from PIL import Image

MEDIA_DIR = "media"
THUMBNAIL_WIDTH = 20  # Tiny thumbnails for blur-up effect

def generate_video_poster(video_path):
    """Extract first frame from video and save as poster."""
    poster_path = video_path.rsplit('.', 1)[0] + '-poster.jpg'
    
    if os.path.exists(poster_path):
        print(f"  Skipping (exists): {poster_path}")
        return poster_path
    
    cap = cv2.VideoCapture(video_path)
    success, frame = cap.read()
    cap.release()
    
    if success:
        cv2.imwrite(poster_path, frame)
        print(f"  Created poster: {poster_path}")
        return poster_path
    else:
        print(f"  ERROR: Could not read video: {video_path}")
        return None

def generate_thumbnail(image_path):
    """Generate tiny thumbnail for LQIP blur-up effect."""
    directory = os.path.dirname(image_path)
    filename = os.path.basename(image_path)
    thumb_dir = os.path.join(directory, "thumbnails")
    thumb_path = os.path.join(thumb_dir, filename.rsplit('.', 1)[0] + ".jpg")
    
    if os.path.exists(thumb_path):
        print(f"  Skipping (exists): {thumb_path}")
        return thumb_path
    
    os.makedirs(thumb_dir, exist_ok=True)
    
    try:
        with Image.open(image_path) as img:
            # Calculate height to maintain aspect ratio
            aspect = img.height / img.width
            new_height = int(THUMBNAIL_WIDTH * aspect)
            
            # Resize to tiny thumbnail
            thumb = img.resize((THUMBNAIL_WIDTH, new_height), Image.Resampling.LANCZOS)
            
            # Convert to RGB if necessary (for PNG with transparency)
            if thumb.mode in ('RGBA', 'LA', 'P'):
                background = Image.new('RGB', thumb.size, (13, 26, 20))  # Match bg-color
                if thumb.mode == 'P':
                    thumb = thumb.convert('RGBA')
                background.paste(thumb, mask=thumb.split()[-1] if 'A' in thumb.mode else None)
                thumb = background
            
            thumb.save(thumb_path, "JPEG", quality=60)
            print(f"  Created thumbnail: {thumb_path}")
            return thumb_path
    except Exception as e:
        print(f"  ERROR generating thumbnail for {image_path}: {e}")
        return None

def main():
    print("=== Generating Video Posters ===")
    video_files = glob.glob(os.path.join(MEDIA_DIR, "**", "*.mp4"), recursive=True)
    video_files += glob.glob(os.path.join(MEDIA_DIR, "**", "*.mov"), recursive=True)
    
    for video in sorted(video_files):
        generate_video_poster(video)
    
    print(f"\n=== Generating LQIP Thumbnails ===")
    image_files = glob.glob(os.path.join(MEDIA_DIR, "**", "*.jpg"), recursive=True)
    image_files += glob.glob(os.path.join(MEDIA_DIR, "**", "*.jpeg"), recursive=True)
    image_files += glob.glob(os.path.join(MEDIA_DIR, "**", "*.png"), recursive=True)
    
    # Filter out already-generated thumbnails and posters
    image_files = [f for f in image_files if "/thumbnails/" not in f and "-poster.jpg" not in f]
    
    for image in sorted(image_files):
        generate_thumbnail(image)
    
    print("\nDone!")

if __name__ == "__main__":
    main()
