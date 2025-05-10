# Financial-Text-Analyzer

## Demo
[![Watch the demo](https://img.youtube.com/vi/r7QFxiUBC78/0.jpg)](https://www.youtube.com/watch?v=r7QFxiUBC78)

# 📦 Models
Add your models to the `financial-text-analyzer-backend/app/models` directory.
- You can use my models (e.g., [myModels](https://1drv.ms/f/c/ec75ff7ff186b1e4/EiIQ2JtHjepMtQLLmRLSausBrlCGYPyfB0YStJpWvxXIiQ?e=pTnDoM))
- Or you can create your own models.

# 🔥 Flask Starter App
### 1. Create virtual environment and activate it
```
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

### 2. Install dependencies
```
pip install -r requirements.txt
```

### 3. Run app
```
uvicorn app.main:app --reload
```

# 🧩 Browser Extension
### 1. Open Chrome and go to `chrome://extensions/`
### 2. Enable Developer Mode (top-right toggle)
### 3. Click "Load unpacked"
### 4. Select the folder containing the extension (e.g., `financial-text-analyzer-client/dist/`)
### 5. If `dist/` folder is not available than build the react app.
