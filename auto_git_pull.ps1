while ($true) {
    cd "C:\xampp\htdocs\New"  # Change this to your project folder
    git pull origin main
    Start-Sleep -Seconds 600  # Wait for 600 seconds (10 minutes)
}

