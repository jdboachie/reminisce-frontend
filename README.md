# Reminisce - Photo Album App

A modern photo album application that allows admins to create departments and students to upload and share photos. Built with Next.js, TypeScript, and Tailwind CSS, connected to a hosted backend.

## Features

- **Admin Panel**: Create and manage departments
- **Student Authentication**: Students can authenticate using their reference number
- **Photo Upload**: Authenticated students can upload photos to department albums
- **Cloudinary Integration**: Secure image storage and optimization
- **Responsive Design**: Modern UI that works on all devices
- **Real-time Updates**: Live updates when photos are uploaded

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Hosted on Render (https://reminisce-backend.onrender.com)
- **Image Storage**: Cloudinary
- **Authentication**: JWT tokens
- **Database**: MongoDB with TypeORM

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudinary account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reminisce-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Backend Configuration
NEXT_PUBLIC_API_BASE_URL=https://reminisce-backend.onrender.com
NEXT_PUBLIC_USE_REAL_BACKEND=true

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Cloudinary Setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name from the dashboard
3. Create an upload preset:
   - Go to Settings > Upload
   - Scroll to Upload presets
   - Create a new preset
   - Set signing mode to "unsigned"
   - Copy the preset name

### Running the Application

1. Development mode:
```bash
npm run dev
# or
yarn dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Build for production:
```bash
npm run build
npm start
```

## How It Works

### Admin Flow

1. **Login**: Admins log in through the admin panel
2. **Create Department**: Admins can create new departments with:
   - Department name
   - Department code
   - URL slug (auto-generated from name)
3. **Generate Links**: Each department gets a unique shareable link
4. **Manage Students**: Admins can onboard students with reference numbers

### Student Flow

1. **Access Department**: Students visit the department link (e.g., `/department/computer-science`)
2. **Authenticate**: Students enter their reference number to verify identity
3. **Upload Photos**: Authenticated students can upload photos to the department album
4. **View Gallery**: All uploaded photos are displayed in a responsive grid

### Department Page Structure

- **Public Access**: Anyone can view department information and photos
- **Student Authentication**: Required for photo uploads
- **Photo Gallery**: Displays all uploaded photos with metadata
- **Student Directory**: Shows all students in the department

## API Endpoints

The app connects to the hosted backend at `https://reminisce-backend.onrender.com`:

- **Authentication**: `/auth/login`
- **Departments**: `/department`
- **Students**: `/student`
- **Images**: `/image`
- **Reports**: `/report`

## File Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel
│   ├── department/[slug]/ # Dynamic department pages
│   └── ...
├── components/            # React components
│   ├── AdminLogin.tsx
│   ├── DepartmentManagement.tsx
│   └── ...
├── config/               # Configuration files
│   └── api.ts           # API endpoints
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── api.ts          # API service functions
│   ├── cloudinary.ts   # Cloudinary integration
│   └── ...
└── hooks/               # Custom React hooks
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | Yes |
| `NEXT_PUBLIC_USE_REAL_BACKEND` | Enable real backend | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset | Yes |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the GitHub repository.
