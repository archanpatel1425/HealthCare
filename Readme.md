# 🏥 HealWell

**HealWell** is a comprehensive online healthcare consultation platform connecting doctors and patients. Built with modern technologies including React.js, Node.js, Express.js, WebRTC, and AI-powered assistants, HealWell provides a seamless telemedicine experience with advanced features for both patients and healthcare providers.

---

## 🌟 **Key Features**

### 👨‍⚕️ **Patient Panel**
- **Appointment Management**
  - Book and manage appointments with preferred doctors
  - Real-time appointment status tracking
  - Filter doctors by specialty, availability, and ratings
- **Video Consultation**
  - High-quality video calls powered by WebRTC
  - Microphone and camera control options
  - Screen sharing capability for medical reports
  - Draggable self-video window for better consultation experience
- **Messaging System**
  - Real-time chat with doctors using Socket.IO
  - Image sharing for medical documents/reports
  - Message status indicators (sent, delivered, read)
  - Typing animation for better interaction
  - Online/offline status indicators

### 👩‍⚕️ **Doctor Panel**
- **Practice Management**
  - Comprehensive dashboard to manage appointments
  - Patient history and records access
  - Schedule management and availability settings
- **Consultation Tools**
  - Integrated video consultation interface
  - Digital prescription generator
  - Patient follow-up management
  - Consultation notes and records maintenance

### 🔬 **AI-Powered Health Assistants**
- **Skin Care Assistant**
  - Powered by Flask and Gemini AI
  - Analyzes skin type from uploaded images
  - Provides personalized skincare recommendations
  - Multilingual support (English, Hindi, and Gujarati)
- **Skin Cancer Risk Assessment**
  - Convolutional Neural Network (CNN) implementation
  - Early risk detection from skin images
  - Preventative measure recommendations
  - Educational resources on skin health

---

## 🛠️ **Technology Stack**

| Technology | Purpose |
|------------|---------|
| **React.js** | Frontend user interface |
| **Node.js** | Backend runtime environment |
| **Express.js** | Web application framework |
| **WebRTC** | Real-time video communication |
| **Socket.IO** | Real-time messaging and notifications |
| **Flask** | AI assistant microservice |
| **Prisma ORM** | Database management and queries |
| **PostgreSQL** | Relational database |
| **Cloudinary** | Image and media management |
| **Gemini AI** | Powering skin care recommendations |
| **CNN** | Skin cancer detection model |

---

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v14.0 or higher)
- Python (3.8 or higher for Flask services)
- PostgreSQL database
- Cloudinary account (for image storage)

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/healwell.git
cd healwell
```

#### 2. Set Up Backend
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create .env file with the following variables
# DATABASE_URL="postgresql://username:password@localhost:5432/healwell"
# JWT_SECRET="your_jwt_secret"
# CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
# CLOUDINARY_API_KEY="your_cloudinary_api_key" 
# CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Run Prisma migrations
npx prisma migrate dev --name init

# Start the server
npm run dev
```

#### 3. Set Up Frontend
```bash
# Navigate to the client directory
cd ../client

# Install dependencies
npm install

# Create .env file with the following variables
# REACT_APP_API_URL=http://localhost:5000
# REACT_APP_SOCKET_URL=http://localhost:5000

# Start the client
npm start
```

#### 4. Set Up AI Services
```bash
# Navigate to the ai-services directory
cd ../ai-services

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# export GEMINI_API_KEY="your_gemini_api_key"  # On Windows: set GEMINI_API_KEY=your_gemini_api_key

# Start the Flask server
python app.py
```


## 👥 **Contributing**
We welcome contributions to HealWell! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📞 **Contact**
Maintained by [JAY PANDYA](https://github.com/1JAYPANDYA1). Feel free to reach out to me through GitHub or email for any queries.

---
