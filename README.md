# 🌟 Vivenza - Social Media Platform

<div align="center">

![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)
![Firebase](https://img.shields.io/badge/Firebase-12.1.0-orange.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-teal.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

*A modern, location-based social media platform where users can share their experiences, moods, and moments with the world.*

[Live Demo](#) | [Documentation](#) | [Report Bug](#) | [Request Feature](#)

</div>

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🚀 About The Project

Vivenza is a cutting-edge social media platform that combines location-based content sharing with mood tracking and intelligent content recommendations. Built for the IBM TechExchange hackathon by Team Bit_Bhakts, this platform allows users to:

- **Share moments** with photos and videos
- **Express moods** through emoji-based categorization
- **Discover content** based on location proximity
- **Connect with others** through personalized recommendations
- **Track trends** in their local area

### 🎯 Key Highlights

- **Responsive Design**: Seamless experience across desktop and mobile devices
- **Real-time Updates**: Live content feeds and notifications
- **Smart Recommendations**: AI-powered content discovery
- **Location Intelligence**: Geographic content filtering and discovery
- **Mood Analytics**: Track and visualize community sentiment

## ✨ Features

### 🔐 Authentication & User Management
- **Google OAuth Integration** - Quick and secure login
- **User Profiles** - Customizable user accounts
- **Account Setup** - Comprehensive onboarding experience

### 📱 Content Creation & Sharing
- **Multi-media Posts** - Support for images and videos
- **Mood Tagging** - Express feelings with emoji categories
- **Location Tagging** - Geo-tagged content sharing
- **Category Organization** - Structured content classification

### 🌍 Discovery & Exploration
- **For You Feed** - Personalized content recommendations
- **Explore Page** - Discover trending content
- **Location-based Discovery** - Find nearby posts and events
- **Search Functionality** - Advanced content search

### 📊 Analytics & Trends
- **Trending Topics** - Real-time trend analysis
- **Location Analytics** - Geographic content insights
- **Mood Analytics** - Community sentiment tracking

### 🔔 Social Features
- **Notifications** - Real-time activity updates
- **User Interactions** - Like, comment, and share functionality
- **Profile Management** - Comprehensive user profiles

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** - Modern JavaScript library for building user interfaces
- **Vite 6.3.5** - Next-generation frontend build tool
- **React Router DOM 7.8.0** - Declarative routing for React
- **TailwindCSS 4.1.11** - Utility-first CSS framework
- **Lucide React** - Beautiful & consistent icon library

### Backend & Database
- **Firebase 12.1.0** - Backend-as-a-Service platform
  - Authentication (Google OAuth)
  - Firestore Database
  - Cloud Storage
  - Real-time Updates

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Vite Plugin React** - Fast refresh and optimized builds

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlakhBabbar/IBM-TechExchange-Bit_Bhakts.git
   cd IBM-TechExchange-Bit_Bhakts/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images and media files
│   ├── context/           # React contexts (AuthContext)
│   ├── desktop/           # Desktop-specific components
│   │   ├── components/    # Reusable desktop components
│   │   └── pages/         # Desktop page components
│   ├── mobile/            # Mobile-specific components
│   │   ├── components/    # Reusable mobile components
│   │   └── pages/         # Mobile page components
│   ├── Firebase/          # Firebase configuration
│   └── utils/             # Utility functions
├── index.html             # Entry HTML file
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🎯 Usage

### Creating a Post
1. Navigate to the **Create** page
2. Upload an image or video
3. Add a description and select mood/categories
4. Choose location (optional)
5. Publish your post

### Discovering Content
- **For You**: Personalized recommendations based on your interests
- **Explore**: Browse trending content and discover new users
- **Map**: View location-based content on an interactive map

### User Interaction
- Like and comment on posts
- Follow other users
- Share interesting content
- Receive real-time notifications

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contact

**Team Bit_Bhakts** - IBM TechExchange Hackathon

- **Project Link**: [https://github.com/AlakhBabbar/IBM-TechExchange-Bit_Bhakts](https://github.com/AlakhBabbar/IBM-TechExchange-Bit_Bhakts)
- **Live Demo**: [https://vivenza-eight.vercel.app/profile](https://vivenza-eight.vercel.app/profile)(#)

---

<div align="center">

**Built with ❤️ by Team Bit_Bhakts for IBM TechExchange**

⭐ Star this repository if you found it helpful!

</div>
