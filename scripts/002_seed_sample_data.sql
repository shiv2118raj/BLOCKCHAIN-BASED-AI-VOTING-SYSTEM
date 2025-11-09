-- Insert sample election
INSERT INTO public.elections (id, title, description, election_type, start_date, end_date, is_active)
VALUES (
  gen_random_uuid(),
  'Lok Sabha Elections 2024',
  'General Elections for the 18th Lok Sabha of India',
  'general',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '7 days',
  true
) ON CONFLICT DO NOTHING;

-- Get the election ID for sample candidates
DO $$
DECLARE
    election_uuid UUID;
BEGIN
    SELECT id INTO election_uuid FROM public.elections WHERE title = 'Lok Sabha Elections 2024' LIMIT 1;
    
    -- Insert sample candidates
    INSERT INTO public.candidates (election_id, candidate_name, party_name, party_symbol, manifesto) VALUES
    (election_uuid, 'Rajesh Kumar', 'Bharatiya Janata Party', '/placeholder.svg?height=100&width=100', 'Development and progress for all citizens'),
    (election_uuid, 'Priya Sharma', 'Indian National Congress', '/placeholder.svg?height=100&width=100', 'Social justice and inclusive growth'),
    (election_uuid, 'Amit Singh', 'Aam Aadmi Party', '/placeholder.svg?height=100&width=100', 'Clean governance and transparency'),
    (election_uuid, 'Sunita Devi', 'Bahujan Samaj Party', '/placeholder.svg?height=100&width=100', 'Empowerment of marginalized communities'),
    (election_uuid, 'Mohammed Ali', 'Samajwadi Party', '/placeholder.svg?height=100&width=100', 'Socialist policies and development')
    ON CONFLICT DO NOTHING;
END $$;

-- Insert sample admin user
INSERT INTO public.admin_users (email, full_name, role)
VALUES ('admin@voting.gov.in', 'Election Administrator', 'super_admin')
ON CONFLICT (email) DO NOTHING;
