# 🗳️ Blockchain Voting System

A secure, transparent, and tamper-proof voting system built with Next.js, Supabase, and blockchain technology. This system implements real-time face recognition for voter authentication and uses blockchain to ensure vote integrity and transparency.

## ✨ Features

### 🔐 Security Features
- **Real-Time Face Recognition**: AI-powered biometric authentication using `face-api.js`
- **Blockchain Integration**: Immutable vote recording with cryptographic hashing
- **Row-Level Security (RLS)**: Database-level security policies for data protection
- **Session Management**: Secure session handling with Supabase Auth

### 👤 User Features
- **Voter Registration**: Webcam-based face registration with Aadhaar verification
- **Real-Time Face Verification**: Automatic face verification during login and voting
- **Candidate Selection**: Easy-to-use interface for selecting candidates
- **Vote Tracking**: View voting history and blockchain transaction hashes
- **Dashboard**: Personal dashboard with election information and voting status

### 🎯 Admin Features
- **Election Management**: Create and manage elections
- **Candidate Management**: Add candidates to elections
- **Result Visualization**: Real-time election results with charts
- **Blockchain Monitoring**: Monitor blockchain network status

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **face-api.js** - Face recognition library
- **Lucide React** - Icon library

### Backend
- **Supabase** - Backend-as-a-Service (PostgreSQL, Auth, Storage)
- **Next.js API Routes** - Serverless API endpoints
- **Blockchain** - Custom blockchain implementation for vote recording

### Database
- **PostgreSQL** (via Supabase)
- **Row-Level Security (RLS)** policies
- **Real-time subscriptions**

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **Supabase Account** - [Create one here](https://supabase.com)
- **Webcam** - For face recognition features

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/blockchain-voting-system.git
   cd blockchain-voting-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**
   - Create a new Supabase project
   - Run the SQL scripts in the `scripts/` directory in order:
     ```sql
     -- 1. Create tables
     scripts/001_create_voting_tables.sql
     
     -- 2. Set up RLS policies
     scripts/006_complete_rls_fix.sql
     ```

5. **Download Face Recognition Models**
   The face recognition models are already included in `public/models/`. If you need to download them again:
   ```bash
   node scripts/download-face-models.js
   ```

6. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
blockchain-voting-system/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and login
│   ├── api/               # API routes
│   │   ├── face/         # Face verification endpoints
│   │   ├── register/     # Voter registration
│   │   └── vote/         # Vote casting and verification
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard
│   ├── elections/        # Elections listing
│   ├── register/         # Voter registration
│   └── vote/             # Voting interface
├── components/           # React components
│   ├── face-recognition.tsx  # Face recognition component
│   ├── blockchain-status.tsx # Blockchain status widget
│   └── ui/              # UI components (Radix UI)
├── lib/                 # Utility libraries
│   ├── blockchain/      # Blockchain implementation
│   ├── face-recognition/ # Face recognition service
│   ├── supabase/        # Supabase client setup
│   └── voting/          # Voting service
├── scripts/             # SQL scripts and utilities
│   ├── 001_create_voting_tables.sql
│   ├── 006_complete_rls_fix.sql
│   └── download-face-models.js
├── public/              # Static assets
│   └── models/          # Face recognition models
└── README.md
```

## 🔑 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Database Schema

The system uses the following main tables:

### `voters`
- Stores voter information including face encodings
- Fields: `voter_id`, `aadhaar_number`, `full_name`, `email`, `face_encoding`, etc.

### `elections`
- Stores election information
- Fields: `id`, `title`, `description`, `election_type`, `start_date`, `end_date`

### `candidates`
- Stores candidate information
- Fields: `id`, `election_id`, `candidate_name`, `party_name`, `party_symbol`

### `votes`
- Stores vote records
- Fields: `id`, `voter_id`, `election_id`, `candidate_id`, `blockchain_hash`, `timestamp`

### `vote_verification`
- Stores face verification records
- Fields: `id`, `vote_id`, `voter_id`, `verification_status`, `similarity_score`

## 🎯 Usage

### Voter Registration
1. Navigate to `/register`
2. Fill in voter details (Voter ID, Aadhaar, Name, Email, etc.)
3. Allow webcam access
4. Capture your face using the webcam
5. Submit registration

### Voting
1. Login with Voter ID and Aadhaar number
2. Complete face verification
3. Select an election
4. Choose a candidate
5. Complete face verification again
6. Cast your vote
7. View blockchain transaction hash

### Admin Dashboard
1. Login as admin
2. Create elections
3. Add candidates
4. View results
5. Monitor blockchain status

## 🔌 API Endpoints

### Face Verification
- `POST /api/face/verify` - Verify face against stored data
  - Body: `FormData` with `image`, `voterID`, `storedFaceData`

### Voter Registration
- `POST /api/register` - Register a new voter
  - Body: `FormData` with voter details and face image

### Voting
- `POST /api/vote/cast` - Cast a vote
  - Body: `JSON` with `candidateId`, `electionId`, `faceVerificationData`

- `POST /api/vote/verify` - Verify a vote on blockchain
  - Body: `JSON` with `blockchainHash`

### Blockchain
- `GET /api/blockchain/stats` - Get blockchain statistics

## 🎨 Face Recognition

The system uses `face-api.js` for real-time face recognition:

- **Models**: Tiny Face Detector, Face Landmark 68, Face Recognition Net
- **Threshold**: 30% similarity for verification
- **Real-time Detection**: Automatic verification when face confidence ≥50%
- **Stable Frames**: Requires 3 consecutive stable detections

### Model Files
Face recognition models are stored in `public/models/`:
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-shard1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-shard1`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-shard1`
- `face_recognition_model-shard2`

## 🔒 Security

### Row-Level Security (RLS)
The database uses RLS policies to ensure:
- Voters can only view their own data
- Public registration is allowed
- Votes are immutable after casting

### Face Recognition Security
- Face encodings are stored as base64-encoded JSON
- Server-side verification against stored encodings
- Liveness detection to prevent spoofing
- Similarity threshold of 30% for verification

### Blockchain Security
- Cryptographic hashing of votes
- Immutable vote records
- Transaction verification
- Network status monitoring

## 🧪 Testing

### Test Voter Registration
1. Use valid Aadhaar number (12 digits)
2. Use valid email format
3. Ensure good lighting for face capture
4. Look directly at the camera

### Test Face Verification
1. Ensure models are loaded (check browser console)
2. Allow camera access
3. Ensure good lighting
4. Keep face centered in frame
5. Wait for auto-verification (3 stable frames)

## 🐛 Troubleshooting

### Face Recognition Not Working
- Check if models are loaded (browser console)
- Verify camera permissions
- Check lighting conditions
- Ensure face is clearly visible

### Database Errors
- Verify Supabase credentials in `.env.local`
- Check RLS policies are set correctly
- Verify database schema matches SQL scripts

### Build Errors
- Clear `.next` folder and rebuild
- Check Node.js version (18.x or higher)
- Verify all dependencies are installed

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend infrastructure
- [face-api.js](https://github.com/justadudewhohacks/face-api.js) - Face recognition library
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Advanced blockchain integration (Ethereum, Solana)
- [ ] Real-time result updates
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] SMS verification
- [ ] Biometric device support

---

Made with ❤️ using Next.js and Supabase

