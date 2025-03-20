# Rendezvous

Rendezvous is a mobile-first application that simplifies the process of planning dates—whether romantic or friendly—by offering personalized recommendations, real-time coordination, and seamless logistics integration. It eliminates the stress and inefficiencies often involved in selecting suitable locations and activities that match everyone's preferences.

## Motivation

Planning a date can be overwhelming. From finding a mutually convenient time and place to juggling individual tastes and availability, the back-and-forth communication can be tedious and time-consuming. Rendezvous streamlines this process through intelligent suggestions, scheduling tools, and built-in communication, making planning feel less like work and more like fun.

## Architecture

Rendezvous leverages a full-stack architecture built for scalability and ease of use.

### Frontend – React Native

- Cross-platform mobile application developed using React Native
- Integrated with Expo for rapid testing and mobile deployment
- Built with reusable components and clean navigation patterns

### Backend – Node.js with Express

- REST API developed with Express.js
- MongoDB used for data persistence (users, events, preferences, responses)
- Hosted on Render for API deployment

### Recommendation Engine

- Integrated with DeepSeek to provide AI-generated suggestions for dates, restaurants, and activities
- Prompts are dynamically generated based on user preferences and context

### Mapping and Location Services

- Google Maps API for rendering maps and determining proximity
- Google Geocoding API to convert user-entered addresses into geographic coordinates
- Personalized filtering based on location and activity type

### Email Integration

- Integrated email services to send final date plans and updates to users
- A separate web application was developed using Create React App to render emailed date summaries via public links

### Tooling and Guidance

- Developed using modern JavaScript practices and the Create React App framework
  - [https://create-react-app.dev/docs/getting-started/](https://create-react-app.dev/docs/getting-started/)
- ChatGPT was used throughout the development process to guide architectural decisions, debug issues, refine user flows, and improve the recommendation logic

## Setup

To run the mobile app locally:

- git clone
- cd Rendezvous
- npm install
- npm run ios # or use npm run android if you're testing on Android

- This requires Node.js, npm, and Expo CLI installed globally.

## Deployment

- API backend: https://project-api-sustainable-waste.onrender.com
- Expo mobile deployment: [View on Expo](https://expo.dev/preview/update?message=clean-up%20and%20fixed%20styling&updateRuntimeVersion=1.0.0&createdAt=2025-03-14T05%3A52%3A54.719Z&slug=exp&projectId=34694a17-6315-44a0-82ad-714b9fe4fa7a&group=9ca7d351-1c95-4899-a7f3-ebd4e2f36b5a)
- Email web app: https://github.com/Manzi-Fabrice/RendezVous/tree/main/web-app  
### Expo credentials
- username: dejanaypinto
- Password: Rendezvous@123

## Authors

- Manzi Fabrice Niyigaba
- Dejanay Pinto
- Ahmed Elmi
- Abdul-Kudus Alhassan
- Miftah Meky