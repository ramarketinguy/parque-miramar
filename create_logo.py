from PIL import Image

def process_logo():
    # Load original logo
    try:
        logo = Image.open("Fotos/Logo blanco.png").convert("RGBA")
    except FileNotFoundError:
        print("Error: Logo file not found.")
        return

    # Create black background image of same size
    bg = Image.new("RGB", logo.size, (0, 0, 0))
    
    # Composite logo onto background
    bg.paste(logo, (0, 0), logo)
    
    # Save as high-quality OG image (JPEG for better compression/compatibility)
    bg.save("Fotos/og-logo-black.jpg",quality=95)
    print("Created Fotos/og-logo-black.jpg")

    # Create Favicon (resize to 64x64 and 32x32)
    # Use the squarest part if not square? Or fit?
    # For now, just resize or center on square.
    # Let's center on a square canvas.
    max_dim = max(bg.size)
    square_bg = Image.new("RGB", (max_dim, max_dim), (0, 0, 0))
    offset = ((max_dim - bg.size[0]) // 2, (max_dim - bg.size[1]) // 2)
    square_bg.paste(bg, offset)
    
    # Save favicon as ICO (64x64) and PNG (32x32)
    square_bg.resize((64, 64), Image.LANCZOS).save("favicon.ico")
    square_bg.resize((32, 32), Image.LANCZOS).save("favicon.png")
    print("Created favicon.ico and favicon.png")

if __name__ == "__main__":
    process_logo()
