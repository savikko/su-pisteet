# 🖱️ Creating a Desktop Shortcut

Follow these simple steps to create a desktop shortcut for easy access:

## Method 1: Drag and Drop (Easiest)

1. Open Windows Explorer
2. Navigate to this folder: `/Users/savikko/projects/skating/psh`
3. Find the file `post.cmd`
4. **Right-click and drag** `post.cmd` to your Desktop
5. When you release, select **"Create shortcuts here"**

Done! Now you can double-click the shortcut on your desktop to run the upload.

## Method 2: Right-Click Create Shortcut

1. Navigate to this folder in Windows Explorer
2. **Right-click** on `post.cmd`
3. Select **"Send to" → "Desktop (create shortcut)"**

Done!

## Method 3: Manual Shortcut Creation

1. **Right-click** on your Desktop
2. Select **"New" → "Shortcut"**
3. For location, enter:
   ```
   C:\Users\savikko\projects\skating\psh\post.cmd
   ```
   (Adjust the path if your folder is in a different location)
4. Click **"Next"**
5. Name it something like: **"Upload Skating Results"**
6. Click **"Finish"**

## 🎨 Optional: Customize the Icon

1. **Right-click** the shortcut → **"Properties"**
2. Click **"Change Icon..."**
3. Choose an icon you like (or use a custom .ico file)
4. Click **"OK"**

## ✅ Test It!

Double-click your new shortcut. You should see:
- A window opens showing the upload progress
- Results are posted to https://su-pisteet.kikka.re
- A success message appears
- Window stays open until you press a key

## 📋 What the Shortcut Does

When you run the shortcut, it will:
1. Connect to your SQL Server (`localhost`)
2. Query the skating results from `SkatingApp` database
3. Save results to `results.json`
4. Upload to https://su-pisteet.kikka.re/api/results
5. Show success/error message

## 🔧 If You Get Errors

**"Cannot find file":**
- Make sure the path in the shortcut is correct
- Right-click shortcut → Properties → check "Target" field

**"Access Denied":**
- Right-click shortcut → Run as Administrator

**"SQL Server connection failed":**
- Check that SQL Server is running
- Verify credentials in `Query-And-Post-Results.ps1`

## 💡 Pro Tip

Pin the shortcut to your taskbar for even faster access:
1. Right-click the desktop shortcut
2. Select **"Pin to taskbar"**

Now it's just one click away! 🎯

