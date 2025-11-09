-- Insert sample voters for testing face recognition
INSERT INTO public.voters (
  voter_id, 
  aadhaar_number, 
  full_name, 
  date_of_birth, 
  address, 
  phone_number, 
  email, 
  face_encoding, 
  is_verified, 
  is_active
) VALUES 
(
  'VTR001234567',
  '123456789012',
  'John Doe',
  '1990-05-15',
  '123 Main Street, New Delhi, 110001',
  '+91-9876543210',
  'john.doe@email.com',
  'face_desc_john_doe_unique_12345',
  true,
  true
),
(
  'VTR001234568',
  '123456789013',
  'Jane Smith',
  '1985-08-22',
  '456 Park Avenue, Mumbai, 400001',
  '+91-9876543211',
  'jane.smith@email.com',
  'face_desc_jane_smith_unique_67890',
  true,
  true
),
(
  'VTR001234569',
  '123456789014',
  'Raj Patel',
  '1992-12-10',
  '789 Gandhi Road, Ahmedabad, 380001',
  '+91-9876543212',
  'raj.patel@email.com',
  'face_desc_raj_patel_unique_11111',
  true,
  true
),
(
  'VTR001234570',
  '123456789015',
  'Priya Gupta',
  '1988-03-18',
  '321 MG Road, Bangalore, 560001',
  '+91-9876543213',
  'priya.gupta@email.com',
  'face_desc_priya_gupta_unique_22222',
  true,
  true
),
(
  'VTR001234571',
  '123456789016',
  'Arjun Singh',
  '1995-07-25',
  '654 Civil Lines, Lucknow, 226001',
  '+91-9876543214',
  'arjun.singh@email.com',
  'face_desc_arjun_singh_unique_33333',
  true,
  true
)
ON CONFLICT (voter_id) DO NOTHING;
