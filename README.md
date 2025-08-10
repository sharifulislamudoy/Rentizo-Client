# Rentizo Client

The frontend application for Rentizo, a modern rental management platform.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- [npm](https://www.npmjs.com/) (v8.x or higher) or [Yarn](https://yarnpkg.com/) (v1.22.x or higher)
- [Git](https://git-scm.com/)

## Getting Started

Follow these steps to set up the Rentizo client on your local machine:

### Live Link

[Rentizo](https://rentizo.web.app/)

# Clone the repository
git clone https://github.com/sharifulislamudoy/Rentizo-Client
cd Rentizo-Client

# Create environment file
cat > .env.local << 'EOF'
VITE_FIREBASE_API_KEY=AIzaSyBPUnnxdmmlc3WdnGG1ZzOPzZXTges0Yzg
VITE_FIREBASE_AUTH_DOMAIN=rentizo.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=rentizo
VITE_FIREBASE_STORAGE_BUCKET=rentizo.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=220054668724
VITE_FIREBASE_APP_ID=1:220054668724:web:d56afbc3aedefc68dd9ee1
EOF

# Install dependencies and run
npm install
npm run dev
