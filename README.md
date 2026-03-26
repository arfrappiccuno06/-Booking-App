# Tutoring Booking App 🎀

A cute pink scheduling website for tutoring sessions! Built with React + Firebase + Netlify.

## What it does

- Monthly calendar view with available/booked days
- Clients click available days → pick a time → book
- Admin panel (password-protected) to set availability and manage bookings
- Real-time sync via Firebase
- Mobile responsive

## Quick setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase
- Create a project at [Firebase Console](https://console.firebase.google.com/)
- Enable Realtime Database (start in test mode)
- Grab your config values from Project Settings → Your apps → web icon

### 3. Add environment variables
Create `.env` in root:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_ADMIN_PASSWORD=your_secure_password
```

### 4. Run locally
```bash
npm run dev
```
Opens at http://localhost:5173

## Deploy it bro

## Firebase security rules

Update your Realtime Database rules for production:
```json
{
  "rules": {
    "availability": { ".read": true, ".write": true },
    "bookings": {
      ".read": true,
      ".write": true,
      "$bookingId": {
        ".validate": "newData.hasChildren(['clientName', 'date', 'time', 'timestamp'])"
      }
    }
  }
}
```

## Tech stack

React 18 + Vite, Tailwind CSS, Firebase Realtime Database, React Router, React Hook Form, date-fns, Lucide React icons

You've reached the end. Heres a cookie, and three em dashes for you!
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡴⠚⣉⡙⠲⠦⠤⠤⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣴⠛⠉⠉⠀⣾⣷⣿⡆⠀⠀⠀⠐⠛⠿⢟⡲⢦⡀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⢞⣭⠎⠀⠀⠀⠀⠘⠛⠛⠀⠀⢀⡀⠀⠀⠀⠀⠈⠓⠿⣄⠀⠀⠀
⠀⠀⠀⡜⣱⠋⠀⠀⣠⣤⢄⠀⠀⠀⠀⠀⠀⣿⡟⣆⠀⠀⠀⠀⠀⠀⠻⢷⡄⠀
⠀⢀⣜⠜⠁⠀⠀⠀⢿⣿⣷⣵⠀⠀⠀⠀⠀⠿⠿⠿⠀⠀⣴⣶⣦⡀⠀⠰⣹⡆
⢀⡞⠆⠀⣀⡀⠀⠀⠘⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣶⠇⠀⢠⢻⡇
⢸⠃⠘⣾⣏⡇⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⣠⣤⣤⡉⠁⠀⠀⠈⠫⣧
⡸⡄⠀⠘⠟⠀⠀⠀⠀⠀⠀⣰⣿⣟⢧⠀⠀⠀⠀⠰⡿⣿⣿⢿⠀⠀⣰⣷⢡⢸               — — —
⣿⡇⠀⠀⠀⣰⣿⡻⡆⠀⠀⠻⣿⣿⣟⠀⠀⠀⠀⠀⠉⠉⠉⠀⠀⠘⢿⡿⣸⡞
⠹⣽⣤⣤⣤⣹⣿⡿⠇⠀⠀⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡔⣽⠀
⠀⠙⢻⡙⠟⣹⠟⢷⣶⣄⢀⣴⣶⣄⠀⠀⠀⠀⠀⢀⣤⡦⣄⠀⠀⢠⣾⢸⠏⠀
⠀⠀⠘⠀⠀⠀⠀⠀⠈⢷⢼⣿⡿⡽⠀⠀⠀⠀⠀⠸⣿⣿⣾⠀⣼⡿⣣⠟⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢠⡾⣆⠑⠋⠀⢀⣀⠀⠀⠀⠀⠈⠈⢁⣴⢫⡿⠁⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⣧⣄⡄⠴⣿⣶⣿⢀⣤⠶⣞⣋⣩⣵⠏⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢺⣿⢯⣭⣭⣯⣯⣥⡵⠿⠟⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀

too late its all gone
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣶⣶⣿⣿⠿⠿⠛⠛⠛⠛⠛⠻⠿⢿⣿⣷⣶⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣶⣿⡿⠟⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠛⠿⣿⣶⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡿⠛⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠻⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⡟⠉⠀⠀⠀⠀⠀⠀⢀⡤⠶⠶⢤⡀⡴⠛⠉⠀⠉⠳⡄⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣴⢟⠙⣟⣷⣴⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⢠⠏⠀⣶⣶⣦⠟⠃⠀⣠⣄⠀⠀⢹⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢸⡷⣿⢀⡟⠛⠛⠯⣄⠀⠀⠀⠀⠀⠀⠀⠀⣺⡀⠀⠈⠛⠁⠀⣆⠀⢿⡿⠀⢀⠞⠉⠩⠽⢷⣤⣀⠀⠀⠀⠀⠀⠀⠘⢿⣷⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠘⣷⣿⣸⣷⡀⠀⠀⡘⣷⡀⠀⠀⠀⣷⣶⠛⠉⠳⣄⣀⣀⣠⠞⠀⠙⠒⠶⠚⠉⠀⠀⠀⠀⠀⠀⢽⣷⡀⡀⠀⠀⠀⠀⠈⢿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣾⣿⣿⠏⠙⣷⣦⡀⠛⠻⡇⠀⣠⣿⠉⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣹⣦⠐⢯⡽⠃⠀⠀⠀⠀⠀⠈⣿⣿⣤⣤⣀⠀⠀⠀⠀⠀
⠀⠀⣠⣾⡿⠋⢡⣤⢠⣤⣾⡏⠀⣄⠀⣿⠀⣿⠋⢠⠆⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣀⣀⣦⣤⣤⣬⣿⣿⡇⠉⠀⢀⢷⠀⠀⠀⠀⣠⢴⠛⠋⢡⡤⢨⣹⡇⠀⠀⠀⠀
⢀⣼⣻⠋⢀⡀⠈⠀⠘⣻⣿⣳⡤⠤⠴⣧⣸⡇⠀⠘⠛⢿⣯⣤⣴⣾⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣅⡀⠀⠘⡞⠀⠀⢀⣼⡣⠾⠃⠀⠈⢃⡼⣹⡇⠀⠀⠀⠀
⢸⣿⠃⠀⠿⠃⢀⠀⢠⣯⣴⠆⠀⠀⠰⠶⠀⢿⣧⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⣶⠈⠙⢦⡟⢿⣄⢠⡿⠁⣰⡄⠀⡾⢁⣾⣴⠟⠀⠀⠀⠀⠀
⠸⣿⡀⢼⠀⢘⣿⡴⠟⠁⠀⠀⣶⠆⣀⡤⢀⣼⠏⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⡿⢿⢿⠏⠉⢙⡀⢠⡀⠠⢸⡀⠀⠋⢿⣅⠀⣽⠟⠓⡶⢯⣼⡏⠀⠀⠀⠀⠀⠀
⠀⠘⠻⠶⠶⣟⡛⠲⠤⠀⠒⢒⠋⣉⣵⠶⡞⠻⣤⠀⠀⣀⣤⢞⡟⢻⣷⠀⠉⠛⢿⣿⡔⣆⠻⠆⠘⠛⣾⠻⣦⣌⣧⠀⠀⠀⠙⣿⡧⡇⠀⠿⠏⠻⢷⣀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⠙⣿⣟⠉⠉⠉⠙⠻⢧⣄⣹⡶⠾⠛⠉⠁⢀⡼⠁⠈⠁⠀⠀⣠⡄⠻⢿⣮⡀⣄⡀⠀⠹⣆⠀⠈⠙⠳⠶⢦⡀⠘⡇⣇⠸⢷⠀⠀⢀⡹⣧⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⣿⣿⠀⠀⢦⠀⣰⢾⠟⠉⠀⢀⣤⡴⠶⠿⠦⣤⣤⡴⢞⡇⠉⠁⢸⠘⡏⠙⠻⣮⣯⣄⣹⣧⣀⠀⠀⠀⠀⠙⣆⠹⣞⢆⠀⢠⣄⠈⠻⠻⡆⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠸⣿⡆⠰⠀⣼⠋⠀⠀⠀⠈⠉⠀⣀⠀⠀⠀⠀⠀⢴⡞⣴⡄⠀⢸⢂⡇⣀⣤⣧⡙⠓⠦⠶⠚⠳⠦⣄⠀⠀⠈⢦⠹⣎⢦⡈⠉⠀⣀⢀⡇⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⡄⢠⠇⠀⠀⠀⠀⠀⠀⣠⠟⠾⠤⠤⢤⣴⣋⡀⠀⢀⣠⠟⣾⡷⠛⠹⡟⡿⠄⠀⠀⠀⠀⠀⠈⠳⣄⠀⠀⠀⢈⣿⣝⣦⣠⣤⣼⣇⣀⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣾⠀⠀⠀⠀⠀⠀⠀⠁⠀⠀⠀⠀⠀⠀⠈⢉⣹⠿⣧⣴⣿⠁⠀⣀⣀⣙⣶⣄⣀⣀⣀⠀⠀⠀⠈⢀⣤⠶⠛⣩⣥⠀⠀⠀⠠⡦⠈⢻⡆
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠒⠒⠶⢤⣤⣤⠟⠋⢹⠇⠙⢻⣧⠀⢾⣧⣉⠉⠉⠀⠀⠀⠈⠙⠦⠀⢠⡟⢱⣤⠀⠈⠁⠀⠻⠀⣀⡤⢀⣼⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣧⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠹⠦⢤⡾⠀⠀⣤⡛⣧⢤⡈⠙⣻⣒⣀⠀⠀⠀⠀⠀⠀⢿⣜⠲⠤⠄⠠⠔⠒⠒⢉⣡⡶⠟⠋⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣦⡀⠀⠀⣀⡀⠀⠀⠀⣀⡠⠶⣫⡤⠀⠀⠈⠀⢸⣧⡹⢄⣉⡋⢹⡟⠲⠦⠀⢀⣠⣾⣿⠋⠛⠛⠛⠛⠛⠋⠉⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣦⣄⣠⠿⠋⠉⠉⣏⠀⡀⠀⠀⠀⠶⠀⠀⣸⠀⠉⠳⠾⢭⣭⣇⠀⣀⣴⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠿⣿⣶⣤⣀⡀⠙⠷⣍⡓⠀⣆⣖⣢⡴⠋⠀⠀⠀⠀⣀⣠⣼⣾⡿⠟⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⣿⣶⣶⣭⣭⣭⣭⣤⣤⣤⣴⣶⣿⣿⠿⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠉⠛⠋⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

im  cookie monster and I ate the cookie and all three of your em dashes ememememm